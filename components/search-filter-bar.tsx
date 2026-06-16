"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FilterDef {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export function SearchFilterBar({
  filters = [],
  searchPlaceholder = "Rechercher…",
  className,
}: {
  filters?: FilterDef[];
  searchPlaceholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("q") ?? "");

  const update = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  React.useEffect(() => {
    const t = setTimeout(() => {
      if ((searchParams.get("q") ?? "") !== search) update("q", search);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasActiveFilters = filters.some((f) => searchParams.get(f.name)) || search;

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Select
            key={f.name}
            value={searchParams.get(f.name) ?? ""}
            onChange={(e) => update(f.name, e.target.value)}
            className="h-10 w-auto min-w-[150px]"
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        ))}
        {hasActiveFilters && (
          <button
            onClick={() => { setSearch(""); router.replace(pathname); }}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" /> Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}
