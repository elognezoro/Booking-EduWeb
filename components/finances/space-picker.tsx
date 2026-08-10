"use client";

import { useRouter, usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import { Select } from "@/components/ui/input";
import type { FinanceSpace } from "@/lib/finances/scope";

/**
 * Sélecteur d'espace financier (institution / sous-directions accessibles).
 * Navigue vers la même page avec `?espace=<key>` — le cloisonnement est re-vérifié côté serveur.
 */
export function SpacePicker({ spaces, current }: { spaces: FinanceSpace[]; current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  if (spaces.length <= 1) {
    return spaces.length === 1 ? (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground">
        <Building2 className="size-4 text-primary" /> {spaces[0].label}
      </span>
    ) : null;
  }
  return (
    <label className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground sm:inline-flex">
        <Building2 className="size-4 text-primary" /> Espace
      </span>
      <Select
        value={current}
        onChange={(e) => router.push(`${pathname}?espace=${encodeURIComponent(e.target.value)}`)}
        className="h-9 w-full max-w-[280px] text-sm"
        aria-label="Espace financier"
      >
        {spaces.map((s) => (
          <option key={s.key} value={s.key}>
            {`${" ".repeat(s.depth * 2)}${s.depth > 0 ? "› " : ""}${s.label}`}
          </option>
        ))}
      </Select>
    </label>
  );
}
