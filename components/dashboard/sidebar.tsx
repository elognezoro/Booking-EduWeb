"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { NAV_SECTIONS, type NavItem } from "./nav-config";
import { cn } from "@/lib/utils";

function isVisible(item: NavItem, perms: Set<string>) {
  if (!item.permission) return true;
  const list = Array.isArray(item.permission) ? item.permission : [item.permission];
  return list.some((p) => perms.has(p));
}

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function Sidebar({
  permissions,
  counts,
  open,
  collapsed,
  onClose,
  onCollapse,
  onExpand,
}: {
  permissions: string[];
  counts: { pending: number; libraryReview: number; accountRequests: number };
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onCollapse: () => void;
  onExpand: () => void;
}) {
  const pathname = usePathname();
  const perms = new Set(permissions);

  const sections = NAV_SECTIONS.map((s) => ({
    ...s,
    items: s.items.filter((i) => isVisible(i, perms)),
  })).filter((s) => s.items.length > 0);

  const badgeFor = (item: NavItem) =>
    item.badge === "pending" ? counts.pending
    : item.badge === "libraryReview" ? counts.libraryReview
    : item.badge === "accountRequests" ? counts.accountRequests
    : 0;
  const sectionBadge = (items: NavItem[]) => items.reduce((n, i) => n + badgeFor(i), 0);

  // Catégorie contenant la page courante (ouverte par défaut / mise en avant dans le rail).
  const activeTitle =
    sections.find((s) => s.items.some((i) => isActive(pathname, i)))?.title ?? sections[0]?.title ?? null;

  const [openSection, setOpenSection] = useState<string | null>(activeTitle);

  // Lors d'une navigation, garde ouverte la catégorie de la nouvelle page.
  useEffect(() => {
    if (activeTitle) setOpenSection(activeTitle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Depuis le rail replié : ouvre une catégorie et déplie la barre.
  const openFromRail = (title: string | null) => {
    setOpenSection(title);
    onExpand();
  };

  return (
    <>
      {/* overlay mobile */}
      {open && <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col overflow-hidden bg-primary text-primary-foreground transition-[width,transform] duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[64px]" : "lg:w-[270px]"
        )}
      >
        {/* ───────────── Mode complet (mobile + desktop déplié) ───────────── */}
        <div className={cn("flex min-h-0 flex-1 flex-col", collapsed && "lg:hidden")}>
          <div className="flex h-16 items-center justify-between px-5">
            <Link href="/dashboard" onClick={onClose}>
              <BrandLogo theme="dark" />
            </Link>
            <button
              className="hidden rounded-lg p-1.5 text-primary-foreground/70 hover:bg-white/10 hover:text-white lg:inline-flex"
              onClick={onCollapse}
              aria-label="Replier le menu"
              title="Replier le menu"
            >
              <PanelLeftClose className="size-5" />
            </button>
            <button className="rounded-lg p-1.5 text-primary-foreground/70 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Fermer">
              <X className="size-5" />
            </button>
          </div>

          <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-3">
            {sections.map((section) => {
              const title = section.title;
              const isOpen = title ? openSection === title : true;
              const badge = sectionBadge(section.items);
              return (
                <div key={title ?? "section"}>
                  {title && (
                    <button
                      type="button"
                      onClick={() => setOpenSection((cur) => (cur === title ? null : title))}
                      aria-expanded={isOpen}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors",
                        isOpen
                          ? "text-primary-foreground/70"
                          : "text-primary-foreground/45 hover:bg-white/5 hover:text-primary-foreground/70"
                      )}
                    >
                      <span className="flex-1 text-left">{title}</span>
                      {!isOpen && badge > 0 && (
                        <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-pending px-1 text-[10px] font-bold text-white">
                          {badge}
                        </span>
                      )}
                      <ChevronDown className={cn("size-3.5 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>
                  )}

                  <div
                    aria-hidden={!isOpen}
                    className={cn(
                      "grid transition-all duration-200 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <ul className="space-y-0.5 overflow-hidden pt-0.5">
                      {section.items.map((item) => {
                        const active = isActive(pathname, item);
                        const b = badgeFor(item);
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              tabIndex={isOpen ? undefined : -1}
                              className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                                active ? "bg-white/15 text-white shadow-sm" : "text-primary-foreground/75 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              <item.icon className={cn("size-[18px] shrink-0", active ? "text-white" : "text-primary-foreground/70 group-hover:text-white")} />
                              <span className="flex-1 truncate">{item.label}</span>
                              {b > 0 && (
                                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-pending px-1.5 text-[11px] font-bold text-white">
                                  {b}
                                </span>
                              )}
                              {active && <span className="size-1.5 rounded-full bg-available" />}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <Link
              href="/dashboard/bookings/new"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl bg-available px-3 py-2.5 text-sm font-bold text-white shadow-soft transition hover:brightness-95"
            >
              + Nouvelle réservation
            </Link>
          </div>
        </div>

        {/* ───────────── Mode rail (desktop replié) : catégories par icônes ───────────── */}
        <div className={cn("min-h-0 flex-1 flex-col items-center", collapsed ? "hidden lg:flex" : "hidden")}>
          <div className="flex h-16 w-full items-center justify-center">
            <Link href="/dashboard" title="EduWeb Booking">
              <BrandLogo variant="mark" theme="dark" />
            </Link>
          </div>
          <button
            onClick={onExpand}
            aria-label="Déplier le menu"
            title="Déplier le menu"
            className="mb-1 flex size-10 items-center justify-center rounded-xl text-primary-foreground/70 hover:bg-white/10 hover:text-white"
          >
            <PanelLeftOpen className="size-5" />
          </button>

          <nav className="no-scrollbar flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto px-2 py-2">
            {sections.map((section) => {
              const active = section.title === activeTitle;
              const badge = sectionBadge(section.items);
              return (
                <button
                  key={section.title ?? "section"}
                  onClick={() => openFromRail(section.title ?? null)}
                  aria-label={section.title}
                  title={section.title}
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-xl transition-colors",
                    active ? "bg-white/15 text-white" : "text-primary-foreground/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <section.icon className="size-5" />
                  {badge > 0 && (
                    <span className="absolute right-1.5 top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-pending px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="w-full p-2">
            <Link
              href="/dashboard/bookings/new"
              aria-label="Nouvelle réservation"
              title="Nouvelle réservation"
              className="flex h-11 items-center justify-center rounded-xl bg-available text-white shadow-soft transition hover:brightness-95"
            >
              <Plus className="size-5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
