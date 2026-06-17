"use client";

import * as React from "react";
import { CheckCircle2, XCircle, RefreshCw, Trophy, Play, Lightbulb, Eye, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { genLogigramme, type Logigramme } from "@/lib/games/logigramme";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

type Level = "facile" | "moyen" | "difficile";
const LEVELS: { key: Level; label: string }[] = [
  { key: "facile", label: "Débutant" },
  { key: "moyen", label: "Intermédiaire" },
  { key: "difficile", label: "Avancé" },
];
const BASE: Record<Level, number> = { facile: 600, moyen: 1000, difficile: 1600 };
type Mark = "yes" | "no";

export function Logigramme({ initialLevel = "facile", slug = "logigrammes" }: { initialLevel?: Level; slug?: string }) {
  const [level, setLevel] = React.useState<Level>(initialLevel);
  const [phase, setPhase] = React.useState<"ready" | "playing" | "done">("ready");
  const [puzzle, setPuzzle] = React.useState<Logigramme | null>(null);
  const [marks, setMarks] = React.useState<Record<string, Mark>>({});
  const [hints, setHints] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [start, setStart] = React.useState(0);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);

  const begin = (lvl: Level) => {
    setLevel(lvl);
    setPuzzle(genLogigramme(lvl));
    setMarks({});
    setHints(0);
    setRevealed(false);
    setMessage(null);
    setSaveResult(null);
    setStart(Date.now());
    setPhase("playing");
  };

  const cellKey = (item: number, slot: number) => `${item}_${slot}`;

  const cycle = (item: number, slot: number) => {
    const k = cellKey(item, slot);
    setMessage(null);
    setMarks((m) => {
      const next = { ...m };
      const cur = next[k];
      if (cur === undefined) next[k] = "yes";
      else if (cur === "yes") next[k] = "no";
      else delete next[k];
      return next;
    });
  };

  const finish = (success: boolean) => {
    if (!puzzle) return;
    setPhase("done");
    const durationSec = Math.round((Date.now() - start) / 1000);
    if (success && !revealed) {
      const points = Math.max(50, BASE[level] - hints * 150);
      recordBrainAttempt({ gameSlug: slug, level, success: true, durationSec, errors: hints, points })
        .then(setSaveResult)
        .catch(() => {});
    }
  };

  const check = () => {
    if (!puzzle) return;
    const n = puzzle.n;
    let correct = 0;
    let ok = true;
    const colUsed = new Set<number>();
    for (let i = 0; i < n; i++) {
      const yes = [];
      for (let s = 0; s < n; s++) if (marks[cellKey(i, s)] === "yes") yes.push(s);
      if (yes.length === 1) {
        if (yes[0] === puzzle.solution[i]) correct++;
        if (colUsed.has(yes[0])) ok = false;
        colUsed.add(yes[0]);
      } else ok = false;
    }
    if (ok && correct === n) {
      finish(true);
    } else {
      setMessage(`${correct}/${n} association(s) correcte(s) pour l'instant. Continuez !`);
    }
  };

  const useHint = () => {
    if (!puzzle) return;
    const n = puzzle.n;
    // trouve un sujet pas encore correctement placé
    const target = Array.from({ length: n }, (_, i) => i).find((i) => marks[cellKey(i, puzzle.solution[i])] !== "yes");
    if (target === undefined) return;
    setHints((h) => h + 1);
    setMessage(null);
    setMarks((m) => {
      const next = { ...m };
      const s = puzzle.solution[target];
      next[cellKey(target, s)] = "yes";
      for (let k = 0; k < n; k++) {
        if (k !== s) next[cellKey(target, k)] = "no";
        if (k !== target) next[cellKey(k, s)] = "no";
      }
      return next;
    });
  };

  const reveal = () => {
    if (!puzzle) return;
    const n = puzzle.n;
    const full: Record<string, Mark> = {};
    for (let i = 0; i < n; i++)
      for (let s = 0; s < n; s++) full[cellKey(i, s)] = s === puzzle.solution[i] ? "yes" : "no";
    setMarks(full);
    setRevealed(true);
    finish(false);
  };

  if (phase === "ready") {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Croisez les indices pour reconstituer la situation. Choisissez un niveau :</p>
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
  const n = puzzle.n;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-4 text-sm text-muted-foreground">{puzzle.intro}</p>

      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        {/* Indices */}
        <div className="order-2 rounded-2xl border border-border bg-secondary/40 p-4 md:order-1">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Indices</p>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-foreground">
            {puzzle.clues.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
        </div>

        {/* Grille */}
        <div className="order-1 overflow-x-auto md:order-2">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-1" />
                {puzzle.slotLabels.map((s, j) => (
                  <th key={j} className="whitespace-nowrap px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {puzzle.items.map((name, i) => (
                <tr key={i}>
                  <th className="whitespace-nowrap py-1 pr-3 text-right font-semibold text-foreground">{name}</th>
                  {Array.from({ length: n }, (_, s) => {
                    const mk = marks[cellKey(i, s)];
                    return (
                      <td key={s} className="p-0.5">
                        <button
                          type="button"
                          onClick={() => phase === "playing" && cycle(i, s)}
                          disabled={phase !== "playing"}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg border-2 text-base font-bold transition-colors",
                            mk === "yes"
                              ? "border-available bg-available-soft text-available-fg"
                              : mk === "no"
                                ? "border-unavailable/40 bg-unavailable-soft text-unavailable-fg"
                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary-50"
                          )}
                          aria-label={`${name} — ${puzzle.slotLabels[s]}`}
                        >
                          {mk === "yes" ? "✓" : mk === "no" ? "✗" : ""}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">Cliquez une case pour alterner ✓ (vrai) → ✗ (impossible) → vide.</p>
        </div>
      </div>

      {message && <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-center text-sm font-medium text-foreground">{message}</p>}

      {phase === "playing" && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={check}><CheckCircle2 className="size-4" /> Vérifier</Button>
          <Button variant="outline" onClick={useHint}><Lightbulb className="size-4" /> Indice {hints > 0 && `(${hints})`}</Button>
          <Button variant="outline" onClick={() => { setMarks({}); setMessage(null); }}><Eraser className="size-4" /> Effacer</Button>
          <Button variant="ghost" onClick={reveal}><Eye className="size-4" /> Solution</Button>
        </div>
      )}

      {phase === "done" && (
        <div className="mx-auto mt-5 max-w-md space-y-3 text-center">
          {revealed ? (
            <div className="rounded-xl border border-border bg-secondary px-4 py-3 font-semibold text-foreground">Solution affichée (partie non comptabilisée).</div>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 font-bold text-available-fg">
              <Trophy className="size-5" /> Énigme résolue ! {hints > 0 ? `${hints} indice(s) utilisé(s).` : "Sans aucun indice 🎯"}
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
          <Button onClick={() => begin(level)}><RefreshCw className="size-4" /> Nouvelle énigme</Button>
        </div>
      )}
    </div>
  );
}
