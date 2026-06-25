"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { type Country, findCountry, sortedCountries, DEFAULT_COUNTRY } from "@/lib/certel/countries";
import { cn } from "@/lib/utils";

/** Pastille aux couleurs du drapeau (bandes verticales ou horizontales). */
export function FlagSwatch({ country, className }: { country: Country; className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/15", country.orientation === "v" ? "flex-row" : "flex-col", className)}
      style={{ width: 22, height: 15 }}
      aria-hidden
    >
      {country.colors.map((c, i) => (
        <span key={i} className="flex-1" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

interface Props {
  iso2: string;
  onIso2Change: (iso2: string) => void;
  number: string;
  onNumberChange: (n: string) => void;
  disabled?: boolean;
  inputId?: string;
}

export function CountryPhoneInput({ iso2, onIso2Change, number, onNumberChange, disabled, inputId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const current = findCountry(iso2) ?? findCountry(DEFAULT_COUNTRY)!;
  const all = React.useMemo(() => sortedCountries(), []);
  const filtered = React.useMemo(() => {
    const q = norm(query.trim());
    if (!q) return all;
    return all.filter((c) => norm(c.name).includes(q) || c.dial.includes(q) || c.iso2.toLowerCase().includes(q));
  }, [all, query]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => searchRef.current?.focus(), 30);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [open]);

  return (
    <div className="flex gap-2">
      <div className="relative" ref={wrapRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-input bg-card px-2.5 text-sm shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FlagSwatch country={current} />
          <span className="font-semibold text-foreground">{current.dial}</span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un pays…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <ul role="listbox" className="max-h-64 overflow-auto py-1">
              {filtered.map((c) => (
                <li key={c.iso2}>
                  <button
                    type="button"
                    onClick={() => { onIso2Change(c.iso2); setOpen(false); setQuery(""); }}
                    className={cn("flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm hover:bg-secondary", c.iso2 === current.iso2 && "bg-advanced-soft")}
                  >
                    <FlagSwatch country={c} />
                    <span className="flex-1 truncate text-foreground">{c.name}</span>
                    <span className="text-xs font-medium text-muted-foreground">{c.dial}</span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">Aucun pays trouvé.</li>}
            </ul>
          </div>
        )}
      </div>

      <input
        id={inputId}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        disabled={disabled}
        value={number}
        onChange={(e) => onNumberChange(e.target.value)}
        placeholder="07 00 00 00 00"
        className="flex h-10 w-full flex-1 rounded-xl border border-input bg-card px-3.5 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
