"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Plus, Loader2, MonitorPlay } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoom } from "@/app/actions/rooms";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Créer la salle
    </Button>
  );
}

export function AddRoomButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus className="size-4" /> Ajouter une salle</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle salle multimédia" description="La capacité correspond au nombre de postes réservables.">
        <form action={createRoom} onSubmit={() => setOpen(false)} className="space-y-4">
          <div>
            <Label htmlFor="rname" required>Nom de la salle</Label>
            <Input id="rname" name="name" placeholder="Ex. LABO LANGUE 3" required />
          </div>
          <div>
            <Label htmlFor="rcap" required>Capacité (nombre de postes)</Label>
            <Input id="rcap" name="capacity" type="number" min={1} max={500} defaultValue={25} required />
          </div>
          <p className="flex items-center gap-2 rounded-xl bg-primary-50 p-3 text-xs text-primary-700">
            <MonitorPlay className="size-4 shrink-0" /> La salle sera créée avec un plan de postes (réservation poste par poste) et un code automatique.
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Submit />
          </div>
        </form>
      </Modal>
    </>
  );
}
