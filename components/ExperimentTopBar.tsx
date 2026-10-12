"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Beaker, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";

/**
 * Жеке тәжірибе экранының жұқа жоғарғы жолағы — каталог/журнал/қауіпсіздік
 * сияқты бөтен бөлімдерге сілтеме жоқ, тек басты бетке оралу мен шығу.
 */
export function ExperimentTopBar() {
  const router = useRouter();
  const { setRole } = useApp();

  const handleExit = () => {
    setRole(null);
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Beaker size={20} className="text-brand" />
        <span className="text-sm font-semibold text-ink">Жас химик зертханасы</span>
      </Link>
      <div className="flex items-center gap-3">
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
