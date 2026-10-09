import { EntryStatus } from "@/lib/types";

const STATUS_STYLES: Record<EntryStatus, string> = {
  Жаңа: "bg-gray-100 text-gray-700 border-gray-300",
  Орындалуда: "bg-amber-50 text-amber-700 border-amber-300",
  "Тексеруге жіберілді": "bg-violet-50 text-violet-700 border-violet-300",
  Тексерілді: "bg-emerald-50 text-emerald-700 border-emerald-300",
  "Қайта жасау": "bg-red-50 text-red-700 border-red-300",
};

export function StatusBadge({ status }: { status: EntryStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

const TONE_STYLES = {
  neutral: "bg-gray-100 text-gray-700 border-gray-300",
  brand: "bg-brand/10 text-brand border-brand/30",
  warning: "bg-amber-50 text-amber-700 border-amber-300",
  danger: "bg-red-50 text-red-700 border-red-300",
} as const;

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_STYLES;
}) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}
