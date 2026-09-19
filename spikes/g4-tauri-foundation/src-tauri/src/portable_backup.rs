use std::{
    fs,
    path::{Path, PathBuf},
};

use chrono::Utc;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct PortableBackupManifest {
    format_version: u32,
    package_id: String,
    created_at_utc: String,
    encrypted_database: String,
    encrypted_key_envelope: String,
    database_sha256: String,
}

#[derive(Debug, PartialEq, Eq)]
struct RestoreReport {
    package_id: String,
    patient_count: i64,
    integrity_check: String,
    audit_log: PathBuf,
}

#[test]
fn portable_backup_round_trips_through_simulated_cloud_and_audits_recovery() {
    let temp = tempfile::tempdir().unwrap();
    let source_path = temp.path().join("source-installation.sqlite3");
    let source_key = random_key_hex();
    let admin_credential = "fictitious-admin-recovery-credential";
    let patient_name = "Paciente Fictício";

    create_encrypted_fixture(&source_path, &source_key, patient_name).unwrap();

    let package_dir = temp.path().join("portable-package");
    let manifest =
        create_portable_package(&source_path, &source_key, &package_dir, admin_credential).unwrap();

    assert_eq!(manifest.format_version, 1);
    assert!(!manifest.database_sha256.is_empty());
    let manifest_text = fs::read_to_string(package_dir.join("manifest.json")).unwrap();
    assert!(!manifest_text.contains(&source_key));
    assert!(!manifest_text.contains(admin_credential));

    let cloud_dir = temp.path().join("simulated-cloud");
    simulate_cloud_upload(&package_dir, &cloud_dir).unwrap();

    let restored_installation = temp.path().join("restored-installation");
    let success = restore_portable_package(
        &cloud_dir,
        &restored_installation,
        "spike-admin",
        admin_credential,
    )
    .unwrap();

    assert_eq!(
        success,
        RestoreReport {
            package_id: manifest.package_id.clone(),
            patient_count: 1,
            integrity_check: "ok".to_owned(),
            audit_log: restored_installation.join("recovery-audit.jsonl"),
        }
    );

    let audit = fs::read_to_string(&success.audit_log).unwrap();
    assert!(audit.contains("\"outcome\":\"SUCCESS\""));
    assert!(audit.contains("\"action\":\"PORTABLE_BACKUP_RESTORE\""));
    assert!(audit.contains(&manifest.package_id));
    assert!(!audit.contains(&source_key));
    assert!(!audit.contains(admin_credential));
    assert!(!audit.contains(patient_name));

    let denied_installation = temp.path().join("denied-installation");
    let denied = restore_portable_package(
        &cloud_dir,
        &denied_installation,
        "spike-admin",
        "wrong-fictitious-credential",
    );
    assert!(denied.is_err());
    let denied_audit =
        fs::read_to_string(denied_installation.join("recovery-audit.jsonl")).unwrap();
    assert!(denied_audit.contains("\"outcome\":\"DENIED\""));
    assert!(!denied_audit.contains("wrong-fictitious-credential"));
}

fn create_encrypted_fixture(path: &Path, key: &str, patient_name: &str) -> Result<(), String> {
    let connection = Connection::open(path).map_err(storage_error)?;
    apply_sqlcipher_raw_key(&connection, key).map_err(storage_error)?;
    connection
        .execute_batch(
            "CREATE TABLE patients (
                id TEXT PRIMARY KEY NOT NULL,
                display_name TEXT NOT NULL,
                created_at_utc TEXT NOT NULL
            ) STRICT;",
        )
        .map_err(storage_error)?;
    connection
        .execute(
            "INSERT INTO patients (id, display_name, created_at_utc)
             VALUES (?1, ?2, ?3)",
            params![
                Uuid::new_v4().to_string(),
                patient_name,
                Utc::now().to_rfc3339()
            ],
        )
        .map_err(storage_error)?;
    Ok(())
}

fn create_portable_package(
    source_path: &Path,
    source_key: &str,
    package_dir: &Path,
    admin_credential: &str,
) -> Result<PortableBackupManifest, String> {
    if admin_credential.trim().is_empty() {
        return Err("a credencial administrativa do spike não pode ser vazia".to_owned());
    }

    fs::create_dir_all(package_dir).map_err(io_error)?;
    let database_name = "encrypted-database.sqlite3";
    let envelope_name = "encrypted-key-envelope.sqlite3";
    let database_path = package_dir.join(database_name);
    let envelope_path = package_dir.join(envelope_name);

    let source = Connection::open(source_path).map_err(storage_error)?;
    apply_sqlcipher_raw_key(&source, source_key).map_err(storage_error)?;
    let escaped_path = database_path.to_string_lossy().replace('\'', "''");
    source
        .execute_batch(&format!(
            "ATTACH DATABASE '{escaped_path}' AS portable_backup KEY \"x'{source_key}'\";
             SELECT sqlcipher_export('portable_backup');
             DETACH DATABASE portable_backup;"
        ))
        .map_err(storage_error)?;

    let envelope = Connection::open(&envelope_path).map_err(storage_error)?;
    apply_sqlcipher_password(&envelope, admin_credential).map_err(storage_error)?;
    envelope
        .execute_batch(
            "CREATE TABLE key_envelope (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                database_key_hex TEXT NOT NULL
            ) STRICT;",
        )
        .map_err(storage_error)?;
    envelope
        .execute(
            "INSERT INTO key_envelope (id, database_key_hex) VALUES (1, ?1)",
            [source_key],
        )
        .map_err(storage_error)?;

    let manifest = PortableBackupManifest {
        format_version: 1,
        package_id: Uuid::new_v4().to_string(),
        created_at_utc: Utc::now().to_rfc3339(),
        encrypted_database: database_name.to_owned(),
        encrypted_key_envelope: envelope_name.to_owned(),
        database_sha256: checksum(&database_path)?,
    };
    let manifest_json = serde_json::to_vec_pretty(&manifest).map_err(json_error)?;
    fs::write(package_dir.join("manifest.json"), manifest_json).map_err(io_error)?;
    Ok(manifest)
}

