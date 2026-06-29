"use client";

import * as React from "react";
import { Loader2, Send, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichContent } from "@/components/lms/rich-content";
import { submitAttempt } from "@/app/actions/lms";
import type { ClozeRenderSegment } from "@/lib/lms-cloze";
import type { DragTextRender, MatchingRender } from "@/lib/lms-exercises";
import type { GapfillRenderSegment } from "@/lib/lms-gapfill";

export interface RunnerQuestion { id: string; type: string; name: string; questionText: string; multiple?: boolean; options?: string[]; cloze?: ClozeRenderSegment[]; dragText?: DragTextRender; matching?: MatchingRender; ordering?: string[]; gapfill?: GapfillRenderSegment[] }

export function QuizRunner({ attemptId, questions }: { attemptId: string; questions: RunnerQuestion[] }) {
  const [answers, setAnswers] = React.useState<Record<string, unknown>>({});
  const [pending, setPending] = React.useState(false);
  const set = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }));
  const mcqSelected = (id: string): number[] => (Array.isArray(answers[id]) ? (answers[id] as number[]) : []);
  const toggleMulti = (id: string, idx: number) => set(id, mcqSelected(id).includes(idx) ? mcqSelected(id).filter((x) => x !== idx) : [...mcqSelected(id), idx]);
  const clozeAns = (id: string): Record<string, string> => (answers[id] && typeof answers[id] === "object" && !Array.isArray(answers[id]) ? (answers[id] as Record<string, string>) : {});
  const setCloze = (id: string, gap: number, v: string) => set(id, { ...clozeAns(id), [String(gap)]: v });
  const setKey = (id: string, key: string, v: string) => set(id, { ...clozeAns(id), [key]: v });
  const delKey = (id: string, key: string) => { const o = { ...clozeAns(id) }; delete o[key]; set(id, o); };
  const [picked, setPicked] = React.useState<{ qid: string; word: string } | null>(null);
  const dragRef = React.useRef<string | null>(null);
  const ordOf = (q: RunnerQuestion): string[] => (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : (q.ordering ?? []));
  const moveItem = (q: RunnerQuestion, from: number, to: number) => { const arr = [...ordOf(q)]; if (to < 0 || to >= arr.length) return; const [it] = arr.splice(from, 1); arr.splice(to, 0, it); set(q.id, arr); };

  const submit = async () => {
    if (pending) return;
    setPending(true);
    try {
      const final: Record<string, unknown> = { ...answers };
      for (const q of questions) if (q.ordering && !Array.isArray(final[q.id])) final[q.id] = q.ordering; // ordre par défaut = ordre affiché
      await submitAttempt({ attemptId, answers: final });
    } finally { setPending(false); }
  };

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <div key={q.id} className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Question {i + 1}</p>
          <RichContent html={q.questionText} />
          <div className="mt-3 space-y-2">
            {q.type === "MCQ" && (q.options ?? []).map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary/50">
                <input
                  type={q.multiple ? "checkbox" : "radio"}
                  name={`q-${q.id}`}
                  checked={q.multiple ? mcqSelected(q.id).includes(idx) : mcqSelected(q.id)[0] === idx}
                  onChange={() => (q.multiple ? toggleMulti(q.id, idx) : set(q.id, [idx]))}
                  className="size-4 shrink-0"
                />
                {opt}
              </label>
            ))}
            {q.type === "TRUEFALSE" && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="radio" name={`q-${q.id}`} checked={answers[q.id] === true} onChange={() => set(q.id, true)} className="size-4" /> Vrai</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name={`q-${q.id}`} checked={answers[q.id] === false} onChange={() => set(q.id, false)} className="size-4" /> Faux</label>
              </div>
            )}
            {q.type === "SHORTANSWER" && (
              <Input value={String(answers[q.id] ?? "")} onChange={(e) => set(q.id, e.target.value)} placeholder="Votre réponse" className="max-w-md" />
            )}
            {q.type === "NUMERICAL" && (
              <Input type="number" step="any" value={String(answers[q.id] ?? "")} onChange={(e) => set(q.id, e.target.value)} placeholder="Votre réponse" className="max-w-[200px]" />
            )}
            {q.type === "CLOZE" && q.cloze && (
              <p className="text-[15px] leading-[2.4] text-foreground">
                {q.cloze.map((seg, si) =>
                  seg.type === "text" ? (
                    <span key={si} className="whitespace-pre-wrap">{seg.text}</span>
                  ) : seg.gap.kind === "MULTICHOICE" ? (
                    <select key={si} value={clozeAns(q.id)[String(seg.gap.index)] ?? ""} onChange={(e) => setCloze(q.id, seg.gap.index, e.target.value)} className="mx-1 rounded-lg border border-input bg-background px-2 py-1 text-sm">
                      <option value="">—</option>
                      {(seg.gap.choices ?? []).map((c, ci) => <option key={ci} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input
                      key={si}
                      type={seg.gap.kind === "NUMERICAL" ? "number" : "text"}
                      step={seg.gap.kind === "NUMERICAL" ? "any" : undefined}
                      value={clozeAns(q.id)[String(seg.gap.index)] ?? ""}
                      onChange={(e) => setCloze(q.id, seg.gap.index, e.target.value)}
                      className="mx-1 w-32 rounded-lg border border-input bg-background px-2 py-1 align-middle text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label={`Trou ${seg.gap.index}`}
                    />
                  ),
                )}
              </p>
            )}
            {q.type === "DRAGTEXT" && q.dragText && (
              <div className="space-y-3">
                <p className="text-[15px] leading-[2.8] text-foreground">
                  {q.dragText.segments.map((seg, si) => seg.type === "text" ? (
                    <span key={si} className="whitespace-pre-wrap">{seg.text}</span>
                  ) : (
                    <button
                      key={si}
                      type="button"
                      onClick={() => { const w = clozeAns(q.id)[String(seg.index)]; if (w) delKey(q.id, String(seg.index)); else if (picked?.qid === q.id) { setKey(q.id, String(seg.index), picked.word); setPicked(null); } }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); if (dragRef.current) { setKey(q.id, String(seg.index), dragRef.current); dragRef.current = null; } }}
                      className={`mx-1 inline-flex min-w-[90px] items-center justify-center rounded-md border px-2 py-0.5 align-middle text-sm ${clozeAns(q.id)[String(seg.index)] ? "border-advanced-fg bg-advanced/10 font-medium text-advanced-fg" : "border-dashed border-muted-foreground/60 text-muted-foreground"}`}
                    >
                      {clozeAns(q.id)[String(seg.index)] || "…"}
                    </button>
                  ))}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.dragText.words.map((word, wi) => {
                    const isPicked = picked?.qid === q.id && picked.word === word;
                    return (
                      <button
                        key={wi}
                        type="button"
                        draggable
                        onDragStart={() => { dragRef.current = word; }}
                        onClick={() => setPicked(isPicked ? null : { qid: q.id, word })}
                        className={`cursor-grab rounded-lg border px-3 py-1 text-sm ${isPicked ? "border-primary bg-primary/10 font-semibold text-primary" : "border-border bg-card hover:bg-secondary"}`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Glissez une étiquette dans un trou (ou cliquez l'étiquette puis le trou). Cliquez un trou rempli pour le vider. Une même étiquette peut servir plusieurs fois.</p>
              </div>
            )}
            {q.type === "GAPFILL" && q.gapfill && (
              <p className="text-[15px] leading-[2.6] text-foreground">
                {q.gapfill.map((seg, si) => seg.type === "text" ? (
                  <span key={si} className="whitespace-pre-wrap">{seg.text}</span>
                ) : (
                  <input
                    key={si}
                    type="text"
                    value={clozeAns(q.id)[String(seg.index)] ?? ""}
                    onChange={(e) => setKey(q.id, String(seg.index), e.target.value)}
                    className="mx-1 w-36 rounded-lg border border-input bg-background px-2 py-1 align-middle text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={`Trou ${seg.index}`}
                  />
                ))}
              </p>
            )}
            {q.type === "MATCHING" && q.matching && (
              <div className="space-y-2">
                {q.matching.lefts.map((left, li) => (
                  <div key={li} className="flex flex-wrap items-center gap-2">
                    <span className="min-w-[140px] flex-1 text-sm text-foreground">{left}</span>
                    <select value={clozeAns(q.id)[String(li)] ?? ""} onChange={(e) => setKey(q.id, String(li), e.target.value)} className="rounded-lg border border-input bg-background px-2 py-1 text-sm">
                      <option value="">— choisir —</option>
                      {q.matching!.rights.map((r, ri) => <option key={ri} value={r}>{r}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
            {q.type === "ORDERING" && q.ordering && (
              <ol className="space-y-2">
                {ordOf(q).map((item, oi) => (
                  <li
                    key={`${item}-${oi}`}
                    draggable
                    onDragStart={() => { dragRef.current = String(oi); }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); if (dragRef.current !== null) { moveItem(q, parseInt(dragRef.current, 10), oi); dragRef.current = null; } }}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2"><GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" /> {item}</span>
                    <span className="flex shrink-0 gap-1">
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => moveItem(q, oi, oi - 1)} disabled={oi === 0} aria-label="Monter"><ChevronUp className="size-4" /></Button>
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => moveItem(q, oi, oi + 1)} disabled={oi === ordOf(q).length - 1} aria-label="Descendre"><ChevronDown className="size-4" /></Button>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      ))}
      <Button type="button" onClick={submit} disabled={pending} size="lg">
        {pending ? <><Loader2 className="size-4 animate-spin" /> Envoi…</> : <><Send className="size-4" /> Terminer et soumettre</>}
      </Button>
    </div>
  );
}
