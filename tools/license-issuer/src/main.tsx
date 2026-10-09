import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import "../../../src/style.css";

interface Request {
  version: number;
  installation_id: string;
  request_id: string;
  challenge: string;
  recipient: string;
  kind: string;
  base_license_id: string | null;
  source: string | null;
}
const titles: Record<string, string> = {
  INITIAL: "Ativação inicial",
  TRANSFER_RECOVERY: "Transferência / recuperação",
  TEMPORARY_SUPPORT: "Suporte temporário — uma sessão de até 4 horas",
  ADMIN_RECOVERY: "Recuperação administrativa",
  RESET_CLINIC: "Reinicialização do consultório",
};
function operate<T>(action: Record<string, unknown>): Promise<T> {
  return invoke<T>("issuer_operate", { action });
}
function App() {
  const [status, setStatus] = useState<{
    initialized: boolean;
    publicKey: string | null;
    issued: number;
  } | null>(null);
  const [request, setRequest] = useState<Request | null>(null);
  const [fingerprint, setFingerprint] = useState("");
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [recovery, setRecovery] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [initialLogin, setInitialLogin] = useState("admin");
  const [initialPassword, setInitialPassword] = useState("");
  const [initialConfirmed, setInitialConfirmed] = useState(false);
  const [initialReveal, setInitialReveal] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  async function refresh() {
    setStatus(await operate({ op: "status" }));
  }
  async function task(run: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await run();
      await refresh();
    } catch (e) {
      setError(
        typeof e === "object" && e !== null && "message" in e
          ? String(e.message)
          : "Não foi possível concluir. Verifique o arquivo e tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void refresh().catch(() =>
      setError("Abra esta ferramenta pelo executável do emissor."),
    );
  }, []);
  async function choose(extension: string, saving = false) {
    return saving
      ? save({ filters: [{ name: "WebFit", extensions: [extension] }] })
      : open({
          multiple: false,
          filters: [{ name: "WebFit", extensions: [extension] }],
        });
  }
  return (
    <main className="issuer-main">
      <h1>Emissor de licenças WebFit</h1>
      <p>
        Uso exclusivo do administrador. A chave privada permanece no cofre deste
        computador.
      </p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {!status ? (
        <p role="status">Consultando o cofre…</p>
      ) : !status.initialized ? (
        <section>
          <h2>Preparar o emissor</h2>
          <p>
            Crie uma identidade e guarde um backup protegido antes de distribuir
            licenças.
          </p>
          <label>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />{" "}
            Confirmo a criação da identidade de emissão
          </label>
          <button
            disabled={busy || !confirmed}
            onClick={() =>
              void task(async () => {
                await operate({ op: "initialize", confirmed });
                setConfirmed(false);
                setNotice(
                  "Identidade criada. Exporte a chave pública e o backup do cofre.",
                );
              })
            }
          >
            Criar identidade
          </button>
        </section>
      ) : (
        <>
          <section>
            <h2>Ativação inicial sem solicitação</h2>
            <p>
              Gere a licença antes da instalação. Envie a licença e o código
              junto do instalador; guarde sua senha administrativa no Bitwarden.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void task(async () => {
                  const path = await choose("webfit-license", true);
                  if (typeof path !== "string") return;
                  const result = await operate<{ code: string }>({
                    op: "issue_initial_code",
                    login: initialLogin,
                    password: initialPassword,
                    path,
                    confirmed: initialConfirmed,
                  });
                  setActivationCode(result.code);
                  setInitialConfirmed(false);
                  setNotice(
                    "Licença inicial salva. Copie o código de ativação e envie com a licença e o instalador. Sua senha administrativa fica somente com você.",
                  );
                });
              }}
            >
              <label>
                Seu nome de acesso administrativo
                <input
                  value={initialLogin}
                  required
                  maxLength={100}
                  disabled={busy || !!activationCode}
                  onChange={(e) => setInitialLogin(e.target.value)}
                />
              </label>
              <label>
                Sua senha administrativa para esta licença
                <input
                  type={initialReveal ? "text" : "password"}
                  value={initialPassword}
                  required
                  minLength={12}
                  maxLength={1024}
                  autoComplete="new-password"
                  disabled={busy || !!activationCode}
                  onChange={(e) => setInitialPassword(e.target.value)}
                />
              </label>
              <div className="actions">
                <button
                  type="button"
                  disabled={busy || !!activationCode}
                  onClick={() =>
                    void task(async () => {
                      const result = await operate<{ password: string }>({
                        op: "password",
                      });
                      setInitialPassword(result.password);
                    })
                  }
                >
                  Gerar senha administrativa
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setInitialReveal(!initialReveal)}
                >
                  {initialReveal ? "Ocultar senha" : "Mostrar senha"}
                </button>
              </div>
              <label>
                <input
                  type="checkbox"
                  checked={initialConfirmed}
                  disabled={busy || !!activationCode}
                  onChange={(e) => setInitialConfirmed(e.target.checked)}
                />{" "}
                Guardei meu acesso e aceito que o pacote possa ativar mais de um
                computador offline
              </label>
              <button disabled={busy || !initialConfirmed || !!activationCode}>
                Gerar licença e código de ativação
              </button>
            </form>
            {activationCode && (
              <div>
                <label>
                  Código de ativação para enviar com a licença
                  <input readOnly value={activationCode} autoComplete="off" />
                </label>
                <p className="hint">
                  Copie e guarde o código antes de fechar. Ele não é sua senha
                  administrativa.
                </p>
                <button
                  disabled={busy}
                  onClick={() => {
                    if (
                      !window.confirm(
                        "Você já guardou o código e sua senha? Preparar uma nova emissão limpará os campos desta tela.",
                      )
                    )
                      return;
                    setActivationCode("");
                    setInitialPassword("");
                    setInitialReveal(false);
                    setInitialConfirmed(false);
                  }}
                >
                  Preparar outra licença inicial
                </button>
              </div>
            )}
          </section>
          <section>
            <h2>Emitir autorização</h2>
            <button
              disabled={busy}
              onClick={() =>
                void task(async () => {
                  const path = await choose("webfit-request");
                  if (typeof path !== "string") return;
                  const r = await operate<{
                    request: Request;
                    fingerprint: string;
                  }>({ op: "read_request", path });
                  setRequest(r.request);
                  setFingerprint(r.fingerprint);
                  setConfirmed(false);
                  if (r.request.kind !== "RESET_CLINIC") {
                    const generated = await operate<{ password: string }>({
                      op: "password",
                    });
                    setPassword(generated.password);
                  } else {
                    setPassword("");
                  }
                })
              }
            >
              Abrir solicitação
            </button>
            {request && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void task(async () => {
                    const path = await choose("webfit-license", true);
                    if (typeof path !== "string") return;
                    await operate({
                      op: "issue",
                      request,
                      login,
                      password,
                      path,
                    });
                    setNotice(
                      "Autorização emitida. Envie o arquivo à instalação e guarde a credencial no Bitwarden. Emissão não confirma consumo.",
                    );
                    setRequest(null);
                    setPassword("");
                    setConfirmed(false);
                  });
                }}
              >
                <dl>
                  <dt>Tipo</dt>
                  <dd>{titles[request.kind]}</dd>
                  <dt>Instalação</dt>
                  <dd>{request.installation_id}</dd>
                  <dt>Solicitação</dt>
                  <dd>{request.request_id}</dd>
                  <dt>Identidade do destinatário</dt>
                  <dd className="license-id">{fingerprint}</dd>
                  {request.source && (
                    <>
                      <dt>Origem</dt>
                      <dd className="license-id">{request.source}</dd>
                    </>
                  )}
                </dl>
                {request.kind !== "RESET_CLINIC" && (
                  <>
                    <label>
                      Nome de acesso administrativo
                      <input
                        value={login}
                        required
                        maxLength={100}
                        onChange={(e) => setLogin(e.target.value)}
                      />
                    </label>
                    <label>
                      Senha exclusiva desta autorização
                      <input
                        type={reveal ? "text" : "password"}
                        value={password}
                        required
                        minLength={12}
                        maxLength={1024}
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </label>
                    <div className="actions">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void task(async () => {
                            const r = await operate<{ password: string }>({
                              op: "password",
                            });
                            setPassword(r.password);
                          })
                        }
                      >
                        Gerar senha
                      </button>
                      <button type="button" onClick={() => setReveal(!reveal)}>
                        {reveal ? "Ocultar senha" : "Mostrar senha"}
                      </button>
                    </div>
                    <p className="hint">
                      Guarde em um item Login ou nota segura do Bitwarden,
                      identificando a instalação. A licença leva somente o
                      verificador cifrado.
                    </p>
                  </>
                )}
                <label>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />{" "}
                  Conferi tipo, instalação e identidade com o destinatário
                </label>
                <button className="primary" disabled={busy || !confirmed}>
                  Emitir e salvar autorização
                </button>
              </form>
            )}
          </section>
          <section>
            <h2>Confiança do aplicativo</h2>
            <p>
              Exporte a configuração pública e integre-a em
              src-tauri/license-trust.json antes de gerar o instalador clínico.
              Este arquivo não contém a chave privada.
            </p>
            <button
              disabled={busy}
              onClick={() =>
                void task(async () => {
                  const path = await choose("json", true);
                  if (typeof path !== "string") return;
                  await operate({ op: "export_trust", path });
                  setNotice("Configuração pública exportada.");
                })
              }
            >
              Exportar chave pública
            </button>
            <p>{status.issued} autorizações emitidas neste cofre.</p>
          </section>
        </>
      )}
      <section>
        <h2>Backup e recuperação do emissor</h2>
        <label>
          Senha de recuperação do cofre
          <input
            type="password"
            value={recovery}
            minLength={12}
            maxLength={1024}
            autoComplete="off"
            onChange={(e) => setRecovery(e.target.value)}
          />
        </label>
        <div className="actions">
          <button
            disabled={busy || !status?.initialized || recovery.length < 12}
            onClick={() =>
              void task(async () => {
                const path = await choose("webfit-issuer-backup", true);
                if (typeof path !== "string") return;
                await operate({
                  op: "export_backup",
                  path,
                  password: recovery,
                });
                setRecovery("");
                setNotice(
                  "Backup protegido salvo. Guarde a senha separadamente.",
                );
              })
            }
          >
            Exportar backup protegido
          </button>
          <button
            disabled={busy || recovery.length < 12}
            onClick={() =>
              void task(async () => {
                const path = await choose("webfit-issuer-backup");
                if (typeof path !== "string") return;
                if (
                  !window.confirm(
                    "Recuperar este cofre? O cofre atual será preservado em um backup protegido antes da substituição.",
                  )
                )
                  return;
                await operate({
                  op: "import_backup",
                  path,
                  password: recovery,
                  confirmed: true,
                });
                setRecovery("");
                setRequest(null);
                setPassword("");
                setNotice("Cofre recuperado.");
              })
            }
          >
            Recuperar cofre
          </button>
        </div>
      </section>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
