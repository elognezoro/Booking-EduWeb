"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BookingStatusBadge } from "@/components/status-badges";
import { bookingStatusMeta } from "@/lib/enums";
import { TONE_DOT, TONE_CLASSES } from "@/lib/tone";
import { cn } from "@/lib/utils";

export interface CalEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  resourceName: string;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function ymd(d: Date) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

export function CalendarView({ events }: { events: CalEvent[] }) {
  const today = new Date();
  const [cursor, setCursor] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const e of events) {
      const d = new Date(e.start);
      const key = ymd(d);
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    for (const arr of map.values()) arr.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return map;
  }, [events]);

  // Construire la grille (semaine commençant lundi)
  const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // lundi = 0
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(1 - startOffset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  const selectedEvents = selectedDay ? eventsByDay.get(ymd(selectedDay)) ?? [] : [];

  return (
    <Card>
      <CardContent className="py-5">
        {/* Barre de navigation */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </h2>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}>Aujourd'hui</Button>
            <Button variant="outline" size="icon-sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Mois précédent"><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon-sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Mois suivant"><ChevronRight className="size-4" /></Button>
          </div>
        </div>

        {/* En-têtes jours */}
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((w) => (
            <div key={w} className="pb-1 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">{w}</div>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => {
            const inMonth = d.getMonth() === cursor.getMonth();
            const isToday = ymd(d) === ymd(today);
            const dayEvents = eventsByDay.get(ymd(d)) ?? [];
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(d)}
                className={cn(
                  "flex min-h-[84px] flex-col gap-1 rounded-xl border p-1.5 text-left transition sm:min-h-[104px]",
                  inMonth ? "border-border bg-card hover:border-primary/40" : "border-transparent bg-secondary/30 text-muted-foreground/50",
                  isToday && "border-primary ring-1 ring-primary/30"
                )}
              >
                <span className={cn("text-xs font-bold", isToday ? "text-primary" : inMonth ? "text-foreground" : "text-muted-foreground/50")}>
                  {isToday ? <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">{d.getDate()}</span> : d.getDate()}
                </span>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((e) => {
                    const tone = bookingStatusMeta(e.status).tone;
                    return (
                      <span key={e.id} className={cn("flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] font-semibold", TONE_CLASSES[tone])}>
                        <span className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone])} />
                        <span className="truncate">{new Date(e.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} {e.title}</span>
                      </span>
                    );
                  })}
                  {dayEvents.length > 3 && <span className="px-1 text-[10px] font-semibold text-muted-foreground">+{dayEvents.length - 3} autre(s)</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {[["Validée", "available"], ["En attente", "pending"], ["En cours", "advanced"], ["Refusée/Annulée", "unavailable"]].map(([label, tone]) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", TONE_DOT[tone as keyof typeof TONE_DOT])} /> {label}
            </span>
          ))}
        </div>
      </CardContent>

      {/* Panneau jour */}
      <Modal
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={selectedDay?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        description={`${selectedEvents.length} réservation(s)`}
      >
        {selectedEvents.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Aucune réservation ce jour-là.</p>
        ) : (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {selectedEvents.map((e) => (
              <Link key={e.id} href={`/dashboard/bookings/${e.id}`} className="block rounded-xl border border-border p-3 hover:border-primary/40 hover:bg-muted">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-foreground">{e.title}</p>
                  <BookingStatusBadge status={e.status} />
                </div>
                <p className="text-xs text-muted-foreground">{e.resourceName}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {new Date(e.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} – {new Date(e.end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Modal>
    </Card>
  );
}
