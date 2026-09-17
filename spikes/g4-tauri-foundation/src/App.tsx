import { FormEvent, useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Patient {
  id: string;
  displayName: string;
  createdAtUtc: string;
}

interface StorageStatus {
  databaseFile: string;
  migrationVersion: number;
  foreignKeysEnabled: boolean;
  patientCount: number;
}

interface BackupVerification {
  backupFile: string;
  restoredFile: string;
  checksumSha256: string;
  restoredChecksumSha256: string;
  integrityCheck: string;
  patientCount: number;
}

function App() {
  const [name, setName] = useState("Paciente Fictício");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [backup, setBackup] = useState<BackupVerification | null>(null);
  const [message, setMessage] = useState("Carregando a persistência local…");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [nextPatients, nextStatus] = await Promise.all([
      invoke<Patient[]>("list_test_patients"),
      invoke<StorageStatus>("get_storage_status"),
    ]);
    setPatients(nextPatients);
    setStatus(nextStatus);
    setMessage("Banco local pronto.");
  }, []);

  useEffect(() => {
    refresh().catch((error) => setMessage(String(error)));
  }, [refresh]);

  async function createPatient(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("Gravando paciente fictício…");
    try {
      await invoke<Patient>("create_test_patient", {
        input: { displayName: name },
      });
      await refresh();
      setMessage("Registro fictício persistido. Feche e reabra para validar.");
    } catch (error) {
      setMessage(String(error));
    } finally {
      setBusy(false);
    }
  }

  async function verifyBackup() {
    setBusy(true);
    setMessage("Criando snapshot e exercitando restauração…");
    try {
      const report = await invoke<BackupVerification>("create_and_verify_backup");
      setBackup(report);
      setMessage("Backup e restauração de verificação concluídos.");
    } catch (error) {
      setMessage(String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">WebFit Desktop · G4</p>
        <h1>Spike da fundação local</h1>
        <p>Somente dados fictícios. Esta prova não é a aplicação de produção.</p>
      </header>

      <section className="panel" aria-labelledby="storage-title">
        <h2 id="storage-title">Estado da persistência</h2>
        <dl className="facts">
          <div><dt>Banco</dt><dd>{status?.databaseFile ?? "—"}</dd></div>
          <div><dt>Migração</dt><dd>{status?.migrationVersion ?? "—"}</dd></div>
          <div><dt>Foreign keys</dt><dd>{status?.foreignKeysEnabled ? "ativas" : "—"}</dd></div>
          <div><dt>Registros</dt><dd>{status?.patientCount ?? "—"}</dd></div>
        </dl>
      </section>

      <section className="panel" aria-labelledby="patient-title">
        <h2 id="patient-title">Comando tipado de teste</h2>
        <form onSubmit={createPatient}>
          <label htmlFor="patient-name">Nome fictício</label>
          <div className="row">
            <input
              id="patient-name"
              value={name}
              maxLength={200}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <button disabled={busy || !name.trim()} type="submit">Criar</button>
          </div>
        </form>
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              <strong>{patient.displayName}</strong>
              <span>{patient.createdAtUtc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby="backup-title">
        <h2 id="backup-title">Backup e restauração</h2>
        <button disabled={busy} onClick={verifyBackup} type="button">
          Criar snapshot e verificar restauração
        </button>
        {backup && (
          <dl className="backup-report">
            <div><dt>Snapshot</dt><dd>{backup.backupFile}</dd></div>
            <div><dt>Restauração</dt><dd>{backup.restoredFile}</dd></div>
            <div><dt>Integridade</dt><dd>{backup.integrityCheck}</dd></div>
            <div><dt>SHA-256</dt><dd>{backup.checksumSha256}</dd></div>
          </dl>
        )}
      </section>

      <p className="message" role="status">{message}</p>
    </main>
  );
}

export default App;