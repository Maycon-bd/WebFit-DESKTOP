export interface DashboardSummary {
  patients: { active: number; archived: number };
  prescriptions: {
    draft: number;
    finalized: number;
    superseded: number;
    cancelled: number;
  };
  registrations: { month: string; count: number }[];
  generatedAt: string;
}
export function monthLabel(month: string, long = false): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: long ? "long" : "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`));
}
export function registrationScale(
  rows: DashboardSummary["registrations"],
): number {
  return Math.max(1, ...rows.map((row) => row.count));
}
