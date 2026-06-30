import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowRight, Target, ListChecks, FlaskConical, ClipboardCheck, Clock, Users, CheckCircle2, Award, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CERTEL_LEVELS, CERTEL_REFS } from "@/lib/certel/diagnostic";
import { CERTEL_PROGRAM } from "@/lib/certel/program";
import { ExclusiveDetails } from "@/components/certel/exclusive-details";

export const metadata: Metadata = { title: "Formation certifiante CERTEL" };

export default function CertelProgramPage() {
  return (
    <>
      <ExclusiveDetails />
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-advanced-night text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-soft bg-[size:32px_32px] opacity-[0.12]" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-advanced/40 blur-3xl" />
        <div className="section relative py-16 sm:py-20">
          <Badge tone="advanced" className="mb-4 bg-white/15 text-white"><GraduationCap className="size-3.5" /> Formation certifiante</Badge>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            CERTEL — Informatique, numérique &amp; intelligence artificielle
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Un parcours certifiant en 3 niveaux de 3 mois chacun, du socle bureautique à l'ingénierie numérique et l'IA. Positionnez-vous grâce au diagnostic gratuit, puis progressez à votre rythme.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-advanced-night hover:bg-white/90">
              <Link href="/certel/diagnostic"><GraduationCap className="size-4" /> Faire le test de niveau</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href="#niveaux">Voir le programme <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-white/60">{CERTEL_REFS}</p>
        </div>
      </section>

      {/* Aperçu des niveaux */}
      <section id="niveaux" className="section scroll-mt-20 py-14">
        <div className="grid gap-5 lg:grid-cols-3">
          {CERTEL_LEVELS.map((l) => (
            <a key={l.key} href={`#${l.key}`} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-card" style={{ borderTopColor: l.accent, borderTopWidth: 3 }}>
              <div className="flex items-center justify-between">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl font-extrabold text-white" style={{ backgroundColor: l.accent }}>{l.key}</span>
                <span className="text-xs font-semibold text-muted-foreground">{l.range}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">{l.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{l.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-advanced-fg group-hover:gap-2">Découvrir <ArrowRight className="size-4 transition-all" /></span>
            </a>
          ))}
        </div>
      </section>

      {/* Détail par niveau */}
      {CERTEL_PROGRAM.map((level) => {
        const meta = CERTEL_LEVELS.find((l) => l.key === level.levelKey);
        const accent = meta?.accent ?? "#6D5DF5";
        return (
          <section key={level.levelKey} id={level.levelKey} className="scroll-mt-20 border-t border-border bg-secondary/30 py-14">
            <div className="section">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl text-lg font-extrabold text-white" style={{ backgroundColor: accent }}>{level.levelKey}</span>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{level.title}</h2>
                  <p className="text-sm text-muted-foreground"><Clock className="mr-1 inline size-3.5" />{level.dureeTotale}</p>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground">{level.finalite}</p>

              {["N1", "N2", "N3"].includes(level.levelKey) && (
                <Button asChild className="mt-4 text-white hover:opacity-90" style={{ backgroundColor: accent }}>
                  <Link href={`/certel/niveau-${level.levelKey.replace("N", "")}`}><GraduationCap className="size-4" /> Accéder à la formation interactive du Niveau {level.levelKey.replace("N", "")} <ArrowRight className="size-4" /></Link>
                </Button>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoCard icon={Users} title="Public cible">{level.publicCible}</InfoCard>
                <InfoCard icon={CheckCircle2} title="Prérequis">{level.prerequisNiveau}</InfoCard>
              </div>

              {level.competencesVisees.length > 0 && (
                <div className="mt-5 rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Target className="size-4" style={{ color: accent }} /> Compétences visées</h3>
                  <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {level.competencesVisees.map((c, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-available-fg" /><span>{c}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Thématiques */}
              <h3 className="mb-3 mt-8 flex items-center gap-2 text-lg font-bold text-foreground"><BookOpen className="size-5" style={{ color: accent }} /> Thématiques &amp; syllabus</h3>
              <div className="space-y-4">
                {level.themes.map((t) => (
                  <details key={t.code} name={`certel-${level.levelKey}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow open:shadow-soft">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-5 hover:bg-secondary/40">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg px-2 py-0.5 text-xs font-extrabold text-white" style={{ backgroundColor: accent }}>{t.code}</span>
                          <h4 className="text-base font-bold text-foreground">{t.titre}</h4>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">{t.resume}</p>
                      </div>
                      <span className="flex shrink-0 items-center gap-2.5">
                        <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground"><Clock className="mr-1 inline size-3.5" />{t.volumeHoraire}</span>
                        <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" />
                      </span>
                    </summary>

                    <div className="space-y-5 border-t border-border px-5 py-5">
                      <Block icon={Target} accent={accent} title="Objectifs pédagogiques">
                        <Bullets items={t.objectifs} check />
                      </Block>

                      <Block icon={ListChecks} accent={accent} title="Contenu détaillé">
                        <div className="space-y-3">
                          {t.syllabus.contenu.map((c, i) => (
                            <div key={i}>
                              <p className="text-sm font-semibold text-foreground">{c.titre}</p>
                              <Bullets items={c.points} />
                            </div>
                          ))}
                        </div>
                      </Block>

                      {t.syllabus.prerequis.length > 0 && (
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Prérequis : </span>{t.syllabus.prerequis.join(" · ")}</p>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Block icon={FlaskConical} accent={accent} title="Activités / TP">
                          <Bullets items={t.syllabus.activites} />
                        </Block>
                        <Block icon={ClipboardCheck} accent={accent} title="Évaluation">
                          <Bullets items={t.syllabus.evaluation} />
                        </Block>
                      </div>

                      {t.competences.length > 0 && (
                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Compétences du diagnostic couvertes : </span>{t.competences.join(" · ")}</p>
                      )}
                    </div>
                  </details>
                ))}
              </div>

              {level.evaluationCertifiante.length > 0 && (
                <div className="mt-6 rounded-2xl border-l-4 bg-card p-5" style={{ borderLeftColor: accent }}>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-foreground"><Award className="size-4" style={{ color: accent }} /> Évaluation certifiante du niveau</h3>
                  <Bullets items={level.evaluationCertifiante} />
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* CTA final */}
      <section className="section py-14 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Prêt à connaître votre niveau ?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Le diagnostic gratuit (~10 min) vous oriente vers le bon niveau et un programme adapté.</p>
        <Button asChild size="lg" className="mt-6 bg-advanced text-white hover:bg-advanced/90"><Link href="/certel/diagnostic"><GraduationCap className="size-4" /> Faire le test de niveau gratuit</Link></Button>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Icon className="size-4 text-advanced-fg" /> {title}</h3>
      <p className="text-sm text-foreground">{children}</p>
    </div>
  );
}

function Block({ icon: Icon, title, accent, children }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Icon className="size-4" style={{ color: accent }} /> {title}</h4>
      {children}
    </div>
  );
}

function Bullets({ items, check }: { items: string[]; check?: boolean }) {
  if (check) {
    return (
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-available-fg" /><span className="leading-relaxed">{it}</span></li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-muted-foreground marker:text-advanced">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}
