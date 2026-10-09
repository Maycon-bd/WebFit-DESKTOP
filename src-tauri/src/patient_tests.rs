use crate::{
    database, security,
    service::{Action, Command, Service},
};
use serde_json::{json, Value};

fn call(s: &mut Service, token: Option<&str>, command: Action) -> crate::Result<Value> {
    s.execute(Command {
        token: token.map(str::to_owned),
        command,
    })
}
fn login(s: &mut Service) -> String {
    call(
        s,
        None,
        Action::Login {
            name: "fixture-admin".into(),
            password: "fictional-admin-password".into(),
        },
    )
    .unwrap()["token"]
        .as_str()
        .unwrap()
        .into()
}
fn setup(s: &mut Service) -> String {
    crate::license::activate_fixture(s, "fixture-admin", "fictional-admin-password");
    call(
        s,
        None,
        Action::Setup {
            professional_name: "fixture-nutri".into(),
            professional_password: "fictional-professional-password".into(),
            recovery_password: "fictional-recovery-password".into(),
        },
    )
    .unwrap();
    login(s)
}
fn minimal() -> Value {
    json!({"name":"Fixture","birth":"1990-01-02","sex":"F"})
}
fn save(s: &mut Service, token: &str, patient: Value) -> String {
    call(s, Some(token), Action::SavePatient { id: None, patient }).unwrap()["id"]
        .as_str()
        .unwrap()
        .into()
}
fn read(s: &mut Service, token: &str, id: &str) -> Value {
    call(s, Some(token), Action::Patient { id: id.into() }).unwrap()
}

#[test]
fn patient_minimum_is_authorized_validated_and_numbers_are_server_owned() {
    let temp = tempfile::tempdir().unwrap();
    let mut s = Service::open(temp.path().into()).unwrap();
    assert!(call(
        &mut s,
        None,
        Action::SavePatient {
            id: None,
            patient: minimal()
        }
    )
    .is_err());
    let token = setup(&mut s);
    for (field, invalid) in [
        ("name", json!(" ")),
        ("birth", json!("")),
        ("birth", json!("2023-02-29")),
        ("birth", json!("2999-01-01")),
        ("sex", json!("")),
        ("sex", json!("outro")),
        ("cpf", json!("52998224726")),
        ("cpf", json!("letters52998224725")),
        ("cpf", json!(42)),
        ("email", json!("invalid")),
        ("guardian", json!({"cpf":"invalid"})),
        ("guardian", json!({"email":"invalid"})),
    ] {
        let mut patient = minimal();
        patient[field] = invalid;
        assert!(call(
            &mut s,
            Some(&token),
            Action::SavePatient { id: None, patient }
        )
        .is_err());
    }
    for field in ["name", "birth", "sex"] {
        let mut patient = minimal();
        patient.as_object_mut().unwrap().remove(field);
        assert!(call(
            &mut s,
            Some(&token),
            Action::SavePatient { id: None, patient }
        )
        .is_err());
    }
    let a = save(&mut s, &token, minimal());
    let mut patient = minimal();
    patient["cpf"] = json!("  ");
    patient["guardian"] = json!({"name":"Fixture guardian"});
    patient["internalNumber"] = json!(999);
    let b = save(&mut s, &token, patient);
    assert_ne!(a, b);
    assert_eq!(read(&mut s, &token, &a)["internalNumber"], 1);
    assert_eq!(read(&mut s, &token, &b)["internalNumber"], 2);
    assert_eq!(
        s.db.query_row("SELECT count(*) FROM patients WHERE cpf IS NULL", [], |r| r
            .get::<_, i64>(0))
            .unwrap(),
        2
    );
    let mut edit = minimal();
    edit["internalNumber"] = json!(300);
    edit["cpf"] = json!("529.982.247-25");
    call(
        &mut s,
        Some(&token),
        Action::SavePatient {
            id: Some(a.clone()),
            patient: edit.clone(),
        },
    )
    .unwrap();
    assert_eq!(read(&mut s, &token, &a)["internalNumber"], 1);
    call(
        &mut s,
        Some(&token),
        Action::ArchivePatient {
            id: a.clone(),
            archived: true,
        },
    )
    .unwrap();
    assert!(call(
        &mut s,
        Some(&token),
        Action::SavePatient {
            id: None,
            patient: edit
        }
    )
    .is_err());
    call(
        &mut s,
        Some(&token),
        Action::SavePatient {
            id: Some(a.clone()),
            patient: minimal(),
        },
    )
    .unwrap();
    let rows = call(
        &mut s,
        Some(&token),
        Action::Patients {
            query: "1".into(),
            archived: true,
        },
    )
    .unwrap();
    assert_eq!(rows.as_array().unwrap().len(), 1);
    assert_eq!(rows[0]["id"], a);
    assert_eq!(rows[0]["cpf"], "");
    drop(s);
    let mut s = Service::open(temp.path().into()).unwrap();
    let token = login(&mut s);
    assert_eq!(read(&mut s, &token, &b)["internalNumber"], 2);
    assert_eq!(read(&mut s, &token, &a)["archived"], true);
}

