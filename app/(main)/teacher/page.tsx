"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { getExperimentById, experiments } from "@/data/experiments";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EntryStatus } from "@/lib/types";

const STATUS_FILTERS: ("Барлығы" | EntryStatus)[] = [
  "Барлығы",
  "Жаңа",
  "Орындалуда",
  "Тексеруге жіберілді",
  "Тексерілді",
  "Қайта жасау",
];

export default function TeacherPanelPage() {
  const router = useRouter();
  const { entries } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>("Барлығы");
  const [expFilter, setExpFilter] = useState<string>("Барлығы");

  const visible = useMemo(
    () =>
      entries.filter(
        (e) =>
          e.status !== "Жаңа" &&
          (statusFilter === "Барлығы" || e.status === statusFilter) &&
          (expFilter === "Барлығы" || e.experimentId === expFilter)
      ),
    [entries, statusFilter, expFilter]
  );

  const graded = entries.filter((e) => typeof e.grade === "number");
  const avgGrade =
    graded.length > 0
      ? (graded.reduce((sum, e) => sum + (e.grade ?? 0), 0) / graded.length).toFixed(1)
      : "—";
  const submittedCount = entries.filter((e) => e.status !== "Жаңа").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-xs text-muted">Тапсырылған хаттамалар</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{submittedCount}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Орташа баға</p>
          <p className="mt-1 text-2xl font-semibold text-brand">{avgGrade}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Тексеруді күтіп тұрған</p>
          <p className="mt-1 text-2xl font-semibold text-violet-700">
            {entries.filter((e) => e.status === "Тексеруге жіберілді").length}
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm text-ink"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={expFilter}
          onChange={(e) => setExpFilter(e.target.value)}
          className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm text-ink"
        >
          <option value="Барлығы">Барлық тәжірибелер</option>
          {experiments.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.title}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <Table>
          <THead>
            <TH>Оқушы</TH>
            <TH>Тәжірибе</TH>
            <TH>Күні</TH>
            <TH>Статус</TH>
            <TH>Баға</TH>
          </THead>
          <TBody>
            {visible.map((entry) => {
              const experiment = getExperimentById(entry.experimentId);
              return (
                <TR
                  key={entry.id}
                  onClick={() => router.push(`/teacher/${entry.studentId}/${entry.id}`)}
                >
                  <TD className="font-medium">{entry.studentName}</TD>
                  <TD>{experiment?.title ?? entry.experimentId}</TD>
                  <TD>{new Date(entry.updatedAt).toLocaleDateString("kk-KZ")}</TD>
                  <TD>
                    <StatusBadge status={entry.status} />
                  </TD>
                  <TD>{entry.grade !== undefined ? `${entry.grade}/10` : "—"}</TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
        {visible.length === 0 && (
          <p className="mt-3 text-sm text-muted">Таңдалған сүзгі бойынша жазба жоқ.</p>
        )}
      </Card>
    </div>
  );
}
