"use client";

import * as React from "react";
import { Eye, UserPlus, X, Search, Loader2, BellRing } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { addRoomSupervisors, removeRoomSupervisor } from "@/app/actions/rooms";

interface Person { id: string; name: string; dept?: string | null; }

/**
 * Affectation des surveillants d'une salle multimédia (plusieurs possibles),
 * parmi les agents de la sous-direction en charge des salles. Les surveillants
 * reçoivent les notifications d'arrivée (QR) et tiennent le registre.
 */
export function RoomSupervisorsButton({
  room,
  supervisors,
  candidates,
}: {
  room: { id: string; name: string };
  supervisors: Person[];
  candidates: Person[];
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

  const addSelected = async () => {
    if (selected.size === 0 || pending) return;
    setPending(true);
    try {
      await addRoomSupervisors({ roomId: room.id, userIds: [...selected] });
      setSelected(new Set());
      setQuery("");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} className="w-full">
        <Eye className="size-4" /> Surveillants{supervisors.length > 0 ? ` (${supervisors.length})` : ""}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Surveillants — salle ${room.name}`} description="Agents de la sous-direction en charge des salles, notifiés à chaque arrivée (QR) et chargés du registre.">
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <BellRing className="size-3.5" /> Surveillants affectés ({supervisors.length})
            </p>
            {supervisors.length > 0 ? (
              <ul className="max-h-40 space-y-1 overflow-y-auto pr-0.5">
                {supervisors.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
                    <span className="text-foreground">{s.name}{s.dept && <span className="ml-1.5 text-xs text-muted-foreground">· {s.dept}</span>}</span>
                    <form action={removeRoomSupervisor}>
                      <input type="hidden" name="roomId" value={room.id} />
                      <input type="hidden" name="userId" value={s.id} />
                      <Button type="submit" variant="ghost" size="icon-sm" aria-label={`Retirer ${s.name}`}><X className="size-4" /></Button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun surveillant : les notifications d'arrivée sont envoyées au responsable de la salle, sinon aux responsables de ressources.</p>
            )}
          </div>

          {candidates.length > 0 ? (
            <div className="border-t border-border pt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Affecter des surveillants</p>
                {selected.size > 0 && <span className="text-xs font-semibold text-primary">{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>}
              </div>
              {candidates.length > 6 && (
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un agent…"
                    className="w-full rounded-lg border border-input bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
              <div className="max-h-52 space-y-0.5 overflow-y-auto rounded-lg border border-border p-1">
                {filtered.length === 0 ? (
                  <p className="px-2 py-3 text-center text-sm text-muted-foreground">Aucun agent trouvé.</p>
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
              <div className="mt-2 flex justify-end">
                <Button type="button" size="sm" onClick={addSelected} disabled={selected.size === 0 || pending}>
                  {pending ? <><Loader2 className="size-4 animate-spin" /> Affectation…</> : <><UserPlus className="size-4" /> Affecter{selected.size > 0 ? ` (${selected.size})` : ""}</>}
                </Button>
              </div>
            </div>
          ) : (
            <p className="border-t border-border pt-3 text-sm text-muted-foreground">
              Aucun agent éligible : affectez d'abord des agents à la sous-direction de rattachement de la salle
              (page « Sites & services »).
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
