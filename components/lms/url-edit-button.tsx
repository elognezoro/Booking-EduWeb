"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateActivity } from "@/app/actions/lms";

export function UrlEditButton({ activity }: { activity: { id: string; title: string; externalUrl: string; intro: string } }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}><Pencil className="size-4" /> Modifier</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Modifier le média">
        <form action={updateActivity} className="space-y-3">
          <input type="hidden" name="id" value={activity.id} />
          <div><Label htmlFor="ue-title" required>Titre</Label><Input id="ue-title" name="title" defaultValue={activity.title} required /></div>
          <div><Label htmlFor="ue-url" required>Adresse (URL)</Label><Input id="ue-url" name="externalUrl" type="url" defaultValue={activity.externalUrl} required /></div>
          <div><Label htmlFor="ue-intro">Description</Label><Textarea id="ue-intro" name="intro" rows={2} defaultValue={activity.intro} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton></div>
        </form>
      </Modal>
    </>
  );
}
