import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, Clock, MonitorPlay, Users } from "lucide-react";

const SLOTS = [
  { time: "08:00", label: "TP Bureautique L1", tone: "available" as const, room: "Salle multimédia 1" },
  { time: "10:00", label: "Réunion coordination", tone: "pending" as const, room: "Salle de réunion APRID" },
  { time: "14:00", label: "Formation tableur", tone: "advanced" as const, room: "Salle multimédia 2" },
];

export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* halo */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary-50 via-accent to-available/10 blur-2xl" />

      <Card className="overflow-hidden shadow-glow">
        <div className="flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            <span className="font-bold">Planning du jour</span>
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">Aujourd'hui</span>
        </div>

        <div className="space-y-3 p-5">
          {SLOTS.map((s) => (
            <div key={s.time} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex w-12 shrink-0 flex-col items-center">
                <Clock className="size-4 text-muted-foreground" />
                <span className="mt-0.5 text-xs font-bold text-foreground">{s.time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{s.label}</p>
                <p className="truncate text-xs text-muted-foreground">{s.room}</p>
              </div>
              <Badge tone={s.tone} dot>
                {s.tone === "available" ? "Validée" : s.tone === "pending" ? "En attente" : "En cours"}
              </Badge>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { n: "30", l: "postes", i: MonitorPlay },
              { n: "92%", l: "occupation", i: Users },
              { n: "12", l: "demandes", i: CalendarDays },
            ].map((k) => (
              <div key={k.l} className="rounded-xl bg-secondary p-3 text-center">
                <k.i className="mx-auto size-4 text-primary" />
                <p className="mt-1 text-lg font-extrabold leading-none text-foreground">{k.n}</p>
                <p className="text-[11px] text-muted-foreground">{k.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* carte flottante : confirmation */}
      <div className="absolute -right-3 -top-5 hidden animate-float rounded-2xl border border-border bg-card p-3 shadow-card sm:flex sm:items-center sm:gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-available-soft text-available-fg">
          <CheckCircle2 className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold text-foreground">Réservation confirmée</p>
          <p className="text-[11px] text-muted-foreground">EB-CI-ENS-APRID-SM-2026</p>
        </div>
      </div>

      {/* carte flottante : disponibilité */}
      <div className="absolute -bottom-5 -left-4 hidden animate-float rounded-2xl border border-border bg-card p-3 shadow-card [animation-delay:1.5s] sm:block">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-available/60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-available" />
          </span>
          <p className="text-xs font-bold text-foreground">Salle disponible maintenant</p>
        </div>
      </div>
    </div>
  );
}
