"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ArrowLeft, GraduationCap, AlertCircle, Sparkles, Trophy, RotateCcw } from "lucide-react";
import { submitCertelDiagnostic, type CertelSubmitResult } from "@/app/actions/certel";
import { AUTOPOS, QCM, SELF_SCALE, CERTEL_REFS, levelForScore } from "@/lib/certel/diagnostic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];
type Step = "profil" | "auto" | "qcm" | "result";

export function CertelDiagnosticForm() {
  const [step, setStep] = React.useState<Step>("profil");
  const [profile, setProfile] = React.useState({ fullName: "", functionTitle: "", structure: "", contact: "" });
  const [autopos, setAutopos] = React.useState<number[]>(() => Array(AUTOPOS.length).fill(-1));
  const [qcm, setQcm] = React.useState<number[]>(() => Array(QCM.length).fill(-1));
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<CertelSubmitResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  const autoDone = autopos.filter((v) => v >= 0).length;
  const qcmDone = qcm.filter((v) => v >= 0).length;

  const goTo = (s: Step) => { setStep(s); setError(null); topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  async function submit() {
    if (autoDone < AUTOPOS.length) { setError("Répondez à toutes les questions d'auto-positionnement."); goTo("auto"); return; }
    if (qcmDone < QCM.length) { setError("Répondez à toutes les questions du QCM."); return; }
    setSubmitting(true);
    setError(null);
    const res = await submitCertelDiagnostic({ ...profile, autopos, qcm });
    setSubmitting(false);
    if (!res.ok) { setError(res.error ?? "Une erreur est survenue."); return; }
    setResult(res);
    goTo("result");
  }

  return (
    <div ref={topRef} className="mx-auto max-w-3xl">
      {/* En-tête */}
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><GraduationCap className="size-6" /></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Diagnostic de niveau CERTEL</h1>
          <p className="text-sm text-muted-foreground">Informatique, numérique &amp; intelligence artificielle</p>
        </div>
      </div>

      {step !== "result" && <Stepper step={step} autoDone={autoDone} qcmDone={qcmDone} />}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertCircle className="size-5 shrink-0" /> {error}
        </div>
      )}

      {/* ÉTAPE PROFIL */}
      {step === "profil" && (
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Ce test gratuit (~10 min) vous positionne sur l'un des 3 niveaux de la formation certifiante. Renseignez d'abord votre profil.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label htmlFor="fullName" required>Nom et prénom</Label><Input id="fullName" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder="Prénom NOM" /></div>
            <div><Label htmlFor="functionTitle">Fonction</Label><Input id="functionTitle" value={profile.functionTitle} onChange={(e) => setProfile({ ...profile, functionTitle: e.target.value })} placeholder="Ex. Enseignant, Étudiant…" /></div>
            <div><Label htmlFor="structure">Structure / établissement</Label><Input id="structure" value={profile.structure} onChange={(e) => setProfile({ ...profile, structure: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label htmlFor="contact">Téléphone / e-mail</Label><Input id="contact" value={profile.contact} onChange={(e) => setProfile({ ...profile, contact: e.target.value })} placeholder="Pour être recontacté(e)" /></div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => { if (profile.fullName.trim().length < 2) { setError("Veuillez indiquer votre nom et prénom."); return; } goTo("auto"); }}>
              Commencer <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE AUTO-POSITIONNEMENT */}
      {step === "auto" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Auto-positionnement — évaluez votre aisance pour chaque tâche.</p>
            <p>0 = {SELF_SCALE[0].label} · 1 = {SELF_SCALE[1].label} · 2 = {SELF_SCALE[2].label} · 3 = {SELF_SCALE[3].label}</p>
          </div>
          <ol className="space-y-2.5">
            {AUTOPOS.map((item, i) => (
              <li key={i} className="rounded-xl border border-border bg-card px-4 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-foreground"><span className="mr-1.5 text-xs font-bold text-advanced-fg">{i + 1}.</span>{item}</span>
                  <div className="flex shrink-0 gap-1">
                    {SELF_SCALE.map((s) => (
                      <button key={s.value} type="button" title={s.label} onClick={() => setAutopos((a) => a.map((v, j) => (j === i ? s.value : v)))}
                        className={cn("size-9 rounded-lg text-sm font-bold transition-colors", autopos[i] === s.value ? "bg-advanced text-white" : "bg-secondary text-muted-foreground hover:bg-advanced-soft hover:text-advanced-fg")}>
                        {s.value}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <NavButtons onBack={() => goTo("profil")} onNext={() => { if (autoDone < AUTOPOS.length) { setError(`Encore ${AUTOPOS.length - autoDone} question(s) à compléter.`); return; } goTo("qcm"); }} nextLabel="Continuer vers le QCM" />
        </div>
      )}

      {/* ÉTAPE QCM */}
      {step === "qcm" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">QCM — 30 questions, une seule bonne réponse par question.</p>
          </div>
          <ol className="space-y-3">
            {QCM.map((item, i) => (
              <li key={i} className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="text-sm font-semibold text-foreground"><span className="mr-1.5 text-xs font-bold text-advanced-fg">{i + 1}.</span>{item.q}</p>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {item.options.map((opt, oi) => (
                    <button key={oi} type="button" onClick={() => setQcm((a) => a.map((v, j) => (j === i ? oi : v)))}
                      className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors", qcm[i] === oi ? "border-advanced bg-advanced-soft font-semibold text-advanced-fg" : "border-border hover:border-advanced/40 hover:bg-secondary")}>
                      <span className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded text-xs font-bold", qcm[i] === oi ? "bg-advanced text-white" : "bg-secondary text-muted-foreground")}>{LETTERS[oi]}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <NavButtons onBack={() => goTo("auto")} onNext={submit} nextLabel="Voir mon résultat" loading={submitting} icon={<Trophy className="size-4" />} />
        </div>
      )}

      {/* ÉTAPE RÉSULTAT */}
      {step === "result" && result?.ok && result.scores && result.levelKey && (
        <ResultView result={result} />
      )}
    </div>
  );
}

function Stepper({ step, autoDone, qcmDone }: { step: Step; autoDone: number; qcmDone: number }) {
  const steps: { key: Step; label: string; hint?: string }[] = [
    { key: "profil", label: "Profil" },
    { key: "auto", label: "Auto-positionnement", hint: `${autoDone}/${AUTOPOS.length}` },
    { key: "qcm", label: "QCM", hint: `${qcmDone}/${QCM.length}` },
  ];
  const idx = steps.findIndex((s) => s.key === step);
  return (
    <div className="mb-5 flex items-center gap-2">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold", i <= idx ? "bg-advanced text-white" : "bg-secondary text-muted-foreground")}>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/25 text-[11px]">{i + 1}</span>
            <span className="hidden sm:inline">{s.label}</span>
            {s.hint && i === idx && <span className="opacity-80">· {s.hint}</span>}
          </div>
          {i < steps.length - 1 && <span className={cn("h-0.5 flex-1 rounded", i < idx ? "bg-advanced" : "bg-border")} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel, loading, icon }: { onBack: () => void; onNext: () => void; nextLabel: string; loading?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/90 p-2.5 backdrop-blur">
      <Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> Retour</Button>
      <Button onClick={onNext} disabled={loading} className="bg-advanced text-white hover:bg-advanced/90">
        {loading ? <Loader2 className="size-4 animate-spin" /> : icon ?? <ArrowRight className="size-4" />} {nextLabel}
      </Button>
    </div>
  );
}

function ResultView({ result }: { result: CertelSubmitResult }) {
  const s = result.scores!;
  const level = levelForScore(s.score100);
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border-2 p-8 text-center" style={{ borderColor: level.accent }}>
        <span className="mx-auto mb-3 inline-flex size-14 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: level.accent }}><Sparkles className="size-7" /></span>
        <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Votre niveau conseillé</p>
        <p className="mt-1 text-2xl font-extrabold" style={{ color: level.accent }}>{level.key} — {level.title}</p>
        <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-2">
          <span className="text-5xl font-extrabold text-foreground">{s.score100}</span>
          <span className="text-lg text-muted-foreground">/ 100</span>
        </div>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{level.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ScorePill label="Auto-positionnement" value={s.autopos} max={30} />
        <ScorePill label="QCM" value={s.qcm} max={30} />
        <ScorePill label="Partie en ligne" value={s.online60} max={60} />
      </div>

      <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        Score provisoire calculé sur la partie en ligne (auto-positionnement + QCM). Les <strong className="text-foreground">tâches pratiques (/40)</strong> complètent le diagnostic certifiant lors d'un entretien avec un formateur. {CERTEL_REFS}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild className="bg-advanced text-white hover:bg-advanced/90"><Link href={`/certel#${level.key}`}><GraduationCap className="size-4" /> Voir le programme du {level.key}</Link></Button>
        <Button asChild variant="outline"><Link href="/register">Créer un compte</Link></Button>
        <Button asChild variant="ghost"><Link href="/certel/diagnostic"><RotateCcw className="size-4" /> Refaire le test</Link></Button>
      </div>
    </div>
  );
}

function ScorePill({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3 text-center">
      <p className="text-lg font-extrabold text-foreground">{value}<span className="text-sm font-semibold text-muted-foreground">/{max}</span></p>
      <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
