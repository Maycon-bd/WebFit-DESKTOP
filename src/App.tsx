import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  api,
  emptyPatient,
  emptyProfile,
  emptyPrescription,
  errorMessage,
} from "./api";
import type {
  User,
  Patient,
  Profile,
  Draft,
  Tag,
  Prescription,
  PrescriptionPayload,
  Food,
  AuditEvent,
  BackupStatus,
} from "./api";
import { displayName, menuComposition } from "./nutrition";
import { EnergyForm } from "./EnergyForm";
import { FoodPicker } from "./FoodPicker";
import { GuidedTour } from "./GuidedTour";
import type { TourId } from "./onboarding";

type Page = "patients" | "profile" | "audit" | "backup" | "access";
const labels: Record<Page, string> = {
  patients: "Pacientes",
  profile: "Perfil profissional",
  audit: "Auditoria",
  backup: "Backup e restauração",
  access: "Acesso",
};
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function dateTime(value: string) {
  return value
    ? new Date(value).toLocaleString("pt-BR")
    : "Ainda não realizado";
}
const auditActions: Record<string, string> = {
  SETUP: "Preparar instalação",
  LOGIN: "Entrar",
  ACCESS_DENIED: "Acesso bloqueado",
  PASSWORD_CHANGE: "Trocar senha",
  PASSWORD_RESET: "Redefinir senha",
  PROFILE_UPDATE: "Salvar perfil",
  PATIENT_CREATE: "Cadastrar paciente",
  PATIENT_UPDATE: "Editar paciente",
  PATIENT_VIEW: "Consultar paciente",
  PATIENT_ARCHIVE: "Arquivar paciente",
  PATIENT_RESTORE: "Restaurar paciente",
  TAG_CREATE: "Criar tag",
  TAG_RENAME: "Renomear tag",
  TAG_DISABLE: "Desativar tag",
  PRESCRIPTION_SAVE: "Salvar prescrição",
  PRESCRIPTION_FINALIZE: "Finalizar prescrição",
  PRESCRIPTION_VERSION: "Criar versão de prescrição",
  PRESCRIPTION_CANCEL: "Cancelar prescrição",
  BACKUP_CREATE: "Criar backup",
  BACKUP_RESTORE: "Restaurar backup",
  AUDIT_MODULE_OPEN: "Abrir auditoria",
  AUDIT_EVENT_DETAIL_VIEW: "Consultar evento",
};
const auditEntities: Record<string, string> = {
  USER: "Usuário",
  WORKSPACE: "Espaço Saúde",
  PROFILE: "Perfil profissional",
  PATIENT: "Paciente",
  TAG: "Tag",
  PRESCRIPTION: "Prescrição",
  BACKUP: "Backup",
  AUDIT_EVENT: "Evento de auditoria",
};
const auditResults: Record<string, string> = {
  SUCCESS: "Sucesso",
  FAILURE: "Falha",
  DENIED: "Bloqueado",
};
function Micronutrients({ items }: { items: Food[] }) {
  const keys = [
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
  return (
    <details className="form-section">
      <summary>Micronutrientes do cardápio</summary>
      <p className="hint">
        Quando algum alimento tem valor ausente ou traço, o total é apresentado
        como indisponível.
      </p>
      <dl>
        {keys.map((key) => {
          const amounts = items.map((item) => item.nutrients?.[key]?.value);
          const total = amounts.some((v) => v === null || v === undefined)
            ? null
            : amounts.reduce<number>(
                (sum, v, index) => sum + ((v ?? 0) * items[index].grams) / 100,
                0,
              );
          return (
            <div key={key}>
              <dt>{key.split(":")[0]}</dt>
              <dd>
                {total === null
                  ? "Indisponível"
                  : `${total.toFixed(2)} ${key.split(":")[1]}`}
              </dd>
            </div>
          );
        })}
      </dl>
    </details>
  );
}
function Heading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </header>
  );
}

