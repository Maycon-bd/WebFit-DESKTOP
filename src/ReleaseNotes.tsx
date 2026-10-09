import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { api } from "./api";

export interface ReleaseNotesState {
  version: string;
  seen: boolean;
  notes: { title: string; highlights: string[] };
}

export function ReleaseNotes({
  token,
  manualRequest,
  onPendingChange,
}: {
  token: string;
  manualRequest: number;
  onPendingChange: (pending: boolean) => void;
}) {
  const [state, setState] = useState<ReleaseNotesState | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const generation = useRef(0);
  const savingNow = useRef(false);
  const previousRequest = useRef(manualRequest);
  const returnFocus = useRef<HTMLElement | null>(null);

  const load = useCallback(
    async (manual = false) => {
      const request = ++generation.current;
      setLoading(true);
      setFailure("");
      if (manual) setOpen(true);
      try {
        const result = await api<ReleaseNotesState>(token, {
          op: "release_notes",
        });
        if (request !== generation.current) return;
        setState(result);
        setOpen(manual || !result.seen);
      } catch {
        if (request === generation.current)
          setFailure(
            "Não foi possível consultar as novidades. Você pode continuar trabalhando e tentar novamente depois.",
          );
      } finally {
        if (request === generation.current) setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    void load();
    return () => {
      generation.current++;
    };
  }, [load]);
  useEffect(() => {
    onPendingChange(loading || open);
  }, [loading, open, onPendingChange]);
  useEffect(() => {
    if (manualRequest === previousRequest.current) return;
    previousRequest.current = manualRequest;
    if (state) {
      setFailure("");
      setOpen(true);
    } else void load(true);
  }, [manualRequest, state, load]);

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      returnFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      element.showModal();
      title.current?.focus();
    } else if (!open && element.open) {
      element.close();
      const target = returnFocus.current;
      if (target?.isConnected && !target.closest("[hidden], [inert]"))
        target.focus();
      else document.querySelector<HTMLElement>(".workspace-main h1")?.focus();
    }
  }, [open]);

  function closeForNow() {
    if (savingNow.current) return;
    generation.current++;
    setLoading(false);
    setOpen(false);
  }
  async function acknowledge() {
    if (savingNow.current || loading) return;
    if (!state || state.seen) {
      closeForNow();
      return;
    }
    savingNow.current = true;
    setSaving(true);
    setFailure("");
    const request = generation.current;
    try {
      await api(token, { op: "mark_release_notes_seen" });
      if (request !== generation.current) return;
      setState({ ...state, seen: true });
      setOpen(false);
    } catch {
      if (request === generation.current)
        setFailure(
          "Não foi possível guardar a leitura. Tente novamente ou feche por agora; as novidades poderão aparecer no próximo acesso.",
        );
    } finally {
      if (request === generation.current) {
        savingNow.current = false;
        setSaving(false);
      }
    }
  }

  return (
    <>
      {!open && failure && (
        <p className="release-notes-notice" role="status">
          {failure}{" "}
          <button type="button" onClick={() => void load(true)}>
            Ver novidades
          </button>
        </p>
      )}
      {createPortal(
        <dialog
          ref={dialog}
          className="release-notes-dialog"
          aria-labelledby="release-notes-title"
          aria-describedby="release-notes-intro"
          aria-busy={loading || saving}
          onCancel={(event) => {
            event.preventDefault();
            if (!savingNow.current) {
              if (loading || failure) closeForNow();
              else void acknowledge();
            }
          }}
        >
          <h2 id="release-notes-title" ref={title} tabIndex={-1}>
            {state?.notes.title ?? "Novidades do WebFit"}
          </h2>
          <p id="release-notes-intro">
            Veja o que mudou para facilitar seu dia a dia no consultório.
          </p>
          {loading ? (
            <p role="status">Carregando novidades…</p>
          ) : (
            state && (
              <ul className="release-notes-list">
                {state.notes.highlights.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )
          )}
          {failure && <p role="alert">{failure}</p>}
          <div className="release-notes-actions">
            {failure && !state && (
              <button
                type="button"
                disabled={loading}
                onClick={() => void load(true)}
              >
                Tentar novamente
              </button>
            )}
            {(failure || loading) && (
              <button type="button" disabled={saving} onClick={closeForNow}>
                Fechar por agora
              </button>
            )}
            {state && !loading && (
              <button
                type="button"
                className="primary"
                disabled={saving}
                onClick={() => void acknowledge()}
              >
                {saving
                  ? "Guardando leitura…"
                  : state.seen
                    ? "Fechar"
                    : "Entendi"}
              </button>
            )}
          </div>
        </dialog>,
        document.body,
      )}
    </>
  );
}
