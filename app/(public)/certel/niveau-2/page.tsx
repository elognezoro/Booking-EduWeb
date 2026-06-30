import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowRight, ArrowLeft, Clock, Lock, Headphones, Sparkles, ClipboardCheck, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { N2_MODULES_META, N2_ACCENT } from "@/lib/certel/niveau2";

export const metadata: Metadata = { title: "CERTEL — Niveau 2 · Formation interactive" };

export default function CertelNiveau2Hub() {
  return (
    <div className="formation-scope" style={{ ["--certel-accent" as string]: N2_ACCENT }}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${N2_ACCENT} 0%, #4F46E5 55%, #172554 100%)` }}>
        <div className="pointer-events-none absolute inset-0 bg-grid-soft bg-[size:32px_32px] opacity-[0.14]" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="section relative py-16 sm:py-20">
          <Link href="/certel" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"><ArrowLeft className="size-4" /> Programme CERTEL</Link>
          <Badge className="mb-4 bg-white/15 text-white"><GraduationCap className="size-3.5" /> Niveau 2 · Intermédiaire</Badge>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Productivité numérique, contenus &amp; IA appliquée</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">Six modules interactifs pour produire des livrables professionnels : bureautique avancée, contenus visuels, classes virtuelles, LMS, IA générative et protection des données.</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Feature icon={Headphones}>Lecture audio</Feature>
            <Feature icon={Sparkles}>Infographies</Feature>
            <Feature icon={ClipboardCheck}>Exercices auto-corrigés</Feature>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href="/certel/niveau-2/certificat"><Award className="size-4" /> Mon certificat de réussite</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="section py-14">
        <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-foreground">Les 6 modules du Niveau 2</h2>
        <p className="mb-6 text-muted-foreground">Suivez-les dans l'ordre ; chacun se termine par une évaluation auto-corrigée.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {N2_MODULES_META.map((m) => (
            <Link key={m.slug} href={`/certel/niveau-2/${m.slug}`} className="block">
              <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-card" style={{ borderTopColor: N2_ACCENT, borderTopWidth: 3 }}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl text-lg font-extrabold text-white" style={{ backgroundColor: N2_ACCENT }}>{m.num}</span>
                  <span className="rounded-full bg-available-soft px-2.5 py-1 text-xs font-bold text-available-fg">Disponible</span>
                </div>
                <h3 className="mt-4 font-bold text-foreground">{m.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{m.subtitle}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground"><Clock className="mr-1 inline size-3.5" />{m.duration}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: N2_ACCENT }}>Commencer <ArrowRight className="size-4 transition-all group-hover:translate-x-0.5" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Évaluation certifiante */}
        <div className="mt-8 overflow-hidden rounded-2xl border-l-4 bg-card p-6 shadow-soft" style={{ borderLeftColor: N2_ACCENT }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Award className="size-6" /></span>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Évaluation certifiante du Niveau 2</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Projet de production professionnel, examen mixte et mise en situation. Seuil de certification : moyenne ≥ 60/100 avec projet validé.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-muted-foreground"><Lock className="size-3.5" /> Après les 6 modules</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white"><Icon className="size-4" /> {children}</span>
  );
}
