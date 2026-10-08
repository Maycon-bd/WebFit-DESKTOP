import { useLayoutEffect, useRef } from "react";

export function DraftRecoveryDialog({
  open,
  formLabel,
  savedAt,
  savedAtIso,
  busy,
  onRestore,
  onDiscard,
  onBack,
  backLabel,
}: {
  open: boolean;
  formLabel: string;
  savedAt: string;
  savedAtIso: string;
  busy: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  onBack: () => void;
  backLabel: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const leaving = useRef(false);
  function back() {
    if (busy) return;
    leaving.current = true;
    onBack();
  }

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="draft-recovery-dialog"
      aria-labelledby="draft-recovery-title"
      aria-describedby="draft-recovery-description"
      onCancel={(event) => {
        event.preventDefault();
        back();
      }}
      onClose={() => {
        const firstField = document.querySelector<HTMLElement>(
          leaving.current
            ? ".workspace-main h1"
            : "form[data-draft-form] input:not(:disabled), form[data-draft-form] textarea:not(:disabled), form[data-draft-form] button:not(:disabled)",
        );
        leaving.current = false;
        firstField?.focus();
      }}
    >
      <h2 id="draft-recovery-title">Rascunho anterior salvo</h2>
      <p id="draft-recovery-description">
        O sistema salvou um rascunho de {formLabel} em{" "}
        <time dateTime={savedAtIso}>{savedAt}</time>. Deseja restaurá-lo? Você
        também pode voltar sem restaurar nem descartar o rascunho.
      </p>
      <div className="draft-recovery-actions">
        <button
          type="button"
          className="primary"
          autoFocus
          disabled={busy}
          onClick={onRestore}
        >
          Sim, restaurar
        </button>
        <button type="button" disabled={busy} onClick={onDiscard}>
          Não, descartar
        </button>
        <button type="button" disabled={busy} onClick={back}>
          {backLabel}
        </button>
      </div>
    </dialog>
  );
}
