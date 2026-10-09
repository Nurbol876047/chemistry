"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getExperimentById } from "@/data/experiments";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export default function TeacherEntryPage() {
  const params = useParams<{ studentId: string; entryId: string }>();
  const router = useRouter();
  const { getEntryById, updateEntry } = useApp();
  const entry = getEntryById(params.entryId);

  const [grade, setGrade] = useState<string>("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (entry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGrade(entry.grade !== undefined ? String(entry.grade) : "");
      setComment(entry.teacherComment ?? "");
    }
  }, [entry]);

  if (!entry) {
    return (
      <Card>
        <p className="text-sm text-muted">Жазба табылмады.</p>
      </Card>
    );
  }

  const experiment = getExperimentById(entry.experimentId);

  const handleDecision = (status: "Тексерілді" | "Қайта жасау") => {
    const gradeNum = grade ? Math.min(10, Math.max(1, Number(grade))) : undefined;
    updateEntry(entry.id, { status, grade: gradeNum, teacherComment: comment });
    router.push("/teacher");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      <Link href="/teacher" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} /> Сыныпқа оралу
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">{entry.studentName}</h1>
          <p className="text-sm text-muted">{experiment?.title ?? entry.experimentId}</p>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      <Card title="Бақылау жазбалары">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Не байқады</dt>
            <dd className="text-ink/90">{entry.observation.notes || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Түс өзгерісі</dt>
            <dd className="text-ink/90">{entry.observation.colorChange || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Газ бөлінуі</dt>
            <dd className="text-ink/90">{entry.observation.gasReleased ? "Иә" : "Жоқ"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Температура</dt>
            <dd className="text-ink/90">{entry.observation.temperatureChange || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Уақыт</dt>
            <dd className="text-ink/90">{entry.observation.time || "—"}</dd>
          </div>
        </dl>
      </Card>

      {entry.measurements.length > 0 && (
        <Card title="Өлшеулер">
          <Table>
            <THead>
              <TH>Зат</TH>
              <TH>Нәтиже</TH>
              <TH>Мән</TH>
            </THead>
            <TBody>
              {entry.measurements.map((m) => (
                <TR key={m.id}>
                  <TD>{m.substance}</TD>
                  <TD>{m.result}</TD>
                  <TD>{m.value}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      {entry.photos.length > 0 && (
        <Card title="Фотолар">
          <div className="grid grid-cols-4 gap-2">
            {entry.photos.map((photo, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={idx} src={photo} alt="" className="aspect-square rounded-md border border-line object-cover" />
            ))}
          </div>
        </Card>
      )}

      {entry.aiAnalysis && (
        <Card title="ИИ талдауы">
          <div className="space-y-2 text-sm text-ink/90">
            <p>
              <span className="font-semibold text-brand">Не болды: </span>
              {entry.aiAnalysis.whatHappened}
            </p>
            <p>
              <span className="font-semibold text-brand">Түсіндірме: </span>
              {entry.aiAnalysis.explanation}
            </p>
            <p>
              <span className="font-semibold text-brand">Бағалау: </span>
              {entry.aiAnalysis.evaluation}
            </p>
          </div>
        </Card>
      )}

      <Card title="Мұғалім бағасы">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Баға (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-24 rounded-md border border-line bg-surface p-2 text-sm text-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Пікір</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-line bg-surface p-2 text-sm text-ink"
              placeholder="Оқушыға пікір жазыңыз..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="danger" onClick={() => handleDecision("Қайта жасау")}>
              Қайта жасау
            </Button>
            <Button onClick={() => handleDecision("Тексерілді")}>Тексерілді деп белгілеу</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
