"use client";

import * as React from "react";
import { RefreshCw, Timer, MousePointerClick, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

type Level = "facile" | "moyen" | "difficile";
const LEVELS: { key: Level; label: string; pairs: number; cols: string }[] = [
  { key: "facile", label: "Facile", pairs: 6, cols: "grid-cols-4" },
  { key: "moyen", label: "Moyen", pairs: 8, cols: "grid-cols-4" },
  { key: "difficile", label: "Difficile", pairs: 10, cols: "grid-cols-5" },
];
const SYMBOLS = ["📚", "🎒", "✏️", "🧮", "🌍", "🔬", "🎨", "🎵", "⚽", "🏆", "💡", "🧩", "🖥️", "📐"];

interface Carte { id: number; sym: string; matched: boolean }

function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function MemoryGame({ initialLevel = "facile", slug = "memoire" }: { initialLevel?: Level; slug?: string }) {
  const [level, setLevel] = React.useState<Level>(initialLevel);
  const [cards, setCards] = React.useState<Carte[]>([]);
  const [flipped, setFlipped] = React.useState<number[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [lock, setLock] = React.useState(false);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);
  const recordedRef = React.useRef(false);

  const def = LEVELS.find((l) => l.key === level)!;
  const solved = cards.length > 0 && cards.every((c) => c.matched);

  const newGame = React.useCallback((lvl: Level) => {
    const { pairs } = LEVELS.find((l) => l.key === lvl)!;
    const chosen = SYMBOLS.slice(0, pairs);
    const deck = shuffle([...chosen, ...chosen]).map((sym, id) => ({ id, sym, matched: false }));
    setCards(deck);
    setFlipped([]);
    setMoves(0);
    setElapsed(0);
    setLock(false);
    setSaveResult(null);
    recordedRef.current = false;
  }, []);

  // Enregistre la partie réussie (utilisateur connecté).
  React.useEffect(() => {
    if (solved && !recordedRef.current) {
      recordedRef.current = true;
      recordBrainAttempt({ gameSlug: slug, level, success: true, durationSec: elapsed, errors: moves })
        .then(setSaveResult)
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  React.useEffect(() => { newGame(initialLevel); }, [newGame, initialLevel]);

  React.useEffect(() => {
    if (solved || cards.length === 0) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [solved, cards.length]);

  const flip = (idx: number) => {
    if (lock || flipped.includes(idx) || cards[idx].matched) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].sym === cards[b].sym) {
        setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setFlipped([]);
      } else {
        setLock(true);
        setTimeout(() => { setFlipped([]); setLock(false); }, 850);
      }
    }
  };

  if (cards.length === 0) return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Préparation des cartes…</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-sm font-semibold text-foreground"><Timer className="size-4 text-primary" /> {fmt(elapsed)}</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-sm font-semibold text-foreground"><MousePointerClick className="size-4 text-primary" /> {moves} coups</span>
          </div>
          <div className="flex gap-1">
            {LEVELS.map((l) => (
              <button key={l.key} onClick={() => { setLevel(l.key); newGame(l.key); }}
                className={cn("rounded-lg px-2.5 py-1 text-xs font-bold transition-colors", level === l.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className={cn("grid gap-2", def.cols)}>
          {cards.map((c, i) => {
            const shown = flipped.includes(i) || c.matched;
            return (
              <button key={c.id} onClick={() => flip(i)} aria-label={shown ? c.sym : "Carte cachée"}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl border text-2xl transition-all sm:text-3xl",
                  shown ? "border-primary/30 bg-primary-50" : "border-border bg-primary text-primary",
                  c.matched && "opacity-60 ring-2 ring-available"
                )}>
                <span className={cn(shown ? "opacity-100" : "opacity-0")}>{c.sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {solved && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-bold text-available-fg">
              <Trophy className="size-5" /> Gagné en {moves} coups et {fmt(elapsed)} ! 🎉
            </div>
            {saveResult?.recorded && (
              <div className="rounded-xl border border-primary/20 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                <p className="font-bold">+{saveResult.score} points enregistrés</p>
                {saveResult.newBadges && saveResult.newBadges.length > 0 && (
                  <p className="mt-1">🏅 Badge débloqué : {saveResult.newBadges.map((c) => getBadge(c)?.label ?? c).join(", ")}</p>
                )}
              </div>
            )}
            {saveResult && !saveResult.recorded && (
              <p className="text-xs text-muted-foreground">Connectez-vous pour enregistrer vos scores et débloquer des badges.</p>
            )}
          </div>
        )}
        <p className="text-sm text-muted-foreground">{cards.filter((c) => c.matched).length / 2}/{def.pairs} paires trouvées.</p>
        <Button className="w-full" onClick={() => newGame(level)}><RefreshCw className="size-4" /> Recommencer</Button>
      </div>
    </div>
  );
}
