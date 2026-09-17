use std::{
    fs,
    path::{Path, PathBuf},
    time::Duration,
};

use chrono::Utc;
use rusqlite::{params, Connection, OptionalExtension};
use serde::Serialize;
use sha2::{Digest, Sha256};
use uuid::Uuid;

const DATABASE_FILE: &str = "webfit-g4-spike.sqlite3";
const MIGRATIONS: &[(i64, &str)] = &[(1, include_str!("../migrations/0001_spike_foundation.sql"))];

pub type StorageResult<T> = Result<T, String>;

#[derive(Debug, Clone, Serialize, serde::Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    pub id: String,
    pub display_name: String,
    pub created_at_utc: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StorageStatus {
    pub database_file: String,
    pub migration_version: i64,
    pub foreign_keys_enabled: bool,
    pub patient_count: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupVerification {
    pub backup_file: String,
    pub restored_file: String,
    pub checksum_sha256: String,
    pub restored_checksum_sha256: String,
    pub integrity_check: String,
    pub patient_count: i64,
}

pub fn database_path(app_data_dir: &Path) -> PathBuf {
    app_data_dir.join(DATABASE_FILE)
}

pub fn initialize_database(path: &Path) -> StorageResult<()> {
    let mut connection = open_connection(path)?;
    run_migrations(&mut connection)
}

pub fn create_patient(path: &Path, display_name: String) -> StorageResult<Patient> {
    let display_name = display_name.trim().to_owned();
    if display_name.is_empty() || display_name.chars().count() > 200 {
        return Err("o nome fictício deve ter entre 1 e 200 caracteres".to_owned());
    }

    let mut connection = open_connection(path)?;
    run_migrations(&mut connection)?;

    let patient = Patient {
        id: Uuid::new_v4().to_string(),
        display_name,
        created_at_utc: Utc::now().to_rfc3339(),
    };

    let transaction = connection.transaction().map_err(storage_error)?;
    transaction
        .execute(
            "INSERT INTO patients (id, display_name, created_at_utc) VALUES (?1, ?2, ?3)",
            params![patient.id, patient.display_name, patient.created_at_utc],
        )
        .map_err(storage_error)?;
    transaction.commit().map_err(storage_error)?;

    Ok(patient)
}

pub fn list_patients(path: &Path) -> StorageResult<Vec<Patient>> {
    let mut connection = open_connection(path)?;
    run_migrations(&mut connection)?;
    let mut statement = connection
        .prepare(
            "SELECT id, display_name, created_at_utc
             FROM patients
             ORDER BY created_at_utc DESC, id DESC",
        )
        .map_err(storage_error)?;

    let rows = statement
        .query_map([], |row| {
            Ok(Patient {
                id: row.get(0)?,
                display_name: row.get(1)?,
                created_at_utc: row.get(2)?,
            })
        })
        .map_err(storage_error)?;

    rows.collect::<Result<Vec<_>, _>>().map_err(storage_error)
}

pub fn storage_status(path: &Path) -> StorageResult<StorageStatus> {
    let mut connection = open_connection(path)?;
    run_migrations(&mut connection)?;
    let migration_version = connection
        .query_row(
            "SELECT COALESCE(MAX(version), 0) FROM schema_migrations",
            [],
            |row| row.get(0),
        )
        .map_err(storage_error)?;
    let foreign_keys_enabled = connection
        .query_row("PRAGMA foreign_keys", [], |row| row.get::<_, i64>(0))
        .map_err(storage_error)?
        == 1;
    let patient_count = patient_count(&connection)?;

    Ok(StorageStatus {
        database_file: DATABASE_FILE.to_owned(),
        migration_version,
        foreign_keys_enabled,
        patient_count,
    })
}

pub fn backup_and_verify(path: &Path, backup_dir: &Path) -> StorageResult<BackupVerification> {
    fs::create_dir_all(backup_dir).map_err(io_error)?;
    let restore_dir = backup_dir.join("restore-verification");
    fs::create_dir_all(&restore_dir).map_err(io_error)?;

    let backup_name = format!("webfit-g4-{}.sqlite3", Uuid::new_v4());
    let restored_name = format!("restored-{backup_name}");
    let backup_path = backup_dir.join(&backup_name);
    let restored_path = restore_dir.join(&restored_name);

    let mut source = open_connection(path)?;
    run_migrations(&mut source)?;
    source
        .backup("main", &backup_path, None)
        .map_err(storage_error)?;

    let checksum_sha256 = checksum(&backup_path)?;
    fs::copy(&backup_path, &restored_path).map_err(io_error)?;
    let restored_checksum_sha256 = checksum(&restored_path)?;
    if checksum_sha256 != restored_checksum_sha256 {
        return Err("o checksum da cópia restaurada não corresponde ao snapshot".to_owned());
    }

    let restored = open_connection(&restored_path)?;
    let integrity_check = restored
        .query_row("PRAGMA integrity_check", [], |row| row.get::<_, String>(0))
        .map_err(storage_error)?;
    if integrity_check != "ok" {
        return Err("a verificação de integridade da restauração falhou".to_owned());
    }
    let restored_foreign_keys = restored
        .query_row("PRAGMA foreign_keys", [], |row| row.get::<_, i64>(0))
        .map_err(storage_error)?;
    if restored_foreign_keys != 1 {
        return Err("foreign keys não foram ativadas na conexão restaurada".to_owned());
    }

    Ok(BackupVerification {
        backup_file: backup_name,
        restored_file: restored_name,
        checksum_sha256,
        restored_checksum_sha256,
        integrity_check,
        patient_count: patient_count(&restored)?,
    })
}

fn open_connection(path: &Path) -> StorageResult<Connection> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(io_error)?;
    }
    let connection = Connection::open(path).map_err(storage_error)?;
    connection
        .pragma_update(None, "foreign_keys", "ON")
        .map_err(storage_error)?;
    connection
        .busy_timeout(Duration::from_secs(5))
        .map_err(storage_error)?;
    Ok(connection)
}

