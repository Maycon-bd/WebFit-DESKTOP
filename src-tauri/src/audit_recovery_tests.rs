//! RF-AUD-001 and RF-BKP-001..003: only fictitious, isolated installations.
use crate::service::{Action, AuditFilter, Command, Service};
use serde_json::{json, Value};

fn call(service: &mut Service, token: Option<&str>, command: Action) -> crate::Result<Value> {
    service.execute(Command {
        token: token.map(str::to_owned),
        command,
    })
}
fn session(service: &mut Service) -> String {
    crate::license::activate_fixture(service, "admin fixture", "senha ficticia segura");
    call(
        service,
        None,
        Action::Setup {
            professional_name: "nutri fixture".into(),
            professional_password: "senha ficticia nutri".into(),
            recovery_password: "recuperacao ficticia segura".into(),
        },
    )
    .unwrap();
    call(
        service,
        None,
        Action::Login {
            name: "admin fixture".into(),
            password: "senha ficticia segura".into(),
        },
    )
    .unwrap()["token"]
        .as_str()
        .unwrap()
        .to_owned()
}
fn filter() -> AuditFilter {
    AuditFilter {
        from: Some("2020-01-01T00:00:00Z".into()),
        to: Some("2100-01-01T00:00:00Z".into()),
        action: Some("FIXTURE".into()),
        ..Default::default()
    }
}
fn event(service: &Service, id: &str, workspace: &str, at: &str) {
    service.db.execute("INSERT INTO audit(id,actor_type,at,workspace,action,entity_type,result) VALUES(?1,'SYSTEM',?2,?3,'FIXTURE','BACKUP','SUCCESS')", rusqlite::params![id,at,workspace]).unwrap();
}

#[test]
fn audit_rejects_foreign_workspace_in_list_detail_and_unauthenticated_access() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    event(&s, "foreign", "EDUCATION", "2020-01-01T00:00:00+00:00");
    event(&s, "health", "HEALTH", "2020-01-01T00:00:00+00:00");
    let page = call(&mut s, Some(&t), Action::Audit { filter: filter() }).unwrap();
    assert_eq!(page["items"].as_array().unwrap().len(), 1);
    assert_eq!(page["items"][0]["id"], "health");
    assert!(call(
        &mut s,
        Some(&t),
        Action::AuditDetail {
            id: "foreign".into()
        }
    )
    .is_err());
    assert!(call(&mut s, None, Action::Audit { filter: filter() }).is_err());
    assert!(call(
        &mut s,
        None,
        Action::AuditDetail {
            id: "health".into()
        }
    )
    .is_err());
}

#[test]
fn audit_cursor_survives_query_failure_and_freezes_later_events() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    for index in 0..125 {
        event(
            &s,
            &format!("fixture-{index:03}"),
            "HEALTH",
            "2020-01-01T00:00:00+00:00",
        );
    }
    let first = call(&mut s, Some(&t), Action::Audit { filter: filter() }).unwrap();
    assert_eq!(first["items"].as_array().unwrap().len(), 50);
    let cursor = first["cursor"].as_str().unwrap().to_owned();
    s.db.execute_batch("ALTER TABLE audit RENAME TO fixture_unavailable;")
        .unwrap();
    assert!(call(
        &mut s,
        Some(&t),
        Action::Audit {
            filter: AuditFilter {
                cursor: Some(cursor.clone()),
                ..Default::default()
            }
        }
    )
    .is_err());
    s.db.execute_batch("ALTER TABLE fixture_unavailable RENAME TO audit;")
        .unwrap();
    event(&s, "later", "HEALTH", &chrono::Utc::now().to_rfc3339());
    let second = call(
        &mut s,
        Some(&t),
        Action::Audit {
            filter: AuditFilter {
                cursor: Some(cursor),
                ..Default::default()
            },
        },
    )
    .unwrap();
    let last = call(
        &mut s,
        Some(&t),
        Action::Audit {
            filter: AuditFilter {
                cursor: Some(second["cursor"].as_str().unwrap().into()),
                ..Default::default()
            },
        },
    )
    .unwrap();
    let ids: Vec<_> = [&first, &second, &last]
        .into_iter()
        .flat_map(|p| {
            p["items"]
                .as_array()
                .unwrap()
                .iter()
                .map(|e| e["id"].as_str().unwrap())
        })
        .collect();
    assert_eq!(ids.len(), 125);
    assert_eq!(
        ids.iter()
            .copied()
            .collect::<std::collections::HashSet<_>>()
            .len(),
        125
    );
    assert!(!ids.contains(&"later"));
    assert!(ids.windows(2).all(|pair| pair[0] > pair[1]));
    assert!(last["cursor"].is_null());
}

