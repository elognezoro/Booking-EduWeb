import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock, Target, ListChecks, Wrench } from "lucide-react";
import { getN3Module, N3_MODULES_META, N3_ACCENT } from "@/lib/certel/niveau3";
import { LessonPlayer } from "@/components/certel/n1/lesson-player";
import { getEvaluationConfig } from "@/lib/platform/settings";
import { getCurrentUser } from "@/lib/auth";
import { hasCertelAccess } from "@/lib/certel/payment";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { module: string } }): Metadata {
  const meta = N3_MODULES_META.find((m) => m.slug === params.module);
  return { title: meta ? `${meta.title} · CERTEL Niveau 3` : "CERTEL Niveau 3" };
}

const COMPETENCE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Techniques: Wrench, Méthodologiques: ListChecks, Organisationnelles: ListChecks, Transversales: Target,
};

export default async function CertelN3ModulePage({ params }: { params: { module: string } }) {
  const mod = getN3Module(params.module);
  if (!mod) notFound();
  const user = await getCurrentUser();
  if (!(await hasCertelAccess(user?.id, "N3"))) redirect("/certel/inscription/niveau-3");
  const evalCfg = await getEvaluationConfig();

  return (
    <div className="formation-scope section py-10 sm:py-12" style={{ ["--certel-accent" as string]: N3_ACCENT }}>
      <Link href="/certel/niveau-3" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-4" /> Niveau 3</Link>
      <header className="rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-soft" style={{ backgroundColor: N3_ACCENT }}>{mod.num}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: N3_ACCENT }}>{mod.code} · Niveau 3</p>
            <h1 className="mt-0.5 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">{mod.title}</h1>
            <p className="mt-1.5 max-w-2xl text-muted-foreground">{mod.subtitle}</p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground"><Clock className="mr-1 inline size-3.5" />{mod.duration}</p>
          </div>
        </div>

        <p className="mt-5 max-w-3xl rounded-2xl bg-card/70 p-4 text-[15px] leading-relaxed text-foreground"><span className="font-bold" style={{ color: N3_ACCENT }}>Finalité — </span>{mod.finalite}</p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Target className="size-4" style={{ color: N3_ACCENT }} /> Objectifs pédagogiques</h2>
            <ul className="space-y-1">
              {mod.objectives.map((o, i) => <li key={i} className="flex gap-2 text-sm text-foreground"><span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: N3_ACCENT }} /><span>{o}</span></li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><ListChecks className="size-4" style={{ color: N3_ACCENT }} /> Compétences visées</h2>
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
        <LessonPlayer module={mod} formativeImmediateFeedback={evalCfg.formativeImmediateFeedback} />
      </div>
    </div>
  );
}
