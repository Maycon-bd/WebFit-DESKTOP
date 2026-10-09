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
}: {
  value: string | null | undefined;
  onChange: (value: "F" | "M") => void;
}) {
  const selected = canonicalPatientSex(value);
  const legacy = Boolean(value?.trim()) && !selected;
  return (
    <fieldset
      className="patient-sex"
      aria-describedby={legacy ? "patient-sex-help" : undefined}
    >
      <legend>Sexo (obrigatório)</legend>
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
