use crate::{security, Error, Result};
use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use rusqlite::{params, OptionalExtension};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    io::Write,
    path::{Path, PathBuf},
};
use webfit_license_protocol::{self as protocol, Request};
use zeroize::{Zeroize, Zeroizing};

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "snake_case", deny_unknown_fields)]
pub enum Action {
    Status,
    Initialize {
        confirmed: bool,
    },
    ReadRequest {
        path: String,
    },
    Password,
    IssueInitialCode {
        login: String,
        password: String,
        path: String,
        confirmed: bool,
    },
    Issue {
        request: Request,
        login: String,
        password: String,
        path: String,
    },
    ExportTrust {
        path: String,
    },
    ExportBackup {
        path: String,
        password: String,
    },
    ImportBackup {
        path: String,
        password: String,
        confirmed: bool,
    },
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn initial_without_request_emits_separate_code_and_preserves_vault_on_failure() {
        let temp = tempfile::tempdir().unwrap();
        let mut vault = Vault::open(temp.path().join("vault")).unwrap();
        vault
            .execute(Action::Initialize { confirmed: true })
            .unwrap();
        let path = temp.path().join("initial.webfit-license");
        let issue = |confirmed| Action::IssueInitialCode {
            login: "admin".into(),
            password: "fictional-initial-password".into(),
            path: path.to_string_lossy().into(),
            confirmed,
        };
        assert!(vault.execute(issue(false)).is_err());
        assert!(!path.exists());
        let value = vault.execute(issue(true)).unwrap();
        let bytes = std::fs::read(&path).unwrap();
        let text = String::from_utf8_lossy(&bytes);
        assert!(!text.contains("fictional-initial-password"));
        let code = value["code"].as_str().unwrap();
        assert!(!text.contains(code));
        let public: [u8; 32] = protocol::decode(
            vault.execute(Action::Status).unwrap()["publicKey"]
                .as_str()
                .unwrap(),
        )
        .unwrap()
        .try_into()
        .unwrap();
        assert!(protocol::verify_initial_code(&bytes, &[public], code).is_ok());
        assert!(vault.execute(issue(true)).is_err());
        assert_eq!(vault.execute(Action::Status).unwrap()["issued"], 1);
        assert_eq!(std::fs::read(&path).unwrap(), bytes);
    }
    #[test]
    fn encrypted_vault_backup_recovers_identity_and_rejects_tampering() {
        let temp = tempfile::tempdir().unwrap();
        let mut a = Vault::open(temp.path().join("a")).unwrap();
        assert!(a.execute(Action::Initialize { confirmed: false }).is_err());
        a.execute(Action::Initialize { confirmed: true }).unwrap();
        let identity = a.execute(Action::Status).unwrap()["publicKey"].clone();
        let path = temp.path().join("fixture.webfit-issuer-backup");
        a.execute(Action::ExportBackup {
            path: path.to_string_lossy().into(),
            password: "fictional-recovery-password".into(),
        })
        .unwrap();
        let mut b = Vault::open(temp.path().join("b")).unwrap();
        assert!(b
            .execute(Action::ImportBackup {
                path: path.to_string_lossy().into(),
                password: "wrong".into(),
                confirmed: true
            })
            .is_err());
        assert_eq!(b.execute(Action::Status).unwrap()["initialized"], false);
        b.execute(Action::ImportBackup {
            path: path.to_string_lossy().into(),
            password: "fictional-recovery-password".into(),
            confirmed: true,
        })
        .unwrap();
        assert_eq!(b.execute(Action::Status).unwrap()["publicKey"], identity);
        assert!(b.execute(Action::Initialize { confirmed: true }).is_err());
        let mut envelope: Backup = serde_json::from_slice(&std::fs::read(&path).unwrap()).unwrap();
        envelope.ciphertext = protocol::encode(&[0; 64]);
        let bad = temp.path().join("bad.webfit-issuer-backup");
        std::fs::write(&bad, serde_json::to_vec(&envelope).unwrap()).unwrap();
        assert!(b
            .execute(Action::ImportBackup {
                path: bad.to_string_lossy().into(),
                password: "fictional-recovery-password".into(),
                confirmed: true
            })
            .is_err());
        assert_eq!(b.execute(Action::Status).unwrap()["publicKey"], identity);
    }
    #[test]
    fn issuance_is_bound_single_per_request_and_artifact_contains_no_password() {
        let temp = tempfile::tempdir().unwrap();
        let mut vault = Vault::open(temp.path().join("vault")).unwrap();
        vault
            .execute(Action::Initialize { confirmed: true })
            .unwrap();
        let secret = protocol::recipient_secret();
        let request = protocol::request(
            uuid::Uuid::new_v4(),
            &secret,
            protocol::Kind::Initial,
            None,
            None,
        );
        let path = temp.path().join("fixture.webfit-license");
        let password = "fictional-issued-password";
        vault
            .execute(Action::Issue {
                request: request.clone(),
                login: "admin".into(),
                password: password.into(),
                path: path.to_string_lossy().into(),
            })
            .unwrap();
        let bytes = std::fs::read(&path).unwrap();
        assert!(!String::from_utf8_lossy(&bytes).contains(password));
        assert!(vault
            .execute(Action::Issue {
                request: request.clone(),
                login: "admin".into(),
                password: password.into(),
                path: temp
                    .path()
                    .join("second.webfit-license")
                    .to_string_lossy()
                    .into()
            })
            .is_err());
        let status = vault.execute(Action::Status).unwrap();
        let public: [u8; 32] = protocol::decode(status["publicKey"].as_str().unwrap())
            .unwrap()
            .try_into()
            .unwrap();
        assert!(protocol::verify(&bytes, &[public], &secret, &request).is_ok());
    }
}
#[derive(Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct Backup {
    version: u8,
    salt: String,
    nonce: String,
    ciphertext: String,
}
#[derive(Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct Contents {
    seed: String,
    issued: Vec<(String, String, String)>,
}
impl Drop for Contents {
    fn drop(&mut self) {
        self.seed.zeroize();
    }
}
pub struct Vault {
    db: rusqlite::Connection,
    root: PathBuf,
}
fn validate(message: &str) -> Error {
    Error::validation(message)
}
fn write_new(path: &Path, bytes: &[u8], extension: &str) -> Result<()> {
    if path.extension().and_then(|v| v.to_str()) != Some(extension) {
        return Err(validate("Extensão de arquivo incompatível."));
    }
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)?;
    if file.write_all(bytes).and_then(|_| file.sync_all()).is_err() {
        drop(file);
        let _ = std::fs::remove_file(path);
        return Err(Error::internal());
    }
    Ok(())
}
impl Vault {
    pub fn open(root: PathBuf) -> Result<Self> {
        std::fs::create_dir_all(&root)?;
        let path = root.join("issuer.key.dpapi");
        let key = if path.exists() {
            security::protect(&std::fs::read(path)?, true)?
        } else {
            if root.join("issuer.db").exists() {
                return Err(validate("Recupere o cofre em um novo destino."));
            }
            let key = security::random_key();
            std::fs::write(path, security::protect(&key, false)?.as_slice())?;
            key
        };
        let mut db = rusqlite::Connection::open(root.join("issuer.db"))?;
        let hex = key.iter().map(|b| format!("{b:02x}")).collect::<String>();
        db.pragma_update(None, "key", format!("x'{hex}'"))?;
        db.pragma_update(None, "foreign_keys", "ON")?;
        let version: i64 = db.pragma_query_value(None, "user_version", |r| r.get(0))?;
        if version > 1 {
            return Err(validate(
                "Cofre de versão futura. Use um emissor compatível.",
            ));
        }
        if version == 0 {
            let tx = db.transaction()?;
            tx.execute_batch(include_str!("../migrations/001_initial.sql"))?;
            tx.pragma_update(None, "user_version", 1)?;
            tx.commit()?;
        }
        Ok(Self { db, root })
    }
    fn contents(&self) -> Result<Contents> {
        let seed: String = self
            .db
            .query_row("SELECT seed FROM identity WHERE id=1", [], |r| r.get(0))?;
        let mut st = self
            .db
            .prepare("SELECT id,request_id,kind FROM issued ORDER BY rowid")?;
        let issued = st
            .query_map([], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)))?
            .collect::<std::result::Result<Vec<_>, _>>()?;
        Ok(Contents { seed, issued })
    }
    fn seal_backup(&self, password: &str) -> Result<Vec<u8>> {
        if password.chars().count() < 12 || password.len() > 1024 {
            return Err(validate(
                "Use uma senha de recuperação entre 12 e 1024 caracteres.",
            ));
        }
        let salt = security::random_key()[..16].to_vec();
        let nonce = security::random_key()[..12].to_vec();
        let key = security::derive(password, &salt)?;
        let cipher = Aes256Gcm::new_from_slice(&key).map_err(|_| Error::internal())?;
        let clear = Zeroizing::new(serde_json::to_vec(&self.contents()?)?);
        let ciphertext = cipher
            .encrypt(Nonce::from_slice(&nonce), clear.as_slice())
            .map_err(|_| Error::internal())?;
        Ok(serde_json::to_vec(&Backup {
            version: 1,
            salt: protocol::encode(&salt),
            nonce: protocol::encode(&nonce),
            ciphertext: protocol::encode(&ciphertext),
        })?)
    }
    pub fn execute(&mut self, action: Action) -> Result<Value> {
        match action {
            Action::Status => {
                let seed: Option<String> = self
                    .db
                    .query_row("SELECT seed FROM identity WHERE id=1", [], |r| r.get(0))
                    .optional()?;
                let public = seed
                    .map(|s| {
                        protocol::decode(&s)
                            .map_err(validate)
                            .and_then(|v| protocol::signing_key_from_bytes(&v).map_err(validate))
                            .map(|k| protocol::encode(k.verifying_key().as_bytes()))
                    })
                    .transpose()?;
                Ok(
                    json!({"initialized":public.is_some(),"publicKey":public,"issued":self.db.query_row("SELECT count(*) FROM issued",[],|r|r.get::<_,i64>(0))?}),
                )
            }
            Action::Initialize { confirmed } => {
                if !confirmed {
                    return Err(validate(
                        "Confirme a criação da identidade exclusiva do emissor.",
                    ));
                }
                let key = protocol::signing_key();
                self.db.execute(
                    "INSERT INTO identity(id,seed) VALUES(1,?1)",
                    [protocol::encode(&key.to_bytes())],
                )?;
                Ok(json!({"created":true}))
            }
            Action::ReadRequest { path } => {
                let path = Path::new(&path);
                if path.extension().and_then(|v| v.to_str()) != Some("webfit-request")
                    || std::fs::metadata(path)?.len() > protocol::MAX_FILE as u64
                {
                    return Err(validate("Selecione uma solicitação WebFit de até 64 KiB."));
                }
                let request: Request = protocol::parse(&std::fs::read(path)?).map_err(validate)?;
                protocol::validate_request(&request).map_err(validate)?;
                Ok(
                    json!({"fingerprint":protocol::fingerprint(&protocol::decode(&request.recipient).map_err(validate)?),"request":request}),
                )
            }
            Action::Password => Ok(json!({"password":protocol::random_password().as_str()})),
            Action::IssueInitialCode {
                login,
                password,
                path,
                confirmed,
            } => {
                if !confirmed {
                    return Err(validate(
                        "Confirme a emissão inicial e o limite de reutilização offline.",
                    ));
                }
                let seed =
                    Zeroizing::new(protocol::decode(&self.contents()?.seed).map_err(validate)?);
                let key = protocol::signing_key_from_bytes(&seed).map_err(validate)?;
                let password = Zeroizing::new(password);
                let credential = protocol::credential(&login, &password).map_err(validate)?;
                let (envelope, code) =
                    protocol::issue_initial_code(&key, credential).map_err(validate)?;
                let tx = self.db.transaction()?;
                tx.execute(
                    "INSERT INTO issued(id,request_id,kind) VALUES(?1,?2,'INITIAL')",
                    params![
                        envelope.id.to_string(),
                        envelope.request.request_id.to_string()
                    ],
                )?;
                write_new(
                    Path::new(&path),
                    &serde_json::to_vec(&envelope)?,
                    "webfit-license",
                )?;
                if tx.commit().is_err() {
                    let _ = std::fs::remove_file(&path);
                    return Err(Error::internal());
                }
                Ok(json!({"issued":true,"id":envelope.id,"code":code.as_str()}))
            }
            Action::Issue {
                request,
                login,
                password,
                path,
            } => {
                let seed =
                    Zeroizing::new(protocol::decode(&self.contents()?.seed).map_err(validate)?);
                let key = protocol::signing_key_from_bytes(&seed).map_err(validate)?;
                let password = Zeroizing::new(password);
                let credential = if request.kind.credential() {
                    Some(protocol::credential(&login, &password).map_err(validate)?)
                } else {
                    None
                };
                let envelope =
                    protocol::issue(request.clone(), &key, credential).map_err(validate)?;
                let tx = self.db.transaction()?;
                tx.execute(
                    "INSERT INTO issued(id,request_id,kind) VALUES(?1,?2,?3)",
                    params![
                        envelope.id.to_string(),
                        request.request_id.to_string(),
                        request.kind.name()
                    ],
                )?;
                write_new(
                    Path::new(&path),
                    &serde_json::to_vec(&envelope)?,
                    "webfit-license",
                )?;
                if tx.commit().is_err() {
                    let _ = std::fs::remove_file(&path);
                    return Err(Error::internal());
                }
                Ok(json!({"issued":true,"id":envelope.id}))
            }
            Action::ExportTrust { path } => {
                let seed =
                    Zeroizing::new(protocol::decode(&self.contents()?.seed).map_err(validate)?);
                let key = protocol::signing_key_from_bytes(&seed).map_err(validate)?;
                write_new(
                    Path::new(&path),
                    &serde_json::to_vec_pretty(&vec![protocol::encode(
                        key.verifying_key().as_bytes(),
                    )])?,
                    "json",
                )?;
                Ok(json!({"saved":true}))
            }
            Action::ExportBackup { path, password } => {
                let password = Zeroizing::new(password);
                write_new(
                    Path::new(&path),
                    &self.seal_backup(&password)?,
                    "webfit-issuer-backup",
                )?;
                Ok(json!({"saved":true}))
            }
            Action::ImportBackup {
                path,
                password,
                confirmed,
            } => {
                if !confirmed {
                    return Err(validate("Confirme a recuperação do cofre."));
                }
                if Path::new(&path).extension().and_then(|v| v.to_str())
                    != Some("webfit-issuer-backup")
                    || std::fs::metadata(&path)?.len() > 8 * 1024 * 1024
                {
                    return Err(validate("Backup de emissor inválido ou excessivo."));
                }
                if password.len() > 1024 {
                    return Err(validate("Senha inválida."));
                }
                let password = Zeroizing::new(password);
                let bytes = std::fs::read(&path)?;
                let envelope: Backup = serde_json::from_slice(&bytes)?;
                let salt = protocol::decode(&envelope.salt).map_err(validate)?;
                let nonce = protocol::decode(&envelope.nonce).map_err(validate)?;
                if envelope.version != 1 || salt.len() != 16 || nonce.len() != 12 {
                    return Err(validate("Formato de backup incompatível."));
                }
                let key = security::derive(&password, &salt)?;
                let cipher = Aes256Gcm::new_from_slice(&key).map_err(|_| Error::internal())?;
                let clear = Zeroizing::new(
                    cipher
                        .decrypt(
                            Nonce::from_slice(&nonce),
                            STANDARD
                                .decode(&envelope.ciphertext)
                                .map_err(|_| validate("Backup inválido."))?
                                .as_slice(),
                        )
                        .map_err(|_| validate("Senha incorreta ou backup corrompido."))?,
                );
                let mut contents: Contents = serde_json::from_slice(&clear)?;
                protocol::signing_key_from_bytes(
                    &protocol::decode(&contents.seed).map_err(validate)?,
                )
                .map_err(validate)?;
                if self
                    .db
                    .query_row("SELECT EXISTS(SELECT 1 FROM identity)", [], |r| {
                        r.get::<_, bool>(0)
                    })?
                {
                    write_new(
                        &self
                            .root
                            .join(format!("{}.webfit-issuer-backup", uuid::Uuid::new_v4())),
                        &self.seal_backup(&password)?,
                        "webfit-issuer-backup",
                    )?;
                }
                let tx = self.db.transaction()?;
                tx.execute_batch("DELETE FROM issued; DELETE FROM identity;")?;
                tx.execute(
                    "INSERT INTO identity(id,seed) VALUES(1,?1)",
                    [&contents.seed],
                )?;
                for (id, request, kind) in contents.issued.drain(..) {
                    tx.execute(
                        "INSERT INTO issued(id,request_id,kind) VALUES(?1,?2,?3)",
                        params![id, request, kind],
                    )?;
                }
                tx.commit()?;
                Ok(json!({"recovered":true}))
            }
        }
    }
}
