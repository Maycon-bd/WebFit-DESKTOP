import { invoke } from "@tauri-apps/api/core";
export interface User {
  id: string;
  name: string;
  role: string;
  must_change: boolean;
}
export interface Patient {
  id?: string;
  internalNumber?: number;
  name: string;
  socialName: string;
  cpf: string;
  phone: string;
  birth: string;
  email: string;
  address: string;
  sex: string;
  gender: string;
  notes: string;
  tags: string[];
  archived?: boolean;
  guardian?: Record<string, string>;
}
export interface Profile {
  fullName: string;
  professionalName: string;
  crn: string;
  region: string;
  email: string;
  phone: string;
  address: string;
  job: string;
  workplace: string;
  logo?: string;
  signature?: string;
}
export interface Draft {
  id: string;
  kind: string;
  payload: Patient | Profile | PrescriptionPayload;
  at: string;
}
export interface Tag {
  id: string;
  name: string;
  active: boolean;
}
export interface Food {
  name: string;
  source: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  code?: string;
  url?: string;
  measures?: { name: string; grams: number }[];
  nutrients?: Record<
    string,
    { value: number | null; unit: string; original: string }
  >;
}
export interface Meal {
  name: string;
  items: Food[];
}
export interface EnergyInput {
  protocol: string;
  sex: string;
  age: number;
  weight: number;
  height: number;
  activity: number;
  factor?: number;
  gestation?: number;
  preBmi?: number;
  lactationMonths?: number;
  lactationMode?: string;
  changeKg?: number;
  days?: number;
  coefficient?: number;
  manualEnergy?: number;
  carbsPercent: number;
  proteinPercent: number;
  fatPercent: number;
  proteinPerKg?: number;
  diabetes: boolean;
  specialCondition: boolean;
  confirmedBelowBmr: boolean;
  observation?: string;
}
export interface EnergyResult {
  input: EnergyInput;
  protocol: string;
  reference: string;
  basal: number | null;
  computed: number | null;
  finalEnergy: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  warnings: string[];
  belowBmr: boolean;
  manual: boolean;
}
export interface PrescriptionPayload {
  objective: string;
  guidance: string;
  meals: Meal[];
  patientId?: string;
  prescriptionId?: string | null;
  energy?: EnergyResult;
}
export interface Prescription {
  id: string;
  payload: PrescriptionPayload;
  status: string;
  version: number;
  at: string;
}
export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  user: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  result: string;
}
export interface BackupStatus {
  lastBackup: string;
  stale: boolean;
  failed: boolean;
  folder: string;
}
export const emptyPatient: Patient = {
  name: "",
  socialName: "",
  cpf: "",
  phone: "",
  birth: "",
  email: "",
  address: "",
  sex: "",
  gender: "",
  notes: "",
  tags: [],
};
export const emptyProfile: Profile = {
  fullName: "",
  professionalName: "",
  crn: "",
  region: "",
  email: "",
  phone: "",
  address: "",
  job: "",
  workplace: "",
};
export const emptyPrescription: PrescriptionPayload = {
  objective: "",
  guidance: "",
  meals: [],
};
export function errorMessage(error: unknown): string {
  return typeof error === "object" && error !== null && "message" in error
    ? String(error.message)
    : "Não foi possível concluir. Tente novamente.";
}
export function api<T>(
  token: string | null,
  command: Record<string, unknown>,
): Promise<T> {
  return invoke<T>("operate", { request: { token, command } });
}
