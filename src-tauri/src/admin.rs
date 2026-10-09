//! Maintenance is authenticated separately from clinical sessions. Never log actions/payloads.
use crate::{
    database, issuer_vault, security,
    service::{self, Service, User},
    Error, Result,
};
use rusqlite::{params, OptionalExtension};
use serde::Deserialize;
use serde_json::{json, Value};
use std::{
    path::PathBuf,
    time::{Duration, Instant},
};
use uuid::Uuid;
use webfit_license_protocol::{self as protocol, Credential, Kind, Request};
use zeroize::Zeroizing;

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Configuration {
    version: u8,
    verifier: Option<String>,
}
pub(crate) struct Access {
    verifier: Option<String>,
    session: Option<(String, Instant)>,
    failures: u32,
    next: Option<Instant>,
}
impl Access {
    pub fn from_build() -> Self {
        let config =
            serde_json::from_str::<Configuration>(include_str!("../admin-access.json")).ok();
        Self::new(config.filter(|c| c.version == 1).and_then(|c| c.verifier))
    }
    pub(crate) fn new(verifier: Option<String>) -> Self {
        let verifier = verifier.filter(|v| {
            protocol::validate_credential(&Credential {
                login: "admin".into(),
                verifier: v.clone(),
            })
            .is_ok()
        });
        Self {
            verifier,
            session: None,
            failures: 0,
            next: None,
        }
    }
    pub fn configured(&self) -> bool {
        self.verifier.is_some()
    }
    pub fn lock(&mut self) {
        self.session = None;
    }
    fn login(&mut self, password: &str) -> Result<String> {
        if !self.configured() {
            return Err(Error::validation(
                "A senha mestra ainda não foi configurada neste instalador.",
            ));
        }
        if self.next.is_some_and(|t| t > Instant::now()) {
            return Err(Error::validation(
                "Aguarde o intervalo de segurança antes de tentar novamente.",
            ));
        }
        if password.len() > 1024
            || !self
                .verifier
                .as_ref()
                .is_some_and(|v| security::verify_password(password, v))
        {
            self.failures = self.failures.saturating_add(1);
            if self.failures >= 4 {
                self.next = Some(
                    Instant::now()
                        + Duration::from_secs(
                            [30, 60, 300, 900][(self.failures - 4).min(3) as usize],
                        ),
                );
            }
            return Err(Error::validation(
                "Senha mestra inválida. Confira e tente novamente.",
            ));
        }
        self.failures = 0;
        self.next = None;
        let token = Uuid::new_v4().to_string();
        self.session = Some((token.clone(), Instant::now()));
        Ok(token)
    }
    pub fn authorize(&mut self, token: Option<&str>) -> Result<()> {
        let Some((expected, last)) = self.session.as_mut() else {
            return Err(Error::denied());
        };
        if last.elapsed() >= Duration::from_secs(3600) {
            self.lock();
            return Err(Error::denied());
        }
        if token != Some(expected.as_str()) {
            return Err(Error::denied());
        }
        *last = Instant::now();
        Ok(())
    }
    fn credential(&self, login: String) -> Result<Credential> {
        let credential = Credential {
            login,
            verifier: self.verifier.clone().ok_or_else(Error::denied)?,
        };
        protocol::validate_credential(&credential).map_err(Error::validation)?;
        Ok(credential)
    }
    #[cfg(test)]
    pub(crate) fn expire(&mut self) {
        if let Some((_, last)) = &mut self.session {
            *last = Instant::now() - Duration::from_secs(3601);
        }
    }
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "snake_case", deny_unknown_fields)]
pub enum Action {
    Status,
    Logout,
    EnableDatabase {
        confirmed: bool,
    },
    RevealDatabaseKey,
    Integrity,
    Backup {
        path: Option<String>,
    },
    Restore {
        path: String,
        password: String,
        confirmed: bool,
    },
    EnterClinic,
    StartSupport {
        id: String,
    },
    Issuer {
        action: issuer_vault::Action,
    },
    EmitLocal {
        kind: Kind,
        source: Option<String>,
    },
    EmitRequest {
        request: Request,
        path: String,
    },
    EmitInitialCode {
        path: String,
        confirmed: bool,
    },
    LicenseOperation {
        command: Box<service::Action>,
    },
}
impl Service {
    fn record_master(tx: &rusqlite::Transaction<'_>, action: &str, result: &str) -> Result<()> {
        tx.execute("INSERT INTO audit(id,actor_type,at,action,entity_type,result) VALUES(?1,'SYSTEM',?2,?3,'WORKSPACE',?4)",params![Uuid::new_v4().to_string(),chrono::Utc::now().to_rfc3339(),format!("MASTER_{action}"),result])?;
        Ok(())
    }
    fn admin_audit(&mut self, action: &str, result: &str) -> Result<()> {
        let tx = self.db.transaction()?;
        Self::record_master(&tx, action, result)?;
        tx.commit()?;
        Ok(())
    }
    fn completed_emission(&mut self, mut value: Value) -> Value {
        // A file/issuer commit cannot be rolled back through the clinical database.
        // Preserve the one-time code and artifact when only the final audit fails.
        if self.admin_audit("LICENSE_ISSUE", "SUCCESS").is_err() {
            value["auditWarning"] = json!("Emissão concluída; falhou o registro final de auditoria. Guarde o arquivo e o código quando houver antes de continuar.");
        }
        value
    }
    pub(crate) fn master_login(&mut self, password: String) -> Result<Value> {
        let password = Zeroizing::new(password);
        let result = self.master.login(&password);
        if let Err(error) =
            self.admin_audit("LOGIN", if result.is_ok() { "SUCCESS" } else { "FAILURE" })
        {
            self.master.lock();
            return Err(error);
        }
        Ok(json!({"token":result?}))
    }
    fn admin_vault(&self) -> Result<issuer_vault::Vault> {
        issuer_vault::Vault::open(self.root.join("admin-issuer"))
    }
    fn trusted_vault(&self) -> Result<issuer_vault::Vault> {
        let vault = self.admin_vault()?;
        if !vault
            .public_key()?
            .is_some_and(|k| self.license_roots.contains(&k))
        {
            return Err(Error::validation(
                "Importe primeiro o backup do emissor atual na aba Emissor de licenças.",
            ));
        }
        Ok(vault)
    }
    fn master_user(&self) -> Result<User> {
        self.db.query_row("SELECT u.id,u.name,u.role FROM users u JOIN license_state l ON l.administrator_id=u.id WHERE l.singleton=1 AND u.active=1 AND u.role='ADMIN'",[],|r|Ok(User{id:r.get(0)?,name:r.get(1)?,role:r.get(2)?,must_change:false,support_authorization_id:None})).optional()?.ok_or_else(||Error::validation("Prepare os acessos e a licença desta instalação antes de entrar no Saúde."))
    }
    fn begin_master_clinic(&mut self, support: Option<&str>) -> Result<Value> {
        if !self.licensed()? {
            return Err(Error::validation(
                "Esta instalação precisa de uma licença ativa.",
            ));
        }
        let mut user = self.master_user()?;
        if let Some(id) = support {
            let grant = self.pending_grant(Some(id), Kind::TemporarySupport)?;
            let tx = self.db.transaction()?;
            crate::license::consume(&tx, &grant)?;
            user.support_authorization_id = Some(id.to_owned());
            service::audit(
                &tx,
                Some(&user),
                "SUPPORT_LOGIN",
                "LICENSE",
                Some(id),
                "SUCCESS",
            )?;
            tx.commit()?;
        } else {
            self.admin_audit("CLINICAL_LOGIN", "SUCCESS")?;
        }
        let token = Uuid::new_v4().to_string();
        self.session = Some(service::Session {
            token: token.clone(),
            user: user.clone(),
            last: Instant::now(),
            support_deadline: support.map(|_| Instant::now() + Duration::from_secs(4 * 3600)),
        });
        Ok(json!({"token":token,"user":user}))
    }
    pub(crate) fn master_execute(&mut self, action: Action) -> Result<Value> {
        match action {
            Action::Status => {
                let mut vault = self.admin_vault()?;
                let status = vault.execute(issuer_vault::Action::Status)?;
                let trusted = vault
                    .public_key()?
                    .is_some_and(|k| self.license_roots.contains(&k));
                let enabled:bool=self.db.query_row("SELECT EXISTS(SELECT 1 FROM settings WHERE name='admin:database_access' AND value='enabled')",[],|r|r.get(0))?;
                Ok(
                    json!({"issuer":status,"issuerTrusted":trusted,"databaseEnabled":enabled,"databasePath":self.root.join("health.db").to_string_lossy(),"license":self.license_status()?}),
                )
            }
            Action::Logout => {
                self.master.lock();
                Ok(json!({"ended":true}))
            }
            Action::EnableDatabase { confirmed } => {
                if !confirmed {
                    return Err(Error::validation(
                        "Confirme a habilitação do acesso técnico ao banco.",
                    ));
                }
                let exists:bool=self.db.query_row("SELECT EXISTS(SELECT 1 FROM settings WHERE name='admin:database_access' AND value='enabled')",[],|r|r.get(0))?;
                if !exists {
                    let prepared: bool =
                        self.db
                            .query_row("SELECT EXISTS(SELECT 1 FROM users)", [], |r| r.get(0))?;
                    if prepared {
                        self.create_backup(None, None)?;
                    }
                    database::integrity(&self.db)?;
                }
                let tx = self.db.transaction()?;
                tx.execute("INSERT INTO settings(name,value) VALUES('admin:database_access','enabled') ON CONFLICT(name) DO UPDATE SET value='enabled'",[])?;
                Self::record_master(&tx, "DATABASE_ENABLE", "SUCCESS")?;
                tx.commit()?;
                Ok(json!({"enabled":true}))
            }
            Action::RevealDatabaseKey => {
                let enabled:bool=self.db.query_row("SELECT EXISTS(SELECT 1 FROM settings WHERE name='admin:database_access' AND value='enabled')",[],|r|r.get(0))?;
                if !enabled {
                    return Err(Error::validation(
                        "Habilite primeiro o acesso técnico ao banco.",
                    ));
                }
                self.admin_audit("DATABASE_KEY_VIEW", "SUCCESS")?;
                let key: String = self.key.iter().map(|b| format!("{b:02x}")).collect();
                Ok(
                    json!({"key":key,"path":self.root.join("health.db").to_string_lossy(),"format":"raw-hex"}),
                )
            }
            Action::Integrity => {
                database::integrity(&self.db)?;
                self.admin_audit("INTEGRITY", "SUCCESS")?;
                Ok(
                    json!({"ok":true,"schema":self.db.pragma_query_value::<i64,_>(None,"user_version",|r|r.get(0))?}),
                )
            }
            Action::Backup { path } => self.create_backup(path.map(PathBuf::from), None),
            Action::Restore {
                path,
                password,
                confirmed,
            } => {
                let password = Zeroizing::new(password);
                if !confirmed {
                    return Err(Error::validation(
                        "Confirme a restauração do backup clínico.",
                    ));
                }
                let user = self.master_user()?;
                let result = self.restore(std::path::Path::new(&path), &password, &user);
                if result.is_err() {
                    self.admin_audit("BACKUP_RESTORE", "FAILURE")?;
                }
                result
            }
            Action::EnterClinic => self.begin_master_clinic(None),
            Action::StartSupport { id } => self.begin_master_clinic(Some(&id)),
            Action::Issuer { action } => {
                if matches!(
                    action,
                    issuer_vault::Action::Initialize { .. }
                        | issuer_vault::Action::Issue { .. }
                        | issuer_vault::Action::IssueInitialCode { .. }
                ) {
                    return Err(Error::denied());
                }
                let mut vault = self.admin_vault()?;
                let result = vault.execute_trusted(action, &self.license_roots)?;
                self.admin_audit("ISSUER_OPERATION", "SUCCESS")?;
                Ok(result)
            }
            Action::EmitLocal { kind, source } => {
                let mut vault = self.trusted_vault()?;
                self.admin_audit("LICENSE_ISSUE_BEGIN", "SUCCESS")?;
                let request = self.license_request(kind, source)?;
                let request: Request =
                    serde_json::from_str(request["content"].as_str().ok_or_else(Error::internal)?)?;
                let login = self
                    .master_user()
                    .map(|u| u.name)
                    .unwrap_or_else(|_| "admin".into());
                let credential = if kind.credential() {
                    Some(self.master.credential(login)?)
                } else {
                    None
                };
                let folder = self.root.join("admin-licenses");
                std::fs::create_dir_all(&folder)?;
                let path = folder.join(format!("{}.webfit-license", Uuid::new_v4()));
                let issued = vault.issue_verified(request, credential, &path)?;
                let content = std::fs::read_to_string(&path)?;
                // Issuance and import are distinct, recoverable steps across two databases.
                let imported = self.import_license(&content);
                Ok(self.completed_emission(
                    json!({"id":issued["id"],"path":path.to_string_lossy(),"imported":imported.is_ok(),"importError":imported.err().map(|e|e.message)}),
                ))
            }
            Action::EmitRequest { request, path } => {
                let mut vault = self.trusted_vault()?;
                self.admin_audit("LICENSE_ISSUE_BEGIN", "SUCCESS")?;
                let credential = if request.kind.credential() {
                    Some(self.master.credential("admin".into())?)
                } else {
                    None
                };
                let result =
                    vault.issue_verified(request, credential, std::path::Path::new(&path))?;
                Ok(self.completed_emission(result))
            }
            Action::EmitInitialCode { path, confirmed } => {
                let mut vault = self.trusted_vault()?;
                self.admin_audit("LICENSE_ISSUE_BEGIN", "SUCCESS")?;
                let result = vault.issue_initial_verified(
                    self.master.credential("admin".into())?,
                    std::path::Path::new(&path),
                    confirmed,
                )?;
                Ok(self.completed_emission(result))
            }
            Action::LicenseOperation { command } => {
                if let service::Action::ResetClinic { id, confirmed } = *command {
                    let user = self.master_user()?;
                    return self.reset_clinic(&id, confirmed, &user);
                }
                if !matches!(
                    *command,
                    service::Action::Status
                        | service::Action::LicenseRequest { .. }
                        | service::Action::ImportLicense { .. }
                        | service::Action::ReadLicenseFile { .. }
                        | service::Action::ActivateLicenseCode { .. }
                        | service::Action::SaveLicenseRequest { .. }
                        | service::Action::RecoverAdministrator { .. }
                        | service::Action::TransferRecovery { .. }
                        | service::Action::Setup { .. }
                ) {
                    return Err(Error::denied());
                }
                self.execute(service::Command {
                    token: None,
                    command: *command,
                })
            }
        }
    }
}
