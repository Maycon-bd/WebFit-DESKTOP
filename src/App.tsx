import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Dashboard } from "./Dashboard";
import { Personalization } from "./Personalization";
import type { FormEvent, ReactNode } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { listen } from "@tauri-apps/api/event";
import { WindowCloseGuard } from "./WindowCloseGuard";
import { UpdatePanel } from "./UpdatePanel";
import { BackupNotice } from "./BackupNotice";
import { DraftRecoveryDialog } from "./DraftRecoveryDialog";
import { FormFeedback } from "./FormFeedback";
import { FormField as Field } from "./FormField";
import { DateField } from "./DateField";
import { ValueField } from "./ValueField";
import { SearchInput } from "./SearchInput";
import { MestreGrid } from "./MestreGrid";
import { PatientSexField, canonicalPatientSex } from "./PatientSexField";
import type { FormFeedbackState } from "./FormFeedback";
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
import { compositionText, displayName, menuComposition } from "./nutrition";
import { EnergyForm } from "./EnergyForm";
import { FoodPicker } from "./FoodPicker";
import { GuidedTour } from "./GuidedTour";
import { LoginInfo } from "./LoginInfo";
import { ReleaseNotes } from "./ReleaseNotes";
import { AdminPanel } from "./AdminPanel";
import { LicensePanel } from "./LicensePanel";
import type { LicenseStatus } from "./LicensePanel";
import type { TourId } from "./onboarding";
import {
  auditQuery,
  auditActor,
  createAuditOpening,
  emptyAuditFilters,
} from "./audit-view";
import type { AuditFilters } from "./audit-view";

type Page =
  | "dashboard"
  | "patients"
  | "profile"
  | "audit"
  | "backup"
  | "access"
  | "settings"
  | "personalization";
