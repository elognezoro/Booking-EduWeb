"use client";

import { useState } from "react";
import { CalendarClock, Save, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { setGameScheduleAction } from "@/app/actions/brain-sport";
import { WEEKDAYS, scheduleIsEmpty, describeSchedule, type GameSchedule } from "@/lib/games/availability";

/**
 * Éditeur des conditions de temps d'un jeu (administrateur système) :
 * période (dates), plage horaire quotidienne et jours de la semaine. Vide = aucune restriction.
 */
export function GameScheduleForm({ slug, schedule }: { slug: string; schedule: GameSchedule | null }) {
  const s = schedule ?? {};
  const active = !scheduleIsEmpty(schedule);
  const [open, setOpen] = useState(active);

  return (
    <div className="rounded-xl border border-border p-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <CalendarClock className="size-4 text-primary" /> Conditions de temps
          {active && <Badge tone="pending" className="text-[10px]">Actif</Badge>}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {active && !open && (
        <p className="mt-1.5 text-xs text-muted-foreground">{describeSchedule(schedule)}</p>
      )}

      {open && (
        <form action={setGameScheduleAction} className="mt-3 space-y-3">
          <input type="hidden" name="slug" value={slug} />

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Début de la période
              <Input type="datetime-local" name="from" defaultValue={s.from ?? ""} className="mt-1" />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Fin de la période
              <Input type="datetime-local" name="to" defaultValue={s.to ?? ""} className="mt-1" />
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Chaque jour, à partir de
              <Input type="time" name="startTime" defaultValue={s.startTime ?? ""} className="mt-1" />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              jusqu'à
              <Input type="time" name="endTime" defaultValue={s.endTime ?? ""} className="mt-1" />
            </label>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Jours autorisés (aucun coché = tous les jours)</p>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAYS.map((w) => (
                <label key={w.value} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium has-[:checked]:border-primary has-[:checked]:bg-primary-50 has-[:checked]:text-primary">
                  <input type="checkbox" name="days" value={w.value} defaultChecked={s.days?.includes(w.value)} className="size-3.5 accent-primary" />
                  {w.short}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" variant="outline"><Save className="size-4" /> Enregistrer</Button>
            <Button type="submit" name="clear" value="1" size="sm" variant="ghost" className="text-unavailable-fg"><Trash2 className="size-4" /> Effacer</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Heures en <strong>heure de Côte d'Ivoire (GMT)</strong>. En dehors des créneaux, le jeu est fermé au public ;
            l'administrateur système y garde accès pour prévisualiser.
          </p>
        </form>
      )}
    </div>
  );
}
