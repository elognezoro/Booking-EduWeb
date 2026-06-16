"use client";

import * as React from "react";
import { Timer, CheckCircle2, XCircle, RefreshCw, Trophy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { recordBrainAttempt, type RecordResult } from "@/app/actions/brain-sport";
import { getBadge } from "@/lib/games/badges";

type Level = "facile" | "moyen" | "difficile";
const LEVELS: { key: Level; label: string }[] = [
  { key: "facile", label: "Débutant" },
  { key: "moyen", label: "Intermédiaire" },
  { key: "difficile", label: "Avancé" },
];
const TIME: Record<Level, number> = { facile: 60, moyen: 75, difficile: 90 };
const MULT: Record<Level, number> = { facile: 10, moyen: 15, difficile: 25 };

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

function genProblem(level: Level): { text: string; answer: number } {
  if (level === "facile") {
    const op = Math.random() < 0.5 ? "+" : "−";
    let a = rnd(1, 20), b = rnd(1, 20);
    if (op === "−" && b > a) [a, b] = [b, a];
    return { text: `${a} ${op} ${b}`, answer: op === "+" ? a + b : a - b };
  }
  if (level === "moyen") {
    const r = Math.random();
    if (r < 0.4) { const a = rnd(2, 12), b = rnd(2, 12); return { text: `${a} × ${b}`, answer: a * b }; }
    const op = Math.random() < 0.5 ? "+" : "−";
    let a = rnd(5, 50), b = rnd(5, 50);
    if (op === "−" && b > a) [a, b] = [b, a];
    return { text: `${a} ${op} ${b}`, answer: op === "+" ? a + b : a - b };
  }
  // difficile
  const r = Math.random();
  if (r < 0.33) { const a = rnd(3, 15), b = rnd(3, 15); return { text: `${a} × ${b}`, answer: a * b }; }
  if (r < 0.66) { const b = rnd(2, 12), q = rnd(2, 12); return { text: `${b * q} ÷ ${b}`, answer: q }; }
  const op = Math.random() < 0.5 ? "+" : "−";
  let a = rnd(20, 99), b = rnd(20, 99);
  if (op === "−" && b > a) [a, b] = [b, a];
  return { text: `${a} ${op} ${b}`, answer: op === "+" ? a + b : a - b };
}

export function CalculMental({ initialLevel = "facile", slug = "calcul-mental" }: { initialLevel?: Level; slug?: string }) {
  const [level, setLevel] = React.useState<Level>(initialLevel);
  const [phase, setPhase] = React.useState<"ready" | "playing" | "done">("ready");
  const [problem, setProblem] = React.useState<{ text: string; answer: number } | null>(null);
  const [value, setValue] = React.useState("");
  const [correct, setCorrect] = React.useState(0);
  const [wrong, setWrong] = React.useState(0);
  const [left, setLeft] = React.useState(TIME[initialLevel]);
  const [flash, setFlash] = React.useState<"ok" | "ko" | null>(null);
  const [saveResult, setSaveResult] = React.useState<RecordResult | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const start = (lvl: Level) => {
    setLevel(lvl);
    setPhase("playing");
    setCorrect(0); setWrong(0); setFlash(null); setSaveResult(null);
    setLeft(TIME[lvl]);
    setProblem(genProblem(lvl));
    setValue("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Décompte
  React.useEffect(() => {
    if (phase !== "playing") return;
    if (left <= 0) { setPhase("done"); return; }
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, left]);

  // Enregistrement à la fin
  React.useEffect(() => {
    if (phase !== "done") return;
    const points = correct * MULT[level];
    recordBrainAttempt({ gameSlug: slug, level, success: correct > 0, durationSec: TIME[level], errors: wrong, points })
      .then(setSaveResult).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const submit = () => {
    if (phase !== "playing" || !problem || value.trim() === "") return;
    const ok = Number(value) === problem.answer;
    if (ok) setCorrect((c) => c + 1); else setWrong((w) => w + 1);
    setFlash(ok ? "ok" : "ko");
    setTimeout(() => setFlash(null), 250);
    setProblem(genProblem(level));
    setValue("");
  };

  if (phase === "ready") {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Résolvez un maximum d'opérations avant la fin du temps. Choisissez un niveau :</p>
        <div className="flex flex-wrap justify-center gap-2">
          {LEVELS.map((l) => (
            <Button key={l.key} variant={l.key === level ? "default" : "outline"} onClick={() => start(l.key)}>
              <Play className="size-4" /> {l.label} · {TIME[l.key]}s
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
          <Trophy className="size-5" /> Terminé ! {correct} bonne(s) réponse(s), {wrong} erreur(s).
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
        <Button onClick={() => start(level)}><RefreshCw className="size-4" /> Rejouer</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-bold", left <= 10 ? "bg-unavailable-soft text-unavailable-fg" : "bg-secondary text-foreground")}>
          <Timer className="size-4" /> {left}s
        </span>
        <span className="text-sm font-semibold text-muted-foreground">
          <CheckCircle2 className="mr-1 inline size-4 text-available" />{correct}
          <XCircle className="ml-3 mr-1 inline size-4 text-unavailable" />{wrong}
        </span>
      </div>
      <div className={cn("rounded-2xl border-2 p-8 text-center transition-colors", flash === "ok" ? "border-available bg-available-soft" : flash === "ko" ? "border-unavailable bg-unavailable-soft" : "border-border bg-card")}>
        <p className="text-4xl font-extrabold tracking-tight text-foreground">{problem?.text} = ?</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-4 flex gap-2">
        <Input ref={inputRef} type="number" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Votre réponse" className="h-12 text-center text-lg" autoFocus />
        <Button type="submit" size="lg">Valider</Button>
      </form>
    </div>
  );
}
