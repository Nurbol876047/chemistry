"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, User2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/catalog", title: "Тәжірибелер каталогы" },
  { prefix: "/journal", title: "Менің журналым" },
  { prefix: "/teacher", title: "Мұғалім панелі" },
  { prefix: "/safety", title: "Қауіпсіздік ережелері" },
  { prefix: "/reference", title: "Анықтамалық" },
];

function titleFor(pathname: string): string {
  const match = TITLES.find((t) => pathname.startsWith(t.prefix));
  return match?.title ?? "Жас химик зертханасы";
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, studentName, setRole } = useApp();

  const handleExit = () => {
    setRole(null);
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Мәзір"
          className="rounded-md border border-line p-1.5 md:hidden"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-base font-semibold text-ink">{titleFor(pathname)}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5 sm:flex">
          <User2 size={16} className="text-brand" />
          <span className="text-sm text-ink">{role === "teacher" ? "Мұғалім" : studentName}</span>
        </div>
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm text-ink/80 hover:bg-bg"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Шығу</span>
        </button>
      </div>
    </header>
  );
}
