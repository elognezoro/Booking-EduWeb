import { ClipboardCheck, CheckCircle2, Save, Eye, ListChecks } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEvaluationConfig } from "@/lib/platform/settings";
import { saveEvaluationConfig } from "@/app/actions/platform";

export const dynamic = "force-dynamic";

function Toggle({ name, defaultChecked, title, on, off }: { name: string; defaultChecked: boolean; title: string; on: string; off: string }) {
  return (
    <label htmlFor={name} className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition hover:bg-secondary/40">
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground"><strong className="text-foreground">Activé :</strong> {on}</p>
        <p className="mt-0.5 text-sm text-muted-foreground"><strong className="text-foreground">Désactivé :</strong> {off}</p>
      </div>
      {/* peer checkbox + interrupteur visuel */}
      <input id={name} name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-muted-foreground/30 transition-colors peer-checked:bg-advanced">
        <span className="absolute left-0.5 inline-block size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default async function PlatformEvaluationsPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requirePermission("platform.manage");
  const cfg = await getEvaluationConfig();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title="Évaluations"
        description="Comportement des évaluations formatives et sommatives, appliqué à toutes les formations de la plateforme."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><ClipboardCheck className="size-6" /></span>}
      />
      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Paramètres enregistrés. Les formations reflètent le nouveau comportement.
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="size-5 text-advanced-fg" /> Comportement des évaluations</CardTitle></CardHeader>
        <CardContent>
          <form action={saveEvaluationConfig} className="space-y-4">
            <Toggle
              name="formativeImmediateFeedback"
              defaultChecked={cfg.formativeImmediateFeedback}
              title="Évaluations formatives — vérification immédiate"
              on="L'apprenant vérifie chaque réponse (avec le corrigé commenté) avant de passer à la question suivante."
              off="Les corrigés ne s'affichent qu'à la fin de la série, comme une évaluation sommative."
            />
            <Toggle
              name="summativeRevealAnswers"
              defaultChecked={cfg.summativeRevealAnswers}
              title="Évaluations sommatives — corrigés à la fin"
              on="À la fin de l'examen, le score ET les bonnes réponses commentées sont affichés."
              off="À la fin de l'examen, seul le score est affiché (les bonnes réponses restent masquées)."
            />
            <div className="flex items-start gap-2 rounded-xl border border-advanced/20 bg-advanced-soft/30 p-3 text-sm text-muted-foreground">
              <Eye className="mt-0.5 size-4 shrink-0 text-advanced-fg" />
              <span>Rappel : les <strong className="text-foreground">exercices de module</strong> sont formatifs (entraînement) ; les <strong className="text-foreground">examens de connaissances des évaluations certifiantes</strong> sont sommatifs (les bonnes réponses sont rendues visibles à la fin).</span>
            </div>
            <Button type="submit" size="lg"><Save className="size-4" /> Enregistrer</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
