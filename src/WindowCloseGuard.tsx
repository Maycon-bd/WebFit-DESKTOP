import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { errorMessage } from "./api";
import {
  closePreferenceKey,
  createCloseFlow,
  skipsCloseConfirmation,
} from "./window-close";

export function WindowCloseGuard({
  busy,
  beforeClose,
}: {
  busy: boolean;
  beforeClose: () => Promise<void>;
}) {
  const latest = useRef({ busy, beforeClose });
  useLayoutEffect(() => {
    latest.current = { busy, beforeClose };
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const [pending, setPending] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const flow = useRef<ReturnType<typeof createCloseFlow> | null>(null);
  useEffect(() => {
    let disposed = false;
    const window = getCurrentWindow();
    const controller = createCloseFlow({
      busy: () => latest.current.busy,
      skip: () => {
        try {
          return skipsCloseConfirmation(globalThis.localStorage);
        } catch {
          return false;
        }
      },
      save: () => latest.current.beforeClose(),
      remember: () =>
        globalThis.localStorage.setItem(closePreferenceKey, "true"),
      destroy: () => window.destroy(),
      prompt: () => {
        if (!disposed) {
          setWaiting(false);
          setOpen(true);
        }
      },
      wait: () => {
        if (!disposed) setWaiting(true);
      },
      pending: (value) => {
        if (!disposed) {
          setWaiting(false);
          setPending(value);
        }
      },
      error: (cause) => {
        if (!disposed)
          setError(
            `Não foi possível fechar: ${errorMessage(cause)} Tente novamente.`,
          );
      },
    });
    flow.current = controller;
    const listener = window.onCloseRequested((event) => {
      event.preventDefault();
      if (!disposed) controller.request();
    });
    void listener.catch((cause) => {
      if (!disposed)
        setError(
          `Não foi possível preparar a confirmação de fechamento: ${errorMessage(cause)}`,
        );
    });
    return () => {
      disposed = true;
      flow.current = null;
      void listener.then(
        (unlisten) => unlisten(),
        () => {},
      );
    };
  }, []);
  useEffect(() => {
    if (!busy) flow.current?.resume();
  }, [busy]);
  useLayoutEffect(() => {
    const element = dialog.current;
    if ((open || pending) && element && !element.open) element.showModal();
    if (!open && !pending && element?.open) element.close();
  }, [open, pending]);
  function cancel() {
    if (!flow.current?.cancel()) return;
    setOpen(false);
    setRemember(false);
    setError("");
  }
  return (
    <>
      {waiting && (
        <p role="status" className="message">
          O aplicativo fechará após a operação atual terminar.
        </p>
      )}
      {!open && error && (
        <p role="alert" className="message error">
          {error}
        </p>
      )}
      <dialog
        ref={dialog}
        className="close-confirmation-dialog"
        aria-labelledby="close-title"
        aria-describedby="close-description"
        onCancel={(event) => {
          event.preventDefault();
          cancel();
        }}
      >
        <h2 id="close-title">
          {open || !pending
            ? "Fechar o WebFit Desktop?"
            : "Fechando o WebFit Desktop…"}
        </h2>
        <p id="close-description">
          {open || !pending
            ? "Deseja realmente fechar o aplicativo? Seus rascunhos serão salvos antes de sair."
            : "Salvando seus rascunhos antes de fechar."}
        </p>
        {(open || !pending) && (
          <>
            <label className="close-preference">
              <input
                type="checkbox"
                checked={remember}
                disabled={pending}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Não perguntar novamente
            </label>
            {(busy || pending) && (
              <p role="status">
                {pending
                  ? "Salvando e fechando…"
                  : "Aguarde a operação atual terminar para fechar."}
              </p>
            )}
            {error && (
              <p role="alert" className="message error">
                {error}
              </p>
            )}
            <div className="close-confirmation-actions">
              <button
                type="button"
                autoFocus
                disabled={pending}
                onClick={cancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="primary"
                disabled={busy || pending}
                onClick={() => {
                  setError("");
                  void flow.current?.confirm(remember);
                }}
              >
                Fechar
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
