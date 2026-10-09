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
        crate::license::activate_fixture(s, "admin ficticio", "senha ficticia segura");
        call(
            s,
            None,
            Action::Setup {
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
    fn release_notes_are_authorized_per_user_and_version_and_survive_restart_and_backup() {
        let tmp = tempfile::tempdir().unwrap();
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        session(&mut s);
        assert!(call(&mut s, None, Action::ReleaseNotes {}).is_err());
        assert!(call(&mut s, None, Action::MarkReleaseNotesSeen {}).is_err());
        // Unauthorized attempts revoke the active session by existing policy.
        let admin = call(
            &mut s,
            None,
            Action::Login {
                name: "admin ficticio".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .to_owned();
        let first = call(&mut s, Some(&admin), Action::ReleaseNotes {}).unwrap();
        assert_eq!(first["version"], env!("CARGO_PKG_VERSION"));
        assert_eq!(first["seen"], false);
        assert!(!first["notes"]["highlights"].as_array().unwrap().is_empty());
        call(&mut s, Some(&admin), Action::MarkReleaseNotesSeen {}).unwrap();
        call(&mut s, Some(&admin), Action::MarkReleaseNotesSeen {}).unwrap();
        assert_eq!(
            call(&mut s, Some(&admin), Action::ReleaseNotes {}).unwrap()["seen"],
            true
        );
        let user = first["version"].as_str().unwrap();
        assert!(serde_json::from_value::<Action>(
            json!({"op":"mark_release_notes_seen","version":"forged","user":"other"})
        )
        .is_err());
        let admin_id = s.session.as_ref().unwrap().user.id.clone();
        assert!(!crate::release_notes::is_seen(&s.db, &admin_id, "0.1.13-pilot.99.1").unwrap());
        assert!(crate::release_notes::is_seen(&s.db, &admin_id, user).unwrap());
        let backup = tmp.path().join("notes-fixture.webfit-backup");
        call(
            &mut s,
            Some(&admin),
            Action::Backup {
                path: Some(backup.to_string_lossy().into()),
            },
        )
        .unwrap();
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
            call(&mut s, Some(&nutri), Action::ReleaseNotes {}).unwrap()["seen"],
            false
        );
        call(&mut s, Some(&nutri), Action::MarkReleaseNotesSeen {}).unwrap();
        call(&mut s, Some(&nutri), Action::Logout).unwrap();
        let admin = call(
            &mut s,
            None,
            Action::Login {
                name: "admin ficticio".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .to_owned();
        call(
            &mut s,
            Some(&admin),
            Action::Restore {
                path: backup.to_string_lossy().into(),
                password: "recuperacao ficticia segura".into(),
                confirmed: true,
            },
        )
        .unwrap();
        drop(s);
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        let admin = call(
            &mut s,
            None,
            Action::Login {
                name: "admin ficticio".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .to_owned();
        assert_eq!(
            call(&mut s, Some(&admin), Action::ReleaseNotes {}).unwrap()["seen"],
            true
        );
        crate::database::integrity(&s.db).unwrap();
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
    fn expanded_catalog_preserves_authority_and_proportions() {
        // TBCA BRC0006C, composition per 100 g; independently read from source.
        let mut p = json!({"meals":[{"name":"Lanche","items":[{"code":"BRC0006C","grams":50,"kcal":99999,"source":"alterada"}]}]});
        nutrition::composition(&mut p, true).unwrap();
        assert_eq!(p["meals"][0]["items"][0]["source"], "TBCA 7.3");
        assert_eq!(p["totals"]["kcal"], 54.5);
        assert_eq!(p["totals"]["protein"], 0.635);
        assert_eq!(p["totals"]["carbs"], 13.35);
        assert_eq!(p["totals"]["fat"], 0.095);
        assert_eq!(p["totals"]["fiber"], 1.12);
        assert_eq!(p["micronutrientTotals"]["Potássio:mg"], 173.0);
        let food = &p["meals"][0]["items"][0];
        for key in ["kcal", "protein", "carbs", "fat", "fiber"] {
            assert_eq!(
                p["totals"][key].as_f64().unwrap(),
                food[key].as_f64().unwrap() / 2.0
            );
        }
        let mut invalid =
            json!({"meals":[{"name":"Lanche","items":[{"code":"BRC999999Z","grams":100}]}]});
        assert!(nutrition::composition(&mut invalid, true).is_err());
    }
    #[test]
    fn full_catalog_preserves_trace_rejects_conflicts_and_qualifies_only_reviewed_taco() {
        let mut corrected = json!({"meals":[{"name":"Fictícia","items":[{"code":"BRC0293T","grams":50,"kcal":999}]}]});
        nutrition::composition(&mut corrected, true).unwrap();
        assert_eq!(corrected["totals"]["kcal"], 59.5);
        assert_eq!(corrected["totals"]["protein"], 2.5);
        assert_eq!(corrected["totals"]["carbs"], 9.0);
        assert_eq!(corrected["totals"]["fat"], 2.05);
        assert_eq!(corrected["totals"]["fiber"], 2.51);
        assert_eq!(
            corrected["meals"][0]["items"][0]["responseSha256"],
            "dd8c0b16a2d1dda0148962fd6807921202f1d7f85ef56e385f5c0c9fab65900e"
        );
        let mut p = json!({"meals":[{"name":"Fictícia","items":[{"code":"BRC0001F","grams":50,"fiber":999}]}]});
        nutrition::composition(&mut p, true).unwrap();
        assert!(p["totals"]["fiber"].is_null());
        assert_eq!(
            p["meals"][0]["items"][0]["nutrients"]["Fibra alimentar:g"]["original"],
            "NA"
        );
        let mut fallback = json!({"meals":[{"name":"Fictícia","items":[{"code":"TACO4-522","grams":25,"kcal":999}]}]});
        nutrition::composition(&mut fallback, true).unwrap();
        assert_eq!(fallback["meals"][0]["items"][0]["source"], "TACO 4ª edição");
        let kcal = fallback["meals"][0]["items"][0]["kcal"].as_f64().unwrap();
        assert_eq!(fallback["totals"]["kcal"], kcal / 4.0);
        assert!(fallback["micronutrientTotals"]["Vitamina D:mcg"].is_null());
        for code in ["BRC0004A", "BRC0237T", "BRC1145B", "BRC1196B", "TACO4-003"] {
            let mut blocked =
                json!({"meals":[{"name":"Fictícia","items":[{"code":code,"grams":100,"kcal":1}]}]});
            assert!(nutrition::composition(&mut blocked, true).is_err());
        }
        let mut custom = json!({"meals":[{"name":"Fictícia","items":[{"name":"Personalizado","source":"fixture","grams":100,"kcal":1,"protein":1,"carbs":1,"fat":1,"fiber":null}]}]});
        assert!(nutrition::composition(&mut custom, true).is_err());
    }

    #[test]
    fn full_catalog_prescription_survives_sqlcipher_close_and_reopen() {
        let tmp = tempfile::tempdir().unwrap();
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        let token = session(&mut s);
        let patient_id = call(&mut s, Some(&token), Action::SavePatient {
            id: None, patient: json!({"name":"Paciente catálogo fictício","birth":"1990-01-02","sex":"F","phone":"11999999999","tags":[]})
        }).unwrap()["id"].as_str().unwrap().to_owned();
        let payload = json!({"objective":"Ensaio fictício de catálogo","meals":[{"name":"Refeição fictícia","items":[{"code":"BRC0001F","grams":50},{"code":"TACO4-522","grams":25}]},{"name":"Porções e preparações fictícias","items":[{"code":"BRC0208A","grams":55},{"code":"BRC0006C","grams":50},{"code":"BRC0017A","grams":100},{"code":"BRC0016A","grams":100}]}]});
        call(
            &mut s,
            Some(&token),
            Action::SavePrescription {
                id: None,
                patient_id: patient_id.clone(),
                payload,
            },
        )
        .unwrap();
        let before = call(
            &mut s,
            Some(&token),
            Action::Prescriptions {
                patient_id: patient_id.clone(),
            },
        )
        .unwrap();
        let backup = tmp.path().join("catalog-fixture.webfit-backup");
        call(
            &mut s,
            Some(&token),
            Action::Backup {
                path: Some(backup.to_string_lossy().into()),
            },
        )
        .unwrap();
        drop(s);
        let mut reopened = Service::open(tmp.path().to_owned()).unwrap();
        let token = call(
            &mut reopened,
            None,
            Action::Login {
                name: "admin ficticio".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .to_owned();
        let after = call(
            &mut reopened,
            Some(&token),
            Action::Prescriptions {
                patient_id: patient_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(before, after);
        assert!(after[0]["payload"]["totals"]["fiber"].is_null());
        let portions = &after[0]["payload"]["meals"][1]["items"];
        assert_eq!(portions[0]["grams"], 55);
        assert_eq!(portions[1]["grams"], 50);
        assert_eq!(portions[1]["kcal"], 109.0);
        assert_eq!(portions[2]["code"], "BRC0017A");
        assert_eq!(portions[2]["kcal"], 347.0);
        assert_eq!(portions[3]["code"], "BRC0016A");
        assert_eq!(portions[3]["kcal"], 108.0);
        let portion_energy: f64 = portions
            .as_array()
            .unwrap()
            .iter()
            .map(|f| f["kcal"].as_f64().unwrap() * f["grams"].as_f64().unwrap() / 100.0)
            .sum();
        assert!((portion_energy - 585.4).abs() < 1e-9);
        assert_eq!(
            after[0]["payload"]["meals"][0]["items"][1]["source"],
            "TACO 4ª edição"
        );
        assert!(after[0]["payload"]["meals"][0]["items"][0]["responseSha256"].is_string());
        // Restore must recover the saved JSON snapshot, including unavailable
        // values, rather than looking up a fresh composition during restoration.
        let mut edited = after[0]["payload"].clone();
        edited["meals"][0]["items"][0]["grams"] = json!(99);
        call(
            &mut reopened,
            Some(&token),
            Action::SavePrescription {
                id: Some(after[0]["id"].as_str().unwrap().to_owned()),
                patient_id: patient_id.clone(),
                payload: edited,
            },
        )
        .unwrap();
        call(
            &mut reopened,
            Some(&token),
            Action::Restore {
                path: backup.to_string_lossy().into(),
                password: "recuperacao ficticia segura".into(),
                confirmed: true,
            },
        )
        .unwrap();
        let token = call(
            &mut reopened,
            None,
            Action::Login {
                name: "admin ficticio".into(),
                password: "senha ficticia segura".into(),
            },
        )
        .unwrap()["token"]
            .as_str()
            .unwrap()
            .to_owned();
        let restored = call(
            &mut reopened,
            Some(&token),
            Action::Prescriptions { patient_id },
        )
        .unwrap();
        assert_eq!(before, restored);
        crate::database::integrity(&reopened.db).unwrap();
    }
    #[test]
    fn prescription_is_immutable_and_versioned_and_archived_patient_is_protected() {
        let tmp = tempfile::tempdir().unwrap();
        let mut s = Service::open(tmp.path().to_owned()).unwrap();
        let t = session(&mut s);
        let patient = json!({"name":"Paciente ficticio","cpf":"52998224725","phone":"11999999999","birth":"1990-01-02","sex":"F","email":"teste@example.invalid","address":"Ficticio","tags":[]});
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
