import { BookOpenCheck, CircleCheck, ListChecks, Target } from "lucide-react";
import type { RoleGuide } from "@/lib/guides";
import { ACCOUNT_SECTION } from "@/lib/guide-account-section";

/**
 * Rendu didactique d'un guide d'utilisation (Centre d'aide + version PDF) :
 * objectif mis en avant, capacités en liste de contrôle, démarche en sections
 * thématiques numérotées avec étapes numérotées. Composant présentiel (pas d'interactivité).
 */
export function GuideArticle({ guide, roleLabel }: { guide: RoleGuide; roleLabel?: string }) {
  const sections = [...guide.sections, ACCOUNT_SECTION];
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card break-inside-avoid">
      <header className="border-b border-border bg-secondary/40 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground">
            <BookOpenCheck className="size-5 shrink-0 text-primary" /> {guide.title}
          </h2>
          {roleLabel && <span className="rounded-full bg-advanced-soft px-2.5 py-1 text-xs font-bold text-advanced-fg">{roleLabel}</span>}
        </div>
      </header>

      <div className="space-y-6 px-5 py-5 sm:px-6">
        {/* Objectif du guide */}
        <p className="flex items-start gap-2 rounded-xl border-l-4 border-primary bg-primary-50/50 px-4 py-3 text-sm leading-relaxed text-foreground">
          <Target className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{guide.intro}</span>
        </p>

        {/* Ce que vous pouvez faire */}
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <CircleCheck className="size-4 text-primary" /> Ce que vous pouvez faire
          </h3>
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {guide.can.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-available-fg" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Démarche pas à pas — sections thématiques numérotées */}
        <section>
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <ListChecks className="size-4 text-primary" /> Démarche pas à pas
          </h3>
          <ol className="space-y-5">
            {sections.map((s, si) => (
              <li key={si} className="break-inside-avoid">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">{si + 1}</span>
                  <h4 className="font-bold text-foreground">{s.title}</h4>
                </div>
                <ol className="ml-3.5 space-y-1.5 border-l-2 border-border pl-4">
                  {s.steps.map((step, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary">{i + 1}</span>
                      <span className="pt-0.5 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
