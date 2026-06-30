"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen, ClipboardCheck, Lightbulb, Info, TriangleAlert, Sparkles, Check,
  ChevronLeft, ChevronRight, ListChecks, FileText, Eye, EyeOff, CircleCheck,
} from "lucide-react";
import type { N1Module, N1Block, N1Lesson } from "@/lib/certel/niveau1/types";
import { lessonSpeech } from "@/lib/certel/niveau1/types";
import { AudioReader } from "./audio-reader";
import { Infographic } from "./infographics";
import { ExercisePlayer } from "./exercises";

const N1 = "var(--certel-accent, #0891B2)"; // accent du niveau (défini par .certel-level sur la page)

type Step =
  | { kind: "lesson"; lesson: N1Lesson; idx: number }
  | { kind: "eval" }
  | { kind: "case" };

/* ----------------------------- Progress (localStorage) ----------------------------- */
interface Progress { visited: string[]; evalPct: number | null }
function useProgress(slug: string) {
  const key = `certel-n1-${slug}`;
  const [progress, setProgress] = useState<Progress>({ visited: [], evalPct: null });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setProgress(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, [key]);
  const persist = useCallback((p: Progress) => {
    setProgress(p);
    try { localStorage.setItem(key, JSON.stringify(p)); } catch { /* ignore */ }
  }, [key]);
  const visit = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.visited.includes(id)) return prev;
      const next = { ...prev, visited: [...prev.visited, id] };
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [key]);
  const setEval = useCallback((pct: number) => {
    setProgress((prev) => {
      const next = { ...prev, evalPct: Math.max(prev.evalPct ?? 0, pct) };
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [key]);
  return { progress, loaded, persist, visit, setEval };
}

export function LessonPlayer({ module: mod }: { module: N1Module }) {
  const steps: Step[] = useMemo(() => {
    const s: Step[] = mod.lessons.map((lesson, idx) => ({ kind: "lesson", lesson, idx }));
    s.push({ kind: "eval" });
    if (mod.caseStudy) s.push({ kind: "case" });
    return s;
  }, [mod]);

  const [cur, setCur] = useState(0);
  const { progress, visit, setEval } = useProgress(mod.slug);
  const step = steps[cur];

  const stepId = (st: Step, i: number) => (st.kind === "lesson" ? st.lesson.id : st.kind === "eval" ? "eval" : "case");
  useEffect(() => {
    // Marque l'étape vue (les leçons & l'étude de cas comptent comme « consultées »).
    if (step.kind !== "eval") visit(stepId(step, cur));
  }, [cur, step, visit]);

  const goto = (i: number) => { setCur(Math.max(0, Math.min(steps.length - 1, i))); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  const lessonCount = mod.lessons.length;
  const doneCount = progress.visited.length + (progress.evalPct !== null ? 1 : 0);
  const totalSteps = steps.length;
  const pct = Math.round((Math.min(doneCount, totalSteps) / totalSteps) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Sommaire / navigation */}
      <aside className="lg:sticky lg:top-4 lg:h-fit">
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="px-2 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Progression</p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: N1 }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{pct}% du module</p>
          </div>
          <nav className="space-y-0.5">
            {steps.map((st, i) => {
              const id = stepId(st, i);
              const active = i === cur;
              const done = st.kind === "eval" ? progress.evalPct !== null : progress.visited.includes(id);
              const label = st.kind === "lesson" ? `${st.idx + 1}. ${st.lesson.title}` : st.kind === "eval" ? "Évaluation du module" : "Étude de cas";
              const StepIcon = st.kind === "lesson" ? BookOpen : st.kind === "eval" ? ClipboardCheck : FileText;
              return (
                <button key={i} type="button" onClick={() => goto(i)} className={`flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition ${active ? "bg-advanced-soft text-advanced-fg" : "text-foreground hover:bg-secondary"}`}>
                  <span className="mt-0.5 shrink-0">
                    {done ? <CircleCheck className="size-4 text-available-fg" /> : <StepIcon className={`size-4 ${active ? "text-advanced-fg" : "text-muted-foreground"}`} />}
                  </span>
                  <span className={`leading-snug ${active ? "font-bold" : ""}`}>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Contenu de l'étape */}
      <div className="min-w-0">
        {step.kind === "lesson" && <LessonView lesson={step.lesson} index={step.idx} total={lessonCount} />}
        {step.kind === "eval" && (
          <section>
            <header className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-advanced-fg">Évaluation du module</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Vérifiez vos acquis</h2>
              <p className="mt-1 text-sm text-muted-foreground">{mod.exercises.length} exercices variés, auto-corrigés avec explications. Seuil de réussite : 60 %.</p>
            </header>
            <ExercisePlayer exercises={mod.exercises} onComplete={setEval} />
          </section>
        )}
        {step.kind === "case" && mod.caseStudy && <CaseStudyView cs={mod.caseStudy} />}

        {/* Navigation bas de page */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <button type="button" onClick={() => goto(cur - 1)} disabled={cur === 0} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft className="size-4" /> Précédent
          </button>
          {cur < steps.length - 1 ? (
            <button type="button" onClick={() => goto(cur + 1)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: N1 }}>
              Suivant <ChevronRight className="size-4" />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-available-soft px-4 py-2 text-sm font-bold text-available-fg"><Check className="size-4" /> Fin du module</span>
          )}
        </div>
      </div>
    </div>
  );
}

function LessonView({ lesson, index, total }: { lesson: N1Lesson; index: number; total: number }) {
  return (
    <section>
      <header className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-advanced-fg">Leçon {index + 1} / {total}</p>
          <AudioReader text={lessonSpeech(lesson)} label="Écouter la leçon" />
        </div>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{lesson.title}</h2>
      </header>
      <div className="space-y-1">
        {lesson.blocks.map((b, i) => <BlockView key={i} block={b} />)}
      </div>
    </section>
  );
}

const CALLOUT: Record<string, { icon: React.ComponentType<{ className?: string }>; cls: string; iconCls: string; label: string }> = {
  info: { icon: Info, cls: "border-advanced/30 bg-advanced-soft/40", iconCls: "text-advanced-fg", label: "Info" },
  warn: { icon: TriangleAlert, cls: "border-unavailable/40 bg-unavailable-soft/40", iconCls: "text-unavailable-fg", label: "Attention" },
  tip: { icon: Lightbulb, cls: "border-available/40 bg-available-soft/40", iconCls: "text-available-fg", label: "Conseil" },
  example: { icon: Sparkles, cls: "border-advanced/30 bg-advanced-soft/40", iconCls: "text-advanced-fg", label: "Exemple" },
};

function BlockView({ block }: { block: N1Block }) {
  if (block.type === "text") {
    return <div className="my-3 text-[15px] leading-relaxed text-foreground [&_em]:italic [&_strong]:font-semibold [&_strong]:text-foreground" dangerouslySetInnerHTML={{ __html: block.html }} />;
  }
  if (block.type === "callout") {
    const c = CALLOUT[block.tone] || CALLOUT.info;
    const CIcon = c.icon;
    return (
      <div className={`my-4 flex gap-3 rounded-2xl border p-4 ${c.cls}`}>
        <CIcon className={`mt-0.5 size-5 shrink-0 ${c.iconCls}`} />
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${c.iconCls}`}>{block.title || c.label}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-foreground">{block.text}</p>
        </div>
      </div>
    );
  }
  if (block.type === "keypoints") {
    return (
      <div className="my-4 rounded-2xl border border-border bg-card p-4">
        {block.title && <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><ListChecks className="size-4" style={{ color: N1 }} /> {block.title}</p>}
        <ul className="space-y-1.5">
          {block.points.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-available-fg" /><span>{p}</span></li>)}
        </ul>
      </div>
    );
  }
  // infographic
  return <Infographic kind={block.kind} title={block.title} data={block.data} />;
}

function CaseStudyView({ cs }: { cs: NonNullable<N1Module["caseStudy"]> }) {
  const [show, setShow] = useState(false);
  return (
    <section>
      <header className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-advanced-fg">Étude de cas</p>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{cs.title}</h2>
      </header>
      <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-[15px] leading-relaxed text-foreground">{cs.scenario}</div>
      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <p className="mb-2 text-sm font-bold text-foreground">À vous de jouer</p>
        <ol className="ml-5 list-decimal space-y-1.5 text-sm text-foreground marker:font-bold marker:text-advanced-fg">
          {cs.questions.map((q, i) => <li key={i}>{q}</li>)}
        </ol>
      </div>
      <button type="button" onClick={() => setShow((s) => !s)} className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-advanced/30 bg-advanced-soft/50 px-4 py-1.5 text-sm font-bold text-advanced-fg transition hover:bg-advanced-soft">
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {show ? "Masquer le corrigé" : "Afficher le corrigé commenté"}
      </button>
      {show && (
        <div className="mt-3 space-y-2 rounded-2xl border border-available/40 bg-available-soft/30 p-4">
          {cs.corrige.map((c, i) => <p key={i} className="flex gap-2 text-sm leading-relaxed text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-available-fg" /><span>{c}</span></p>)}
        </div>
      )}
    </section>
  );
}
