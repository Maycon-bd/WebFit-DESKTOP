#[cfg(test)]
mod tests {
    use crate::{
        energy::{calculate, EnergyInput},
        nutrition,
        service::{Action, AuditFilter, Command, Service},
    };
    use serde_json::{json, Value};
    fn call(s: &mut Service, token: Option<&str>, command: Action) -> crate::Result<Value> {
        s.execute(Command {
            token: token.map(str::to_owned),
            command,
        })
    }
    fn session(s: &mut Service) -> String {
        call(
            s,
            None,
            Action::Setup {
                admin_name: "admin ficticio".into(),
                admin_password: "senha ficticia segura".into(),
                professional_name: "nutri ficticia".into(),
                professional_password: "senha ficticia nutri".into(),
                recovery_password: "recuperacao ficticia segura".into(),
            },
        )
        .unwrap();
        call(
            s,
            None,
            Action::Login {
                name: "admin ficticio".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .to_owned()
    }
    fn input() -> EnergyInput {
        serde_json::from_value(json!({"protocol":"HB1984","sex":"F","age":30,"weight":60,"height":160,"activity":0,"factor":1.2,"carbsPercent":45,"proteinPercent":25,"fatPercent":30,"diabetes":false,"specialCondition":false,"confirmedBelowBmr":false})).unwrap()
    }
    #[test]
    fn energy_projection_manual_macro_priority_and_invalid_inputs() {
        let base = calculate(input()).unwrap();
        assert!((base.basal.unwrap() - 1368.193).abs() < 1e-9);
        let mut i = input();
        i.change_kg = Some(-3.0);
        i.days = Some(40.0);
        let loss = calculate(i).unwrap();
        assert_eq!(loss.adjustment, -585.0);
        assert!(loss.below_bmr);
        let mut i = input();
        i.change_kg = Some(2.0);
        i.days = Some(60.0);
        assert_eq!(calculate(i).unwrap().adjustment, 260.0);
        let mut i = input();
        i.manual_energy = Some(1246.0);
        let result = calculate(i).unwrap();
        assert!((result.carbs - 140.175).abs() < 1e-9);
        assert!((result.protein - 77.875).abs() < 1e-9);
        assert!((result.fat - 41.53333333333333).abs() < 1e-9);
        assert!(result.manual);
        let mut i = input();
        i.days = Some(0.0);
        i.change_kg = Some(-3.0);
        assert!(calculate(i).is_err());
        let mut i = input();
        i.manual_energy = Some(1600.0);
        i.protein_per_kg = Some(2.0);
        let r = calculate(i).unwrap();
        assert_eq!(r.protein, 120.0);
        assert!((r.fat - 400.0 / 9.0).abs() < 1e-9);
        let mut i = input();
        i.manual_energy = Some(1600.0);
        i.protein_per_kg = Some(4.0);
        assert!(calculate(i).is_err());
        let mut i = input();
        i.diabetes = true;
        i.manual_energy = Some(3000.0);
        assert_eq!(calculate(i).unwrap().fiber, 42.0);
    }
    #[test]
    fn dri_child_pregnancy_lactation_and_age_boundary() {
        let mut i = input();
        i.protocol = "DRI2023_CHILD".into();
        i.age = 10.0;
        i.weight = 30.0;
        i.height = 140.0;
        i.factor = Some(999.0);
        assert!((calculate(i.clone()).unwrap().computed.unwrap() - 1555.39).abs() < 1e-9);
        i.age = 2.99;
        assert!(calculate(i).is_err());
        let mut i = input();
        i.protocol = "DRI2023_PREGNANCY".into();
        i.gestation = Some(20.0);
        i.pre_bmi = Some(22.0);
        assert!((calculate(i).unwrap().computed.unwrap() - 2236.6).abs() < 1e-9);
        let mut i = input();
        i.protocol = "DRI2023_LACTATION".into();
        i.lactation_months = Some(4.0);
        i.lactation_mode = Some("exclusive".into());
        let r = calculate(i).unwrap();
        assert!((r.computed.unwrap() - 2392.4).abs() < 1e-9);
        assert_eq!(r.fiber, 29.0);
    }
    #[test]
    fn official_food_is_authoritative_missing_values_are_not_zero() {
        let mut p = json!({"meals":[{"name":"Almoço","items":[{"code":"BRC0208A","grams":55,"kcal":99999}]}]});
        nutrition::composition(&mut p, true).unwrap();
        assert!((p["totals"]["kcal"].as_f64().unwrap() - 75.9).abs() < 1e-9);
        assert_eq!(p["meals"][0]["items"][0]["source"], "TBCA 7.3");
        assert!(p["micronutrientTotals"]["Vitamina A (RAE):mcg"].is_null());
    }
    #[test]
    fn prescription_is_immutable_and_versioned_and_archived_patient_is_protected() {
        let tmp = tempfile::tempdir().unwrap();
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        let t = session(&mut s);
        let patient = json!({"name":"Paciente ficticio","cpf":"52998224725","phone":"11999999999","birth":"1990-01-02","email":"teste@example.invalid","address":"Ficticio","tags":[]});
        let patient_id = call(&mut s, Some(&t), Action::SavePatient { id: None, patient }).unwrap()
            ["id"]
            .as_str()
            .unwrap()
            .to_owned();
        let payload = json!({"objective":"Objetivo ficticio","meals":[{"name":"Almoço","items":[{"code":"BRC0208A","grams":100}]}]});
        let id = call(
            &mut s,
            Some(&t),
            Action::SavePrescription {
                id: None,
                patient_id: patient_id.clone(),
                payload: payload.clone(),
            },
        )
        .unwrap()["id"]
            .as_str()
            .unwrap()
            .to_owned();
        call(
            &mut s,
            Some(&t),
            Action::FinalizePrescription { id: id.clone() },
        )
        .unwrap();
        assert!(call(
            &mut s,
            Some(&t),
            Action::SavePrescription {
                id: Some(id.clone()),
                patient_id: patient_id.clone(),
                payload
            }
        )
        .is_err());
        let next = call(
            &mut s,
            Some(&t),
            Action::VersionPrescription { id: id.clone() },
        )
        .unwrap()["id"]
            .as_str()
            .unwrap()
            .to_owned();
        assert!(call(
            &mut s,
            Some(&t),
            Action::VersionPrescription { id: id.clone() }
        )
        .is_err());
        call(
            &mut s,
            Some(&t),
            Action::FinalizePrescription { id: next.clone() },
        )
        .unwrap();
        let plans = call(
            &mut s,
            Some(&t),
            Action::Prescriptions {
                patient_id: patient_id.clone(),
            },
        )
        .unwrap();
        assert!(plans
            .as_array()
            .unwrap()
            .iter()
            .any(|p| p["id"] == id && p["status"] == "SUPERSEDED"));
        call(
            &mut s,
            Some(&t),
            Action::ArchivePatient {
                id: patient_id,
                archived: true,
            },
        )
        .unwrap();
        assert!(call(&mut s, Some(&t), Action::VersionPrescription { id: next }).is_err());
    }
    #[test]
    fn audit_pagination_freezes_window_and_does_not_audit_filters() {
        let tmp = tempfile::tempdir().unwrap();
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        let token = session(&mut s);
        for index in 0..125 {
            s.db.execute("INSERT INTO audit(id,actor_type,at,action,entity_type,result) VALUES(?1,'SYSTEM','2026-01-01T00:00:00+00:00','TEST_EVENT','WORKSPACE','SUCCESS')",[format!("fixture-{index:03}")]).unwrap();
        }
        let filter = AuditFilter {
            from: Some("2026-01-01T00:00:00Z".into()),
            to: Some("2026-01-02T00:00:00Z".into()),
            action: Some("TEST_EVENT".into()),
            open: true,
            ..Default::default()
        };
        let first = call(&mut s, Some(&token), Action::Audit { filter }).unwrap();
        assert_eq!(first["items"].as_array().unwrap().len(), 50);
        let cursor = first["cursor"].as_str().unwrap().to_owned();
        let second = call(
            &mut s,
            Some(&token),
            Action::Audit {
                filter: AuditFilter {
                    cursor: Some(cursor),
                    ..Default::default()
                },
            },
        )
        .unwrap();
        assert_eq!(second["items"].as_array().unwrap().len(), 50);
        assert_ne!(first["items"][49]["id"], second["items"][0]["id"]);
        let cursor = second["cursor"].as_str().unwrap().to_owned();
        let last = call(
            &mut s,
            Some(&token),
            Action::Audit {
                filter: AuditFilter {
                    cursor: Some(cursor),
                    ..Default::default()
                },
            },
        )
        .unwrap();
        assert_eq!(last["items"].as_array().unwrap().len(), 25);
        assert!(last["cursor"].is_null());
        assert_eq!(
            s.db.query_row(
                "SELECT count(*) FROM audit WHERE action='AUDIT_MODULE_OPEN'",
                [],
                |r| r.get::<_, i64>(0)
            )
            .unwrap(),
            1
        );
        assert!(s.db.execute("DELETE FROM audit", []).is_err());
    }
    #[test]
    fn drafts_are_scoped_and_expire_but_clinical_drafts_do_not() {
        let tmp = tempfile::tempdir().unwrap();
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        let admin = session(&mut s);
        call(
            &mut s,
            Some(&admin),
            Action::SaveDraft {
                id: "patient:new".into(),
                kind: "patient".into(),
                payload: json!({"name":"Preenchimento fictício"}),
            },
        )
        .unwrap();
        assert!(call(
            &mut s,
            Some(&admin),
            Action::SaveDraft {
                id: "login".into(),
                kind: "login".into(),
                payload: json!({})
            }
        )
        .is_err());
        call(&mut s, Some(&admin), Action::Logout).unwrap();
        let nutri = call(
            &mut s,
            None,
            Action::Login {
                name: "nutri ficticia".into(),
                password: "senha ficticia nutri".into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .to_owned();
        assert_eq!(
            call(&mut s, Some(&nutri), Action::Drafts)
                .unwrap()
                .as_array()
                .unwrap()
                .len(),
            0
        );
        call(
            &mut s,
            Some(&nutri),
            Action::SaveDraft {
                id: "profile".into(),
                kind: "profile".into(),
                payload: json!({"fullName":"Perfil ficticio"}),
            },
        )
        .unwrap();
        s.db.execute(
            "UPDATE drafts SET updated_at='2020-01-01T00:00:00+00:00'",
            [],
        )
        .unwrap();
        assert_eq!(
            call(&mut s, Some(&nutri), Action::Drafts)
                .unwrap()
                .as_array()
                .unwrap()
                .len(),
            0
        );
    }
    #[test]
    fn repeated_invalid_credentials_create_progressive_delay_without_storing_attempt() {
        let tmp = tempfile::tempdir().unwrap();
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        let t = session(&mut s);
        call(&mut s, Some(&t), Action::Logout).unwrap();
        for _ in 0..4 {
            assert!(call(
                &mut s,
                None,
                Action::Login {
                    name: "usuario desconhecido ficticio".into(),
                    password: "senha ficticia incorreta".into()
                }
            )
            .is_err());
        }
        let result = call(
            &mut s,
            None,
            Action::Login {
                name: "admin ficticio".into(),
                password: "senha ficticia segura".into(),
            },
        );
        assert!(result.is_err());
        assert_eq!(
            s.db.query_row(
                "SELECT count(*) FROM audit WHERE action='LOGIN' AND result='FAILURE'",
                [],
                |r| r.get::<_, i64>(0)
            )
            .unwrap(),
            4
        );
        let raw: String =
            s.db.query_row(
                "SELECT group_concat(action||entity_type||result) FROM audit",
                [],
                |r| r.get(0),
            )
            .unwrap();
        assert!(!raw.contains("desconhecido"));
        assert!(!raw.contains("incorreta"));
    }
}