#[test]
fn audit_filters_use_and_and_half_open_utc_interval() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    for (id, at) in [
        ("before", "2019-12-31T23:59:59+00:00"),
        ("lower", "2020-01-01T00:00:00+00:00"),
        ("upper", "2020-01-02T00:00:00+00:00"),
    ] {
        event(&s, id, "HEALTH", at);
    }
    s.db.execute("INSERT INTO audit(id,actor_type,at,action,entity_type,result) VALUES('denied','SYSTEM','2020-01-01T00:00:00+00:00','FIXTURE','BACKUP','DENIED')", []).unwrap();
    let f = AuditFilter {
        to: Some("2020-01-02T03:00:00+03:00".into()),
        entity: Some("BACKUP".into()),
        result: Some("SUCCESS".into()),
        ..filter()
    };
    let page = call(&mut s, Some(&t), Action::Audit { filter: f }).unwrap();
    assert_eq!(page["items"].as_array().unwrap().len(), 1);
    assert_eq!(page["items"][0]["id"], "lower");
    assert!(s
        .db
        .execute("UPDATE audit SET result='FAILURE'", [])
        .is_err());
    assert!(s.db.execute("DELETE FROM audit", []).is_err());
}

#[test]
fn required_audit_failure_rolls_back_profile_and_prevents_audit_opening() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    let old = call(&mut s, Some(&t), Action::Profile).unwrap();
    s.db.execute_batch("CREATE TEMP TRIGGER fixture_audit_failure BEFORE INSERT ON audit BEGIN SELECT RAISE(ABORT,'fixture failure'); END;").unwrap();
    let profile = json!({"fullName":"fixture","professionalName":"fixture","crn":"fixture","region":"fixture","email":"fixture@example.invalid","phone":"fixture","job":"fixture","workplace":"fixture"});
    assert!(call(&mut s, Some(&t), Action::SaveProfile { profile }).is_err());
    assert_eq!(call(&mut s, Some(&t), Action::Profile).unwrap(), old);
    assert!(call(
        &mut s,
        Some(&t),
        Action::Audit {
            filter: AuditFilter {
                open: true,
                ..filter()
            }
        }
    )
    .is_err());
}

#[test]
fn automatic_backup_does_not_duplicate_and_records_system_failure() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    let folder = root.path().join("backups");
    let count = std::fs::read_dir(&folder).unwrap().count();
    s.daily_backup().unwrap();
    assert_eq!(std::fs::read_dir(&folder).unwrap().count(), count);
    let old = "2000-01-01T00:00:00+00:00";
    s.db.execute(
        "UPDATE settings SET value=?1 WHERE name='last_backup'",
        [old],
    )
    .unwrap();
    // Fault confined to this test's temporary installation.
    std::fs::remove_dir_all(&folder).unwrap();
    std::fs::write(&folder, b"fixture blocked folder").unwrap();
    s.daily_backup().unwrap();
    let status = call(&mut s, Some(&t), Action::BackupStatus).unwrap();
    assert_eq!(status["lastBackup"], old);
    assert_eq!(status["failed"], true);
    assert_eq!(status["stale"], true);
    let failure: i64 = s.db.query_row("SELECT count(*) FROM audit WHERE actor_type='SYSTEM' AND user_id IS NULL AND action='BACKUP_CREATE' AND result='FAILURE'", [], |r| r.get(0)).unwrap();
    assert_eq!(failure, 1);
}

