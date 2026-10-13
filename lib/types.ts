export type Role = "student" | "teacher";

export type EntryStatus =
  | "Жаңа"
  | "Орындалуда"
  | "Тексеруге жіберілді"
  | "Тексерілді"
  | "Қайта жасау";

export type Difficulty = "Жеңіл" | "Орташа";

export type Element = "су" | "от" | "жер" | "ауа";

export type SafetyLevel = "Қауіпсіз" | "Ересектің қатысуымен";

export interface ExperimentStep {
  id: string;
  text: string;
  waitSeconds?: number;
}

export interface Experiment {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  durationLabel: string;
  safetyLevel: SafetyLevel;
  summary: string;
  goal: string;
  materials: string[];
  safetyChecklist: string[];
  steps: ExperimentStep[];
  reactionEquation?: string;
  expectedResult: string;
  resultVideo?: string;
  elementVideo?: string;
  element?: Element;
  elementNote?: string;
  hasPhChart?: boolean;
  phPresetSubstances?: string[];
}

export interface Measurement {
  id: string;
  substance: string;
  result: string;
  value: string;
}

export interface ObservationData {
  notes: string;
  colorChange: string;
  gasReleased: boolean;
  temperatureChange: string;
  time: string;
}

export interface AIAnalysis {
  whatHappened: string;
  explanation: string;
  evaluation: string;
  conclusionTemplate: string;
  source: "gemini" | "fallback";
  warning?: string;
  generatedAt: string;
}

export interface JournalEntry {
  id: string;
  experimentId: string;
  studentId: string;
  studentName: string;
  createdAt: string;
  updatedAt: string;
  materialsChecked: Record<string, boolean>;
  safetyChecked: Record<string, boolean>;
  observation: ObservationData;
  measurements: Measurement[];
  photos: string[];
  status: EntryStatus;
  grade?: number;
  teacherComment?: string;
  aiAnalysis?: AIAnalysis;
}
