"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, PanelLeftOpen, Bell, ChevronDown, LogOut, User as UserIcon, Settings, LifeBuoy, CheckCircle2, Plus, Search } from "lucide-react";
import { Avatar } from "@/components/ui/misc";
import { RoleBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/logo";
import { logoutAction } from "@/app/actions/auth";
import { fromNow } from "@/lib/dates";
import { cn } from "@/lib/utils";

export interface TopbarUser {
  fullName: string;
  email: string;
  roles: string[];
  imageUrl: string | null;
  functionTitle: string | null;
  organizationName: string | null;
  firstName: string;
  lastName: string;
}

export interface TopbarNotif {
  id: string;
  subject: string | null;
  content: string;
  type: string;
  createdAt: string;
  read: boolean;
}

function useClickOutside(onOut: () => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOut();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOut]);
  return ref;
}

export function Topbar({
  user,
  notifications,
  unread,
  onMenuClick,
  collapsed,
  institutionSwitcher,
  title,
}: {
  user: TopbarUser;
  notifications: TopbarNotif[];
  unread: number;
  onMenuClick: () => void;
  collapsed?: boolean;
  institutionSwitcher?: React.ReactNode;
  title?: string;
}) {
  const [openNotif, setOpenNotif] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const notifRef = useClickOutside(() => setOpenNotif(false));
  const userRef = useClickOutside(() => setOpenUser(false));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      {/* Marque (mobile) — la navigation se fait par la barre d'onglets du bas */}
      <Link href="/dashboard" className="lg:hidden" aria-label="Accueil">
        <BrandLogo />
      </Link>

      {/* Bascule de la barre latérale (desktop) */}
      <button
        className="hidden rounded-xl p-2 text-foreground hover:bg-muted lg:inline-flex"
        onClick={onMenuClick}
        aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
        title={collapsed ? "Déplier le menu" : "Replier le menu"}
      >
        {collapsed ? <PanelLeftOpen className="size-5" /> : <Menu className="size-5" />}
      </button>

      {institutionSwitcher}

      <div className="hidden min-w-0 flex-1 lg:block">
        {title && <h2 className="truncate text-sm font-semibold text-muted-foreground">{title}</h2>}
      </div>

      <div className="relative hidden flex-1 lg:block lg:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Rechercher…"
          className="h-9 w-full rounded-xl border border-input bg-secondary/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5 lg:flex-none">
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/dashboard/bookings/new"><Plus className="size-4" /> Réserver</Link>
        </Button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setOpenNotif((v) => !v); setOpenUser(false); }}
            className="relative rounded-xl p-2 text-foreground hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-pending px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {openNotif && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-card animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="font-bold text-foreground">Notifications</p>
                {unread > 0 && <span className="text-xs font-semibold text-pending">{unread} non lue(s)</span>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aucune notification.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={cn("flex gap-3 border-b border-border/60 px-4 py-3 last:border-0", !n.read && "bg-primary-50/50")}>
                      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <CheckCircle2 className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{n.subject ?? "Notification"}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{n.content}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground/70">{fromNow(n.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setOpenUser((v) => !v); setOpenNotif(false); }}
            className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-muted"
          >
            <Avatar firstName={user.firstName} lastName={user.lastName} imageUrl={user.imageUrl} />
            <span className="hidden text-left sm:block">
              <span className="block max-w-[140px] truncate text-sm font-bold leading-tight text-foreground">{user.fullName}</span>
              <span className="block max-w-[140px] truncate text-xs leading-tight text-muted-foreground">{user.functionTitle ?? user.email}</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          {openUser && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-card animate-fade-in-up">
              <div className="border-b border-border px-4 py-3">
                <p className="truncate font-bold text-foreground">{user.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {user.roles.map((r) => <RoleBadge key={r} roleKey={r} />)}
                </div>
                {user.organizationName && (
                  <p className="mt-2 text-xs text-muted-foreground">🏛️ {user.organizationName}</p>
                )}
              </div>
              <div className="p-1.5">
                <MenuLink href="/dashboard/support" icon={LifeBuoy}>Support</MenuLink>
                <MenuLink href="/dashboard/help" icon={Settings}>Centre d'aide</MenuLink>
                <form action={logoutAction}>
                  <button type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-unavailable-fg hover:bg-unavailable-soft">
                    <LogOut className="size-4" /> Se déconnecter
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, icon: Icon, children }: { href: string; icon: typeof UserIcon; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
      <Icon className="size-4 text-muted-foreground" /> {children}
    </Link>
  );
}
