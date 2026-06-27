"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Briefcase, Building2, Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteCertelDiagnostics } from "@/app/actions/certel";
import { cn } from "@/lib/utils";

export interface CertelRow {
  id: string;
  fullName: string;
  contact: string | null;
  functionTitle: string | null;
  structure: string | null;
  levelKey: string;
  levelAccent: string;
  total100: number | null;
  practicalScore: number | null;
  score100: number;
  autoposScore: number;
  qcmScore: number;
  dateLabel: string;
}

/** Journal des diagnostics CERTEL avec sélection multiple + suppression groupée (super admin). */
export function CertelJournal({ rows }: { rows: CertelRow[] }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string) =>
    setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () => setSelected(() => (allSelected ? new Set() : new Set(rows.map((r) => r.id))));

  const doDelete = async () => {
    if (selected.size === 0 || pending) return;
    setPending(true);
    try {
      await deleteCertelDiagnostics({ ids: [...selected] });
      setSelected(new Set());
      setConfirmOpen(false);
    } finally {
      setPending(false);
    }
  };

  if (rows.length === 0) {
    return <EmptyState icon={GraduationCap} title="Aucun diagnostic pour le moment" description="Les tests de niveau réalisés depuis la page d'accueil apparaîtront ici." />;
  }

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-2.5">
          <span className="text-sm font-semibold text-unavailable-fg">
            {selected.size} diagnostic{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Annuler</Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}><Trash2 className="size-4" /> Supprimer la sélection</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="w-8 py-2 pr-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Tout sélectionner" className="size-4 rounded border-input text-primary focus:ring-2 focus:ring-ring" />
              </th>
              <th className="py-2 pr-3 font-semibold">Participant</th>
              <th className="py-2 pr-3 font-semibold">Profil</th>
              <th className="py-2 pr-3 font-semibold">Score</th>
              <th className="py-2 pr-3 font-semibold">Niveau</th>
              <th className="py-2 pr-3 font-semibold">Date</th>
              <th className="py-2 text-right font-semibold">Réponses</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className={cn("border-b border-border/60 align-top", selected.has(d.id) && "bg-secondary/40")}>
                <td className="py-2 pr-3">
                  <input type="checkbox" checked={selected.has(d.id)} onChange={() => toggle(d.id)} aria-label={`Sélectionner ${d.fullName}`} className="size-4 rounded border-input text-primary focus:ring-2 focus:ring-ring" />
                </td>
                <td className="py-2 pr-3">
                  <p className="font-semibold text-foreground">{d.fullName}</p>
                  {d.contact && <p className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Mail className="size-3" /> {d.contact}</p>}
                </td>
                <td className="py-2 pr-3 text-muted-foreground">
                  {d.functionTitle && <span className="block"><Briefcase className="mr-1 inline size-3" />{d.functionTitle}</span>}
                  {d.structure && <span className="block"><Building2 className="mr-1 inline size-3" />{d.structure}</span>}
                  {!d.functionTitle && !d.structure && "—"}
                </td>
                <td className="py-2 pr-3">
                  {d.total100 != null ? (
                    <>
                      <span className="font-bold text-foreground">{d.total100}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                      <span className="block text-[11px] text-advanced-fg">+ pratiques {d.practicalScore}/40</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-foreground">{d.score100}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                      <span className="block text-[11px] text-muted-foreground">provisoire</span>
                    </>
                  )}
                  <span className="block text-[11px] text-muted-foreground">auto {d.autoposScore}/30 · QCM {d.qcmScore}/30</span>
                </td>
                <td className="py-2 pr-3">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: d.levelAccent }}>{d.levelKey}</span>
                </td>
                <td className="py-2 pr-3 text-muted-foreground">{d.dateLabel}</td>
                <td className="py-2 text-right">
                  <Button asChild size="sm" variant="outline"><Link href={`/dashboard/platform/certel/${d.id}`}><Eye className="size-3.5" /> Voir</Link></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => { if (!pending) setConfirmOpen(false); }}
        title={`Supprimer ${selected.size} diagnostic${selected.size > 1 ? "s" : ""} ?`}
        description="Cette action est définitive : les réponses et évaluations sélectionnées seront supprimées."
      >
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setConfirmOpen(false)} disabled={pending}>Annuler</Button>
          <Button type="button" variant="destructive" onClick={doDelete} disabled={pending}>
            {pending ? <><Loader2 className="size-4 animate-spin" /> Suppression…</> : <><Trash2 className="size-4" /> Supprimer</>}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