fn run_migrations(connection: &mut Connection) -> StorageResult<()> {
    connection
        .execute_batch(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY NOT NULL,
                checksum_sha256 TEXT NOT NULL,
                applied_at_utc TEXT NOT NULL
            ) STRICT;",
        )
        .map_err(storage_error)?;

    for (version, sql) in MIGRATIONS {
        let expected_checksum = checksum_bytes(sql.as_bytes());
        let applied_checksum = connection
            .query_row(
                "SELECT checksum_sha256 FROM schema_migrations WHERE version = ?1",
                [version],
                |row| row.get::<_, String>(0),
            )
            .optional()
            .map_err(storage_error)?;

        if let Some(applied_checksum) = applied_checksum {
            if applied_checksum != expected_checksum {
                return Err(format!("checksum divergente para a migração {version}"));
            }
            continue;
        }

        let transaction = connection.transaction().map_err(storage_error)?;
        transaction.execute_batch(sql).map_err(storage_error)?;
        transaction
            .execute(
                "INSERT INTO schema_migrations (version, checksum_sha256, applied_at_utc)
                 VALUES (?1, ?2, ?3)",
                params![version, expected_checksum, Utc::now().to_rfc3339()],
            )
            .map_err(storage_error)?;
        transaction.commit().map_err(storage_error)?;
    }

    Ok(())
}

fn patient_count(connection: &Connection) -> StorageResult<i64> {
    connection
        .query_row("SELECT COUNT(*) FROM patients", [], |row| row.get(0))
        .map_err(storage_error)
}

fn checksum(path: &Path) -> StorageResult<String> {
    let bytes = fs::read(path).map_err(io_error)?;
    Ok(checksum_bytes(&bytes))
}

