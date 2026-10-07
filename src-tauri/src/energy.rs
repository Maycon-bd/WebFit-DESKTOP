use crate::{Error, Result};
use serde::{Deserialize, Serialize};
#[derive(Deserialize, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EnergyInput {
    pub protocol: String,
    pub sex: String,
    pub age: f64,
    pub weight: f64,
    pub height: f64,
    pub activity: usize,
    pub factor: Option<f64>,
    pub gestation: Option<f64>,
    pub pre_bmi: Option<f64>,
    pub lactation_months: Option<f64>,
    pub lactation_mode: Option<String>,
    pub change_kg: Option<f64>,
    pub days: Option<f64>,
    pub coefficient: Option<f64>,
    pub manual_energy: Option<f64>,
    pub carbs_percent: f64,
    pub protein_percent: f64,
    pub fat_percent: f64,
    pub protein_per_kg: Option<f64>,
    pub diabetes: bool,
    pub special_condition: bool,
    pub confirmed_below_bmr: bool,
    pub observation: Option<String>,
}
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EnergyResult {
    pub protocol: String,
    pub reference: String,
    pub input: EnergyInput,
    pub basal: Option<f64>,
    pub computed: Option<f64>,
    pub final_energy: f64,
    pub adjustment: f64,
    pub protein: f64,
    pub carbs: f64,
    pub fat: f64,
    pub fiber: f64,
    pub warnings: Vec<String>,
    pub below_bmr: bool,
    pub manual: bool,
}
pub fn calculate(input: EnergyInput) -> Result<EnergyResult> {
    for value in [input.age, input.weight, input.height] {
        if !value.is_finite() || value <= 0.0 {
            return Err(Error::validation("Informe idade, peso e altura positivos."));
        }
    }
    if !["F", "M"].contains(&input.sex.as_str()) || input.activity > 3 {
        return Err(Error::validation(
            "Selecione sexo e categoria de atividade.",
        ));
    }
    let female = input.sex == "F";
    let mut basal = None;
    let mut automatic = true;
    let reference = match input.protocol.as_str() {
        "HB1984" => "Roza e Shizgal, 1984",
        "DRI2023_CHILD" | "DRI2023_PREGNANCY" | "DRI2023_LACTATION" => {
            "NASEM, Dietary Reference Intakes for Energy, 2023 — tabelas 5-15 a 5-19"
        }
        _ => {
            return Err(Error::validation(
                "Selecione um protocolo clínico versionado.",
            ))
        }
    }
    .to_owned();
    let mut warnings = vec!["Estimativa teórica; exige avaliação do profissional.".into()];
    let energy = match input.protocol.as_str() {
        "HB1984" => {
            let b = if female {
                447.593 + 9.247 * input.weight + 3.098 * input.height - 4.330 * input.age
            } else {
                88.362 + 13.397 * input.weight + 4.799 * input.height - 5.677 * input.age
            };
            let factor = input
                .factor
                .filter(|v| v.is_finite() && *v > 0.0)
                .ok_or_else(|| {
                    Error::validation("Informe o fator de atividade selecionado pelo profissional.")
                })?;
            basal = Some(b);
            b * factor
        }
        "DRI2023_CHILD" => {
            if !(3.0..19.0).contains(&input.age) {
                return Err(Error::validation(
                    "Este protocolo atende de 3 a 18,99 anos.",
                ));
            }
            let matrix = if female {
                [
                    [55.59, -22.25, 8.43, 17.07],
                    [-297.54, -22.25, 12.77, 14.73],
                    [-189.55, -22.25, 11.74, 18.34],
                    [-709.59, -22.25, 18.22, 14.25],
                ]
            } else {
                [
                    [-447.51, 3.68, 13.01, 13.15],
                    [19.12, 3.68, 8.62, 20.28],
                    [-388.19, 3.68, 12.66, 20.46],
                    [-671.75, 3.68, 15.38, 23.25],
                ]
            };
            let c = matrix[input.activity];
            let growth = if input.age >= 14.0 {
                20.0
            } else if input.age >= 9.0 {
                if female {
                    30.0
                } else {
                    25.0
                }
            } else if input.age >= 4.0 || female {
                15.0
            } else {
                20.0
            };
            c[0] + c[1] * input.age + c[2] * input.height + c[3] * input.weight + growth
        }
        "DRI2023_PREGNANCY" => {
            if !female {
                return Err(Error::validation(
                    "Gestação exige o sexo feminino usado na equação.",
                ));
            }
            let weeks = input
                .gestation
                .filter(|v| v.is_finite() && *v > 0.0 && *v <= 42.0)
                .ok_or_else(|| Error::validation("Informe a semana gestacional válida."))?;
            if weeks < 14.0 {
                female_eer(&input)
            } else {
                let bmi = input
                    .pre_bmi
                    .filter(|v| v.is_finite() && *v > 0.0)
                    .ok_or_else(|| Error::validation("Informe o IMC pré-gestacional."))?;
                let deposition = if bmi < 18.5 {
                    300.0
                } else if bmi < 25.0 {
                    200.0
                } else if bmi < 30.0 {
                    150.0
                } else {
                    -50.0
                };
                let c = [
                    [1131.20, 0.34, 12.15],
                    [693.35, 5.73, 10.20],
                    [-223.84, 13.23, 8.15],
                    [-779.72, 18.45, 8.73],
                ][input.activity];
                c[0] - 2.04 * input.age
                    + c[1] * input.height
                    + c[2] * input.weight
                    + 9.16 * weeks
                    + deposition
            }
        }
        "DRI2023_LACTATION" => {
            if !female {
                return Err(Error::validation(
                    "Lactação exige o sexo feminino usado na equação.",
                ));
            }
            let months = input
                .lactation_months
                .filter(|v| v.is_finite() && *v >= 0.0)
                .ok_or_else(|| Error::validation("Informe a fase da lactação em meses."))?;
            let mode = input.lactation_mode.as_deref().unwrap_or("");
            let add = if months <= 6.0 && mode == "exclusive" {
                540.0 - 140.0
            } else if (7.0..=12.0).contains(&months) && mode == "partial" {
                380.0
            } else {
                if input.manual_energy.is_none() {
                    return Err(Error::validation(
                        "Este padrão de lactação exige meta energética manual pelo profissional.",
                    ));
                }
                automatic = false;
                warnings.push(
                    "Padrão de lactação sem cálculo automático. Meta definida manualmente.".into(),
                );
                0.0
            };
            female_eer(&input) + add
        }
        _ => unreachable!(),
    };
    let adjustment = if let Some(change) = input.change_kg.filter(|v| *v != 0.0) {
        let days = input
            .days
            .filter(|v| v.is_finite() && *v > 0.0)
            .ok_or_else(|| Error::validation("Informe prazo positivo para a projeção de peso."))?;
        let coefficient = input.coefficient.unwrap_or(7800.0);
        if !change.is_finite() || !coefficient.is_finite() || coefficient <= 0.0 {
            return Err(Error::validation("Projeção inválida."));
        }
        warnings.push("Projeção de peso é uma estimativa, não uma garantia de resultado.".into());
        change * coefficient / days
    } else {
        0.0
    };
    let computed = if automatic {
        Some(energy + adjustment)
    } else {
        None
    };
    let final_energy = input
        .manual_energy
        .or(computed)
        .ok_or_else(|| Error::validation("Informe uma meta energética manual."))?;
    if !final_energy.is_finite() || final_energy <= 0.0 {
        return Err(Error::validation("Meta energética deve ser positiva."));
    }
    let below_bmr = basal.is_some_and(|b| final_energy < b);
    if below_bmr {
        warnings.push("Meta inferior à TMB. Confirme a decisão antes de finalizar.".into());
    }
    if input.special_condition {
        warnings.push("Condição especial: resultado teórico, sujeito a ajuste manual. Não finaliza automaticamente.".into());
    }
    for value in [
        input.carbs_percent,
        input.protein_percent,
        input.fat_percent,
    ] {
        if !value.is_finite() || !(0.0..=100.0).contains(&value) {
            return Err(Error::validation("Percentuais devem estar entre 0 e 100."));
        }
    }
    let carbs = final_energy * input.carbs_percent / 100.0 / 4.0;
    let protein = if let Some(per_kg) = input.protein_per_kg {
        if !per_kg.is_finite() || per_kg <= 0.0 {
            return Err(Error::validation("Proteína por kg deve ser positiva."));
        }
        per_kg * input.weight
    } else {
        if (input.carbs_percent + input.protein_percent + input.fat_percent - 100.0).abs() > 1e-9 {
            return Err(Error::validation("Os percentuais devem somar 100%."));
        }
        final_energy * input.protein_percent / 100.0 / 4.0
    };
    let fat = if input.protein_per_kg.is_some() {
        let remaining = final_energy - protein * 4.0 - carbs * 4.0;
        if remaining <= 0.0 {
            return Err(Error::validation("Proteínas e carboidratos deixam gordura zero ou excedem a energia. Ajuste as metas."));
        }
        remaining / 9.0
    } else {
        final_energy * input.fat_percent / 100.0 / 9.0
    };
    let mut fiber = if input.protocol == "DRI2023_PREGNANCY" {
        28.0
    } else if input.protocol == "DRI2023_LACTATION" {
        29.0
    } else if input.age < 4.0 {
        19.0
    } else if input.age < 9.0 {
        25.0
    } else if input.age < 14.0 {
        if female {
            26.0
        } else {
            31.0
        }
    } else if input.age < 19.0 {
        if female {
            26.0
        } else {
            38.0
        }
    } else if input.age <= 50.0 {
        if female {
            25.0
        } else {
            38.0
        }
    } else if female {
        21.0
    } else {
        30.0
    };
    if input.diabetes
        && !["DRI2023_PREGNANCY", "DRI2023_LACTATION"].contains(&input.protocol.as_str())
    {
        fiber = f64::max(fiber, 14.0 * final_energy / 1000.0);
    }
    let manual = input.manual_energy.is_some();
    Ok(EnergyResult {
        protocol: input.protocol.clone(),
        reference,
        input,
        basal,
        computed,
        final_energy,
        adjustment,
        protein,
        carbs,
        fat,
        fiber,
        warnings,
        below_bmr,
        manual,
    })
}
fn female_eer(i: &EnergyInput) -> f64 {
    let c = if i.age < 19.0 {
        [
            [55.59, -22.25, 8.43, 17.07],
            [-297.54, -22.25, 12.77, 14.73],
            [-189.55, -22.25, 11.74, 18.34],
            [-709.59, -22.25, 18.22, 14.25],
        ]
    } else {
        [
            [584.90, -7.01, 5.72, 11.71],
            [575.77, -7.01, 6.60, 12.14],
            [710.25, -7.01, 6.54, 12.34],
            [511.83, -7.01, 9.07, 12.56],
        ]
    }[i.activity];
    let growth = if i.age < 19.0 {
        if i.age >= 14.0 {
            20.0
        } else if i.age >= 9.0 {
            30.0
        } else {
            15.0
        }
    } else {
        0.0
    };
    c[0] + c[1] * i.age + c[2] * i.height + c[3] * i.weight + growth
}
