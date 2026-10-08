import { useLayoutEffect, useRef } from "react";

export function DraftRecoveryDialog({
  open,
  formLabel,
  savedAt,
  savedAtIso,
  busy,
  onRestore,
  onDiscard,
}: {
  open: boolean;
  formLabel: string;
  savedAt: string;
  savedAtIso: string;
  busy: boolean;
  onRestore: () => void;
  onDiscard: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

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
      onCancel={(event) => event.preventDefault()}
      onClose={() => {
        const firstField = document.querySelector<HTMLElement>(
          "form[data-draft-form] input:not(:disabled), form[data-draft-form] textarea:not(:disabled), form[data-draft-form] button:not(:disabled)",
        );
        firstField?.focus();
      }}
    >
      <h2 id="draft-recovery-title">Rascunho anterior salvo</h2>
      <p id="draft-recovery-description">
        O sistema salvou um rascunho de {formLabel} em{" "}
        <time dateTime={savedAtIso}>{savedAt}</time>. Deseja restaurá-lo?
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
      </div>
    </dialog>
  );
}
