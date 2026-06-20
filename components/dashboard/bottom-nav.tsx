"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck2,
  ClipboardCheck,
  Library,
  Brain,
  Plus,
  BookUp,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Slot {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  match?: (p: string) => boolean;
}

/**
 * Barre d'onglets inférieure type application mobile native :
 * Accueil · 2 onglets adaptés au rôle · bouton d'action central (FAB) · Menu.
 * Visible uniquement sous `lg` ; remplace la navigation principale sur mobile.
 */
export function BottomNav({
  permissions,
  counts,
  onMenuClick,
}: {
  permissions: string[];
  counts: { pending: number; libraryReview: number; accountRequests: number };
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const perms = new Set(permissions);
  const has = (p: string | string[]) => (Array.isArray(p) ? p : [p]).some((x) => perms.has(x));

  // Action centrale (FAB), adaptée au rôle.
  const fab: Slot = has("bookings.create")
    ? { label: "Réserver", href: "/dashboard/bookings/new", icon: Plus }
    : has("documents.create")
    ? { label: "Déposer", href: "/dashboard/library/deposit", icon: BookUp }
    : { label: "Jouer", href: "/dashboard/sport-cerebral", icon: Brain };

  // Onglets candidats (par permission), pour remplir les 2 emplacements du milieu.
  const candidates: Slot[] = [];
  if (has("calendar.read")) candidates.push({ label: "Calendrier", href: "/dashboard/calendar", icon: CalendarDays });
  if (has("bookings.validate")) candidates.push({ label: "À valider", href: "/dashboard/bookings/pending", icon: ClipboardCheck, badge: counts.pending });
  if (has("bookings.read_own")) candidates.push({ label: "Mes résa.", href: "/dashboard/bookings/my", icon: CalendarCheck2 });
  if (has("documents.read")) candidates.push({ label: "Biblio", href: "/dashboard/library", icon: Library, match: (p) => p.startsWith("/dashboard/library") });
  candidates.push({ label: "Jouer", href: "/dashboard/sport-cerebral", icon: Brain });

  const mids = candidates.filter((c) => c.href !== fab.href).slice(0, 2);

  const home: Slot = { label: "Accueil", href: "/dashboard", icon: LayoutDashboard, match: (p) => p === "/dashboard" };
  const left = [home, mids[0]].filter(Boolean) as Slot[];
  const right = [mids[1]].filter(Boolean) as Slot[];

  const active = (s: Slot) => (s.match ? s.match(pathname) : pathname === s.href || pathname.startsWith(s.href + "/"));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 pb-safe backdrop-blur-xl lg:hidden">
      <div className="relative mx-auto flex h-16 max-w-md items-stretch justify-between px-1">
        <div className="flex flex-1 items-stretch justify-around">
          {left.map((s) => <Tab key={s.href} slot={s} active={active(s)} />)}
        </div>

        {/* Bouton d'action central (FAB), légèrement surélevé. */}
        <div className="flex w-16 shrink-0 items-start justify-center">
          <Link
            href={fab.href}
            aria-label={fab.label}
            className="-mt-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow ring-4 ring-background transition-transform active:scale-95"
          >
            <fab.icon className="size-6" />
          </Link>
        </div>

        <div className="flex flex-1 items-stretch justify-around">
          {right.map((s) => <Tab key={s.href} slot={s} active={active(s)} />)}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex w-full flex-col items-center justify-center gap-0.5 text-muted-foreground transition-colors active:text-foreground"
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-[22px]" />
            <span className="text-[10px] font-semibold leading-none">Menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Tab({ slot, active }: { slot: Slot; active: boolean }) {
  return (
    <Link
      href={slot.href}
      className={cn(
        "relative flex w-full flex-col items-center justify-center gap-0.5 transition-colors",
        active ? "text-primary" : "text-muted-foreground active:text-foreground",
      )}
    >
      <span className="relative">
        <slot.icon className={cn("size-[22px]", active && "[stroke-width:2.4]")} />
        {slot.badge ? (
          <span className="absolute -right-2 -top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-pending px-1 text-[9px] font-bold text-white">
            {slot.badge}
          </span>
        ) : null}
      </span>
      <span className="text-[10px] font-semibold leading-none">{slot.label}</span>
      {active && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-primary" />}
    </Link>
  );
}
