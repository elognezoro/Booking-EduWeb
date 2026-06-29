"use client";

import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { saveAssessment } from "@/app/actions/lms";
import type { WorkshopCriterion } from "@/lib/lms-workshop";

export function WorkshopAssessmentForm({ assessmentId, criteria, scores, feedback }: { assessmentId: string; criteria: WorkshopCriterion[]; scores: Record<string, number>; feedback: string }) {
  return (
    <form action={saveAssessment} className="space-y-4">
      <input type="hidden" name="assessmentId" value={assessmentId} />
      <div className="space-y-2">
        {criteria.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
            <span className="text-sm text-foreground">{c.description}</span>
            <span className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
              <Input name={`score_${c.id}`} type="number" min={0} max={c.maxScore} step="0.5" required defaultValue={scores[c.id] ?? ""} className="w-20" /> / {c.maxScore}
            </span>
          </div>
        ))}
      </div>
      <div><Label>Commentaire pour l'auteur</Label><RichTextEditor name="feedback" initialHtml={feedback} /></div>
      <SubmitButton pendingLabel="Envoi…"><Send className="size-4" /> Valider l'évaluation</SubmitButton>
    </form>
  );
}
