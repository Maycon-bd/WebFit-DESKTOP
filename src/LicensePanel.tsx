import { useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { api } from "./api";
import type { User } from "./api";
export interface LicenseStatus {
  initialized: boolean;
  installationId: string;
  licenseId: string | null;
  licensed: boolean;
  legacy: boolean;
  trustConfigured: boolean;
  pending: { id: string; kind: string }[];
}
const kinds = {
  INITIAL: "Ativação inicial",
  TRANSFER_RECOVERY: "Transferência / recuperação",
  TEMPORARY_SUPPORT: "Suporte temporário",
  ADMIN_RECOVERY: "Recuperação administrativa",
  RESET_CLINIC: "Reinicialização do consultório",
};
type Task = <T>(run: () => Promise<T>) => Promise<T | undefined>;
export function LicensePanel({
  status,
  busy,
  task,
  onRefresh,
  onSession,
  token,
  onEnded,
}: {
  status: LicenseStatus;
  busy: boolean;
  task: Task;
  onRefresh: () => Promise<void>;
  onSession: (r: { token: string; user: User }) => Promise<void>;
  token: string | null;
  onEnded: () => void;
}) {
  const [kind, setKind] = useState<keyof typeof kinds>(
    status.licensed ? "TEMPORARY_SUPPORT" : "INITIAL",
  );
  const [source, setSource] = useState("");
  const [password, setPassword] = useState("");
  const [path, setPath] = useState("");
  const [notice, setNotice] = useState("");
  const [activationPath, setActivationPath] = useState("");
  const [activationCode, setActivationCode] = useState("");
  return (
    <section className="license-panel" aria-label="Licença e suporte">
      <h2>{status.licensed ? "Licença e suporte" : "Aguardando ativação"}</h2>
      <p>
        {status.licensed
          ? "Autorizações são emitidas pelo administrador e vinculadas a este computador."
          : status.legacy
            ? "Este banco de testes foi preservado. Crie um backup e prepare uma instalação vazia para ativação inicial."
            : "Selecione a licença recebida e informe o código de ativação para preparar seus acessos."}
      </p>
      <p className="hint license-id">Instalação: {status.installationId}</p>
      {!status.trustConfigured && (
        <p role="status">
          Este aplicativo ainda precisa da chave pública do emissor na
          configuração do instalador. Solicite ao administrador uma versão
          configurada.
        </p>
      )}
      {!status.legacy && (
        <>
          {!status.initialized && !status.licensed && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void task(async () => {
                  const result = await api<{ consumed?: boolean }>(null, {
                    op: "activate_license_code",
                    path: activationPath,
                    code: activationCode,
                  });
                  setActivationCode("");
                  await onRefresh();
                  setNotice(
                    result.consumed
                      ? "Esta autorização já foi utilizada. Nenhum efeito foi repetido."
                      : "Licença validada. Preencha seu acesso e a senha de recuperação dos backups abaixo.",
                  );
                });
              }}
            >
              <h3>Ativar com licença e código</h3>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void task(async () => {
                    const file = await open({
                      multiple: false,
                      filters: [
                        {
                          name: "Licença WebFit",
                          extensions: ["webfit-license"],
                        },
                      ],
                    });
                    if (typeof file === "string") {
                      setActivationPath(file);
                      setActivationCode("");
                    }
                  })
                }
              >
                Selecionar licença
              </button>
              <p className="license-id">
                {activationPath || "Nenhuma licença selecionada"}
              </p>
              <label className="field">
                Código de ativação
                <input
                  type="password"
                  value={activationCode}
                  required
                  maxLength={128}
                  autoComplete="off"
                  disabled={busy}
                  onChange={(e) => setActivationCode(e.target.value)}
                />
              </label>
              <button
                disabled={
                  busy ||
                  !activationPath ||
                  !activationCode.trim() ||
                  !status.trustConfigured
                }
              >
                Validar licença e código
              </button>
            </form>
          )}
          <details open={status.licensed}>
            <summary>
              {status.licensed
                ? "Outras autorizações"
                : "Ativação por solicitação ou transferência"}
            </summary>
            <label className="field">
              Tipo de autorização
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as keyof typeof kinds)}
                disabled={busy}
              >
                {Object.entries(kinds)
                  .filter(([key]) =>
                    status.licensed
                      ? !["INITIAL", "TRANSFER_RECOVERY"].includes(key)
                      : ["INITIAL", "TRANSFER_RECOVERY"].includes(key),
                  )
                  .map(([key, title]) => (
                    <option key={key} value={key}>
                      {title}
                    </option>
                  ))}
              </select>
            </label>
            {kind === "TRANSFER_RECOVERY" && (
              <label className="field">
                Licença da origem ou checksum SHA-256 do backup
                <input
                  value={source}
                  maxLength={100}
                  onChange={(e) => setSource(e.target.value)}
                />
              </label>
            )}
            <div className="actions">
              <button
                disabled={busy}
                onClick={() =>
                  void task(async () => {
                    const destination = await save({
                      defaultPath: "instalacao.webfit-request",
                      filters: [
                        {
                          name: "Solicitação WebFit",
                          extensions: ["webfit-request"],
                        },
                      ],
                    });
                    if (!destination) return;
                    const r = await api<{
                      content: string;
                      fingerprint: string;
                    }>(null, {
                      op: "license_request",
                      kind,
                      source: kind === "TRANSFER_RECOVERY" ? source : null,
                    });
                    await api(null, {
                      op: "save_license_request",
                      content: r.content,
                      path: destination,
                    });
                    setNotice(
                      `Solicitação salva. Envie ao administrador e confira a identidade: ${r.fingerprint}`,
                    );
                  })
                }
              >
                Gerar e salvar solicitação
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  void task(async () => {
                    const path = await open({
                      multiple: false,
                      filters: [
                        {
                          name: "Licença WebFit",
                          extensions: ["webfit-license"],
                        },
                      ],
                    });
                    if (typeof path !== "string") return;
                    const result = await api<{ consumed?: boolean }>(null, {
                      op: "read_license_file",
                      path,
                    });
                    await onRefresh();
                    setNotice(
                      result.consumed
                        ? "Esta autorização já foi utilizada. Nenhum efeito foi repetido."
                        : "Autorização importada. Confirme a operação correspondente abaixo.",
                    );
                  })
                }
              >
                Importar autorização
              </button>
            </div>
          </details>
        </>
      )}
      {notice && (
        <p role="status" className="license-id">
          {notice}
        </p>
      )}
      {status.pending.map((grant) => (
        <section key={grant.id}>
          <h3>{kinds[grant.kind as keyof typeof kinds]}</h3>
          {grant.kind === "INITIAL" ? (
            <p>
              Licença inicial recebida. Preencha o acesso da nutricionista para
              concluir.
            </p>
          ) : grant.kind === "TEMPORARY_SUPPORT" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void task(async () => {
                  const r = await api<{ token: string; user: User }>(null, {
                    op: "support_login",
                    id: grant.id,
                    password,
                  });
                  setPassword("");
                  await onSession(r);
                });
              }}
            >
              <label className="field">
                Senha temporária fornecida pelo administrador
                <input
                  type="password"
                  value={password}
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button disabled={busy}>Iniciar sessão de suporte</button>
              <p className="hint">
                Uma sessão de até 4 horas. Encerrar, bloquear ou reiniciar
                também termina o acesso.
              </p>
            </form>
          ) : grant.kind === "ADMIN_RECOVERY" ? (
            <button
              disabled={busy}
              onClick={() =>
                void task(async () => {
                  if (
                    !window.confirm(
                      "Trocar a credencial administrativa pela autorização recebida? Os dados serão preservados.",
                    )
                  )
                    return;
                  await api(null, {
                    op: "recover_administrator",
                    id: grant.id,
                    confirmed: true,
                  });
                  onEnded();
                  await onRefresh();
                  setNotice(
                    "Credencial administrativa recuperada. Use o novo acesso fornecido pelo administrador.",
                  );
                })
              }
            >
              Confirmar recuperação administrativa
            </button>
          ) : grant.kind === "RESET_CLINIC" ? (
            <button
              className="danger"
              disabled={busy || !token}
              onClick={() =>
                void task(async () => {
                  if (
                    !window.confirm(
                      "Um backup será criado antes da limpeza. Apagar pacientes, prescrições, tags e rascunhos clínicos, mantendo licença, acessos e perfil?",
                    )
                  )
                    return;
                  await api(token, {
                    op: "reset_clinic",
                    id: grant.id,
                    confirmed: true,
                  });
                  onEnded();
                  await onRefresh();
                })
              }
            >
              Criar backup e reinicializar consultório
            </button>
          ) : grant.kind === "TRANSFER_RECOVERY" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                void task(async () => {
                  if (
                    !window.confirm(
                      "Recuperar este backup no destino vazio com os novos acessos?",
                    )
                  )
                    return;
                  await api(null, {
                    op: "transfer_recovery",
                    id: grant.id,
                    path,
                    ...data,
                    confirmed: true,
                  });
                  setPassword("");
                  setPath("");
                  await onRefresh();
                  setNotice(
                    "Transferência concluída. Entre com os novos acessos.",
                  );
                });
              }}
            >
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void task(async () => {
                    const file = await open({
                      multiple: false,
                      filters: [
                        {
                          name: "Backup WebFit",
                          extensions: ["webfit-backup"],
                        },
                      ],
                    });
                    if (typeof file === "string") setPath(file);
                  })
                }
              >
                Escolher backup da origem
              </button>
              <p className="license-id">
                {path || "Nenhum backup selecionado"}
              </p>
              <label className="field">
                Senha de recuperação do backup
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="off"
                />
              </label>
              <label className="field">
                Novo nome de acesso da nutricionista
                <input name="professional_name" required />
              </label>
              <label className="field">
                Nova senha da nutricionista
                <input
                  name="professional_password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </label>
              <label className="field">
                Senha dos backups desta instalação
                <input
                  name="recovery_password"
                  type="password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                />
              </label>
              <button disabled={busy || !path}>
                Confirmar transferência / recuperação
              </button>
            </form>
          ) : null}
        </section>
      ))}
    </section>
  );
}
