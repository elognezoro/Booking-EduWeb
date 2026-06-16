"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Check, X, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { approveBooking, rejectBooking } from "@/app/actions/bookings";

function Pending({ label, icon, variant }: { label: string; icon: React.ReactNode; variant: any }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} className="flex-1">
      {pending ? <Loader2 className="size-4 animate-spin" /> : icon}
      {label}
    </Button>
  );
}

export function ValidationActions({ bookingId, size = "default" }: { bookingId: string; size?: "default" | "sm" }) {
  const [rejectOpen, setRejectOpen] = React.useState(false);

  return (
    <div className="flex gap-2">
      <form action={approveBooking} className="flex-1">
        <input type="hidden" name="bookingId" value={bookingId} />
        <Pending label="Approuver" icon={<Check className="size-4" />} variant="success" />
      </form>
      <Button type="button" variant="outline" className="flex-1 border-unavailable/40 text-unavailable-fg hover:bg-unavailable-soft" onClick={() => setRejectOpen(true)}>
        <X className="size-4" /> Refuser
      </Button>

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Refuser la demande" description="Indiquez le motif du refus. Il sera communiqué au demandeur.">
        <form action={rejectBooking} onSubmit={() => setRejectOpen(false)} className="space-y-4">
          <input type="hidden" name="bookingId" value={bookingId} />
          <div>
            <Label htmlFor="comment" required>Motif du refus</Label>
            <Textarea id="comment" name="comment" required placeholder="Ex. Ressource déjà mobilisée pour une mission officielle." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setRejectOpen(false)}>Annuler</Button>
            <Pending label="Confirmer le refus" icon={<X className="size-4" />} variant="destructive" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
