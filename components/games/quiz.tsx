"use client";

import * as React from "react";
import { CheckCircle2, XCircle, RefreshCw, Trophy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation?: string | null;
}

type Level = "facile" | "moyen" | "difficile";
const MULT: Record<Level, number> = { facile: 60, moyen: 90, difficile: 140 };

export function Quiz({ questions, level, slug = "culture-generale" }: { questions: QuizQuestion[]; level: Level; slug?: string }) {
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [start] = React.useState(() => Date.now());
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);

  const q = questions[idx];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answerIndex) setCorrect((c) => c + 1);
  };
  const next = () => {
    if (idx + 1 >= questions.length) setDone(true);
    else { setIdx((i) => i + 1); setPicked(null); }
  };

  React.useEffect(() => {
    if (!done) return;
    const durationSec = Math.round((Date.now() - start) / 1000);
    recordBrainAttempt({ gameSlug: slug, level, success: correct >= Math.ceil(questions.length / 2), durationSec, errors: questions.length - correct, points: correct * MULT[level] })
      .then(setSaveResult).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (questions.length === 0) {
    return <p className="rounded-xl bg-secondary/60 p-4 text-center text-sm text-muted-foreground">Aucune question disponible pour ce niveau pour l'instant.</p>;
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 font-bold text-available-fg">
          <Trophy className="size-5" /> {correct}/{questions.length} bonnes réponses !
        </div>
        {saveResult?.recorded && (
          <div className="rounded-xl border border-primary/20 bg-primary-50 px-4 py-3 text-sm text-primary-700">
            <p className="font-bold">+{saveResult.score} points enregistrés</p>
            {saveResult.newBadges && saveResult.newBadges.length > 0 && (
              <p className="mt-1">🏅 Badge débloqué : {saveResult.newBadges.map((c) => getBadge(c)?.label ?? c).join(", ")}</p>
            )}
          </div>
        )}
        {saveResult && !saveResult.recorded && <p className="text-xs text-muted-foreground">Connectez-vous pour enregistrer vos scores.</p>}
        <Button onClick={() => { setIdx(0); setPicked(null); setCorrect(0); setDone(false); setSaveResult(null); }}><RefreshCw className="size-4" /> Recommencer</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-muted-foreground">
        <span>Question {idx + 1}/{questions.length}</span>
        <span><CheckCircle2 className="mr-1 inline size-4 text-available" />{correct}</span>
      </div>
      <div className="rounded-2xl border-2 border-border bg-card p-5 text-center">
        <p className="text-lg font-bold text-foreground">{q.prompt}</p>
      </div>
      <div className="mt-4 grid gap-2.5">
        {q.choices.map((choice, i) => {
          const isAnswer = i === q.answerIndex;
          const chosen = picked === i;
          return (
            <button key={i} onClick={() => pick(i)} disabled={picked !== null}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-left font-semibold transition-colors",
                picked === null ? "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary-50"
                  : isAnswer ? "border-available bg-available-soft text-available-fg"
                  : chosen ? "border-unavailable bg-unavailable-soft text-unavailable-fg"
                  : "border-border bg-card text-muted-foreground opacity-60"
              )}>
              <span>{choice}</span>
              {picked !== null && isAnswer && <CheckCircle2 className="size-5" />}
              {picked !== null && chosen && !isAnswer && <XCircle className="size-5" />}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 space-y-3">
          {q.explanation && (
            <p className="flex items-start gap-2 rounded-xl bg-secondary/50 p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" /> {q.explanation}
            </p>
          )}
          <Button className="w-full" onClick={next}>{idx + 1 >= questions.length ? "Voir le résultat" : "Question suivante"}</Button>
        </div>
      )}
    </div>
  );
}
