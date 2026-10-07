import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createLoginUpdateCheck } from "./update-check";

type Available = { version: string; notes: string };
const checkForLogin = createLoginUpdateCheck((token: string) =>
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
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void checkForLogin(token)
      .then((result) => {
        if (active) setAvailable(result);
      })
      .catch(() => {
        /* An offline check must not interrupt work. */
      });
    return () => {
      active = false;
    };
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
    if (!available || blocked || installing) return;
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
        setInstalling(false);
        setProgress(null);
      }
    });
  }

  if (!available || dismissed) return null;
  return (
    <section
      className="update-banner"
      aria-label="Atualização do WebFit"
      aria-live="polite"
    >
      <div className="update-banner-copy">
        <strong>
          Uma atualização do WebFit está disponível: {available.version}
        </strong>
        <p>
          Ao atualizar, o WebFit cria um backup e verifica o pacote. O
          aplicativo será fechado e reiniciado.
        </p>
        {available.notes && <p className="update-notes">{available.notes}</p>}
        {blocked && !installing && (
          <p>Termine a edição e volte à lista de pacientes para atualizar.</p>
        )}
        {message && <p role="status">{message}</p>}
        {installing && (
          <progress
            max={100}
            value={progress ?? undefined}
            aria-label="Progresso da atualização"
          />
        )}
      </div>
      <div className="update-banner-actions">
        <button
          type="button"
          className="primary"
          disabled={blocked || installing}
          onClick={() => void install()}
        >
          {installing ? "Atualizando…" : "Atualizar agora"}
        </button>
        <button
          type="button"
          disabled={installing}
          onClick={() => setDismissed(true)}
        >
          Mais tarde
        </button>
      </div>
    </section>
  );
}
