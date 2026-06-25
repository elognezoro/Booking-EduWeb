import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, GraduationCap, Sparkles, ArrowLeft, ClipboardCheck, AlertTriangle, Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { GuidePrintActions } from "@/components/help/guide-print-actions";
import { AUTOPOS, QCM, SELF_SCALE, levelForScore, CERTEL_REFS } from "@/lib/certel/diagnostic";
import { VERDICT_LABEL, type TaskEvaluation } from "@/lib/certel/practical";
import { correctedQcm } from "@/lib/certel/scoring";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réponses au diagnostic CERTEL" };

const LETTERS = ["A", "B", "C", "D"];

export default async function CertelResultPage({ params }: { params: { id: string } }) {
  const d = await prisma.certelDiagnostic.findUnique({ where: { id: params.id } });
  if (!d) notFound();

  let practical: { evaluations: TaskEvaluation[]; tasksEvaluated: number; complete: boolean } | null = null;
  if (d.practicalDetails) {
    try {
      const p = JSON.parse(d.practicalDetails);
      if (Array.isArray(p.evaluations)) practical = { evaluations: p.evaluations, tasksEvaluated: p.tasksEvaluated ?? 0, complete: Boolean(p.complete) };
    } catch { /* ignore */ }
  }
  const consolidated = d.total100 != null && practical?.complete;
  const headlineScore = consolidated ? d.total100! : d.score100;
  const level = levelForScore(headlineScore);

  let parsed: { autopos?: number[]; qcm?: number[] } = {};
  try { parsed = JSON.parse(d.answers || "{}"); } catch { /* ignore */ }
  const autopos = Array.isArray(parsed.autopos) ? parsed.autopos : [];
  const qcm = Array.isArray(parsed.qcm) ? parsed.qcm : [];
  const correction = correctedQcm(qcm);
  const issuedOn = d.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const profile = [d.functionTitle, d.structure, d.contact].filter(Boolean).join(" · ");

  return (
    <section className="section py-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="no-print flex items-center justify-between gap-2">
          <Button asChild variant="ghost"><Link href="/certel"><ArrowLeft className="size-4" /> Programme CERTEL</Link></Button>
          <GuidePrintActions auto={false} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-advanced-fg">CERTification E-Learning · Réponses</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Diagnostic de {d.fullName}</h1>
          {(profile || issuedOn) && <p className="text-sm text-muted-foreground">{[profile, issuedOn].filter(Boolean).join(" — ")}</p>}
        </div>

        {/* Résultat */}
        <div className="rounded-3xl border-2 p-6 text-center" style={{ borderColor: level.accent }}>
          <span className="mx-auto mb-2 inline-flex size-12 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: level.accent }}><Sparkles className="size-6" /></span>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{consolidated ? "Niveau certifiant" : "Niveau conseillé"}</p>
          <p className="mt-1 text-xl font-extrabold" style={{ color: level.accent }}>{level.key} — {level.title}</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-4xl font-extrabold text-foreground">{headlineScore}</span><span className="text-muted-foreground">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{consolidated ? "Score certifiant (en ligne + tâches pratiques)" : "Score provisoire (partie en ligne ; tâches pratiques non évaluées)"}</p>
          <div className={`mx-auto mt-3 grid max-w-md gap-2 text-xs ${d.practicalScore != null ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
            <Pill label="Auto-position." value={d.autoposScore} max={30} />
            <Pill label="QCM" value={d.qcmScore} max={30} />
            <Pill label="En ligne" value={d.online60} max={60} />
            {d.practicalScore != null && <Pill label="Pratiques" value={d.practicalScore} max={40} />}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Sparkles className="size-4 text-advanced-fg" /> Appréciation</h2>
          <p className="text-sm leading-relaxed text-foreground">{level.appreciation}</p>
          <p className="mt-2 text-sm text-foreground"><GraduationCap className="mr-1 inline size-4" style={{ color: level.accent }} />{level.suggestion}</p>
        </div>

        {/* Auto-positionnement */}
        <section className="break-inside-avoid">
          <h2 className="mb-2 text-lg font-bold text-foreground">Auto-positionnement <span className="text-sm font-semibold text-muted-foreground">· {d.autoposScore}/30</span></h2>
          <ol className="space-y-1.5">
            {AUTOPOS.map((item, i) => {
              const v = autopos[i];
              const meta = SELF_SCALE.find((s) => s.value === v);
              return (
                <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm">
                  <span className="text-foreground"><span className="mr-1.5 text-xs font-bold text-advanced-fg">{i + 1}.</span>{item}</span>
                  <span className="shrink-0 rounded-md bg-advanced-soft px-2 py-0.5 text-xs font-semibold text-advanced-fg">{meta ? `${v} · ${meta.label}` : "Non renseigné"}</span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* QCM avec corrigé */}
        <section className="break-inside-avoid">
          <h2 className="mb-2 text-lg font-bold text-foreground">QCM <span className="text-sm font-semibold text-muted-foreground">· {d.qcmScore}/30</span></h2>
          <ol className="space-y-2">
            {QCM.map((item, i) => {
              const c = correction[i];
              return (
                <li key={i} className="rounded-xl border border-border bg-card px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground"><span className="mr-1.5 text-xs font-bold text-advanced-fg">{i + 1}.</span>{item.q}</p>
                    {c.ok ? <CheckCircle2 className="size-5 shrink-0 text-available-fg" /> : <XCircle className="size-5 shrink-0 text-unavailable-fg" />}
                  </div>
                  <p className="mt-1 text-sm">
                    <span className="text-muted-foreground">Votre réponse : </span>
                    <span className={c.ok ? "font-semibold text-available-fg" : "font-semibold text-unavailable-fg"}>
                      {c.chosen >= 0 ? `${LETTERS[c.chosen]}. ${item.options[c.chosen]}` : "Non répondu"}
                    </span>
                  </p>
                  {!c.ok && (
                    <p className="text-sm"><span className="text-muted-foreground">Bonne réponse : </span><span className="font-semibold text-foreground">{LETTERS[c.correct]}. {item.options[c.correct]}</span></p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* Tâches pratiques évaluées par l'IA */}
        {practical && practical.evaluations.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="mb-2 text-lg font-bold text-foreground">Tâches pratiques <span className="text-sm font-semibold text-muted-foreground">· {d.practicalScore ?? 0}/40 · {practical.tasksEvaluated}/8 évaluées</span></h2>
            <ol className="space-y-2">
              {practical.evaluations.map((e) => (
                <li key={e.key} className="rounded-xl border border-border bg-card px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{e.title}</p>
                    {e.evaluatedBy === "ai"
                      ? <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${e.verdict === "reussi" ? "bg-available-soft text-available-fg" : e.verdict === "partiel" ? "bg-pending-soft text-pending-fg" : "bg-unavailable-soft text-unavailable-fg"}`}>{e.score}/{e.max}</span>
                      : <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground"><Info className="size-3" /> {VERDICT_LABEL[e.verdict]}</span>}
                  </div>
                  {e.justification && <p className="mt-1 text-sm text-muted-foreground">{e.justification}</p>}
                  {e.gaps && e.gaps.length > 0 && (
                    <ul className="mt-1 space-y-0.5">{e.gaps.map((g, i) => <li key={i} className="flex gap-1.5 text-xs text-foreground"><AlertTriangle className="mt-0.5 size-3 shrink-0 text-pending-fg" />{g}</li>)}</ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          Les <strong className="text-foreground">tâches pratiques (/40)</strong> complètent le diagnostic certifiant (/100). {practical ? "Vous pouvez compléter ou revoir leur évaluation à tout moment." : "Déposez vos productions pour les faire évaluer par l'IA."} {CERTEL_REFS}
        </div>

        <div className="no-print flex flex-wrap gap-2">
          <Button asChild className="bg-advanced text-white hover:bg-advanced/90"><Link href={`/certel/evaluation/${d.id}`}><ClipboardCheck className="size-4" /> {practical ? "Compléter / revoir les tâches pratiques" : "Évaluer mes tâches pratiques (/40)"}</Link></Button>
          <Button asChild variant="outline"><Link href={`/certel#${level.key}`}><GraduationCap className="size-4" /> Programme du {level.key}</Link></Button>
        </div>
      </div>
    </section>
  );
}

function Pill({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-2 py-1.5">
      <p className="font-extrabold text-foreground">{value}<span className="text-muted-foreground">/{max}</span></p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
