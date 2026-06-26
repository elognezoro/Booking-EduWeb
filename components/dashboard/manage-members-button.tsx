"use client";

import * as React from "react";
import { Users, UserPlus, X, Star } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { addDepartmentMember, removeDepartmentMember, setDepartmentHead } from "@/app/actions/admin";

interface Member { id: string; name: string; }
interface Candidate { id: string; name: string; dept: string | null; }

/** Bouton + fenêtre de gestion des membres d'un service : responsable + agents (ajout/retrait). */
export function ManageMembersButton({
  dept,
  members,
  candidates,
}: {
  dept: { id: string; name: string; headId: string | null };
  members: Member[];
  candidates: Candidate[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label={`Membres de ${dept.name}`} title="Responsable & agents">
        <Users className="size-4" />
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Membres — ${dept.name}`} description="Responsable et agents du service.">
        <div className="space-y-4">
          {/* Responsable */}
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Star className="size-3.5" /> Responsable</p>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ajoutez d'abord un agent pour pouvoir désigner un responsable.</p>
            ) : (
              <form action={setDepartmentHead}>
                <input type="hidden" name="departmentId" value={dept.id} />
                <Select name="userId" defaultValue={dept.headId ?? ""} onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                  <option value="">— Aucun responsable</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </Select>
              </form>
            )}
          </div>

          {/* Agents */}
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Users className="size-3.5" /> Agents ({members.length})</p>
            {members.length > 0 ? (
              <ul className="space-y-1">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
                    <span className="flex items-center gap-1.5 text-foreground">
                      {m.id === dept.headId && <Star className="size-3.5 shrink-0 text-advanced-fg" />}
                      {m.name}
                      {m.id === dept.headId && <span className="text-xs font-semibold text-advanced-fg">· responsable</span>}
                    </span>
                    <form action={removeDepartmentMember}>
                      <input type="hidden" name="departmentId" value={dept.id} />
                      <input type="hidden" name="userId" value={m.id} />
                      <Button type="submit" variant="ghost" size="icon-sm" aria-label={`Retirer ${m.name}`}><X className="size-4" /></Button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun agent pour le moment.</p>
            )}
          </div>

          {/* Ajouter un agent */}
          {candidates.length > 0 && (
            <form action={addDepartmentMember} className="flex items-end gap-2 border-t border-border pt-3">
              <input type="hidden" name="departmentId" value={dept.id} />
              <div className="flex-1">
                <label htmlFor={`addm-${dept.id}`} className="mb-1 block text-xs font-semibold text-muted-foreground">Ajouter un agent</label>
                <Select id={`addm-${dept.id}`} name="userId" defaultValue="">
                  <option value="" disabled>Choisir un utilisateur…</option>
                  {candidates.map((c) => <option key={c.id} value={c.id}>{c.name}{c.dept ? ` (actuellement : ${c.dept})` : ""}</option>)}
                </Select>
              </div>
              <SubmitButton size="sm" pendingLabel="Ajout…"><UserPlus className="size-4" /> Ajouter</SubmitButton>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
