"use client";

import * as React from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { COUNTRIES, type Country } from "@/lib/countries";
import { cn } from "@/lib/utils";

/** Drapeau en image (les emoji-drapeaux ne s'affichent pas sous Windows → on utilise des SVG). */
function Flag({ code, className }: { code: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
      alt=""
      width={24}
      height={16}
      loading="lazy"
      className={cn("h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-border", className)}
    />
  );
}

/** Liste déroulante de pays (ONU) avec recherche rapide et drapeaux. Stocke le nom du pays dans un champ caché. */
export function CountrySelect({
  name,
  defaultValue,
  id,
  onSelect,
}: {
  name: string;
  defaultValue?: string;
  id?: string;
  onSelect?: (c: Country) => void;
}) {
  const [value, setValue] = React.useState(defaultValue || "");
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  const selected = COUNTRIES.find((c) => c.name === value);
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filtered = q ? COUNTRIES.filter((c) => norm(c.name).includes(norm(q))) : COUNTRIES;

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const choose = (c: Country) => {
    setValue(c.name);
    setOpen(false);
    setQ("");
    onSelect?.(c);
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
              <Flag code={selected.code} /> {selected.name}
            </>
          ) : (
            <span className="text-muted-foreground">Choisir un pays…</span>
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
              placeholder="Rechercher un pays…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">Aucun pays</li>
            ) : (
              filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => choose(c)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
                      c.name === value && "bg-primary-50"
                    )}
                  >
                    <Flag code={c.code} />
                    <span className="flex-1 truncate">{c.name}</span>
                    {c.name === value && <Check className="size-4 text-primary" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
