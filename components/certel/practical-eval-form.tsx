"use client";

import * as React from "react";
import Link from "next/link";
import {
  Loader2, Upload, Sparkles, CheckCircle2, AlertTriangle, XCircle, FileText,
  GraduationCap, Wand2, Paperclip, Info, RotateCcw,
} from "lucide-react";
import { evaluateCertelTask, finalizeCertelPractical, type FinalizePracticalResult } from "@/app/actions/certel";
import {
  PRACTICAL_TASKS, ACCEPTED_EXT, MAX_FILE_BYTES, PRACTICAL_TOTAL, VERDICT_LABEL,
  type TaskEvaluation, type TaskVerdict,
} from "@/lib/certel/practical";
import { levelForScore } from "@/lib/certel/diagnostic";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  diagnosticId: string;
  fullName: string;
  online60: number;
  score100: number;
  initialResults?: TaskEvaluation[];
  initialSummary?: FinalizePracticalResult;
}

type Inputs = Record<string, { file: File | null; text: string }>;

const VERDICT_STYLE: Record<TaskVerdict, { cls: string; icon: React.ReactNode }> = {
  reussi: { cls: "bg-available-soft text-available-fg", icon: <CheckCircle2 className="size-3.5" /> },
  partiel: { cls: "bg-pending-soft text-pending-fg", icon: <AlertTriangle className="size-3.5" /> },
  insuffisant: { cls: "bg-unavailable-soft text-unavailable-fg", icon: <XCircle className="size-3.5" /> },
  illisible: { cls: "bg-unavailable-soft text-unavailable-fg", icon: <XCircle className="size-3.5" /> },
  pending: { cls: "bg-secondary text-muted-foreground", icon: <Info className="size-3.5" /> },
};

