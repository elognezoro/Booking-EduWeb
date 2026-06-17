"use client";

import * as React from "react";
import { CheckCircle2, RefreshCw, Trophy, Play, Lightbulb, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateCrossword, type CrosswordPuzzle } from "@/lib/games/crossword";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

type Level = "facile" | "moyen" | "difficile";
const LEVELS: { key: Level; label: string }[] = [
  { key: "facile", label: "Débutant" },
  { key: "moyen", label: "Intermédiaire" },
  { key: "difficile", label: "Avancé" },
];
const BASE: Record<Level, number> = { facile: 600, moyen: 1000, difficile: 1600 };
const ck = (r: number, c: number) => `${r},${c}`;

export function Crossword({ initialLevel = "facile", slug = "mots-croises" }: { initialLevel?: Level; slug?: string }) {
  const [level, setLevel] = React.useState<Level>(initialLevel);
  const [phase, setPhase] = React.useState<"ready" | "playing" | "done">("ready");
  const [puzzle, setPuzzle] = React.useState<CrosswordPuzzle | null>(null);
  const [letters, setLetters] = React.useState<Record<string, string>>({});
  const [wrong, setWrong] = React.useState<Set<string>>(new Set());
  const [hints, setHints] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [start, setStart] = React.useState(0);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);

  const begin = (lvl: Level) => {
    setLevel(lvl);
    setPuzzle(generateCrossword(lvl));
    setLetters({});
    setWrong(new Set());
    setHints(0);
    setRevealed(false);
    setMessage(null);
    setSaveResult(null);
    setStart(Date.now());
    setPhase("playing");
  };

  // numéro affiché au coin d'une case de départ
  const numAt = React.useMemo(() => {
    const m = new Map<string, number>();
    puzzle?.entries.forEach((e) => {
      const k = ck(e.row, e.col);
      if (!m.has(k)) m.set(k, e.num);
    });
    return m;
  }, [puzzle]);

  // première case blanche (en ordre de lecture) — pour y placer le curseur dès le démarrage
  const firstKey = React.useMemo(() => {
    if (!puzzle) return null;
    const keys = Object.keys(puzzle.solution).map((k) => k.split(",").map(Number));
    keys.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return keys.length ? `${keys[0][0]},${keys[0][1]}` : null;
  }, [puzzle]);
  const firstCellRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (phase !== "playing") return;
    const t = setTimeout(() => firstCellRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [phase, puzzle]);

  const finish = (success: boolean) => {
    if (!puzzle) return;
    setPhase("done");
    const durationSec = Math.round((Date.now() - start) / 1000);
    if (success && !revealed) {
      const points = Math.max(50, BASE[level] - hints * 80);
      recordBrainAttempt({ gameSlug: slug, level, success: true, durationSec, errors: hints, points })
        .then(setSaveResult)
        .catch(() => {});
    }
  };

  const check = () => {
    if (!puzzle) return;
    const bad = new Set<string>();
    for (const k of Object.keys(puzzle.solution)) {
      if ((letters[k] || "") !== puzzle.solution[k]) bad.add(k);
    }
    setWrong(bad);
    if (bad.size === 0) finish(true);
    else setMessage(`Il reste ${bad.size} case(s) à corriger.`);
  };

  const useHint = () => {
    if (!puzzle) return;
    const empties = Object.keys(puzzle.solution).filter((k) => (letters[k] || "") !== puzzle.solution[k]);
    if (empties.length === 0) return;
    const pick = empties[Math.floor(Math.random() * empties.length)];
    setHints((h) => h + 1);
    setLetters((l) => ({ ...l, [pick]: puzzle.solution[pick] }));
    setMessage(null);
  };

  const reveal = () => {
    if (!puzzle) return;
    setLetters({ ...puzzle.solution });
    setWrong(new Set());
    setRevealed(true);
    finish(false);
  };

  if (phase === "ready") {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Trouvez les mots à partir des définitions et remplissez la grille. Choisissez un niveau :</p>
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

  if (!puzzle) return null;
  const across = puzzle.entries.filter((e) => e.dir === "across");
  const down = puzzle.entries.filter((e) => e.dir === "down");

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Thème : <span className="text-foreground">{puzzle.theme}</span></p>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* Grille */}
        <div className="overflow-x-auto">
          <div
            className="inline-grid gap-1 rounded-xl bg-foreground/5 p-2"
            style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 2.25rem)` }}
          >
            {Array.from({ length: puzzle.rows * puzzle.cols }, (_, idx) => {
              const r = Math.floor(idx / puzzle.cols);
              const c = idx % puzzle.cols;
              const k = ck(r, c);
              const white = puzzle.solution[k] !== undefined;
              if (!white) return <div key={k} className="size-9 rounded bg-foreground/15" />;
              const num = numAt.get(k);
              return (
                <div key={k} className="relative size-9">
                  {num && <span className="pointer-events-none absolute left-0.5 top-0 z-10 text-[9px] font-bold text-muted-foreground">{num}</span>}
                  <input
                    ref={k === firstKey ? firstCellRef : undefined}
                    value={letters[k] || ""}
                    disabled={phase !== "playing"}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^a-zA-Z]/g, "").slice(-1).toUpperCase();
                      setMessage(null);
                      setWrong((w) => {
                        if (!w.has(k)) return w;
                        const n = new Set(w);
                        n.delete(k);
                        return n;
                      });
                      setLetters((l) => ({ ...l, [k]: v }));
                    }}
                    className={cn(
                      "size-9 rounded border-2 text-center text-base font-bold uppercase outline-none transition-colors focus:border-primary",
                      wrong.has(k) ? "border-unavailable bg-unavailable-soft text-unavailable-fg" : "border-border bg-card text-foreground"
                    )}
                    aria-label={`Case ligne ${r + 1} colonne ${c + 1}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Définitions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-primary">Horizontalement</p>
            <ul className="space-y-1 text-sm text-foreground">
              {across.map((e) => (
                <li key={`a${e.num}`}><span className="font-bold">{e.num}.</span> {e.clue} <span className="text-muted-foreground">({e.answer.length})</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-primary">Verticalement</p>
            <ul className="space-y-1 text-sm text-foreground">
              {down.map((e) => (
                <li key={`d${e.num}`}><span className="font-bold">{e.num}.</span> {e.clue} <span className="text-muted-foreground">({e.answer.length})</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {message && <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-center text-sm font-medium text-foreground">{message}</p>}

      {phase === "playing" && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={check}><CheckCircle2 className="size-4" /> Vérifier</Button>
          <Button variant="outline" onClick={useHint}><Lightbulb className="size-4" /> Indice {hints > 0 && `(${hints})`}</Button>
          <Button variant="ghost" onClick={reveal}><Eye className="size-4" /> Solution</Button>
        </div>
      )}

      {phase === "done" && (
        <div className="mx-auto mt-5 max-w-md space-y-3 text-center">
          {revealed ? (
            <div className="rounded-xl border border-border bg-secondary px-4 py-3 font-semibold text-foreground">Solution affichée (partie non comptabilisée).</div>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 font-bold text-available-fg">
              <Trophy className="size-5" /> Grille complétée ! {hints > 0 ? `${hints} indice(s) utilisé(s).` : "Sans aucun indice 🎯"}
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
          <Button onClick={() => begin(level)}><RefreshCw className="size-4" /> Nouvelle grille</Button>
        </div>
      )}
    </div>
  );
}
