"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtDateTime } from "@/lib/dates";
import type { SeatInfo } from "@/lib/booking-rules";

function defaultColumns(capacity: number) {
  if (capacity <= 12) return 4;
  if (capacity <= 25) return 5;
  if (capacity <= 36) return 6;
  return 9;
}

/**
 * Plan de salle : chaque poste est un point.
 * Vert = libre, Rouge = occupé. Survol → période d'occupation.
 * `selectable` permet de choisir des postes libres (réservation).
 */
export function SeatMap({
  seats,
  capacity,
  selectable = false,
  selected = [],
  onToggle,
  columns,
  label,
  showScreen = true,
}: {
  seats: SeatInfo[];
  capacity?: number;
  selectable?: boolean;
  selected?: number[];
  onToggle?: (n: number) => void;
  columns?: number;
  label?: string;
  showScreen?: boolean;
}) {
  const cap = capacity ?? seats.length;
  const cols = columns ?? defaultColumns(cap);
  const selectedSet = new Set(selected);

  return (
    <div className="flex w-full max-w-[420px] flex-col rounded-2xl border-2 border-primary/25 bg-card p-3 shadow-soft">
      {showScreen && (
        <div className="mb-3 flex h-7 items-center justify-center rounded-lg border border-primary/20 bg-primary-50 px-3">
          <span className="truncate text-[11px] font-bold uppercase tracking-wide text-primary-700">{label ?? "Plan de salle"}</span>
        </div>
      )}
      <div className="grid w-full gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {seats.map((s) => {
          const isSelected = selectedSet.has(s.number);
          const tip = s.occupied
            ? `Poste ${s.number} · Occupé${s.occupiedUntil ? ` jusqu'au ${fmtDateTime(s.occupiedUntil)}` : ""}`
            : isSelected
            ? `Poste ${s.number} · Sélectionné`
            : `Poste ${s.number} · Libre`;

          const clickable = selectable && !s.occupied;
          return (
            <div key={s.number} className="group relative flex items-center justify-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onToggle?.(s.number)}
                title={tip}
                aria-label={tip}
                className={cn(
                  "flex aspect-square w-full min-w-0 items-center justify-center rounded-md border transition-all",
                  s.occupied
                    ? "cursor-not-allowed border-unavailable/30 bg-unavailable-soft"
                    : isSelected
                    ? "border-primary bg-primary text-white shadow-sm"
                    : clickable
                    ? "border-available/40 bg-available-soft hover:scale-110 hover:border-available"
                    : "border-available/40 bg-available-soft"
                )}
              >
                {isSelected ? (
                  <Check className="size-3.5" />
                ) : (
                  <span className={cn("size-2.5 rounded-full", s.occupied ? "bg-unavailable" : "bg-available")} />
                )}
              </button>
              {/* Infobulle période d'occupation */}
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-lg group-hover:block">
                {tip}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-full bg-available" /> Libre</span>
      <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-full bg-unavailable" /> Occupé</span>
      <span className="text-xs italic">En survolant un poste, vous obtenez sa période d'occupation (donc à partir de quand il est disponible).</span>
    </div>
  );
}
