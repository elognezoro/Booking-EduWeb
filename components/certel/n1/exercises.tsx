"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X, RotateCcw, ChevronUp, ChevronDown, Lightbulb, CircleHelp, Trophy } from "lucide-react";
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

/* ----------------------------- Carte d'exercice ----------------------------- */
export function ExerciseCard({ exercise, index, onResult }: { exercise: N1Exercise; index: number; onResult?: (correct: boolean) => void }) {
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  // resetKey force le remontage du corps interactif au « Réessayer ».
  const [resetKey, setResetKey] = useState(0);
  const [answered, setAnswered] = useState(false);

  const submit = (isCorrect: boolean) => {
    setCorrect(isCorrect);
    setChecked(true);
    onResult?.(isCorrect);
  };
  const retry = () => { setChecked(false); setAnswered(false); setResetKey((k) => k + 1); };

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
        {exercise.kind === "qcm" && <Qcm ex={exercise} checked={checked} onAnswered={setAnswered} onSubmit={submit} />}
        {exercise.kind === "truefalse" && <TrueFalse ex={exercise} checked={checked} onAnswered={setAnswered} onSubmit={submit} />}
        {exercise.kind === "categorize" && <Categorize ex={exercise} checked={checked} onAnswered={setAnswered} onSubmit={submit} />}
        {exercise.kind === "order" && <Order ex={exercise} checked={checked} onAnswered={setAnswered} onSubmit={submit} />}
        {exercise.kind === "match" && <Match ex={exercise} checked={checked} onAnswered={setAnswered} onSubmit={submit} />}
      </div>

      {checked && (
        <div className={`mt-4 rounded-xl border p-3.5 text-sm ${correct ? "border-available/40 bg-available-soft/50" : "border-pending/40 bg-pending-soft/50"}`}>
          <p className={`flex items-center gap-1.5 font-bold ${correct ? "text-available-fg" : "text-pending-fg"}`}>
            {correct ? <Check className="size-4" /> : <CircleHelp className="size-4" />}
            {correct ? "Bonne réponse !" : "À revoir"}
          </p>
          <p className="mt-1 flex gap-1.5 text-foreground"><Lightbulb className="mt-0.5 size-4 shrink-0 text-pending-fg" /><span>{exercise.feedback}</span></p>
        </div>
      )}
    </div>
  );
}

interface BodyProps<E> { ex: E; checked: boolean; onAnswered: (v: boolean) => void; onSubmit: (correct: boolean) => void }

function CheckBtn({ disabled, onClick, checked }: { disabled: boolean; onClick: () => void; checked: boolean }) {
  if (checked) return null;
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

function Qcm({ ex, checked, onAnswered, onSubmit }: BodyProps<Extract<N1Exercise, { kind: "qcm" }>>) {
  const opts = useMemo(() => shuffle(ex.options.map((o, i) => ({ ...o, i }))), [ex]);
  const correctIdx = opts.map((o, di) => (o.correct ? di : -1)).filter((x) => x >= 0);
  const [sel, setSel] = useState<number[]>([]);
  const multiple = !!ex.multiple;
  useEffect(() => onAnswered(sel.length > 0), [sel, onAnswered]);
  const toggle = (di: number) => {
    if (checked) return;
    setSel((s) => (multiple ? (s.includes(di) ? s.filter((x) => x !== di) : [...s, di]) : [di]));
  };
  return (
    <div className="space-y-2">
      {multiple && <p className="text-xs italic text-muted-foreground">Plusieurs réponses possibles.</p>}
      {opts.map((o, di) => {
        const picked = sel.includes(di);
        let cls = "border-border bg-card hover:bg-secondary/60";
        if (checked) {
          if (o.correct) cls = "border-available/50 bg-available-soft/50";
          else if (picked) cls = "border-unavailable/50 bg-unavailable-soft/50";
          else cls = "border-border opacity-60";
        } else if (picked) cls = "border-advanced bg-advanced-soft/60";
        return (
          <button key={di} type="button" onClick={() => toggle(di)} disabled={checked} className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${cls}`}>
            <span className={`inline-flex size-5 shrink-0 items-center justify-center ${multiple ? "rounded-md" : "rounded-full"} border ${picked || (checked && o.correct) ? "border-transparent text-white" : "border-muted-foreground/40"}`} style={picked || (checked && o.correct) ? { backgroundColor: checked ? (o.correct ? "#16A34A" : "#DC2626") : N1 } : undefined}>
              {(checked && o.correct) || picked ? (checked && !o.correct && picked ? <X className="size-3.5" /> : <Check className="size-3.5" />) : null}
            </span>
            <span className="text-foreground">{o.text}</span>
          </button>
        );
      })}
      {!checked ? <CheckBtn disabled={sel.length === 0} checked={checked} onClick={() => onSubmit(sameSet(sel, correctIdx))} /> : <RetryBtn onClick={() => { setSel([]); onAnswered(false); }} />}
    </div>
  );
}

function TrueFalse({ ex, checked, onAnswered, onSubmit }: BodyProps<Extract<N1Exercise, { kind: "truefalse" }>>) {
  const [val, setVal] = useState<boolean | null>(null);
  useEffect(() => onAnswered(val !== null), [val, onAnswered]);
  return (
    <div>
      <p className="mb-3 rounded-xl bg-secondary/50 px-3.5 py-2.5 text-sm font-medium text-foreground">« {ex.statement} »</p>
      <div className="flex gap-2">
        {[true, false].map((b) => {
          const picked = val === b;
          let cls = "border-border bg-card hover:bg-secondary/60";
          if (checked) {
            if (b === ex.answer) cls = "border-available/50 bg-available-soft/50 text-available-fg";
            else if (picked) cls = "border-unavailable/50 bg-unavailable-soft/50 text-unavailable-fg";
          } else if (picked) cls = "border-advanced bg-advanced-soft/60";
          return (
            <button key={String(b)} type="button" disabled={checked} onClick={() => setVal(b)} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${cls}`}>
              {b ? "Vrai" : "Faux"}
            </button>
          );
        })}
      </div>
      {!checked ? <CheckBtn disabled={val === null} checked={checked} onClick={() => onSubmit(val === ex.answer)} /> : <RetryBtn onClick={() => { setVal(null); onAnswered(false); }} />}
    </div>
  );
}