fn legacy_database(path: &std::path::Path, key: &[u8], version: i64) -> rusqlite::Connection {
    let db = database::open(path, key).unwrap();
    db.execute_batch(include_str!("../migrations/001_initial.sql"))
        .unwrap();
    if version == 2 {
        db.execute_batch(include_str!("../migrations/002_license.sql"))
            .unwrap();
    }
    db.pragma_update(None, "user_version", version).unwrap();
    db.execute_batch("INSERT INTO users(id,name,role,password_hash) VALUES('u','Fixture','ADMIN','!disabled');
        INSERT INTO patients VALUES('patient','52998224725','fixture','{\"sex\":\"legado\"}',1,'2020','2021');
        INSERT INTO tags VALUES('tag','Fixture',1);
        INSERT INTO patient_tags VALUES('patient','tag');
        INSERT INTO prescriptions VALUES('p1','patient','u',NULL,1,'FINAL','{}','2020','2020');
        INSERT INTO prescriptions VALUES('p2','patient','u','p1',2,'DRAFT','{}','2021','2021');
        INSERT INTO audit(id,actor_type,user_id,at,action,entity_type,result) VALUES('audit','USER','u','2020','FIXTURE','PATIENT','SUCCESS');").unwrap();
    db
}
#[test]
fn patient_migrations_preserve_references_and_encrypted_safety_snapshot() {
    for version in [1, 2] {
        let temp = tempfile::tempdir().unwrap();
        let key = security::random_key();
        let mut db = legacy_database(&temp.path().join("fixture.db"), &key, version);
        database::migrate_installed(&mut db, temp.path(), &key).unwrap();
        database::migrate_installed(&mut db, temp.path(), &key).unwrap();
        assert_eq!(
            db.pragma_query_value(None, "user_version", |r| r.get::<_, i64>(0))
                .unwrap(),
            3
        );
        assert_eq!(
            db.pragma_query_value(None, "foreign_keys", |r| r.get::<_, i64>(0))
                .unwrap(),
            1
        );
        assert_eq!(
            db.query_row("SELECT payload FROM patients", [], |r| r
                .get::<_, String>(0))
                .unwrap(),
            "{\"sex\":\"legado\"}"
        );
        assert_eq!(
            db.query_row("SELECT internal_number FROM patients", [], |r| r
                .get::<_, i64>(0))
                .unwrap(),
            1
        );
        assert_eq!(
            db.query_row("SELECT count(*) FROM prescriptions", [], |r| r
                .get::<_, i64>(0))
                .unwrap(),
            2
        );
        assert_eq!(
            db.query_row("SELECT count(*) FROM patient_tags", [], |r| r
                .get::<_, i64>(0))
                .unwrap(),
            1
        );
        assert_eq!(
            db.query_row("SELECT count(*) FROM audit", [], |r| r.get::<_, i64>(0))
                .unwrap(),
            1
        );
        database::integrity(&db).unwrap();
        let snapshots: Vec<_> = std::fs::read_dir(temp.path().join("migration-snapshots"))
            .unwrap()
            .map(|r| r.unwrap().path())
            .collect();
        assert_eq!(snapshots.len(), 1);
        assert!(!std::fs::read(&snapshots[0])
            .unwrap()
            .starts_with(b"SQLite format 3"));
        let snapshot = database::open(&snapshots[0], &key).unwrap();
        database::integrity(&snapshot).unwrap();
        assert_eq!(
            snapshot
                .pragma_query_value(None, "user_version", |r| r.get::<_, i64>(0))
                .unwrap(),
            version
        );
        assert_eq!(
            snapshot
                .query_row("SELECT count(*) FROM prescriptions", [], |r| r
                    .get::<_, i64>(0))
                .unwrap(),
            2
        );
    }
}
#[test]
fn failed_snapshot_or_migration_preserves_legacy_and_future_schema_is_rejected() {
    let temp = tempfile::tempdir().unwrap();
    let key = security::random_key();
    let mut db = legacy_database(&temp.path().join("fixture.db"), &key, 1);
    std::fs::write(
        temp.path().join("migration-snapshots"),
        b"fixture obstruction",
    )
    .unwrap();
    assert!(database::migrate_installed(&mut db, temp.path(), &key).is_err());
    assert_eq!(
        db.pragma_query_value(None, "user_version", |r| r.get::<_, i64>(0))
            .unwrap(),
        1
    );
    db.execute_batch("CREATE TABLE patients_new(fixture TEXT)")
        .unwrap();
    assert!(database::migrate(&mut db).is_err());
    assert_eq!(
        db.pragma_query_value(None, "user_version", |r| r.get::<_, i64>(0))
            .unwrap(),
        1
    );
    assert_eq!(
        db.query_row("SELECT count(*) FROM prescriptions", [], |r| r
            .get::<_, i64>(0))
            .unwrap(),
        2
    );
    database::integrity(&db).unwrap();
    db.pragma_update(None, "user_version", 4).unwrap();
    assert!(database::migrate(&mut db).is_err());
    assert_eq!(
        db.pragma_query_value(None, "user_version", |r| r.get::<_, i64>(0))
            .unwrap(),
        4
    );
}
#[test]
fn patient_backup_restores_numbers_and_does_not_reuse_later_numbers() {
    let temp = tempfile::tempdir().unwrap();
    let mut s = Service::open(temp.path().into()).unwrap();
    let token = setup(&mut s);
    let a = save(&mut s, &token, minimal());
    let b = save(&mut s, &token, minimal());
    // Source counter can be higher than the largest surviving row.
    let removed = save(&mut s, &token, minimal());
    s.db.execute("DELETE FROM patients WHERE id=?1", [&removed])
        .unwrap();
    let path = temp.path().join("fixture.webfit-backup");
    call(
        &mut s,
        Some(&token),
        Action::Backup {
            path: Some(path.to_string_lossy().into()),
        },
    )
    .unwrap();
    let c = save(&mut s, &token, minimal());
    assert_eq!(read(&mut s, &token, &c)["internalNumber"], 4);
    assert!(call(
        &mut s,
        Some(&token),
        Action::Restore {
            path: path.to_string_lossy().into(),
            password: "incorrect".into(),
            confirmed: true
        }
    )
    .is_err());
    assert_eq!(read(&mut s, &token, &c)["internalNumber"], 4);
    call(
        &mut s,
        Some(&token),
        Action::Restore {
            path: path.to_string_lossy().into(),
            password: "fictional-recovery-password".into(),
            confirmed: true,
        },
    )
    .unwrap();
    assert!(call(&mut s, Some(&token), Action::Patient { id: a.clone() }).is_err());
    let token = login(&mut s);
    assert_eq!(read(&mut s, &token, &a)["internalNumber"], 1);
    assert_eq!(read(&mut s, &token, &b)["internalNumber"], 2);
    let d = save(&mut s, &token, minimal());
    assert_eq!(read(&mut s, &token, &d)["internalNumber"], 5);
    database::integrity(&s.db).unwrap();
}

// Test-only construction of a genuine pre-numbering schema, inside a temporary
// encrypted fixture. No product downgrade path or installed database is used.
fn downgrade_fixture(s: &mut Service, version: i64) {
    let tx = s.db.transaction().unwrap();
    tx.execute_batch("PRAGMA defer_foreign_keys=ON;
        CREATE TABLE patients_legacy (
          id TEXT PRIMARY KEY, cpf TEXT NOT NULL UNIQUE, search TEXT NOT NULL,
          payload TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
        INSERT INTO patients_legacy SELECT id,cpf,search,payload,archived,created_at,updated_at FROM patients;
        DROP TABLE patients;
        ALTER TABLE patients_legacy RENAME TO patients;").unwrap();
    if version == 1 {
        tx.execute_batch("DROP TABLE license_authorizations; DROP TABLE license_requests; DROP TABLE license_state;").unwrap();
    }
    tx.pragma_update(None, "user_version", version).unwrap();
    database::integrity(&tx).unwrap();
    tx.commit().unwrap();
}
#[test]
fn backup_v2_restores_known_numbers_and_allocates_unknown_uuids_above_destination_counter() {
    let temp = tempfile::tempdir().unwrap();
    let mut s = Service::open(temp.path().into()).unwrap();
    let token = setup(&mut s);
    let mut patient = minimal();
    patient["cpf"] = json!("52998224725");
    let a = save(&mut s, &token, patient.clone());
    patient["cpf"] = json!("11144477735");
    let b = save(&mut s, &token, patient);
    downgrade_fixture(&mut s, 2);
    let path = temp.path().join("legacy.webfit-backup");
    s.create_backup(Some(path.clone()), None).unwrap();
    database::migrate_installed(&mut s.db, &s.root, &s.key).unwrap();
    s.db.execute("DELETE FROM patients WHERE id=?1", [&a])
        .unwrap();
    s.db.execute("UPDATE patients SET internal_number=245 WHERE id=?1", [&b])
        .unwrap();
    s.db.execute(
        "UPDATE sqlite_sequence SET seq=245 WHERE name='patients'",
        [],
    )
    .unwrap();
    let later = save(&mut s, &token, minimal());
    assert_eq!(read(&mut s, &token, &later)["internalNumber"], 246);
    call(
        &mut s,
        Some(&token),
        Action::Restore {
            path: path.to_string_lossy().into(),
            password: "fictional-recovery-password".into(),
            confirmed: true,
        },
    )
    .unwrap();
    let token = login(&mut s);
    assert_eq!(read(&mut s, &token, &b)["internalNumber"], 245);
    assert_eq!(read(&mut s, &token, &a)["internalNumber"], 247);
    let next = save(&mut s, &token, minimal());
    assert_eq!(read(&mut s, &token, &next)["internalNumber"], 248);
    database::integrity(&s.db).unwrap();
}
#[test]
fn backups_v1_and_v3_transfer_with_number_and_source_counter_preserved() {
    use sha2::{Digest, Sha256};
    use webfit_license_protocol::{self as protocol, Kind, Request};
    for version in [1, 3] {
        let temp = tempfile::tempdir().unwrap();
        let mut source = Service::open(temp.path().join("source")).unwrap();
        let token = setup(&mut source);
        let mut patient = minimal();
        patient["cpf"] = json!("52998224725");
        let id = save(&mut source, &token, patient);
        if version == 1 {
            downgrade_fixture(&mut source, 1);
        } else {
            // No surviving row holds the high number. A new destination must still
            // advance past it; MAX(internal_number) alone is insufficient.
            for _ in 0..2 {
                let removed = save(&mut source, &token, minimal());
                source
                    .db
                    .execute("DELETE FROM patients WHERE id=?1", [&removed])
                    .unwrap();
            }
        }
        let path = temp.path().join("transfer.webfit-backup");
        source.create_backup(Some(path.clone()), None).unwrap();
        let mut target = Service::open(temp.path().join("target")).unwrap();
        let signing = protocol::signing_key();
        target
            .license_roots
            .push(signing.verifying_key().to_bytes());
        let hash = format!("{:x}", Sha256::digest(std::fs::read(&path).unwrap()));
        let request: Request = serde_json::from_value(
            target
                .license_request(Kind::TransferRecovery, Some(hash))
                .unwrap()["request"]
                .clone(),
        )
        .unwrap();
        let envelope = protocol::issue(
            request,
            &signing,
            Some(protocol::credential("fixture-admin", "fictional-admin-password").unwrap()),
        )
        .unwrap();
        target
            .import_license(&serde_json::to_string(&envelope).unwrap())
            .unwrap();
        call(
            &mut target,
            None,
            Action::TransferRecovery {
                id: envelope.id.to_string(),
                path: path.to_string_lossy().into(),
                password: "fictional-recovery-password".into(),
                professional_name: "new-fixture-nutri".into(),
                professional_password: "fictional-professional-password".into(),
                recovery_password: "fictional-destination-recovery".into(),
                confirmed: true,
            },
        )
        .unwrap();
        let token = login(&mut target);
        assert_eq!(read(&mut target, &token, &id)["internalNumber"], 1);
        let next = save(&mut target, &token, minimal());
        assert_eq!(
            read(&mut target, &token, &next)["internalNumber"],
            if version == 1 { 2 } else { 4 }
        );
        database::integrity(&target.db).unwrap();
    }
}
