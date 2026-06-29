"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { createCourse } from "@/app/actions/lms";

/** Bouton + fenêtre de création d'un cours (réservé aux enseignants/gestionnaires). */
export function CourseFormButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus className="size-4" /> Créer un cours</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau cours" description="Vous en serez automatiquement l'enseignant.">
        <form action={createCourse} className="space-y-3">
          <div><Label htmlFor="c-title" required>Titre du cours</Label><Input id="c-title" name="title" required placeholder="Ex. Initiation au numérique" /></div>
          <div><Label htmlFor="c-level">Niveau / parcours</Label><Input id="c-level" name="level" placeholder="Ex. Niveau 1" /></div>
          <div><Label htmlFor="c-summary">Présentation</Label><Textarea id="c-summary" name="summary" rows={3} placeholder="Brève description du cours" /></div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <SubmitButton pendingLabel="Création…">Créer le cours</SubmitButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
