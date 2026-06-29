"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { configureWorkshop } from "@/app/actions/lms";
import type { WorkshopCriterion } from "@/lib/lms-workshop";

export function WorkshopConfigForm({ activityId, title, intro, instructions, criteria, reviewsPerStudent }: { activityId: string; title: string; intro: string; instructions: string; criteria: WorkshopCriterion[]; reviewsPerStudent: number }) {
  const [crits, setCrits] = React.useState<{ description: string; maxScore: number }[]>(
    criteria.length ? criteria.map((c) => ({ description: c.description, maxScore: c.maxScore })) : [{ description: "", maxScore: 10 }],
  );
  const update = (i: number, patch: Partial<{ description: string; maxScore: number }>) => setCrits((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const add = () => setCrits((cs) => [...cs, { description: "", maxScore: 10 }]);
  const remove = (i: number) => setCrits((cs) => (cs.length > 1 ? cs.filter((_, idx) => idx !== i) : cs));

  return (
    <form action={configureWorkshop} className="space-y-4">
      <input type="hidden" name="activityId" value={activityId} />
      <input type="hidden" name="criteria" value={JSON.stringify(crits)} />
      <div><Label htmlFor="ws-title" required>Titre</Label><Input id="ws-title" name="title" defaultValue={title} required /></div>
      <div><Label htmlFor="ws-intro">Présentation courte</Label><Textarea id="ws-intro" name="intro" rows={2} defaultValue={intro} /></div>
      <div><Label>Consignes détaillées</Label><RichTextEditor name="instructions" initialHtml={instructions} /></div>
      <div><Label htmlFor="ws-rev">Nombre d'évaluations par apprenant</Label><Input id="ws-rev" name="reviewsPerStudent" type="number" min={1} max={10} defaultValue={reviewsPerStudent} className="w-24" /></div>

      <div>
        <Label>Critères d'évaluation</Label>
        <div className="space-y-2">
          {crits.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={c.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Description du critère" className="flex-1" />
              <Input type="number" min={1} max={100} value={c.maxScore} onChange={(e) => update(i, { maxScore: Number(e.target.value) })} className="w-20" title="Barème" />
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)} aria-label="Retirer le critère"><Trash2 className="size-4" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="size-4" /> Ajouter un critère</Button>
        </div>
      </div>

      <div className="flex justify-end"><SubmitButton pendingLabel="Enregistrement…">Enregistrer la configuration</SubmitButton></div>
    </form>
  );
}
