"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Building2, ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FinanceSpace } from "@/lib/finances/scope";

/**
 * Sélecteur d'espace financier (institution / sous-directions accessibles) avec
 * zone de recherche rapide (insensible aux accents). Navigue vers la même page
 * avec `?espace=<key>` — le cloisonnement est re-vérifié côté serveur.
 */
export function SpacePicker({ spaces, current }: { spaces: FinanceSpace[]; current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (spaces.length <= 1) {
    return spaces.length === 1 ? (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground">
        <Building2 className="size-4 text-primary" /> {spaces[0].label}
      </span>
    ) : null;
  }

  const selected = spaces.find((s) => s.key === current);
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filtered = q ? spaces.filter((s) => norm(s.label).includes(norm(q))) : spaces;

  const choose = (key: string) => {
    setOpen(false);
    setQ("");
    router.push(`${pathname}?espace=${encodeURIComponent(key)}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground sm:inline-flex">
        <Building2 className="size-4 text-primary" /> Espace
      </span>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-64 items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 text-sm text-foreground transition-colors hover:border-primary/40"
          aria-label="Espace financier"
          aria-expanded={open}
        >
          <span className="truncate font-medium">{selected?.label ?? "Choisir un espace"}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-1 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un espace…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Rechercher un espace financier"
              />
            </div>
            <ul className="max-h-72 overflow-y-auto py-1">
              {filtered.map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => choose(s.key)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
                      s.key === current && "bg-primary-50"
                    )}
                    style={{ paddingLeft: `${12 + s.depth * 14}px` }}
                  >
                    <span className="flex-1 truncate">
                      {s.depth > 0 && <span className="text-muted-foreground">› </span>}
                      {s.label}
                    </span>
                    {s.key === current && <Check className="size-4 shrink-0 text-primary" />}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">Aucun espace trouvé.</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
