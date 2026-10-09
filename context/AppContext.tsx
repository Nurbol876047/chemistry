"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EntryStatus, JournalEntry, Role } from "@/lib/types";
import {
  loadEntries,
  loadRole,
  loadStudentName,
  saveEntries,
  saveRole,
  saveStudentName,
} from "@/lib/storage";
import { demoJournalEntries } from "@/data/demoJournal";

export const CURRENT_STUDENT_ID = "me";

interface AppContextValue {
  ready: boolean;
  role: Role | null;
  studentName: string;
  entries: JournalEntry[];
  setRole: (role: Role | null) => void;
  setStudentName: (name: string) => void;
  findDraft: (experimentId: string) => JournalEntry | undefined;
  ensureDraft: (experimentId: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
  updateEntry: (
    id: string,
    patch: Partial<JournalEntry> | ((prev: JournalEntry) => Partial<JournalEntry>)
  ) => void;
  getEntriesForStudent: (studentId: string) => JournalEntry[];
}

const AppContext = createContext<AppContextValue | null>(null);

function emptyEntry(experimentId: string, studentId: string, studentName: string): JournalEntry {
  const now = new Date().toISOString();
  return {
    id: `${studentId}-${experimentId}-${Date.now()}`,
    experimentId,
    studentId,
    studentName,
    createdAt: now,
    updatedAt: now,
    materialsChecked: {},
    safetyChecked: {},
    observation: {
      notes: "",
      colorChange: "",
      gasReleased: false,
      temperatureChange: "",
      time: "",
    },
    measurements: [],
    photos: [],
    status: "Жаңа",
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [role, setRoleState] = useState<Role | null>(null);
  const [studentName, setStudentNameState] = useState("Айгерім Нұрланқызы");
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // One-time hydration from localStorage (an external system) on mount.
    const storedEntries = loadEntries();
    const seeded =
      storedEntries.length > 0 ? storedEntries : demoJournalEntries;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoleState(loadRole());
    setStudentNameState(loadStudentName());
    setEntries(seeded);
    if (storedEntries.length === 0) saveEntries(seeded);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveEntries(entries);
  }, [ready, entries]);

  const setRole = useCallback((next: Role | null) => {
    setRoleState(next);
    saveRole(next);
  }, []);

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name);
    saveStudentName(name);
  }, []);

  const findDraft = useCallback(
    (experimentId: string) =>
      entries.find(
        (e) =>
          e.experimentId === experimentId &&
          e.studentId === CURRENT_STUDENT_ID &&
          e.status !== "Тексерілді"
      ),
    [entries]
  );

  const ensureDraft = useCallback(
    (experimentId: string) => {
      setEntries((prev) => {
        const alreadyThere = prev.some(
          (e) =>
            e.experimentId === experimentId &&
            e.studentId === CURRENT_STUDENT_ID &&
            e.status !== "Тексерілді"
        );
        if (alreadyThere) return prev;
        return [...prev, emptyEntry(experimentId, CURRENT_STUDENT_ID, studentName)];
      });
    },
    [studentName]
  );

  const getEntryById = useCallback(
    (id: string) => entries.find((e) => e.id === id),
    [entries]
  );

  const updateEntry = useCallback(
    (
      id: string,
      patch: Partial<JournalEntry> | ((prev: JournalEntry) => Partial<JournalEntry>)
    ) => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          const resolved = typeof patch === "function" ? patch(e) : patch;
          return { ...e, ...resolved, updatedAt: new Date().toISOString() };
        })
      );
    },
    []
  );

  const getEntriesForStudent = useCallback(
    (studentId: string) => entries.filter((e) => e.studentId === studentId),
    [entries]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      role,
      studentName,
      entries,
      setRole,
      setStudentName,
      findDraft,
      ensureDraft,
      getEntryById,
      updateEntry,
      getEntriesForStudent,
    }),
    [
      ready,
      role,
      studentName,
      entries,
      setRole,
      setStudentName,
      findDraft,
      ensureDraft,
      getEntryById,
      updateEntry,
      getEntriesForStudent,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export const STATUS_ORDER: EntryStatus[] = [
  "Жаңа",
  "Орындалуда",
  "Тексеруге жіберілді",
  "Тексерілді",
  "Қайта жасау",
];