fn checksum_bytes(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

fn storage_error(error: rusqlite::Error) -> String {
    format!("falha SQLite no spike: {error}")
}

fn io_error(error: std::io::Error) -> String {
    format!("falha de arquivo no spike: {error}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_database_is_migrated_with_foreign_keys() {
        let temp = tempfile::tempdir().unwrap();
        let path = temp.path().join("empty.sqlite3");

        initialize_database(&path).unwrap();
        let status = storage_status(&path).unwrap();

        assert_eq!(status.migration_version, 1);
        assert!(status.foreign_keys_enabled);

        let connection = open_connection(&path).unwrap();
        let result = connection.execute(
            "INSERT INTO patient_notes (id, patient_id, note) VALUES (?1, ?2, ?3)",
            params![Uuid::new_v4().to_string(), "missing-patient", "fictitious"],
        );
        assert!(result.is_err());
    }

    #[test]
    fn patient_persists_after_reopening() {
        let temp = tempfile::tempdir().unwrap();
        let path = temp.path().join("persistent.sqlite3");

        let created = create_patient(&path, "Paciente Fictício".to_owned()).unwrap();
        let listed = list_patients(&path).unwrap();

        assert_eq!(listed, vec![created]);
    }

    #[test]
    fn online_backup_restores_with_matching_checksum_and_integrity() {
        let temp = tempfile::tempdir().unwrap();
        let path = temp.path().join("source.sqlite3");
        create_patient(&path, "Paciente Backup".to_owned()).unwrap();

        let report = backup_and_verify(&path, &temp.path().join("backups")).unwrap();

        assert_eq!(report.checksum_sha256, report.restored_checksum_sha256);
        assert_eq!(report.integrity_check, "ok");
        assert_eq!(report.patient_count, 1);
    }

    #[test]
    fn unicode_path_supports_database_and_backup() {
        let temp = tempfile::tempdir().unwrap();
        let root = temp.path().join("Clínica São José");
        let path = root.join("dados").join("pacientes.sqlite3");
        let backup_dir = root.join("cópias de segurança");

        let patient = create_patient(&path, "Paciente Fictício".to_owned()).unwrap();
        let report = backup_and_verify(&path, &backup_dir).unwrap();

        assert_eq!(list_patients(&path).unwrap(), vec![patient]);
        assert_eq!(report.patient_count, 1);
        assert_eq!(report.integrity_check, "ok");
    }

    #[test]
    fn unusable_parent_path_returns_controlled_error() {
        let temp = tempfile::tempdir().unwrap();
        let blocker = temp.path().join("not-a-directory");
        fs::write(&blocker, b"blocker").unwrap();
        let path = blocker.join("database.sqlite3");

        let error = initialize_database(&path).unwrap_err();

        assert!(error.starts_with("falha de arquivo no spike:"));
    }

    #[test]
    fn sqlite_full_condition_is_reported_without_partial_write() {
        let temp = tempfile::tempdir().unwrap();
        let path = temp.path().join("limited.sqlite3");
        let connection = open_connection(&path).unwrap();
        connection
            .execute("CREATE TABLE payloads (value BLOB NOT NULL)", [])
            .unwrap();
        let current_pages: i64 = connection
            .query_row("PRAGMA page_count", [], |row| row.get(0))
            .unwrap();
        connection
            .pragma_update(None, "max_page_count", current_pages + 1)
            .unwrap();

        let result = connection.execute(
            "INSERT INTO payloads (value) VALUES (zeroblob(1048576))",
            [],
        );

        assert!(result.is_err());
        let count: i64 = connection
            .query_row("SELECT COUNT(*) FROM payloads", [], |row| row.get(0))
            .unwrap();
        assert_eq!(count, 0);
    }
    #[cfg(feature = "sqlcipher-spike")]
    #[test]
    fn sqlcipher_encrypts_database_and_rejects_wrong_key() {
        let temp = tempfile::tempdir().unwrap();
        let path = temp.path().join("encrypted.sqlite3");
        let key = random_test_key_hex();

        {
            let connection = Connection::open(&path).unwrap();
            apply_sqlcipher_key(&connection, &key).unwrap();
            let cipher_version: String = connection
                .query_row("PRAGMA cipher_version", [], |row| row.get(0))
                .unwrap();
            assert!(!cipher_version.is_empty());
            connection
                .execute("CREATE TABLE encrypted_probe (value TEXT NOT NULL)", [])
                .unwrap();
            connection
                .execute(
                    "INSERT INTO encrypted_probe (value) VALUES (?1)",
                    ["fictitious"],
                )
                .unwrap();
        }

        let bytes = fs::read(&path).unwrap();
        assert!(!bytes.starts_with(b"SQLite format 3\0"));

        let correct = Connection::open(&path).unwrap();
        apply_sqlcipher_key(&correct, &key).unwrap();
        let count: i64 = correct
            .query_row("SELECT COUNT(*) FROM encrypted_probe", [], |row| row.get(0))
            .unwrap();
        assert_eq!(count, 1);

        let backup_path = temp.path().join("encrypted-backup.sqlite3");
        let escaped_backup_path = backup_path.to_string_lossy().replace('\'', "''");
        correct
            .execute_batch(&format!(
                "ATTACH DATABASE '{escaped_backup_path}' AS encrypted_backup KEY \"x'{key}'\";                 SELECT sqlcipher_export('encrypted_backup');                 DETACH DATABASE encrypted_backup;"
            ))
            .unwrap();

        let backup_bytes = fs::read(&backup_path).unwrap();
        assert!(!backup_bytes.starts_with(b"SQLite format 3\0"));

        let restored_path = temp.path().join("restored-encrypted-backup.sqlite3");
        fs::copy(&backup_path, &restored_path).unwrap();
        assert_eq!(
            checksum(&backup_path).unwrap(),
            checksum(&restored_path).unwrap()
        );

        let restored = Connection::open(&restored_path).unwrap();
        apply_sqlcipher_key(&restored, &key).unwrap();
        let restored_count: i64 = restored
            .query_row("SELECT COUNT(*) FROM encrypted_probe", [], |row| row.get(0))
            .unwrap();
        assert_eq!(restored_count, 1);
        let integrity: String = restored
            .query_row("PRAGMA integrity_check", [], |row| row.get(0))
            .unwrap();
        assert_eq!(integrity, "ok");
        let wrong = Connection::open(&path).unwrap();
        apply_sqlcipher_key(&wrong, &random_test_key_hex()).unwrap();
        assert!(wrong
            .query_row("SELECT COUNT(*) FROM encrypted_probe", [], |row| {
                row.get::<_, i64>(0)
            })
            .is_err());
    }

    #[cfg(feature = "sqlcipher-spike")]
    fn random_test_key_hex() -> String {
        let mut key = [0_u8; 32];
        key[..16].copy_from_slice(Uuid::new_v4().as_bytes());
        key[16..].copy_from_slice(Uuid::new_v4().as_bytes());
        key.iter().map(|byte| format!("{byte:02x}")).collect()
    }

    #[cfg(feature = "sqlcipher-spike")]
    fn apply_sqlcipher_key(connection: &Connection, key: &str) -> rusqlite::Result<()> {
        connection.execute_batch(&format!("PRAGMA key = \"x'{key}'\";"))
    }
}
