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
    if version > 2 {
        return Err(Error::validation(
            "Banco de uma versão mais nova. Instale a versão compatível antes de continuar.",
        ));
    }
    if version == 0 {
        let tx = connection.transaction()?;
        tx.execute_batch(include_str!("../migrations/001_initial.sql"))?;
        tx.pragma_update(None, "user_version", 1)?;
        tx.commit()?;
    }
    if version < 2 {
        let tx = connection.transaction()?;
        tx.execute_batch(include_str!("../migrations/002_license.sql"))?;
        tx.pragma_update(None, "user_version", 2)?;
        tx.commit()?;
    }
    Ok(())
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
