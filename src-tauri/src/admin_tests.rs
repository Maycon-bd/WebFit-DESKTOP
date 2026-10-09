use crate::{
    admin::{self, Access},
    database,
    issuer_vault::{self, Vault},
    license, security,
    service::{Action, Command, Service},
};
use serde_json::Value;
use webfit_license_protocol::Kind;
const MASTER: &str = "fictional master phrase";
const RECOVERY: &str = "fictional recovery phrase";
fn call(s: &mut Service, token: Option<&str>, command: Action) -> crate::Result<Value> {
    s.execute(Command {
        token: token.map(str::to_owned),
        command,
    })
}
fn operation(s: &mut Service, token: &str, action: admin::Action) -> crate::Result<Value> {
    call(s, Some(token), Action::MasterOperation { action })
}
fn login(s: &mut Service) -> String {
    call(
        s,
        None,
        Action::MasterLogin {
            password: MASTER.into(),
        },
    )
    .unwrap()["token"]
        .as_str()
        .unwrap()
        .to_owned()
}
fn fixture() -> (tempfile::TempDir, Service) {
    let tmp = tempfile::tempdir().unwrap();
    let mut s = Service::open(tmp.path().join("clinical")).unwrap();
    s.master = Access::new(Some(security::hash_password(MASTER).unwrap()));
    (tmp, s)
}
fn prepared(s: &mut Service) {
    license::activate_fixture(s, "Administrator fixture", MASTER);
    call(
        s,
        None,
        Action::Setup {
            professional_name: "Professional fixture".into(),
            professional_password: "fictional professional password".into(),
            recovery_password: RECOVERY.into(),
        },
    )
    .unwrap();
}
fn import_issuer(tmp: &tempfile::TempDir, s: &mut Service, token: &str) -> [u8; 32] {
    let mut old = Vault::open(tmp.path().join("old-issuer")).unwrap();
    old.execute(issuer_vault::Action::Initialize { confirmed: true })
        .unwrap();
    let public = old.public_key().unwrap().unwrap();
    s.license_roots.push(public);
    let path = tmp.path().join("issuer.webfit-issuer-backup");
    old.execute(issuer_vault::Action::ExportBackup {
        path: path.to_string_lossy().into(),
        password: RECOVERY.into(),
    })
    .unwrap();
    operation(
        s,
        token,
        admin::Action::Issuer {
            action: issuer_vault::Action::ImportBackup {
                path: path.to_string_lossy().into(),
                password: RECOVERY.into(),
                confirmed: true,
            },
        },
    )
    .unwrap();
    public
}
#[test]
fn master_is_fail_closed_separate_from_clinical_and_revoked_on_lock_expiry_rotation() {
    let (_tmp, mut s) = fixture();
    s.master = Access::new(None);
    assert!(call(
        &mut s,
        None,
        Action::MasterLogin {
            password: MASTER.into()
        }
    )
    .is_err());
    s.master = Access::new(Some("malformed verifier".into()));
    assert!(!s.master.configured());
    s.master = Access::new(Some(security::hash_password(MASTER).unwrap()));
    assert!(call(
        &mut s,
        None,
        Action::MasterLogin {
            password: "wrong".into()
        }
    )
    .is_err());
    let token = login(&mut s);
    assert!(operation(&mut s, "forged", admin::Action::RevealDatabaseKey).is_err());
    prepared(&mut s);
    let clinical = call(
        &mut s,
        None,
        Action::Login {
            name: "Administrator fixture".into(),
            password: MASTER.into(),
        },
    )
    .unwrap()["token"]
        .as_str()
        .unwrap()
        .to_owned();
    assert!(operation(&mut s, &clinical, admin::Action::Status).is_err());
    assert!(operation(&mut s, &token, admin::Action::Status).is_ok());
    s.lock();
    assert!(operation(&mut s, &token, admin::Action::Status).is_err());
    let token = login(&mut s);
    s.master.expire();
    assert!(operation(&mut s, &token, admin::Action::Status).is_err());
    let old_key = s.key.to_vec();
    s.master = Access::new(Some(
        security::hash_password("fictional replacement master").unwrap(),
    ));
    assert!(call(
        &mut s,
        None,
        Action::MasterLogin {
            password: MASTER.into()
        }
    )
    .is_err());
    assert!(call(
        &mut s,
        None,
        Action::MasterLogin {
            password: "fictional replacement master".into()
        }
    )
    .is_ok());
    assert_eq!(s.key.as_slice(), old_key);
}
#[test]
fn fixed_key_opens_real_sqlcipher_and_never_appears_in_public_status_or_audit() {
    let (tmp, mut s) = fixture();
    prepared(&mut s);
    let token = login(&mut s);
    assert!(operation(&mut s, &token, admin::Action::RevealDatabaseKey).is_err());
    assert!(operation(
        &mut s,
        &token,
        admin::Action::EnableDatabase { confirmed: false }
    )
    .is_err());
    operation(
        &mut s,
        &token,
        admin::Action::EnableDatabase { confirmed: true },
    )
    .unwrap();
    let value = operation(&mut s, &token, admin::Action::RevealDatabaseKey).unwrap();
    let key = value["key"].as_str().unwrap().to_owned();
    assert_eq!(key.len(), 64);
    assert!(!call(&mut s, None, Action::MasterStatus)
        .unwrap()
        .to_string()
        .contains(&key));
    assert!(!call(&mut s, None, Action::Status)
        .unwrap()
        .to_string()
        .contains(&key));
    let records: String =
        s.db.query_row(
            "SELECT group_concat(action || ':' || result) FROM audit",
            [],
            |r| r.get(0),
        )
        .unwrap();
    assert!(!records.contains(&key));
    let path = s.root.join("health.db");
    drop(s);
    let db = rusqlite::Connection::open(&path).unwrap();
    db.pragma_update(None, "key", format!("x'{key}'")).unwrap();
    db.pragma_update(None, "foreign_keys", "ON").unwrap();
    assert_eq!(
        db.query_row("SELECT count(*) FROM users", [], |r| r.get::<_, i64>(0))
            .unwrap(),
        2
    );
    db.execute(
        "INSERT INTO settings(name,value) VALUES('fixture:external','persisted')",
        [],
    )
    .unwrap();
    database::integrity(&db).unwrap();
    drop(db);
    let mut reopened = Service::open(tmp.path().join("clinical")).unwrap();
    reopened.master = Access::new(Some(security::hash_password(MASTER).unwrap()));
    let token = login(&mut reopened);
    assert_eq!(
        operation(&mut reopened, &token, admin::Action::RevealDatabaseKey).unwrap()["key"],
        key
    );
    assert_eq!(
        reopened
            .db
            .query_row(
                "SELECT value FROM settings WHERE name='fixture:external'",
                [],
                |r| r.get::<_, String>(0)
            )
            .unwrap(),
        "persisted"
    );
    assert!(database::open(&path, &[0; 32]).is_err());
}
#[test]
fn failed_backup_or_audit_does_not_release_database_key() {
    let (_tmp, mut s) = fixture();
    prepared(&mut s);
    let token = login(&mut s);
    std::fs::write(s.root.join("backups"), b"fixture obstruction").unwrap();
    assert!(operation(
        &mut s,
        &token,
        admin::Action::EnableDatabase { confirmed: true }
    )
    .is_err());
    assert!(operation(&mut s, &token, admin::Action::RevealDatabaseKey).is_err());
    std::fs::remove_file(s.root.join("backups")).unwrap();
    s.db.execute_batch("CREATE TRIGGER fixture_fail_master BEFORE INSERT ON audit WHEN NEW.action='MASTER_DATABASE_ENABLE' BEGIN SELECT RAISE(ABORT,'fixture audit failure'); END;").unwrap();
    assert!(operation(
        &mut s,
        &token,
        admin::Action::EnableDatabase { confirmed: true }
    )
    .is_err());
    assert!(!s.db.query_row("SELECT EXISTS(SELECT 1 FROM settings WHERE name='admin:database_access' AND value='enabled')", [], |r| r.get::<_, bool>(0)).unwrap());
    s.db.execute_batch("DROP TRIGGER fixture_fail_master")
        .unwrap();
    operation(
        &mut s,
        &token,
        admin::Action::EnableDatabase { confirmed: true },
    )
    .unwrap();
    s.db.execute_batch("CREATE TRIGGER fixture_fail_master BEFORE INSERT ON audit BEGIN SELECT RAISE(ABORT,'fixture audit failure'); END;").unwrap();
    assert!(operation(&mut s, &token, admin::Action::RevealDatabaseKey).is_err());
}
#[test]
fn trusted_cofre_import_and_local_issuance_preserve_identity_and_existing_protocol() {
    let (tmp, mut s) = fixture();
    let token = login(&mut s);
    let public = import_issuer(&tmp, &mut s, &token);
    assert_eq!(
        Vault::open(s.root.join("admin-issuer"))
            .unwrap()
            .public_key()
            .unwrap(),
        Some(public)
    );
    assert!(operation(
        &mut s,
        &token,
        admin::Action::Issuer {
            action: issuer_vault::Action::Initialize { confirmed: true }
        }
    )
    .is_err());
    let initial = operation(
        &mut s,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::Initial,
            source: None,
        },
    )
    .unwrap();
    assert_eq!(initial["imported"], true);
    call(
        &mut s,
        None,
        Action::Setup {
            professional_name: "Professional fixture".into(),
            professional_password: "fictional professional password".into(),
            recovery_password: RECOVERY.into(),
        },
    )
    .unwrap();
    assert!(operation(
        &mut s,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::Initial,
            source: None
        }
    )
    .is_err());
    let support = operation(
        &mut s,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::TemporarySupport,
            source: None,
        },
    )
    .unwrap();
    let id = support["id"].as_str().unwrap().to_owned();
    let clinical = operation(
        &mut s,
        &token,
        admin::Action::StartSupport { id: id.clone() },
    )
    .unwrap();
    assert_eq!(clinical["user"]["role"], "ADMIN");
    assert!(operation(&mut s, &token, admin::Action::StartSupport { id }).is_err());
    let key = s.key.to_vec();
    let reset = operation(
        &mut s,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::ResetClinic,
            source: None,
        },
    )
    .unwrap();
    operation(
        &mut s,
        &token,
        admin::Action::LicenseOperation {
            command: Box::new(Action::ResetClinic {
                id: reset["id"].as_str().unwrap().into(),
                confirmed: true,
            }),
        },
    )
    .unwrap();
    assert_eq!(s.key.as_slice(), key);
    assert!(s.licensed().unwrap());
    assert!(operation(&mut s, &token, admin::Action::Status).is_err());
    let token = login(&mut s);
    let recover = operation(
        &mut s,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::AdminRecovery,
            source: None,
        },
    )
    .unwrap();
    operation(
        &mut s,
        &token,
        admin::Action::LicenseOperation {
            command: Box::new(Action::RecoverAdministrator {
                id: recover["id"].as_str().unwrap().into(),
                confirmed: true,
            }),
        },
    )
    .unwrap();
    assert_eq!(s.key.as_slice(), key);
}
#[test]
fn different_issuer_backup_is_rejected_before_replacing_existing_identity() {
    let (tmp, mut s) = fixture();
    let token = login(&mut s);
    let public = import_issuer(&tmp, &mut s, &token);
    let mut other = Vault::open(tmp.path().join("other")).unwrap();
    other
        .execute(issuer_vault::Action::Initialize { confirmed: true })
        .unwrap();
    let path = tmp.path().join("other.webfit-issuer-backup");
    other
        .execute(issuer_vault::Action::ExportBackup {
            path: path.to_string_lossy().into(),
            password: RECOVERY.into(),
        })
        .unwrap();
    assert!(operation(
        &mut s,
        &token,
        admin::Action::Issuer {
            action: issuer_vault::Action::ImportBackup {
                path: path.to_string_lossy().into(),
                password: RECOVERY.into(),
                confirmed: true
            }
        }
    )
    .is_err());
    assert_eq!(
        Vault::open(s.root.join("admin-issuer"))
            .unwrap()
            .public_key()
            .unwrap(),
        Some(public)
    );
    assert!(operation(
        &mut s,
        &token,
        admin::Action::LicenseOperation {
            command: Box::new(Action::Users)
        }
    )
    .is_err());
}

