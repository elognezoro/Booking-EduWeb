"use client";

import { Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { FileUpload } from "@/components/lms/file-upload";
import { submitAssignment } from "@/app/actions/lms";
import { ASSIGN_ACCEPT, type AssignConfig } from "@/lib/lms-assign";

export function SubmissionForm({ activityId, config, current }: { activityId: string; config: AssignConfig; current: { text: string | null; fileName: string | null } | null }) {
  return (
    <form action={submitAssignment} className="space-y-4">
      <input type="hidden" name="activityId" value={activityId} />
      {config.allowText && (
        <div>
          <Label>Texte en ligne</Label>
          <RichTextEditor name="text" initialHtml={current?.text ?? ""} />
        </div>
      )}
      {config.allowFile && (
        <div>
          <Label>Fichier joint</Label>
          <FileUpload name="file" accept={ASSIGN_ACCEPT} maxMb={config.maxFileMb} currentName={current?.fileName ?? null} />
        </div>
      )}
      <SubmitButton pendingLabel="Envoi…"><Send className="size-4" /> {current ? "Mettre à jour ma remise" : "Remettre le devoir"}</SubmitButton>
    </form>
  );
}