#[test]
fn backup_preserves_existing_file_and_clears_failure_after_recovery() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    let path = root.path().join("manual.webfit-backup");
    std::fs::write(&path, b"fixture existing copy").unwrap();
    assert!(call(
        &mut s,
        Some(&t),
        Action::Backup {
            path: Some(path.to_string_lossy().into())
        }
    )
    .is_err());
    assert_eq!(std::fs::read(&path).unwrap(), b"fixture existing copy");
    assert_eq!(
        call(&mut s, Some(&t), Action::BackupStatus).unwrap()["failed"],
        true
    );
    let next = root.path().join("next.webfit-backup");
    call(
        &mut s,
        Some(&t),
        Action::Backup {
            path: Some(next.to_string_lossy().into()),
        },
    )
    .unwrap();
    let status = call(&mut s, Some(&t), Action::BackupStatus).unwrap();
    assert_eq!(status["failed"], false);
    assert_eq!(status["stale"], false);
    let failures: i64 = s.db.query_row("SELECT count(*) FROM audit WHERE actor_type='USER' AND action='BACKUP_CREATE' AND result='FAILURE'", [], |r| r.get(0)).unwrap();
    assert_eq!(failures, 1);
}

#[test]
fn backup_audit_failure_removes_new_package_and_temporaries() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    s.db.execute_batch("CREATE TEMP TRIGGER fixture_backup_failure BEFORE INSERT ON audit WHEN NEW.action='BACKUP_CREATE' AND NEW.result='SUCCESS' BEGIN SELECT RAISE(ABORT,'fixture failure'); END;").unwrap();
    let path = root.path().join("failed.webfit-backup");
    assert!(call(
        &mut s,
        Some(&t),
        Action::Backup {
            path: Some(path.to_string_lossy().into())
        }
    )
    .is_err());
    assert!(!path.exists());
    assert!(!std::fs::read_dir(root.path())
        .unwrap()
        .flatten()
        .any(|e| e.path().extension().is_some_and(|ext| ext == "tmp")));
    assert_eq!(
        call(&mut s, Some(&t), Action::BackupStatus).unwrap()["failed"],
        true
    );
}

#[test]
fn invalid_restore_preserves_current_patient_and_success_restores_snapshot() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    let patient = json!({"name":"Paciente ficticio","birth":"1990-01-01","sex":"F","tags":[]});
    let id = call(
        &mut s,
        Some(&t),
        Action::SavePatient {
            id: None,
            patient: patient.clone(),
        },
    )
    .unwrap()["id"]
        .as_str()
        .unwrap()
        .to_owned();
    let path = root.path().join("snapshot.webfit-backup");
    call(
        &mut s,
        Some(&t),
        Action::Backup {
            path: Some(path.to_string_lossy().into()),
        },
    )
    .unwrap();
    let mut changed = patient;
    changed["name"] = json!("Alteracao ficticia posterior");
    call(
        &mut s,
        Some(&t),
        Action::SavePatient {
            id: Some(id.clone()),
            patient: changed,
        },
    )
    .unwrap();
    let restore = |confirmed, password: &str| Action::Restore {
        path: path.to_string_lossy().into(),
        password: password.into(),
        confirmed,
    };
    assert!(call(
        &mut s,
        Some(&t),
        restore(false, "recuperacao ficticia segura")
    )
    .is_err());
    assert!(call(&mut s, Some(&t), restore(true, "senha errada")).is_err());
    let package = std::fs::read(&path).unwrap();
    let mut incompatible: Value = serde_json::from_slice(&package).unwrap();
    incompatible["version"] = json!(999);
    std::fs::write(&path, serde_json::to_vec(&incompatible).unwrap()).unwrap();
    assert!(call(
        &mut s,
        Some(&t),
        restore(true, "recuperacao ficticia segura")
    )
    .is_err());
    std::fs::write(&path, b"fixture invalid package").unwrap();
    assert!(call(
        &mut s,
        Some(&t),
        restore(true, "recuperacao ficticia segura")
    )
    .is_err());
    std::fs::write(&path, package).unwrap();
    assert_eq!(
        call(&mut s, Some(&t), Action::Patient { id: id.clone() }).unwrap()["name"],
        "Alteracao ficticia posterior"
    );
    let copies = std::fs::read_dir(root.path().join("backups"))
        .unwrap()
        .count();
    call(
        &mut s,
        Some(&t),
        restore(true, "recuperacao ficticia segura"),
    )
    .unwrap();
    assert_eq!(
        std::fs::read_dir(root.path().join("backups"))
            .unwrap()
            .count(),
        copies + 1
    );
    assert!(call(&mut s, Some(&t), Action::Patient { id: id.clone() }).is_err());
    let new_t = call(
        &mut s,
        None,
        Action::Login {
            name: "admin fixture".into(),
            password: "senha ficticia segura".into(),
        },
    )
    .unwrap()["token"]
        .as_str()
        .unwrap()
        .to_owned();
    assert_eq!(
        call(&mut s, Some(&new_t), Action::Patient { id }).unwrap()["name"],
        "Paciente ficticio"
    );
    crate::database::integrity(&s.db).unwrap();
}

