"use client";

import * as React from "react";
import { MessageSquarePlus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { createDiscussion } from "@/app/actions/lms";

export function ForumDiscussionForm({ activityId }: { activityId: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button type="button" size="sm" onClick={() => setOpen(true)}><MessageSquarePlus className="size-4" /> Nouvelle discussion</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle discussion" description="Donnez un sujet et rédigez votre message d'ouverture.">
        <form action={createDiscussion} className="space-y-3">
          <input type="hidden" name="activityId" value={activityId} />
          <div><Label htmlFor="fd-title" required>Sujet</Label><Input id="fd-title" name="title" required maxLength={200} placeholder="Ex. Question sur le module 2" /></div>
          <div><Label required>Message</Label><RichTextEditor name="message" /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><SubmitButton pendingLabel="Publication…">Publier</SubmitButton></div>
        </form>
      </Modal>
    </>
  );
}