#[test]
fn integrated_initial_file_and_code_activate_empty_destination_without_second_login() {
    let (tmp, mut s) = fixture();
    prepared(&mut s);
    let token = login(&mut s);
    let public = import_issuer(&tmp, &mut s, &token);
    let path = tmp.path().join("portable.webfit-license");
    assert!(operation(
        &mut s,
        &token,
        admin::Action::EmitInitialCode {
            path: path.to_string_lossy().into(),
            confirmed: false
        }
    )
    .is_err());
    assert!(!path.exists());
    let issued = operation(
        &mut s,
        &token,
        admin::Action::EmitInitialCode {
            path: path.to_string_lossy().into(),
            confirmed: true,
        },
    )
    .unwrap();
    let original = std::fs::read(&path).unwrap();
    assert!(operation(
        &mut s,
        &token,
        admin::Action::EmitInitialCode {
            path: path.to_string_lossy().into(),
            confirmed: true
        }
    )
    .is_err());
    assert_eq!(std::fs::read(&path).unwrap(), original);
    let mut destination = Service::open(tmp.path().join("destination")).unwrap();
    destination.license_roots = vec![public];
    destination.master = Access::new(Some(security::hash_password(MASTER).unwrap()));
    let destination_token = login(&mut destination);
    operation(
        &mut destination,
        &destination_token,
        admin::Action::LicenseOperation {
            command: Box::new(Action::ActivateLicenseCode {
                path: path.to_string_lossy().into(),
                code: issued["code"].as_str().unwrap().into(),
            }),
        },
    )
    .unwrap();
    call(
        &mut destination,
        None,
        Action::Setup {
            professional_name: "Professional fixture".into(),
            professional_password: "fictional professional password".into(),
            recovery_password: RECOVERY.into(),
        },
    )
    .unwrap();
    assert_eq!(
        operation(
            &mut destination,
            &destination_token,
            admin::Action::EnterClinic
        )
        .unwrap()["user"]["role"],
        "ADMIN"
    );
    assert!(operation(
        &mut s,
        &token,
        admin::Action::LicenseOperation {
            command: Box::new(Action::ActivateLicenseCode {
                path: path.to_string_lossy().into(),
                code: issued["code"].as_str().unwrap().into()
            })
        }
    )
    .is_err());
}

