import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Target, Lock, ListChecks, Wrench } from "lucide-react";
import { getN1Module, N1_MODULES_META, N1_ACCENT } from "@/lib/certel/niveau1";
import { LessonPlayer } from "@/components/certel/n1/lesson-player";

export function generateStaticParams() {
  return N1_MODULES_META.map((m) => ({ module: m.slug }));
}

export function generateMetadata({ params }: { params: { module: string } }): Metadata {
  const meta = N1_MODULES_META.find((m) => m.slug === params.module);
  return { title: meta ? `${meta.title} · CERTEL Niveau 1` : "CERTEL Niveau 1" };
}

const COMPETENCE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Techniques: Wrench, Organisationnelles: ListChecks, Sécurité: Target, Transversales: Target,
};

export default function CertelN1ModulePage({ params }: { params: { module: string } }) {
  const meta = N1_MODULES_META.find((m) => m.slug === params.module);
  if (!meta) notFound();
  const mod = getN1Module(params.module);

  // Module non encore disponible : page « à venir ».
  if (!mod) {
    return (
      <section className="formation-scope section py-16">
        <Link href="/certel/niveau-1" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-4" /> Niveau 1</Link>
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground"><Lock className="size-7" /></span>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide" style={{ color: N1_ACCENT }}>Module {meta.num}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground">{meta.title}</h1>
          <p className="mt-2 text-muted-foreground">{meta.subtitle}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-bold text-muted-foreground"><Clock className="size-4" /> Bientôt disponible</p>
        </div>
      </section>
    );
  }

  return (
    <div className="formation-scope section py-10 sm:py-12">
      {/* En-tête du module */}
      <Link href="/certel/niveau-1" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-4" /> Niveau 1</Link>
      <header className="rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-soft" style={{ backgroundColor: N1_ACCENT }}>{mod.num}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: N1_ACCENT }}>{mod.code} · Niveau 1</p>
            <h1 className="mt-0.5 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">{mod.title}</h1>
            <p className="mt-1.5 max-w-2xl text-muted-foreground">{mod.subtitle}</p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground"><Clock className="mr-1 inline size-3.5" />{mod.duration}</p>
          </div>
        </div>

        <p className="mt-5 max-w-3xl rounded-2xl bg-card/70 p-4 text-[15px] leading-relaxed text-foreground"><span className="font-bold" style={{ color: N1_ACCENT }}>Finalité — </span>{mod.finalite}</p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Target className="size-4" style={{ color: N1_ACCENT }} /> Objectifs pédagogiques</h2>
            <ul className="space-y-1">
              {mod.objectives.map((o, i) => <li key={i} className="flex gap-2 text-sm text-foreground"><span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: N1_ACCENT }} /><span>{o}</span></li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><ListChecks className="size-4" style={{ color: N1_ACCENT }} /> Compétences visées</h2>
            <ul className="space-y-2.5">
              {mod.competences.map((c, i) => {
                const Icon = COMPETENCE_ICON[c.group] || Target;
                return (
                  <li key={i} className="flex gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-advanced-soft text-advanced-fg"><Icon className="size-4" /></span>
                    <p className="text-sm text-foreground"><span className="font-bold">{c.group} — </span>{c.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>

      <div className="mt-8">
        <LessonPlayer module={mod} />
      </div>
    </div>
  );
}
