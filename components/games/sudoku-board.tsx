"use client";

import * as React from "react";
import { RefreshCw, CheckCircle2, Lightbulb, Eraser, Wand2, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateSudoku, type SudokuLevel } from "@/lib/games/sudoku";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

const LEVELS: { key: SudokuLevel; label: string }[] = [
  { key: "facile", label: "Facile" },
  { key: "moyen", label: "Moyen" },
  { key: "difficile", label: "Difficile" },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function SudokuBoard({ initialLevel = "facile", slug = "sudoku" }: { initialLevel?: SudokuLevel; slug?: string }) {
  const [level, setLevel] = React.useState<SudokuLevel>(initialLevel);
  const [puzzle, setPuzzle] = React.useState<number[]>([]);
  const [solution, setSolution] = React.useState<number[]>([]);
  const [values, setValues] = React.useState<number[]>([]);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [solved, setSolved] = React.useState(false);
  const [mistakes, setMistakes] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);
  const recordedRef = React.useRef(false);

  const newGame = React.useCallback((lvl: SudokuLevel) => {
    const { puzzle, solution } = generateSudoku(lvl);
    setPuzzle(puzzle);
    setSolution(solution);
    setValues(puzzle.slice());
    setSelected(null);
    setChecked(false);
    setElapsed(0);
    setSolved(false);
    setMistakes(0);
    setRevealed(false);
    setSaveResult(null);
    recordedRef.current = false;
  }, []);

  // Première génération (côté client uniquement pour éviter tout écart d'hydratation).
  React.useEffect(() => {
    newGame(initialLevel);
  }, [newGame, initialLevel]);

  // Chrono.
  React.useEffect(() => {
    if (solved || puzzle.length === 0) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [solved, puzzle.length]);

  const isGiven = (i: number) => puzzle[i] !== 0;

  const setCell = (val: number) => {
    if (selected === null || isGiven(selected) || solved) return;
    if (val !== 0 && val !== solution[selected]) setMistakes((m) => m + 1);
    setValues((prev) => {
      const next = prev.slice();
      next[selected] = val;
      // victoire ?
      if (val !== 0 && next.every((v, k) => v === solution[k])) setSolved(true);
      return next;
    });
    setChecked(false);
  };

  // Saisie clavier.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key >= "1" && e.key <= "9") setCell(Number(e.key));
      else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") setCell(0);
      else if (e.key === "ArrowRight") setSelected((s) => (s === null ? 0 : Math.min(80, s + 1)));
      else if (e.key === "ArrowLeft") setSelected((s) => (s === null ? 0 : Math.max(0, s - 1)));
      else if (e.key === "ArrowDown") setSelected((s) => (s === null ? 0 : Math.min(80, s + 9)));
      else if (e.key === "ArrowUp") setSelected((s) => (s === null ? 0 : Math.max(0, s - 9)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, solved, puzzle, solution]);

  const hint = () => {
    if (selected === null || isGiven(selected) || solved) return;
    setCell(solution[selected]);
  };
  const reveal = () => {
    setValues(solution.slice());
    setRevealed(true);
    setSolved(true);
  };

  // Enregistre la partie réussie (utilisateur connecté) — sauf si la solution a été révélée.
  React.useEffect(() => {
    if (solved && !revealed && !recordedRef.current) {
      recordedRef.current = true;
      recordBrainAttempt({ gameSlug: slug, level, success: true, durationSec: elapsed, errors: mistakes })
        .then(setSaveResult)
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, revealed]);

  const errorsCount = checked ? values.filter((v, i) => v !== 0 && v !== solution[i]).length : 0;
  const filled = values.filter((v) => v !== 0).length;

  if (puzzle.length === 0) {
    return <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">Génération de la grille…</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div>
        {/* Barre d'état */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-sm font-semibold text-foreground">
            <Timer className="size-4 text-primary" /> {fmt(elapsed)}
          </span>
          <div className="flex gap-1">
            {LEVELS.map((l) => (
              <button
                key={l.key}
                onClick={() => { setLevel(l.key); newGame(l.key); }}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition-colors",
                  level === l.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-9 overflow-hidden rounded-xl border-2 border-foreground/30 bg-card">
          {values.map((v, i) => {
            const r = Math.floor(i / 9);
            const c = i % 9;
            const given = isGiven(i);
            const isError = checked && v !== 0 && v !== solution[i];
            const sameVal = selected !== null && values[selected] !== 0 && v === values[selected];
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={cn(
                  "relative flex aspect-square items-center justify-center text-lg font-bold transition-colors sm:text-xl",
                  "border border-border/70",
                  c % 3 === 2 && c !== 8 && "border-r-2 border-r-foreground/30",
                  r % 3 === 2 && r !== 8 && "border-b-2 border-b-foreground/30",
                  selected === i ? "bg-primary/15" : sameVal ? "bg-primary-50" : "bg-card hover:bg-secondary",
                  given ? "text-foreground" : isError ? "text-unavailable-fg" : "text-primary",
                  "size-9 sm:size-11"
                )}
              >
                {v !== 0 ? v : ""}
              </button>
            );
          })}
        </div>

        {/* Pavé numérique */}
        <div className="mt-3 grid grid-cols-9 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => setCell(n)}
              className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card text-lg font-bold text-foreground transition hover:border-primary/40 hover:bg-primary-50"
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Actions & état */}
      <div className="space-y-3">
        {solved ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-bold text-available-fg">
              <Trophy className="size-5" /> {revealed ? "Solution affichée." : `Grille résolue en ${fmt(elapsed)} ! Bravo 🎉`}
            </div>
            {!revealed && saveResult?.recorded && (
              <div className="rounded-xl border border-primary/20 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                <p className="font-bold">+{saveResult.score} points enregistrés</p>
                {saveResult.newBadges && saveResult.newBadges.length > 0 && (
                  <p className="mt-1">🏅 Badge débloqué : {saveResult.newBadges.map((c) => getBadge(c)?.label ?? c).join(", ")}</p>
                )}
              </div>
            )}
            {!revealed && saveResult && !saveResult.recorded && (
              <p className="text-xs text-muted-foreground">Connectez-vous pour enregistrer vos scores et débloquer des badges.</p>
            )}
          </div>
        ) : checked ? (
          errorsCount === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
              <CheckCircle2 className="size-5" /> Aucune erreur — continuez !
            </div>
          ) : (
            <div className="rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
              {errorsCount} case(s) incorrecte(s) (en rouge).
            </div>
          )
        ) : (
          <p className="text-sm text-muted-foreground">{filled}/81 cases remplies. Sélectionnez une case puis un chiffre.</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setChecked(true)} disabled={solved}><CheckCircle2 className="size-4" /> Vérifier</Button>
          <Button variant="outline" onClick={hint} disabled={solved}><Lightbulb className="size-4" /> Indice</Button>
          <Button variant="outline" onClick={() => setCell(0)} disabled={solved}><Eraser className="size-4" /> Effacer</Button>
          <Button variant="outline" onClick={reveal} disabled={solved}><Wand2 className="size-4" /> Solution</Button>
        </div>
        <Button className="w-full" onClick={() => newGame(level)}><RefreshCw className="size-4" /> Nouvelle grille</Button>

        <p className="text-xs text-muted-foreground">
          Astuce : vous pouvez aussi jouer au clavier (chiffres 1-9, flèches pour se déplacer, Retour arrière pour effacer).
        </p>
      </div>
    </div>
  );
}
