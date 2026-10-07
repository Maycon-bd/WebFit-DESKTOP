export interface AuditFilters {
  from: string;
  to: string;
  user: string;
  action: string;
  entity: string;
  result: string;
}

export const emptyAuditFilters: AuditFilters = {
  from: "",
  to: "",
  user: "",
  action: "",
  entity: "",
  result: "",
};

export function auditQuery(filter: AuditFilters) {
  const from = filter.from ? new Date(filter.from) : null;
  const to = filter.to ? new Date(filter.to) : null;
  if (
    (from && !Number.isFinite(from.getTime())) ||
    (to && !Number.isFinite(to.getTime()))
  ) {
    throw new Error("Informe datas válidas para consultar os eventos.");
  }
  if (from && to && from >= to) {
    throw new Error("A data inicial deve ser anterior à data final.");
  }
  return {
    ...Object.fromEntries(Object.entries(filter).filter(([, value]) => value)),
    from: from?.toISOString() ?? null,
    to: to?.toISOString() ?? null,
  };
}

// React StrictMode subscribes twice to the same opening. A failed opening may
// be retried, but a successful one must not write a second access event.
export function createAuditOpening<T>(load: () => Promise<T>) {
  let pending: Promise<T> | undefined;
  return () => {
    if (!pending) {
      pending = load().catch((error: unknown) => {
        pending = undefined;
        throw error;
      });
    }
    return pending;
  };
}

export function auditActor(actor: string, name?: string | null) {
  if (actor === "SYSTEM") return "Sistema";
  if (actor === "UNAUTHENTICATED") return "Não autenticado";
  return name || "Usuário indisponível";
}
