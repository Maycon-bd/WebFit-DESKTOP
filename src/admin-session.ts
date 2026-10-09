export type AdminTab = "licenses" | "database" | "vault";
export const adminTabs: { id: AdminTab; label: string }[] = [
  { id: "licenses", label: "Licenças" },
  { id: "database", label: "Banco e manutenção" },
  { id: "vault", label: "Emissor de licenças" },
];

// An operation started before lock/logout must not restore credentials afterward.
export function createAdminSessionGuard() {
  let revision = 0;
  let token: string | null = null;
  return {
    capture: () => ({ revision, token }),
    valid: (snapshot: { revision: number; token: string | null }) =>
      snapshot.revision === revision && snapshot.token === token,
    open: (next: string) => {
      revision++;
      token = next;
    },
    clear: () => {
      revision++;
      token = null;
    },
  };
}