function NavigationIcon({
  kind,
}: {
  kind: "menu" | "settings" | "chevron" | "logout";
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "menu" ? (
        <path d="M4 6h16M4 12h16M4 18h16" />
      ) : kind === "logout" ? (
        <path d="M10 4H4v16h6M10 12h10m-4-4 4 4-4 4" />
      ) : kind === "chevron" ? (
        <path d="m9 5 7 7-7 7" />
      ) : (
        <>
          <path d="m9 3-.6 2.3-2 .9-2.1-.6-2 3.4 1.6 1.7v2.6l-1.6 1.7 2 3.4 2.1-.6 2 .9L9 21h6l.6-2.3 2-.9 2.1.6 2-3.4-1.6-1.7v-2.6l1.6-1.7-2-3.4-2.1.6-2-.9L15 3z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
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
  UPDATE_PREPARE: "Preparar atualização e criar backup",
  UPDATE_INSTALL_START: "Iniciar instalação da atualização",
  UPDATE_INSTALL: "Instalar atualização",
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
        <h1 className="focus-anchor" tabIndex={-1}>
          {title}
        </h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </header>
  );
}

export default function App() {
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(
    null,
  );
  async function refreshLicense() {
    const r = await api<LicenseStatus>(null, { op: "status" });
    setLicenseStatus(r);
    setInitialized(r.initialized);
  }
  const [adminAccess, setAdminAccess] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [session, setSession] = useState<{ token: string; user: User } | null>(
    null,
  );
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuFocusPending = useRef(false);
  function toggleSidebar() {
    setAccountOpen(false);
    menuFocusPending.current = true;
    setSidebarOpen((open) => !open);
  }
  useLayoutEffect(() => {
    if (menuFocusPending.current) {
      menuButton.current?.focus({ preventScroll: true });
      menuFocusPending.current = false;
    }
  }, [sidebarOpen]);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountButton = useRef<HTMLButtonElement>(null);
  const workspace = useRef<HTMLElement>(null);
  const [navigationFocus, setNavigationFocus] = useState(0);
  useEffect(() => {
    if (navigationFocus > 0 && !document.querySelector(".tour-card"))
      workspace.current?.querySelector("h1")?.focus({ preventScroll: true });
  }, [navigationFocus]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [backupRevision, setBackupRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(null);
  const [checkingDraftContext, setCheckingDraftContext] = useState(false);
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
  const lastDraftContext = useRef<string | null>(null);
  const resolvedDraftId = useRef<string | null>(null);
  const recoveryExitFocus = useRef(false);
  const token = session?.token ?? null;
  const [notesRequest, setNotesRequest] = useState(0);
  const [notesPending, setNotesPending] = useState(true);
  const endDashboardSession = useCallback(() => {
    setError("Sua sessão terminou. Entre novamente para continuar.");
    setNotice("");
    setSession(null);
    setPatient(null);
    setPrescription(null);
    setProfile(emptyProfile);
    setDrafts([]);
    draftRef.current = null;
    draftDirty.current = false;
  }, []);
  const tourScreen: TourId | null =
    page === "patients"
      ? prescription && patient
        ? "prescription"
        : patient
          ? patient.id
            ? "patient"
            : "patient-new"
          : "patients"
      : page === "settings" ||
          page === "dashboard" ||
          page === "personalization"
        ? null
        : page;
  const closeGuard = (
    <WindowCloseGuard
      busy={busy}
      beforeClose={async () => {
        setBusy(true);
        try {
          if (token && draftRef.current && draftDirty.current) {
            await api(token, { op: "save_draft", ...draftRef.current });
            draftDirty.current = false;
          }
        } finally {
          setBusy(false);
        }
      }}
    />
  );
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
    void refreshLicense().catch(() =>
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
  const activeDraftContext =
    prescription && patient
      ? `prescription:${prescriptionId ?? `${patient.id}:new`}`
      : patient
        ? `patient:${patient.id ?? "new"}`
        : page === "profile" && token
          ? "profile"
          : null;
  const activeDraftKind =
    prescription && patient
      ? "prescription"
      : patient
        ? "patient"
        : page === "profile" && token
          ? "profile"
          : null;
  const activeDraftId =
    session && activeDraftContext
      ? `${session.user.id}:${activeDraftContext}`
      : null;
  const matchingDraft = drafts.find(
    (draft) => draft.id === activeDraftId && draft.kind === activeDraftKind,
  );
  const visibleDraft =
    matchingDraft && pendingDraft?.id === matchingDraft.id
      ? pendingDraft
      : null;
  const contextualFeedback =
    !session?.user.must_change &&
    !checkingDraftContext &&
    !visibleDraft &&
    (page === "profile" ||
      (page === "patients" && Boolean(patient) && !prescription));
  useEffect(() => {
    if (!recoveryExitFocus.current) return;
    // The destination may briefly be replaced by its draft-loading state.
    // Retry after that state changes rather than focusing a removed element.
    const frame = requestAnimationFrame(() => {
      const heading = workspace.current?.querySelector("h1");
      if (heading) {
        heading.focus();
        recoveryExitFocus.current = false;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [navigationFocus, checkingDraftContext]);
  useLayoutEffect(() => {
    if (activeDraftId !== lastDraftContext.current) {
      lastDraftContext.current = activeDraftId;
      resolvedDraftId.current = null;
      setPendingDraft(null);
    }
    if (!activeDraftId || !token) {
      setPendingDraft(null);
      setCheckingDraftContext(false);
      return;
    }
    setCheckingDraftContext(true);
    let current = true;
    void api<Draft[]>(token, { op: "drafts" })
      .then((availableDrafts) => {
        if (!current) return;
        setDrafts(availableDrafts);
        const matching = availableDrafts.find(
          (draft) =>
            draft.id === activeDraftId && draft.kind === activeDraftKind,
        );
        if (matching && resolvedDraftId.current !== matching.id)
          setPendingDraft(matching);
        else setPendingDraft(null);
        setCheckingDraftContext(false);
      })
      .catch((error) => {
        if (current) {
          setError(`Rascunho não consultado: ${errorMessage(error)}`);
          setCheckingDraftContext(false);
        }
      });
    return () => {
      current = false;
    };
  }, [activeDraftId, activeDraftKind, token]);
  async function navigate(next: Page) {
    const result = await task(async () => {
      if (draftRef.current && draftDirty.current)
        await api(token, { op: "save_draft", ...draftRef.current });
      draftDirty.current = false;
      const stored =
        next === "profile"
          ? await api<Partial<Profile>>(token, { op: "profile" })
          : null;
      return { stored };
    });
    if (result) {
      setPatient(null);
      setPrescription(null);
      if (result.stored) setProfile({ ...emptyProfile, ...result.stored });
      setAccountOpen(false);
      setPage(next);
      setNavigationFocus((previous) => previous + 1);
    }
  }
  async function loggedIn(result: { token: string; user: User }) {
    setNotesPending(true);
    setPatient(null);
    setPrescription(null);
    setProfile(emptyProfile);
    draftRef.current = null;
    draftDirty.current = false;
    setSession(result);
    setSidebarOpen(true);
    setAccountOpen(false);
    const state = await api<LicenseStatus>(null, { op: "status" });
    setLicenseStatus(state);
    setPage(state.legacy ? "backup" : "dashboard");
    setDrafts(
      state.legacy ? [] : await api<Draft[]>(result.token, { op: "drafts" }),
    );
  }
  function leaveDraft() {
    if (busy || !visibleDraft) return;
    // Leave recovery without resolving it or writing the unopened form.
    // Context changes reset resolvedDraftId, so reentry asks again.
    recoveryExitFocus.current = true;
    draftDirty.current = false;
    draftRef.current = null;
    setPendingDraft(null);
    setPrescription(null);
    if (visibleDraft.kind !== "prescription") setPatient(null);
    setPage("patients");
    setAccountOpen(false);
    setNavigationFocus((previous) => previous + 1);
  }
  async function restoreDraft(draft: Draft) {
    const restored = await task(async () => {
      draftDirty.current = false;
      if (draft.kind === "patient")
        setPatient({
          ...emptyPatient,
          ...(draft.payload as Patient),
          // A recovered draft edits fields, not the identity loaded from the backend.
          id: patient?.id,
          internalNumber: patient?.internalNumber,
        });
      else if (draft.kind === "profile") setProfile(draft.payload as Profile);
      else if (draft.kind === "prescription") {
        const payload = draft.payload as PrescriptionPayload;
        if (!patient || payload.patientId !== patient.id)
          throw new Error("O rascunho não corresponde ao formulário aberto.");
        setPrescription(payload);
        setPrescriptionId(payload.prescriptionId ?? null);
      } else {
        throw new Error("O rascunho não corresponde a este formulário.");
      }
      return true;
    });
    if (restored) {
      resolvedDraftId.current = draft.id;
      setPendingDraft(null);
    }
  }
  async function discardDraft(draft: Draft) {
    const discarded = await task(async () => {
      await api(token, { op: "discard_draft", id: draft.id });
      return true;
    });
    if (discarded) {
      resolvedDraftId.current = draft.id;
      setDrafts((current) => current.filter((item) => item.id !== draft.id));
      setPendingDraft(null);
      draftDirty.current = false;
    }
  }
  if (!session)
    return (
      <>
        {closeGuard}
        {adminPanelOpen && (
          <AdminPanel
            onClose={() => setAdminPanelOpen(false)}
            onRefresh={refreshLicense}
            onSession={loggedIn}
            onEnded={() => setSession(null)}
          />
        )}
        <main className="access-shell">
          <section className="access-intro">
            <img
              className="system-logo"
              src="/brand/webfit-icon.png"
              alt="WebFit Desktop"
              width="112"
              height="112"
            />
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
              {adminAccess
                ? initialized === false
                  ? "Prepare este computador"
                  : "Acesso do administrador"
                : initialized === false
                  ? "Bem-vinda ao WebFit Desktop"
                  : "Entre no Saúde"}
            </h2>
            <p>
              {initialized === false
                ? adminAccess
                  ? "Importe a autorização recebida e prepare o acesso da nutricionista."
                  : "Envie a solicitação ao administrador para ativar este computador."
                : "Use o acesso preparado neste computador."}
            </p>
            {error && (
              <div role="alert" className="message error">
                {error}
              </div>
            )}
            {initialized === false && licenseStatus && (
              <LicensePanel
                status={licenseStatus}
                busy={busy}
                task={task}
                onRefresh={refreshLicense}
                onSession={loggedIn}
                token={null}
                onEnded={() => setSession(null)}
              />
            )}
            {initialized === false &&
            licenseStatus?.pending.some((g) => g.kind === "INITIAL") ? (
              <SetupForm
                busy={busy}
                onSubmit={(data) =>
                  task(async () => {
                    await api(null, { op: "setup", ...data });
                    setInitialized(true);
                    await refreshLicense();
                    setAdminAccess(false);
                    setNotice("Acessos preparados. Entre com um deles.");
                  })
                }
              />
            ) : initialized !== false ? (
              <LoginForm
                key={adminAccess ? "admin" : "professional"}
                adminAccess={adminAccess}
                busy={busy || initialized === null}
                onSubmit={(name, password, remember) =>
                  task(async () => {
                    const result = await api<{ token: string; user: User }>(
                      null,
                      { op: "login", name, password },
                    );
                    let preferenceFailed = false;
                    try {
                      await api(result.token, {
                        op: "remember_login",
                        remember,
                      });
                    } catch {
                      preferenceFailed = true;
                    }
                    await loggedIn(result);
                    if (preferenceFailed)
                      setNotice(
                        "Você entrou, mas não foi possível atualizar o nome lembrado. Tente novamente no próximo acesso.",
                      );
                  })
                }
              />
            ) : null}
            {adminAccess && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setAdminAccess(false);
                  setError("");
                }}
              >
                Voltar ao acesso da nutricionista
              </button>
            )}
            {notice && <p role="status">{notice}</p>}
          </section>
          <LoginInfo
            busy={busy}
            adminUnavailable={initialized === null}
            error={error}
            onAdmin={() => {
              setAdminPanelOpen(true);
              setError("");
              setNotice("");
            }}
          >
            {initialized === true && licenseStatus && (
              <LicensePanel
                status={licenseStatus}
                busy={busy}
                task={task}
                onRefresh={refreshLicense}
                onSession={loggedIn}
                token={null}
                onEnded={() => setSession(null)}
              />
            )}
          </LoginInfo>
        </main>
      </>
    );
  if (licenseStatus?.legacy)
    return (
      <>
        {closeGuard}
        {adminPanelOpen && (
          <AdminPanel
            onClose={() => setAdminPanelOpen(false)}
            onRefresh={refreshLicense}
            onSession={loggedIn}
            onEnded={() => setSession(null)}
          />
        )}
        <main className="issuer-main">
          <h1>Banco de testes preservado</h1>
          <p>
            O uso clínico exige uma instalação vazia licenciada. Exporte o
            backup antes de preparar o novo destino.
          </p>
          {error && <p role="alert">{error}</p>}
          <BackupPage
            token={token}
            task={task}
            onRestore={() => setSession(null)}
            backupOnly
          />
          <button
            disabled={busy}
            onClick={() =>
              void task(async () => {
                await api(token, { op: "logout" });
                setSession(null);
              })
            }
          >
            Bloquear e sair
          </button>
        </main>
      </>
    );
  return (
    <>
      {closeGuard}
      {adminPanelOpen && (
        <AdminPanel
          onClose={() => setAdminPanelOpen(false)}
          onRefresh={refreshLicense}
          onSession={loggedIn}
          onEnded={() => setSession(null)}
        />
      )}
      <div className="application-frame">
        {!session.user.must_change && !licenseStatus?.legacy && (
          <ReleaseNotes
            key={session.token}
            token={session.token}
            manualRequest={notesRequest}
            onPendingChange={setNotesPending}
          />
        )}
        {!session.user.must_change && (
          <UpdatePanel
            key={session.token}
            token={session.token}
            blocked={
              busy ||
              (page !== "patients" && page !== "dashboard") ||
              patient !== null ||
              prescription !== null
            }
            run={task}
          />
        )}
        <div className={`app-shell${sidebarOpen ? "" : " sidebar-collapsed"}`}>
          <div className="sidebar-slot">
            <div className="sidebar-clip">
              <aside
                className="sidebar"
                id="consultorio-sidebar"
                inert={!sidebarOpen}
                aria-hidden={!sidebarOpen}
              >
                <div className="sidebar-header">
                  <button
                    className="system-home"
                    aria-label="Ir para Dashboard"
                    disabled={busy || session.user.must_change}
                    onClick={() => void navigate("dashboard")}
                  >
                    <img
                      className="system-logo"
                      src="/brand/webfit-icon.png"
                      alt="WebFit Desktop"
                      width="72"
                      height="72"
                    />
                  </button>
                </div>
                <nav aria-label="Módulos do consultório">
                  <h2 className="workspace">Consultório</h2>
                  <button
                    aria-current={page === "dashboard" ? "page" : undefined}
                    onClick={() => void navigate("dashboard")}
                    disabled={busy || session.user.must_change}
                  >
                    Dashboard
                  </button>
                  <button
                    aria-current={page === "patients" ? "page" : undefined}
                    onClick={() => void navigate("patients")}
                    disabled={busy || session.user.must_change}
                  >
                    Pacientes
                  </button>
                </nav>
                <div className="sidebar-bottom">
                  <div className="account-controls">
                    <button
                      ref={accountButton}
                      className="account-name"
                      aria-expanded={accountOpen}
                      aria-controls="account-options"
                      onKeyDown={(event) => {
                        if (event.key === "Escape" && accountOpen) {
                          event.preventDefault();
                          event.stopPropagation();
                          setAccountOpen(false);
                        }
                      }}
                      onClick={() => setAccountOpen(!accountOpen)}
                      disabled={busy || session.user.must_change}
                    >
                      <strong>{session.user.name}</strong>
                      <small>
                        {session.user.role === "ADMIN"
                          ? "Administrador"
                          : "Nutricionista"}
                      </small>
                    </button>
                    <button
                      className="settings-button"
                      aria-label="Configurações"
                      title="Configurações"
                      aria-current={
                        [
                          "settings",
                          "audit",
                          "backup",
                          "personalization",
                        ].includes(page)
                          ? "page"
                          : undefined
                      }
                      disabled={busy || session.user.must_change}
                      onClick={() => void navigate("settings")}
                    >
                      <NavigationIcon kind="settings" />
                    </button>
                    <button
                      className="logout-button"
                      aria-label="Sair da conta"
                      title="Sair da conta"
                      disabled={busy}
                      onClick={() =>
                        void task(async () => {
                          if (draftRef.current && draftDirty.current)
                            await api(token, {
                              op: "save_draft",
                              ...draftRef.current,
                            });
                          draftDirty.current = false;
                          await api(token, { op: "logout" });
                          setSession(null);
                          setPatient(null);
                          setPrescription(null);
                          setProfile(emptyProfile);
                          draftRef.current = null;
                        })
                      }
                      data-tour="logout"
                    >
                      <NavigationIcon kind="logout" />
                    </button>
                  </div>
                  <div
                    id="account-options"
                    className="account-options"
                    hidden={!accountOpen}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        event.preventDefault();
                        event.stopPropagation();
                        setAccountOpen(false);
                        accountButton.current?.focus();
                      }
                    }}
                  >
                    <button
                      disabled={busy || session.user.must_change}
                      aria-current={page === "access" ? "page" : undefined}
                      onClick={() => void navigate("access")}
                    >
                      Acesso
                    </button>
                    <button
                      disabled={busy || session.user.must_change}
                      aria-current={page === "profile" ? "page" : undefined}
                      onClick={() => void navigate("profile")}
                    >
                      Perfil profissional
                    </button>
                    <button
                      type="button"
                      disabled={busy || session.user.must_change}
                      onClick={() => setNotesRequest((value) => value + 1)}
                    >
                      Ver novidades
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          <div className={`shell-toolbar${sidebarOpen ? " sidebar-open" : ""}`}>
            <button
              ref={menuButton}
              className="menu-toggle"
              type="button"
              aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
              title={sidebarOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={sidebarOpen}
              aria-controls="consultorio-sidebar"
              data-tour="navigation-toggle"
              onClick={toggleSidebar}
            >
              <NavigationIcon kind="menu" />
            </button>
          </div>
          <main className="workspace-main" ref={workspace}>
            <DraftRecoveryDialog
              open={Boolean(visibleDraft)}
              formLabel={
                visibleDraft?.kind === "patient"
                  ? (visibleDraft.payload as Patient).id
                    ? "edição de paciente"
                    : "cadastro de paciente"
                  : visibleDraft?.kind === "profile"
                    ? "perfil profissional"
                    : visibleDraft
                      ? "prescrição ou cardápio"
                      : ""
              }
              savedAt={visibleDraft ? dateTime(visibleDraft.at) : ""}
              savedAtIso={visibleDraft?.at ?? ""}
              busy={busy}
              onBack={leaveDraft}
              backLabel={
                visibleDraft?.kind === "prescription"
                  ? "Voltar ao paciente"
                  : "Voltar à lista"
              }
              onRestore={() => {
                if (visibleDraft) void restoreDraft(visibleDraft);
              }}
              onDiscard={() => {
                if (visibleDraft) void discardDraft(visibleDraft);
              }}
            />
            {!session.user.must_change && !notesPending && tourScreen && (
              <GuidedTour token={session.token} screen={tourScreen} />
            )}
            <div className="test-banner">
              Ambiente de teste · dados fictícios · instalação local
            </div>
            {!session.user.must_change && (
              <BackupNotice
                token={session.token}
                revision={backupRevision}
                busy={busy}
                onManage={() => void navigate("backup")}
              />
            )}
            {error && !contextualFeedback && (
              <div role="alert" className="message error">
                {error}
              </div>
            )}
            {notice && !contextualFeedback && (
              <div role="status" className="message success">
                {notice}
              </div>
            )}
            {busy && !contextualFeedback && (
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
                {(page === "audit" ||
                  page === "backup" ||
                  page === "personalization") && (
                  <button
                    className="settings-return"
                    disabled={busy}
                    onClick={() => void navigate("settings")}
                  >
                    Voltar às Configurações
                  </button>
                )}
                {page === "settings" && (
                  <section aria-label="Configurações">
                    <Heading
                      title="Configurações"
                      description="Personalize o aplicativo e cuide dos registros e das cópias do consultório."
                    />
                    <div className="settings-list">
                      <button
                        disabled={busy}
                        onClick={() => void navigate("personalization")}
                      >
                        <span>
                          <strong>Personalização</strong>
                          <small>Escolher entre o tema claro e o escuro.</small>
                        </span>
                        <NavigationIcon kind="chevron" />
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => void navigate("audit")}
                      >
                        <span>
                          <strong>Auditoria</strong>
                          <small>
                            Consultar as ações realizadas no aplicativo.
                          </small>
                        </span>
                        <NavigationIcon kind="chevron" />
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => void navigate("backup")}
                      >
                        <span>
                          <strong>Backup e restauração</strong>
                          <small>
                            Consultar suas cópias, criar um backup ou restaurar
                            os dados.
                          </small>
                        </span>
                        <NavigationIcon kind="chevron" />
                      </button>
                    </div>
                    <section
                      className="form-section"
                      aria-labelledby="tutorial-settings-title"
                    >
                      <h2 id="tutorial-settings-title">Tutoriais</h2>
                      <p className="hint">
                        Reinicie as orientações do seu usuário para vê-las
                        novamente ao entrar em cada tela.
                      </p>
                      <button
                        disabled={busy}
                        onClick={() =>
                          void task(async () => {
                            await api(token, { op: "reset_tours" });
                            setNotice(
                              "Tutoriais reiniciados. As orientações aparecerão ao entrar novamente em cada tela.",
                            );
                          })
                        }
                      >
                        Reiniciar tutoriais
                      </button>
                    </section>
                    {licenseStatus && (
                      <button
                        disabled={busy}
                        onClick={() => setAdminPanelOpen(true)}
                      >
                        Painel administrativo
                      </button>
                    )}
                    {licenseStatus && (
                      <LicensePanel
                        status={licenseStatus}
                        busy={busy}
                        task={task}
                        onRefresh={refreshLicense}
                        onSession={loggedIn}
                        token={token}
                        onEnded={() => setSession(null)}
                      />
                    )}
                  </section>
                )}
                {page === "personalization" && <Personalization />}
                {page === "dashboard" && (
                  <Dashboard
                    token={token}
                    busy={busy}
                    onUnauthorized={endDashboardSession}
                    onPatients={() => void navigate("patients")}
                    onNewPatient={() => {
                      setPage("patients");
                      setPatient(structuredClone(emptyPatient));
                      setNavigationFocus((previous) => previous + 1);
                    }}
                    onProfile={() => void navigate("profile")}
                    onBackup={() => void navigate("backup")}
                  />
                )}
                {page === "patients" &&
                  (checkingDraftContext && activeDraftId ? (
                    <p role="status">Verificando rascunho salvo…</p>
                  ) : prescription && patient ? (
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
                      feedback={
                        contextualFeedback
                          ? { busy, error, notice }
                          : { busy: false, error: "", notice: "" }
                      }
                      patient={{
                        ...emptyPatient,
                        ...patient,
                        sex: patient.sex ?? "",
                        tags: patient.tags ?? [],
                      }}
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
                      onSaved={(id, internalNumber) => {
                        draftDirty.current = false;
                        setPatient({ ...patient, id, internalNumber });
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
                {page === "profile" && checkingDraftContext ? (
                  <p role="status">Verificando rascunho salvo…</p>
                ) : page === "profile" ? (
                  <ProfileForm
                    feedback={
                      contextualFeedback
                        ? { busy, error, notice }
                        : { busy: false, error: "", notice: "" }
                    }
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
                ) : null}
                {page === "audit" && <AuditPage token={token} task={task} />}
                {page === "backup" && (
                  <BackupPage
                    token={token}
                    task={task}
                    onStatusChange={() =>
                      setBackupRevision((value) => value + 1)
                    }
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
      </div>
    </>
  );
}
type Task = <T>(run: () => Promise<T>) => Promise<T | undefined>;
function LoginForm({
  busy,
  onSubmit,
  adminAccess = false,
}: {
  busy: boolean;
  adminAccess?: boolean;
  onSubmit: (name: string, password: string, remember: boolean) => void;
}) {
  const [name, setName] = useState(adminAccess ? "admin" : "");
  const [remember, setRemember] = useState(false);
  const [loadingPreference, setLoadingPreference] = useState(true);
  const [preferenceError, setPreferenceError] = useState(false);
  const edited = useRef(false);
  useEffect(() => {
    let active = true;
    void api<{ name: string | null }>(null, {
      op: "remembered_login",
      administrator: adminAccess,
    }).then(
      (result) => {
        if (!active) return;
        if (!edited.current && result.name !== null) {
          setName(result.name);
          setRemember(true);
        }
        setLoadingPreference(false);
      },
      () => {
        if (!active) return;
        setPreferenceError(true);
        setLoadingPreference(false);
      },
    );
    return () => {
      active = false;
    };
  }, [adminAccess]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        if (!busy && !loadingPreference)
          onSubmit(String(d.get("name")), String(d.get("password")), remember);
      }}
    >
      <Field label="Nome de acesso">
        <input
          name="name"
          required
          autoComplete="username"
          autoFocus
          value={name}
          onChange={(e) => {
            edited.current = true;
            setName(e.target.value);
          }}
        />
      </Field>
      {adminAccess && (
        <p className="hint">
          Se o administrador foi cadastrado com outro nome, use o nome original.
        </p>
      )}
      <Field label="Senha">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      <label className="remember-login">
        <input
          type="checkbox"
          checked={remember}
          disabled={busy || loadingPreference}
          onChange={(e) => {
            edited.current = true;
            setRemember(e.target.checked);
          }}
          aria-describedby="remember-login-hint"
        />
        Lembrar de mim
      </label>
      <p id="remember-login-hint" className="hint">
        Salvar apenas o nome de acesso. A senha será pedida sempre.
      </p>
      {preferenceError && (
        <p role="status" className="hint">
          Não foi possível consultar o nome lembrado. Você pode preencher o
          acesso e entrar.
        </p>
      )}
      <button className="primary" disabled={busy || loadingPreference}>
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
      <p>O acesso administrativo foi definido pelo emissor da licença.</p>
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
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Número, nome, CPF ou telefone"
          />
        </Field>
        <select
          className="patient-status-select"
          aria-label="Situação dos pacientes"
          value={archived ? "archived" : "active"}
          onChange={(event) =>
            setArchived(event.currentTarget.value === "archived")
          }
        >
          <option value="active">Ativos</option>
          <option value="archived">Arquivados</option>
        </select>
      </div>
      {loaded && items.length === 0 ? (
        <section className="empty">
          <h2>
            {query ? "Nenhum paciente encontrado" : "Sua lista começa aqui"}
          </h2>
          <p>
            {query
              ? "Tente outro número, nome, CPF ou telefone."
              : "Cadastre um paciente fictício para testar o acompanhamento."}
          </p>
          {!query && (
            <button onClick={onNew}>Cadastrar primeiro paciente</button>
          )}
        </section>
      ) : (
        <MestreGrid
          label="Pacientes encontrados"
          rows={items}
          rowKey={(p) => p.id!}
          columns={[
            {
              key: "number",
              label: "Número",
              sortValue: (p) => p.internalNumber ?? 0,
              render: (p) => p.internalNumber,
            },
            {
              key: "name",
              label: "Paciente",
              sortValue: (p) => displayName(p),
              render: (p) => (
                <>
                  <strong>{displayName(p)}</strong>
                  {p.socialName && <small>{p.name}</small>}
                </>
              ),
            },
            {
              key: "cpf",
              label: "CPF",
              sortValue: (p) => p.cpf || "",
              render: (p) => p.cpf || "Não informado",
            },
            {
              key: "birth",
              label: "Nascimento",
              sortValue: (p) => p.birth,
              render: (p) => p.birth.split("-").reverse().join("/"),
            },
            {
              key: "phone",
              label: "Telefone",
              sortValue: (p) => p.phone || "",
              render: (p) => p.phone || "Não informado",
            },
            {
              key: "actions",
              label: "Ações",
              sortable: false,
              render: (p) => (
                <button
                  onClick={() => onOpen(p.id!)}
                  aria-label={`Abrir ${displayName(p)}`}
                >
                  Abrir cadastro
                </button>
              ),
            },
          ]}
          footer={
            items.length === 200 && (
              <p>Mostrando até 200 resultados. Refine a pesquisa.</p>
            )
          }
        />
      )}
    </>
  );
}
function PatientForm({
  feedback,
  patient,
  onChange,
  token,
  busy,
  task,
  onClose,
  onSaved,
  onPrescription,
}: {
  feedback: FormFeedbackState;
  patient: Patient;
  onChange: (p: Patient) => void;
  token: string | null;
  busy: boolean;
  task: Task;
  onClose: () => void;
  onSaved: (id: string, internalNumber: number) => void;
  onPrescription: (p?: Prescription) => void;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [plans, setPlans] = useState<Prescription[]>([]);
  const [tagName, setTagName] = useState("");
  const [preview, setPreview] = useState<Prescription | null>(null);
  const [guardian, setGuardian] = useState(Boolean(patient.guardian));
  const [validationAttempted, setValidationAttempted] = useState(false);
  const submitting = useRef(false);
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
        {type === "date" ? (
          <DateField
            name={key}
            value={String(patient[key] ?? "")}
            required={required}
            onValueChange={(value) => onChange({ ...patient, [key]: value })}
          />
        ) : (
          <input
            type={type}
            name={key}
            value={String(patient[key] ?? "")}
            required={required}
            onChange={(e) => {
              e.currentTarget.setCustomValidity("");
              onChange({ ...patient, [key]: e.target.value });
            }}
          />
        )}
      </Field>
    );
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || submitting.current) return;
    setValidationAttempted(true);
    if (!patient.name.trim()) {
      const nameInput = e.currentTarget.elements.namedItem(
        "name",
      ) as HTMLInputElement | null;
      nameInput?.setCustomValidity("Preencha este campo.");
      nameInput?.reportValidity();
      return;
    }
    submitting.current = true;
    try {
      await task(async () => {
        const result = await api<{ id: string; internalNumber: number }>(
          token,
          {
            op: "save_patient",
            id: patient.id ?? null,
            patient: { ...patient, sex: canonicalPatientSex(patient.sex) },
          },
        );
        onSaved(result.id, result.internalNumber);
      });
    } finally {
      submitting.current = false;
    }
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
        <button
          disabled={busy}
          aria-describedby="patient-exit-help"
          onClick={onClose}
        >
          Voltar à lista
        </button>
      </Heading>
      <p id="patient-exit-help" className="hint">
        Voltar não salva alterações no cadastro. Antes de sair, o preenchimento
        alterado é guardado como rascunho para recuperar depois; se isso falhar,
        o formulário permanece aberto.
      </p>
      <form
        data-draft-form=""
        className={`patient-form${validationAttempted ? " validation-attempted" : ""}`}
        onInvalidCapture={() => setValidationAttempted(true)}
        onSubmit={submit}
      >
        <section className="form-section" data-tour="identity">
          <h2>Identificação e contato</h2>
          {patient.internalNumber != null && (
            <p>
              <strong>Número do paciente: {patient.internalNumber}</strong>
            </p>
          )}
          <p className="hint">
            * Campo obrigatório. Os demais campos são opcionais.
          </p>
          <div className="form-grid">
            {field("name", "Nome completo", "text", true)}
            {field("socialName", "Nome social (opcional)")}
            {field("cpf", "CPF")}
            {field("birth", "Data de nascimento", "date", true)}
            {field("phone", "Telefone", "tel")}
            {field("email", "E-mail", "email")}
            <PatientSexField
              value={patient.sex}
              invalid={validationAttempted && !canonicalPatientSex(patient.sex)}
              onChange={(sex) => onChange({ ...patient, sex })}
            />
            {field("gender", "Gênero (opcional)")}
            <div className="wide">{field("address", "Endereço")}</div>
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
          <p id="patient-tags-help" className="hint">
            Tags são etiquetas opcionais para organizar e localizar pacientes.
            Selecione as existentes ou crie uma etiqueta com um nome que faça
            sentido para seu consultório.
          </p>
          <div
            className="tag-options"
            role="group"
            aria-label="Tags do paciente"
            aria-describedby="patient-tags-help"
          >
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
              aria-describedby="patient-tags-help"
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
          <Field label="Observações">
            <textarea
              rows={4}
              value={patient.notes}
              onChange={(e) => onChange({ ...patient, notes: e.target.value })}
            />
          </Field>
        </section>
        <FormFeedback {...feedback} />
        <div className="form-actions">
          <button className="primary" disabled={busy}>
            Salvar cadastro
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
  feedback,
  token,
  value,
  onChange,
  busy,
  task,
  onSaved,
}: {
  feedback: FormFeedbackState;
  token: string | null;
  value: Profile;
  onChange: (v: Profile) => void;
  busy: boolean;
  task: Task;
  onSaved: () => void;
}) {
  const submitting = useRef(false);
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
        data-draft-form=""
        onSubmit={(e) => {
          e.preventDefault();
          if (busy || submitting.current) return;
          submitting.current = true;
          void task(async () => {
            await api(token, { op: "save_profile", profile: value });
            onSaved();
          }).finally(() => {
            submitting.current = false;
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
        <FormFeedback {...feedback} />
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
        data-draft-form=""
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
            busca inclui o catálogo oficial TBCA 7.3 offline. Dados ausentes e
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
                      {item.code && item[key as keyof Food] === null ? (
                        <input readOnly value="Indisponível na fonte" />
                      ) : (
                        <ValueField
                          readOnly={Boolean(item.code) && key !== "grams"}
                          min={key === "grams" ? 0.01 : 0}
                          required
                          value={Number(item[key as keyof Food])}
                          showCurrencyPrefix={false}
                          emptyAsUndefined={false}
                          onChange={(amount) =>
                            changeFood(
                              mi,
                              ii,
                              key as keyof Food,
                              String(amount ?? 0),
                            )
                          }
                        />
                      )}
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
          <strong>
            Total do cardápio: {compositionText(total.kcal, 0, "kcal")}
          </strong>
          <span>
            Proteínas {compositionText(total.protein, 1, "g")} · Carboidratos{" "}
            {compositionText(total.carbs, 1, "g")} · Gorduras{" "}
            {compositionText(total.fat, 1, "g")} · Fibras{" "}
            {compositionText(total.fiber, 1, "g")}
          </span>
        </div>
        {value.energy && total.kcal !== null && (
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
        {value.energy && total.kcal === null && (
          <p>
            Energia indisponível: o cardápio contém valor ausente ou traço.
            Comparação com a meta indisponível.
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
  const [filter, setFilter] = useState<AuditFilters>({ ...emptyAuditFilters });
  const [applied, setApplied] = useState<AuditFilters>({
    ...emptyAuditFilters,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [queryError, setQueryError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const lock = useRef(false);
  const detailLock = useRef(false);
  const alive = useRef(false);
  const detailSection = useRef<HTMLElement>(null);
  const detailTrigger = useRef<HTMLButtonElement | null>(null);
  const opening = useRef<{
    token: string | null;
    load: () => Promise<{
      users: User[];
      items: AuditEvent[];
      cursor: string | null;
    }>;
  } | null>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (detailId) detailSection.current?.focus();
  }, [detailId]);

  useEffect(() => {
    let active = true;
    alive.current = true;
    opened.current = false;
    if (!opening.current || opening.current.token !== token) {
      opening.current = {
        token,
        load: createAuditOpening(async () => {
          const users = await api<User[]>(token, { op: "users" });
          const page = await api<{
            items: AuditEvent[];
            cursor: string | null;
          }>(token, {
            op: "audit",
            filter: { open: true },
          });
          return { users, ...page };
        }),
      };
    }
    const request = opening.current.load();
    void task(async () => {
      try {
        const data = await request;
        if (!active) return;
        opened.current = true;
        setUsers(data.users);
        setItems(data.items);
        setCursor(data.cursor);
      } catch (error) {
        if (!active) return;
        setQueryError(
          "Não foi possível consultar os eventos. Tente novamente.",
        );
        throw error;
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => {
      active = false;
      alive.current = false;
    };
  }, [token]);

  async function load(filters: AuditFilters, next?: string) {
    if (lock.current) return;
    lock.current = true;
    setLoading(true);
    setQueryError("");
    setDetail(null);
    setDetailId(null);
    setApplied({ ...filters });
    try {
      // Cursors are consumed by the backend. After failure, retry the applied
      // filters from the first page rather than reuse a consumed cursor.
      const query = next
        ? { cursor: next }
        : { ...auditQuery(filters), open: !opened.current };
      if (!opened.current) setUsers(await api<User[]>(token, { op: "users" }));
      const data = await api<{ items: AuditEvent[]; cursor: string | null }>(
        token,
        {
          op: "audit",
          filter: query,
        },
      );
      if (!alive.current) return;
      opened.current = true;
      setItems(data.items);
      setCursor(data.cursor);
    } catch (error) {
      if (!alive.current) return;
      setQueryError(
        error instanceof Error
          ? error.message
          : "Não foi possível consultar os eventos. Tente novamente.",
      );
      setCursor(null);
      throw error;
    } finally {
      lock.current = false;
      if (alive.current) setLoading(false);
    }
  }
  async function showDetail(id: string) {
    if (detailLock.current) return;
    detailLock.current = true;
    setDetailId(id);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const data = await api<Record<string, unknown>>(token, {
        op: "audit_detail",
        id,
      });
      if (alive.current) setDetail(data);
    } catch (error) {
      if (!alive.current) return;
      setDetailError("Não foi possível abrir este evento. Tente novamente.");
      throw error;
    } finally {
      detailLock.current = false;
      if (alive.current) setDetailLoading(false);
    }
  }
  return (
    <>
      <Heading
        title="Auditoria"
        description="Metadados das ações. A consulta inicial cobre os últimos 30 dias."
      />
      <form
        className="audit-filters"
        onSubmit={(e) => {
          e.preventDefault();
          void task(() => load(filter));
        }}
      >
        <fieldset
          className="filter-grid audit-filter-fields"
          disabled={loading || detailLoading}
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
                <DateField
                  type="datetime-local"
                  value={filter[key as keyof typeof filter]}
                  onValueChange={(value) =>
                    setFilter({ ...filter, [key]: value })
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
          <button
            type="button"
            onClick={() => {
              setFilter({ ...emptyAuditFilters });
              void task(() => load({ ...emptyAuditFilters }));
            }}
          >
            Limpar filtros
          </button>
        </fieldset>
      </form>
      {loading ? (
        <p role="status">Consultando eventos…</p>
      ) : queryError ? (
        <section className="message error" role="alert">
          <p>{queryError}</p>
          <button onClick={() => void task(() => load(applied))}>
            Tentar novamente
          </button>
        </section>
      ) : items.length === 0 ? (
        <div className="empty">
          <h2>
            {Object.values(applied).some(Boolean)
              ? "Nenhum resultado para estes filtros"
              : "Nenhum evento nos últimos 30 dias"}
          </h2>
          <p>
            {Object.values(applied).some(Boolean)
              ? "Altere ou limpe os filtros para consultar outros registros."
              : "Os registros de ações aparecerão aqui conforme o sistema for utilizado."}
          </p>
        </div>
      ) : (
        <MestreGrid
          label="Eventos de auditoria"
          rows={items}
          rowKey={(e) => e.id}
          columns={[
            {
              key: "when",
              label: "Quando",
              sortValue: (e) => e.at,
              render: (e) => dateTime(e.at),
            },
            {
              key: "actor",
              label: "Ator",
              sortValue: (e) => auditActor(e.actor, e.user),
              render: (e) => auditActor(e.actor, e.user),
            },
            {
              key: "action",
              label: "Ação",
              sortValue: (e) => auditActions[e.action] ?? e.action,
              render: (e) => auditActions[e.action] ?? e.action,
            },
            {
              key: "entity",
              label: "Entidade",
              sortValue: (e) => auditEntities[e.entity] ?? e.entity,
              render: (e) => auditEntities[e.entity] ?? e.entity,
            },
            {
              key: "result",
              label: "Resultado",
              sortValue: (e) => auditResults[e.result] ?? e.result,
              render: (e) => auditResults[e.result] ?? e.result,
            },
            {
              key: "actions",
              label: "Ações",
              sortable: false,
              render: (e) => (
                <button
                  disabled={detailLoading}
                  aria-label={`Ver detalhes: ${auditActions[e.action] ?? e.action}, ${dateTime(e.at)}`}
                  onClick={(event) => {
                    detailTrigger.current = event.currentTarget;
                    void task(() => showDetail(e.id));
                  }}
                >
                  Detalhes
                </button>
              ),
            },
          ]}
        />
      )}
      {!loading && !queryError && cursor && (
        <button
          disabled={detailLoading}
          onClick={() => void task(() => load(applied, cursor))}
        >
          Próxima página
        </button>
      )}
      {detailId && (
        <section
          className="form-section audit-detail"
          ref={detailSection}
          tabIndex={-1}
          aria-label="Detalhes do evento"
          aria-busy={detailLoading}
        >
          <div className="section-heading">
            <h2>Metadados do evento</h2>
            <button
              disabled={detailLoading}
              onClick={() => {
                setDetail(null);
                setDetailId(null);
                detailTrigger.current?.focus();
              }}
            >
              Fechar detalhe
            </button>
          </div>
          {detailLoading && <p role="status">Abrindo evento…</p>}
          {detailError && (
            <div role="alert">
              <p>{detailError}</p>
              <button onClick={() => void task(() => showDetail(detailId))}>
                Tentar novamente
              </button>
            </div>
          )}
          {detail && (
            <dl>
              {[
                ["Quando", dateTime(String(detail.at ?? ""))],
                [
                  "Ator",
                  auditActor(
                    String(detail.actor),
                    users.find((user) => user.id === detail.userId)?.name,
                  ),
                ],
                [
                  "Ação",
                  auditActions[String(detail.action)] ?? String(detail.action),
                ],
                [
                  "Resultado",
                  auditResults[String(detail.result)] ?? String(detail.result),
                ],
                [
                  "Entidade",
                  auditEntities[String(detail.entity)] ?? String(detail.entity),
                ],
                ["Identificador da entidade", String(detail.entityId ?? "—")],
                ["Identificador do evento", String(detail.id ?? "—")],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}
    </>
  );
}
function BackupPage({
  token,
  task,
  onRestore,
  onStatusChange,
  backupOnly = false,
}: {
  token: string | null;
  task: Task;
  onRestore: () => void;
  onStatusChange?: () => void;
  backupOnly?: boolean;
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
                setResult("");
                try {
                  const result = await api<{ path: string; sha256: string }>(
                    token,
                    {
                      op: "backup",
                      path: destination,
                    },
                  );
                  setResult(
                    `Backup criado: ${result.path}. SHA-256 para transferência: ${result.sha256}`,
                  );
                  await refresh();
                } catch (error) {
                  try {
                    await refresh();
                  } catch {
                    setStatus(null);
                  }
                  throw error;
                } finally {
                  onStatusChange?.();
                }
              }
            })
          }
        >
          Criar backup manual
        </button>
        {result && <p role="status">{result}</p>}
      </section>
      {!backupOnly && (
        <section className="form-section" data-tour="restore">
          <h2>Restaurar uma cópia</h2>
          <p>
            A cópia será validada antes de substituir os cadastros. O estado
            atual será preservado em um backup de segurança.
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
                  try {
                    await api(token, {
                      op: "restore",
                      path,
                      password,
                      confirmed: true,
                    });
                    setPassword("");
                    onRestore();
                  } catch (error) {
                    try {
                      await refresh();
                    } catch {
                      setStatus(null);
                    }
                    throw error;
                  } finally {
                    onStatusChange?.();
                  }
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
      )}
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