function Categorize({ ex, checked, onAnswered, onSubmit }: BodyProps<Extract<N1Exercise, { kind: "categorize" }>>) {
  const items = useMemo(() => shuffle(ex.items), [ex]);
  const [place, setPlace] = useState<Record<string, string>>({});
  useEffect(() => onAnswered(Object.keys(place).length === items.length), [place, items.length, onAnswered]);
  const assign = (label: string, cat: string) => { if (!checked) setPlace((p) => ({ ...p, [label]: cat })); };
  return (
    <div className="space-y-2.5">
      {items.map((it) => {
        const ok = place[it.label] === it.category;
        return (
          <div key={it.label} className={`rounded-xl border p-3 ${checked ? (ok ? "border-available/50 bg-available-soft/40" : "border-unavailable/50 bg-unavailable-soft/40") : "border-border bg-card"}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{it.label}</span>
              {checked && (ok ? <Check className="size-4 text-available-fg" /> : <span className="text-xs font-semibold text-unavailable-fg">→ {it.category}</span>)}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ex.categories.map((cat) => {
                const picked = place[it.label] === cat;
                return (
                  <button key={cat} type="button" disabled={checked} onClick={() => assign(it.label, cat)} className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${picked ? "border-transparent text-white" : "border-border text-muted-foreground hover:bg-secondary"}`} style={picked ? { backgroundColor: N1 } : undefined}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {!checked ? (
        <CheckBtn disabled={Object.keys(place).length !== items.length} checked={checked} onClick={() => onSubmit(items.every((it) => place[it.label] === it.category))} />
      ) : <RetryBtn onClick={() => { setPlace({}); onAnswered(false); }} />}
    </div>
  );
}

function Order({ ex, checked, onAnswered, onSubmit }: BodyProps<Extract<N1Exercise, { kind: "order" }>>) {
  // Mélange garanti différent de l'ordre correct (recalculé à chaque « Réessayer »).
  const freshOrder = () => {
    if (ex.items.length < 2) return ex.items;
    let s = shuffle(ex.items);
    let guard = 0;
    while (s.join("|") === ex.items.join("|") && guard++ < 20) s = shuffle(ex.items);
    return s;
  };
  const initial = useMemo(() => freshOrder(), [ex]); // eslint-disable-line react-hooks/exhaustive-deps
  const [list, setList] = useState<string[]>(initial);
  useEffect(() => onAnswered(true), [onAnswered]);
  const move = (i: number, dir: -1 | 1) => {
    if (checked) return;
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  };
  return (
    <div className="space-y-2">
      {list.map((it, i) => {
        const ok = checked && it === ex.items[i];
        const bad = checked && it !== ex.items[i];
        return (
          <div key={it} className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${ok ? "border-available/50 bg-available-soft/40" : bad ? "border-unavailable/50 bg-unavailable-soft/40" : "border-border bg-card"}`}>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">{i + 1}</span>
            <span className="flex-1 text-sm text-foreground">{it}</span>
            {!checked ? (
              <span className="flex flex-col">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-advanced disabled:opacity-30"><ChevronUp className="size-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-muted-foreground hover:text-advanced disabled:opacity-30"><ChevronDown className="size-4" /></button>
              </span>
            ) : ok ? <Check className="size-4 text-available-fg" /> : <X className="size-4 text-unavailable-fg" />}
          </div>
        );
      })}
      {!checked ? <CheckBtn disabled={false} checked={checked} onClick={() => onSubmit(list.join("|") === ex.items.join("|"))} /> : <RetryBtn onClick={() => { setList(freshOrder()); }} />}
    </div>
  );
}

function Match({ ex, checked, onAnswered, onSubmit }: BodyProps<Extract<N1Exercise, { kind: "match" }>>) {
  const rights = useMemo(() => shuffle(ex.pairs.map((p) => p.right)), [ex]);
  const [pick, setPick] = useState<Record<string, string>>({});
  useEffect(() => onAnswered(Object.keys(pick).length === ex.pairs.length), [pick, ex.pairs.length, onAnswered]);
  return (
    <div className="space-y-2">
      {ex.pairs.map((p) => {
        const ok = pick[p.left] === p.right;
        return (
          <div key={p.left} className={`flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center ${checked ? (ok ? "border-available/50 bg-available-soft/40" : "border-unavailable/50 bg-unavailable-soft/40") : "border-border bg-card"}`}>
            <span className="flex-1 text-sm font-medium text-foreground">{p.left}</span>
            <select
              value={pick[p.left] ?? ""}
              disabled={checked}
              onChange={(e) => setPick((m) => ({ ...m, [p.left]: e.target.value }))}
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-advanced/40 disabled:opacity-70 sm:w-64"
            >
              <option value="" disabled>Choisir…</option>
              {rights.map((r, idx) => <option key={`r-${idx}`} value={r}>{r}</option>)}
            </select>
            {checked && (ok ? <Check className="size-4 text-available-fg" /> : <span className="text-xs font-semibold text-unavailable-fg">→ {p.right}</span>)}
          </div>
        );
      })}
      {!checked ? (
        <CheckBtn disabled={Object.keys(pick).length !== ex.pairs.length} checked={checked} onClick={() => onSubmit(ex.pairs.every((p) => pick[p.left] === p.right))} />
      ) : <RetryBtn onClick={() => { setPick({}); onAnswered(false); }} />}
    </div>
  );
}

/* ----------------------------- Player (évaluation du module) ----------------------------- */
export function ExercisePlayer({ exercises, onComplete }: { exercises: N1Exercise[]; onComplete?: (pct: number) => void }) {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const total = exercises.length;
  const done = Object.keys(results).length;
  const score = Object.values(results).filter(Boolean).length;
  const pct = total ? Math.round((score / total) * 100) : 0;

  // Ref pour appeler onComplete sans dépendre de sa stabilité (callback parent éventuellement non mémoïsé).
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    if (done === total && total > 0) onCompleteRef.current?.(pct);
  }, [done, total, pct]);

  return (
    <div className="space-y-4">
      <div className="sticky top-2 z-10 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-soft backdrop-blur">
        <Trophy className="size-5" style={{ color: N1 }} />
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Progression : {done}/{total}</span>
            <span>{score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%`, backgroundColor: N1 }} />
          </div>
        </div>
        {done === total && total > 0 && (
          <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${pct >= 60 ? "bg-available-soft text-available-fg" : "bg-pending-soft text-pending-fg"}`}>{pct}%</span>
        )}
      </div>
      {exercises.map((ex, i) => (
        <ExerciseCard key={ex.id} exercise={ex} index={i} onResult={(c) => setResults((r) => ({ ...r, [ex.id]: c }))} />
      ))}
      {done === total && total > 0 && (
        <div className={`rounded-2xl border p-5 text-center ${pct >= 60 ? "border-available/40 bg-available-soft/40" : "border-pending/40 bg-pending-soft/40"}`}>
          <Trophy className={`mx-auto size-8 ${pct >= 60 ? "text-available-fg" : "text-pending-fg"}`} />
          <p className="mt-2 text-lg font-extrabold text-foreground">Évaluation terminée — {pct}%</p>
          <p className="mt-1 text-sm text-muted-foreground">{pct >= 60 ? "Bravo, le seuil de réussite (60 %) est atteint pour ce module." : "Le seuil de réussite est de 60 %. Reprenez les questions à revoir, puis réessayez."}</p>
        </div>
      )}
    </div>
  );
}
