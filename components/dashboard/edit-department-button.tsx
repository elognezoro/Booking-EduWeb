"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateDepartment } from "@/app/actions/admin";

interface DeptLite {
  id: string;
  name: string;
  code: string | null;
  siteId: string | null;
  parentId: string | null;
}

/** Bouton + fenêtre d'édition d'un service (nom, code, site, rattachement à un niveau). */
export function EditDepartmentButton({
  dept,
  sites,
  niveaux,
}: {
  dept: DeptLite;
  sites: { id: string; name: string }[];
  niveaux: { id: string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const parentChoices = niveaux.filter((n) => n.id !== dept.id);

  return (
    <>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label={`Modifier ${dept.name}`}>
        <Pencil className="size-4" />
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Modifier « ${dept.name} »`} description="Service / sous-structure de l'organisation.">
        <form action={updateDepartment} onSubmit={() => setOpen(false)} className="space-y-3">
          <input type="hidden" name="id" value={dept.id} />
          <div>
            <Label htmlFor={`dn-${dept.id}`} required>Nom</Label>
            <Input id={`dn-${dept.id}`} name="name" defaultValue={dept.name} required />
          </div>
          <div>
            <Label htmlFor={`dc-${dept.id}`}>Code</Label>
            <Input id={`dc-${dept.id}`} name="code" defaultValue={dept.code ?? ""} placeholder="Ex. APRID" />
          </div>
          <div>
            <Label htmlFor={`ds-${dept.id}`}>Site de rattachement</Label>
            <Select id={`ds-${dept.id}`} name="siteId" defaultValue={dept.siteId ?? ""}>
              <option value="">—</option>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor={`dp-${dept.id}`}>Rattaché à</Label>
            <Select id={`dp-${dept.id}`} name="parentId" defaultValue={dept.parentId ?? ""}>
              <option value="">— (aucun parent)</option>
              {parentChoices.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">Laisser vide pour un service de premier niveau, ou choisir un parent pour l'imbriquer (profondeur libre).</p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
