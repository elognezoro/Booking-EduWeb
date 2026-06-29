"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { RichContent } from "@/components/lms/rich-content";
import { updateActivity } from "@/app/actions/lms";

/** Affichage + édition (enseignant) du contenu d'une page. */
export function PageEditor({ activity, canEdit }: { activity: { id: string; title: string; content: string }; canEdit: boolean }) {
  const [editing, setEditing] = React.useState(false);

  if (editing) {
    return (
      <form action={updateActivity} className="space-y-3">
        <input type="hidden" name="id" value={activity.id} />
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">Titre</label>
          <Input name="title" defaultValue={activity.title} className="font-bold" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">Contenu</label>
          <RichTextEditor name="content" initialHtml={activity.content} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Annuler</Button>
          <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        </div>
      </form>
    );
  }

  return (
    <div>
      {canEdit && (
        <div className="mb-2 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil className="size-4" /> Éditer</Button>
        </div>
      )}
      {activity.content ? (
        <RichContent html={activity.content} />
      ) : (
        <p className="text-sm text-muted-foreground">Cette page n'a pas encore de contenu.{canEdit ? " Cliquez sur « Éditer » pour la rédiger." : ""}</p>
      )}
    </div>
  );
}
