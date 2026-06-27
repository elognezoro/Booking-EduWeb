"use client";

import * as React from "react";
import { Users, UserPlus, X, Star, Search, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { addDepartmentMembers, removeDepartmentMember, setDepartmentHead } from "@/app/actions/admin";

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
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [query, setQuery] = React.useState("");
  const [pending, setPending] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => c.name.toLowerCase().includes(q) || (c.dept?.toLowerCase().includes(q) ?? false));
  }, [candidates, query]);

  const toggle = (id: string) =>
    setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));
  const toggleAllFiltered = () =>
    setSelected((s) => {
      const n = new Set(s);
      if (allFilteredSelected) filtered.forEach((c) => n.delete(c.id));
      else filtered.forEach((c) => n.add(c.id));
      return n;
    });

  const addSelected = async () => {
    if (selected.size === 0 || pending) return;
    setPending(true);
    try {
      await addDepartmentMembers({ departmentId: dept.id, userIds: [...selected] });
      setSelected(new Set());
      setQuery("");
    } finally {
      setPending(false);
    }
  };

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
              <ul className="max-h-44 space-y-1 overflow-y-auto pr-0.5">
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

          {/* Ajouter des agents (sélection multiple) */}
          {candidates.length > 0 && (
            <div className="border-t border-border pt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Ajouter des agents</p>
                {selected.size > 0 && <span className="text-xs font-semibold text-primary">{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>}
              </div>
              {candidates.length > 6 && (
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un utilisateur…"
                    className="w-full rounded-lg border border-input bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
              <div className="max-h-56 space-y-0.5 overflow-y-auto rounded-lg border border-border p-1">
                {filtered.length === 0 ? (
                  <p className="px-2 py-3 text-center text-sm text-muted-foreground">Aucun utilisateur trouvé.</p>
                ) : (
                  filtered.map((c) => (
                    <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary/60">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggle(c.id)}
                        className="size-4 shrink-0 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                      />
                      <span className="text-foreground">{c.name}</span>
                      {c.dept && <span className="text-xs text-muted-foreground">· {c.dept}</span>}
                    </label>
                  ))
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button type="button" onClick={toggleAllFiltered} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50" disabled={filtered.length === 0}>
                  {allFilteredSelected ? "Tout désélectionner" : "Tout sélectionner"}
                </button>
                <Button type="button" size="sm" onClick={addSelected} disabled={selected.size === 0 || pending}>
                  {pending ? <><Loader2 className="size-4 animate-spin" /> Ajout…</> : <><UserPlus className="size-4" /> Ajouter{selected.size > 0 ? ` (${selected.size})` : ""}</>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
