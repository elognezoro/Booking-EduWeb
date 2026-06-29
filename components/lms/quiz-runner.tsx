"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichContent } from "@/components/lms/rich-content";
import { submitAttempt } from "@/app/actions/lms";

export interface RunnerQuestion { id: string; type: string; name: string; questionText: string; multiple?: boolean; options?: string[] }

export function QuizRunner({ attemptId, questions }: { attemptId: string; questions: RunnerQuestion[] }) {
  const [answers, setAnswers] = React.useState<Record<string, unknown>>({});
  const [pending, setPending] = React.useState(false);
  const set = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }));
  const mcqSelected = (id: string): number[] => (Array.isArray(answers[id]) ? (answers[id] as number[]) : []);
  const toggleMulti = (id: string, idx: number) => set(id, mcqSelected(id).includes(idx) ? mcqSelected(id).filter((x) => x !== idx) : [...mcqSelected(id), idx]);

  const submit = async () => {
    if (pending) return;
    setPending(true);
    try { await submitAttempt({ attemptId, answers }); } finally { setPending(false); }
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
          </div>
        </div>
      ))}
      <Button type="button" onClick={submit} disabled={pending} size="lg">
        {pending ? <><Loader2 className="size-4 animate-spin" /> Envoi…</> : <><Send className="size-4" /> Terminer et soumettre</>}
      </Button>
    </div>
  );
}
