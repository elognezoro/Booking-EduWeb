import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { GuidePrintActions } from "@/components/help/guide-print-actions";
import { DiagnosticAnswers, resolveDiagnostic } from "@/components/certel/diagnostic-answers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réponses au diagnostic CERTEL" };

export default async function CertelResultPage({ params }: { params: { id: string } }) {
  const d = await prisma.certelDiagnostic.findUnique({ where: { id: params.id } });
  if (!d) notFound();

  const { level, practical } = resolveDiagnostic(d);

  return (
    <section className="section py-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="no-print flex items-center justify-between gap-2">
          <Button asChild variant="ghost"><Link href="/certel"><ArrowLeft className="size-4" /> Programme CERTEL</Link></Button>
          <GuidePrintActions auto={false} />
        </div>

        <DiagnosticAnswers d={d} />

        <div className="no-print flex flex-wrap gap-2">
          <Button asChild className="bg-advanced text-white hover:bg-advanced/90"><Link href={`/certel/evaluation/${d.id}`}><ClipboardCheck className="size-4" /> {practical ? "Compléter / revoir les tâches pratiques" : "Évaluer mes tâches pratiques (/40)"}</Link></Button>
          <Button asChild variant="outline"><Link href={`/certel#${level.key}`}><GraduationCap className="size-4" /> Programme du {level.key}</Link></Button>
        </div>
      </div>
    </section>
  );
}
