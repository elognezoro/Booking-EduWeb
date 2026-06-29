"use client";

import { Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { replyPost } from "@/app/actions/lms";

export function ForumReplyForm({ discussionId }: { discussionId: string }) {
  return (
    <form action={replyPost} className="space-y-3">
      <input type="hidden" name="discussionId" value={discussionId} />
      <div><Label>Votre réponse</Label><RichTextEditor name="message" /></div>
      <SubmitButton pendingLabel="Envoi…"><Send className="size-4" /> Répondre</SubmitButton>
    </form>
  );
}
