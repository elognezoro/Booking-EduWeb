"use client";

import * as React from "react";
import { CheckCircle2, XCircle, RefreshCw, Trophy, Play, Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

type Level = "facile" | "moyen" | "difficile";
const LEVELS: { key: Level; label: string }[] = [
  { key: "facile", label: "Débutant" },
  { key: "moyen", label: "Intermédiaire" },
  { key: "difficile", label: "Avancé" },
];

interface LevelConf {
  cols: number;
  rows: number;
  rounds: number;
  mult: number;
  pairs: [string, string][]; // [commun, intrus]
}
const CONF: Record<Level, LevelConf> = {
  facile: {
    cols: 4,
    rows: 4,
    rounds: 8,
    mult: 60,
    pairs: [["🍎", "🍐"], ["🐶", "🐱"], ["⭐", "🌙"], ["🔴", "🔵"], ["🌻", "🌷"], ["🐟", "🐠"]],
  },
  moyen: {
    cols: 6,
    rows: 5,
    rounds: 10,
    mult: 100,
    pairs: [["🐶", "🐺"], ["😀", "😄"], ["🔵", "🟣"], ["🍊", "🍑"], ["🟢", "🟩"], ["🐸", "🐢"]],
  },
  difficile: {
    cols: 7,
    rows: 6,
    rounds: 12,
    mult: 160,
    pairs: [["😄", "😆"], ["🌕", "🌝"], ["🟠", "🟡"], ["🔆", "☀️"], ["👁️", "👀"], ["✦", "✧"]],
  },
};

const rndInt = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

export function Attention({ initialLevel = "facile", slug = "attention" }: { initialLevel?: Level; slug?: string }) {
  const [level, setLevel] = React.useState<Level>(initialLevel);
  const [phase, setPhase] = React.useState<"ready" | "playing" | "done">("ready");
  const [round, setRound] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [miss, setMiss] = React.useState(0);
  const [grid, setGrid] = React.useState<{ common: string; odd: string; oddIndex: number }>({ common: "", odd: "", oddIndex: 0 });
  const [flash, setFlash] = React.useState<number | null>(null);
  const [elapsed, setElapsed] = React.useState(0);
  const [start, setStart] = React.useState(0);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);

  const conf = CONF[level];
  const total = conf.cols * conf.rows;

  const newRound = (lvl: Level) => {
    const c = CONF[lvl];
    const [common, odd] = c.pairs[rndInt(0, c.pairs.length - 1)];
    setGrid({ common, odd, oddIndex: rndInt(0, c.cols * c.rows - 1) });
  };

  const begin = (lvl: Level) => {
    setLevel(lvl);
    setRound(0);
    setCorrect(0);
    setMiss(0);
    setFlash(null);
    setElapsed(0);
    setSaveResult(null);
    setStart(Date.now());
    newRound(lvl);
    setPhase("playing");
  };

  // chronomètre (compte le temps écoulé)
  React.useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // enregistrement à la fin
  React.useEffect(() => {
    if (phase !== "done") return;
    const durationSec = Math.round((Date.now() - start) / 1000);
    const points = Math.max(50, correct * conf.mult - durationSec * 3 - miss * 30);
    recordBrainAttempt({ gameSlug: slug, level, success: correct >= Math.ceil(conf.rounds / 2), durationSec, errors: miss, points })
      .then(setSaveResult)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const pick = (index: number) => {
    if (phase !== "playing") return;
    if (index === grid.oddIndex) {
      const nextRound = round + 1;
      setCorrect((c) => c + 1);
      if (nextRound >= conf.rounds) setPhase("done");
      else {
        setRound(nextRound);
        newRound(level);
      }
    } else {
      setMiss((m) => m + 1);
      setFlash(index);
      setTimeout(() => setFlash(null), 250);
    }
  };

  if (phase === "ready") {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Repérez l'intrus dans la grille, le plus vite possible. Choisissez un niveau :</p>
        <div className="flex flex-wrap justify-center gap-2">
          {LEVELS.map((l) => (
            <Button key={l.key} variant={l.key === level ? "default" : "outline"} onClick={() => begin(l.key)}>
              <Play className="size-4" /> {l.label} · {CONF[l.key].rounds} manches
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
          <Trophy className="size-5" /> Terminé ! {correct}/{conf.rounds} intrus trouvés en {elapsed}s, {miss} erreur(s).
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
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-foreground">
          <Target className="size-4 text-primary" /> Manche {round + 1}/{conf.rounds}
        </span>
        <span className="inline-flex items-center gap-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Timer className="size-4" /> {elapsed}s</span>
          <span><CheckCircle2 className="mr-1 inline size-4 text-available" />{correct}</span>
          <span><XCircle className="mr-1 inline size-4 text-unavailable" />{miss}</span>
        </span>
      </div>
      <p className="mb-3 text-center text-sm text-muted-foreground">Touchez le symbole différent des autres.</p>
      <div className="grid justify-center gap-1.5" style={{ gridTemplateColumns: `repeat(${conf.cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pick(i)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-lg border text-xl transition-colors sm:text-2xl",
              flash === i ? "border-unavailable bg-unavailable-soft" : "border-border bg-card hover:border-primary/40 hover:bg-primary-50"
            )}
            aria-label={`Case ${i + 1}`}
          >
            {i === grid.oddIndex ? grid.odd : grid.common}
          </button>
        ))}
      </div>
    </div>
  );
}
