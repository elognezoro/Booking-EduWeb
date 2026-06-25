import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { GuidePrintActions } from "@/components/help/guide-print-actions";
import { DiagnosticAnswers } from "@/components/certel/diagnostic-answers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réponses au diagnostic CERTEL" };

export default async function AdminCertelAnswersPage({ params }: { params: { id: string } }) {
  // Accès réservé à l'administrateur (authentification obligatoire + permission).
  await requirePermission("platform.manage");

  const d = await prisma.certelDiagnostic.findUnique({ where: { id: params.id } });
  if (!d) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="no-print flex items-center justify-between gap-2">
        <Button asChild variant="ghost"><Link href="/dashboard/platform/certel"><ArrowLeft className="size-4" /> Diagnostics CERTEL</Link></Button>
        <GuidePrintActions auto={false} />
      </div>

      <DiagnosticAnswers d={d} />
    </div>
  );
}
