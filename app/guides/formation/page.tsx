import { FileText } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { GuidePrintActions } from "@/components/help/guide-print-actions";
import { Button } from "@/components/ui/button";
import { TrainingManual } from "@/components/help/training-manual";
import { TRAINING_CONTENT } from "@/lib/training-content";

export const dynamic = "force-dynamic";

// Support de formation complet (manuel académique), disponible à part et imprimable en PDF.
export default async function FormationManualPage() {
  await requireUser();
  const generatedOn = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="formation-scope mx-auto max-w-4xl p-6 sm:p-8">
      <div className="no-print mb-6 flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <a href="/api/guides/formation/word"><FileText className="size-4" /> Télécharger en Word</a>
        </Button>
        <GuidePrintActions auto={false} />
      </div>
      <TrainingManual content={TRAINING_CONTENT} generatedOn={generatedOn} />
    </div>
  );
}
