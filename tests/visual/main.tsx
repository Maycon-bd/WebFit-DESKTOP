import { mockIPC, mockWindows } from "@tauri-apps/api/mocks";
import { createMockService } from "./mock-service";

const service = createMockService(
  new URLSearchParams(location.search).get("scenario") ?? "ready",
);
mockWindows("main");
mockIPC(
  (command, args) => service.invoke(command, args as Record<string, unknown>),
  { shouldMockEvents: true },
);
Object.assign(window, { webfitMock: service });
// Import only after Tauri's test metadata and IPC are installed.
const [
  { default: React },
  { createRoot },
  { default: App },
  { WindowTitleBar },
] = await Promise.all([
  import("react"),
  import("react-dom/client"),
  import("../../src/App"),
  import("../../src/WindowTitleBar"),
]);
// @ts-expect-error CSS is loaded by Vite.
await import("../../src/style.css");
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 10000,
        background: "#fff3c4",
        padding: "4px 12px",
        fontSize: 12,
        pointerEvents: "none",
      }}
    >
      Ambiente mock — backend simulado · WEBFIT-15
    </div>
    <div className="window-shell">
      <WindowTitleBar />
      <div className="window-content">
        <App />
      </div>
    </div>
  </React.StrictMode>,
);
