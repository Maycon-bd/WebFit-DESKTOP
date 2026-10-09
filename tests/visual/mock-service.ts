import { emptyPatient, emptyProfile } from "../../src/api";
import type { Patient, Prescription, PrescriptionPayload } from "../../src/api";
import releaseNotes from "../../src/data/release-notes.json";

// Public fictional credentials; accepted only by this in-memory test service.
export const mockCredentials = { name: "visual", password: "mock-webfit" };
export function createMockService(scenario = "ready") {
  let patients: Patient[] =
    scenario === "empty"
      ? []
      : [
          {
            ...structuredClone(emptyPatient),
            id: "mock-1",
            internalNumber: 1,
            name: "Paciente Fictício Alfa",
            birth: "1990-05-12",
          },
          {
            ...structuredClone(emptyPatient),
            id: "mock-2",
            internalNumber: 2,
            name: "Paciente Fictício Beta",
            birth: "1985-08-20",
          },
          {
            ...structuredClone(emptyPatient),
            id: "mock-3",
            internalNumber: 3,
            name: "Paciente Fictício Arquivado",
            birth: "1980-03-10",
            archived: true,
          },
        ];
  let loggedIn = false;
  let notesVersion = "0.1.12";
  const seenNotes = new Set<string>(
    scenario.startsWith("news-") ? [] : [notesVersion],
  );
  let prescriptions: (Prescription & { patientId: string })[] = [];
  let failure: string | null = scenario === "error" ? "patients" : null;
  const calls: string[] = [];
  const unsupported: string[] = [];
  const user = {
    id: "mock-user",
    name: "maycon.teste",
    role: "professional",
    must_change: false,
  };
  return {
    calls,
    unsupported,
    setNotesVersion(version: string) {
      notesVersion = version;
    },
    expireSession() {
      loggedIn = false;
    },
    failNext(op: string) {
      failure = op;
    },
    async invoke(
      command: string,
      args?: Record<string, unknown>,
    ): Promise<unknown> {
      if (command === "plugin:app|version") return "0.1.10-mock";
      if (command === "plugin:window|is_maximized") return true;
      if (
        [
          "plugin:window|minimize",
          "plugin:window|toggle_maximize",
          "plugin:window|close",
          "plugin:window|destroy",
        ].includes(command)
      )
        return null;
      if (command === "check_update") return null;
      if (command !== "operate") {
        unsupported.push(command);
        throw new Error(`IPC não simulado: ${command}`);
      }
      const request = args?.request as {
        token: string | null;
        command: Record<string, unknown>;
      };
      const data = request.command;
      const op = String(data.op);
      calls.push(op); // Operation names only, never payloads or credentials.
      if (failure === op) {
        failure = null;
        if (scenario === "unauthorized") {
          loggedIn = false;
          throw { code: "UNAUTHORIZED", message: "Sessão fictícia encerrada." };
        }
        throw new Error("Falha fictícia para testar recuperação.");
      }
      if (scenario === "slow")
        await new Promise((resolve) => setTimeout(resolve, 600));
      if (op === "status")
        return {
          initialized: true,
          installationId: "MOCK-WEBFIT-14",
          licenseId: "MOCK",
          licensed: true,
          legacy: false,
          trustConfigured: true,
          pending: [],
        };
      if (op === "remembered_login") return { name: null };
      if (op === "login") {
        if (
          data.name !== mockCredentials.name ||
          data.password !== mockCredentials.password
        )
          throw new Error("Acesso fictício inválido.");
        loggedIn = true;
        return { token: "mock-session", user };
      }
      if (!loggedIn || request.token !== "mock-session")
        throw { code: "UNAUTHORIZED", message: "Sessão fictícia necessária." };
      switch (op) {
        case "dashboard": {
          const months = Number(data.months);
          const now = new Date();
          return {
            patients: {
              active: patients.filter((p) => !p.archived).length,
              archived: patients.filter((p) => p.archived).length,
            },
            prescriptions: {
              draft: scenario === "empty" ? 0 : 3,
              finalized: scenario === "empty" ? 0 : 5,
              superseded: scenario === "empty" ? 0 : 2,
              cancelled: scenario === "empty" ? 0 : 1,
            },
            registrations: Array.from({ length: months }, (_, index) => {
              const date = new Date(
                Date.UTC(
                  now.getUTCFullYear(),
                  now.getUTCMonth() - months + 1 + index,
                  1,
                ),
              );
              return {
                month: date.toISOString().slice(0, 7),
                count:
                  scenario === "empty"
                    ? 0
                    : index === months - 1
                      ? patients.length
                      : (index % 3) + 1,
              };
            }),
            generatedAt: now.toISOString(),
          };
        }
        case "remember_login":
        case "complete_tour":
        case "reset_tours":
        case "save_draft":
        case "discard_draft":
          return null;
        case "logout":
          loggedIn = false;
          return null;
        case "touch":
          return user;
        case "drafts":
        case "tags":
          return [];
        case "prescriptions":
          return structuredClone(
            prescriptions.filter((p) => p.patientId === data.patient_id),
          );
        case "save_prescription": {
          const id = String(
            data.id ?? `mock-prescription-${prescriptions.length + 1}`,
          );
          prescriptions = prescriptions
            .filter((p) => p.id !== id)
            .concat({
              id,
              patientId: String(data.patient_id),
              payload: structuredClone(data.payload as PrescriptionPayload),
              status: "DRAFT",
              version: 1,
              at: "2026-10-09T12:00:00Z",
            });
          return { id };
        }
        case "tour_state":
          return [
            "patients",
            "patient-new",
            "patient",
            "profile",
            "prescription",
            "audit",
            "backup",
            "access",
          ];
        case "release_notes":
          if (scenario === "news-slow")
            await new Promise((resolve) => setTimeout(resolve, 900));
          return {
            version: notesVersion,
            seen: seenNotes.has(notesVersion),
            notes: structuredClone(releaseNotes),
          };
        case "mark_release_notes_seen":
          seenNotes.add(notesVersion);
          return { saved: true };
        case "backup_status":
          return {
            lastBackup: "2026-10-09T12:00:00Z",
            stale: false,
            failed: false,
            folder: "MOCK — sem arquivos",
          };
        case "profile":
          return {
            ...emptyProfile,
            fullName: user.name,
            professionalName: user.name,
          };
        case "patients":
          return patients.filter(
            (p) =>
              Boolean(p.archived) === Boolean(data.archived) &&
              `${p.name} ${p.internalNumber}`
                .toLowerCase()
                .includes(String(data.query ?? "").toLowerCase()),
          );
        case "patient": {
          const patient = patients.find((p) => p.id === data.id);
          if (!patient) throw new Error("Paciente fictício não encontrado.");
          return structuredClone(patient);
        }
        case "save_patient": {
          const patient = data.patient as Patient;
          if (!patient.name.trim()) throw new Error("Nome necessário.");
          const prior = patients.find((p) => p.id === data.id);
          const next = {
            ...structuredClone(patient),
            id: prior?.id ?? `mock-${patients.length + 1}`,
            internalNumber: prior?.internalNumber ?? patients.length + 1,
          };
          patients = patients.filter((p) => p.id !== next.id).concat(next);
          return { id: next.id, internalNumber: next.internalNumber };
        }
        default:
          unsupported.push(op);
          throw new Error(`Operação não simulada: ${op}`);
      }
    },
  };
}
