"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ArrowLeft, GraduationCap, AlertCircle, Sparkles, Trophy, RotateCcw, FileText, ClipboardCheck, Wand2 } from "lucide-react";
import { submitCertelDiagnostic, type CertelSubmitResult } from "@/app/actions/certel";
import { AUTOPOS, QCM, SELF_SCALE, CERTEL_REFS, levelForScore } from "@/lib/certel/diagnostic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CountryPhoneInput } from "@/components/certel/phone-field";
import { DEFAULT_COUNTRY, findCountry } from "@/lib/certel/countries";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];
type Step = "profil" | "auto" | "qcm" | "result";

/** NOM → tout en majuscules. */
function toNom(s: string) {
  return s.toLocaleUpperCase("fr-FR");
}
/** Prénoms → première lettre de chaque composante en majuscule (gère espaces, traits d'union, apostrophes). */
function toPrenoms(s: string) {
  return s.toLocaleLowerCase("fr-FR").replace(/(^|[\s\-'’])(\p{L})/gu, (_m, sep, ch) => sep + ch.toLocaleUpperCase("fr-FR"));
}

export function CertelDiagnosticForm() {
  const [step, setStep] = React.useState<Step>("profil");
  const [prenoms, setPrenoms] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [functionTitle, setFunctionTitle] = React.useState("");
  const [structure, setStructure] = React.useState("");
  const [phoneIso, setPhoneIso] = React.useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [autopos, setAutopos] = React.useState<number[]>(() => Array(AUTOPOS.length).fill(-1));
  const [qcm, setQcm] = React.useState<number[]>(() => Array(QCM.length).fill(-1));
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<CertelSubmitResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const topRef = React.useRef<HTMLDivElement>(null);
  const [autoInvalid, setAutoInvalid] = React.useState(false);
  const [qcmInvalid, setQcmInvalid] = React.useState(false);
  const autoRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const qcmRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  function scrollToFirstUnanswered(answers: number[], refs: React.MutableRefObject<(HTMLLIElement | null)[]>) {
    const idx = answers.findIndex((v) => v < 0);
    if (idx >= 0) refs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    return idx;
  }

  const autoDone = autopos.filter((v) => v >= 0).length;
  const qcmDone = qcm.filter((v) => v >= 0).length;

  const goTo = (s: Step) => { setStep(s); setError(null); topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  async function submit() {
    if (autoDone < AUTOPOS.length) { setAutoInvalid(true); setError("Veuillez répondre à toutes les questions d'auto-positionnement avant de continuer."); goTo("auto"); return; }
    if (qcmDone < QCM.length) {
      setQcmInvalid(true);
      setError(`Veuillez répondre à toutes les questions : ${QCM.length - qcmDone} sans réponse.`);
      scrollToFirstUnanswered(qcm, qcmRefs);
      return;
    }
    setSubmitting(true);
    setError(null);
    const fullName = `${prenoms.trim()} ${nom.trim()}`.trim();
    const dial = findCountry(phoneIso)?.dial ?? "";
    const phoneFull = phone.trim() ? `${dial} ${phone.trim()}`.trim() : "";
    const contact = [phoneFull, email.trim()].filter(Boolean).join(" · ");
    const res = await submitCertelDiagnostic({ fullName, functionTitle: functionTitle.trim(), structure: structure.trim(), contact, autopos, qcm });
    setSubmitting(false);
    if (!res.ok) { setError(res.error ?? "Une erreur est survenue."); return; }
    setResult(res);
    goTo("result");
  }

  return (
    <div ref={topRef} className="mx-auto w-full max-w-6xl">
      {/* En-tête */}
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><GraduationCap className="size-6" /></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Diagnostic de niveau CERTEL</h1>
          <p className="text-sm text-muted-foreground">Informatique, numérique &amp; intelligence artificielle</p>
        </div>
      </div>

      {/* Présentation CERTEL */}
      <div className="mb-6 rounded-2xl border border-advanced/20 bg-advanced-soft/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-advanced-fg">CERTification E-Learning</p>
        <p className="mt-1 text-sm font-medium text-foreground">Diagnostiquez votre maturité numérique et en intelligence artificielle en renseignant ce questionnaire.</p>
        <p className="text-sm text-muted-foreground">Des formations vous seront proposées selon votre niveau de maturité.</p>
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
            <div><Label htmlFor="prenoms" required>Prénoms</Label><Input id="prenoms" value={prenoms} onChange={(e) => setPrenoms(toPrenoms(e.target.value))} placeholder="Ex. Jean-Paul Aimé" autoComplete="given-name" /></div>
            <div><Label htmlFor="nom" required>NOM</Label><Input id="nom" className="uppercase" value={nom} onChange={(e) => setNom(toNom(e.target.value))} placeholder="Ex. KOUASSI" autoComplete="family-name" /></div>
            <div><Label htmlFor="functionTitle">Fonction</Label><Input id="functionTitle" value={functionTitle} onChange={(e) => setFunctionTitle(e.target.value)} placeholder="Ex. Enseignant, Étudiant…" /></div>
            <div><Label htmlFor="structure">Structure / établissement</Label><Input id="structure" value={structure} onChange={(e) => setStructure(e.target.value)} /></div>
            <div><Label htmlFor="phone" required>Téléphone</Label><CountryPhoneInput iso2={phoneIso} onIso2Change={setPhoneIso} number={phone} onNumberChange={setPhone} inputId="phone" /></div>
            <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" /></div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => { if (prenoms.trim().length < 2 || nom.trim().length < 1) { setError("Veuillez indiquer vos prénoms et votre nom."); return; } if (phone.replace(/\D/g, "").length < 6) { setError("Veuillez indiquer un numéro de téléphone valide."); return; } goTo("auto"); }}>
              Commencer <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE AUTO-POSITIONNEMENT */}
      {step === "auto" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 text-base text-muted-foreground">
            <p className="font-semibold text-foreground">Auto-positionnement — évaluez votre aisance pour chaque tâche.</p>
            <p>0 = {SELF_SCALE[0].label} · 1 = {SELF_SCALE[1].label} · 2 = {SELF_SCALE[2].label} · 3 = {SELF_SCALE[3].label}</p>
          </div>
          <ol className="space-y-2.5">
            {AUTOPOS.map((item, i) => {
              const invalid = autoInvalid && autopos[i] < 0;
              return (
                <li key={i} ref={(el) => { autoRefs.current[i] = el; }} className={cn("rounded-xl border bg-card px-5 py-4 transition-colors", invalid ? "border-unavailable ring-1 ring-unavailable/50" : "border-border")}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-base font-medium text-foreground">
                      <span className={cn("mr-1.5 text-sm font-bold", invalid ? "text-unavailable-fg" : "text-advanced-fg")}>{i + 1}.</span>{item}
                      {invalid && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-unavailable-soft px-2 py-0.5 align-middle text-[11px] font-bold text-unavailable-fg"><AlertCircle className="size-3" /> À répondre</span>}
                    </span>
                    <div className="flex shrink-0 gap-1">
                      {SELF_SCALE.map((s) => (
                        <button key={s.value} type="button" title={s.label} onClick={() => setAutopos((a) => a.map((v, j) => (j === i ? s.value : v)))}
                          className={cn("size-11 rounded-lg text-base font-bold transition-colors", autopos[i] === s.value ? "bg-advanced text-white" : "bg-secondary text-muted-foreground hover:bg-advanced-soft hover:text-advanced-fg")}>
                          {s.value}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <NavButtons onBack={() => goTo("profil")} onNext={() => { if (autoDone < AUTOPOS.length) { setAutoInvalid(true); setError(`Veuillez répondre à toutes les questions : ${AUTOPOS.length - autoDone} sans réponse.`); scrollToFirstUnanswered(autopos, autoRefs); return; } goTo("qcm"); }} nextLabel="Continuer vers le QCM" />
        </div>
      )}

      {/* ÉTAPE QCM */}
      {step === "qcm" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 text-base text-muted-foreground">
            <p className="font-semibold text-foreground">QCM — 30 questions, une seule bonne réponse par question.</p>
          </div>
          <ol className="space-y-3">
            {QCM.map((item, i) => {
              const invalid = qcmInvalid && qcm[i] < 0;
              return (
                <li key={i} ref={(el) => { qcmRefs.current[i] = el; }} className={cn("rounded-xl border bg-card px-5 py-4 transition-colors", invalid ? "border-unavailable ring-1 ring-unavailable/50" : "border-border")}>
                  <p className="text-base font-semibold text-foreground">
                    <span className={cn("mr-1.5 text-sm font-bold", invalid ? "text-unavailable-fg" : "text-advanced-fg")}>{i + 1}.</span>{item.q}
                    {invalid && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-unavailable-soft px-2 py-0.5 align-middle text-[11px] font-bold text-unavailable-fg"><AlertCircle className="size-3" /> À répondre</span>}
                  </p>
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {item.options.map((opt, oi) => (
                      <button key={oi} type="button" onClick={() => setQcm((a) => a.map((v, j) => (j === i ? oi : v)))}
                        className={cn("flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-base transition-colors", qcm[i] === oi ? "border-advanced bg-advanced-soft font-semibold text-advanced-fg" : "border-border hover:border-advanced/40 hover:bg-secondary")}>
                        <span className={cn("inline-flex size-6 shrink-0 items-center justify-center rounded text-sm font-bold", qcm[i] === oi ? "bg-advanced text-white" : "bg-secondary text-muted-foreground")}>{LETTERS[oi]}</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
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

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Sparkles className="size-4 text-advanced-fg" /> Appréciation de votre niveau</h3>
        <p className="text-sm leading-relaxed text-foreground">{level.appreciation}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ScorePill label="Auto-positionnement" value={s.autopos} max={30} />
        <ScorePill label="QCM" value={s.qcm} max={30} />
        <ScorePill label="Partie en ligne" value={s.online60} max={60} />
      </div>

      <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        Score provisoire calculé sur la partie en ligne (auto-positionnement + QCM). Les <strong className="text-foreground">tâches pratiques (/40)</strong> complètent le diagnostic certifiant pour obtenir votre score /100. {CERTEL_REFS}
      </div>

      {/* Évaluation IA des tâches pratiques */}
      {result.id && (
        <div className="rounded-2xl border border-advanced/30 bg-advanced-soft/40 p-5">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-advanced-fg"><Wand2 className="size-4" /> Évaluez vos tâches pratiques (/40) avec l'IA</h3>
          <p className="mt-1 text-sm text-foreground">Déposez vos productions (PDF, captures d'écran, texte) pour les 8 tâches pratiques. L'IA les évalue au regard des consignes et consolide votre score certifiant sur 100.</p>
          <div className="mt-3">
            <Button asChild className="bg-advanced text-white hover:bg-advanced/90"><Link href={`/certel/evaluation/${result.id}`}><ClipboardCheck className="size-4" /> Évaluer mes tâches pratiques</Link></Button>
          </div>
        </div>
      )}

      {/* Suggestion d'inscription selon le niveau diagnostiqué */}
      <div className="rounded-2xl border-l-4 p-5" style={{ borderLeftColor: level.accent, backgroundColor: `${level.accent}12` }}>
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground"><GraduationCap className="size-4" style={{ color: level.accent }} /> Notre suggestion</h3>
        <p className="mt-1 text-sm text-foreground">{level.suggestion}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild className="text-white hover:opacity-90"><Link href="/contact" style={{ backgroundColor: level.accent }}>M'inscrire à ce niveau</Link></Button>
          <Button asChild variant="outline"><Link href={`/certel#${level.key}`}><GraduationCap className="size-4" /> Voir le programme du {level.key}</Link></Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {result.id && <Button asChild variant="outline"><Link href={`/certel/resultats/${result.id}`}><FileText className="size-4" /> Voir / imprimer mes réponses</Link></Button>}
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
