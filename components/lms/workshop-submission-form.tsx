"use client";

import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { FileUpload } from "@/components/lms/file-upload";
import { submitWorkshop } from "@/app/actions/lms";
import { ASSIGN_ACCEPT, ASSIGN_MAX_FILE_MB } from "@/lib/lms-assign";

export function WorkshopSubmissionForm({ activityId, current }: { activityId: string; current: { title: string; content: string; fileName: string | null } | null }) {
  return (
    <form action={submitWorkshop} className="space-y-4">
      <input type="hidden" name="activityId" value={activityId} />
      <div><Label htmlFor="wss-title" required>Titre</Label><Input id="wss-title" name="title" defaultValue={current?.title ?? ""} required maxLength={200} /></div>
      <div><Label>Contenu</Label><RichTextEditor name="content" initialHtml={current?.content ?? ""} /></div>
      <div><Label>Fichier joint (facultatif)</Label><FileUpload name="file" accept={ASSIGN_ACCEPT} maxMb={ASSIGN_MAX_FILE_MB} currentName={current?.fileName ?? null} /></div>
      <SubmitButton pendingLabel="Envoi…"><Send className="size-4" /> {current ? "Mettre à jour ma remise" : "Remettre mon travail"}</SubmitButton>
    </form>
  );
}