#[test]
fn retention_runs_only_after_success_and_only_in_managed_folder() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    let old = root.path().join("backups/old.webfit-backup");
    let external = root.path().join("external.webfit-backup");
    let recent = root.path().join("backups/recent.webfit-backup");
    for path in [&old, &external, &recent] {
        call(
            &mut s,
            Some(&t),
            Action::Backup {
                path: Some(path.to_string_lossy().into()),
            },
        )
        .unwrap();
    }
    let old_time = std::time::SystemTime::now() - std::time::Duration::from_secs(61 * 86400);
    for path in [&old, &external] {
        std::fs::File::options()
            .write(true)
            .open(path)
            .unwrap()
            .set_times(std::fs::FileTimes::new().set_modified(old_time))
            .unwrap();
    }
    assert!(call(
        &mut s,
        Some(&t),
        Action::Backup {
            path: Some(external.to_string_lossy().into())
        }
    )
    .is_err());
    assert!(old.exists());
    call(&mut s, Some(&t), Action::Backup { path: None }).unwrap();
    assert!(!old.exists());
    assert!(external.exists());
    assert!(recent.exists());
}

#[test]
fn failure_of_restore_safety_copy_preserves_current_state_and_flags_backup() {
    let root = tempfile::tempdir().unwrap();
    let mut s = Service::open(root.path().to_owned()).unwrap();
    let t = session(&mut s);
    let path = root.path().join("restore.webfit-backup");
    call(
        &mut s,
        Some(&t),
        Action::Backup {
            path: Some(path.to_string_lossy().into()),
        },
    )
    .unwrap();
    let patient =
        json!({"name":"Paciente posterior ficticio","birth":"1990-01-01","sex":"F","tags":[]});
    let patient_id = call(&mut s, Some(&t), Action::SavePatient { id: None, patient }).unwrap()
        ["id"]
        .as_str()
        .unwrap()
        .to_owned();
    let folder = root.path().join("backups");
    std::fs::remove_dir_all(&folder).unwrap();
    std::fs::write(&folder, b"fixture unavailable").unwrap();
    let before = call(&mut s, Some(&t), Action::Profile).unwrap();
    assert!(call(
        &mut s,
        Some(&t),
        Action::Restore {
            path: path.to_string_lossy().into(),
            password: "recuperacao ficticia segura".into(),
            confirmed: true
        }
    )
    .is_err());
    assert_eq!(call(&mut s, Some(&t), Action::Profile).unwrap(), before);
    assert_eq!(
        call(&mut s, Some(&t), Action::Patient { id: patient_id }).unwrap()["name"],
        "Paciente posterior ficticio"
    );
    assert_eq!(
        call(&mut s, Some(&t), Action::BackupStatus).unwrap()["failed"],
        true
    );
    crate::database::integrity(&s.db).unwrap();
}
