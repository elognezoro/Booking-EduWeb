"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Check, X, PencilLine, Loader2, Send, Archive, FlaskConical } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  validateDocument, requestCorrection, rejectDocument, publishDocument, archiveDocument, scientificReview,
} from "@/app/actions/library";

function Submit({ label, variant, icon }: { label: string; variant: ButtonProps["variant"]; icon: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : icon} {label}
    </Button>
  );
}

export function ReviewActions({
  documentId, status, canReview, canScience,
}: {
  documentId: string; status: string; canReview: boolean; canScience: boolean;
}) {
  const [modal, setModal] = React.useState<null | "validate" | "correct" | "reject" | "science">(null);
  const isPending = ["SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION"].includes(status);
  const isValidated = ["VALIDATED", "RESTRICTED", "EMBARGOED", "CONFIDENTIAL"].includes(status);

  return (
    <div className="space-y-2">
      {canReview && isPending && (
        <div className="grid grid-cols-1 gap-2">
          <Button variant="success" onClick={() => setModal("validate")} className="w-full"><Check className="size-4" /> Valider le document</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setModal("correct")}><PencilLine className="size-4" /> Corriger</Button>
            <Button variant="outline" className="border-unavailable/40 text-unavailable-fg hover:bg-unavailable-soft" onClick={() => setModal("reject")}><X className="size-4" /> Rejeter</Button>
          </div>
        </div>
      )}

      {canReview && isValidated && (
        <div className="grid grid-cols-2 gap-2">
          <form action={publishDocument}>
            <input type="hidden" name="documentId" value={documentId} />
            <Button type="submit" className="w-full"><Send className="size-4" /> Publier</Button>
          </form>
          <form action={archiveDocument}>
            <input type="hidden" name="documentId" value={documentId} />
            <Button type="submit" variant="outline" className="w-full"><Archive className="size-4" /> Archiver</Button>
          </form>
        </div>
      )}

      {canScience && (
        <Button variant="subtle" onClick={() => setModal("science")} className="w-full"><FlaskConical className="size-4" /> Avis scientifique</Button>
      )}

      {/* Modale : valider */}
      <Modal open={modal === "validate"} onClose={() => setModal(null)} title="Valider le document" description="Un code documentaire définitif sera généré.">
        <form action={validateDocument} onSubmit={() => setModal(null)} className="space-y-4">
          <input type="hidden" name="documentId" value={documentId} />
          <div><Label htmlFor="vc">Commentaire (facultatif)</Label><Textarea id="vc" name="comment" placeholder="Observation interne…" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" name="publish" className="size-4 rounded border-input text-primary focus:ring-ring" /><span className="text-sm font-medium">Publier directement</span></label>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><Submit label="Valider" variant="success" icon={<Check className="size-4" />} /></div>
        </form>
      </Modal>

      {/* Modale : correction */}
      <Modal open={modal === "correct"} onClose={() => setModal(null)} title="Demander une correction">
        <form action={requestCorrection} onSubmit={() => setModal(null)} className="space-y-4">
          <input type="hidden" name="documentId" value={documentId} />
          <div><Label htmlFor="cc" required>Précisions</Label><Textarea id="cc" name="comment" required placeholder="Indiquez les corrections attendues…" /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><Submit label="Demander correction" variant="default" icon={<PencilLine className="size-4" />} /></div>
        </form>
      </Modal>

      {/* Modale : rejet */}
      <Modal open={modal === "reject"} onClose={() => setModal(null)} title="Rejeter le dépôt">
        <form action={rejectDocument} onSubmit={() => setModal(null)} className="space-y-4">
          <input type="hidden" name="documentId" value={documentId} />
          <div><Label htmlFor="rc" required>Motif du rejet</Label><Textarea id="rc" name="comment" required placeholder="Motif communiqué au déposant…" /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><Submit label="Confirmer le rejet" variant="destructive" icon={<X className="size-4" />} /></div>
        </form>
      </Modal>

      {/* Modale : avis scientifique */}
      <Modal open={modal === "science"} onClose={() => setModal(null)} title="Avis scientifique">
        <form action={scientificReview} onSubmit={() => setModal(null)} className="space-y-4">
          <input type="hidden" name="documentId" value={documentId} />
          <div>
            <Label required>Décision</Label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2"><input type="radio" name="decision" value="favorable" defaultChecked /> Favorable</label>
              <label className="flex items-center gap-2"><input type="radio" name="decision" value="reserved" /> Réservé</label>
            </div>
          </div>
          <div><Label htmlFor="sc">Commentaire</Label><Textarea id="sc" name="comment" placeholder="Avis scientifique…" /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><Submit label="Enregistrer l'avis" variant="subtle" icon={<FlaskConical className="size-4" />} /></div>
        </form>
      </Modal>
    </div>
  );
}
