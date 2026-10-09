"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, ShieldAlert, ShieldCheck } from "lucide-react";
import { experiments } from "@/data/experiments";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const TOPICS = Array.from(new Set(experiments.map((e) => e.topic)));
const DIFFICULTIES = Array.from(new Set(experiments.map((e) => e.difficulty)));

export default function CatalogPage() {
  const [topic, setTopic] = useState<string>("Барлығы");
  const [difficulty, setDifficulty] = useState<string>("Барлығы");

  const filtered = useMemo(
    () =>
      experiments.filter(
        (e) =>
          (topic === "Барлығы" || e.topic === topic) &&
          (difficulty === "Барлығы" || e.difficulty === difficulty)
      ),
    [topic, difficulty]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect label="Тақырып" value={topic} onChange={setTopic} options={["Барлығы", ...TOPICS]} />
        <FilterSelect
          label="Қиындығы"
          value={difficulty}
          onChange={setDifficulty}
          options={["Барлығы", ...DIFFICULTIES]}
        />
        <span className="text-xs text-muted">{filtered.length} тәжірибе табылды</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exp) => (
          <Card key={exp.id} className="flex flex-col">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge tone="brand">{exp.topic}</Badge>
              <Badge tone={exp.difficulty === "Жеңіл" ? "neutral" : "warning"}>{exp.difficulty}</Badge>
            </div>
            <h3 className="text-sm font-semibold text-ink">{exp.title}</h3>
            <p className="mt-1 text-xs text-muted">{exp.summary}</p>

            <div className="mt-3 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock size={13} /> {exp.durationLabel}
              </span>
              <span className="flex items-center gap-1">
                {exp.safetyLevel === "Қауіпсіз" ? (
                  <ShieldCheck size={13} className="text-emerald-600" />
                ) : (
                  <ShieldAlert size={13} className="text-amber-600" />
                )}
                {exp.safetyLevel}
              </span>
            </div>

            <ul className="mt-3 space-y-0.5 text-xs text-muted">
              {exp.materials.slice(0, 3).map((m) => (
                <li key={m} className="truncate">
                  • {m}
                </li>
              ))}
            </ul>

            <Link
              href={`/catalog/${exp.id}`}
              className="mt-4 inline-flex items-center justify-center rounded-md border border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Ашу
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm text-ink"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
