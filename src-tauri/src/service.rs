use crate::{database, security, Error, Result};
use chrono::{DateTime, Utc};
use rusqlite::{params, Connection, OptionalExtension, Transaction};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    path::PathBuf,
    time::{Duration, Instant},
};
use unicode_normalization::UnicodeNormalization;
use uuid::Uuid;
use zeroize::Zeroizing;

#[derive(Deserialize)]
pub struct Command {
    pub token: Option<String>,
    pub command: Action,
}
#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "snake_case")]
pub enum Action {
    CalculateEnergy {
        input: crate::energy::EnergyInput,
    },
    Status,
    RememberedLogin {
        administrator: bool,
    },
    RememberLogin {
        remember: bool,
    },
    Setup {
        admin_name: String,
        admin_password: String,
        professional_name: String,
        professional_password: String,
        recovery_password: String,
    },
    Login {
        name: String,
        password: String,
    },
    Logout,
    Touch,
    TourState,
    CompleteTour {
        id: TourId,
    },
    ChangePassword {
        current: String,
        replacement: String,
    },
    ResetPassword {
        user_id: String,
        temporary: String,
    },
    Users,
    Profile,
    SaveProfile {
        profile: Value,
    },
    Patients {
        query: String,
        archived: bool,
    },
    Patient {
        id: String,
    },
    SavePatient {
        id: Option<String>,
        patient: Value,
    },
    ArchivePatient {
        id: String,
        archived: bool,
    },
    Tags,
    SaveTag {
        id: Option<String>,
        name: String,
        active: bool,
    },
    Drafts,
    SaveDraft {
        id: String,
        kind: String,
        payload: Value,
    },
    DiscardDraft {
        id: String,
    },
    Prescriptions {
        patient_id: String,
    },
    SavePrescription {
        id: Option<String>,
        patient_id: String,
        payload: Value,
    },
    FinalizePrescription {
        id: String,
    },
    VersionPrescription {
        id: String,
    },
    CancelPrescription {
        id: String,
        reason: String,
    },
    Audit {
        filter: AuditFilter,
    },
    AuditDetail {
        id: String,
    },
    Backup {
        path: Option<String>,
    },
    Restore {
        path: String,
        password: String,
        confirmed: bool,
    },
    BackupStatus,
}
// RF-UX-001: only known tutorial IDs can be stored; user scope comes from authorization.
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum TourId {
    Patients,
    PatientNew,
    Patient,
    Profile,
    Prescription,
    Audit,
    Backup,
    Access,
}
#[derive(Deserialize, Default)]
pub struct AuditFilter {
    #[serde(default)]
    pub open: bool,
    pub from: Option<String>,
    pub to: Option<String>,
    pub user: Option<String>,
    pub action: Option<String>,
    pub entity: Option<String>,
    pub result: Option<String>,
    pub cursor: Option<String>,
}
#[derive(Clone, Serialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub role: String,
    pub must_change: bool,
}
struct Session {
    token: String,
    user: User,
    last: Instant,
}
pub struct Service {
    pub db: Connection,
    pub root: PathBuf,
    pub key: Zeroizing<Vec<u8>>,
    session: Option<Session>,
    failed: u32,
    next_login: Option<Instant>,
    updating: bool,
    audit_queries: std::collections::HashMap<String, (AuditFilter, String, String)>,
}
pub fn normalize(text: &str) -> String {
    text.nfd()
        .filter(|c| !unicode_normalization::char::is_combining_mark(*c))
        .flat_map(char::to_lowercase)
        .collect()
}
pub fn cpf_valid(text: &str) -> bool {
    let digits: Vec<u32> = text.chars().filter_map(|c| c.to_digit(10)).collect();
    if digits.len() != 11 || digits.iter().all(|d| *d == digits[0]) {
        return false;
    }
    for count in [9, 10] {
        let sum: u32 = (0..count).map(|i| digits[i] * (count + 1 - i) as u32).sum();
        let digit = (sum * 10) % 11;
        if (if digit == 10 { 0 } else { digit }) != digits[count] {
            return false;
        }
    }
    true
}
pub fn audit(
    tx: &Transaction<'_>,
    user: Option<&User>,
    action: &str,
    entity: &str,
    id: Option<&str>,
    result: &str,
) -> Result<()> {
    tx.execute("INSERT INTO audit(id,actor_type,user_id,at,action,entity_type,entity_id,result) VALUES(?1,?2,?3,?4,?5,?6,?7,?8)",params![Uuid::new_v4().to_string(),if user.is_some(){"USER"}else{"UNAUTHENTICATED"},user.map(|u|u.id.as_str()),Utc::now().to_rfc3339(),action,entity,id,result])?;
    Ok(())
}
fn text<'a>(value: &'a Value, field: &str) -> Result<&'a str> {
    value
        .get(field)
        .and_then(Value::as_str)
        .filter(|s| !s.trim().is_empty())
        .ok_or_else(|| {
            let label = match field {
                "name" => "nome completo",
                "cpf" => "CPF",
                "phone" => "telefone",
                "birth" => "data de nascimento",
                "email" => "e-mail",
                "address" => "endereço",
                "fullName" => "nome completo",
                "professionalName" => "nome profissional",
                "crn" => "CRN",
                "region" => "região",
                "job" => "cargo",
                "workplace" => "local de trabalho",
                "relationship" => "vínculo do responsável",
                "objective" => "objetivo",
                _ => "obrigatório",
            };
            Error::validation(&format!("Preencha o campo {label}."))
        })
}
fn validate_patient(patient: &Value) -> Result<String> {
    for key in ["name", "cpf", "phone", "birth", "email", "address"] {
        text(patient, key)?;
    }
    let cpf: String = text(patient, "cpf")?
        .chars()
        .filter(char::is_ascii_digit)
        .collect();
    if !cpf_valid(&cpf) {
        return Err(Error::validation("CPF inválido. Confira os 11 dígitos."));
    }
    if !text(patient, "email")?.contains('@') {
        return Err(Error::validation("Informe um e-mail válido."));
    }
    let birth = chrono::NaiveDate::parse_from_str(text(patient, "birth")?, "%Y-%m-%d")
        .map_err(|_| Error::validation("Data de nascimento inválida."))?;
    if birth > Utc::now().date_naive() {
        return Err(Error::validation("Nascimento não pode estar no futuro."));
    }
    if let Some(guardian) = patient.get("guardian").filter(|v| v.is_object()) {
        for field in ["name", "cpf", "relationship", "phone", "email"] {
            text(guardian, field)?;
        }
        if !cpf_valid(text(guardian, "cpf")?) {
            return Err(Error::validation("CPF do responsável inválido."));
        }
    }
    Ok(cpf)
}
impl Service {
    pub fn open(root: PathBuf) -> Result<Self> {
        std::fs::create_dir_all(&root)?;
        let key_path = root.join("installation.key.dpapi");
        let key = if key_path.exists() {
            security::protect(&std::fs::read(&key_path)?, true)?
        } else {
            if root.join("health.db").exists() {
                return Err(Error::validation(
                    "A chave local não está disponível. Recupere um backup.",
                ));
            }
            let key = security::random_key();
            std::fs::write(&key_path, security::protect(&key, false)?.as_slice())?;
            key
        };
        let mut db = database::open(&root.join("health.db"), &key)?;
        database::migrate(&mut db)?;
        Ok(Self {
            db,
            root,
            key,
            session: None,
            failed: 0,
            next_login: None,
            updating: false,
            audit_queries: Default::default(),
        })
    }
    pub fn lock(&mut self) {
        self.session = None;
        self.audit_queries.clear();
    }
    fn authorized(
        &mut self,
        token: Option<&str>,
        allow_change: bool,
        activity: bool,
    ) -> Result<User> {
        let Some(session) = &mut self.session else {
            return Err(Error::denied());
        };
        if session.last.elapsed() >= Duration::from_secs(3600)
            || token != Some(session.token.as_str())
        {
            self.lock();
            return Err(Error::denied());
        }
        if session.user.must_change && !allow_change {
            return Err(Error::validation(
                "Troque sua senha temporária antes de continuar.",
            ));
        }
        if activity {
            session.last = Instant::now();
        }
        Ok(session.user.clone())
    }
    pub fn authorize_update(&mut self, token: &str) -> Result<()> {
        self.authorized(Some(token), false, false).map(|_| ())
    }
    pub fn begin_update(&mut self, token: &str) -> Result<()> {
        if self.updating {
            return Err(Error::validation("Já existe uma atualização em andamento."));
        }
        let user = self.authorized(Some(token), false, true)?;
        self.create_backup(None, Some(&user))?;
        let tx = self.db.transaction()?;
        audit(
            &tx,
            Some(&user),
            "UPDATE_PREPARE",
            "WORKSPACE",
            None,
            "SUCCESS",
        )?;
        tx.commit()?;
        self.updating = true;
        Ok(())
    }
    pub fn finish_update(&mut self, success: bool) -> Result<()> {
        self.updating = false;
        let tx = self.db.transaction()?;
        audit(
            &tx,
            None,
            "UPDATE_INSTALL",
            "WORKSPACE",
            None,
            if success { "SUCCESS" } else { "FAILURE" },
        )?;
        tx.commit()?;
        Ok(())
    }
    pub fn update_ready(&mut self, token: &str) -> Result<()> {
        let user = self.authorized(Some(token), false, false)?;
        let tx = self.db.transaction()?;
        audit(
            &tx,
            Some(&user),
            "UPDATE_INSTALL_START",
            "WORKSPACE",
            None,
            "SUCCESS",
        )?;
        tx.commit()?;
        self.db.execute_batch("PRAGMA wal_checkpoint(TRUNCATE)")?;
        Ok(())
    }
    pub fn execute(&mut self, request: Command) -> Result<Value> {
        if self.updating {
            return Err(Error::validation(
                "A atualização está em andamento. Aguarde a conclusão.",
            ));
        }
        use Action::*;
        match request.command {
            RememberedLogin { administrator } => {
                let role = if administrator {
                    "ADMIN"
                } else {
                    "NUTRITIONIST"
                };
                let name = self.db.query_row(
                    "SELECT u.name FROM settings s JOIN users u ON u.id=s.value WHERE s.name=?1 AND u.role=?2 AND u.active=1",
                    params![format!("login:remembered:{role}"), role],
                    |r| r.get::<_, String>(0),
                ).optional()?;
                Ok(json!({"name":name}))
            }
            Status => Ok(
                json!({"initialized":self.db.query_row("SELECT count(*) FROM users",[],|r|r.get::<_,i64>(0))?>0}),
            ),
            Setup {
                admin_name,
                admin_password,
                professional_name,
                professional_password,
                recovery_password,
            } => {
                if self
                    .db
                    .query_row("SELECT count(*) FROM users", [], |r| r.get::<_, i64>(0))?
                    != 0
                {
                    return Err(Error::denied());
                }
                if admin_name.trim().is_empty()
                    || professional_name.trim().is_empty()
                    || admin_name
                        .trim()
                        .eq_ignore_ascii_case(professional_name.trim())
                {
                    return Err(Error::validation(
                        "Escolha dois nomes de acesso diferentes.",
                    ));
                }
                if recovery_password.chars().count() < 12 {
                    return Err(Error::validation(
                        "Use ao menos 12 caracteres na senha de recuperação do backup.",
                    ));
                }
                let admin_hash = security::hash_password(&admin_password)?;
                let professional_hash = security::hash_password(&professional_password)?;
                let salt = Uuid::new_v4().as_bytes().to_vec();
                let wrap = security::derive(&recovery_password, &salt)?;
                let protected_wrap = security::protect(&wrap, false)?;
                let tx = self.db.transaction()?;
                for (name, role, hash) in [
                    (admin_name.trim(), "ADMIN", admin_hash),
                    (professional_name.trim(), "NUTRITIONIST", professional_hash),
                ] {
                    tx.execute(
                        "INSERT INTO users(id,name,role,password_hash) VALUES(?1,?2,?3,?4)",
                        params![Uuid::new_v4().to_string(), name, role, hash],
                    )?;
                }
                tx.execute(
                    "INSERT INTO settings(name,value) VALUES('recovery_salt',?1)",
                    [crate::recovery::encode(&salt)],
                )?;
                tx.execute(
                    "INSERT INTO settings(name,value) VALUES('recovery_wrapped',?1)",
                    [crate::recovery::encode(&protected_wrap)],
                )?;
                audit(&tx, None, "SETUP", "WORKSPACE", None, "SUCCESS")?;
                tx.commit()?;
                Ok(json!({"saved":true}))
            }
            Login { name, password } => {
                if self.next_login.is_some_and(|next| next > Instant::now()) {
                    return Err(Error::validation(
                        "Aguarde o intervalo de segurança antes de tentar novamente.",
                    ));
                }
                let row=self.db.query_row("SELECT id,name,role,must_change,password_hash FROM users WHERE name=?1 COLLATE NOCASE AND active=1",[name.trim()],|r|Ok((User{id:r.get(0)?,name:r.get(1)?,role:r.get(2)?,must_change:r.get(3)?},r.get::<_,String>(4)?))).optional()?;
                let valid = row
                    .as_ref()
                    .is_some_and(|(_, hash)| security::verify_password(&password, hash));
                let tx = self.db.transaction()?;
                if !valid {
                    audit(&tx, None, "LOGIN", "USER", None, "FAILURE")?;
                    tx.commit()?;
                    self.failed = self.failed.saturating_add(1);
                    if self.failed >= 4 {
                        let delays = [30, 60, 300, 900];
                        self.next_login = Some(
                            Instant::now()
                                + Duration::from_secs(delays[(self.failed - 4).min(3) as usize]),
                        );
                    }
                    return Err(Error::validation(
                        "Credenciais inválidas. Confira o acesso e tente novamente.",
                    ));
                }
                let user = row.expect("validated row").0;
                audit(&tx, Some(&user), "LOGIN", "USER", Some(&user.id), "SUCCESS")?;
                tx.commit()?;
                self.failed = 0;
                self.next_login = None;
                let token = Uuid::new_v4().to_string();
                self.session = Some(Session {
                    token: token.clone(),
                    user: user.clone(),
                    last: Instant::now(),
                });
                if !user.must_change {
                    self.daily_backup()?;
                }
                Ok(json!({"token":token,"user":user}))
            }
            other => {
                let authorization = self.authorized(
                    request.token.as_deref(),
                    matches!(
                        other,
                        ChangePassword { .. } | Logout | Touch | RememberLogin { .. }
                    ),
                    !matches!(other, Touch),
                );
                let user = match authorization {
                    Ok(user) => user,
                    Err(error) => {
                        let tx = self.db.transaction()?;
                        audit(&tx, None, "ACCESS_DENIED", "WORKSPACE", None, "DENIED")?;
                        tx.commit()?;
                        return Err(error);
                    }
                };
                match other {
                    RememberLogin { remember } => {
                        let key = format!("login:remembered:{}", user.role);
                        if remember {
                            self.db.execute("INSERT INTO settings(name,value) VALUES(?1,?2) ON CONFLICT(name) DO UPDATE SET value=excluded.value", params![key, user.id])?;
                        } else {
                            self.db
                                .execute("DELETE FROM settings WHERE name=?1", [key])?;
                        }
                        Ok(json!({"saved":true}))
                    }
                    CalculateEnergy { input } => {
                        Ok(serde_json::to_value(crate::energy::calculate(input)?)?)
                    }
                    Logout => {
                        self.lock();
                        Ok(json!({"loggedOut":true}))
                    }
                    Touch => Ok(json!({"user":user})),
                    TourState => {
                        let prefix = format!("tour:v1:{}:", user.id);
                        let mut statement = self.db.prepare("SELECT substr(name,?1) FROM settings WHERE substr(name,1,?2)=?3 AND value='seen' ORDER BY name")?;
                        let seen = statement
                            .query_map(
                                params![prefix.len() as i64 + 1, prefix.len() as i64, prefix],
                                |r| r.get::<_, String>(0),
                            )?
                            .collect::<std::result::Result<Vec<_>, _>>()?;
                        Ok(json!(seen))
                    }
                    CompleteTour { id } => {
                        let id = serde_json::to_value(id)?;
                        let name =
                            format!("tour:v1:{}:{}", user.id, id.as_str().unwrap_or_default());
                        self.db.execute("INSERT INTO settings(name,value) VALUES(?1,'seen') ON CONFLICT(name) DO UPDATE SET value='seen'", [name])?;
                        Ok(json!({"saved":true}))
                    }
                    Users => {
                        let mut st=self.db.prepare("SELECT id,name,role,must_change FROM users WHERE active=1 ORDER BY name")?;
                        let users = st
                            .query_map([], |r| {
                                Ok(User {
                                    id: r.get(0)?,
                                    name: r.get(1)?,
                                    role: r.get(2)?,
                                    must_change: r.get(3)?,
                                })
                            })?
                            .collect::<std::result::Result<Vec<_>, _>>()?;
                        Ok(json!(users))
                    }
                    ChangePassword {
                        current,
                        replacement,
                    } => {
                        let hash: String = self.db.query_row(
                            "SELECT password_hash FROM users WHERE id=?1",
                            [&user.id],
                            |r| r.get(0),
                        )?;
                        if !security::verify_password(&current, &hash) {
                            return Err(Error::validation("Credenciais inválidas."));
                        }
                        let hash = security::hash_password(&replacement)?;
                        let tx = self.db.transaction()?;
                        tx.execute(
                            "UPDATE users SET password_hash=?1,must_change=0 WHERE id=?2",
                            params![hash, user.id],
                        )?;
                        audit(
                            &tx,
                            Some(&user),
                            "PASSWORD_CHANGE",
                            "USER",
                            Some(&user.id),
                            "SUCCESS",
                        )?;
                        tx.commit()?;
                        self.lock();
                        Ok(json!({"saved":true}))
                    }
                    ResetPassword { user_id, temporary } => {
                        if user.role != "ADMIN" {
                            return Err(Error::denied());
                        }
                        let hash = security::hash_password(&temporary)?;
                        let tx = self.db.transaction()?;
                        let n=tx.execute("UPDATE users SET password_hash=?1,must_change=1 WHERE id=?2 AND role='NUTRITIONIST'",params![hash,user_id])?;
                        if n != 1 {
                            return Err(Error::validation("Selecione a nutricionista."));
                        }
                        audit(
                            &tx,
                            Some(&user),
                            "PASSWORD_RESET",
                            "USER",
                            Some(&user_id),
                            "SUCCESS",
                        )?;
                        tx.commit()?;
                        Ok(json!({"saved":true}))
                    }
                    Profile => {
                        let payload: String = self.db.query_row(
                            "SELECT profile FROM users WHERE id=?1",
                            [&user.id],
                            |r| r.get(0),
                        )?;
                        Ok(serde_json::from_str(&payload)?)
                    }
                    SaveProfile { profile } => {
                        for field in [
                            "fullName",
                            "professionalName",
                            "crn",
                            "region",
                            "email",
                            "phone",
                            "job",
                            "workplace",
                        ] {
                            text(&profile, field)?;
                        }
                        let tx = self.db.transaction()?;
                        tx.execute(
                            "UPDATE users SET profile=?1 WHERE id=?2",
                            params![profile.to_string(), user.id],
                        )?;
                        audit(
                            &tx,
                            Some(&user),
                            "PROFILE_UPDATE",
                            "PROFESSIONAL_PROFILE",
                            Some(&user.id),
                            "SUCCESS",
                        )?;
                        tx.execute(
                            "DELETE FROM drafts WHERE user_id=?1 AND kind='profile'",
                            [&user.id],
                        )?;
                        tx.commit()?;
                        Ok(json!({"saved":true}))
                    }
                    Patients { query, archived } => {
                        let query = if query.chars().any(|c| c.is_ascii_digit())
                            && query.chars().all(|c| {
                                c.is_ascii_digit() || c.is_whitespace() || ".()-+".contains(c)
                            }) {
                            query.chars().filter(char::is_ascii_digit).collect()
                        } else {
                            normalize(query.trim())
                        };
                        let mut st=self.db.prepare("SELECT id,payload,archived FROM patients WHERE archived=?1 AND instr(search,?2)>0 ORDER BY search LIMIT 200")?;
                        let mut items = Vec::new();
                        for row in st.query_map(params![archived, query], |r| {
                            Ok((
                                r.get::<_, String>(0)?,
                                r.get::<_, String>(1)?,
                                r.get::<_, bool>(2)?,
                            ))
                        })? {
                            let (id, payload, archived) = row?;
                            let mut value: Value = serde_json::from_str(&payload)?;
                            let cpf = value["cpf"].as_str().unwrap_or("");
                            value["cpf"] =
                                json!(format!("***.***.{}-**", cpf.get(6..9).unwrap_or("***")));
                            value["id"] = json!(id);
                            value["archived"] = json!(archived);
                            value
                                .as_object_mut()
                                .ok_or_else(Error::internal)?
                                .remove("notes");
                            items.push(value);
                        }
                        Ok(json!(items))
                    }
                    Patient { id } => {
                        let (payload, archived): (String, bool) = self.db.query_row(
                            "SELECT payload,archived FROM patients WHERE id=?1",
                            [&id],
                            |r| Ok((r.get(0)?, r.get(1)?)),
                        )?;
                        let mut patient: Value = serde_json::from_str(&payload)?;
                        patient["id"] = json!(id);
                        patient["archived"] = json!(archived);
                        let tx = self.db.transaction()?;
                        audit(
                            &tx,
                            Some(&user),
                            "PATIENT_VIEW",
                            "PATIENT",
                            Some(&id),
                            "SUCCESS",
                        )?;
                        tx.commit()?;
                        Ok(patient)
                    }
                    SavePatient { id, mut patient } => {
                        let cpf = validate_patient(&patient)?;
                        patient["cpf"] = json!(cpf);
                        let existing = self
                            .db
                            .query_row("SELECT id FROM patients WHERE cpf=?1", [&cpf], |r| {
                                r.get::<_, String>(0)
                            })
                            .optional()?;
                        if existing
                            .as_ref()
                            .is_some_and(|other| Some(other) != id.as_ref())
                        {
                            return Err(Error::validation(
                                "CPF já cadastrado, inclusive entre arquivados.",
                            ));
                        }
                        let search = normalize(&format!(
                            "{} {} {} {}",
                            patient["name"].as_str().unwrap_or(""),
                            patient["socialName"].as_str().unwrap_or(""),
                            cpf,
                            patient["phone"]
                                .as_str()
                                .unwrap_or("")
                                .chars()
                                .filter(char::is_ascii_digit)
                                .collect::<String>()
                        ));
                        let is_new = id.is_none();
                        let draft_key =
                            format!("{}:patient:{}", user.id, id.as_deref().unwrap_or("new"));
                        let id = id.unwrap_or_else(|| Uuid::new_v4().to_string());
                        let tx = self.db.transaction()?;
                        if is_new {
                            tx.execute("INSERT INTO patients(id,cpf,search,payload,created_at,updated_at) VALUES(?1,?2,?3,?4,?5,?5)",params![id,cpf,search,patient.to_string(),Utc::now().to_rfc3339()])?;
                        } else {
                            let n=tx.execute("UPDATE patients SET cpf=?1,search=?2,payload=?3,updated_at=?4 WHERE id=?5",params![cpf,search,patient.to_string(),Utc::now().to_rfc3339(),id])?;
                            if n != 1 {
                                return Err(Error::validation("Paciente não encontrado."));
                            }
                        }
                        tx.execute("DELETE FROM patient_tags WHERE patient_id=?1", [&id])?;
                        if let Some(tags) = patient["tags"].as_array() {
                            for tag in tags {
                                let tag = tag
                                    .as_str()
                                    .ok_or_else(|| Error::validation("Tag inválida."))?;
                                tx.execute(
                                    "INSERT INTO patient_tags(patient_id,tag_id) VALUES(?1,?2)",
                                    params![id, tag],
                                )?;
                            }
                        }
                        audit(
                            &tx,
                            Some(&user),
                            if is_new {
                                "PATIENT_CREATE"
                            } else {
                                "PATIENT_UPDATE"
                            },
                            "PATIENT",
                            Some(&id),
                            "SUCCESS",
                        )?;
                        tx.execute(
                            "DELETE FROM drafts WHERE user_id=?1 AND id=?2",
                            params![user.id, draft_key],
                        )?;
                        tx.commit()?;
                        Ok(json!({"id":id}))
                    }
                    ArchivePatient { id, archived } => {
                        let tx = self.db.transaction()?;
                        if tx.execute(
                            "UPDATE patients SET archived=?1,updated_at=?2 WHERE id=?3",
                            params![archived, Utc::now().to_rfc3339(), id],
                        )? != 1
                        {
                            return Err(Error::validation("Paciente não encontrado."));
                        }
                        audit(
                            &tx,
                            Some(&user),
                            if archived {
                                "PATIENT_ARCHIVE"
                            } else {
                                "PATIENT_RESTORE"
                            },
                            "PATIENT",
                            Some(&id),
                            "SUCCESS",
                        )?;
                        tx.commit()?;
                        Ok(json!({"saved":true}))
                    }
                    Tags => {
                        let mut st = self
                            .db
                            .prepare("SELECT id,name,active FROM tags ORDER BY name")?;
                        let rows=st.query_map([],|r|Ok(json!({"id":r.get::<_,String>(0)?,"name":r.get::<_,String>(1)?,"active":r.get::<_,bool>(2)?})))?.collect::<std::result::Result<Vec<_>,_>>()?;
                        Ok(json!(rows))
                    }
                    SaveTag { id, name, active } => {
                        if name.trim().is_empty() {
                            return Err(Error::validation("Informe o nome da tag."));
                        }
                        let is_new = id.is_none();
                        let id = id.unwrap_or_else(|| Uuid::new_v4().to_string());
                        let tx = self.db.transaction()?;
                        tx.execute("INSERT INTO tags(id,name,active) VALUES(?1,?2,?3) ON CONFLICT(id) DO UPDATE SET name=excluded.name,active=excluded.active",params![id,name.trim(),active])?;
                        audit(
                            &tx,
                            Some(&user),
                            if is_new {
                                "TAG_CREATE"
                            } else if active {
                                "TAG_RENAME"
                            } else {
                                "TAG_DISABLE"
                            },
                            "TAG",
                            Some(&id),
                            "SUCCESS",
                        )?;
                        tx.commit()?;
                        Ok(json!({"saved":true}))
                    }
                    Drafts => {
                        self.db.execute(
                            "DELETE FROM drafts WHERE updated_at<?1",
                            [(Utc::now() - chrono::Duration::days(30)).to_rfc3339()],
                        )?;
                        let mut st=self.db.prepare("SELECT id,kind,payload,updated_at FROM drafts WHERE user_id=?1 ORDER BY updated_at DESC")?;
                        let mut result = Vec::new();
                        for row in st.query_map([&user.id], |r| {
                            Ok((
                                r.get::<_, String>(0)?,
                                r.get::<_, String>(1)?,
                                r.get::<_, String>(2)?,
                                r.get::<_, String>(3)?,
                            ))
                        })? {
                            let (id, kind, payload, at) = row?;
                            result.push(json!({"id":id,"kind":kind,"payload":serde_json::from_str::<Value>(&payload)?,"at":at}));
                        }
                        Ok(json!(result))
                    }
                    SaveDraft { id, kind, payload } => {
                        if !["patient", "profile", "prescription"].contains(&kind.as_str()) {
                            return Err(Error::validation("Este formulário não aceita rascunho."));
                        }
                        self.db.execute("INSERT INTO drafts(id,user_id,kind,payload,updated_at) VALUES(?1,?2,?3,?4,?5) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at WHERE user_id=excluded.user_id",params![format!("{}:{id}",user.id),user.id,kind,payload.to_string(),Utc::now().to_rfc3339()])?;
                        Ok(json!({"saved":true}))
                    }
                    DiscardDraft { id } => {
                        self.db.execute(
                            "DELETE FROM drafts WHERE id=?1 AND user_id=?2",
                            params![id, user.id],
                        )?;
                        Ok(json!({"saved":true}))
                    }
                    Prescriptions { patient_id } => self.prescriptions(&patient_id),
                    SavePrescription {
                        id,
                        patient_id,
                        payload,
                    } => self.save_prescription(&user, id, &patient_id, payload),
                    FinalizePrescription { id } => {
                        self.transition_prescription(&user, &id, "FINAL", None)
                    }
                    CancelPrescription { id, reason } => {
                        self.transition_prescription(&user, &id, "CANCELLED", Some(reason))
                    }
                    VersionPrescription { id } => self.version_prescription(&user, &id),
                    Audit { filter } => self.query_audit(&user, filter),
                    AuditDetail { id } => {
                        let result=self.db.query_row("SELECT actor_type,user_id,at,action,entity_type,entity_id,result FROM audit WHERE id=?1",[&id],|r|Ok(json!({"id":id,"actor":r.get::<_,String>(0)?,"userId":r.get::<_,Option<String>>(1)?,"at":r.get::<_,String>(2)?,"action":r.get::<_,String>(3)?,"entity":r.get::<_,String>(4)?,"entityId":r.get::<_,Option<String>>(5)?,"result":r.get::<_,String>(6)?})))?;
                        let tx = self.db.transaction()?;
                        audit(
                            &tx,
                            Some(&user),
                            "AUDIT_EVENT_DETAIL_VIEW",
                            "AUDIT_EVENT",
                            Some(&id),
                            "SUCCESS",
                        )?;
                        tx.commit()?;
                        Ok(result)
                    }
                    Backup { path } => {
                        let result = self.create_backup(path.map(PathBuf::from), Some(&user));
                        if result.is_err() {
                            let tx = self.db.transaction()?;
                            audit(&tx, Some(&user), "BACKUP_CREATE", "BACKUP", None, "FAILURE")?;
                            tx.commit()?;
                        }
                        result
                    }
                    Restore {
                        path,
                        password,
                        confirmed,
                    } => {
                        if !confirmed {
                            return Err(Error::validation(
                                "Confirme a restauração antes de substituir o estado atual.",
                            ));
                        }
                        let result = self.restore(&PathBuf::from(path), &password, &user);
                        if result.is_err() {
                            let tx = self.db.transaction()?;
                            audit(
                                &tx,
                                Some(&user),
                                "BACKUP_RESTORE",
                                "BACKUP",
                                None,
                                "FAILURE",
                            )?;
                            tx.commit()?;
                        }
                        result
                    }
                    BackupStatus => self.backup_status(),
                    _ => Err(Error::denied()),
                }
            }
        }
    }
    fn prescriptions(&self, patient: &str) -> Result<Value> {
        let mut st=self.db.prepare("SELECT id,payload,status,version,previous_id,created_at FROM prescriptions WHERE patient_id=?1 ORDER BY created_at DESC")?;
        let mut items = Vec::new();
        for row in st.query_map([patient], |r| {
            Ok((
                r.get::<_, String>(0)?,
                r.get::<_, String>(1)?,
                r.get::<_, String>(2)?,
                r.get::<_, i64>(3)?,
                r.get::<_, Option<String>>(4)?,
                r.get::<_, String>(5)?,
            ))
        })? {
            let (id, payload, status, version, previous, at) = row?;
            items.push(json!({"id":id,"payload":serde_json::from_str::<Value>(&payload)?,"status":status,"version":version,"previousId":previous,"at":at}));
        }
        Ok(json!(items))
    }
    fn save_prescription(
        &mut self,
        user: &User,
        id: Option<String>,
        patient: &str,
        mut payload: Value,
    ) -> Result<Value> {
        crate::nutrition::composition(&mut payload, false)?;
        if let Some(input) = payload.get("energy").and_then(|v| v.get("input")) {
            let result = crate::energy::calculate(serde_json::from_value(input.clone())?)?;
            payload["energy"] = serde_json::to_value(result)?;
            payload["calculationAuthor"] = json!(user.id);
            payload["calculationAt"] = json!(Utc::now().to_rfc3339());
        }
        let archived: bool = self.db.query_row(
            "SELECT archived FROM patients WHERE id=?1",
            [patient],
            |r| r.get(0),
        )?;
        if archived {
            return Err(Error::validation(
                "Restaure o paciente antes de criar ou editar uma prescrição.",
            ));
        }
        let tx = self.db.transaction()?;
        let id = match id {
            Some(id) => {
                if tx.execute("UPDATE prescriptions SET payload=?1,updated_at=?2 WHERE id=?3 AND patient_id=?4 AND status='DRAFT'",params![payload.to_string(),Utc::now().to_rfc3339(),id,patient])?!=1{return Err(Error::validation("Esta versão não pode ser editada."));}
                id
            }
            None => {
                let id = Uuid::new_v4().to_string();
                tx.execute("INSERT INTO prescriptions(id,patient_id,author_id,version,status,payload,created_at,updated_at) VALUES(?1,?2,?3,1,'DRAFT',?4,?5,?5)",params![id,patient,user.id,payload.to_string(),Utc::now().to_rfc3339()])?;
                id
            }
        };
        tx.execute(
            "DELETE FROM drafts WHERE user_id=?1 AND (id=?2 OR id=?3)",
            params![
                user.id,
                format!("{}:prescription:{id}", user.id),
                format!("{}:prescription:{patient}:new", user.id)
            ],
        )?;
        audit(
            &tx,
            Some(user),
            "PRESCRIPTION_SAVE",
            "PRESCRIPTION",
            Some(&id),
            "SUCCESS",
        )?;
        tx.commit()?;
        Ok(json!({"id":id}))
    }
    fn transition_prescription(
        &mut self,
        user: &User,
        id: &str,
        status: &str,
        reason: Option<String>,
    ) -> Result<Value> {
        let(payload,current,previous,archived):(String,String,Option<String>,bool)=self.db.query_row("SELECT p.payload,p.status,p.previous_id,t.archived FROM prescriptions p JOIN patients t ON t.id=p.patient_id WHERE p.id=?1",[id],|r|Ok((r.get(0)?,r.get(1)?,r.get(2)?,r.get(3)?)))?;
        if archived || current == "CANCELLED" || (status == "FINAL" && current != "DRAFT") {
            return Err(Error::validation(
                "Esta versão não permite a ação solicitada.",
            ));
        }
        let mut payload: Value = serde_json::from_str(&payload)?;
        if status == "FINAL" {
            if payload["energy"]["belowBmr"].as_bool() == Some(true)
                && payload["energy"]["input"]["confirmedBelowBmr"].as_bool() != Some(true)
            {
                return Err(Error::validation(
                    "Confirme a meta inferior à TMB antes de finalizar.",
                ));
            }
            text(&payload, "objective")?;
            crate::nutrition::composition(&mut payload, true)?;
            if payload["meals"].as_array().is_none_or(|m| m.is_empty()) {
                return Err(Error::validation(
                    "Inclua ao menos uma refeição antes de finalizar.",
                ));
            }
        }
        if status == "CANCELLED" {
            let reason = reason
                .filter(|s| !s.trim().is_empty())
                .ok_or_else(|| Error::validation("Informe o motivo do cancelamento."))?;
            payload["cancellationReason"] = json!(reason);
        }
        let tx = self.db.transaction()?;
        tx.execute(
            "UPDATE prescriptions SET status=?1,payload=?2,updated_at=?3 WHERE id=?4",
            params![status, payload.to_string(), Utc::now().to_rfc3339(), id],
        )?;
        if status == "FINAL" {
            if let Some(previous) = previous {
                tx.execute(
                    "UPDATE prescriptions SET status='SUPERSEDED' WHERE id=?1 AND status='FINAL'",
                    [previous],
                )?;
            }
        }
        audit(
            &tx,
            Some(user),
            if status == "CANCELLED" {
                "PRESCRIPTION_CANCEL"
            } else {
                "PRESCRIPTION_FINALIZE"
            },
            "PRESCRIPTION",
            Some(id),
            "SUCCESS",
        )?;
        tx.commit()?;
        Ok(json!({"saved":true}))
    }
    fn version_prescription(&mut self, user: &User, id: &str) -> Result<Value> {
        let allowed: bool = self.db.query_row("SELECT EXISTS(SELECT 1 FROM prescriptions p JOIN patients t ON t.id=p.patient_id WHERE p.id=?1 AND t.archived=0 AND NOT EXISTS(SELECT 1 FROM prescriptions child WHERE child.previous_id=p.id AND child.status='DRAFT'))",[id],|r|r.get(0))?;
        if !allowed {
            return Err(Error::validation(
                "Restaure o paciente ou conclua o rascunho da próxima versão antes de continuar.",
            ));
        }
        let (patient, payload, version, status): (String, String, i64, String) =
            self.db.query_row(
                "SELECT patient_id,payload,version,status FROM prescriptions WHERE id=?1",
                [id],
                |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?)),
            )?;
        if status != "FINAL" {
            return Err(Error::validation(
                "Crie uma nova versão a partir de uma finalizada.",
            ));
        }
        let new_id = Uuid::new_v4().to_string();
        let tx = self.db.transaction()?;
        tx.execute("INSERT INTO prescriptions(id,patient_id,author_id,previous_id,version,status,payload,created_at,updated_at) VALUES(?1,?2,?3,?4,?5,'DRAFT',?6,?7,?7)",params![new_id,patient,user.id,id,version+1,payload,Utc::now().to_rfc3339()])?;
        audit(
            &tx,
            Some(user),
            "PRESCRIPTION_VERSION",
            "PRESCRIPTION",
            Some(&new_id),
            "SUCCESS",
        )?;
        tx.commit()?;
        Ok(json!({"id":new_id}))
    }
    fn query_audit(&mut self, user: &User, filter: AuditFilter) -> Result<Value> {
        let is_initial = filter.open;
        let query_id = if let Some(cursor) = &filter.cursor {
            cursor.clone()
        } else {
            Uuid::new_v4().to_string()
        };
        let (filter, snapshot, last) = if let Some(cursor) = &filter.cursor {
            self.audit_queries
                .remove(cursor)
                .ok_or_else(|| Error::validation("Consulta expirada. Reabra a auditoria."))?
        } else {
            let now = Utc::now();
            let mut filter = filter;
            let from = filter
                .from
                .clone()
                .unwrap_or_else(|| (now - chrono::Duration::days(30)).to_rfc3339());
            let to = filter.to.clone().unwrap_or_else(|| now.to_rfc3339());
            let f = DateTime::parse_from_rfc3339(&from)
                .map_err(|_| Error::validation("Período inválido."))?;
            let t = DateTime::parse_from_rfc3339(&to)
                .map_err(|_| Error::validation("Período inválido."))?;
            if f >= t {
                return Err(Error::validation("O início deve ser anterior ao fim."));
            }
            filter.from = Some(f.with_timezone(&Utc).to_rfc3339());
            filter.to = Some(t.with_timezone(&Utc).to_rfc3339());
            (filter, now.to_rfc3339(), String::new())
        };
        let items = {
            let mut st=self.db.prepare("SELECT a.id,a.at,a.actor_type,u.name,a.action,a.entity_type,a.entity_id,a.result FROM audit a LEFT JOIN users u ON u.id=a.user_id WHERE a.at>=?1 AND a.at<?2 AND a.at<?3 AND (?4 IS NULL OR a.user_id=?4) AND (?5 IS NULL OR a.action=?5) AND (?6 IS NULL OR a.entity_type=?6) AND (?7 IS NULL OR a.result=?7) AND (?8='' OR (a.at||'|'||a.id)<?8) ORDER BY a.at DESC,a.id DESC LIMIT 51")?;
            let rows = st.query_map(params![filter.from,filter.to,snapshot,filter.user,filter.action,filter.entity,filter.result,last],|r|Ok(json!({"id":r.get::<_,String>(0)?,"at":r.get::<_,String>(1)?,"actor":r.get::<_,String>(2)?,"user":r.get::<_,Option<String>>(3)?,"action":r.get::<_,String>(4)?,"entity":r.get::<_,String>(5)?,"entityId":r.get::<_,Option<String>>(6)?,"result":r.get::<_,String>(7)?})))?.collect::<std::result::Result<Vec<_>,_>>()?;
            rows
        };
        let mut items = items;
        let more = items.len() > 50;
        items.truncate(50);
        let cursor = if more {
            let item = items.last().ok_or_else(Error::internal)?;
            let cursor = Uuid::new_v4().to_string();
            self.audit_queries.insert(
                cursor.clone(),
                (
                    filter,
                    snapshot,
                    format!(
                        "{}|{}",
                        item["at"].as_str().unwrap_or(""),
                        item["id"].as_str().unwrap_or("")
                    ),
                ),
            );
            Some(cursor)
        } else {
            None
        };
        if is_initial {
            let tx = self.db.transaction()?;
            audit(
                &tx,
                Some(user),
                "AUDIT_MODULE_OPEN",
                "WORKSPACE",
                None,
                "SUCCESS",
            )?;
            tx.commit()?;
        }
        let _ = query_id;
        Ok(json!({"items":items,"cursor":cursor}))
    }
}
