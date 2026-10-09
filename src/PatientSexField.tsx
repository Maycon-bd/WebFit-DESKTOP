export function canonicalPatientSex(
  value: string | null | undefined,
): "F" | "M" | "" {
  switch (value?.trim().toLowerCase()) {
    case "f":
    case "feminino":
      return "F";
    case "m":
    case "masculino":
      return "M";
    default:
      return "";
  }
}

export function PatientSexField({
  value,
  onChange,
  invalid = false,
}: {
  value: string | null | undefined;
  onChange: (value: "F" | "M") => void;
  invalid?: boolean;
}) {
  const selected = canonicalPatientSex(value);
  const legacy = Boolean(value?.trim()) && !selected;
  return (
    <fieldset
      className="patient-sex"
      aria-invalid={invalid || undefined}
      onInvalidCapture={(event) => event.preventDefault()}
      aria-describedby={
        [legacy && "patient-sex-help", invalid && "patient-sex-error"]
          .filter(Boolean)
          .join(" ") || undefined
      }
    >
      <legend>
        Sexo <span aria-hidden="true">*</span>
        {invalid && (
          <small className="field-validation-error" id="patient-sex-error">
            — Selecione Feminino ou Masculino.
          </small>
        )}
      </legend>
      <div className="patient-sex-options">
        {(
          [
            ["F", "Feminino"],
            ["M", "Masculino"],
          ] as const
        ).map(([code, label]) => (
          <label className="check" key={code}>
            <input
              type="radio"
              name="patient-sex"
              value={code}
              required
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? "patient-sex-error" : undefined}
              checked={selected === code}
              onChange={() => onChange(code)}
            />
            {label}
          </label>
        ))}
      </div>
      {legacy && (
        <p className="hint" id="patient-sex-help">
          Valor anterior: {value}. Selecione uma opção para salvar; o cadastro
          anterior será preservado até lá.
        </p>
      )}
    </fieldset>
  );
}
