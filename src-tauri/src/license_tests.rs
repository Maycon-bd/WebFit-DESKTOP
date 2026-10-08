#[cfg(test)]
mod tests {
    use crate::{
        license,
        service::{Action, Command, Service},
    };
    use serde_json::{json, Value};
    use webfit_license_protocol::{self as protocol, Kind, Request};
    fn call(s: &mut Service, token: Option<&str>, command: Action) -> crate::Result<Value> {
        s.execute(Command {
            token: token.map(str::to_owned),
            command,
        })
    }
    fn grant(s: &mut Service, kind: Kind, source: Option<String>, password: &str) -> String {
        let key = protocol::signing_key();
        s.license_roots.push(key.verifying_key().to_bytes());
        let request: Request =
            serde_json::from_value(s.license_request(kind, source).unwrap()["request"].clone())
                .unwrap();
        let credential = kind
            .credential()
            .then(|| protocol::credential("admin", password).unwrap());
        let envelope = protocol::issue(request, &key, credential).unwrap();
        let content = serde_json::to_string(&envelope).unwrap();
        std::fs::write(s.root.join("grant.fixture.webfit-license"), &content).unwrap();
        s.import_license(&content).unwrap();
        let repeated = s.import_license(&content).unwrap();
        assert_eq!(repeated["repeated"], true);
        envelope.id.to_string()
    }
    fn setup(s: &mut Service) -> String {
        license::activate_fixture(s, "admin", "fictional-admin-password");
        call(
            s,
            None,
            Action::Setup {
                professional_name: "nutri".into(),
                professional_password: "fictional-professional".into(),
                recovery_password: "fictional-backup-password".into(),
            },
        )
        .unwrap();
        login(s, "fictional-admin-password")
    }
    fn login(s: &mut Service, password: &str) -> String {
        call(
            s,
            None,
            Action::Login {
                name: "admin".into(),
                password: password.into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .into()
    }
    #[test]
    fn initial_requires_signed_grant_and_cannot_reapply_or_prepare_existing() {
        let temp = tempfile::tempdir().unwrap();
        let mut s = Service::open(temp.path().into()).unwrap();
        let setup_action = || Action::Setup {
            professional_name: "nutri".into(),
            professional_password: "fictional-professional".into(),
            recovery_password: "fictional-backup-password".into(),
        };
        assert!(call(&mut s, None, setup_action()).is_err());
        assert_eq!(s.license_status().unwrap()["initialized"], false);
        grant(&mut s, Kind::Initial, None, "fictional-admin-password");
        call(&mut s, None, setup_action()).unwrap();
        let imported = s
            .import_license(
                &std::fs::read_to_string(s.root.join("grant.fixture.webfit-license")).unwrap(),
            )
            .unwrap();
        assert_eq!(imported["consumed"], true);
        assert!(call(&mut s, None, setup_action()).is_err());
        assert!(s.license_request(Kind::Initial, None).is_err());
        let count: i64 =
            s.db.query_row(
                "SELECT count(*) FROM license_authorizations WHERE consumed_at IS NOT NULL",
                [],
                |r| r.get(0),
            )
            .unwrap();
        assert_eq!(count, 1);
        assert!(serde_json::from_value::<Command>(json!({"token":null,"command":{"op":"setup","admin_password":"injected","professional_name":"nutri","professional_password":"fictional","recovery_password":"fictionalbackup"}})).is_err());
    }
    #[test]
    fn recovery_changes_only_admin_and_consumption_survives_restore() {
        let temp = tempfile::tempdir().unwrap();
        let mut s = Service::open(temp.path().into()).unwrap();
        let token = setup(&mut s);
        let backup = temp.path().join("fixture.webfit-backup");
        s.create_backup(Some(backup.clone()), None).unwrap();
        let id = grant(
            &mut s,
            Kind::AdminRecovery,
            None,
            "fictional-replacement-password",
        );
        assert!(s.recover_administrator(&id, false).is_err());
        s.recover_administrator(&id, true).unwrap();
        assert!(call(&mut s, Some(&token), Action::Profile).is_err());
        assert!(s.recover_administrator(&id, true).is_err());
        assert!(call(
            &mut s,
            None,
            Action::Login {
                name: "admin".into(),
                password: "fictional-admin-password".into()
            }
        )
        .is_err());
        let token = login(&mut s, "fictional-replacement-password");
        call(
            &mut s,
            Some(&token),
            Action::Restore {
                path: backup.to_string_lossy().into(),
                password: "fictional-backup-password".into(),
                confirmed: true,
            },
        )
        .unwrap();
        login(&mut s, "fictional-replacement-password");
        assert!(s.pending_grant(Some(&id), Kind::AdminRecovery).is_err());
        assert!(call(
            &mut s,
            None,
            Action::Login {
                name: "nutri".into(),
                password: "fictional-professional".into()
            }
        )
        .is_ok());
    }
    #[test]
    fn support_one_session_and_reset_preserves_access_license_profile_audit() {
        let temp = tempfile::tempdir().unwrap();
        let mut s = Service::open(temp.path().into()).unwrap();
        let token = setup(&mut s);
        let id = grant(
            &mut s,
            Kind::TemporarySupport,
            None,
            "fictional-support-password",
        );
        assert!(call(
            &mut s,
            None,
            Action::SupportLogin {
                id: id.clone(),
                password: "wrong".into()
            }
        )
        .is_err());
        let result = call(
            &mut s,
            None,
            Action::SupportLogin {
                id: id.clone(),
                password: "fictional-support-password".into(),
            },
        )
        .unwrap();
        assert_eq!(result["support"], true);
        s.lock();
        assert!(call(
            &mut s,
            None,
            Action::SupportLogin {
                id,
                password: "fictional-support-password".into()
            }
        )
        .is_err());
        assert!(call(&mut s, Some(&token), Action::Profile).is_err());
        let token = login(&mut s, "fictional-admin-password");
        let license = s.license_status().unwrap()["licenseId"].clone();
        s.db.execute(
            "UPDATE users SET profile=?1 WHERE active=1",
            [r#"{"fixture":"preserved"}"#],
        )
        .unwrap();
        s.db.execute("INSERT INTO drafts(id,user_id,kind,payload,updated_at) SELECT 'profile-fixture',id,'profile','{}','2026-10-08' FROM users WHERE role='ADMIN' AND active=1",[]).unwrap();
        let audit_before: i64 =
            s.db.query_row("SELECT count(*) FROM audit", [], |r| r.get(0))
                .unwrap();
        s.db.execute("INSERT INTO patients(id,cpf,search,payload,created_at,updated_at) VALUES('fixture','fictional','fixture','{}','2026-10-08','2026-10-08')",[]).unwrap();
        let id = grant(&mut s, Kind::ResetClinic, None, "");
        assert!(call(
            &mut s,
            Some(&token),
            Action::ResetClinic {
                id: id.clone(),
                confirmed: false
            }
        )
        .is_err());
        call(
            &mut s,
            Some(&token),
            Action::ResetClinic {
                id: id.clone(),
                confirmed: true,
            },
        )
        .unwrap();
        assert_eq!(
            s.db.query_row("SELECT count(*) FROM patients", [], |r| r.get::<_, i64>(0))
                .unwrap(),
            0
        );
        assert_eq!(s.license_status().unwrap()["licenseId"], license);
        assert_eq!(
            s.db.query_row(
                "SELECT count(*) FROM users WHERE active=1 AND profile=?1",
                [r#"{"fixture":"preserved"}"#],
                |r| r.get::<_, i64>(0)
            )
            .unwrap(),
            2
        );
        assert_eq!(
            s.db.query_row(
                "SELECT count(*) FROM drafts WHERE id='profile-fixture' AND kind='profile'",
                [],
                |r| r.get::<_, i64>(0)
            )
            .unwrap(),
            1
        );
        assert!(
            s.db.query_row("SELECT count(*) FROM audit", [], |r| r.get::<_, i64>(0))
                .unwrap()
                > audit_before
        );
        login(&mut s, "fictional-admin-password");
        assert!(s.pending_grant(Some(&id), Kind::ResetClinic).is_err());
        crate::database::integrity(&s.db).unwrap();
    }
    #[test]
    fn transfer_requires_source_and_preserves_historical_authors_inactive() {
        let origin = tempfile::tempdir().unwrap();
        let mut a = Service::open(origin.path().into()).unwrap();
        setup(&mut a);
        let source = a.license_status().unwrap()["licenseId"]
            .as_str()
            .unwrap()
            .to_owned();
        let path = origin.path().join("fixture.webfit-backup");
        a.create_backup(Some(path.clone()), None).unwrap();
        let destination = tempfile::tempdir().unwrap();
        let mut b = Service::open(destination.path().into()).unwrap();
        let id = grant(
            &mut b,
            Kind::TransferRecovery,
            Some(source),
            "fictional-new-admin-password",
        );
        let recovery = |password: &str| Action::TransferRecovery {
            id: id.clone(),
            path: path.to_string_lossy().into(),
            password: password.into(),
            professional_name: "destination-professional".into(),
            professional_password: "fictional-new-professional".into(),
            recovery_password: "fictional-new-backup-password".into(),
            confirmed: true,
        };
        assert!(call(&mut b, None, recovery("wrong")).is_err());
        assert!(b.pending_grant(Some(&id), Kind::TransferRecovery).is_ok());
        call(&mut b, None, recovery("fictional-backup-password")).unwrap();
        login(&mut b, "fictional-new-admin-password");
        assert_eq!(
            b.db.query_row("SELECT count(*) FROM users WHERE active=0", [], |r| r
                .get::<_, i64>(0))
                .unwrap(),
            2
        );
        assert_eq!(
            b.db.query_row("SELECT count(*) FROM users WHERE active=1", [], |r| r
                .get::<_, i64>(0))
                .unwrap(),
            2
        );
        assert!(call(&mut b, None, recovery("fictional-backup-password")).is_err());
        crate::database::integrity(&b.db).unwrap();
    }
    #[test]
    fn additive_migration_preserves_legacy_but_blocks_clinical_access() {
        let temp = tempfile::tempdir().unwrap();
        let mut s = Service::open(temp.path().into()).unwrap();
        setup(&mut s);
        s.db.execute(
            "UPDATE license_state SET active_license_id=NULL,administrator_id=NULL",
            [],
        )
        .unwrap();
        let token = login(&mut s, "fictional-admin-password");
        assert!(call(
            &mut s,
            Some(&token),
            Action::Patients {
                query: String::new(),
                archived: false
            }
        )
        .is_err());
        assert!(call(&mut s, Some(&token), Action::Backup { path: None }).is_ok());
        assert_eq!(s.license_status().unwrap()["legacy"], true);
    }
    #[test]
    fn support_deadline_is_absolute_and_consumption_survives_restart() {
        let temp = tempfile::tempdir().unwrap();
        let root = temp.path().to_owned();
        let mut s = Service::open(root.clone()).unwrap();
        setup(&mut s);
        let id = grant(
            &mut s,
            Kind::TemporarySupport,
            None,
            "fictional-support-password",
        );
        let result = call(
            &mut s,
            None,
            Action::SupportLogin {
                id: id.clone(),
                password: "fictional-support-password".into(),
            },
        )
        .unwrap();
        let token = result["token"].as_str().unwrap();
        let remaining = s.support_remaining_fixture().unwrap();
        assert!(remaining <= std::time::Duration::from_secs(4 * 3600));
        assert!(remaining > std::time::Duration::from_secs(4 * 3600 - 60));
        call(&mut s, Some(token), Action::Touch).unwrap();
        assert!(s.support_remaining_fixture().unwrap() <= remaining);
        call(&mut s, Some(token), Action::Backup { path: None }).unwrap();
        assert!(s
            .db
            .query_row(
                "SELECT EXISTS(SELECT 1 FROM audit WHERE action='SUPPORT_BACKUP_CREATE')",
                [],
                |r| r.get::<_, bool>(0)
            )
            .unwrap());
        s.expire_support_fixture();
        assert!(call(&mut s, Some(token), Action::Touch).is_err());
        drop(s);
        let mut s = Service::open(root).unwrap();
        assert!(call(
            &mut s,
            None,
            Action::SupportLogin {
                id,
                password: "fictional-support-password".into()
            }
        )
        .is_err());
        login(&mut s, "fictional-admin-password");
    }
    #[test]
    fn failed_effects_roll_back_and_backup_failure_blocks_reset() {
        let temp = tempfile::tempdir().unwrap();
        let mut s = Service::open(temp.path().into()).unwrap();
        let id = grant(&mut s, Kind::Initial, None, "fictional-admin-password");
        assert!(call(
            &mut s,
            None,
            Action::Setup {
                professional_name: "admin".into(),
                professional_password: "fictional-password".into(),
                recovery_password: "fictional-backup-password".into()
            }
        )
        .is_err());
        assert_eq!(
            s.db.query_row("SELECT count(*) FROM users", [], |r| r.get::<_, i64>(0))
                .unwrap(),
            0
        );
        assert!(s.pending_grant(Some(&id), Kind::Initial).is_ok());
        call(
            &mut s,
            None,
            Action::Setup {
                professional_name: "nutri".into(),
                professional_password: "fictional-password".into(),
                recovery_password: "fictional-backup-password".into(),
            },
        )
        .unwrap();
        let token = login(&mut s, "fictional-admin-password");
        s.db.execute("INSERT INTO patients(id,cpf,search,payload,created_at,updated_at) VALUES('fixture','fictional','fixture','{}','2026-10-08','2026-10-08')",[]).unwrap();
        let id = grant(&mut s, Kind::ResetClinic, None, "");
        for file in std::fs::read_dir(s.root.join("backups")).unwrap() {
            std::fs::remove_file(file.unwrap().path()).unwrap();
        }
        std::fs::remove_dir(s.root.join("backups")).unwrap();
        std::fs::write(s.root.join("backups"), b"fixture obstruction").unwrap();
        assert!(call(
            &mut s,
            Some(&token),
            Action::ResetClinic {
                id: id.clone(),
                confirmed: true
            }
        )
        .is_err());
        assert!(s.pending_grant(Some(&id), Kind::ResetClinic).is_ok());
        assert_eq!(
            s.db.query_row("SELECT count(*) FROM patients", [], |r| r.get::<_, i64>(0))
                .unwrap(),
            1
        );
    }
    #[test]
    fn migration_from_version_one_is_additive_and_transactional() {
        let temp = tempfile::tempdir().unwrap();
        let key = crate::security::random_key();
        let mut db = crate::database::open(&temp.path().join("fixture.db"), &key).unwrap();
        db.execute_batch(include_str!("../migrations/001_initial.sql"))
            .unwrap();
        db.pragma_update(None, "user_version", 1).unwrap();
        db.execute("INSERT INTO users(id,name,role,password_hash) VALUES('fixture','fixture','ADMIN','!disabled')",[]).unwrap();
        crate::database::migrate(&mut db).unwrap();
        crate::database::migrate(&mut db).unwrap();
        assert_eq!(
            db.pragma_query_value(None, "user_version", |r| r.get::<_, i64>(0))
                .unwrap(),
            2
        );
        assert_eq!(
            db.query_row("SELECT count(*) FROM users", [], |r| r.get::<_, i64>(0))
                .unwrap(),
            1
        );
        {
            let tx = db.transaction().unwrap();
            tx.execute("INSERT INTO license_state(singleton,installation_id,recipient) VALUES(1,'fixture','fixture')",[]).unwrap();
            assert!(tx.execute("INSERT INTO license_state(singleton,installation_id,recipient) VALUES(2,'bad','bad')",[]).is_err());
        }
        assert_eq!(
            db.query_row("SELECT count(*) FROM license_state", [], |r| r
                .get::<_, i64>(0))
                .unwrap(),
            0
        );
        crate::database::integrity(&db).unwrap();
    }
    #[test]
    fn interrupted_activation_rolls_back_users_audit_and_consumption() {
        let temp = tempfile::tempdir().unwrap();
        let mut s = Service::open(temp.path().into()).unwrap();
        let id = grant(&mut s, Kind::Initial, None, "fictional-admin-password");
        s.db.execute_batch("CREATE TEMP TRIGGER fixture_interrupt BEFORE UPDATE ON license_state BEGIN SELECT RAISE(ABORT,'fixture interruption'); END;").unwrap();
        let setup = || Action::Setup {
            professional_name: "nutri".into(),
            professional_password: "fictional-password".into(),
            recovery_password: "fictional-backup-password".into(),
        };
        assert!(call(&mut s, None, setup()).is_err());
        assert_eq!(
            s.db.query_row("SELECT count(*) FROM users", [], |r| r.get::<_, i64>(0))
                .unwrap(),
            0
        );
        assert!(s.pending_grant(Some(&id), Kind::Initial).is_ok());
        assert_eq!(
            s.db.query_row("SELECT count(*) FROM audit WHERE action='SETUP'", [], |r| r
                .get::<_, i64>(0))
                .unwrap(),
            0
        );
        s.db.execute_batch("DROP TRIGGER fixture_interrupt;")
            .unwrap();
        call(&mut s, None, setup()).unwrap();
        assert_eq!(s.license_status().unwrap()["licensed"], true);
    }
}
