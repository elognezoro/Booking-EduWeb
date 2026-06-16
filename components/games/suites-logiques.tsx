"use client";

import * as React from "react";
import { CheckCircle2, XCircle, RefreshCw, Trophy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { genSuite, type SeqLevel, type Suite } from "@/lib/games/sequences";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

const LEVELS: { key: SeqLevel; label: string }[] = [
  { key: "facile", label: "Débutant" },
  { key: "moyen", label: "Intermédiaire" },
  { key: "difficile", label: "Avancé" },
];
const ROUNDS = 6;
const MULT: Record<SeqLevel, number> = { facile: 80, moyen: 120, difficile: 180 };

export function SuitesLogiques({ initialLevel = "facile", slug = "logique" }: { initialLevel?: SeqLevel; slug?: string }) {
  const [level, setLevel] = React.useState<SeqLevel>(initialLevel);
  const [phase, setPhase] = React.useState<"ready" | "playing" | "done">("ready");
  const [round, setRound] = React.useState(0);
  const [suite, setSuite] = React.useState<Suite | null>(null);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [correct, setCorrect] = React.useState(0);
  const [start, setStart] = React.useState(0);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);

  const begin = (lvl: SeqLevel) => {
    setLevel(lvl);
    setPhase("playing");
    setRound(0); setCorrect(0); setPicked(null); setSaveResult(null);
    setStart(Date.now());
    setSuite(genSuite(lvl));
  };

  const pick = (opt: number) => {
    if (picked !== null || !suite) return;
    setPicked(opt);
    const ok = opt === suite.answer;
    if (ok) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (round + 1 >= ROUNDS) setPhase("done");
      else { setRound((r) => r + 1); setSuite(genSuite(level)); setPicked(null); }
    }, 900);
  };

  React.useEffect(() => {
    if (phase !== "done") return;
    const durationSec = Math.round((Date.now() - start) / 1000);
    const points = correct * MULT[level];
    recordBrainAttempt({ gameSlug: slug, level, success: correct >= Math.ceil(ROUNDS / 2), durationSec, errors: ROUNDS - correct, points })
      .then(setSaveResult).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "ready") {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Trouvez le nombre qui complète chaque suite ({ROUNDS} manches). Choisissez un niveau :</p>
        <div className="flex flex-wrap justify-center gap-2">
          {LEVELS.map((l) => (
            <Button key={l.key} variant={l.key === level ? "default" : "outline"} onClick={() => begin(l.key)}>
              <Play className="size-4" /> {l.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-md space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 font-bold text-available-fg">
          <Trophy className="size-5" /> Terminé ! {correct}/{ROUNDS} bonnes réponses.
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
        <Button onClick={() => begin(level)}><RefreshCw className="size-4" /> Rejouer</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-muted-foreground">
        <span>Manche {round + 1}/{ROUNDS}</span>
        <span><CheckCircle2 className="mr-1 inline size-4 text-available" />{correct}</span>
      </div>
      <div className="rounded-2xl border-2 border-border bg-card p-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 text-3xl font-extrabold text-foreground">
          {suite?.terms.map((t, i) => <span key={i}>{t}</span>)}
          <span className="text-primary">?</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {suite?.options.map((opt) => {
          const isAnswer = opt === suite.answer;
          const chosen = picked === opt;
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={picked !== null}
              className={cn(
                "rounded-xl border-2 py-4 text-xl font-bold transition-colors",
                picked === null ? "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary-50"
                  : isAnswer ? "border-available bg-available-soft text-available-fg"
                  : chosen ? "border-unavailable bg-unavailable-soft text-unavailable-fg"
                  : "border-border bg-card text-muted-foreground opacity-60"
              )}
            >
              {opt}
              {picked !== null && isAnswer && <CheckCircle2 className="ml-2 inline size-5" />}
              {picked !== null && chosen && !isAnswer && <XCircle className="ml-2 inline size-5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
