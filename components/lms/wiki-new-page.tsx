"use client";

import * as React from "react";
import { FilePlus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { createWikiPage } from "@/app/actions/lms";

export function WikiNewPage({ activityId }: { activityId: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}><FilePlus className="size-4" /> Nouvelle page</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle page du wiki" description="Donnez un titre ; vous pourrez ensuite la rédiger.">
        <form action={createWikiPage} className="space-y-3">
          <input type="hidden" name="activityId" value={activityId} />
          <div><Label htmlFor="wp-title" required>Titre de la page</Label><Input id="wp-title" name="title" required maxLength={200} placeholder="Ex. Glossaire" /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><SubmitButton pendingLabel="Création…">Créer</SubmitButton></div>
        </form>
      </Modal>
    </>
  );
}