fn simulate_cloud_upload(package_dir: &Path, cloud_dir: &Path) -> Result<(), String> {
    fs::create_dir_all(cloud_dir).map_err(io_error)?;
    for name in [
        "manifest.json",
        "encrypted-database.sqlite3",
        "encrypted-key-envelope.sqlite3",
    ] {
        fs::copy(package_dir.join(name), cloud_dir.join(name)).map_err(io_error)?;
    }
    Ok(())
}

fn restore_portable_package(
    cloud_dir: &Path,
    installation_dir: &Path,
    actor_id: &str,
    admin_credential: &str,
) -> Result<RestoreReport, String> {
    fs::create_dir_all(installation_dir).map_err(io_error)?;
    let manifest_path = cloud_dir.join("manifest.json");
    let manifest: PortableBackupManifest =
        serde_json::from_slice(&fs::read(&manifest_path).map_err(io_error)?).map_err(json_error)?;
    let database_source = cloud_dir.join(&manifest.encrypted_database);
    let envelope_source = cloud_dir.join(&manifest.encrypted_key_envelope);
    let database_path = installation_dir.join(&manifest.encrypted_database);
    let envelope_path = installation_dir.join(&manifest.encrypted_key_envelope);
    let audit_path = installation_dir.join("recovery-audit.jsonl");

    if checksum(&database_source)? != manifest.database_sha256 {
        append_audit(
            &audit_path,
            actor_id,
            &manifest.package_id,
            "DENIED",
            "CHECKSUM_MISMATCH",
        )?;
        return Err("checksum do banco no pacote não confere".to_owned());
    }

    fs::copy(&database_source, &database_path).map_err(io_error)?;
    fs::copy(&envelope_source, &envelope_path).map_err(io_error)?;

    let envelope = Connection::open(&envelope_path).map_err(storage_error)?;
    apply_sqlcipher_password(&envelope, admin_credential).map_err(storage_error)?;
    let database_key = match envelope.query_row(
        "SELECT database_key_hex FROM key_envelope WHERE id = 1",
        [],
        |row| row.get::<_, String>(0),
    ) {
        Ok(key) => key,
        Err(error) => {
            append_audit(
                &audit_path,
                actor_id,
                &manifest.package_id,
                "DENIED",
                "ADMIN_CREDENTIAL_REJECTED",
            )?;
            return Err(storage_error(error));
        }
    };

    let restored = Connection::open(&database_path).map_err(storage_error)?;
    apply_sqlcipher_raw_key(&restored, &database_key).map_err(storage_error)?;
    let integrity_check: String = restored
        .query_row("PRAGMA integrity_check", [], |row| row.get(0))
        .map_err(storage_error)?;
    if integrity_check != "ok" {
        append_audit(
            &audit_path,
            actor_id,
            &manifest.package_id,
            "DENIED",
            "INTEGRITY_CHECK_FAILED",
        )?;
        return Err("a integridade do banco restaurado falhou".to_owned());
    }
    let patient_count: i64 = restored
        .query_row("SELECT COUNT(*) FROM patients", [], |row| row.get(0))
        .map_err(storage_error)?;

    append_audit(
        &audit_path,
        actor_id,
        &manifest.package_id,
        "SUCCESS",
        "PORTABLE_BACKUP_RESTORE",
    )?;

    Ok(RestoreReport {
        package_id: manifest.package_id,
        patient_count,
        integrity_check,
        audit_log: audit_path,
    })
}

fn append_audit(
    path: &Path,
    actor_id: &str,
    package_id: &str,
    outcome: &str,
    action: &str,
) -> Result<(), String> {
    let entry = serde_json::json!({
        "occurredAtUtc": Utc::now().to_rfc3339(),
        "actorId": actor_id,
        "action": action,
        "outcome": outcome,
        "packageId": package_id,
    });
    let mut line = serde_json::to_string(&entry).map_err(json_error)?;
    line.push('\n');
    use std::io::Write;
    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(io_error)?;
    file.write_all(line.as_bytes()).map_err(io_error)
}

fn apply_sqlcipher_password(connection: &Connection, password: &str) -> rusqlite::Result<()> {
    connection.execute_batch(&format!("PRAGMA key = '{}';", password.replace('\'', "''")))
}

fn apply_sqlcipher_raw_key(connection: &Connection, key_hex: &str) -> rusqlite::Result<()> {
    connection.execute_batch(&format!("PRAGMA key = \"x'{key_hex}'\";"))
}

fn random_key_hex() -> String {
    let mut key = [0_u8; 32];
    key[..16].copy_from_slice(Uuid::new_v4().as_bytes());
    key[16..].copy_from_slice(Uuid::new_v4().as_bytes());
    key.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn checksum(path: &Path) -> Result<String, String> {
    let bytes = fs::read(path).map_err(io_error)?;
    Ok(Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect())
}

fn storage_error(error: rusqlite::Error) -> String {
    format!("falha SQLite no spike: {error}")
}

fn io_error(error: std::io::Error) -> String {
    format!("falha de arquivo no spike: {error}")
}

fn json_error(error: serde_json::Error) -> String {
    format!("falha JSON no spike: {error}")
}