export default function App() {
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [session, setSession] = useState<{ token: string; user: User } | null>(
    null,
  );
  const [page, setPage] = useState<Page>("patients");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [prescription, setPrescription] = useState<PrescriptionPayload | null>(
    null,
  );
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
  const draftRef = useRef<{
    id: string;
    kind: string;
    payload: Patient | Profile | PrescriptionPayload;
  } | null>(null);
  const draftDirty = useRef(false);
  const token = session?.token ?? null;
  const tourScreen: TourId =
    page === "patients"
      ? prescription && patient
        ? "prescription"
        : patient
          ? patient.id
            ? "patient"
            : "patient-new"
          : "patients"
      : page;
  useEffect(() => {
    const window = getCurrentWindow();
    const handler = window.onCloseRequested(async (event) => {
      if (!token || !draftRef.current || !draftDirty.current) return;
      event.preventDefault();
      try {
        await api(token, { op: "save_draft", ...draftRef.current });
        draftDirty.current = false;
        await window.destroy();
      } catch (e) {
        setError(
          `Não foi possível salvar antes de fechar: ${errorMessage(e)} Use Bloquear e sair para tentar novamente.`,
        );
      }
    });
    return () => {
      void handler.then((unlisten) => unlisten());
    };
  }, [token]);
  useEffect(() => {
    const listener = listen("session-locked", () => {
      setSession(null);
      setPatient(null);
      setPrescription(null);
      setProfile(emptyProfile);
      setDrafts([]);
      draftRef.current = null;
    });
    return () => {
      void listener.then((unlisten) => unlisten());
    };
  }, []);
  async function task<T>(run: () => Promise<T>): Promise<T | undefined> {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      return await run();
    } catch (e) {
      setError(errorMessage(e));
      if (
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        e.code === "UNAUTHORIZED"
      ) {
        setSession(null);
        setPatient(null);
        setPrescription(null);
        setProfile(emptyProfile);
        setDrafts([]);
        draftRef.current = null;
      }
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void api<{ initialized: boolean }>(null, { op: "status" })
      .then((r) => setInitialized(r.initialized))
      .catch(() =>
        setError(
          "Abra o WebFit pelo aplicativo instalado para acessar o banco local.",
        ),
      );
  }, []);
  useEffect(() => {
    if (!token) return;
    const timer = setInterval(() => {
      if (draftRef.current && draftDirty.current) {
        const sent = draftRef.current;
        void api(token, { op: "save_draft", ...sent })
          .then(() => {
            if (sent === draftRef.current) draftDirty.current = false;
          })
          .catch((e) => setError(`Rascunho não salvo: ${errorMessage(e)}`));
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [token]);
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      void api<User>(token, { op: "touch" }).catch(() => {
        setSession(null);
        setPatient(null);
        setPrescription(null);
        setProfile(emptyProfile);
        setDrafts([]);
        draftRef.current = null;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [token]);
  // Form edits are held in memory; only the authenticated backend saves a draft.
  useEffect(() => {
    if (prescription && patient)
      draftRef.current = {
        id: `prescription:${prescriptionId ?? `${patient.id}:new`}`,
        kind: "prescription",
        payload: { ...prescription, patientId: patient.id, prescriptionId },
      };
    else if (patient)
      draftRef.current = {
        id: `patient:${patient.id ?? "new"}`,
        kind: "patient",
        payload: patient,
      };
    else if (page === "profile" && token)
      draftRef.current = { id: "profile", kind: "profile", payload: profile };
    else draftRef.current = null;
  }, [patient, prescription, prescriptionId, page, profile, token]);
  async function navigate(next: Page) {
    if (
      await task(async () => {
        if (draftRef.current && draftDirty.current)
          await api(token, { op: "save_draft", ...draftRef.current });
        draftDirty.current = false;
        return true;
      })
    ) {
      setPatient(null);
      setPrescription(null);
      if (next === "profile") {
        const stored = await api<Partial<Profile>>(token, { op: "profile" });
        setProfile({ ...emptyProfile, ...stored });
      }
      setPage(next);
    }
  }
  async function refreshDrafts() {
    if (token) setDrafts(await api<Draft[]>(token, { op: "drafts" }));
  }
  async function loggedIn(result: { token: string; user: User }) {
    setPatient(null);
    setPrescription(null);
    setProfile(emptyProfile);
    draftRef.current = null;
    draftDirty.current = false;
    setSession(result);
    setPage("patients");
    setDrafts(await api<Draft[]>(result.token, { op: "drafts" }));
  }
  async function recover(draft: Draft) {
    if (draftRef.current && draftDirty.current)
      await api(token, { op: "save_draft", ...draftRef.current });
    draftDirty.current = false;
    if (draft.kind === "patient") {
      setPage("patients");
      setPatient(draft.payload as Patient);
    } else if (draft.kind === "profile") {
      setPage("profile");
      setProfile(draft.payload as Profile);
    } else {
      const payload = draft.payload as PrescriptionPayload;
      if (!payload.patientId) {
        setError("Este rascunho não possui paciente associado.");
        return;
      }
      const restored = await api<Patient>(token, {
        op: "patient",
        id: payload.patientId,
      });
      setPatient(restored);
      setPage("patients");
      setPrescription(payload);
      setPrescriptionId(payload.prescriptionId ?? null);
    }
    setDrafts(drafts.filter((d) => d.id !== draft.id));
  }
  if (!session)
    return (
      <main className="access-shell">
        <section className="access-intro">
          <div className="wordmark">
            webfit<span>desktop</span>
          </div>
          <h1>
            Seu consultório.
            <br />
            Seu espaço de trabalho.
          </h1>
          <p>
            Pacientes e planos alimentares em um aplicativo local, para
            trabalhar sem depender da internet.
          </p>
          <p className="test-warning">
            Versão de teste · use somente dados fictícios.
          </p>
        </section>
        <section className="access-form">
          <h2>
            {initialized === false
              ? "Prepare o primeiro acesso"
              : "Entre no Saúde"}
          </h2>
          <p>
            {initialized === false
              ? "Crie o acesso administrativo e o acesso da nutricionista."
              : "Use o acesso preparado neste computador."}
          </p>
          {error && (
            <div role="alert" className="message error">
              {error}
            </div>
          )}
          {initialized === false ? (
            <SetupForm
              busy={busy}
              onSubmit={(data) =>
                task(async () => {
                  await api(null, { op: "setup", ...data });
                  setInitialized(true);
                  setNotice("Acessos preparados. Entre com um deles.");
                })
              }
            />
          ) : (
            <LoginForm
              busy={busy || initialized === null}
              onSubmit={(name, password) =>
                task(async () =>
                  loggedIn(await api(null, { op: "login", name, password })),
                )
              }
            />
          )}{" "}
          {notice && <p role="status">{notice}</p>}
        </section>
      </main>
    );
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="wordmark">
          webfit<span>desktop</span>
        </div>
        <div className="workspace">
          Saúde<span>Consultório local</span>
        </div>
        <nav aria-label="Navegação principal">
          {Object.entries(labels).map(([key, label]) => (
            <button
              key={key}
              aria-current={page === key ? "page" : undefined}
              onClick={() => void navigate(key as Page)}
              disabled={busy || session.user.must_change}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <strong>{session.user.name}</strong>
          <small>
            {session.user.role === "ADMIN" ? "Administrador" : "Nutricionista"}
          </small>
          <button
            onClick={() =>
              void task(async () => {
                if (draftRef.current && draftDirty.current)
                  await api(token, { op: "save_draft", ...draftRef.current });
                draftDirty.current = false;
                await api(token, { op: "logout" });
                setSession(null);
                setPatient(null);
                setPrescription(null);
                setProfile(emptyProfile);
                draftRef.current = null;
              })
            }
          >
            Bloquear e sair
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        {!session.user.must_change && (
          <GuidedTour token={session.token} screen={tourScreen} />
        )}
        <div className="test-banner">
          Ambiente de teste · dados fictícios · instalação local
        </div>
        {error && (
          <div role="alert" className="message error">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="message success">
            {notice}
          </div>
        )}
        {busy && (
          <div role="status" className="working">
            Concluindo operação…
          </div>
        )}
        {session.user.must_change ? (
          <AccessPage
            token={token}
            user={session.user}
            task={task}
            onChanged={() => {
              setSession(null);
              setPatient(null);
              setPrescription(null);
              setProfile(emptyProfile);
              draftRef.current = null;
            }}
          />
        ) : (
          <>
            {drafts.length > 0 && (
              <section className="draft-panel">
                <h2>Preenchimentos recuperáveis</h2>
                {drafts.map((d) => (
                  <div key={d.id}>
                    <span>
                      {d.kind === "patient"
                        ? "Cadastro de paciente"
                        : d.kind === "profile"
                          ? "Perfil profissional"
                          : "Prescrição"}{" "}
                      · {dateTime(d.at)}
                    </span>
                    <button onClick={() => void task(() => recover(d))}>
                      Continuar
                    </button>
                    <button
                      onClick={() =>
                        void task(async () => {
                          await api(token, { op: "discard_draft", id: d.id });
                          await refreshDrafts();
                        })
                      }
                    >
                      Descartar
                    </button>
                  </div>
                ))}
              </section>
            )}
            {page === "patients" &&
              (prescription && patient ? (
                <PrescriptionForm
                  token={token}
                  value={prescription}
                  onChange={(v) => {
                    setPrescription(v);
                    draftDirty.current = true;
                  }}
                  patient={patient}
                  busy={busy}
                  onCancel={() =>
                    void task(async () => {
                      if (draftRef.current && draftDirty.current)
                        await api(token, {
                          op: "save_draft",
                          ...draftRef.current,
                        });
                      draftDirty.current = false;
                      setPrescription(null);
                    })
                  }
                  onSave={() =>
                    task(async () => {
                      const result = await api<{ id: string }>(token, {
                        op: "save_prescription",
                        id: prescriptionId,
                        patient_id: patient.id,
                        payload: prescription,
                      });
                      setPrescriptionId(result.id);
                      draftDirty.current = false;
                      setNotice("Prescrição salva como rascunho.");
                    })
                  }
                />
              ) : patient ? (
                <PatientForm
                  patient={patient}
                  onChange={(v) => {
                    setPatient(v);
                    draftDirty.current = true;
                  }}
                  token={token}
                  busy={busy}
                  task={task}
                  onClose={() =>
                    void task(async () => {
                      if (draftRef.current && draftDirty.current)
                        await api(token, {
                          op: "save_draft",
                          ...draftRef.current,
                        });
                      draftDirty.current = false;
                      setPatient(null);
                      draftRef.current = null;
                    })
                  }
                  onSaved={(id) => {
                    draftDirty.current = false;
                    setPatient({ ...patient, id });
                    setNotice("Cadastro salvo.");
                  }}
                  onPrescription={(p) => {
                    setPrescription(
                      p?.payload ?? structuredClone(emptyPrescription),
                    );
                    setPrescriptionId(p?.id ?? null);
                  }}
                />
              ) : (
                <PatientsPage
                  token={token}
                  task={task}
                  onNew={() => setPatient(structuredClone(emptyPatient))}
                  onOpen={(id) =>
                    void task(async () =>
                      setPatient(
                        await api<Patient>(token, { op: "patient", id }),
                      ),
                    )
                  }
                />
              ))}
            {page === "profile" && (
              <ProfileForm
                token={token}
                value={profile}
                onChange={(v) => {
                  setProfile(v);
                  draftDirty.current = true;
                }}
                busy={busy}
                task={task}
                onSaved={() => {
                  setNotice("Perfil salvo.");
                  draftDirty.current = false;
                  draftRef.current = null;
                }}
              />
            )}
            {page === "audit" && <AuditPage token={token} task={task} />}
            {page === "backup" && (
              <BackupPage
                token={token}
                task={task}
                onRestore={() => {
                  setSession(null);
                  setPatient(null);
                  setPrescription(null);
                  setProfile(emptyProfile);
                  setDrafts([]);
                  draftRef.current = null;
                }}
              />
            )}
            {page === "access" && (
              <AccessPage
                token={token}
                user={session.user}
                task={task}
                onChanged={() => {
                  setSession(null);
                  setPatient(null);
                  setPrescription(null);
                  setProfile(emptyProfile);
                  draftRef.current = null;
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
type Task = <T>(run: () => Promise<T>) => Promise<T | undefined>;
function LoginForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (name: string, password: string) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        onSubmit(String(d.get("name")), String(d.get("password")));
      }}
    >
      <Field label="Nome de acesso">
        <input name="name" required autoComplete="username" autoFocus />
      </Field>
      <Field label="Senha">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      <button className="primary" disabled={busy}>
        Entrar no Saúde
      </button>
    </form>
  );
}
function SetupForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (data: Record<string, string>) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(
          Object.fromEntries(new FormData(e.currentTarget)) as Record<
            string,
            string
          >,
        );
      }}
    >
      <Field label="Nome de acesso do administrador">
        <input name="admin_name" required autoComplete="off" />
      </Field>
      <Field label="Senha do administrador (mínimo 6 caracteres)">
        <input
          name="admin_password"
          type="password"
          minLength={6}
          required
          autoComplete="new-password"
        />
      </Field>
      <Field label="Nome de acesso da nutricionista">
        <input name="professional_name" required autoComplete="off" />
      </Field>
      <Field label="Senha da nutricionista (mínimo 6 caracteres)">
        <input
          name="professional_password"
          type="password"
          minLength={6}
          required
          autoComplete="new-password"
        />
      </Field>
      <Field label="Senha de recuperação dos backups (mínimo 12 caracteres)">
        <input
          name="recovery_password"
          type="password"
          minLength={12}
          required
          autoComplete="new-password"
        />
      </Field>
      <p className="hint">
        Guarde a senha de recuperação no seu cofre. Ela será necessária para
        restaurar o backup em outro computador.
      </p>
      <button className="primary" disabled={busy}>
        Preparar acessos locais
      </button>
    </form>
  );
}
function PatientsPage({
  token,
  task,
  onNew,
  onOpen,
}: {
  token: string | null;
  task: Task;
  onNew: () => void;
  onOpen: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [archived, setArchived] = useState(false);
  const [items, setItems] = useState<Patient[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let live = true;
    const timer = setTimeout(() => {
      void task(async () => {
        const rows = await api<Patient[]>(token, {
          op: "patients",
          query,
          archived,
        });
        if (live) {
          setItems(rows);
          setLoaded(true);
        }
      });
    }, 180);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [token, query, archived]);
  return (
    <>
      <Heading
        title="Pacientes"
        description="Encontre um cadastro ou comece um novo acompanhamento."
      >
        <button className="primary" onClick={onNew}>
          Novo paciente
        </button>
      </Heading>
      <div className="list-tools">
        <Field label="Pesquisar pacientes">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome, CPF ou telefone"
          />
        </Field>
        <div className="segmented">
          <button aria-pressed={!archived} onClick={() => setArchived(false)}>
            Ativos
          </button>
          <button aria-pressed={archived} onClick={() => setArchived(true)}>
            Arquivados
          </button>
        </div>
      </div>
      {loaded && items.length === 0 ? (
        <section className="empty">
          <h2>
            {query ? "Nenhum paciente encontrado" : "Sua lista começa aqui"}
          </h2>
          <p>
            {query
              ? "Tente outro nome, CPF ou telefone."
              : "Cadastre um paciente fictício para testar o acompanhamento."}
          </p>
          {!query && (
            <button onClick={onNew}>Cadastrar primeiro paciente</button>
          )}
        </section>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Telefone</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{displayName(p)}</strong>
                    {p.socialName && <small>{p.name}</small>}
                  </td>
                  <td>{p.cpf}</td>
                  <td>{p.birth.split("-").reverse().join("/")}</td>
                  <td>{p.phone}</td>
                  <td>
                    <button
                      onClick={() => onOpen(p.id!)}
                      aria-label={`Abrir ${displayName(p)}`}
                    >
                      Abrir cadastro
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 200 && (
            <p>Mostrando até 200 resultados. Refine a pesquisa.</p>
          )}
        </div>
      )}
    </>
  );
}
function PatientForm({
  patient,
  onChange,
  token,
  busy,
  task,
  onClose,
  onSaved,
  onPrescription,
}: {
  patient: Patient;
  onChange: (p: Patient) => void;
  token: string | null;
  busy: boolean;
  task: Task;
  onClose: () => void;
  onSaved: (id: string) => void;
  onPrescription: (p?: Prescription) => void;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [plans, setPlans] = useState<Prescription[]>([]);
  const [tagName, setTagName] = useState("");
  const [preview, setPreview] = useState<Prescription | null>(null);
  const [guardian, setGuardian] = useState(Boolean(patient.guardian));
  async function refresh() {
    setTags(await api<Tag[]>(token, { op: "tags" }));
    if (patient.id)
      setPlans(
        await api<Prescription[]>(token, {
          op: "prescriptions",
          patient_id: patient.id,
        }),
      );
  }
  useEffect(() => {
    void task(refresh);
  }, [token, patient.id]);
  function field(
    key: keyof Patient,
    label: string,
    type = "text",
    required = false,
  ) {
    return (
      <Field label={label}>
        <input
          type={type}
          value={String(patient[key] ?? "")}
          required={required}
          onChange={(e) => onChange({ ...patient, [key]: e.target.value })}
        />
      </Field>
    );
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    await task(async () => {
      const result = await api<{ id: string }>(token, {
        op: "save_patient",
        id: patient.id ?? null,
        patient,
      });
      onSaved(result.id);
    });
  }
  return (
    <>
      <Heading
        title={patient.id ? displayName(patient) : "Novo paciente"}
        description={
          patient.archived
            ? "Cadastro arquivado. Restaure para iniciar novos registros."
            : "Dados do paciente e acompanhamento."
        }
      >
        <button onClick={onClose}>Voltar à lista</button>
      </Heading>
      <form onSubmit={submit}>
        <section className="form-section" data-tour="identity">
          <h2>Identificação e contato</h2>
          <div className="form-grid">
            {field("name", "Nome completo", "text", true)}
            {field("socialName", "Nome social (opcional)")}
            {field("cpf", "CPF", "text", true)}
            {field("birth", "Data de nascimento", "date", true)}
            {field("phone", "Telefone", "tel", true)}
            {field("email", "E-mail", "email", true)}
            {field("sex", "Sexo")}
            {field("gender", "Gênero (opcional)")}
            <div className="wide">
              {field("address", "Endereço", "text", true)}
            </div>
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={guardian}
              onChange={(e) => {
                setGuardian(e.target.checked);
                onChange({
                  ...patient,
                  guardian: e.target.checked
                    ? {
                        name: "",
                        cpf: "",
                        relationship: "",
                        phone: "",
                        email: "",
                      }
                    : undefined,
                });
              }}
            />
            Informar responsável legal
          </label>
          {guardian && (
            <div className="form-grid">
              {Object.entries({
                name: "Nome do responsável",
                cpf: "CPF do responsável",
                relationship: "Vínculo",
                phone: "Telefone do responsável",
                email: "E-mail do responsável",
              }).map(([key, label]) => (
                <Field label={label} key={key}>
                  <input
                    required
                    type={key === "email" ? "email" : "text"}
                    value={patient.guardian?.[key] ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...patient,
                        guardian: {
                          ...patient.guardian,
                          [key]: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              ))}
            </div>
          )}
        </section>
        <section className="form-section" data-tour="tags">
          <h2>Organização do acompanhamento</h2>
          <div className="tag-options">
            {tags
              .filter((t) => t.active || patient.tags.includes(t.id))
              .map((t) => (
                <label className="check" key={t.id}>
                  <input
                    type="checkbox"
                    checked={patient.tags.includes(t.id)}
                    onChange={(e) =>
                      onChange({
                        ...patient,
                        tags: e.target.checked
                          ? [...patient.tags, t.id]
                          : patient.tags.filter((id) => id !== t.id),
                      })
                    }
                  />
                  {t.name}
                  {!t.active ? " (desativada)" : ""}
                  <button
                    type="button"
                    aria-label={`Renomear tag ${t.name}`}
                    onClick={() => {
                      const name = window.prompt("Novo nome da tag:", t.name);
                      if (name)
                        void task(async () => {
                          await api(token, {
                            op: "save_tag",
                            id: t.id,
                            name,
                            active: t.active,
                          });
                          await refresh();
                        });
                    }}
                  >
                    Renomear
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void task(async () => {
                        await api(token, {
                          op: "save_tag",
                          id: t.id,
                          name: t.name,
                          active: !t.active,
                        });
                        await refresh();
                      })
                    }
                  >
                    {t.active ? "Desativar" : "Ativar"}
                  </button>
                </label>
              ))}
          </div>
          <div className="inline">
            <input
              aria-label="Nome da nova tag"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Nova tag"
            />
            <button
              type="button"
              onClick={() =>
                void task(async () => {
                  await api(token, {
                    op: "save_tag",
                    id: null,
                    name: tagName,
                    active: true,
                  });
                  setTagName("");
                  await refresh();
                })
              }
            >
              Criar tag
            </button>
          </div>
          <Field label="Observações (opcional)">
            <textarea
              rows={4}
              value={patient.notes}
              onChange={(e) => onChange({ ...patient, notes: e.target.value })}
            />
          </Field>
        </section>
        <div className="form-actions">
          <button className="primary" disabled={busy}>
            Salvar cadastro
          </button>
          <button type="button" onClick={onClose}>
            Cancelar edição
          </button>
          {patient.id && (
            <button
              type="button"
              className="danger"
              onClick={() => {
                if (
                  window.confirm(
                    patient.archived
                      ? "Restaurar este cadastro?"
                      : "Arquivar este paciente preservando seu histórico?",
                  )
                )
                  void task(async () => {
                    await api(token, {
                      op: "archive_patient",
                      id: patient.id,
                      archived: !patient.archived,
                    });
                    onClose();
                  });
              }}
            >
              {patient.archived ? "Restaurar paciente" : "Arquivar paciente"}
            </button>
          )}
        </div>
      </form>
      {patient.id && (
        <section className="form-section" data-tour="history">
          <div className="section-heading">
            <h2>Prescrições e cardápios</h2>
            <button
              className="primary"
              disabled={patient.archived}
              onClick={() => onPrescription()}
            >
              Nova prescrição
            </button>
          </div>
          {plans.length === 0 ? (
            <p>Nenhuma prescrição registrada para este paciente.</p>
          ) : (
            plans.map((p) => (
              <div className="plan-row" key={p.id}>
                <div>
                  <strong>
                    {p.payload.objective || "Rascunho sem objetivo"}
                  </strong>
                  <small>
                    Versão {p.version} · {p.status} · {dateTime(p.at)}
                  </small>
                </div>
                <button onClick={() => setPreview(p)}>Consultar versão</button>
                {p.status === "DRAFT" ? (
                  <button onClick={() => onPrescription(p)}>
                    Editar rascunho
                  </button>
                ) : p.status === "FINAL" ? (
                  <button
                    onClick={() =>
                      void task(async () => {
                        await api(token, {
                          op: "version_prescription",
                          id: p.id,
                        });
                        await refresh();
                      })
                    }
                  >
                    Criar nova versão
                  </button>
                ) : null}
                {p.status === "DRAFT" && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Finalizar esta versão? Ela ficará protegida contra edição.",
                        )
                      )
                        void task(async () => {
                          await api(token, {
                            op: "finalize_prescription",
                            id: p.id,
                          });
                          await refresh();
                        });
                    }}
                  >
                    Finalizar
                  </button>
                )}
                {["DRAFT", "FINAL"].includes(p.status) && (
                  <button
                    onClick={() => {
                      const reason = window.prompt("Motivo do cancelamento:");
                      if (reason)
                        void task(async () => {
                          await api(token, {
                            op: "cancel_prescription",
                            id: p.id,
                            reason,
                          });
                          await refresh();
                        });
                    }}
                  >
                    Cancelar versão
                  </button>
                )}
              </div>
            ))
          )}
          {preview && (
            <section className="form-section">
              <div className="section-heading">
                <h2>
                  Versão {preview.version} · {preview.status}
                </h2>
                <button onClick={() => setPreview(null)}>
                  Fechar consulta
                </button>
              </div>
              <h3>{preview.payload.objective}</h3>
              <p>{preview.payload.guidance}</p>
              {preview.payload.meals.map((meal, index) => (
                <div key={index}>
                  <h3>{meal.name}</h3>
                  {meal.items.map((food, i) => (
                    <p key={i}>
                      {food.name} · {food.grams} g · {food.source}
                    </p>
                  ))}
                </div>
              ))}
              {preview.payload.energy && (
                <p>
                  Meta {preview.payload.energy.finalEnergy.toFixed(0)} kcal ·{" "}
                  {preview.payload.energy.reference}
                </p>
              )}
            </section>
          )}
        </section>
      )}
    </>
  );
}
function ProfileForm({
  token,
  value,
  onChange,
  busy,
  task,
  onSaved,
}: {
  token: string | null;
  value: Profile;
  onChange: (v: Profile) => void;
  busy: boolean;
  task: Task;
  onSaved: () => void;
}) {
  const fields: Record<string, string> = {
    fullName: "Nome completo",
    professionalName: "Nome profissional",
    crn: "CRN",
    region: "Região",
    email: "E-mail",
    phone: "Telefone",
    job: "Cargo",
    workplace: "Local de trabalho",
    address: "Endereço (opcional)",
  };
  function resource(key: "logo" | "signature", file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...value, [key]: String(reader.result) });
    reader.readAsDataURL(file);
  }
  return (
    <>
      <Heading
        title="Perfil profissional"
        description="Sua identificação no espaço Saúde."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void task(async () => {
            await api(token, { op: "save_profile", profile: value });
            onSaved();
          });
        }}
      >
        <section className="form-section">
          <h2>Dados profissionais</h2>
          <div className="form-grid">
            {Object.entries(fields).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  value={String(value[key as keyof Profile] ?? "")}
                  type={key === "email" ? "email" : "text"}
                  required={key !== "address"}
                  onChange={(e) =>
                    onChange({ ...value, [key]: e.target.value })
                  }
                />
              </Field>
            ))}
            <Field label="Logotipo (opcional)">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => resource("logo", e.target.files?.[0])}
              />
            </Field>
            <Field label="Assinatura (opcional)">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => resource("signature", e.target.files?.[0])}
              />
            </Field>
          </div>
        </section>
        <button className="primary" disabled={busy}>
          Salvar perfil
        </button>
      </form>
    </>
  );
}
function PrescriptionForm({
  token,
  value,
  onChange,
  patient,
  busy,
  onCancel,
  onSave,
}: {
  token: string | null;
  value: PrescriptionPayload;
  onChange: (v: PrescriptionPayload) => void;
  patient: Patient;
  busy: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  const total = menuComposition(value.meals);
  function changeFood(
    mealIndex: number,
    itemIndex: number,
    key: keyof Food,
    valueInput: string,
  ) {
    const meals = structuredClone(value.meals);
    const food = meals[mealIndex].items[itemIndex];
    if (["name", "source"].includes(key)) {
      Object.assign(food, { [key]: valueInput });
    } else Object.assign(food, { [key]: Number(valueInput) });
    onChange({ ...value, meals });
  }
  return (
    <>
      <Heading
        title="Prescrição e cardápio"
        description={`Paciente: ${displayName(patient)}`}
      >
        <button onClick={onCancel}>Voltar ao paciente</button>
      </Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <section className="form-section" data-tour="plan">
          <h2>Plano individual</h2>
          <Field label="Objetivo">
            <input
              value={value.objective}
              onChange={(e) =>
                onChange({ ...value, objective: e.target.value })
              }
            />
          </Field>
          <Field label="Orientações">
            <textarea
              rows={4}
              value={value.guidance}
              onChange={(e) => onChange({ ...value, guidance: e.target.value })}
            />
          </Field>
        </section>
        <EnergyForm
          token={token}
          value={value.energy}
          onChange={(energy) => onChange({ ...value, energy })}
        />
        <section className="form-section" data-tour="meals">
          <div className="section-heading">
            <h2>Refeições</h2>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  meals: [...value.meals, { name: "", items: [] }],
                })
              }
            >
              Adicionar refeição
            </button>
          </div>
          <p className="hint">
            Composição personalizada por 100 g. Registre a origem dos valores. A
            busca inclui uma base inicial TBCA 7.3 offline. Dados ausentes e
            traços não são tratados como zero.
          </p>
          {value.meals.map((meal, mi) => (
            <div className="meal" key={mi}>
              <div className="inline">
                <Field label="Nome da refeição">
                  <input
                    value={meal.name}
                    required
                    onChange={(e) => {
                      const meals = structuredClone(value.meals);
                      meals[mi].name = e.target.value;
                      onChange({ ...value, meals });
                    }}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => {
                    const meals = structuredClone(value.meals);
                    meals[mi].items.push({
                      name: "",
                      source: "",
                      grams: 100,
                      kcal: 0,
                      protein: 0,
                      carbs: 0,
                      fat: 0,
                      fiber: 0,
                    });
                    onChange({ ...value, meals });
                  }}
                >
                  Adicionar alimento
                </button>
              </div>
              <FoodPicker
                onAdd={(food) => {
                  const meals = structuredClone(value.meals);
                  meals[mi].items.push(food);
                  onChange({ ...value, meals });
                }}
              />
              {meal.items.map((item, ii) => (
                <div className="food-grid" key={ii}>
                  <Field label="Alimento">
                    <input
                      required
                      readOnly={Boolean(item.code)}
                      value={item.name}
                      onChange={(e) =>
                        changeFood(mi, ii, "name", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Origem (ex.: rótulo)">
                    <input
                      required
                      readOnly={Boolean(item.code)}
                      value={item.source}
                      onChange={(e) =>
                        changeFood(mi, ii, "source", e.target.value)
                      }
                    />
                  </Field>
                  {Object.entries({
                    grams: "Quantidade (g)",
                    kcal: "kcal / 100 g",
                    protein: "Proteína / 100 g",
                    carbs: "Carboidrato / 100 g",
                    fat: "Gordura / 100 g",
                    fiber: "Fibra / 100 g",
                  }).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input
                        type="number"
                        readOnly={Boolean(item.code) && key !== "grams"}
                        min={key === "grams" ? 0.01 : 0}
                        step="any"
                        required
                        value={Number(item[key as keyof Food])}
                        onChange={(e) =>
                          changeFood(mi, ii, key as keyof Food, e.target.value)
                        }
                      />
                    </Field>
                  ))}
                  {item.measures && item.measures.length > 0 && (
                    <Field label="Converter medida caseira para gramas">
                      <select
                        value=""
                        onChange={(e) =>
                          changeFood(mi, ii, "grams", e.target.value)
                        }
                      >
                        <option value="">Selecione uma medida</option>
                        {item.measures.map((m) => (
                          <option key={m.name} value={m.grams}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const meals = structuredClone(value.meals);
                      meals[mi].items.splice(ii, 1);
                      onChange({ ...value, meals });
                    }}
                  >
                    Remover alimento
                  </button>
                </div>
              ))}
            </div>
          ))}
        </section>
        <div className="nutrition-total">
          <strong>Total do cardápio: {total.kcal.toFixed(0)} kcal</strong>
          <span>
            Proteínas {total.protein.toFixed(1)} g · Carboidratos{" "}
            {total.carbs.toFixed(1)} g · Gorduras {total.fat.toFixed(1)} g ·
            Fibras {total.fiber.toFixed(1)} g
          </span>
        </div>
        {value.energy && (
          <p>
            Energia do cardápio:{" "}
            {((total.kcal / value.energy.finalEnergy) * 100).toFixed(1)}% da
            meta ·{" "}
            {total.kcal >= value.energy.finalEnergy * 0.95 &&
            total.kcal <= value.energy.finalEnergy * 1.05
              ? "Dentro da faixa de 95% a 105%"
              : "Fora da faixa de 95% a 105%"}
          </p>
        )}
        <Micronutrients items={value.meals.flatMap((m) => m.items)} />
        <div className="form-actions">
          <button className="primary" disabled={busy}>
            Salvar rascunho da prescrição
          </button>
          <button type="button" onClick={onCancel}>
            Voltar
          </button>
        </div>
      </form>
    </>
  );
}
function AuditPage({ token, task }: { token: string | null; task: Task }) {
  const [items, setItems] = useState<AuditEvent[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    from: "",
    to: "",
    user: "",
    action: "",
    entity: "",
    result: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  async function load(next?: string, opened = false) {
    const data = await api<{ items: AuditEvent[]; cursor: string | null }>(
      token,
      {
        op: "audit",
        filter: next
          ? { cursor: next }
          : {
              open: opened,
              ...Object.fromEntries(
                Object.entries(filter).filter(([, v]) => v),
              ),
              from: filter.from ? new Date(filter.from).toISOString() : null,
              to: filter.to ? new Date(filter.to).toISOString() : null,
            },
      },
    );
    setItems(data.items);
    setCursor(data.cursor);
  }
  useEffect(() => {
    void task(async () => {
      setUsers(await api<User[]>(token, { op: "users" }));
      await load(undefined, true);
    });
  }, [token]);
  return (
    <>
      <Heading
        title="Auditoria"
        description="Metadados das ações. A consulta inicial cobre os últimos 30 dias."
      />
      <form
        className="filter-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void task(() => load());
        }}
      >
        <Field label="Usuário">
          <select
            value={filter.user}
            onChange={(e) => setFilter({ ...filter, user: e.target.value })}
          >
            <option value="">Todos</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>
        {Object.entries({
          from: "De",
          to: "Até",
          action: "Ação",
          entity: "Tipo de entidade",
          result: "Resultado",
        }).map(([key, label]) => (
          <Field key={key} label={label}>
            {["from", "to"].includes(key) ? (
              <input
                type={["from", "to"].includes(key) ? "datetime-local" : "text"}
                value={filter[key as keyof typeof filter]}
                onChange={(e) =>
                  setFilter({ ...filter, [key]: e.target.value })
                }
              />
            ) : (
              <select
                value={filter[key as keyof typeof filter]}
                onChange={(e) =>
                  setFilter({ ...filter, [key]: e.target.value })
                }
              >
                <option value="">Todos</option>
                {Object.entries(
                  key === "action"
                    ? auditActions
                    : key === "entity"
                      ? auditEntities
                      : auditResults,
                ).map(([value, title]) => (
                  <option key={value} value={value}>
                    {title}
                  </option>
                ))}
              </select>
            )}
          </Field>
        ))}
        <button>Aplicar filtros</button>
      </form>
      {items.length === 0 ? (
        <div className="empty">
          <h2>Nenhum evento neste período</h2>
          <p>Altere os filtros para consultar outros registros.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quando</th>
                <th>Ator</th>
                <th>Ação</th>
                <th>Resultado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id}>
                  <td>{dateTime(e.at)}</td>
                  <td>
                    {e.user ??
                      (e.actor === "SYSTEM" ? "Sistema" : "Não autenticado")}
                  </td>
                  <td>{auditActions[e.action] ?? e.action}</td>
                  <td>{auditResults[e.result] ?? e.result}</td>
                  <td>
                    <button
                      onClick={() =>
                        void task(async () =>
                          setDetail(
                            await api(token, { op: "audit_detail", id: e.id }),
                          ),
                        )
                      }
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cursor && (
        <button onClick={() => void task(() => load(cursor))}>
          Próxima página
        </button>
      )}
      {detail && (
        <section className="form-section">
          <div className="section-heading">
            <h2>Metadados do evento</h2>
            <button onClick={() => setDetail(null)}>Fechar detalhe</button>
          </div>
          <dl>
            {Object.entries(detail).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{String(value ?? "—")}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}
function BackupPage({
  token,
  task,
  onRestore,
}: {
  token: string | null;
  task: Task;
  onRestore: () => void;
}) {
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [password, setPassword] = useState("");
  const [path, setPath] = useState("");
  const [result, setResult] = useState("");
  async function refresh() {
    setStatus(await api<BackupStatus>(token, { op: "backup_status" }));
  }
  useEffect(() => {
    void task(refresh);
  }, [token]);
  return (
    <>
      <Heading
        title="Backup e restauração"
        description="Mantenha uma cópia recuperável do seu trabalho."
      />
      <section className="form-section" data-tour="backup">
        <h2>Última cópia válida</h2>
        <p>{dateTime(status?.lastBackup ?? "")}</p>
        {(status?.stale || status?.failed) && (
          <p className="message error">
            {status.failed
              ? "A última tentativa falhou. Crie uma nova cópia."
              : "Não há backup válido nas últimas 24 horas."}
          </p>
        )}
        <p className="hint">
          Uma cópia automática é criada no primeiro acesso diário. Guarde também
          uma cópia em outra mídia quando disponível.
        </p>
        <button
          className="primary"
          onClick={() =>
            void task(async () => {
              const destination = await save({
                defaultPath: `webfit-${Date.now()}.webfit-backup`,
                filters: [
                  { name: "Backup WebFit", extensions: ["webfit-backup"] },
                ],
              });
              if (destination) {
                const result = await api<{ path: string }>(token, {
                  op: "backup",
                  path: destination,
                });
                setResult(`Backup criado: ${result.path}`);
                await refresh();
              }
            })
          }
        >
          Criar backup manual
        </button>
        {result && <p role="status">{result}</p>}
      </section>
      <section className="form-section" data-tour="restore">
        <h2>Restaurar uma cópia</h2>
        <p>
          A cópia será validada antes de substituir os cadastros. O estado atual
          será preservado em um backup de segurança.
        </p>
        <button
          onClick={() =>
            void task(async () => {
              const file = await open({
                multiple: false,
                filters: [
                  { name: "Backup WebFit", extensions: ["webfit-backup"] },
                ],
              });
              if (typeof file === "string") setPath(file);
            })
          }
        >
          Selecionar backup
        </button>
        {path && <p>{path}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              window.confirm(
                "Restaurar este backup? Cadastros atuais serão substituídos após validação e cópia de segurança.",
              )
            )
              void task(async () => {
                await api(token, {
                  op: "restore",
                  path,
                  password,
                  confirmed: true,
                });
                setPassword("");
                onRestore();
              });
          }}
        >
          <Field label="Senha de recuperação do backup">
            <input
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          <button className="danger" disabled={!path}>
            Validar e restaurar
          </button>
        </form>
      </section>
    </>
  );
}
function AccessPage({
  token,
  user,
  task,
  onChanged,
}: {
  token: string | null;
  user: User;
  task: Task;
  onChanged: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    if (user.role === "ADMIN" && !user.must_change)
      void task(async () => setUsers(await api(token, { op: "users" })));
  }, [token, user.role, user.must_change]);
  return (
    <>
      <Heading
        title={
          user.must_change ? "Troque sua senha temporária" : "Acesso local"
        }
        description="Senhas permanecem protegidas neste computador."
      />
      <section className="form-section">
        <h2>Trocar minha senha</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            void task(async () => {
              await api(token, {
                op: "change_password",
                current: data.get("current"),
                replacement: data.get("replacement"),
              });
              onChanged();
            });
          }}
        >
          <Field label="Senha atual">
            <input
              name="current"
              type="password"
              required
              autoComplete="current-password"
            />
          </Field>
          <Field label="Nova senha (mínimo 6 caracteres)">
            <input
              name="replacement"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </Field>
          <button className="primary">Salvar e entrar novamente</button>
        </form>
      </section>
      {user.role === "ADMIN" && !user.must_change && (
        <section className="form-section">
          <h2>Redefinir acesso da nutricionista</h2>
          <p>
            Uma senha temporária exige troca no primeiro acesso. A senha
            anterior não é exibida.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              void task(async () => {
                await api(token, {
                  op: "reset_password",
                  user_id: d.get("user_id"),
                  temporary: d.get("temporary"),
                });
                window.alert("Senha temporária definida.");
              });
            }}
          >
            <Field label="Usuário">
              <select name="user_id">
                {users
                  .filter((u) => u.role === "NUTRITIONIST")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Senha temporária (mínimo 6 caracteres)">
              <input
                type="password"
                name="temporary"
                minLength={6}
                required
                autoComplete="new-password"
              />
            </Field>
            <button>Definir senha temporária</button>
          </form>
        </section>
      )}
    </>
  );
}
