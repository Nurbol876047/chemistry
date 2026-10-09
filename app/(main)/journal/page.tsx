"use client";

import { useRouter } from "next/navigation";
import { CURRENT_STUDENT_ID, useApp } from "@/context/AppContext";
import { getExperimentById } from "@/data/experiments";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export default function MyJournalPage() {
  const router = useRouter();
  const { getEntriesForStudent } = useApp();
  const entries = getEntriesForStudent(CURRENT_STUDENT_ID).filter(
    (e) => e.status !== "Жаңа" || e.measurements.length > 0 || e.observation.notes
  );

  if (entries.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">
          Сізде толтырылған хаттама жоқ. Каталогтан тәжірибе таңдап бастаңыз.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <THead>
          <TH>Тәжірибе</TH>
          <TH>Күні</TH>
          <TH>Статус</TH>
          <TH>Баға</TH>
          <TH>Мұғалім пікірі</TH>
        </THead>
        <TBody>
          {entries.map((entry) => {
            const experiment = getExperimentById(entry.experimentId);
            return (
              <TR key={entry.id} onClick={() => router.push(`/catalog/${entry.experimentId}/journal`)}>
                <TD className="font-medium">{experiment?.title ?? entry.experimentId}</TD>
                <TD>{new Date(entry.updatedAt).toLocaleDateString("kk-KZ")}</TD>
                <TD>
                  <StatusBadge status={entry.status} />
                </TD>
                <TD>{entry.grade !== undefined ? `${entry.grade}/10` : "—"}</TD>
                <TD className="max-w-xs truncate text-muted">{entry.teacherComment || "—"}</TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </Card>
  );
}
