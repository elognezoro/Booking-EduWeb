"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Minus, Plus, Check, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmActionButton } from "@/components/confirm-action";
import { setRoomCapacity, deleteRoom } from "@/app/actions/rooms";
import { cn } from "@/lib/utils";

function SaveButton({ changed }: { changed: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon-sm" variant={changed ? "success" : "ghost"} disabled={pending || !changed} title="Enregistrer la capacité">
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
    </Button>
  );
}

export function RoomManageBar({
  id, capacity, canUpdate, canDelete, name,
}: {
  id: string; capacity: number; canUpdate: boolean; canDelete: boolean; name: string;
}) {
  const [value, setValue] = React.useState(capacity);
  const changed = value !== capacity;

  return (
    <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
      {canUpdate ? (
        <form action={setRoomCapacity} className="flex items-center gap-1.5">
          <input type="hidden" name="id" value={id} />
          <span className="mr-1 text-xs font-semibold text-muted-foreground">Postes</span>
          <Button type="button" size="icon-sm" variant="outline" onClick={() => setValue((v) => Math.max(1, v - 1))} aria-label="Retirer un poste">
            <Minus className="size-4" />
          </Button>
          <input
            name="capacity"
            type="number"
            min={1}
            max={500}
            value={value}
            onChange={(e) => setValue(Math.max(1, Number(e.target.value) || 1))}
            className="h-8 w-14 rounded-lg border border-input bg-card text-center text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="button" size="icon-sm" variant="outline" onClick={() => setValue((v) => Math.min(500, v + 1))} aria-label="Ajouter un poste">
            <Plus className="size-4" />
          </Button>
          <SaveButton changed={changed} />
        </form>
      ) : (
        <span className="text-xs text-muted-foreground">{capacity} postes</span>
      )}

      {canDelete && (
        <ConfirmActionButton
          action={deleteRoom}
          hidden={{ id }}
          triggerLabel=""
          triggerIcon={<Trash2 className="size-4" />}
          triggerVariant="ghost"
          triggerSize="icon-sm"
          title={`Retirer « ${name} » ?`}
          description="Si la salle a déjà des réservations, elle sera archivée afin de préserver l'historique ; sinon elle sera définitivement supprimée."
          confirmLabel="Retirer la salle"
          confirmVariant="destructive"
        />
      )}
    </div>
  );
}
