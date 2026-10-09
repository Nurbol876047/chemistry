"use client";

import { Check } from "lucide-react";

interface ChecklistProps {
  items: string[];
  checked: Record<string, boolean>;
  onChange: (checked: Record<string, boolean>) => void;
  disabled?: boolean;
}

export function Checklist({ items, checked, onChange, disabled }: ChecklistProps) {
  const toggle = (idx: number) => {
    if (disabled) return;
    const key = String(idx);
    onChange({ ...checked, [key]: !checked[key] });
  };

  return (
    <ul className="space-y-2">
      {items.map((item, idx) => {
        const key = String(idx);
        const isChecked = Boolean(checked[key]);
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => toggle(idx)}
              disabled={disabled}
              className={`flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                isChecked
                  ? "border-brand/40 bg-brand/5"
                  : "border-line bg-surface hover:border-brand/30"
              } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  isChecked ? "border-brand bg-brand text-white" : "border-line bg-surface"
                }`}
              >
                {isChecked && <Check size={12} strokeWidth={3} />}
              </span>
              <span className={isChecked ? "text-ink" : "text-ink/90"}>{item}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function allItemsChecked(items: string[], checked: Record<string, boolean>): boolean {
  return items.every((_, idx) => checked[String(idx)]);
}
