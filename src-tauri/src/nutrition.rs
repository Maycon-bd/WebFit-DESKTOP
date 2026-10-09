use crate::{Error, Result};
use serde_json::{json, Value};
use std::{collections::HashMap, sync::OnceLock};

// The expanded offline reference is immutable for this build. Parse and index
// it once; parsing thousands of full compositions on each save is unnecessary.
fn catalog() -> Result<&'static HashMap<String, Value>> {
    static CATALOG: OnceLock<std::result::Result<HashMap<String, Value>, String>> = OnceLock::new();
    CATALOG
        .get_or_init(|| {
            let mut catalog = HashMap::new();
            for raw in [
                include_str!("../../src/data/tbca.json"),
                include_str!("../../src/data/taco.json"),
            ] {
                let foods: Vec<Value> = serde_json::from_str(raw).map_err(|e| e.to_string())?;
                for food in foods {
                    let code = food["code"]
                        .as_str()
                        .ok_or("Código oficial ausente.")?
                        .to_owned();
                    if catalog.insert(code, food).is_some() {
                        return Err("Código oficial duplicado.".to_owned());
                    }
                }
            }
            Ok(catalog)
        })
        .as_ref()
        .map_err(|_| {
            Error::validation(
                "Catálogo oficial offline inválido. Reinstale esta versão do aplicativo.",
            )
        })
}

pub fn composition(payload: &mut Value, complete: bool) -> Result<()> {
    let catalog = catalog()?;
    if let Some(meals) = payload["meals"].as_array_mut() {
        for meal in meals {
            if let Some(items) = meal["items"].as_array_mut() {
                for item in items {
                    if let Some(code) = item["code"].as_str() {
                        let official = catalog.get(code).ok_or_else(|| {
                            Error::validation(
                                "Alimento oficial não encontrado nesta versão da base.",
                            )
                        })?;
                        if official["compositionIssues"]
                            .as_array()
                            .is_some_and(|issues| !issues.is_empty())
                        {
                            return Err(Error::validation("Este alimento possui composição conflitante na fonte oficial e está indisponível para inclusão."));
                        }
                        let grams = item["grams"].clone();
                        *item = official.clone();
                        item["grams"] = grams;
                    }
                }
            }
        }
    }
    let meals = payload
        .get("meals")
        .and_then(Value::as_array)
        .ok_or_else(|| Error::validation("Informe as refeições do cardápio."))?;
    if complete && meals.is_empty() {
        return Err(Error::validation(
            "Inclua ao menos uma refeição antes de finalizar.",
        ));
    }
    let mut totals = [Some(0.0); 5];
    let keys = [
        "Sódio:mg",
        "Cálcio:mg",
        "Ferro:mg",
        "Potássio:mg",
        "Magnésio:mg",
        "Zinco:mg",
        "Vitamina A (RAE):mcg",
        "Vitamina C:mg",
        "Vitamina D:mcg",
        "Vitamina B12:mcg",
    ];
    let mut micros = [Some(0.0); 10];
    for meal in meals {
        if complete && meal["name"].as_str().is_none_or(|s| s.trim().is_empty()) {
            return Err(Error::validation(
                "Nomeie cada refeição antes de finalizar.",
            ));
        }
        let items = meal["items"]
            .as_array()
            .ok_or_else(|| Error::validation("Refeição inválida."))?;
        if complete && items.is_empty() {
            return Err(Error::validation(
                "Inclua alimentos em cada refeição antes de finalizar.",
            ));
        }
        for item in items {
            for field in ["name", "source"] {
                if item[field].as_str().is_none_or(|s| s.trim().is_empty()) {
                    return Err(Error::validation(
                        "Informe o alimento e a origem da composição.",
                    ));
                }
            }
            let grams = item["grams"]
                .as_f64()
                .filter(|n| n.is_finite() && *n > 0.0)
                .ok_or_else(|| Error::validation("Quantidade em gramas deve ser positiva."))?;
            for (index, field) in ["kcal", "protein", "carbs", "fat", "fiber"]
                .iter()
                .enumerate()
            {
                let amount = match item[*field].as_f64() {
                    Some(n) if n.is_finite() && n >= 0.0 => Some(n),
                    // Only an authoritative official record may supply an
                    // unavailable macro. A custom composition still requires
                    // its quantitative values; it cannot invent an official code.
                    None if item["code"].is_string() && item[*field].is_null() => None,
                    _ => {
                        return Err(Error::validation(
                            "Valores de composição devem ser números não negativos.",
                        ))
                    }
                };
                totals[index] = match (totals[index], amount) {
                    (Some(sum), Some(amount)) => {
                        let value = sum + amount * (grams / 100.0);
                        if !value.is_finite() {
                            return Err(Error::validation(
                                "Quantidade fora da faixa de cálculo. Confira as porções.",
                            ));
                        }
                        Some(value)
                    }
                    _ => None,
                };
            }
            for (index, key) in keys.iter().enumerate() {
                micros[index] = match (micros[index], item["nutrients"][*key]["value"].as_f64()) {
                    (Some(sum), Some(amount)) if amount.is_finite() && amount >= 0.0 => {
                        Some(sum + amount * grams / 100.0)
                    }
                    _ => None,
                };
            }
        }
    }
    payload["totals"] = json!({"kcal":totals[0],"protein":totals[1],"carbs":totals[2],"fat":totals[3],"fiber":totals[4]});
    let mut micronutrients = serde_json::Map::new();
    for (index, key) in keys.iter().enumerate() {
        micronutrients.insert((*key).to_owned(), json!(micros[index]));
    }
    payload["micronutrientTotals"] = Value::Object(micronutrients);
    Ok(())
}
