import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { open, save } from "@tauri-apps/plugin-dialog";
import { api, errorMessage } from "./api";
import type { User } from "./api";
import { FormField as Field } from "./FormField";
import { LicensePanel } from "./LicensePanel";
import type { LicenseStatus } from "./LicensePanel";
import { adminTabs, createAdminSessionGuard } from "./admin-session";
import type { AdminTab } from "./admin-session";

interface Status {
  issuer: { initialized: boolean; publicKey: string | null; issued: number };
  issuerTrusted: boolean;
  databaseEnabled: boolean;
  databasePath: string;
  license: LicenseStatus;
}
const licenseKinds = {
  INITIAL: "Ativação inicial",
  TRANSFER_RECOVERY: "Transferência / recuperação",
  TEMPORARY_SUPPORT: "Suporte temporário",
  ADMIN_RECOVERY: "Recuperação administrativa",
  RESET_CLINIC: "Reinicialização do consultório",
};
export function AdminPanel({
  onClose,
  onRefresh,
  onSession,
  onEnded,
}: {
  onClose: () => void;
  onRefresh: () => Promise<void>;
  onSession: (session: { token: string; user: User }) => Promise<void>;
  onEnded: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const guard = useRef(createAdminSessionGuard());
  const [token, setToken] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [tab, setTab] = useState<AdminTab>("licenses");
  const [kind, setKind] =
    useState<keyof typeof licenseKinds>("TEMPORARY_SUPPORT");
  const [source, setSource] = useState("");
  const [key, setKey] = useState("");
  const [filePassword, setFilePassword] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activity, setActivity] = useState(0);
  function clear() {
    guard.current.clear();
    setToken(null);
    setStatus(null);
    setPassword("");
    setFilePassword("");
    setActivationCode("");
    setRecoveryPassword("");
    setKey("");
    setNotice("");
  }
  async function operate<T>(action: Record<string, unknown>): Promise<T> {
    const snapshot = guard.current.capture();
    const result = await api<T>(snapshot.token, {
      op: "master_operation",
      action,
    });
    if (!guard.current.valid(snapshot))
      throw new Error("A sessão administrativa foi encerrada.");
    setActivity(Date.now());
    return result;
  }
  async function refresh() {
    const snapshot = guard.current.capture();
    setStatus(await operate<Status>({ op: "status" }));
    await onRefresh();
    if (!guard.current.valid(snapshot))
      throw new Error("A sessão administrativa foi encerrada.");
  }
  async function run<T>(job: () => Promise<T>): Promise<T | undefined> {
    const snapshot = guard.current.capture();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      return await job();
    } catch (e) {
      if (guard.current.valid(snapshot)) {
        if (
          typeof e === "object" &&
          e !== null &&
          "code" in e &&
          e.code === "UNAUTHORIZED"
        )
          clear();
        setError(errorMessage(e));
      }
    } finally {
      setBusy(false);
    }
  }
  async function close() {
    if (busy) return;
    const current = guard.current.capture().token;
    clear();
    if (current)
      await api(current, {
        op: "master_operation",
        action: { op: "logout" },
      }).catch(() => undefined);
    dialog.current?.close();
    onClose();
  }
  useEffect(() => {
    dialog.current?.showModal();
    let active = true;
    void api<{ configured: boolean }>(null, { op: "master_status" }).then(
      (r) => {
        if (active) setConfigured(r.configured);
      },
      (e) => {
        if (active) setError(errorMessage(e));
      },
    );
    const unlisten = listen("session-locked", () => {
      clear();
      setError("Sessão encerrada pelo bloqueio do Windows. Entre novamente.");
    });
    const sessionGuard = guard.current;
    return () => {
      active = false;
      const current = sessionGuard.capture().token;
      sessionGuard.clear();
      void unlisten.then((stop) => stop()).catch(() => undefined);
      if (current)
        void api(current, {
          op: "master_operation",
          action: { op: "logout" },
        }).catch(() => undefined);
    };
  }, []);
  useEffect(() => {
    if (!token) return;
    const timeout = setTimeout(() => {
      clear();
      setError("Sessão encerrada por inatividade. Entre novamente.");
    }, 3600000);
    return () => clearTimeout(timeout);
  }, [token, activity]);
  function changeTab(next: AdminTab) {
    setKey("");
    setFilePassword("");
    setActivationCode("");
    setRecoveryPassword("");
    setError("");
    setNotice("");
    setTab(next);
  }
  async function entered(session: { token: string; user: User }) {
    await onSession(session);
    const current = guard.current.capture().token;
    clear();
    if (current)
      await api(current, {
        op: "master_operation",
        action: { op: "logout" },
      }).catch(() => undefined);
    onClose();
  }
  const licenseApi: typeof api = (_token, command) =>
    operate({ op: "license_operation", command });
  async function refreshAfterLicense() {
    if (guard.current.capture().token) {
      try {
        await refresh();
        return;
      } catch (e) {
        if (
          !(
            typeof e === "object" &&
            e !== null &&
            "code" in e &&
            e.code === "UNAUTHORIZED"
          )
        )
          throw e;
      }
    }
    clear();
    onEnded();
    await onRefresh();
    setNotice(
      "Operação aplicada. As sessões foram encerradas; entre novamente para continuar.",
    );
  }
  async function chooseBackup(saving: boolean) {
    return saving
      ? save({
          filters: [
            {
              name: "Backup do emissor de licenças",
              extensions: ["webfit-issuer-backup"],
            },
          ],
        })
      : open({
          multiple: false,
          filters: [
            {
              name: "Backup do emissor de licenças",
              extensions: ["webfit-issuer-backup"],
            },
          ],
        });
  }
  return (
    <dialog
      ref={dialog}
      className="admin-dialog"
      aria-labelledby="admin-title"
      onCancel={(e) => {
        e.preventDefault();
        void close();
      }}
    >
      <header className="admin-heading">
        <div>
          <h2 id="admin-title">Painel administrativo</h2>
          <p>Administração local do WebFit Desktop</p>
        </div>
        <button disabled={busy} onClick={() => void close()}>
          {token ? "Sair do painel" : "Fechar painel"}
        </button>
      </header>
      {error && (
        <p role="alert" className="message error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="message">
          {notice}
        </p>
      )}
      {!token ? (
        <form
          className="admin-login"
          onSubmit={(e) => {
            e.preventDefault();
            const snapshot = guard.current.capture();
            void run(async () => {
              const result = await api<{ token: string }>(null, {
                op: "master_login",
                password,
              });
              setPassword("");
              if (!guard.current.valid(snapshot)) return;
              guard.current.open(result.token);
              setToken(result.token);
              setActivity(Date.now());
              const opened = guard.current.capture();
              await refresh().catch((e) => {
                if (guard.current.valid(opened)) setError(errorMessage(e));
              });
            });
          }}
        >
          <p>
            Uma senha mestra libera as funções de administração e emissão de
            licenças.
          </p>
          {configured === null && (
            <p role="status">Consultando configuração…</p>
          )}
          {configured === false && (
            <p role="status">
              A senha mestra precisa ser configurada no próximo instalador pelo
              mantenedor. O acesso da nutricionista continua disponível.
            </p>
          )}
          <Field label="Senha mestra">
            <input
              type="password"
              autoFocus
              required
              maxLength={1024}
              autoComplete="current-password"
              value={password}
              disabled={busy || configured !== true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <button className="primary" disabled={busy || configured !== true}>
            {busy ? "Validando…" : "Entrar no painel"}
          </button>
        </form>
      ) : (
        <>
          <nav className="admin-tabs" aria-label="Ferramentas administrativas">
            {adminTabs.map((item) => (
              <button
                key={item.id}
                aria-current={tab === item.id ? "page" : undefined}
                disabled={busy}
                onClick={() => changeTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          {!status ? (
            <div>
              <p role="status">Carregando ferramentas…</p>
              <button disabled={busy} onClick={() => void run(refresh)}>
                Tentar carregar novamente
              </button>
            </div>
          ) : tab === "licenses" ? (
            <section
              className="admin-columns"
              aria-label="Emissão e aplicação de licenças"
            >
              <div>
                <h3>Emitir para este computador</h3>
                <p>
                  Gere a autorização e deixe-a pronta para confirmar a operação
                  neste painel.
                </p>
                {!status.issuerTrusted && (
                  <p role="status">
                    Importe o backup do emissor atual na aba Emissor de licenças
                    para habilitar a emissão.
                  </p>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void run(async () => {
                      const r = await operate<{
                        imported: boolean;
                        path: string;
                        importError?: string;
                        auditWarning?: string;
                      }>({
                        op: "emit_local",
                        kind,
                        source: kind === "TRANSFER_RECOVERY" ? source : null,
                      });
                      if (!r.imported)
                        throw new Error(
                          `A licença foi emitida em ${r.path}, mas a importação não concluiu. ${r.importError ?? "Importe o arquivo novamente."}`,
                        );
                      setNotice(
                        `Autorização emitida e importada. Confirme abaixo a operação correspondente. ${r.auditWarning ?? ""}`,
                      );
                      await refresh();
                    });
                  }}
                >
                  <Field label="Tipo de autorização">
                    <select
                      value={kind}
                      disabled={busy}
                      onChange={(e) =>
                        setKind(e.target.value as keyof typeof licenseKinds)
                      }
                    >
                      {Object.entries(licenseKinds).map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {kind === "TRANSFER_RECOVERY" && (
                    <Field label="Licença da origem ou SHA-256 do backup">
                      <input
                        required
                        maxLength={100}
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                      />
                    </Field>
                  )}
                  <button
                    className="primary"
                    disabled={busy || !status.issuerTrusted}
                  >
                    Emitir e importar autorização
                  </button>
                </form>
                <details className="form-section">
                  <summary>
                    Emitir ativação inicial por arquivo e código
                  </summary>
                  <p>
                    Gera um arquivo .webfit-license e um código de ativação para
                    preparar um destino vazio. Não reinicializa uma instalação
                    em uso.
                  </p>
                  <button
                    disabled={busy || !status.issuerTrusted}
                    onClick={() =>
                      void run(async () => {
                        setActivationCode("");
                        if (
                          !window.confirm(
                            "Emitir ativação inicial por arquivo e código? A autorização offline pode ser usada em mais de um destino vazio; distribua somente onde pretende ativar.",
                          )
                        )
                          return;
                        const path = await save({
                          filters: [
                            {
                              name: "Licença WebFit",
                              extensions: ["webfit-license"],
                            },
                          ],
                        });
                        if (!path) return;
                        const result = await operate<{
                          code: string;
                          auditWarning?: string;
                        }>({
                          op: "emit_initial_code",
                          path,
                          confirmed: true,
                        });
                        setActivationCode(result.code);
                        setNotice(
                          `Arquivo de ativação salvo. Guarde o código apresentado abaixo junto dele. ${result.auditWarning ?? ""}`,
                        );
                        await refresh();
                      })
                    }
                  >
                    Salvar licença inicial e gerar código
                  </button>
                  {activationCode && (
                    <Field label="Código de ativação da licença emitida">
                      <input
                        readOnly
                        value={activationCode}
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </Field>
                  )}
                </details>
                <details className="form-section">
                  <summary>
                    Emitir para outro computador por solicitação
                  </summary>
                  <p>
                    Selecione a solicitação do destino e salve a licença
                    assinada. O acesso ao emissor já está autorizado pela senha
                    mestra.
                  </p>
                  <button
                    disabled={busy || !status.issuerTrusted}
                    onClick={() =>
                      void run(async () => {
                        const path = await open({
                          multiple: false,
                          filters: [
                            {
                              name: "Solicitação WebFit",
                              extensions: ["webfit-request"],
                            },
                          ],
                        });
                        if (typeof path !== "string") return;
                        const r = await operate<{ request: unknown }>({
                          op: "issuer",
                          action: { op: "read_request", path },
                        });
                        const output = await save({
                          filters: [
                            {
                              name: "Licença WebFit",
                              extensions: ["webfit-license"],
                            },
                          ],
                        });
                        if (!output) return;
                        const issued = await operate<{ auditWarning?: string }>(
                          {
                            op: "emit_request",
                            request: r.request,
                            path: output,
                          },
                        );
                        setNotice(
                          `Licença emitida para a solicitação selecionada. ${issued.auditWarning ?? ""}`,
                        );
                        await refresh();
                      })
                    }
                  >
                    Abrir solicitação e emitir licença
                  </button>
                </details>
                {status.license.pending.some((g) => g.kind === "INITIAL") &&
                  !status.license.initialized && (
                    <form
                      className="form-section"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const values = Object.fromEntries(
                          new FormData(e.currentTarget),
                        );
                        void run(async () => {
                          await licenseApi(null, { op: "setup", ...values });
                          await refresh();
                          setNotice(
                            "Acessos preparados. Entre no Saúde pela aba Banco e manutenção.",
                          );
                        });
                      }}
                    >
                      <h3>Preparar acesso da nutricionista</h3>
                      <Field label="Nome de acesso da nutricionista">
                        <input
                          name="professional_name"
                          required
                          maxLength={100}
                        />
                      </Field>
                      <Field label="Senha da nutricionista">
                        <input
                          name="professional_password"
                          type="password"
                          required
                          minLength={6}
                          maxLength={1024}
                          autoComplete="new-password"
                        />
                      </Field>
                      <Field label="Senha de recuperação dos backups clínicos">
                        <input
                          name="recovery_password"
                          type="password"
                          required
                          minLength={12}
                          maxLength={1024}
                          autoComplete="new-password"
                        />
                      </Field>
                      <button disabled={busy}>Preparar acessos locais</button>
                    </form>
                  )}
              </div>
              <LicensePanel
                status={status.license}
                busy={busy}
                task={run}
                onRefresh={refreshAfterLicense}
                onSession={entered}
                token={token}
                operate={licenseApi}
                onSupport={async (id) =>
                  entered(await operate({ op: "start_support", id }))
                }
                onEnded={() => {
                  clear();
                  onEnded();
                }}
              />
            </section>
          ) : tab === "database" ? (
            <section className="admin-columns" aria-label="Banco e manutenção">
              <div>
                <h3>Acesso ao banco SQLCipher</h3>
                <p className="license-id">{status.databasePath}</p>
                <p>
                  A chave hexadecimal é fixa. Habilitar este acesso conserva a
                  criptografia e cria um backup em uma instalação preparada.
                </p>
                {!status.databaseEnabled ? (
                  <button
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        if (
                          !window.confirm(
                            "Habilitar o acesso técnico ao banco? Será criado um backup consistente antes da habilitação se os acessos já estiverem preparados.",
                          )
                        )
                          return;
                        await operate({
                          op: "enable_database",
                          confirmed: true,
                        });
                        await refresh();
                        setNotice(
                          "Acesso técnico habilitado. A chave existente foi preservada.",
                        );
                      })
                    }
                  >
                    Habilitar acesso técnico
                  </button>
                ) : (
                  <button
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        const r = await operate<{ key: string }>({
                          op: "reveal_database_key",
                        });
                        setKey(r.key);
                      })
                    }
                  >
                    Mostrar chave hexadecimal
                  </button>
                )}
                {key && (
                  <>
                    <Field label="Chave hexadecimal do banco">
                      <input
                        type="text"
                        value={key}
                        readOnly
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </Field>
                    <button onClick={() => setKey("")}>Ocultar chave</button>
                  </>
                )}
                <p className="hint">
                  Use um gerenciador compatível com SQLCipher no modo de chave
                  hexadecimal. Guarde a chave e feche o WebFit antes de abrir o
                  banco para manutenção. Alterações por SQL externo não geram a
                  auditoria funcional do aplicativo.
                </p>
              </div>
              <div>
                <h3>Ferramentas de manutenção</h3>
                <div className="actions">
                  <button
                    disabled={busy || !status.license.licensed}
                    onClick={() =>
                      void run(async () =>
                        entered(await operate({ op: "enter_clinic" })),
                      )
                    }
                  >
                    Entrar no Saúde como administrador
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        const r = await operate<{ schema: number }>({
                          op: "integrity",
                        });
                        setNotice(
                          `Integridade do banco verificada. Schema ${r.schema}.`,
                        );
                      })
                    }
                  >
                    Verificar integridade
                  </button>
                  <button
                    disabled={busy || !status.license.initialized}
                    onClick={() =>
                      void run(async () => {
                        await operate({ op: "backup", path: null });
                        setNotice("Backup clínico criado com sucesso.");
                      })
                    }
                  >
                    Criar backup clínico
                  </button>
                </div>
                <form
                  className="form-section"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void run(async () => {
                      const path = await open({
                        multiple: false,
                        filters: [
                          {
                            name: "Backup clínico",
                            extensions: ["webfit-backup"],
                          },
                        ],
                      });
                      if (typeof path !== "string") return;
                      if (
                        !window.confirm(
                          "Restaurar este backup clínico? Será criada uma cópia de segurança do estado atual antes da restauração. As sessões serão encerradas.",
                        )
                      )
                        return;
                      try {
                        await operate({
                          op: "restore",
                          path,
                          password: recoveryPassword,
                          confirmed: true,
                        });
                      } finally {
                        setRecoveryPassword("");
                      }
                      clear();
                      onEnded();
                      await onRefresh();
                      setNotice(
                        "Backup clínico restaurado. Entre novamente para continuar.",
                      );
                    });
                  }}
                >
                  <Field label="Senha de recuperação do backup clínico">
                    <input
                      type="password"
                      required
                      maxLength={1024}
                      autoComplete="off"
                      value={recoveryPassword}
                      disabled={busy}
                      onChange={(e) => setRecoveryPassword(e.target.value)}
                    />
                  </Field>
                  <button disabled={busy || !status.license.licensed}>
                    Selecionar backup e restaurar
                  </button>
                </form>
                <p className="hint">
                  Pacientes, auditoria e outras ferramentas clínicas estão
                  disponíveis ao entrar no Saúde. Reinicialização do consultório
                  fica na aba Licenças.
                </p>
              </div>
            </section>
          ) : (
            <section className="admin-columns" aria-label="Emissor de licenças">
              <div>
                <h3>
                  {status.issuer.initialized
                    ? "Emissor integrado"
                    : "Importar o emissor atual"}
                </h3>
                <p>
                  O emissor guarda os dados necessários para gerar licenças.
                  Importe uma vez o arquivo .webfit-issuer-backup exportado pelo
                  emissor que você já utiliza.
                </p>
                <p className="hint">
                  O arquivo .webfit-license e o código usados para ativar o
                  aplicativo são a autorização de uso. O backup do emissor é
                  outro arquivo, que transporta a capacidade de emitir novas
                  licenças.
                </p>
                <p>
                  {status.issuerTrusted
                    ? "Emissor compatível com este aplicativo."
                    : "Backup do emissor ainda não importado."}
                </p>
                <p>{status.issuer.issued} licenças no histórico do emissor.</p>
                {status.issuer.publicKey && (
                  <p className="license-id">
                    Chave pública do emissor: {status.issuer.publicKey}
                  </p>
                )}
              </div>
              <div>
                <Field label="Senha do backup do emissor de licenças">
                  <input
                    type="password"
                    value={filePassword}
                    maxLength={1024}
                    autoComplete="off"
                    onChange={(e) => setFilePassword(e.target.value)}
                    disabled={busy}
                  />
                </Field>
                <p className="hint">
                  Esta senha abre o arquivo de backup. Você já entrou no emissor
                  com a senha mestra do painel.
                </p>
                <div className="actions">
                  <button
                    disabled={busy || !filePassword}
                    onClick={() =>
                      void run(async () => {
                        const path = await chooseBackup(false);
                        if (typeof path !== "string") return;
                        if (
                          !window.confirm(
                            "Importar o backup do emissor de licenças? Ele deve ser compatível com este aplicativo. Os dados do emissor já configurado serão salvos em um backup protegido antes da substituição.",
                          )
                        )
                          return;
                        try {
                          await operate({
                            op: "issuer",
                            action: {
                              op: "import_backup",
                              path,
                              password: filePassword,
                              confirmed: true,
                            },
                          });
                        } finally {
                          setFilePassword("");
                        }
                        await refresh();
                        setNotice(
                          "Emissor de licenças configurado. Você já pode gerar licenças com o acesso pela senha mestra.",
                        );
                      })
                    }
                  >
                    Importar backup do emissor de licenças
                  </button>
                  <button
                    disabled={
                      busy ||
                      !status.issuer.initialized ||
                      filePassword.length < 12
                    }
                    onClick={() =>
                      void run(async () => {
                        const path = await chooseBackup(true);
                        if (!path) return;
                        try {
                          await operate({
                            op: "issuer",
                            action: {
                              op: "export_backup",
                              path,
                              password: filePassword,
                            },
                          });
                        } finally {
                          setFilePassword("");
                        }
                        setNotice("Backup protegido do emissor exportado.");
                      })
                    }
                  >
                    Exportar backup do emissor de licenças
                  </button>
                </div>
              </div>
            </section>
          )}
          <footer className="admin-footer">
            <p className="hint">
              Sessão protegida pela senha mestra. Bloqueio do Windows e
              inatividade encerram o acesso.
            </p>
          </footer>
        </>
      )}
    </dialog>
  );
}
