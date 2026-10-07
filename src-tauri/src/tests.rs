#[cfg(test)]
mod integration {
    use crate::{
        database, security,
        service::{Action, Command, Service},
    };
    use serde_json::json;
    fn call(
        service: &mut Service,
        token: Option<&str>,
        command: Action,
    ) -> crate::Result<serde_json::Value> {
        service.execute(Command {
            token: token.map(str::to_owned),
            command,
        })
    }
    fn setup(service: &mut Service) -> String {
        call(
            service,
            None,
            Action::Setup {
                admin_name: "Administrador de teste".into(),
                admin_password: "senha ficticia segura".into(),
                professional_name: "Nutricionista de teste".into(),
                professional_password: "outra senha ficticia".into(),
                recovery_password: "recuperacao ficticia segura".into(),
            },
        )
        .unwrap();
        let result = call(
            service,
            None,
            Action::Login {
                name: "Administrador de teste".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap();
        result["token"].as_str().unwrap().to_owned()
    }
    #[test]
    fn credentials_are_hashed_and_tampering_fails() {
        let hash = security::hash_password("senha ficticia de teste").unwrap();
        assert!(security::verify_password("senha ficticia de teste", &hash));
        assert!(!security::verify_password("senha diferente", &hash));
        assert!(!hash.contains("ficticia"));
        assert!(security::hash_password("curta").is_err());
    }
    #[test]
    fn cpf_validation_rejects_equal_digits_and_wrong_checks() {
        assert!(crate::service::cpf_valid("529.982.247-25"));
        assert!(!crate::service::cpf_valid("11111111111"));
        assert!(!crate::service::cpf_valid("52998224726"));
        assert_eq!(crate::service::normalize("Álvaro"), "alvaro");
    }
    #[test]
    fn migrations_are_transactional_and_idempotent_and_database_is_encrypted() {
        let temp = tempfile::tempdir().unwrap();
        let key = security::random_key();
        let path = temp.path().join("test.db");
        let mut db = database::open(&path, &key).unwrap();
        database::migrate(&mut db).unwrap();
        database::migrate(&mut db).unwrap();
        database::integrity(&db).unwrap();
        assert_eq!(
            db.pragma_query_value(None, "foreign_keys", |r| r.get::<_, i64>(0))
                .unwrap(),
            1
        );
        drop(db);
        assert!(!std::fs::read(&path)
            .unwrap()
            .starts_with(b"SQLite format 3"));
        assert!(database::open(&path, &security::random_key()).is_err());
    }
    #[test]
    fn authorization_persistence_duplicate_and_archive() {
        let temp = tempfile::tempdir().unwrap();
        let mut service = Service::open(temp.path().to_owned()).unwrap();
        assert!(call(
            &mut service,
            None,
            Action::Patients {
                query: String::new(),
                archived: false
            }
        )
        .is_err());
        let token = setup(&mut service);
        let patient = json!({"name":"Paciente Fictício","cpf":"52998224725","phone":"11999999999","birth":"1990-01-02","email":"ficticio@example.invalid","address":"Endereço fictício","tags":[]});
        let result = call(
            &mut service,
            Some(&token),
            Action::SavePatient {
                id: None,
                patient: patient.clone(),
            },
        )
        .unwrap();
        let id = result["id"].as_str().unwrap().to_owned();
        assert!(call(
            &mut service,
            Some(&token),
            Action::SavePatient { id: None, patient }
        )
        .is_err());
        call(
            &mut service,
            Some(&token),
            Action::ArchivePatient {
                id: id.clone(),
                archived: true,
            },
        )
        .unwrap();
        assert!(call(
            &mut service,
            Some(&token),
            Action::SavePrescription {
                id: None,
                patient_id: id.clone(),
                payload: json!({})
            }
        )
        .is_err());
        drop(service);
        let mut reopened = Service::open(temp.path().to_owned()).unwrap();
        let login = call(
            &mut reopened,
            None,
            Action::Login {
                name: "Administrador de teste".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap();
        let token = login["token"].as_str().unwrap();
        let result = call(
            &mut reopened,
            Some(token),
            Action::Patients {
                query: "fictício".into(),
                archived: true,
            },
        )
        .unwrap();
        assert_eq!(result.as_array().unwrap().len(), 1);
        assert!(result[0]["cpf"].as_str().unwrap().starts_with("***"));
    }
    #[test]
    fn backup_restores_in_new_installation_and_corruption_preserves_state() {
        let original = tempfile::tempdir().unwrap();
        let mut service = Service::open(original.path().to_owned()).unwrap();
        let token = setup(&mut service);
        let path = original.path().join("fixture.webfit-backup");
        call(
            &mut service,
            Some(&token),
            Action::Backup {
                path: Some(path.to_string_lossy().into()),
            },
        )
        .unwrap();
        let other = tempfile::tempdir().unwrap();
        let mut target = Service::open(other.path().to_owned()).unwrap();
        let target_token = setup(&mut target);
        assert!(call(
            &mut target,
            Some(&target_token),
            Action::Restore {
                path: path.to_string_lossy().into(),
                password: "errada".into(),
                confirmed: true
            }
        )
        .is_err());
        let mut corrupted: serde_json::Value =
            serde_json::from_slice(&std::fs::read(&path).unwrap()).unwrap();
        let mut ciphertext = corrupted["ciphertext"]
            .as_str()
            .unwrap()
            .as_bytes()
            .to_vec();
        ciphertext[0] = if ciphertext[0] == b'A' { b'B' } else { b'A' };
        corrupted["ciphertext"] = json!(String::from_utf8(ciphertext).unwrap());
        let corrupt_path = original.path().join("corrupt.webfit-backup");
        std::fs::write(&corrupt_path, serde_json::to_vec(&corrupted).unwrap()).unwrap();
        assert!(call(
            &mut target,
            Some(&target_token),
            Action::Restore {
                path: corrupt_path.to_string_lossy().into(),
                password: "recuperacao ficticia segura".into(),
                confirmed: true
            }
        )
        .is_err());
        assert!(call(&mut target, Some(&target_token), Action::Profile).is_ok());
        call(
            &mut target,
            Some(&target_token),
            Action::Restore {
                path: path.to_string_lossy().into(),
                password: "recuperacao ficticia segura".into(),
                confirmed: true,
            },
        )
        .unwrap();
        assert!(call(&mut target, Some(&target_token), Action::Profile).is_err());
        database::integrity(&target.db).unwrap();
    }
    #[test]
    fn tours_require_authorization_and_persist_per_user_without_migration() {
        use crate::service::TourId;
        let temp = tempfile::tempdir().unwrap();
        let mut service = Service::open(temp.path().to_owned()).unwrap();
        assert!(call(&mut service, None, Action::TourState).is_err());
        assert!(call(
            &mut service,
            None,
            Action::CompleteTour {
                id: TourId::Patients
            }
        )
        .is_err());
        let token = setup(&mut service);
        assert_eq!(
            call(&mut service, Some(&token), Action::TourState).unwrap(),
            json!([])
        );
        for _ in 0..2 {
            call(
                &mut service,
                Some(&token),
                Action::CompleteTour {
                    id: TourId::Patients,
                },
            )
            .unwrap();
        }
        assert_eq!(
            call(&mut service, Some(&token), Action::TourState).unwrap(),
            json!(["patients"])
        );
        assert!(serde_json::from_value::<Action>(
            json!({"op":"complete_tour","id":"recovery_wrapped"})
        )
        .is_err());
        call(&mut service, Some(&token), Action::Logout).unwrap();
        let login = call(
            &mut service,
            None,
            Action::Login {
                name: "Nutricionista de teste".into(),
                password: "outra senha ficticia".into(),
            },
        )
        .unwrap();
        let professional = login["token"].as_str().unwrap();
        assert_eq!(
            call(&mut service, Some(professional), Action::TourState).unwrap(),
            json!([])
        );
        call(
            &mut service,
            Some(professional),
            Action::CompleteTour { id: TourId::Backup },
        )
        .unwrap();
        drop(service);
        let mut service = Service::open(temp.path().to_owned()).unwrap();
        let login = call(
            &mut service,
            None,
            Action::Login {
                name: "Administrador de teste".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap();
        let token = login["token"].as_str().unwrap();
        assert_eq!(
            call(&mut service, Some(token), Action::TourState).unwrap(),
            json!(["patients"])
        );
        let version: i64 = service
            .db
            .pragma_query_value(None, "user_version", |row| row.get(0))
            .unwrap();
        assert_eq!(version, 1);
    }
    #[test]
    fn six_character_access_passwords_work_and_recovery_remains_twelve() {
        let six = "abc123";
        assert!(security::hash_password("abc12").is_err());
        let hash = security::hash_password(six).unwrap();
        assert!(security::verify_password(six, &hash));
        assert!(!security::verify_password("abc124", &hash));
        let temp = tempfile::tempdir().unwrap();
        let mut service = Service::open(temp.path().to_owned()).unwrap();
        assert!(call(
            &mut service,
            None,
            Action::Setup {
                admin_name: "Admin ficticio".into(),
                admin_password: six.into(),
                professional_name: "Profissional ficticio".into(),
                professional_password: six.into(),
                recovery_password: "12345678901".into(),
            }
        )
        .is_err());
        call(
            &mut service,
            None,
            Action::Setup {
                admin_name: "Admin ficticio".into(),
                admin_password: six.into(),
                professional_name: "Profissional ficticio".into(),
                professional_password: six.into(),
                recovery_password: "123456789012".into(),
            },
        )
        .unwrap();
        let login = call(
            &mut service,
            None,
            Action::Login {
                name: "Admin ficticio".into(),
                password: six.into(),
            },
        )
        .unwrap();
        let token = login["token"].as_str().unwrap();
        assert!(call(
            &mut service,
            Some(token),
            Action::ChangePassword {
                current: six.into(),
                replacement: "abc12".into()
            }
        )
        .is_err());
        call(
            &mut service,
            Some(token),
            Action::ChangePassword {
                current: six.into(),
                replacement: "def456".into(),
            },
        )
        .unwrap();
        let login = call(
            &mut service,
            None,
            Action::Login {
                name: "Admin ficticio".into(),
                password: "def456".into(),
            },
        )
        .unwrap();
        let token = login["token"].as_str().unwrap();
        let users = call(&mut service, Some(token), Action::Users).unwrap();
        let id = users
            .as_array()
            .unwrap()
            .iter()
            .find(|user| user["role"] == "NUTRITIONIST")
            .unwrap()["id"]
            .as_str()
            .unwrap();
        assert!(call(
            &mut service,
            Some(token),
            Action::ResetPassword {
                user_id: id.into(),
                temporary: "abc12".into()
            }
        )
        .is_err());
        call(
            &mut service,
            Some(token),
            Action::ResetPassword {
                user_id: id.into(),
                temporary: "ghi789".into(),
            },
        )
        .unwrap();
        call(&mut service, Some(token), Action::Logout).unwrap();
        let login = call(
            &mut service,
            None,
            Action::Login {
                name: "Profissional ficticio".into(),
                password: "ghi789".into(),
            },
        )
        .unwrap();
        assert_eq!(login["user"]["must_change"], true);
    }
}
