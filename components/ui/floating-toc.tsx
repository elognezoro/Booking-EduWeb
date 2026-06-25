"use client";

import * as React from "react";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Table des matières flottante (bouton rond) pour les pages à plusieurs sections.
 * Ouvre la liste des sections, met en évidence la section active (scroll-spy) et y saute au clic.
 * Chaque `id` doit correspondre à l'attribut `id` d'une section de la page.
 */
export function FloatingToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(items[0]?.id ?? null);

  // Surbrillance de la section visible.
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  // Fermeture à la touche Échap.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    setOpen(false);
  };

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 print:hidden">
      {open && (
        <>
          {/* clic en dehors pour fermer */}
          <button aria-hidden tabIndex={-1} className="fixed inset-0 -z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute bottom-16 left-0 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-card animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Sur cette page</p>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Fermer">
                <X className="size-4" />
              </button>
            </div>
            <nav className="no-scrollbar max-h-[60vh] overflow-y-auto p-1.5">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => go(it.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    active === it.id ? "bg-primary-50 font-semibold text-primary" : "font-medium text-foreground hover:bg-muted"
                  )}
                >
                  <span className={cn("size-1.5 shrink-0 rounded-full", active === it.id ? "bg-primary" : "bg-border")} />
                  <span className="truncate">{it.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Table des matières"
        aria-expanded={open}
        className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow ring-1 ring-white/10 transition hover:brightness-110"
      >
        {open ? <X className="size-5" /> : <List className="size-5" />}
      </button>
    </div>
  );
}
