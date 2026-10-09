import { useState } from "react";
import { api, errorMessage } from "./api";
import type { EnergyInput, EnergyResult } from "./api";
import { FormField } from "./FormField";
import { PercentField } from "./PercentField";
import { ValueField } from "./ValueField";
export function EnergyForm({
  token,
  value,
  onChange,
}: {
  token: string | null;
  value?: EnergyResult;
  onChange: (result: EnergyResult) => void;
}) {
  const [input, setInput] = useState<EnergyInput>(
    value?.input ?? {
      protocol: "HB1984",
      sex: "F",
      age: 30,
      weight: 60,
      height: 160,
      activity: 0,
      factor: 1.2,
      carbsPercent: 45,
      proteinPercent: 25,
      fatPercent: 30,
      diabetes: false,
      specialCondition: false,
      confirmedBelowBmr: false,
    },
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function number(key: keyof EnergyInput, label: string, optional = false) {
    const value = (input[key] as number | undefined) ?? null;
    const onValueChange = (nextValue: number | undefined) =>
      setInput({ ...input, [key]: nextValue, confirmedBelowBmr: false });
    const decimals = ["age", "gestation", "lactationMonths", "days"].includes(
      key,
    )
      ? 0
      : 2;

    return (
      <FormField label={`${label}${optional ? " (opcional)" : ""}`}>
        {["carbsPercent", "proteinPercent", "fatPercent"].includes(key) ? (
          <PercentField value={value} decimals={2} onChange={onValueChange} />
        ) : (
          <ValueField
            value={value}
            decimals={decimals}
            emptyAsUndefined
            allowNegative={key === "changeKg"}
            showCurrencyPrefix={false}
            onChange={onValueChange}
          />
        )}
      </FormField>
    );
  }
  async function calculate() {
    setBusy(true);
    setError("");
    try {
      onChange(
        await api<EnergyResult>(token, { op: "calculate_energy", input }),
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="form-section" data-tour="energy">
      <h2>Necessidade energética e metas</h2>
      <p className="hint">
        Selecione explicitamente o protocolo e as entradas do cálculo. As metas
        só são aplicadas após calcular.
      </p>
      <div className="form-grid">
        <label className="field">
          <span>Protocolo</span>
          <select
            value={input.protocol}
            onChange={(e) => setInput({ ...input, protocol: e.target.value })}
          >
            <option value="HB1984">Harris-Benedict revisada · 1984</option>
            <option value="DRI2023_CHILD">EER/DRI 2023 · 3 a 18,99 anos</option>
            <option value="DRI2023_PREGNANCY">EER/DRI 2023 · gestação</option>
            <option value="DRI2023_LACTATION">EER/DRI 2023 · lactação</option>
          </select>
        </label>
        <label className="field">
          <span>Sexo usado na equação</span>
          <select
            value={input.sex}
            onChange={(e) => setInput({ ...input, sex: e.target.value })}
          >
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
          </select>
        </label>
        {number("age", "Idade (anos)")}
        {number("weight", "Peso atual (kg)")}
        {number("height", "Altura (cm)")}
        {input.protocol === "HB1984" ? (
          <label className="field">
            <span>Fator de atividade</span>
            <select
              value={input.factor}
              onChange={(e) =>
                setInput({ ...input, factor: Number(e.target.value) })
              }
            >
              <option value={1.2}>Sedentário · 1,20</option>
              <option value={1.375}>Leve · 1,375</option>
              <option value={1.55}>Moderado · 1,55</option>
              <option value={1.725}>Muito ativo · 1,725</option>
            </select>
          </label>
        ) : (
          <label className="field">
            <span>Categoria de atividade DRI</span>
            <select
              value={input.activity}
              onChange={(e) =>
                setInput({ ...input, activity: Number(e.target.value) })
              }
            >
              {["Inativo", "Pouco ativo", "Ativo", "Muito ativo"].map(
                (label, i) => (
                  <option key={i} value={i}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </label>
        )}
        {input.protocol === "DRI2023_PREGNANCY" && (
          <>
            {number("gestation", "Semana gestacional")}
            {number("preBmi", "IMC pré-gestacional")}
          </>
        )}
        {input.protocol === "DRI2023_LACTATION" && (
          <>
            {number("lactationMonths", "Meses de lactação")}
            <label className="field">
              <span>Modalidade</span>
              <select
                value={input.lactationMode ?? ""}
                onChange={(e) =>
                  setInput({ ...input, lactationMode: e.target.value })
                }
              >
                <option value="">Selecione</option>
                <option value="exclusive">Exclusivo</option>
                <option value="partial">Parcial</option>
                <option value="other">Outro padrão · ajuste manual</option>
              </select>
            </label>
          </>
        )}
        {number(
          "changeKg",
          "Variação de peso em kg (negativa para perda)",
          true,
        )}
        {number("days", "Prazo da projeção (dias)", true)}
        {number(
          "coefficient",
          "Coeficiente da projeção (padrão 7.800 kcal/kg)",
          true,
        )}
        {number("manualEnergy", "Meta energética manual (kcal)", true)}
        {number("carbsPercent", "Carboidratos (%)")}
        {number("proteinPercent", "Proteínas (%)")}
        {number("fatPercent", "Gorduras (%)")}
        {number("proteinPerKg", "Proteína (g/kg), prioridade sobre %", true)}
        <label className="field">
          <span>Observação do ajuste manual (opcional)</span>
          <input
            value={input.observation ?? ""}
            onChange={(e) =>
              setInput({ ...input, observation: e.target.value })
            }
          />
        </label>
      </div>
      <label className="check">
        <input
          type="checkbox"
          checked={input.diabetes}
          onChange={(e) => setInput({ ...input, diabetes: e.target.checked })}
        />
        Diabetes · aplicar referência de fibras
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={input.specialCondition}
          onChange={(e) =>
            setInput({ ...input, specialCondition: e.target.checked })
          }
        />
        Condição especial · resultado exige avaliação individual
      </label>
      {error && (
        <p role="alert" className="message error">
          {error}
        </p>
      )}
      <button type="button" disabled={busy} onClick={() => void calculate()}>
        Calcular e aplicar metas
      </button>
      {value && (
        <div className="energy-result">
          <p>
            <strong>Meta: {value.finalEnergy.toFixed(0)} kcal</strong>
            {value.basal !== null && ` · TMB: ${value.basal.toFixed(0)} kcal`} ·
            Calculado:{" "}
            {value.computed === null
              ? "indisponível neste padrão"
              : `${value.computed.toFixed(0)} kcal`}
          </p>
          <p>
            Proteínas {value.protein.toFixed(1)} g · Carboidratos{" "}
            {value.carbs.toFixed(1)} g · Gorduras {value.fat.toFixed(1)} g ·
            Fibras {value.fiber.toFixed(1)} g
          </p>
          <p className="hint">
            {value.reference} ·{" "}
            {value.manual ? "Ajuste manual" : "Resultado calculado"}
          </p>
          {value.warnings.map((w) => (
            <p className="hint" key={w}>
              {w}
            </p>
          ))}
          {value.belowBmr && (
            <label className="check">
              <input
                type="checkbox"
                checked={value.input.confirmedBelowBmr}
                onChange={(e) => {
                  const updated = {
                    ...value,
                    input: {
                      ...value.input,
                      confirmedBelowBmr: e.target.checked,
                    },
                  };
                  setInput(updated.input);
                  onChange(updated);
                }}
              />
              Confirmo a meta inferior à TMB para esta prescrição.
            </label>
          )}
        </div>
      )}
    </section>
  );
}
