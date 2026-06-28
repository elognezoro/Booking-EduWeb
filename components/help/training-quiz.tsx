"use client";

import * as React from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, Circle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoleTrainingQuestion } from "@/lib/role-training";
import { cn } from "@/lib/utils";

/** Auto-évaluation (QCM) à correction immédiate : sélection, validation, score, corrigé, reprise. */
export function TrainingQuiz({ quiz, passRatio = 0.7 }: { quiz: RoleTrainingQuestion[]; passRatio?: number }) {
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const total = quiz.length;
  const answered = Object.keys(answers).length;
  const score = quiz.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const ratio = total ? score / total : 0;
  const passed = ratio >= passRatio;

  const select = (qi: number, oi: number) => { if (!submitted) setAnswers((a) => ({ ...a, [qi]: oi })); };
  const reset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div className="space-y-4">
      {submitted && (
        <div className={cn("flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3", passed ? "border-available/40 bg-available-soft" : "border-pending/40 bg-pending-soft")}>
          <span className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Award className={cn("size-5", passed ? "text-available-fg" : "text-pending-fg")} />
            Score : {score}/{total} ({Math.round(ratio * 100)} %) — {passed ? "Réussi 🎉" : "À revoir"}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={reset}><RotateCcw className="size-4" /> Recommencer</Button>
        </div>
      )}

      <ol className="space-y-4">
        {quiz.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2.5 flex gap-2 font-semibold text-foreground">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">{qi + 1}</span>
                <span className="pt-0.5">{q.question}</span>
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.answer;
                  const show = submitted;
                  const Icon = show ? (isCorrect ? CheckCircle2 : isChosen ? XCircle : Circle) : isChosen ? CheckCircle : Circle;
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => select(qi, oi)}
                      disabled={submitted}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition",
                        !show && isChosen && "border-primary bg-primary-50 font-medium text-foreground",
                        !show && !isChosen && "border-border text-foreground hover:bg-secondary/50",
                        show && isCorrect && "border-available bg-available-soft font-medium text-foreground",
                        show && isChosen && !isCorrect && "border-unavailable bg-unavailable-soft text-foreground",
                        show && !isCorrect && !isChosen && "border-border text-muted-foreground",
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", show && isCorrect ? "text-available-fg" : show && isChosen ? "text-unavailable-fg" : isChosen ? "text-primary" : "text-muted-foreground/50")} />
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-2.5 rounded-lg bg-secondary/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Explication :</strong> {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {!submitted && (
        <Button type="button" onClick={() => setSubmitted(true)} disabled={answered < total}>
          {answered < total ? `Répondez à toutes les questions (${answered}/${total})` : "Valider mes réponses"}
        </Button>
      )}
    </div>
  );
}
