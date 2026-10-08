import { useEffect, useRef, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { isTauri } from "@tauri-apps/api/core";
import { version as previewVersion } from "../package.json";

export function LoginInfo({
  onAdmin,
  busy,
}: {
  onAdmin: () => void;
  busy: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (!isTauri()) return;
    void getVersion().then(
      (value) => {
        if (active) setVersion(value);
      },
      () => {
        if (active) setVersion("Não foi possível consultar");
      },
    );
    return () => {
      active = false;
    };
  }, []);
  return (
    <>
      <footer className="access-footer">
        <button
          type="button"
          className="login-info-button"
          aria-label="Sobre o WebFit Desktop"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
          title="Sobre o WebFit Desktop"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6M12 7v1" />
          </svg>
        </button>
      </footer>
      <dialog
        ref={dialog}
        className="login-info-dialog"
        aria-labelledby="login-info-title"
      >
        <img
          className="system-logo"
          src="/brand/webfit-icon.png"
          alt=""
          width="64"
          height="64"
        />
        <h2 id="login-info-title">WebFit Desktop</h2>
        <p>Versão {isTauri() ? (version ?? "Consultando…") : previewVersion}</p>
        <p>Desenvolvido por Eng. Maycon Garcia Silva</p>
        <hr />
        <h3>Acesso do administrador</h3>
        <p>
          Entre com o nome de acesso e a senha definidos na preparação deste
          computador. Em instalações novas, o nome do administrador é{" "}
          <strong>admin</strong>.
        </p>
        <p className="hint">
          Se este computador ainda não foi preparado, o administrador deve
          definir os acessos e a recuperação dos backups antes do uso.
        </p>
        <div className="login-info-actions">
          <form method="dialog">
            <button autoFocus>Fechar</button>
          </form>
          <button
            type="button"
            className="primary"
            disabled={busy}
            onClick={() => {
              dialog.current?.close();
              onAdmin();
            }}
          >
            Acesso do administrador
          </button>
        </div>
      </dialog>
    </>
  );
}
