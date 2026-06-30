"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, ListChecks, FolderGit2, Timer, Award, CheckCircle2, ChevronLeft, ChevronRight, Scale, Target } from "lucide-react";
import type { CertelEvaluation, EvalDeliverable } from "@/lib/certel/evaluation/types";
import { AudioReader } from "./audio-reader";
import { ExercisePlayer } from "./exercises";

const ACCENT = "var(--certel-accent, #0891B2)";

type StepKind = "intro" | "exam" | "projet" | "situation";
const STEPS: { kind: StepKind; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { kind: "intro", label: "Présentation", icon: ClipboardList },
  { kind: "exam", label: "Examen de connaissances", icon: ListChecks },
  { kind: "projet", label: "Projet de synthèse", icon: FolderGit2 },
  { kind: "situation", label: "Mise en situation", icon: Timer },
];

export function EvaluationPlayer({ evaluation, certHref }: { evaluation: CertelEvaluation; certHref: string }) {
  const [cur, setCur] = useState(0);
  const [examPct, setExamPct] = useState<number | null>(null);
  const step = STEPS[cur];
  const goto = (i: number) => { setCur(Math.max(0, Math.min(STEPS.length - 1, i))); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-4 lg:h-fit">
        <div className="rounded-2xl border border-border bg-card p-3">
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Évaluation</p>
          <nav className="space-y-0.5">
            {STEPS.map((s, i) => {
              const active = i === cur;
              const done = s.kind === "exam" && examPct !== null;
              const Icon = s.icon;
              return (
                <button key={s.kind} type="button" onClick={() => goto(i)} className={`flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition ${active ? "bg-advanced-soft text-advanced-fg" : "text-foreground hover:bg-secondary"}`}>
                  <span className="mt-0.5 shrink-0">{done ? <CheckCircle2 className="size-4 text-available-fg" /> : <Icon className={`size-4 ${active ? "text-advanced-fg" : "text-muted-foreground"}`} />}</span>
                  <span className={`leading-snug ${active ? "font-bold" : ""}`}>{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0">
        {step.kind === "intro" && <IntroView evaluation={evaluation} />}
        {step.kind === "exam" && (
          <section>
            <header className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-advanced-fg">Examen de connaissances</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">QCM certifiant</h2>
              <p className="mt-1 text-sm text-muted-foreground">{evaluation.quiz.length} questions variées, auto-corrigées. Seuil de réussite indicatif : 60 %.</p>
            </header>
            <ExercisePlayer exercises={evaluation.quiz} onComplete={setExamPct} />
            {examPct !== null && examPct >= 60 && (
              <div className="mt-5 rounded-2xl border border-available/40 bg-available-soft/40 p-5 text-center">
                <Award className="mx-auto size-8 text-available-fg" />
                <p className="mt-2 font-extrabold text-foreground">Examen de connaissances réussi ({examPct} %)</p>
                <p className="mt-1 text-sm text-muted-foreground">Après validation du projet et de la mise en situation par le jury, votre certificat pourra être édité.</p>
                <Link href={certHref} className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}><Award className="size-4" /> Voir mon certificat</Link>
              </div>
            )}
          </section>
        )}
        {step.kind === "projet" && <DeliverableView d={evaluation.projet} kicker="Livrable — 30 %" />}
        {step.kind === "situation" && <DeliverableView d={evaluation.miseEnSituation} kicker="Mise en situation pratique" />}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <button type="button" onClick={() => goto(cur - 1)} disabled={cur === 0} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /> Précédent</button>
          {cur < STEPS.length - 1 ? (
            <button type="button" onClick={() => goto(cur + 1)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: ACCENT }}>Suivant <ChevronRight className="size-4" /></button>
          ) : (
            <Link href={certHref} className="inline-flex items-center gap-1.5 rounded-full bg-advanced px-4 py-2 text-sm font-bold text-white"><Award className="size-4" /> Mon certificat</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function IntroView({ evaluation }: { evaluation: CertelEvaluation }) {
  return (
    <section>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-advanced-fg">Cadre général</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Comment se déroule la certification</h2>
        </div>
        <AudioReader text={evaluation.intro.replace(/<[^>]+>/g, " ")} label="Écouter" />
      </header>
      <div className="text-[15px] leading-relaxed text-foreground [&_em]:italic [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: evaluation.intro }} />

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="px-4 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>Architecture de notation</div>
        <table className="w-full text-sm">
          <tbody>
            {evaluation.notation.map((n, i) => (
              <tr key={i} className="border-t border-border first:border-t-0">
                <td className="px-4 py-2 font-semibold text-foreground">{n.part}</td>
                <td className="px-4 py-2 text-right font-extrabold" style={{ color: ACCENT, whiteSpace: "nowrap" }}>{n.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2.5 rounded-2xl border border-available/40 bg-available-soft/40 p-4">
        <Scale className="mt-0.5 size-5 shrink-0 text-available-fg" />
        <div><p className="text-xs font-bold uppercase tracking-wide text-available-fg">Seuil de certification</p><p className="mt-0.5 text-sm text-foreground">{evaluation.seuil}</p></div>
      </div>

      {evaluation.competences.length > 0 && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Target className="size-4" style={{ color: ACCENT }} /> Compétences évaluées</h3>
          <ul className="space-y-1.5">
            {evaluation.competences.map((c, i) => <li key={i} className="flex gap-2 text-sm text-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-available-fg" /><span>{c}</span></li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function DeliverableView({ d, kicker }: { d: EvalDeliverable; kicker: string }) {
  const speech = `${d.title}. ${d.brief.replace(/<[^>]+>/g, " ")}. ${d.consignes.join(". ")}`;
  return (
    <section>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-advanced-fg">{kicker}</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{d.title}</h2>
          {d.duree && <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground"><Timer className="size-3.5" /> {d.duree}</p>}
        </div>
        <AudioReader text={speech} label="Écouter la consigne" />
      </header>
      <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-[15px] leading-relaxed text-foreground [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: d.brief }} />

      {d.consignes.length > 0 && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-bold text-foreground">Travail attendu</p>
          <ol className="ml-5 list-decimal space-y-1.5 text-sm text-foreground marker:font-bold marker:text-advanced-fg">
            {d.consignes.map((c, i) => <li key={i}>{c}</li>)}
          </ol>
        </div>
      )}

      {d.bareme.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="px-4 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>Barème</div>
          <table className="w-full text-sm">
            <tbody>
              {d.bareme.map((b, i) => (
                <tr key={i} className="border-t border-border first:border-t-0">
                  <td className="px-4 py-2 text-foreground">{b.critere}</td>
                  <td className="px-4 py-2 text-right font-bold" style={{ color: ACCENT, whiteSpace: "nowrap" }}>{b.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
