"use client";

import { Trash2 } from "lucide-react";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteResource } from "@/app/actions/resources";

export function ResourceDeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmActionButton
      action={deleteResource}
      hidden={{ id }}
      triggerLabel="Supprimer"
      triggerIcon={<Trash2 className="size-4" />}
      triggerVariant="ghost"
      title={`Supprimer « ${name} » ?`}
      description="Si la ressource a déjà des réservations, elle sera archivée afin de préserver l'historique. Sinon elle sera définitivement supprimée."
      confirmLabel="Supprimer"
      confirmVariant="destructive"
    />
  );
}
