use crate::{Error, Result};
use rusqlite::Connection;
use std::path::Path;

pub fn open(path: &Path, key: &[u8]) -> Result<Connection> {
    let connection = Connection::open(path)?;
    let hex: String = key.iter().map(|b| format!("{b:02x}")).collect();
    connection.pragma_update(None, "key", format!("x'{hex}'"))?;
    connection.pragma_update(None, "foreign_keys", "ON")?;
    connection.busy_timeout(std::time::Duration::from_secs(5))?;
    connection.query_row("SELECT count(*) FROM sqlite_master", [], |row| {
        row.get::<_, i64>(0)
    })?;
    Ok(connection)
}
pub fn migrate(connection: &mut Connection) -> Result<()> {
    let version: i64 = connection.pragma_query_value(None, "user_version", |row| row.get(0))?;
    if version > 3 {
        return Err(Error::validation(
            "Banco de uma versão mais nova. Instale a versão compatível antes de continuar.",
        ));
    }
    if version == 3 {
        return Ok(());
    }
    // Migration copies of clinical relationships must remain in memory.
    connection.pragma_update(None, "temp_store", "MEMORY")?;
    let tx = connection.transaction()?;
    if version == 0 {
        tx.execute_batch(include_str!("../migrations/001_initial.sql"))?;
        tx.pragma_update(None, "user_version", 1)?;
    }
    if version < 2 {
        tx.execute_batch(include_str!("../migrations/002_license.sql"))?;
        tx.pragma_update(None, "user_version", 2)?;
    }
    if version < 3 {
        tx.execute_batch(include_str!("../migrations/003_optional_patient_cpf.sql"))?;
        integrity(&tx)?;
        tx.pragma_update(None, "user_version", 3)?;
    }
    tx.commit()?;
    Ok(())
}
/// A local migration safety copy, encrypted with the existing DPAPI-protected
/// key. It is not a portable .webfit-backup and is never made by copying a live DB.
pub fn migrate_installed(connection: &mut Connection, root: &Path, key: &[u8]) -> Result<()> {
    let version: i64 = connection.pragma_query_value(None, "user_version", |r| r.get(0))?;
    if (1..=2).contains(&version) {
        let folder = root.join("migration-snapshots");
        std::fs::create_dir_all(&folder)?;
        let path = folder.join(format!("{}.db", uuid::Uuid::new_v4()));
        let result = (|| -> Result<()> {
            let mut snapshot = open(&path, key)?;
            rusqlite::backup::Backup::new(connection, &mut snapshot)?.run_to_completion(
                100,
                std::time::Duration::from_millis(10),
                None,
            )?;
            integrity(&snapshot)?;
            drop(snapshot);
            let reopened = open(&path, key)?;
            integrity(&reopened)?;
            let saved: i64 = reopened.pragma_query_value(None, "user_version", |r| r.get(0))?;
            if saved != version {
                return Err(Error::validation("Snapshot de migração incompatível."));
            }
            Ok(())
        })();
        if let Err(error) = result {
            let _ = std::fs::remove_file(&path);
            return Err(error);
        }
    }
    migrate(connection)
}
pub fn integrity(connection: &Connection) -> Result<()> {
    let result: String = connection.query_row("PRAGMA integrity_check", [], |row| row.get(0))?;
    if result != "ok" {
        return Err(Error::validation(
            "A verificação de integridade falhou. O banco atual foi preservado.",
        ));
    }
    let violations: i64 =
        connection.query_row("SELECT count(*) FROM pragma_foreign_key_check", [], |row| {
            row.get(0)
        })?;
    if violations != 0 {
        return Err(Error::validation("Backup com referências inválidas."));
    }
    Ok(())
}
