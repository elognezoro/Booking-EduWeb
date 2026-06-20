"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, MapPin, Building2, SearchX } from "lucide-react";

export interface InstitutionOption {
  name: string;
  slug: string;
  acronym: string | null;
  city: string | null;
  primaryColor: string | null;
}

function normalize(v: string) {
  return v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function InstitutionPicker({ institutions }: { institutions: InstitutionOption[] }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return institutions;
    return institutions.filter((i) =>
      [i.name, i.acronym ?? "", i.city ?? ""].some((f) => normalize(f).includes(q))
    );
  }, [query, institutions]);

  function go(slug: string) {
    router.push(`/login?org=${encodeURIComponent(slug)}`);
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher votre institution (nom, sigle, ville)…"
          className="h-14 w-full rounded-2xl border border-input bg-card pl-12 pr-4 text-base shadow-soft placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Rechercher une institution"
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{filtered.length} institution(s)</p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-12 text-center">
          <SearchX className="mb-3 size-8 text-muted-foreground" />
          <p className="font-semibold text-foreground">Aucune institution trouvée</p>
          <p className="text-sm text-muted-foreground">Vérifiez l'orthographe ou contactez EduWeb pour inscrire votre institution.</p>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((i) => {
            const color = i.primaryColor ?? "#064B3A";
            return (
              <li key={i.slug}>
                <button
                  type="button"
                  onClick={() => go(i.slug)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                >
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold"
                    style={{ backgroundColor: `${color}1a`, color }}
                  >
                    {i.acronym ?? <Building2 className="size-6" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-foreground">{i.name}</span>
                    {i.city && (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" /> {i.city}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
