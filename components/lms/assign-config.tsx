"use client";

import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { configureAssign } from "@/app/actions/lms";
import { ASSIGN_MAX_FILE_MB, type AssignConfig } from "@/lib/lms-assign";

// La date limite est stockée comme heure-mur en UTC (CI = UTC+0) ; on la relit en UTC pour un aller-retour stable.
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export function AssignConfigForm({ activityId, title, intro, config }: { activityId: string; title: string; intro: string; config: AssignConfig }) {
  return (
    <form action={configureAssign} className="space-y-4">
      <input type="hidden" name="activityId" value={activityId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label htmlFor="ac-title" required>Titre</Label><Input id="ac-title" name="title" defaultValue={title} required /></div>
        <div className="sm:col-span-2"><Label htmlFor="ac-intro">Consigne</Label><Textarea id="ac-intro" name="intro" rows={3} defaultValue={intro} /></div>
        <div><Label htmlFor="ac-due">Date limite</Label><Input id="ac-due" name="dueAt" type="datetime-local" defaultValue={toLocalInput(config.dueAt)} /></div>
        <div><Label htmlFor="ac-grade">Note maximale</Label><Input id="ac-grade" name="maxGrade" type="number" min={1} max={100} defaultValue={config.maxGrade} /></div>
        <div><Label htmlFor="ac-mb">Taille max par fichier (Mo)</Label><Input id="ac-mb" name="maxFileMb" type="number" min={1} max={ASSIGN_MAX_FILE_MB} defaultValue={config.maxFileMb} /></div>
        <div className="flex flex-col justify-end gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowText" defaultChecked={config.allowText} className="size-4" /> Remise par texte en ligne</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowFile" defaultChecked={config.allowFile} className="size-4" /> Remise par fichier joint</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowLate" defaultChecked={config.allowLate} className="size-4" /> Autoriser la remise en retard</label>
        </div>
      </div>
      <div className="flex justify-end"><SubmitButton pendingLabel="Enregistrement…">Enregistrer les réglages</SubmitButton></div>
    </form>
  );
}