#[test]
fn master_restore_and_transfer_preserve_key_validate_backup_and_revoke_sessions() {
    let (tmp, mut source) = fixture();
    prepared(&mut source);
    let key = source.key.to_vec();
    let source_license = source.license_status().unwrap()["licenseId"]
        .as_str()
        .unwrap()
        .to_owned();
    let token = login(&mut source);
    let backup = tmp.path().join("clinical.webfit-backup");
    operation(
        &mut source,
        &token,
        admin::Action::Backup {
            path: Some(backup.to_string_lossy().into()),
        },
    )
    .unwrap();
    let restore = |password: &str, confirmed| admin::Action::Restore {
        path: backup.to_string_lossy().into(),
        password: password.into(),
        confirmed,
    };
    assert!(operation(&mut source, &token, restore(RECOVERY, false)).is_err());
    assert!(operation(&mut source, &token, restore("wrong", true)).is_err());
    assert!(operation(&mut source, &token, admin::Action::Status).is_ok());
    operation(&mut source, &token, restore(RECOVERY, true)).unwrap();
    assert!(operation(&mut source, &token, admin::Action::Status).is_err());
    assert_eq!(source.key.as_slice(), key);

    let (_destination_tmp, mut destination) = fixture();
    let token = login(&mut destination);
    import_issuer(&tmp, &mut destination, &token);
    assert!(operation(
        &mut destination,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::TransferRecovery,
            source: None
        }
    )
    .is_err());
    let issued = operation(
        &mut destination,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::TransferRecovery,
            source: Some(source_license),
        },
    )
    .unwrap();
    assert_eq!(issued["imported"], true);
    let action = |password: &str| admin::Action::LicenseOperation {
        command: Box::new(Action::TransferRecovery {
            id: issued["id"].as_str().unwrap().into(),
            path: backup.to_string_lossy().into(),
            password: password.into(),
            professional_name: "Destination fixture".into(),
            professional_password: "fictional professional password".into(),
            recovery_password: RECOVERY.into(),
            confirmed: true,
        }),
    };
    assert!(operation(&mut destination, &token, action("wrong")).is_err());
    operation(&mut destination, &token, action(RECOVERY)).unwrap();
    assert!(operation(&mut destination, &token, admin::Action::Status).is_err());
    let token = login(&mut destination);
    assert_eq!(
        operation(&mut destination, &token, admin::Action::EnterClinic).unwrap()["user"]["role"],
        "ADMIN"
    );
    database::integrity(&destination.db).unwrap();
}

