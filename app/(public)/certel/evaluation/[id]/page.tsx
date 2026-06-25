import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CertelPracticalEvalForm } from "@/components/certel/practical-eval-form";
import type { TaskEvaluation } from "@/lib/certel/practical";
import type { FinalizePracticalResult } from "@/app/actions/certel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Évaluation des tâches pratiques — CERTEL" };

export default async function CertelEvaluationPage({ params }: { params: { id: string } }) {
  const d = await prisma.certelDiagnostic.findUnique({ where: { id: params.id } });
  if (!d) notFound();

  let initialResults: TaskEvaluation[] | undefined;
  let initialSummary: FinalizePracticalResult | undefined;
  if (d.practicalDetails) {
    try {
      const parsed = JSON.parse(d.practicalDetails) as { tasksEvaluated?: number; complete?: boolean; evaluations?: TaskEvaluation[] };
      initialResults = Array.isArray(parsed.evaluations) ? parsed.evaluations : undefined;
      if (d.total100 != null) {
        initialSummary = { ok: true, practicalScore: d.practicalScore ?? 0, total100: d.total100, tasksEvaluated: parsed.tasksEvaluated ?? 0, complete: parsed.complete ?? false };
      }
    } catch { /* ignore */ }
  }

  return (
    <section className="section py-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-2">
          <Button asChild variant="ghost"><Link href={`/certel/resultats/${d.id}`}><ArrowLeft className="size-4" /> Mes réponses</Link></Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><ClipboardCheck className="size-6" /></span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-advanced-fg">CERTification E-Learning · Tâches pratiques</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Évaluation des tâches pratiques</h1>
            <p className="text-sm text-muted-foreground">{d.fullName}</p>
          </div>
        </div>

        <CertelPracticalEvalForm
          diagnosticId={d.id}
          fullName={d.fullName}
          online60={d.online60}
          score100={d.score100}
          initialResults={initialResults}
          initialSummary={initialSummary}
        />
      </div>
    </section>
  );
}
