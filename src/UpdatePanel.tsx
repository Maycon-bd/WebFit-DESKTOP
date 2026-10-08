import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import {
  createSessionUpdateCheck,
  startSessionUpdateChecks,
} from "./update-check";

type Available = { version: string; notes: string };
const checkForSession = createSessionUpdateCheck((token: string) =>
  invoke<Available | null>("check_update", { token }),
);

export function UpdatePanel({
  token,
  blocked,
  run,
}: {
  token: string;
  blocked: boolean;
  run: (action: () => Promise<void>) => Promise<unknown>;
}) {
  const [available, setAvailable] = useState<Available | null>(null);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);
  const [installing, setInstalling] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const installationActive = useRef(false);

  useEffect(() => {
    return startSessionUpdateChecks({
      token,
      check: checkForSession,
      onResult: setAvailable,
      isPaused: () => installationActive.current,
      environment: {
        every: (callback, interval) => {
          const timer = window.setInterval(callback, interval);
          return () => window.clearInterval(timer);
        },
        onResume: (callback) => {
          const resume = () => {
            if (document.visibilityState === "visible") callback();
          };
          window.addEventListener("focus", resume);
          document.addEventListener("visibilitychange", resume);
          return () => {
            window.removeEventListener("focus", resume);
            document.removeEventListener("visibilitychange", resume);
          };
        },
      },
    });
  }, [token]);

  useEffect(() => {
    const listeners = [
      listen<{ downloaded: number; total: number | null }>(
        "update-progress",
        ({ payload }) => {
          setProgress(
            payload.total
              ? Math.min(
                  100,
                  Math.round((100 * payload.downloaded) / payload.total),
                )
              : null,
          );
          setMessage("Baixando e verificando a atualização…");
        },
      ),
      listen("update-installing", () =>
        setMessage(
          "Instalando. O WebFit será fechado; aguarde a conclusão e o reinício.",
        ),
      ),
    ];
    return () => {
      listeners.forEach(
        (listener) => void listener.then((unlisten) => unlisten()),
      );
    };
  }, []);

  async function install() {
    if (!available || blocked || installationActive.current) return;
    installationActive.current = true;
    setInstalling(true);
    setMessage("Preparando backup de segurança…");
    await run(async () => {
      try {
        await invoke("install_update", { token, version: available.version });
      } catch {
        setMessage(
          "Não foi possível concluir a atualização. Tente novamente mais tarde. Se o instalador chegou a abrir, confira a versão após reiniciar o WebFit.",
        );
      } finally {
        installationActive.current = false;
        setInstalling(false);
        setProgress(null);
      }
    });
  }

  if (!available || available.version === dismissedVersion) return null;
  return (
    <section
      className="update-banner"
      aria-label="Atualização do WebFit"
      aria-live="polite"
    >
      <div className="update-banner-row">
        <p className="update-banner-copy">
          <strong>Nova atualização disponível.</strong> Salve o que estiver
          fazendo antes de atualizar. O aplicativo será reiniciado.
        </p>
        <div className="update-banner-actions">
          <details className="update-details">
            <summary>Detalhes da atualização</summary>
            <div className="update-details-content">
              <p>
                Versão {available.version}. Ao atualizar, o WebFit cria um
                backup e verifica o pacote.
              </p>
              {available.notes && (
                <p className="update-notes">{available.notes}</p>
              )}
            </div>
          </details>
          <button
            type="button"
            disabled={installing}
            onClick={() => setDismissedVersion(available.version)}
          >
            Mais tarde
          </button>
          <button
            type="button"
            className="primary"
            disabled={blocked || installing}
            aria-describedby={
              blocked && !installing ? "update-blocked-reason" : undefined
            }
            onClick={() => void install()}
          >
            {installing ? "Atualizando…" : "Atualizar"}
          </button>
        </div>
      </div>
      {blocked && !installing && (
        <p id="update-blocked-reason" className="update-banner-status">
          Conclua e salve a edição ou operação em andamento e volte à lista de
          pacientes para atualizar.
        </p>
      )}
      {message && (
        <p className="update-banner-status" role="status">
          {message}
        </p>
      )}
      {installing && (
        <progress
          max={100}
          value={progress ?? undefined}
          aria-label="Progresso da atualização"
        />
      )}
    </section>
  );
}
