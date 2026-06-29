"use client";

import * as React from "react";
import { Settings2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { ConfirmActionButton } from "@/components/confirm-action";
import { updateCourse, deleteCourse } from "@/app/actions/lms";

export function CourseEditButton({ course }: { course: { id: string; title: string; level: string | null; summary: string | null; visible: boolean } }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}><Settings2 className="size-4" /> Modifier</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Modifier le cours" description="Réglages du cours.">
        <form action={updateCourse} className="space-y-3">
          <input type="hidden" name="id" value={course.id} />
          <div><Label htmlFor="e-title" required>Titre</Label><Input id="e-title" name="title" defaultValue={course.title} required /></div>
          <div><Label htmlFor="e-level">Niveau / parcours</Label><Input id="e-level" name="level" defaultValue={course.level ?? ""} /></div>
          <div><Label htmlFor="e-summary">Présentation</Label><Textarea id="e-summary" name="summary" rows={3} defaultValue={course.summary ?? ""} /></div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="visible" defaultChecked={course.visible} className="size-4 rounded border-input text-advanced focus:ring-2 focus:ring-ring" /> Visible dans le catalogue
          </label>
          <div className="flex items-center justify-between gap-2 pt-1">
            <ConfirmActionButton
              action={deleteCourse}
              hidden={{ id: course.id }}
              triggerLabel="Supprimer"
              triggerIcon={<Trash2 className="size-4" />}
              triggerVariant="ghost"
              triggerSize="sm"
              title={`Supprimer « ${course.title} » ?`}
              description="Le cours, ses sections, contenus et inscriptions seront supprimés définitivement."
              confirmLabel="Supprimer le cours"
              confirmVariant="destructive"
            />
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
