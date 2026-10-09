import { useEffect, useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

type Controls = Pick<
  ReturnType<typeof getCurrentWindow>,
  "minimize" | "toggleMaximize" | "close" | "isMaximized" | "onResized"
>;

export function WindowTitleBar({ controls }: { controls?: Controls }) {
  const window = useMemo(() => controls ?? getCurrentWindow(), [controls]);
  const [maximized, setMaximized] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    const update = () => {
      void window.isMaximized().then(
        (value) => {
          if (current) setMaximized(value);
        },
        () => {},
      );
    };
    update();
    const listener = window.onResized(update);
    void listener.catch(() => {
      if (current) setError("Não foi possível acompanhar o tamanho da janela.");
    });
    return () => {
      current = false;
      void listener.then(
        (unlisten) => unlisten(),
        () => {},
      );
    };
  }, [window]);
  async function act(action: () => Promise<void>) {
    setError("");
    try {
      await action();
    } catch {
      setError("Não foi possível alterar a janela. Tente novamente.");
    }
  }
  return (
    <header className="window-titlebar" aria-label="Janela do WebFit Desktop">
      <div className="window-drag-region" data-tauri-drag-region>
        <img
          src="/brand/webfit-icon.png"
          alt=""
          width="20"
          height="20"
          draggable={false}
        />
        <span>WebFit Desktop — ambiente de teste</span>
      </div>
      {error && (
        <span className="window-control-error" role="alert">
          {error}
        </span>
      )}
      <div className="window-controls">
        <button
          type="button"
          aria-label="Minimizar janela"
          title="Minimizar"
          onClick={() => void act(() => window.minimize())}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={maximized ? "Restaurar janela" : "Maximizar janela"}
          title={maximized ? "Restaurar" : "Maximizar"}
          onClick={() => void act(() => window.toggleMaximize())}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            {maximized ? (
              <path d="M5 5V3h8v8h-2 M3 5h8v8H3z" />
            ) : (
              <path d="M3 3h10v10H3z" />
            )}
          </svg>
        </button>
        <button
          type="button"
          className="window-close"
          aria-label="Fechar janela"
          title="Fechar"
          onClick={() => void act(() => window.close())}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m3 3 10 10 M13 3 3 13" />
          </svg>
        </button>
      </div>
    </header>
  );
}