export function CertelPracticalEvalForm({ diagnosticId, fullName, online60, score100, initialResults, initialSummary }: Props) {
  const [inputs, setInputs] = React.useState<Inputs>(() => {
    const o: Inputs = {};
    for (const t of PRACTICAL_TASKS) o[t.key] = { file: null, text: "" };
    return o;
  });
  const [results, setResults] = React.useState<Record<string, TaskEvaluation>>(() => {
    const o: Record<string, TaskEvaluation> = {};
    for (const r of initialResults ?? []) o[r.key] = r;
    return o;
  });
  const [busyKey, setBusyKey] = React.useState<string | null>(null);
  const [running, setRunning] = React.useState(false);
  const [summary, setSummary] = React.useState<FinalizePracticalResult | null>(initialSummary ?? null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const hasInput = (key: string) => Boolean(inputs[key]?.file || inputs[key]?.text.trim());
  const tasksWithInput = PRACTICAL_TASKS.filter((t) => hasInput(t.key));

  function setFile(key: string, file: File | null) {
    setInputs((p) => ({ ...p, [key]: { ...p[key], file } }));
  }
  function setText(key: string, text: string) {
    setInputs((p) => ({ ...p, [key]: { ...p[key], text } }));
  }

  async function runAll() {
    if (tasksWithInput.length === 0) {
      setError("Déposez au moins un fichier ou saisissez une réponse pour une tâche avant de lancer l'évaluation.");
      return;
    }
    setError(null);
    setRunning(true);
    const collected: Record<string, TaskEvaluation> = { ...results };
    for (const task of tasksWithInput) {
      setBusyKey(task.key);
      try {
        const fd = new FormData();
        fd.set("taskKey", task.key);
        if (inputs[task.key].text.trim()) fd.set("text", inputs[task.key].text.trim());
        if (inputs[task.key].file) fd.set("file", inputs[task.key].file as File);
        const res = await evaluateCertelTask(fd);
        collected[task.key] = res;
        setResults((p) => ({ ...p, [task.key]: res }));
      } catch {
        const fail: TaskEvaluation = { key: task.key, title: task.title, max: task.max, score: 0, verdict: "pending", justification: "Erreur réseau pendant l'évaluation. Réessayez.", strengths: [], gaps: [], evaluatedBy: "pending" };
        collected[task.key] = fail;
        setResults((p) => ({ ...p, [task.key]: fail }));
      }
    }
    setBusyKey(null);
    const fin = await finalizeCertelPractical({ id: diagnosticId, evaluations: Object.values(collected) });
    setSummary(fin);
    setRunning(false);
  }

  const hasRun = Object.keys(results).length > 0;

  return (
    <div className="space-y-5">
      {/* Bandeau récapitulatif */}
      {summary?.ok && summary.total100 != null && (
        <SummaryBanner summary={summary} online60={online60} diagnosticId={diagnosticId} />
      )}

      <div className="rounded-2xl border border-advanced/20 bg-advanced-soft/40 p-4 text-sm">
        <p className="flex items-center gap-1.5 font-bold text-advanced-fg"><Wand2 className="size-4" /> Évaluation assistée par l'IA</p>
        <p className="mt-1 text-foreground">Déposez vos productions pour les 8 tâches pratiques (total {PRACTICAL_TOTAL} points). L'IA évalue chaque dépôt au regard de la consigne et attribue un score motivé. Le résultat complète votre partie en ligne ({online60}/60) pour obtenir le score certifiant /100.</p>
        <p className="mt-1.5 text-xs text-muted-foreground">Formats : PDF, images (capture d'écran), texte. Pour Word, Excel ou PowerPoint, enregistrez en PDF ou déposez une capture. Taille max 4 Mo par fichier.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5 shrink-0" /> {error}
        </div>
      )}

      <ol className="space-y-3">
        {PRACTICAL_TASKS.map((task) => {
          const res = results[task.key];
          const isBusy = busyKey === task.key;
          return (
            <li key={task.key} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground"><span className="mr-1.5 text-xs font-bold text-advanced-fg">{task.n}.</span>{task.title} <span className="text-xs font-semibold text-muted-foreground">· {task.max} pts</span></p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{task.consigne}</p>
                </div>
                {res && !isBusy && <VerdictBadge res={res} />}
                {isBusy && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-advanced-soft px-2.5 py-1 text-xs font-bold text-advanced-fg"><Loader2 className="size-3.5 animate-spin" /> Évaluation…</span>}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <input
                    ref={(el) => { fileInputs.current[task.key] = el; }}
                    type="file"
                    accept={ACCEPTED_EXT}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      if (f && f.size > MAX_FILE_BYTES) { setError(`« ${f.name} » dépasse 4 Mo. Compressez-le, exportez en PDF ou faites une capture.`); e.target.value = ""; return; }
                      setError(null);
                      setFile(task.key, f);
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="w-full justify-start" onClick={() => fileInputs.current[task.key]?.click()} disabled={running}>
                    <Upload className="size-4" /> {inputs[task.key].file ? "Changer le fichier" : "Déposer un fichier"}
                  </Button>
                  {inputs[task.key].file && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Paperclip className="size-3" /> {inputs[task.key].file!.name}</p>
                  )}
                </div>
                <div>
                  <textarea
                    value={inputs[task.key].text}
                    onChange={(e) => setText(task.key, e.target.value)}
                    disabled={running}
                    rows={2}
                    placeholder="Ou saisissez votre réponse / le contenu ici…"
                    className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-advanced focus:ring-1 focus:ring-advanced"
                  />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{task.hint}</p>

              {res && !isBusy && <ResultPanel res={res} />}
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/90 p-2.5 backdrop-blur">
        <p className="px-2 text-xs text-muted-foreground">{tasksWithInput.length} tâche(s) prête(s) à évaluer</p>
        <Button onClick={runAll} disabled={running} className="bg-advanced text-white hover:bg-advanced/90">
          {running ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {running ? "Évaluation en cours…" : hasRun ? "Relancer l'évaluation IA" : "Lancer l'évaluation IA"}
        </Button>
      </div>
    </div>
  );
}

function VerdictBadge({ res }: { res: TaskEvaluation }) {
  const st = VERDICT_STYLE[res.verdict];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", st.cls)}>
      {st.icon}
      {res.evaluatedBy === "ai" ? `${res.score}/${res.max}` : VERDICT_LABEL[res.verdict]}
    </span>
  );
}

function ResultPanel({ res }: { res: TaskEvaluation }) {
  return (
    <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
      <p className="text-foreground">{res.justification}</p>
      {(res.strengths.length > 0 || res.gaps.length > 0) && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {res.strengths.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-available-fg">Points forts</p>
              <ul className="mt-0.5 space-y-0.5">{res.strengths.map((s, i) => <li key={i} className="flex gap-1.5 text-xs text-foreground"><CheckCircle2 className="mt-0.5 size-3 shrink-0 text-available-fg" />{s}</li>)}</ul>
            </div>
          )}
          {res.gaps.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-pending-fg">À améliorer</p>
              <ul className="mt-0.5 space-y-0.5">{res.gaps.map((s, i) => <li key={i} className="flex gap-1.5 text-xs text-foreground"><AlertTriangle className="mt-0.5 size-3 shrink-0 text-pending-fg" />{s}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryBanner({ summary, online60, diagnosticId }: { summary: FinalizePracticalResult; online60: number; diagnosticId: string }) {
  const total = summary.total100 ?? 0;
  const level = levelForScore(total);
  return (
    <div className="rounded-3xl border-2 p-6 text-center" style={{ borderColor: level.accent }}>
      <span className="mx-auto mb-2 inline-flex size-12 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: level.accent }}><GraduationCap className="size-6" /></span>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{summary.complete ? "Score certifiant consolidé" : "Score consolidé (partiel)"}</p>
      <div className="mt-1 flex items-center justify-center gap-2">
        <span className="text-4xl font-extrabold text-foreground">{total}</span><span className="text-muted-foreground">/ 100</span>
      </div>
      <p className="mt-1 text-sm font-semibold" style={{ color: level.accent }}>{level.key} — {level.title}</p>
      <div className="mx-auto mt-3 grid max-w-md grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border bg-card px-2 py-1.5"><p className="font-extrabold text-foreground">{online60}<span className="text-muted-foreground">/60</span></p><p className="text-[10px] text-muted-foreground">En ligne</p></div>
        <div className="rounded-lg border border-border bg-card px-2 py-1.5"><p className="font-extrabold text-foreground">{summary.practicalScore ?? 0}<span className="text-muted-foreground">/40</span></p><p className="text-[10px] text-muted-foreground">Tâches pratiques ({summary.tasksEvaluated ?? 0}/8)</p></div>
      </div>
      {!summary.complete && <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">Évaluez les 8 tâches pour obtenir le score certifiant complet.</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button asChild variant="outline"><Link href={`/certel/resultats/${diagnosticId}`}><FileText className="size-4" /> Voir mes réponses</Link></Button>
        <Button asChild className="text-white hover:opacity-90"><Link href={`/certel#${level.key}`} style={{ backgroundColor: level.accent }}><GraduationCap className="size-4" /> Programme du {level.key}</Link></Button>
      </div>
    </div>
  );
}
