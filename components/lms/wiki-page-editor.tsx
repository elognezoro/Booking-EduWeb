"use client";

import * as React from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichContent } from "@/components/lms/rich-content";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { saveWikiPage } from "@/app/actions/lms";

/** Affichage + édition collaborative d'une page de wiki (chaque enregistrement crée une révision). */
export function WikiPageEditor({ page, canEdit }: { page: { id: string; content: string }; canEdit: boolean }) {
  const [editing, setEditing] = React.useState(false);

  if (!editing) {
    return (
      <div className="space-y-3">
        {page.content ? <RichContent html={page.content} /> : <p className="text-sm text-muted-foreground">Cette page est vide.{canEdit ? " Cliquez sur « Modifier » pour la rédiger." : ""}</p>}
        {canEdit && <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil className="size-4" /> Modifier</Button>}
      </div>
    );
  }
  return (
    <form action={saveWikiPage} className="space-y-3">
      <input type="hidden" name="pageId" value={page.id} />
      <RichTextEditor name="content" initialHtml={page.content} />
      <div className="flex gap-2">
        <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        <Button type="button" variant="ghost" onClick={() => setEditing(false)}><X className="size-4" /> Annuler</Button>
      </div>
    </form>
  );
}
