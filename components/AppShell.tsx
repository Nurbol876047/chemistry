"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Sidebar, MobileDrawer } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ExperimentTopBar } from "@/components/ExperimentTopBar";
import { ExperimentBackground } from "@/components/ExperimentBackground";

// /catalog/[id] және /catalog/[id]/journal — бір тәжірибеге оқшауланған
// "ойын экраны", сондықтан онда каталог/журнал/қауіпсіздік қойындылары
// бар жалпы сайдбар көрсетілмейді, тек сол тақырыпқа қатысты мазмұн ғана.
const EXPERIMENT_FLOW_PATTERN = /^\/catalog\/[^/]+/;

export function AppShell({ children }: { children: ReactNode }) {
  const { ready, role } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (ready && !role) router.replace("/");
  }, [ready, role, router]);

  if (!ready || !role) {
    return <div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">Жүктелуде...</div>;
  }

  if (EXPERIMENT_FLOW_PATTERN.test(pathname)) {
    return (
      <div className="relative min-h-screen">
        <ExperimentBackground />
        <div className="relative z-10">
          <ExperimentTopBar />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
