import { useEffect, useState } from "react";
import { api } from "./api";
import type { BackupStatus } from "./api";

export function backupWarning(
  status: BackupStatus | null,
  failedQuery = false,
) {
  if (failedQuery) return "Não foi possível consultar o estado dos backups.";
  if (status?.failed)
    return "A última tentativa de backup falhou. Crie uma nova cópia.";
  if (status?.stale) return "Não há backup válido nas últimas 24 horas.";
  return "";
}

/** Session alert: automatic backup failures remain visible outside Settings. */
export function BackupNotice({
  token,
  revision,
  onManage,
  busy = false,
}: {
  token: string;
  revision: number;
  onManage: () => void;
  busy?: boolean;
}) {
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [failedQuery, setFailedQuery] = useState(false);
  useEffect(() => {
    let active = true;
    let request = 0;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    async function refresh() {
      const current = ++request;
      try {
        const next = await api<BackupStatus>(token, { op: "backup_status" });
        if (!active || current !== request) return;
        setStatus(next);
        setFailedQuery(false);
        clearTimeout(deadline);
        const remaining =
          Date.parse(next.lastBackup) + 24 * 60 * 60 * 1000 - Date.now();
        if (!next.stale && Number.isFinite(remaining) && remaining >= 0)
          deadline = setTimeout(
            () => void refresh(),
            Math.min(remaining + 1000, 2147483647),
          );
      } catch {
        if (active && current === request) setFailedQuery(true);
      }
    }
    void refresh();
    const focused = () => void refresh();
    window.addEventListener("focus", focused);
    return () => {
      active = false;
      clearTimeout(deadline);
      window.removeEventListener("focus", focused);
    };
  }, [token, revision]);
  const warning = backupWarning(status, failedQuery);
  if (!warning) return null;
  return (
    <div className="message error" role="alert">
      {warning}{" "}
      <button type="button" disabled={busy} onClick={onManage}>
        Abrir backup e restauração
      </button>
    </div>
  );
}
