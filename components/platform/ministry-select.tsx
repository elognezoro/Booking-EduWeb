"use client";

import * as React from "react";
import { ChevronDown, Search, Check, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinistryOpt {
  id: string;
  name: string;
  acronym: string | null;
}

/** Sélecteur de ministère de tutelle avec recherche rapide (nom + sigle), insensible aux accents. */
export function MinistrySelect({
  name,
  defaultValue,
  id,
  ministries,
}: {
  name: string;
  defaultValue?: string | null;
  id?: string;
  ministries: MinistryOpt[];
}) {
  const [value, setValue] = React.useState(defaultValue || "");
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  const selected = ministries.find((m) => m.id === value);
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const label = (m: MinistryOpt) => (m.acronym ? `${m.acronym} — ${m.name}` : m.name);
  const filtered = q ? ministries.filter((m) => norm(m.name).includes(norm(q)) || norm(m.acronym || "").includes(norm(q))) : ministries;

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const choose = (v: string) => {
    setValue(v);
    setOpen(false);
    setQ("");
  };

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 text-sm text-foreground transition-colors hover:border-primary/40"
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <Landmark className="size-3.5 shrink-0 text-muted-foreground" /> <span className="truncate">{label(selected)}</span>
            </>
          ) : (
            <span className="text-muted-foreground">— Aucun —</span>
          )}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un ministère…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                onClick={() => choose("")}
                className={cn("flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-secondary", value === "" && "bg-primary-50")}
              >
                <span className="flex-1 text-muted-foreground">— Aucun —</span>
                {value === "" && <Check className="size-4 text-primary" />}
              </button>
            </li>
            {filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => choose(m.id)}
                  className={cn("flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-secondary", m.id === value && "bg-primary-50")}
                >
                  <span className="flex-1 truncate">{label(m)}</span>
                  {m.id === value && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">Aucun ministère</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
