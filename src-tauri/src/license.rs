use crate::{
    security,
    service::{audit, Service, User},
    Error, Result,
};
use rusqlite::{params, OptionalExtension, Transaction};
use serde_json::{json, Value};
use uuid::Uuid;
use webfit_license_protocol::{self as protocol, Grant, Kind, Request};

fn invalid(message: &str) -> Error {
    Error::validation(message)
}
impl Service {
    pub fn import_initial_code(&mut self, content: &str, code: &str) -> Result<Value> {
        // Verify before any writes; keep the installation's unique DPAPI identity.
        let mut grant =
            protocol::verify_initial_code(content.as_bytes(), &self.license_roots, code)
                .map_err(invalid)?;
        let existing: Option<Option<String>> = self
            .db
            .query_row(
                "SELECT consumed_at FROM license_authorizations WHERE id=?1",
                [grant.id.to_string()],
                |r| r.get(0),
            )
            .optional()?;
        if let Some(consumed) = existing {
            return Ok(json!({"imported":true,"repeated":true,"consumed":consumed.is_some()}));
        }
        let initialized: bool =
            self.db
                .query_row("SELECT EXISTS(SELECT 1 FROM users)", [], |r| r.get(0))?;
        if initialized || self.licensed()? {
            return Err(invalid(
                "Ativação inicial exige instalação vazia. Os acessos e dados foram preservados.",
            ));
        }
        let installation: String = self.db.query_row(
            "SELECT installation_id FROM license_state WHERE singleton=1",
            [],
            |r| r.get(0),
        )?;
        let bytes = security::protect(
            &std::fs::read(self.root.join("license.identity.dpapi"))?,
            true,
        )?;
        let secret = protocol::secret_from_bytes(&bytes).map_err(invalid)?;
        // Only the authenticated INITIAL grant is mapped to a local request, never other kinds.
        grant.request = protocol::request(
            Uuid::parse_str(&installation).map_err(|_| Error::internal())?,
            &secret,
            Kind::Initial,
            None,
            None,
        );
        let request_json = serde_json::to_string(&grant.request)?;
        let clear = zeroize::Zeroizing::new(serde_json::to_vec(&grant)?);
        let protected = security::protect(&clear, false)?;
        let tx = self.db.transaction()?;
        tx.execute("INSERT INTO license_requests(id,kind,request,base_license_id) VALUES(?1,'INITIAL',?2,NULL)", params![grant.request.request_id.to_string(), request_json])?;
        tx.execute("INSERT INTO license_authorizations(id,request_id,kind,payload) VALUES(?1,?2,'INITIAL',?3)", params![grant.id.to_string(),grant.request.request_id.to_string(),protocol::encode(&protected)])?;
        audit(
            &tx,
            None,
            "LICENSE_INITIAL_CODE_IMPORT",
            "LICENSE",
            Some(&grant.id.to_string()),
            "SUCCESS",
        )?;
        tx.commit()?;
        Ok(json!({"imported":true,"id":grant.id,"kind":Kind::Initial}))
    }
    pub fn initialize_license(&mut self) -> Result<()> {
        let identity = self.root.join("license.identity.dpapi");
        let existing: Option<String> = self
            .db
            .query_row(
                "SELECT recipient FROM license_state WHERE singleton=1",
                [],
                |r| r.get(0),
            )
            .optional()?;
        if identity.exists() {
            let bytes = security::protect(&std::fs::read(&identity)?, true)?;
            let secret = protocol::secret_from_bytes(&bytes).map_err(invalid)?;
            if existing
                .as_ref()
                .is_some_and(|r| r != &protocol::encode(secret.public_key().as_bytes()))
            {
                return Err(invalid(
                    "Identidade de licença incompatível. Use recuperação em novo destino.",
                ));
            }
            if existing.is_none() {
                self.db.execute("INSERT INTO license_state(singleton,installation_id,recipient) VALUES(1,?1,?2)", params![Uuid::new_v4().to_string(),protocol::encode(secret.public_key().as_bytes())])?;
            }
        } else {
            if existing.is_some() {
                return Err(invalid(
                    "Identidade de licença ausente. Use recuperação em novo destino.",
                ));
            }
            let secret = protocol::recipient_secret();
            let protected = security::protect(&secret.to_bytes(), false)?;
            std::fs::write(identity, protected.as_slice())?;
            self.db.execute(
                "INSERT INTO license_state(singleton,installation_id,recipient) VALUES(1,?1,?2)",
                params![
                    Uuid::new_v4().to_string(),
                    protocol::encode(secret.public_key().as_bytes())
                ],
            )?;
        }
        Ok(())
    }
    pub fn licensed(&self) -> Result<bool> {
        Ok(self.db.query_row(
            "SELECT active_license_id IS NOT NULL FROM license_state WHERE singleton=1",
            [],
            |r| r.get(0),
        )?)
    }
    pub fn license_status(&self) -> Result<Value> {
        let (installation, active): (String, Option<String>) = self.db.query_row(
            "SELECT installation_id,active_license_id FROM license_state WHERE singleton=1",
            [],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )?;
        let initialized: bool =
            self.db
                .query_row("SELECT EXISTS(SELECT 1 FROM users)", [], |r| r.get(0))?;
        let mut statement = self.db.prepare(
            "SELECT id,kind FROM license_authorizations WHERE consumed_at IS NULL ORDER BY rowid",
        )?;
        let pending = statement
            .query_map([], |r| {
                Ok(json!({"id":r.get::<_,String>(0)?,"kind":r.get::<_,String>(1)?}))
            })?
            .collect::<std::result::Result<Vec<_>, _>>()?;
        Ok(
            json!({"initialized":initialized,"installationId":installation,"licenseId":active,"licensed":active.is_some(),"legacy":initialized&&active.is_none(),"trustConfigured":!self.license_roots.is_empty(),"pending":pending}),
        )
    }
    pub fn license_request(&mut self, kind: Kind, source: Option<String>) -> Result<Value> {
        let (installation, base): (String, Option<String>) = self.db.query_row(
            "SELECT installation_id,active_license_id FROM license_state WHERE singleton=1",
            [],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )?;
        if matches!(kind, Kind::Initial | Kind::TransferRecovery) {
            if self
                .db
                .query_row("SELECT count(*) FROM users", [], |r| r.get::<_, i64>(0))?
                != 0
            {
                return Err(invalid("Ativação inicial e transferência exigem destino vazio. Preserve o banco de testes pelo backup."));
            }
        } else if base.is_none() {
            return Err(invalid("Esta autorização exige licença ativa."));
        }
        let bytes = security::protect(
            &std::fs::read(self.root.join("license.identity.dpapi"))?,
            true,
        )?;
        let secret = protocol::secret_from_bytes(&bytes).map_err(invalid)?;
        let request = protocol::request(
            Uuid::parse_str(&installation).map_err(|_| Error::internal())?,
            &secret,
            kind,
            base.map(|v| Uuid::parse_str(&v))
                .transpose()
                .map_err(|_| Error::internal())?,
            source,
        );
        protocol::validate_request(&request).map_err(invalid)?;
        let content = serde_json::to_string(&request)?;
        self.db.execute(
            "INSERT INTO license_requests(id,kind,request,base_license_id) VALUES(?1,?2,?3,?4)",
            params![
                request.request_id.to_string(),
                kind.name(),
                content,
                request.base_license_id.map(|v| v.to_string())
            ],
        )?;
        Ok(
            json!({"request":request,"content":content,"fingerprint":protocol::fingerprint(secret.public_key().as_bytes())}),
        )
    }
    pub fn import_license(&mut self, content: &str) -> Result<Value> {
        let envelope: protocol::Envelope = protocol::parse(content.as_bytes()).map_err(invalid)?;
        let stored: String = self
            .db
            .query_row(
                "SELECT request FROM license_requests WHERE id=?1",
                [envelope.request.request_id.to_string()],
                |r| r.get(0),
            )
            .optional()?
            .ok_or_else(|| invalid("Solicitação não pertence a esta instalação."))?;
        let request: Request = protocol::parse(stored.as_bytes()).map_err(invalid)?;
        let bytes = security::protect(
            &std::fs::read(self.root.join("license.identity.dpapi"))?,
            true,
        )?;
        let secret = protocol::secret_from_bytes(&bytes).map_err(invalid)?;
        let grant = protocol::verify(content.as_bytes(), &self.license_roots, &secret, &request)
            .map_err(invalid)?;
        let existing: Option<Option<String>> = self
            .db
            .query_row(
                "SELECT consumed_at FROM license_authorizations WHERE id=?1",
                [grant.id.to_string()],
                |r| r.get(0),
            )
            .optional()?;
        if let Some(consumed) = existing {
            return Ok(json!({"imported":true,"repeated":true,"consumed":consumed.is_some()}));
        }
        self.validate_license_base(&grant)?;
        let clear = zeroize::Zeroizing::new(serde_json::to_vec(&grant)?);
        let protected = security::protect(&clear, false)?;
        let tx = self.db.transaction()?;
        tx.execute(
            "INSERT INTO license_authorizations(id,request_id,kind,payload) VALUES(?1,?2,?3,?4)",
            params![
                grant.id.to_string(),
                request.request_id.to_string(),
                request.kind.name(),
                protocol::encode(&protected)
            ],
        )?;
        audit(
            &tx,
            None,
            "LICENSE_IMPORT",
            "LICENSE",
            Some(&grant.id.to_string()),
            "SUCCESS",
        )?;
        tx.commit()?;
        Ok(json!({"imported":true,"id":grant.id,"kind":grant.request.kind}))
    }
    fn validate_license_base(&self, grant: &Grant) -> Result<()> {
        let active: Option<String> = self.db.query_row(
            "SELECT active_license_id FROM license_state WHERE singleton=1",
            [],
            |r| r.get(0),
        )?;
        if active != grant.request.base_license_id.map(|v| v.to_string()) {
            return Err(invalid(
                "Licença de base foi alterada. Gere nova solicitação.",
            ));
        }
        Ok(())
    }
    pub fn pending_grant(&self, id: Option<&str>, kind: Kind) -> Result<Grant> {
        let payload:String=self.db.query_row("SELECT payload FROM license_authorizations WHERE consumed_at IS NULL AND kind=?1 AND (?2 IS NULL OR id=?2) ORDER BY rowid DESC LIMIT 1",params![kind.name(),id],|r|r.get(0)).optional()?.ok_or_else(||invalid("Importe uma autorização válida e ainda não utilizada para esta operação."))?;
        let bytes = security::protect(&protocol::decode(&payload).map_err(invalid)?, true)?;
        let grant: Grant = protocol::parse(&bytes).map_err(invalid)?;
        self.validate_license_base(&grant)?;
        Ok(grant)
    }
    pub fn recover_administrator(&mut self, id: &str, confirmed: bool) -> Result<Value> {
        if !confirmed {
            return Err(invalid("Confirme a troca da credencial administrativa."));
        }
        let grant = self.pending_grant(Some(id), Kind::AdminRecovery)?;
        let credential = grant.credential.as_ref().ok_or_else(Error::internal)?;
        let tx = self.db.transaction()?;
        if tx.execute("UPDATE users SET name=?1,password_hash=?2,must_change=0 WHERE id=(SELECT administrator_id FROM license_state WHERE singleton=1) AND active=1 AND role='ADMIN'",params![credential.login,credential.verifier])?!=1 {return Err(Error::denied());}
        consume(&tx, &grant)?;
        audit(
            &tx,
            None,
            "LICENSE_ADMIN_RECOVERY",
            "LICENSE",
            Some(id),
            "SUCCESS",
        )?;
        tx.commit()?;
        self.lock();
        Ok(json!({"saved":true}))
    }
    pub fn reset_clinic(&mut self, id: &str, confirmed: bool, user: &User) -> Result<Value> {
        if user.role != "ADMIN" {
            return Err(Error::denied());
        }
        if !confirmed {
            return Err(invalid("Confirme a limpeza do consultório após o backup."));
        }
        let grant = self.pending_grant(Some(id), Kind::ResetClinic)?;
        self.create_backup(None, Some(user))?;
        let tx = self.db.transaction()?;
        tx.execute_batch("DELETE FROM patient_tags; DELETE FROM prescriptions; DELETE FROM drafts WHERE kind IN ('patient','prescription'); DELETE FROM patients; DELETE FROM tags;")?;
        consume(&tx, &grant)?;
        audit(
            &tx,
            Some(user),
            "LICENSE_RESET_CLINIC",
            "LICENSE",
            Some(id),
            "SUCCESS",
        )?;
        crate::database::integrity(&tx)?;
        tx.commit()?;
        self.lock();
        Ok(json!({"reset":true}))
    }
}
pub fn consume(tx: &Transaction<'_>, grant: &Grant) -> Result<()> {
    let count = tx.execute(
        "UPDATE license_authorizations SET consumed_at=?1 WHERE id=?2 AND consumed_at IS NULL",
        params![chrono::Utc::now().to_rfc3339(), grant.id.to_string()],
    )?;
    if count != 1 {
        return Err(invalid("Autorização já utilizada."));
    }
    Ok(())
}
pub fn trust_roots() -> Result<Vec<[u8; 32]>> {
    let values: Vec<String> = serde_json::from_str(include_str!("../license-trust.json"))?;
    values
        .iter()
        .map(|v| {
            protocol::decode(v)
                .map_err(invalid)?
                .try_into()
                .map_err(|_| invalid("Configuração pública de confiança inválida."))
        })
        .collect()
}

#[cfg(test)]
pub fn activate_fixture(service: &mut Service, login: &str, password: &str) {
    let key = protocol::signing_key();
    service.license_roots = vec![key.verifying_key().to_bytes()];
    let value = service.license_request(Kind::Initial, None).unwrap();
    let request: Request = serde_json::from_value(value["request"].clone()).unwrap();
    let credential = protocol::Credential {
        login: login.to_owned(),
        verifier: security::hash_password(password).unwrap(),
    };
    let envelope = protocol::issue(request, &key, Some(credential)).unwrap();
    service
        .import_license(&serde_json::to_string(&envelope).unwrap())
        .unwrap();
}
