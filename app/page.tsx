"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Beaker, FlaskConical, ShieldCheck, NotebookText, Sparkles, GraduationCap, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Role } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const STEPS = [
  { icon: FlaskConical, title: "Тәжірибені таңда", text: "Каталогтан қауіпсіз тәжірибені таңдайсың." },
  { icon: ShieldCheck, title: "Қауіпсіздік", text: "Міндетті чек-листті толтырмай келесі қадамдар ашылмайды." },
  { icon: NotebookText, title: "Бақылау", text: "Нәтижелерді, өлшеулерді және фотоларды журналға жазасың." },
  { icon: Sparkles, title: "Талдау", text: "Жазбаларың бойынша реакцияның түсіндірмесін аласың." },
];

export default function HomePage() {
  const router = useRouter();
  const { setRole, ready, role: currentRole } = useApp();
  const [selected, setSelected] = useState<Role | null>(null);

  const handleEnter = () => {
    if (!selected) return;
    setRole(selected);
    router.push(selected === "teacher" ? "/teacher" : "/catalog");
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <Beaker size={22} className="text-brand" />
          <span className="text-base font-semibold text-ink">Жас химик зертханасы</span>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-10 px-6 py-10">
        <section className="text-center">
          <h1 className="text-2xl font-semibold text-ink md:text-3xl">
            Цифрлық лабораториялық журнал
          </h1>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-lg border border-line bg-surface p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon size={16} />
                  </span>
                  <span className="text-xs font-semibold text-muted">Қадам {idx + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-xs text-muted">{step.text}</p>
              </div>
            );
          })}
        </section>

        <section className="mx-auto w-full max-w-md rounded-lg border border-line bg-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Рөлді таңдаңыз</h2>
          <p className="mt-1 text-xs text-muted">
            {ready && currentRole
              ? "Соңғы рөліңіз сақталған. Жалғастыру үшін таңдап, бастаңыз."
              : "MVP нұсқасында нақты тіркелу жоқ — рөлді таңдап, демо профильмен кіресіз."}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelected("student")}
              className={`flex flex-col items-center gap-2 rounded-md border px-4 py-4 text-sm font-medium transition-colors ${
                selected === "student"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-line text-ink hover:border-brand/40"
              }`}
            >
              <GraduationCap size={22} />
              Оқушы
            </button>
            <button
              onClick={() => setSelected("teacher")}
              className={`flex flex-col items-center gap-2 rounded-md border px-4 py-4 text-sm font-medium transition-colors ${
                selected === "teacher"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-line text-ink hover:border-brand/40"
              }`}
            >
              <Users size={22} />
              Мұғалім
            </button>
          </div>

          <Button onClick={handleEnter} disabled={!selected} className="mt-5 w-full">
            Тәжірибені бастау
          </Button>
        </section>
      </main>

      <footer className="border-t border-line bg-surface px-6 py-4 text-center text-xs text-muted">
        Жас химик зертханасы — қазақ тіліндегі оқу платформасы (MVP)
      </footer>
    </div>
  );
}
