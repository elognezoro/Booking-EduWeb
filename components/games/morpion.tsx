"use client";

import * as React from "react";
import { RefreshCw, Play, Bot, User, Trophy, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { aiMove, winner, winningLine, type Board } from "@/lib/games/morpion";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

type Level = "facile" | "moyen" | "difficile";
const LEVELS: { key: Level; label: string; note: string }[] = [
  { key: "facile", label: "Débutant", note: "IA accessible" },
  { key: "moyen", label: "Intermédiaire", note: "IA solide" },
  { key: "difficile", label: "Avancé", note: "IA imbattable" },
];
const POINTS: Record<Level, { win: number; draw: number }> = {
  facile: { win: 400, draw: 150 },
  moyen: { win: 800, draw: 350 },
  difficile: { win: 1500, draw: 700 },
};
const EMPTY: Board = Array(9).fill(null);

export function Morpion({ initialLevel = "facile", slug = "defis-ia" }: { initialLevel?: Level; slug?: string }) {
  const [level, setLevel] = React.useState<Level>(initialLevel);
  const [phase, setPhase] = React.useState<"ready" | "playing" | "done">("ready");
  const [board, setBoard] = React.useState<Board>(EMPTY);
  const [locked, setLocked] = React.useState(false); // pendant le coup de l'IA
  const [result, setResult] = React.useState<"X" | "O" | "draw" | null>(null);
  const [tally, setTally] = React.useState({ win: 0, draw: 0, loss: 0 });
  const [start, setStart] = React.useState(0);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);

  const begin = (lvl: Level) => {
    setLevel(lvl);
    setBoard(EMPTY);
    setResult(null);
    setLocked(false);
    setSaveResult(null);
    setStart(Date.now());
    setPhase("playing");
  };

  const concludeIfOver = (b: Board): boolean => {
    const w = winner(b);
    if (!w) return false;
    setResult(w);
    setPhase("done");
    const human = w === "X";
    setTally((t) => ({ win: t.win + (w === "X" ? 1 : 0), draw: t.draw + (w === "draw" ? 1 : 0), loss: t.loss + (w === "O" ? 1 : 0) }));
    const durationSec = Math.round((Date.now() - start) / 1000);
    const pts = w === "X" ? POINTS[level].win : w === "draw" ? POINTS[level].draw : 0;
    recordBrainAttempt({ gameSlug: slug, level, success: w !== "O", durationSec, errors: w === "O" ? 1 : 0, points: pts })
      .then(setSaveResult)
      .catch(() => {});
    return true;
  };

  const playHuman = (i: number) => {
    if (phase !== "playing" || locked || board[i]) return;
    const afterHuman = board.slice();
    afterHuman[i] = "X";
    setBoard(afterHuman);
    if (concludeIfOver(afterHuman)) return;

    // tour de l'IA (léger délai pour l'effet)
    setLocked(true);
    setTimeout(() => {
      const move = aiMove(afterHuman, level);
      const afterAi = afterHuman.slice();
      if (move >= 0) afterAi[move] = "O";
      setBoard(afterAi);
      setLocked(false);
      concludeIfOver(afterAi);
    }, 380);
  };

  const line = winningLine(board);

  if (phase === "ready") {
    return (
      <div className="text-center">
        <p className="mb-1 text-muted-foreground">Affrontez l'intelligence artificielle au Morpion. Vous jouez les <span className="font-bold text-primary">X</span> et commencez.</p>
        <p className="mb-4 text-sm text-muted-foreground">Plus le niveau monte, plus l'IA joue juste. Choisissez un niveau :</p>
        <div className="flex flex-wrap justify-center gap-2">
          {LEVELS.map((l) => (
            <Button key={l.key} variant={l.key === level ? "default" : "outline"} onClick={() => begin(l.key)}>
              <Play className="size-4" /> {l.label} · {l.note}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><User className="size-4 text-primary" /> Vous (X)</span>
        <span className="text-xs">🏆 {tally.win} · 🤝 {tally.draw} · 🤖 {tally.loss}</span>
        <span className="inline-flex items-center gap-1.5"><Bot className="size-4 text-foreground" /> IA (O)</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => {
          const inLine = line?.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => playHuman(i)}
              disabled={phase !== "playing" || locked || !!cell}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl border-2 text-4xl font-extrabold transition-colors",
                inLine ? "border-available bg-available-soft" : "border-border bg-card",
                cell === "X" ? "text-primary" : cell === "O" ? "text-foreground" : "text-muted-foreground hover:border-primary/40 hover:bg-primary-50"
              )}
              aria-label={`Case ${i + 1}${cell ? ` (${cell})` : ""}`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {locked && <p className="mt-3 text-center text-sm text-muted-foreground">L'IA réfléchit…</p>}

      {phase === "done" && (
        <div className="mt-4 space-y-3 text-center">
          {result === "X" && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 font-bold text-available-fg">
              <Trophy className="size-5" /> Vous gagnez ! Bravo, vous avez battu l'IA.
            </div>
          )}
          {result === "draw" && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-pending/30 bg-pending-soft px-4 py-3 font-bold text-pending-fg">
              <Handshake className="size-5" /> Match nul{level === "difficile" ? " — le meilleur résultat possible face à une IA parfaite !" : "."}
            </div>
          )}
          {result === "O" && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 font-bold text-unavailable-fg">
              <Bot className="size-5" /> L'IA l'emporte. Réessayez avec une autre stratégie !
            </div>
          )}
          {saveResult?.recorded && (
            <div className="rounded-xl border border-primary/20 bg-primary-50 px-4 py-3 text-sm text-primary-700">
              <p className="font-bold">+{saveResult.score} points enregistrés</p>
              {saveResult.newBadges && saveResult.newBadges.length > 0 && (
                <p className="mt-1">🏅 Badge débloqué : {saveResult.newBadges.map((c) => getBadge(c)?.label ?? c).join(", ")}</p>
              )}
            </div>
          )}
          {saveResult && !saveResult.recorded && <p className="text-xs text-muted-foreground">Connectez-vous pour enregistrer vos scores.</p>}
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => begin(level)}><RefreshCw className="size-4" /> Rejouer</Button>
            <Button variant="outline" onClick={() => setPhase("ready")}>Changer de niveau</Button>
          </div>
        </div>
      )}
    </div>
  );
}
