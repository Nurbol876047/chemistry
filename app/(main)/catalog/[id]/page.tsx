"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { getExperimentById } from "@/data/experiments";
import { mandatorySupervisionNote } from "@/data/safety";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Checklist, allItemsChecked } from "@/components/ui/Checklist";
import { Timer } from "@/components/ui/Timer";
import { Button } from "@/components/ui/Button";

export default function ProtocolPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const experiment = getExperimentById(params.id);
  const { findDraft, ensureDraft, updateEntry } = useApp();
  const draft = experiment ? findDraft(experiment.id) : undefined;

  useEffect(() => {
    if (experiment && !draft) ensureDraft(experiment.id);
  }, [experiment, draft, ensureDraft]);

  if (!experiment) {
    return (
      <Card>
        <p className="text-sm text-muted">Тәжірибе табылмады.</p>
      </Card>
    );
  }

  if (!draft) return null;

  const safetyDone = allItemsChecked(experiment.safetyChecklist, draft.safetyChecked);

  const handleMaterialsChange = (checked: Record<string, boolean>) => {
    updateEntry(draft.id, { materialsChecked: checked });
  };

  const handleSafetyChange = (checked: Record<string, boolean>) => {
    updateEntry(draft.id, { safetyChecked: checked });
  };

  const handleRegister = () => {
    if (draft.status === "Жаңа") {
      updateEntry(draft.id, { status: "Орындалуда" });
    }
    router.push(`/catalog/${experiment.id}/journal`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} /> Басты бетке оралу
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{experiment.topic}</Badge>
        <Badge>{experiment.difficulty}</Badge>
        <Badge tone={experiment.safetyLevel === "Қауіпсіз" ? "neutral" : "warning"}>
          {experiment.safetyLevel}
        </Badge>
      </div>
      <h1 className="flex items-center gap-2 text-xl font-semibold text-ink">
        <FlaskConical className="text-brand" size={22} />
        {experiment.title}
      </h1>

      <Card title="Мақсаты">
        <p className="text-sm text-ink/90">{experiment.goal}</p>
      </Card>

      <Card title="Қажетті материалдар" subtitle="Бар / жоқ екенін белгілеңіз">
        <Checklist
          items={experiment.materials}
          checked={draft.materialsChecked}
          onChange={handleMaterialsChange}
        />
      </Card>

      <Card
        title="Қауіпсіздік техникасы"
        subtitle="Барлық тармақ белгіленгенше бақылауды тіркеу қолжетімсіз болады"
      >
        <p className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {mandatorySupervisionNote}
        </p>
        <Checklist
          items={experiment.safetyChecklist}
          checked={draft.safetyChecked}
          onChange={handleSafetyChange}
        />
      </Card>

      <Card title="Жұмыс барысы" subtitle="Әр қадамды реттімен орындаңыз">
        {!safetyDone && (
          <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Қадамдармен алдын ала танысып алуға болады, бірақ тәжірибені бастамас бұрын
            қауіпсіздік чек-листін толтырыңыз.
          </p>
        )}
        <ol className="space-y-4">
          {experiment.steps.map((step, idx) => (
            <li key={step.id} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm text-ink/90">{step.text}</p>
                {step.waitSeconds && <Timer seconds={step.waitSeconds} />}
              </div>
            </li>
          ))}
        </ol>

        {experiment.resultVideo && (
          <div className="mt-6 border-t border-line pt-5">
            <h4 className="text-sm font-semibold text-ink">Нәтиже бейнесі</h4>
            <p className="mt-1 mb-3 text-xs text-muted">
              Тәжірибе дұрыс орындалғанда реакция қалай өтетінін бейнеден алдын ала көріңіз.
            </p>
            <video
              controls
              preload="metadata"
              className="w-full rounded-md border border-line bg-black"
            >
              <source src={experiment.resultVideo} type="video/mp4" />
            </video>
          </div>
        )}
      </Card>

      {experiment.reactionEquation && (
        <Card title="Реакция теңдеуі">
          <p className="font-mono text-sm text-ink">{experiment.reactionEquation}</p>
        </Card>
      )}

      <div className="flex justify-end pb-6">
        <Button onClick={handleRegister} disabled={!safetyDone}>
          Бақылауды тіркеу
        </Button>
      </div>
    </div>
  );
}
