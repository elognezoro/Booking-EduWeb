"use client";

import * as React from "react";
import { Building2, ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { switchInstitution } from "@/app/actions/admin";

// Sélecteur d'institution réservé au super administrateur : bascule le contexte de données
// (collections, domaines, utilisateurs, dépôt, réservations…) vers l'institution choisie.
// Combobox avec zone de recherche rapide (insensible aux accents).
export function InstitutionSwitcher({
  institutions,
  activeOrgId,
}: {
  institutions: { id: string; name: string; isPlatform: boolean }[];
  activeOrgId: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const orgInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (institutions.length === 0) return null;

  const active = institutions.find((i) => i.id === activeOrgId) ?? institutions.find((i) => i.isPlatform) ?? institutions[0];
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filtered = q ? institutions.filter((i) => norm(i.name).includes(norm(q))) : institutions;
  const label = (i: { name: string; isPlatform: boolean }) => (i.isPlatform ? `${i.name} · plateforme` : i.name);

  const choose = (id: string) => {
    setOpen(false);
    setQ("");
    if (orgInputRef.current) orgInputRef.current.value = id; // valeur posée AVANT la soumission
    formRef.current?.requestSubmit();
  };

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <form ref={formRef} action={switchInstitution}>
        <input ref={orgInputRef} type="hidden" name="orgId" defaultValue={activeOrgId ?? ""} />
      </form>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Institution active"
        aria-label="Institution active"
        aria-expanded={open}
        className="flex h-9 max-w-[240px] items-center gap-1.5 rounded-xl border border-input bg-secondary/50 px-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
      >
        <Building2 className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{label(active)}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une institution…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Rechercher une institution"
            />
          </div>
          <ul className="max-h-72 overflow-y-auto py-1">
            {filtered.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => choose(i.id)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
                    i.id === active.id && "bg-primary-50"
                  )}
                >
                  <span className="flex-1 truncate">{label(i)}</span>
                  {i.id === active.id && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">Aucune institution trouvée.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
