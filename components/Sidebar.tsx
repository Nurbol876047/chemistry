"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  NotebookText,
  ShieldCheck,
  BookMarked,
  Users,
  Beaker,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const STUDENT_NAV: NavItem[] = [
  { href: "/catalog", label: "Каталог", icon: FlaskConical },
  { href: "/journal", label: "Журналым", icon: NotebookText },
  { href: "/safety", label: "Қауіпсіздік", icon: ShieldCheck },
  { href: "/reference", label: "Анықтамалық", icon: BookMarked },
];

const TEACHER_NAV: NavItem[] = [
  { href: "/teacher", label: "Сынып", icon: Users },
  { href: "/safety", label: "Қауіпсіздік", icon: ShieldCheck },
  { href: "/reference", label: "Анықтамалық", icon: BookMarked },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useApp();
  const items = role === "teacher" ? TEACHER_NAV : STUDENT_NAV;

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-brand/10 text-brand" : "text-ink/80 hover:bg-bg hover:text-ink"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
      <Link href="/" className="flex items-center gap-2 border-b border-line px-5 py-4">
        <Beaker size={20} className="text-brand" />
        <span className="text-sm font-semibold text-ink">Жас химик зертханасы</span>
      </Link>
      <NavLinks />
    </aside>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <div className="flex items-center gap-2">
            <Beaker size={20} className="text-brand" />
            <span className="text-sm font-semibold text-ink">Жас химик</span>
          </div>
          <button onClick={onClose} aria-label="Жабу" className="rounded-md p-1 hover:bg-bg">
            <X size={18} />
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
      </div>
    </div>
  );
}
