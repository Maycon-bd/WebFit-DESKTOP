import { useEffect, useState } from "react";
import { api, errorMessage } from "./api";
import { monthLabel, registrationScale } from "./dashboard-data";
import type { DashboardSummary } from "./dashboard-data";
import { ConsultationHistory } from "./ConsultationHistory";
import { MestreGrid } from "./MestreGrid";

function MetricIcon({
  kind,
}: {
  kind: "people" | "archive" | "edit" | "check";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "people" ? (
        <>
          <circle cx="9" cy="7" r="3" />
          <path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v3" />
        </>
      ) : kind === "archive" ? (
        <>
          <path d="M4 8v12h16V8M3 3h18v5H3zM9 12h6" />
        </>
      ) : kind === "edit" ? (
        <>
          <path d="M13 4H4v16h16v-9M10 14l1-4 8-8 3 3-8 8z" />
        </>
      ) : (
        <>
          <path d="M14 3H4v18h16V9M8 12l3 3 10-10" />
        </>
      )}
    </svg>
  );
}

export function Dashboard({
  token,
  busy,
  onPatients,
  onNewPatient,
  onProfile,
  onBackup,
  onUnauthorized,
}: {
  token: string | null;
  busy: boolean;
  onPatients: () => void;
  onNewPatient: () => void;
  onProfile: () => void;
  onBackup: () => void;
  onUnauthorized: () => void;
}) {
  const [months, setMonths] = useState<6 | 12>(6);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let current = true;
    setLoading(true);
    setData(null);
    setError("");
    void api<DashboardSummary>(token, { op: "dashboard", months })
      .then((summary) => {
        if (current) {
          setData(summary);
          setLoading(false);
        }
      })
      .catch((failure: unknown) => {
        if (!current) return;
        setError(errorMessage(failure));
        setLoading(false);
        if (
          typeof failure === "object" &&
          failure !== null &&
          "code" in failure &&
          failure.code === "UNAUTHORIZED"
        )
          onUnauthorized();
      });
    return () => {
      current = false;
    };
  }, [token, months, revision, onUnauthorized]);
  const scale = data ? registrationScale(data.registrations) : 1;
  const states = data
    ? [
        {
          label: "Em edição",
          count: data.prescriptions.draft,
          className: "draft",
        },
        {
          label: "Finalizadas",
          count: data.prescriptions.finalized,
          className: "final",
        },
        {
          label: "Substituídas",
          count: data.prescriptions.superseded,
          className: "superseded",
        },
        {
          label: "Canceladas",
          count: data.prescriptions.cancelled,
          className: "cancelled",
        },
      ]
    : [];
  const prescriptionTotal = states.reduce(
    (total, state) => total + state.count,
    0,
  );
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <header className="dashboard-heading">
        <div>
          <h1 id="dashboard-title" tabIndex={-1}>
            Dashboard
          </h1>
          <p>Uma visão geral do seu consultório.</p>
        </div>
        <button
          className="dashboard-refresh"
          type="button"
          aria-label="Atualizar indicadores"
          title="Atualizar indicadores"
          disabled={busy || loading}
          onClick={() => setRevision((value) => value + 1)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 11a8.1 8.1 0 0 0-14.9-4M4 4v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 14.9 4M20 20v-4h-4" />
          </svg>
        </button>
      </header>
      {loading && (
        <p className="dashboard-message" role="status">
          Carregando indicadores do consultório…
        </p>
      )}
      {error && (
        <div className="dashboard-message">
          <p role="alert">Não foi possível carregar a dashboard. {error}</p>
          <button
            disabled={busy}
            onClick={() => setRevision((value) => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}
      {data && (
        <>
          <dl className="dashboard-metrics" aria-label="Totais do consultório">
            {[
              {
                label: "Pacientes ativos",
                count: data.patients.active,
                note: "Cadastros disponíveis para acompanhamento",
                icon: "people" as const,
              },
              {
                label: "Pacientes arquivados",
                count: data.patients.archived,
                note: "Cadastros preservados no histórico",
                icon: "archive" as const,
              },
              {
                label: "Prescrições em edição",
                count: data.prescriptions.draft,
                note: "Versões salvas como rascunho",
                icon: "edit" as const,
              },
              {
                label: "Prescrições finalizadas",
                count: data.prescriptions.finalized,
                note: "Versões finais ainda não substituídas",
                icon: "check" as const,
              },
            ].map((metric) => (
              <div className="dashboard-metric" key={metric.label}>
                <dt>
                  <span className="dashboard-metric-icon">
                    <MetricIcon kind={metric.icon} />
                  </span>
                  {metric.label}
                </dt>
                <dd>{metric.count.toLocaleString("pt-BR")}</dd>
                <p>{metric.note}</p>
              </div>
            ))}
          </dl>
          <ConsultationHistory busy={busy} />
          <div className="dashboard-grid">
            <section
              className="dashboard-panel dashboard-registrations"
              aria-labelledby="registrations-title"
            >
              <header>
                <div>
                  <h2 id="registrations-title">Novos pacientes</h2>
                  <p>Cadastros por mês, incluindo os hoje arquivados.</p>
                </div>
                <div
                  className="dashboard-period"
                  role="group"
                  aria-label="Período do gráfico"
                >
                  {([6, 12] as const).map((value) => (
                    <button
                      key={value}
                      disabled={busy}
                      aria-pressed={months === value}
                      onClick={() => setMonths(value)}
                    >
                      {value} meses
                    </button>
                  ))}
                </div>
              </header>
              {data.registrations.every((row) => row.count === 0) ? (
                <div className="dashboard-chart-empty">
                  <h3>Nenhum cadastro neste período</h3>
                  <p>
                    Os novos pacientes aparecerão aqui conforme forem
                    cadastrados.
                  </p>
                </div>
              ) : (
                <div className="dashboard-bars" aria-hidden="true">
                  {data.registrations.map((row) => (
                    <div className="dashboard-bar-column" key={row.month}>
                      <strong>{row.count.toLocaleString("pt-BR")}</strong>
                      <div className="dashboard-bar-track">
                        <span
                          style={{ height: `${(row.count / scale) * 100}%` }}
                        />
                      </div>
                      <span className="dashboard-bar-label">
                        {monthLabel(row.month)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <details className="dashboard-chart-table">
                <summary>Ver dados do gráfico</summary>
                <MestreGrid
                  label="Cadastros mensais — datas em UTC"
                  rows={data.registrations}
                  rowKey={(row) => row.month}
                  columns={[
                    {
                      key: "month",
                      label: "Mês",
                      sortValue: (row) => row.month,
                      render: (row) => monthLabel(row.month, true),
                    },
                    {
                      key: "count",
                      label: "Pacientes cadastrados",
                      sortValue: (row) => row.count,
                      align: "right",
                      render: (row) => row.count,
                    },
                  ]}
                />
              </details>
              <p className="dashboard-footnote">
                Período do gráfico em UTC. Os totais acima consideram todo o
                histórico.
              </p>
            </section>
            <section
              className="dashboard-panel"
              aria-labelledby="prescription-summary-title"
            >
              <header>
                <div>
                  <h2 id="prescription-summary-title">Prescrições</h2>
                  <p>Situação das versões salvas.</p>
                </div>
              </header>
              {prescriptionTotal === 0 ? (
                <div className="dashboard-prescription-empty">
                  <p>Ainda não há prescrições salvas.</p>
                  <p className="hint">
                    Abra um paciente para começar a construir seu cardápio.
                  </p>
                </div>
              ) : (
                <dl className="dashboard-states">
                  {states.map((state) => (
                    <div key={state.label}>
                      <div>
                        <dt>{state.label}</dt>
                        <dd>{state.count.toLocaleString("pt-BR")}</dd>
                      </div>
                      <span
                        className={`dashboard-state-track ${state.className}`}
                        aria-hidden="true"
                      >
                        <span
                          style={{
                            width: `${(state.count / prescriptionTotal) * 100}%`,
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </dl>
              )}
              <button
                className="dashboard-text-action"
                disabled={busy}
                onClick={onPatients}
              >
                Abrir pacientes
              </button>
            </section>
          </div>
          {data.patients.active + data.patients.archived === 0 && (
            <div className="dashboard-start">
              <div>
                <h2>Seu consultório começa aqui</h2>
                <p>
                  Cadastre o primeiro paciente para começar o acompanhamento e
                  preencher seus indicadores.
                </p>
              </div>
              <button
                className="primary"
                disabled={busy}
                onClick={onNewPatient}
              >
                Cadastrar primeiro paciente
              </button>
            </div>
          )}
          <section
            className="dashboard-shortcuts"
            aria-labelledby="dashboard-shortcuts-title"
          >
            <h2 id="dashboard-shortcuts-title">Acesso rápido</h2>
            <div>
              <button
                className="primary"
                disabled={busy}
                onClick={onNewPatient}
              >
                Novo paciente
              </button>
              <button disabled={busy} onClick={onPatients}>
                Consultar pacientes
              </button>
              <button disabled={busy} onClick={onProfile}>
                Perfil profissional
              </button>
              <button disabled={busy} onClick={onBackup}>
                Backup e restauração
              </button>
            </div>
          </section>
          <p className="dashboard-updated">
            Atualizado em {new Date(data.generatedAt).toLocaleString("pt-BR")}
          </p>
        </>
      )}
    </section>
  );
}