#[test]
fn emission_returns_one_time_code_and_artifact_if_final_audit_fails_but_requires_begin_audit() {
    let (tmp, mut s) = fixture();
    prepared(&mut s);
    let token = login(&mut s);
    import_issuer(&tmp, &mut s, &token);
    s.db.execute_batch("CREATE TRIGGER fixture_fail_issue BEFORE INSERT ON audit WHEN NEW.action='MASTER_LICENSE_ISSUE' BEGIN SELECT RAISE(ABORT,'fixture audit failure'); END;").unwrap();
    let path = tmp.path().join("audited.webfit-license");
    let issued = operation(
        &mut s,
        &token,
        admin::Action::EmitInitialCode {
            path: path.to_string_lossy().into(),
            confirmed: true,
        },
    )
    .unwrap();
    assert!(issued["auditWarning"].is_string());
    assert!(issued["code"].is_string());
    let content = std::fs::read_to_string(&path).unwrap();
    let mut destination = Service::open(tmp.path().join("audit-destination")).unwrap();
    destination.license_roots = s.license_roots.clone();
    destination
        .import_initial_code(&content, issued["code"].as_str().unwrap())
        .unwrap();
    let local = operation(
        &mut s,
        &token,
        admin::Action::EmitLocal {
            kind: Kind::TemporarySupport,
            source: None,
        },
    )
    .unwrap();
    assert_eq!(local["imported"], true);
    assert!(local["auditWarning"].is_string());
    assert!(std::path::Path::new(local["path"].as_str().unwrap()).exists());
    s.db.execute_batch("DROP TRIGGER fixture_fail_issue; CREATE TRIGGER fixture_fail_begin BEFORE INSERT ON audit WHEN NEW.action='MASTER_LICENSE_ISSUE_BEGIN' BEGIN SELECT RAISE(ABORT,'fixture audit failure'); END;").unwrap();
    let blocked = tmp.path().join("blocked.webfit-license");
    assert!(operation(
        &mut s,
        &token,
        admin::Action::EmitInitialCode {
            path: blocked.to_string_lossy().into(),
            confirmed: true
        }
    )
    .is_err());
    assert!(!blocked.exists());
}
