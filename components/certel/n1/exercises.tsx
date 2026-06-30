"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X, RotateCcw, ChevronUp, ChevronDown, Lightbulb, CircleHelp, Trophy, Send } from "lucide-react";
import type { N1Exercise } from "@/lib/certel/niveau1/types";
import { AudioReader } from "./audio-reader";

const N1 = "var(--certel-accent, #0891B2)"; // accent du niveau (défini par .certel-level sur la page)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sameSet = (a: number[], b: number[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

const KIND_LABEL: Record<N1Exercise["kind"], string> = {
  qcm: "Choix multiple", truefalse: "Vrai / Faux", categorize: "Catégorisation", order: "Ordonnancement", match: "Association",
};

interface BodyState { hasAnswer: boolean; correct: boolean }
interface BodyProps<E> { ex: E; revealed: boolean; onState: (s: BodyState) => void }

/* ----------------------------- Carte d'exercice ----------------------------- */
/**
 * `immediateFeedback` (formatif) : bouton « Vérifier » par question → correction immédiate + « Réessayer ».
 * Sinon (sommatif/différé) : pas de bouton ; la correction n'apparaît que si le parent passe `forceRevealed`
 * (à la fin de l'examen), et seulement si `showFeedback` est vrai.
 */
export function ExerciseCard({
  exercise, index, immediateFeedback = true, forceRevealed = false, showFeedback = true, onResult, onStateChange,
}: {
  exercise: N1Exercise;
  index: number;
  immediateFeedback?: boolean;
  forceRevealed?: boolean;
  showFeedback?: boolean;
  onResult?: (correct: boolean) => void;
  onStateChange?: (s: BodyState) => void;
}) {
  const [localChecked, setLocalChecked] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [st, setSt] = useState<BodyState>({ hasAnswer: false, correct: false });
  const revealed = immediateFeedback ? localChecked : forceRevealed;

  // Remonte l'état courant au parent (utilisé en mode différé pour le score et le compte de réponses).
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;
  useEffect(() => { onStateChangeRef.current?.(st); }, [st]);

  // Remonte le résultat une seule fois lors de la révélation.
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const reported = useRef(false);
  useEffect(() => {
    if (revealed && !reported.current) { reported.current = true; onResultRef.current?.(st.correct); }
    if (!revealed) reported.current = false;
  }, [revealed, st.correct]);

  const retry = () => { setLocalChecked(false); setResetKey((k) => k + 1); setSt({ hasAnswer: false, correct: false }); };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ backgroundColor: N1 }}>{index + 1}</span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-advanced-fg">{KIND_LABEL[exercise.kind]}</p>
            <p className="font-bold text-foreground">{exercise.title}</p>
          </div>
        </div>
        <AudioReader text={`${exercise.instruction} ${exercise.kind === "truefalse" ? exercise.statement : ""}`} label="" />
      </div>
      <p className="mb-4 text-sm text-foreground">{exercise.instruction}</p>

      <div key={resetKey}>
        {exercise.kind === "qcm" && <Qcm ex={exercise} revealed={revealed} onState={setSt} />}
        {exercise.kind === "truefalse" && <TrueFalse ex={exercise} revealed={revealed} onState={setSt} />}
        {exercise.kind === "categorize" && <Categorize ex={exercise} revealed={revealed} onState={setSt} />}
        {exercise.kind === "order" && <Order ex={exercise} revealed={revealed} onState={setSt} />}
        {exercise.kind === "match" && <Match ex={exercise} revealed={revealed} onState={setSt} />}
      </div>

      {immediateFeedback && (revealed
        ? <RetryBtn onClick={retry} />
        : <CheckBtn disabled={!st.hasAnswer} onClick={() => setLocalChecked(true)} />)}

      {revealed && showFeedback && (
        <div className={`mt-4 rounded-xl border p-3.5 text-sm ${st.correct ? "border-available/40 bg-available-soft/50" : "border-pending/40 bg-pending-soft/50"}`}>
          <p className={`flex items-center gap-1.5 font-bold ${st.correct ? "text-available-fg" : "text-pending-fg"}`}>
            {st.correct ? <Check className="size-4" /> : <CircleHelp className="size-4" />}
            {st.correct ? "Bonne réponse !" : "À revoir"}
          </p>
          <p className="mt-1 flex gap-1.5 text-foreground"><Lightbulb className="mt-0.5 size-4 shrink-0 text-pending-fg" /><span>{exercise.feedback}</span></p>
        </div>
      )}
    </div>
  );
}

function CheckBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-advanced px-4 py-1.5 text-sm font-bold text-white transition hover:bg-advanced/90 disabled:cursor-not-allowed disabled:opacity-40">
      <Check className="size-4" /> Vérifier
    </button>
  );
}
function RetryBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
      <RotateCcw className="size-4" /> Réessayer
    </button>
  );
}

function Qcm({ ex, revealed, onState }: BodyProps<Extract<N1Exercise, { kind: "qcm" }>>) {
  const opts = useMemo(() => shuffle(ex.options.map((o, i) => ({ ...o, i }))), [ex]);
  const correctIdx = useMemo(() => opts.map((o, di) => (o.correct ? di : -1)).filter((x) => x >= 0), [opts]);
  const [sel, setSel] = useState<number[]>([]);
  const multiple = !!ex.multiple;
  useEffect(() => onState({ hasAnswer: sel.length > 0, correct: sameSet(sel, correctIdx) }), [sel, correctIdx, onState]);
  const toggle = (di: number) => {
    if (revealed) return;
    setSel((s) => (multiple ? (s.includes(di) ? s.filter((x) => x !== di) : [...s, di]) : [di]));
  };
  return (
    <div className="space-y-2">
      {multiple && <p className="text-xs italic text-muted-foreground">Plusieurs réponses possibles.</p>}
      {opts.map((o, di) => {
        const picked = sel.includes(di);
        let cls = "border-border bg-card hover:bg-secondary/60";
        if (revealed) {
          if (o.correct) cls = "border-available/50 bg-available-soft/50";
          else if (picked) cls = "border-unavailable/50 bg-unavailable-soft/50";
          else cls = "border-border opacity-60";
        } else if (picked) cls = "border-advanced bg-advanced-soft/60";
        return (
          <button key={di} type="button" onClick={() => toggle(di)} disabled={revealed} className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${cls}`}>
            <span className={`inline-flex size-5 shrink-0 items-center justify-center ${multiple ? "rounded-md" : "rounded-full"} border ${picked || (revealed && o.correct) ? "border-transparent text-white" : "border-muted-foreground/40"}`} style={picked || (revealed && o.correct) ? { backgroundColor: revealed ? (o.correct ? "#16A34A" : "#DC2626") : N1 } : undefined}>
              {(revealed && o.correct) || picked ? (revealed && !o.correct && picked ? <X className="size-3.5" /> : <Check className="size-3.5" />) : null}
            </span>
            <span className="text-foreground">{o.text}</span>
          </button>
        );
      })}
    </div>
  );
}

function TrueFalse({ ex, revealed, onState }: BodyProps<Extract<N1Exercise, { kind: "truefalse" }>>) {
  const [val, setVal] = useState<boolean | null>(null);
  useEffect(() => onState({ hasAnswer: val !== null, correct: val === ex.answer }), [val, ex.answer, onState]);
  return (
    <div>
      <p className="mb-3 rounded-xl bg-secondary/50 px-3.5 py-2.5 text-sm font-medium text-foreground">« {ex.statement} »</p>
      <div className="flex gap-2">
        {[true, false].map((b) => {
          const picked = val === b;
          let cls = "border-border bg-card hover:bg-secondary/60";
          if (revealed) {
            if (b === ex.answer) cls = "border-available/50 bg-available-soft/50 text-available-fg";
            else if (picked) cls = "border-unavailable/50 bg-unavailable-soft/50 text-unavailable-fg";
          } else if (picked) cls = "border-advanced bg-advanced-soft/60";
          return (
            <button key={String(b)} type="button" disabled={revealed} onClick={() => setVal(b)} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${cls}`}>
              {b ? "Vrai" : "Faux"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Categorize({ ex, revealed, onState }: BodyProps<Extract<N1Exercise, { kind: "categorize" }>>) {
  const items = useMemo(() => shuffle(ex.items), [ex]);
  const [place, setPlace] = useState<Record<string, string>>({});
  useEffect(() => onState({
    hasAnswer: Object.keys(place).length === items.length,
    correct: items.every((it) => place[it.label] === it.category),
  }), [place, items, onState]);
  const assign = (label: string, cat: string) => { if (!revealed) setPlace((p) => ({ ...p, [label]: cat })); };
  return (
    <div className="space-y-2.5">
      {items.map((it) => {
        const ok = place[it.label] === it.category;
        return (
          <div key={it.label} className={`rounded-xl border p-3 ${revealed ? (ok ? "border-available/50 bg-available-soft/40" : "border-unavailable/50 bg-unavailable-soft/40") : "border-border bg-card"}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{it.label}</span>
              {revealed && (ok ? <Check className="size-4 text-available-fg" /> : <span className="text-xs font-semibold text-unavailable-fg">→ {it.category}</span>)}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ex.categories.map((cat) => {
                const picked = place[it.label] === cat;
                return (
                  <button key={cat} type="button" disabled={revealed} onClick={() => assign(it.label, cat)} className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${picked ? "border-transparent text-white" : "border-border text-muted-foreground hover:bg-secondary"}`} style={picked ? { backgroundColor: N1 } : undefined}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Order({ ex, revealed, onState }: BodyProps<Extract<N1Exercise, { kind: "order" }>>) {
  // Mélange garanti différent de l'ordre correct.
  const initial = useMemo(() => {
    if (ex.items.length < 2) return ex.items;
    let s = shuffle(ex.items);
    let guard = 0;
    while (s.join("|") === ex.items.join("|") && guard++ < 20) s = shuffle(ex.items);
    return s;
  }, [ex]);
  const [list, setList] = useState<string[]>(initial);
  useEffect(() => onState({ hasAnswer: true, correct: list.join("|") === ex.items.join("|") }), [list, ex.items, onState]);
  const move = (i: number, dir: -1 | 1) => {
    if (revealed) return;
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  };
  return (
    <div className="space-y-2">
      {list.map((it, i) => {
        const ok = revealed && it === ex.items[i];
        const bad = revealed && it !== ex.items[i];
        return (
          <div key={it} className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${ok ? "border-available/50 bg-available-soft/40" : bad ? "border-unavailable/50 bg-unavailable-soft/40" : "border-border bg-card"}`}>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">{i + 1}</span>
            <span className="flex-1 text-sm text-foreground">{it}</span>
            {!revealed ? (
              <span className="flex flex-col">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-advanced disabled:opacity-30"><ChevronUp className="size-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-muted-foreground hover:text-advanced disabled:opacity-30"><ChevronDown className="size-4" /></button>
              </span>
            ) : ok ? <Check className="size-4 text-available-fg" /> : <X className="size-4 text-unavailable-fg" />}
          </div>
        );
      })}
    </div>
  );
}

function Match({ ex, revealed, onState }: BodyProps<Extract<N1Exercise, { kind: "match" }>>) {
  const rights = useMemo(() => shuffle(ex.pairs.map((p) => p.right)), [ex]);
  const [pick, setPick] = useState<Record<string, string>>({});
  useEffect(() => onState({
    hasAnswer: Object.keys(pick).length === ex.pairs.length,
    correct: ex.pairs.every((p) => pick[p.left] === p.right),
  }), [pick, ex.pairs, onState]);
  return (
    <div className="space-y-2">
      {ex.pairs.map((p) => {
        const ok = pick[p.left] === p.right;
        return (
          <div key={p.left} className={`flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center ${revealed ? (ok ? "border-available/50 bg-available-soft/40" : "border-unavailable/50 bg-unavailable-soft/40") : "border-border bg-card"}`}>
            <span className="flex-1 text-sm font-medium text-foreground">{p.left}</span>
            <select
              value={pick[p.left] ?? ""}
              disabled={revealed}
              onChange={(e) => setPick((m) => ({ ...m, [p.left]: e.target.value }))}
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-advanced/40 disabled:opacity-70 sm:w-64"
            >
              <option value="" disabled>Choisir…</option>
              {rights.map((r, idx) => <option key={`r-${idx}`} value={r}>{r}</option>)}
            </select>
            {revealed && (ok ? <Check className="size-4 text-available-fg" /> : <span className="text-xs font-semibold text-unavailable-fg">→ {p.right}</span>)}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- Player ----------------------------- */
/**
 * `immediateFeedback` (formatif, défaut) : chaque question se vérifie indépendamment.
 * Sinon (sommatif) : on répond à tout puis « Terminer » ; les bonnes réponses ne sont révélées qu'à la fin,
 * et uniquement si `revealAtEnd` est vrai (sinon seul le score est affiché).
 */
export function ExercisePlayer({ exercises, onComplete, immediateFeedback = true, revealAtEnd = true }: {
  exercises: N1Exercise[];
  onComplete?: (pct: number) => void;
  immediateFeedback?: boolean;
  revealAtEnd?: boolean;
}) {
  const deferred = !immediateFeedback;
  const total = exercises.length;

  const [results, setResults] = useState<Record<string, boolean>>({}); // mode formatif
  const [states, setStates] = useState<Record<string, BodyState>>({}); // mode sommatif
  const [finished, setFinished] = useState(false);

  const doneF = Object.keys(results).length;
  const scoreF = Object.values(results).filter(Boolean).length;
  const answeredCount = Object.values(states).filter((s) => s.hasAnswer).length;
  const scoreD = Object.values(states).filter((s) => s.correct).length;

  const score = deferred ? scoreD : scoreF;
  const finishedAll = deferred ? finished : doneF === total;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const progressDone = deferred ? (finished ? total : answeredCount) : doneF;

  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    if (!deferred && doneF === total && total > 0) onCompleteRef.current?.(pct);
  }, [deferred, doneF, total, pct]);

  const finish = () => {
    setFinished(true);
    onCompleteRef.current?.(total ? Math.round((scoreD / total) * 100) : 0);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-2 z-10 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-soft backdrop-blur">
        <Trophy className="size-5" style={{ color: N1 }} />
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{deferred && !finished ? `Répondu : ${progressDone}/${total}` : `Progression : ${progressDone}/${total}`}</span>
            {(!deferred || finished) && <span>{score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""}</span>}
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full transition-all" style={{ width: `${total ? (progressDone / total) * 100 : 0}%`, backgroundColor: N1 }} />
          </div>
        </div>
        {finishedAll && total > 0 && (
          <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${pct >= 60 ? "bg-available-soft text-available-fg" : "bg-pending-soft text-pending-fg"}`}>{pct}%</span>
        )}
      </div>

      {exercises.map((ex, i) => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          index={i}
          immediateFeedback={!deferred}
          forceRevealed={deferred && finished}
          showFeedback={deferred ? revealAtEnd : true}
          onResult={!deferred ? (c) => setResults((r) => ({ ...r, [ex.id]: c })) : undefined}
          onStateChange={deferred ? (s) => setStates((st) => ({ ...st, [ex.id]: s })) : undefined}
        />
      ))}

      {deferred && !finished && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-sm text-muted-foreground">{answeredCount < total ? `Répondez aux ${total} questions, puis terminez pour découvrir vos résultats.` : "Vous avez répondu à toutes les questions."}</p>
          <button type="button" disabled={answeredCount < total} onClick={finish} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40" style={{ backgroundColor: N1 }}>
            <Send className="size-4" /> Terminer l'examen
          </button>
        </div>
      )}

      {finishedAll && total > 0 && (
        <div className={`rounded-2xl border p-5 text-center ${pct >= 60 ? "border-available/40 bg-available-soft/40" : "border-pending/40 bg-pending-soft/40"}`}>
          <Trophy className={`mx-auto size-8 ${pct >= 60 ? "text-available-fg" : "text-pending-fg"}`} />
          <p className="mt-2 text-lg font-extrabold text-foreground">{deferred ? "Examen terminé" : "Évaluation terminée"} — {pct}%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {pct >= 60 ? "Le seuil de réussite (60 %) est atteint." : "Le seuil de réussite est de 60 %. Reprenez les questions à revoir, puis réessayez."}
            {deferred && !revealAtEnd && " Les bonnes réponses ne sont pas affichées pour cette évaluation."}
          </p>
        </div>
      )}
    </div>
  );
}
