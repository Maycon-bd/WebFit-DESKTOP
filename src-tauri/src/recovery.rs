use crate::{
    database, security,
    service::{audit, Service, User},
    Error, Result,
};
use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::path::{Path, PathBuf};
use uuid::Uuid;
use zeroize::Zeroizing;
pub fn encode(bytes: &[u8]) -> String {
    STANDARD.encode(bytes)
}
fn decode(value: &str) -> Result<Vec<u8>> {
    STANDARD
        .decode(value)
        .map_err(|_| Error::validation("Backup inválido."))
}
#[derive(Serialize, Deserialize)]
struct Envelope {
    version: u32,
    salt: String,
    nonce: String,
    ciphertext: String,
}
#[derive(Serialize, Deserialize)]
struct Snapshot {
    schema: u32,
    at: String,
    database: String,
    key: String,
    sha256: String,
}
struct TemporarySnapshot(PathBuf);
impl Drop for TemporarySnapshot {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.0);
    }
}
fn digest(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}
impl Service {
    pub fn daily_backup(&mut self) -> Result<()> {
        let date: String = self
            .db
            .query_row(
                "SELECT value FROM settings WHERE name='last_backup'",
                [],
                |r| r.get(0),
            )
            .unwrap_or_default();
        if !date.starts_with(&Utc::now().date_naive().to_string()) {
            let _ = self.create_backup(None, None);
        }
        Ok(())
    }
    pub fn backup_status(&self) -> Result<Value> {
        let at: String = self
            .db
            .query_row(
                "SELECT value FROM settings WHERE name='last_backup'",
                [],
                |r| r.get(0),
            )
            .unwrap_or_default();
        let failed: String = self
            .db
            .query_row(
                "SELECT value FROM settings WHERE name='backup_failure'",
                [],
                |r| r.get(0),
            )
            .unwrap_or_default();
        let stale = chrono::DateTime::parse_from_rfc3339(&at).map_or(true, |t| {
            Utc::now() - t.with_timezone(&Utc) > chrono::Duration::hours(24)
        });
        Ok(
            json!({"lastBackup":at,"stale":stale,"failed":!failed.is_empty(),"folder":self.root.join("backups").to_string_lossy()}),
        )
    }
    pub fn create_backup(&mut self, path: Option<PathBuf>, user: Option<&User>) -> Result<Value> {
        let result = self.backup_inner(path, user);
        if result.is_err() {
            let _=self.db.execute("INSERT INTO settings(name,value) VALUES('backup_failure','FAILED') ON CONFLICT(name) DO UPDATE SET value='FAILED'",[]);
        }
        result
    }
    fn backup_inner(&mut self, path: Option<PathBuf>, user: Option<&User>) -> Result<Value> {
        let folder = self.root.join("backups");
        std::fs::create_dir_all(&folder)?;
        let output =
            path.unwrap_or_else(|| folder.join(format!("{}.webfit-backup", Uuid::new_v4())));
        if output.extension().and_then(|s| s.to_str()) != Some("webfit-backup") || output.exists() {
            return Err(Error::validation("Escolha um novo arquivo .webfit-backup; backups existentes não serão sobrescritos."));
        }
        let snapshot_path = self.root.join(format!("{}.db", Uuid::new_v4()));
        let result = (|| -> Result<Value> {
            let mut destination = database::open(&snapshot_path, &self.key)?;
            rusqlite::backup::Backup::new(&self.db, &mut destination)?.run_to_completion(
                100,
                std::time::Duration::from_millis(10),
                None,
            )?;
            database::integrity(&destination)?;
            drop(destination);
            let data = std::fs::read(&snapshot_path)?;
            let salt: String = self.db.query_row(
                "SELECT value FROM settings WHERE name='recovery_salt'",
                [],
                |r| r.get(0),
            )?;
            let protected: String = self.db.query_row(
                "SELECT value FROM settings WHERE name='recovery_wrapped'",
                [],
                |r| r.get(0),
            )?;
            let wrapping = security::protect(&decode(&protected)?, true)?;
            let payload = Zeroizing::new(serde_json::to_vec(&Snapshot {
                schema: 1,
                at: Utc::now().to_rfc3339(),
                database: encode(&data),
                key: encode(&self.key),
                sha256: digest(&data),
            })?);
            let nonce = Uuid::new_v4().as_bytes()[..12].to_vec();
            let cipher = Aes256Gcm::new_from_slice(&wrapping).map_err(|_| Error::internal())?;
            let ciphertext = cipher
                .encrypt(Nonce::from_slice(&nonce), payload.as_slice())
                .map_err(|_| Error::internal())?;
            let package = serde_json::to_vec(&Envelope {
                version: 1,
                salt,
                nonce: encode(&nonce),
                ciphertext: encode(&ciphertext),
            })?;
            let temporary = output.with_extension(format!("{}.tmp", Uuid::new_v4()));
            std::fs::write(&temporary, &package)?;
            if std::fs::read(&temporary)? != package {
                let _ = std::fs::remove_file(&temporary);
                return Err(Error::internal());
            }
            std::fs::rename(&temporary, &output)?;
            let at = Utc::now().to_rfc3339();
            let tx = self.db.transaction()?;
            if user.is_some() {
                audit(&tx, user, "BACKUP_CREATE", "BACKUP", None, "SUCCESS")?;
            } else {
                tx.execute("INSERT INTO audit(id,actor_type,at,action,entity_type,result) VALUES(?1,'SYSTEM',?2,'BACKUP_CREATE','BACKUP','SUCCESS')",rusqlite::params![Uuid::new_v4().to_string(),Utc::now().to_rfc3339()])?;
            }
            tx.execute("INSERT INTO settings(name,value) VALUES('last_backup',?1) ON CONFLICT(name) DO UPDATE SET value=excluded.value",[&at])?;
            tx.execute("DELETE FROM settings WHERE name='backup_failure'", [])?;
            tx.commit()?;
            // Rotate only the managed folder after a new valid snapshot was published.
            for entry in std::fs::read_dir(&folder)?.flatten() {
                let item = entry.path();
                if item != output
                    && item.extension().and_then(|s| s.to_str()) == Some("webfit-backup")
                {
                    if let Ok(modified) = entry.metadata().and_then(|m| m.modified()) {
                        if modified
                            .elapsed()
                            .is_ok_and(|elapsed| elapsed.as_secs() > 60 * 86400)
                        {
                            let _ = std::fs::remove_file(item);
                        }
                    }
                }
            }
            Ok(json!({"path":output.to_string_lossy(),"at":at}))
        })();
        let _ = std::fs::remove_file(&snapshot_path);
        result
    }
    pub fn restore(&mut self, path: &Path, password: &str, user: &User) -> Result<Value> {
        if path.extension().and_then(|s| s.to_str()) != Some("webfit-backup")
            || std::fs::metadata(path)?.len() > 1024 * 1024 * 1024
        {
            return Err(Error::validation("Selecione um backup WebFit válido."));
        }
        let envelope: Envelope = serde_json::from_slice(&std::fs::read(path)?)?;
        if envelope.version != 1 {
            return Err(Error::validation("Versão de backup incompatível."));
        }
        let salt = decode(&envelope.salt)?;
        let nonce = decode(&envelope.nonce)?;
        if salt.len() != 16 || nonce.len() != 12 {
            return Err(Error::validation("Backup inválido."));
        }
        let wrapping = security::derive(password, &salt)?;
        let cipher = Aes256Gcm::new_from_slice(&wrapping).map_err(|_| Error::internal())?;
        let plain = Zeroizing::new(
            cipher
                .decrypt(
                    Nonce::from_slice(&nonce),
                    decode(&envelope.ciphertext)?.as_slice(),
                )
                .map_err(|_| {
                    Error::validation("Senha de recuperação incorreta ou backup corrompido.")
                })?,
        );
        let snapshot: Snapshot = serde_json::from_slice(&plain)?;
        if snapshot.schema != 1 {
            return Err(Error::validation("Schema de backup incompatível."));
        }
        let data = decode(&snapshot.database)?;
        if digest(&data) != snapshot.sha256 {
            return Err(Error::validation(
                "Checksum inválido. O estado atual foi preservado.",
            ));
        }
        let key = Zeroizing::new(decode(&snapshot.key)?);
        if key.len() != 32 {
            return Err(Error::validation("Chave de backup inválida."));
        }
        let stage = self.root.join(format!("{}.db", Uuid::new_v4()));
        std::fs::write(&stage, &data)?;
        let _cleanup = TemporarySnapshot(stage.clone());
        let validation = (|| -> Result<rusqlite::Connection> {
            let db = database::open(&stage, &key)?;
            database::integrity(&db)?;
            let schema: i64 = db.pragma_query_value(None, "user_version", |r| r.get(0))?;
            if schema != 1 {
                return Err(Error::validation("Backup incompatível."));
            }
            Ok(db)
        })();
        let restored = match validation {
            Ok(db) => db,
            Err(error) => {
                let _ = std::fs::remove_file(&stage);
                return Err(error);
            }
        };
        self.create_backup(None, Some(user))?;
        // Logical import keeps the installation key/DPAPI profile and atomically rolls back on error.
        let tx = self.db.transaction()?;
        tx.execute_batch("PRAGMA defer_foreign_keys=ON;")?;
        // Audit is append-only: restore clinical state, retaining both trails as unique events.
        tx.execute_batch("DELETE FROM patient_tags; DELETE FROM prescriptions; DELETE FROM drafts; DELETE FROM patients; DELETE FROM tags; UPDATE users SET active=0;")?;
        for table in [
            "users",
            "settings",
            "patients",
            "tags",
            "patient_tags",
            "prescriptions",
            "drafts",
            "audit",
        ] {
            let mut read = restored.prepare(&format!("SELECT * FROM {table}"))?;
            let cols = read.column_count();
            let mut rows = read.query([])?;
            let placeholders = (1..=cols)
                .map(|i| format!("?{i}"))
                .collect::<Vec<_>>()
                .join(",");
            while let Some(row) = rows.next()? {
                let values = (0..cols)
                    .map(|i| row.get::<_, rusqlite::types::Value>(i))
                    .collect::<std::result::Result<Vec<_>, _>>()?;
                let sql = if table == "users" {
                    format!("INSERT INTO users VALUES({placeholders}) ON CONFLICT(id) DO UPDATE SET name=excluded.name,role=excluded.role,password_hash=excluded.password_hash,must_change=excluded.must_change,profile=excluded.profile,active=excluded.active")
                } else if table == "settings" || table == "audit" {
                    format!("INSERT OR IGNORE INTO {table} VALUES({placeholders})")
                } else {
                    format!("INSERT INTO {table} VALUES({placeholders})")
                };
                tx.execute(&sql, rusqlite::params_from_iter(values))?;
            }
        }
        tx.execute("INSERT INTO settings(name,value) VALUES('recovery_salt',?1) ON CONFLICT(name) DO UPDATE SET value=excluded.value",[&envelope.salt])?;
        let actor_exists: bool = tx.query_row(
            "SELECT EXISTS(SELECT 1 FROM users WHERE id=?1)",
            [&user.id],
            |r| r.get(0),
        )?;
        audit(
            &tx,
            if actor_exists { Some(user) } else { None },
            "BACKUP_RESTORE",
            "BACKUP",
            None,
            "SUCCESS",
        )?;
        database::integrity(&tx)?;
        // Credential and clinical state commit together; interrupted restore rolls back both.
        tx.execute("INSERT INTO settings(name,value) VALUES('recovery_wrapped',?1) ON CONFLICT(name) DO UPDATE SET value=excluded.value",[encode(&security::protect(&wrapping,false)?)])?;
        tx.commit()?;
        drop(restored);
        let _ = std::fs::remove_file(&stage);
        self.lock();
        Ok(json!({"restored":true}))
    }
}
