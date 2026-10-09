import { useState } from "react";
import { FormField } from "./FormField";

// This surface is intentionally unavailable until consultations have their own
// approved records. Patient registrations and prescriptions are not visits.
export function ConsultationHistory({ busy }: { busy: boolean }) {
  const [currentYear] = useState(() => new Date().getFullYear());
  const [year, setYear] = useState(currentYear);
  const months = Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
      .format(new Date(Date.UTC(year, month, 1)))
      .replace(".", ""),
  );
  return (
    <section
      className="dashboard-panel consultation-history"
      aria-labelledby="consultation-history-title"
    >
      <header>
        <div>
          <h2 id="consultation-history-title">Histórico de consultas</h2>
          <p>Consultas realizadas ao longo do ano.</p>
        </div>
        <div className="consultation-year">
          <FormField label="Ano">
            <select
              aria-label="Ano do histórico de consultas"
              value={year}
              disabled={busy}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              {Array.from(
                { length: 5 },
                (_, offset) => currentYear - offset,
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </header>
      <div className="consultation-empty-plot">
        <div className="consultation-plot-guides" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="consultation-empty-message" aria-live="polite">
          <h3>Histórico de {year} ainda indisponível</h3>
          <p>
            O histórico será preenchido quando o registro de consultas estiver
            disponível no sistema.
          </p>
        </div>
      </div>
      <ol
        className="consultation-months"
        aria-label={`Meses do histórico de consultas de ${year}`}
      >
        {months.map((month) => (
          <li key={month}>{month}</li>
        ))}
      </ol>
    </section>
  );
}
