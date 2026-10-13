"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Beaker,
  FlaskConical,
  Palette,
  Gem,
  Wind,
  PenTool,
  Egg,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { experiments } from "@/data/experiments";
import { VideoBackdrop } from "@/components/home/VideoBackdrop";
import { BlockPreviewVideo } from "@/components/home/BlockPreviewVideo";

const ICONS: Record<string, LucideIcon> = {
  "soda-vinegar": FlaskConical,
  "cabbage-indicator": Palette,
  "salt-crystals": Gem,
  "apple-oxidation": Wind,
  "invisible-ink": PenTool,
  "eggshell-vinegar": Egg,
};

const HERO_VIDEO = "/videos/lobby-bg.mp4";
const HERO_POSTER = "/videos/lobby-bg-poster.jpg";

export default function HomePage() {
  const router = useRouter();
  const { setRole, role: currentRole } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = experiments.find((e) => e.id === activeId) ?? null;

  const handlePick = (id: string) => {
    if (!currentRole) setRole("student");
    const exp = experiments.find((e) => e.id === id);
    if (exp?.elementVideo || exp?.resultVideo) {
      setActiveId(id);
    } else {
      router.push(`/catalog/${id}`);
    }
  };

  const handleDone = () => {
    if (active) router.push(`/catalog/${active.id}`);
    setActiveId(null);
  };

  const handleTeacher = () => {
    setRole("teacher");
    router.push("/teacher");
  };

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-black text-white">
      <VideoBackdrop src={HERO_VIDEO} poster={HERO_POSTER} />

      <div className="relative z-10 flex h-full flex-col justify-between gap-6 p-5 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
            <Beaker size={20} className="shrink-0 text-emerald-300" />
            <div>
              <p className="bg-gradient-to-r from-emerald-300 via-teal-200 to-lime-200 bg-clip-text text-sm font-bold text-transparent">
                Жас химик зертханасы
              </p>
              <p className="text-[11px] text-white/60">Цифрлық лабораториялық журнал</p>
            </div>
          </div>

          <button
            onClick={handleTeacher}
            className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-medium text-white/80 shadow-xl backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <Users size={16} />
            <span className="hidden sm:inline">Мұғалім үшін</span>
          </button>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg md:text-4xl">
            Тәжірибені таңдап, химияны тірідей көр
          </h1>
          <p className="mt-2 text-sm text-white/70 md:text-base">
            Төмендегі тақырыптың бірін бас — алдымен қысқа бейне, содан соң тәжірибе ашылады.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-end justify-center gap-3 md:gap-4">
          {experiments
            .filter((exp) => exp.id !== "eggshell-vinegar" && exp.id !== "cabbage-indicator")
            .map((exp) => {
            const Icon = ICONS[exp.id] ?? FlaskConical;
            return (
              <button
                key={exp.id}
                onClick={() => handlePick(exp.id)}
                className="group flex w-24 flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-3.5 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-white/20 md:w-28"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200 transition-colors group-hover:bg-emerald-400/25">
                  <Icon size={20} />
                </span>
                <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-white/85">
                  {exp.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {(active?.elementVideo || active?.resultVideo) && (
        <BlockPreviewVideo
          src={active.elementVideo ?? active.resultVideo!}
          title={active.title}
          onDone={handleDone}
        />
      )}
    </main>
  );
}
