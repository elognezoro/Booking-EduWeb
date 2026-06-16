"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { CalendarPlus, Loader2, KeyRound } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reserveDocument } from "@/app/actions/library";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? <Loader2 className="size-4 animate-spin" /> : <CalendarPlus className="size-4" />} {label}</Button>;
}

export function ReserveButton({
  documentId, canReserve, needsRequest,
}: {
  documentId: string; canReserve: boolean; needsRequest: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  if (!canReserve && !needsRequest) return null;

  return (
    <>
      {canReserve ? (
        <Button onClick={() => setOpen(true)} className="w-full"><CalendarPlus className="size-4" /> Réserver / Emprunter</Button>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)} className="w-full"><KeyRound className="size-4" /> Demander l'accès</Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={canReserve ? "Réserver ce document" : "Demander l'accès"} description={canReserve ? "Consultation sur place ou emprunt physique." : "Votre demande sera transmise au documentaliste."}>
        <form action={reserveDocument} onSubmit={() => setOpen(false)} className="space-y-4">
          <input type="hidden" name="documentId" value={documentId} />
          {canReserve ? (
            <>
              <div>
                <Label htmlFor="type">Type de demande</Label>
                <Select id="type" name="type" defaultValue="ON_SITE">
                  <option value="ON_SITE">Consultation sur place</option>
                  <option value="LOAN">Emprunt physique</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="ss">Début (sur place)</Label><Input id="ss" name="slotStart" type="datetime-local" /></div>
                <div><Label htmlFor="se">Fin</Label><Input id="se" name="slotEnd" type="datetime-local" /></div>
              </div>
            </>
          ) : (
            <input type="hidden" name="type" value="ACCESS_REQUEST" />
          )}
          <div><Label htmlFor="note">Motif / note</Label><Textarea id="note" name="note" placeholder="Précisez votre besoin…" /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Submit label={canReserve ? "Envoyer la demande" : "Demander l'accès"} />
          </div>
        </form>
      </Modal>
    </>
  );
}
