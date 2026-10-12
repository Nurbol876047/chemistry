"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Sparkles, Loader2, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getExperimentById } from "@/data/experiments";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { AIAnalysis, JournalEntry, Measurement } from "@/lib/types";

export default function JournalFormPage() {
  const params = useParams<{ id: string }>();
  const experiment = getExperimentById(params.id);
  const { findDraft, ensureDraft, updateEntry } = useApp();
  const entry = experiment ? findDraft(experiment.id) : undefined;

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (experiment && !entry) ensureDraft(experiment.id);
  }, [experiment, entry, ensureDraft]);

  if (!experiment) {
    return (
      <Card>
        <p className="text-sm text-muted">Тәжірибе табылмады.</p>
      </Card>
    );
  }
  if (!entry) return null;

  const locked = entry.status === "Тексерілді";

  const patch = (p: Partial<JournalEntry>) => {
    updateEntry(entry.id, p);
  };

  const patchObservation = (p: Partial<JournalEntry["observation"]>) => {
    updateEntry(entry.id, (prev) => ({ observation: { ...prev.observation, ...p } }));
  };

  const addMeasurement = () => {
    const row: Measurement = { id: `m-${Date.now()}-${Math.random()}`, substance: "", result: "", value: "" };
    updateEntry(entry.id, (prev) => ({ measurements: [...prev.measurements, row] }));
  };

  const updateMeasurement = (id: string, p: Partial<Measurement>) => {
    updateEntry(entry.id, (prev) => ({
      measurements: prev.measurements.map((m) => (m.id === id ? { ...m, ...p } : m)),
    }));
  };

  const removeMeasurement = (id: string) => {
    updateEntry(entry.id, (prev) => ({
      measurements: prev.measurements.filter((m) => m.id !== id),
    }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const dataUrl = reader.result;
          updateEntry(entry.id, (prev) => ({ photos: [...prev.photos, dataUrl] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    updateEntry(entry.id, (prev) => ({ photos: prev.photos.filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    if (entry.status === "Жаңа") patch({ status: "Орындалуда" });
  };

  const handleSubmit = () => {
    patch({ status: "Тексеруге жіберілді" });
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentId: experiment.id, entry }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Талдау сәтсіз аяқталды");
      const analysis: AIAnalysis = {
        ...data.analysis,
        source: data.source,
        warning: data.warning,
        generatedAt: new Date().toISOString(),
      };
      patch({ aiAnalysis: analysis });
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Белгісіз қате");
    } finally {
      setAnalyzing(false);
    }
  };

  const chartData = experiment.hasPhChart
    ? entry.measurements
        .filter((m) => m.substance && !Number.isNaN(Number(m.value)))
        .map((m) => ({ name: m.substance, ph: Number(m.value) }))
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      <div className="space-y-3 rounded-xl border border-white/40 bg-white/85 p-4 shadow-sm backdrop-blur-md">
        <Link
          href={`/catalog/${experiment.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft size={15} /> Хаттамаға оралу
        </Link>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-ink">Бақылау журналы — {experiment.title}</h1>
          <StatusBadge status={entry.status} />
        </div>
      </div>

      {(entry.status === "Тексерілді" || entry.status === "Қайта жасау") && (
        <Card title="Мұғалім бағасы">
          <div className="flex items-center gap-4">
            {entry.grade !== undefined && (
              <span className="text-2xl font-semibold text-brand">{entry.grade}/10</span>
            )}
            <p className="text-sm text-ink/90">{entry.teacherComment || "Пікір жазылмаған."}</p>
          </div>
        </Card>
      )}

      <Card title="Не байқадыңыз?">
        <textarea
          disabled={locked}
          value={entry.observation.notes}
          onChange={(e) => patchObservation({ notes: e.target.value })}
          rows={3}
          placeholder="Тәжірибе барысында байқаған өзгерістерді жазыңыз..."
          className="w-full rounded-md border border-line bg-surface p-3 text-sm text-ink disabled:bg-bg"
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Түс өзгерісі">
            <input
              disabled={locked}
              value={entry.observation.colorChange}
              onChange={(e) => patchObservation({ colorChange: e.target.value })}
              className="w-full rounded-md border border-line bg-surface p-2 text-sm text-ink disabled:bg-bg"
            />
          </Field>
          <Field label="Температура өзгерісі">
            <input
              disabled={locked}
              value={entry.observation.temperatureChange}
              onChange={(e) => patchObservation({ temperatureChange: e.target.value })}
              className="w-full rounded-md border border-line bg-surface p-2 text-sm text-ink disabled:bg-bg"
            />
          </Field>
          <Field label="Уақыт">
            <input
              disabled={locked}
              value={entry.observation.time}
              onChange={(e) => patchObservation({ time: e.target.value })}
              placeholder="мысалы, 2 минут"
              className="w-full rounded-md border border-line bg-surface p-2 text-sm text-ink disabled:bg-bg"
            />
          </Field>
          <Field label="Газ бөлінуі">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                disabled={locked}
                checked={entry.observation.gasReleased}
                onChange={(e) => patchObservation({ gasReleased: e.target.checked })}
                className="h-4 w-4 accent-[#1F5F4A]"
              />
              Иә, газ бөлінді
            </label>
          </Field>
        </div>
      </Card>

      <Card
        title="Өлшеулер кестесі"
        actions={
          !locked && (
            <button
              onClick={addMeasurement}
              className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              <Plus size={14} /> Жол қосу
            </button>
          )
        }
      >
        {entry.measurements.length === 0 ? (
          <p className="text-sm text-muted">Жол қосылмаған.</p>
        ) : (
          <Table>
            <THead>
              <TH>Зат</TH>
              <TH>Нәтиже</TH>
              <TH>Мән</TH>
              {!locked && <TH className="w-10" />}
            </THead>
            <TBody>
              {entry.measurements.map((m) => (
                <TR key={m.id}>
                  <TD>
                    <input
                      disabled={locked}
                      value={m.substance}
                      onChange={(e) => updateMeasurement(m.id, { substance: e.target.value })}
                      className="w-full rounded border border-transparent bg-transparent p-1 text-sm focus:border-line"
                    />
                  </TD>
                  <TD>
                    <input
                      disabled={locked}
                      value={m.result}
                      onChange={(e) => updateMeasurement(m.id, { result: e.target.value })}
                      className="w-full rounded border border-transparent bg-transparent p-1 text-sm focus:border-line"
                    />
                  </TD>
                  <TD>
                    <input
                      disabled={locked}
                      value={m.value}
                      onChange={(e) => updateMeasurement(m.id, { value: e.target.value })}
                      className="w-20 rounded border border-transparent bg-transparent p-1 text-sm focus:border-line"
                    />
                  </TD>
                  {!locked && (
                    <TD>
                      <button onClick={() => removeMeasurement(m.id)} aria-label="Жою">
                        <Trash2 size={14} className="text-muted hover:text-red-600" />
                      </button>
                    </TD>
                  )}
                </TR>
              ))}
            </TBody>
          </Table>
        )}

        {experiment.hasPhChart && chartData.length > 0 && (
          <div className="mt-4 h-56">
            <p className="mb-2 text-xs font-medium text-muted">pH шкаласы бойынша график</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E5E9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 14]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="ph" fill="#1F5F4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card title="Фотолар">
        {!locked && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="mb-3 text-sm text-ink"
          />
        )}
        {entry.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {entry.photos.map((photo, idx) => (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-md border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="h-full w-full object-cover" />
                {!locked && (
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        title="Талдау"
        subtitle="Жазбаларыңыз негізінде ИИ түсіндірме береді"
        actions={
          <Button onClick={handleAnalyze} disabled={analyzing} variant="secondary">
            {analyzing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            Талдау алу
          </Button>
        }
      >
        {analysisError && <p className="text-sm text-red-600">{analysisError}</p>}
        {!entry.aiAnalysis && !analysisError && (
          <p className="text-sm text-muted">Талдау алу үшін жоғарыдағы батырманы басыңыз.</p>
        )}
        {entry.aiAnalysis && (
          <div className="space-y-3">
            {entry.aiAnalysis.warning && (
              <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {entry.aiAnalysis.warning}
              </p>
            )}
            <AnalysisBlock title="1. Не болды" text={entry.aiAnalysis.whatHappened} />
            <AnalysisBlock title="2. Химиялық түсіндірме" text={entry.aiAnalysis.explanation} />
            <AnalysisBlock title="3. Нәтижелерді бағалау" text={entry.aiAnalysis.evaluation} />
            <AnalysisBlock title="4. Қорытынды жазу үлгісі" text={entry.aiAnalysis.conclusionTemplate} />
          </div>
        )}
      </Card>

      {!locked && (
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleSave}>
            Сақтау
          </Button>
          <Button onClick={handleSubmit}>Мұғалімге жіберу</Button>
        </div>
      )}
      {!locked && entry.status === "Тексеруге жіберілді" && (
        <p className="text-right text-xs text-muted">Журнал мұғалімге жіберілді, тексеруін күтіңіз.</p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

function AnalysisBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border border-line bg-bg p-3">
      <h4 className="mb-1 text-xs font-semibold text-brand">{title}</h4>
      <p className="text-sm text-ink/90">{text}</p>
    </div>
  );
}
