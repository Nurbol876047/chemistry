import { JournalEntry, Role } from "./types";

const KEYS = {
  role: "zhz_role",
  studentName: "zhz_student_name",
  entries: "zhz_entries",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadRole(): Role | null {
  if (!isBrowser()) return null;
  const value = window.localStorage.getItem(KEYS.role);
  return value === "student" || value === "teacher" ? value : null;
}

export function saveRole(role: Role | null): void {
  if (!isBrowser()) return;
  if (role) window.localStorage.setItem(KEYS.role, role);
  else window.localStorage.removeItem(KEYS.role);
}

export function loadStudentName(): string {
  if (!isBrowser()) return "Оқушы";
  return window.localStorage.getItem(KEYS.studentName) || "Айгерім Нұрланқызы";
}

export function saveStudentName(name: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEYS.studentName, name);
}

export function loadEntries(): JournalEntry[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(KEYS.entries);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

export function saveEntries(entries: JournalEntry[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEYS.entries, JSON.stringify(entries));
}
