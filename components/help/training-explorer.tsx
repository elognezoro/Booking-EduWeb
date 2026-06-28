"use client";

import * as React from "react";
import { Target, ListChecks, GraduationCap, ClipboardCheck } from "lucide-react";
import type { RoleTraining } from "@/lib/role-training";
import { TrainingQuiz } from "@/components/help/training-quiz";
import { cn } from "@/lib/utils";

interface TrainingEntry { key: string; label: string; color: string; training: RoleTraining }

/** Espace de formation : sélecteur de rôle (si plusieurs), modules de prise en main + auto-évaluation. */
export function TrainingExplorer({ entries }: { entries: TrainingEntry[] }) {
  const [active, setActive] = React.useState(0);
  const entry = entries[active] ?? entries[0];
  if (!entry) return null;
  const t = entry.training;

  return (
    <div className="space-y-5">
      {entries.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {entries.map((e, i) => (
            <button
              key={e.key}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                i === active ? "border-transparent text-white" : "border-border bg-card text-foreground hover:bg-secondary/60",
              )}
              style={i === active ? { backgroundColor: e.color } : undefined}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card">
        <header className="border-b border-border bg-secondary/40 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground">
            <GraduationCap className="size-5 shrink-0 text-primary" /> {t.title}
          </h2>
        </header>
        <div className="space-y-6 px-5 py-5">
          <p className="flex items-start gap-2 rounded-xl border-l-4 border-primary bg-primary-50/50 px-4 py-3 text-sm leading-relaxed text-foreground">
            <Target className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{t.intro}</span>
          </p>

          {/* Modules de prise en main */}
          <section>
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <ListChecks className="size-4 text-primary" /> Modules de prise en main
            </h3>
            <ol className="space-y-5">
              {t.modules.map((m, mi) => (
                <li key={mi}>
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">{mi + 1}</span>
                    <h4 className="font-bold text-foreground">{m.title}</h4>
                  </div>
                  <p className="mb-2 ml-9 text-xs font-medium italic text-advanced-fg">Objectif : {m.objective}</p>
                  <ol className="ml-3.5 space-y-1.5 border-l-2 border-border pl-4">
                    {m.content.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary">{i + 1}</span>
                        <span className="pt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </section>

          {/* Auto-évaluation */}
          <section>
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <ClipboardCheck className="size-4 text-primary" /> Auto-évaluation ({t.quiz.length} questions)
            </h3>
            <TrainingQuiz quiz={t.quiz} />
          </section>
        </div>
      </div>
    </div>
  );
}
