"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar, type TopbarUser, type TopbarNotif } from "./topbar";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "eduweb_sidebar_collapsed";

export function DashboardShell({
  user,
  permissions,
  counts,
  notifications,
  unread,
  institutionSwitcher,
  children,
}: {
  user: TopbarUser;
  permissions: string[];
  counts: { pending: number; libraryReview: number; accountRequests: number };
  notifications: TopbarNotif[];
  unread: number;
  institutionSwitcher?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false); // tiroir mobile
  const [collapsed, setCollapsed] = React.useState(false); // barre repliée (desktop)
  const pathname = usePathname();

  // Restaure la préférence de repli.
  React.useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
    } catch {}
  }, []);

  // Ferme le tiroir mobile à chaque navigation.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const persistCollapsed = (next: boolean) => {
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {}
  };

  // Le bouton de la topbar : replie/déplie sur desktop, ouvre le tiroir sur mobile.
  const handleMenuClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      persistCollapsed(!collapsed);
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/40">
      <Sidebar
        permissions={permissions}
        counts={counts}
        open={open}
        collapsed={collapsed}
        onClose={() => setOpen(false)}
        onCollapse={() => persistCollapsed(true)}
        onExpand={() => persistCollapsed(false)}
      />
      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[64px]" : "lg:pl-[270px]")}>
        <Topbar user={user} notifications={notifications} unread={unread} onMenuClick={handleMenuClick} collapsed={collapsed} institutionSwitcher={institutionSwitcher} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
