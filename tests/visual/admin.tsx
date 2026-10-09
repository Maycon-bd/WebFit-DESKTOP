import { mockIPC, mockWindows } from "@tauri-apps/api/mocks";
import { emit } from "@tauri-apps/api/event";
import type { LicenseStatus } from "../../src/LicensePanel";
const scenario = new URLSearchParams(location.search).get("scenario");
const license: LicenseStatus = {
  initialized: true,
  licensed: true,
  legacy: false,
  trustConfigured: true,
  installationId: "fictional-installation",
  licenseId: "fictional-license",
  pending: [],
};
let active = false;
let enabled = false;
let failed = scenario === "retry";
let release: (() => void) | undefined;
let pauseRefresh = false;
let refreshWaiting = false;
const operations: string[] = [];
mockWindows("main");
mockIPC(
  async (name, args) => {
    if (name === "plugin:dialog|save")
      return "C:/fictional/initial.webfit-license";
    if (name !== "operate") throw new Error(`Unsupported mock: ${name}`);
    const request = (args as Record<string, unknown>).request as {
      token: string | null;
      command: Record<string, unknown>;
    };
    const command = request.command;
    const op = String(command.op);
    if (op === "master_status")
      return { configured: scenario !== "unconfigured" };
    if (op === "master_login") {
      if (command.password !== "fictional master phrase")
        throw { code: "VALIDATION", message: "Senha mestra inválida." };
      active = true;
      return { token: "fictional-master-token" };
    }
    if (
      op !== "master_operation" ||
      !active ||
      request.token !== "fictional-master-token"
    )
      throw { code: "UNAUTHORIZED", message: "Sessão encerrada." };
    const action = command.action as Record<string, unknown>;
    operations.push(String(action.op));
    switch (action.op) {
      case "status":
        if (failed) {
          failed = false;
          throw {
            code: "INTERNAL",
            message: "Falha fictícia ao carregar ferramentas.",
          };
        }
        return {
          issuer: {
            initialized: true,
            publicKey: "fictional-public-key",
            issued: 2,
          },
          issuerTrusted: true,
          databaseEnabled: enabled,
          databasePath: "C:/fictional/health.db",
          license,
        };
      case "enable_database":
        enabled = true;
        return { enabled };
      case "reveal_database_key":
        if (scenario === "pending")
          await new Promise<void>((resolve) => {
            release = resolve;
          });
        return { key: "a".repeat(64) };
      case "logout":
        active = false;
        return { ended: true };
      case "integrity":
        return { ok: true, schema: 3 };
      case "emit_local":
        license.pending = [
          { id: "fictional-support", kind: "TEMPORARY_SUPPORT" },
        ];
        return { imported: true, path: "C:/fictional/support.webfit-license" };
      case "emit_initial_code":
        pauseRefresh = scenario === "pending-code";
        return { code: "FICTIONAL-ACTIVATION-CODE" };
      default:
        throw new Error(`Unsupported admin operation: ${String(action.op)}`);
    }
  },
  { shouldMockEvents: true },
);
Object.assign(window, {
  adminMock: {
    operations,
    get refreshWaiting() {
      return refreshWaiting;
    },
    lock: async () => {
      active = false;
      await emit("session-locked");
      release?.();
    },
  },
});
const [{ default: React }, { createRoot }, { AdminPanel }] = await Promise.all([
  import("react"),
  import("react-dom/client"),
  import("../../src/AdminPanel"),
]);
// @ts-expect-error CSS is loaded by Vite.
await import("../../src/style.css");
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <p>WEBFIT-16 · interface de teste com backend simulado</p>
    <AdminPanel
      onClose={() => {}}
      onRefresh={async () => {
        if (pauseRefresh) {
          pauseRefresh = false;
          refreshWaiting = true;
          await new Promise<void>((resolve) => {
            release = resolve;
          });
          refreshWaiting = false;
        }
      }}
      onSession={async () => {}}
      onEnded={() => {}}
    />
  </React.StrictMode>,
);
