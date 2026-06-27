"use client";

import * as React from "react";
import { GripVertical, Users, Boxes, Star, CornerDownRight, Trash2, MoveDown } from "lucide-react";
import { ConfirmActionButton } from "@/components/confirm-action";
import { EditDepartmentButton } from "@/components/dashboard/edit-department-button";
import { ManageMembersButton } from "@/components/dashboard/manage-members-button";
import { moveDepartment, deleteDepartment } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export interface ServiceNode {
  id: string;
  name: string;
  code: string | null;
  siteId: string | null;
  parentId: string | null;
  headId: string | null;
  depth: number;
  level: number | null;
  headName: string | null;
  counts: { users: number; resources: number; children: number };
  members: { id: string; name: string }[];
  candidates: { id: string; name: string; dept: string | null }[];
}

/** Arborescence des services d'un site (profondeur libre), avec déplacement par glisser-déposer. */
export function ServiceTree({ nodes, parents, sites }: { nodes: ServiceNode[]; parents: { id: string; name: string }[]; sites: { id: string; name: string }[] }) {
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const childrenMap = React.useMemo(() => {
    const m = new Map<string, string[]>();
    for (const n of nodes) {
      const k = n.parentId ?? "__root__";
      const a = m.get(k) ?? [];
      a.push(n.id);
      m.set(k, a);
    }
    return m;
  }, [nodes]);

  // Descendants du nœud en cours de déplacement : on ne peut pas le déposer sur eux (cycle).
  const dragDescendants = React.useMemo(() => {
    const out = new Set<string>();
    if (!dragId) return out;
    const stack = [dragId];
    while (stack.length) {
      const c = stack.pop()!;
      for (const ch of childrenMap.get(c) ?? []) if (!out.has(ch)) { out.add(ch); stack.push(ch); }
    }
    return out;
  }, [dragId, childrenMap]);

  const canDropOn = (id: string) => !!dragId && id !== dragId && !dragDescendants.has(id);

  const drop = (parentId: string | null) => {
    const id = dragId;
    setDragId(null);
    setOverId(null);
    if (!id) return;
    startTransition(() => { void moveDepartment({ id, parentId }); });
  };

  return (
    <div className={cn("mt-3 space-y-0.5 border-l-2 border-border pl-3 transition-opacity", pending && "pointer-events-none opacity-60")}>
      {nodes.map((d) => {
        const empty = d.counts.users === 0 && d.counts.resources === 0 && d.counts.children === 0;
        const isTarget = overId === d.id && canDropOn(d.id);
        return (
          <div
            key={d.id}
            draggable
            onDragStart={(e) => { setDragId(d.id); e.dataTransfer.effectAllowed = "move"; }}
            onDragEnd={() => { setDragId(null); setOverId(null); }}
            onDragOver={(e) => { if (canDropOn(d.id)) { e.preventDefault(); setOverId(d.id); } }}
            onDragLeave={() => setOverId((o) => (o === d.id ? null : o))}
            onDrop={(e) => { if (canDropOn(d.id)) { e.preventDefault(); drop(d.id); } }}
            style={{ marginLeft: d.depth > 0 ? d.depth * 18 : undefined }}
            className={cn(
              "group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60",
              dragId === d.id && "opacity-40",
              isTarget && "bg-advanced-soft/50 ring-2 ring-inset ring-advanced",
            )}
          >
            <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
              <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/60 active:cursor-grabbing" />
              {d.depth > 0 && <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />}
              <span className="truncate">{d.name}</span>
              {d.code && <span className="shrink-0 text-xs text-muted-foreground">· {d.code}</span>}
              {d.headName && <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-advanced-fg"><Star className="size-3" /> {d.headName}</span>}
              {d.counts.children > 0 && <span className="shrink-0 text-xs text-muted-foreground">· {d.counts.children} sous-service{d.counts.children > 1 ? "s" : ""}</span>}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="size-3" /> {d.counts.users}</span>
                <span className="inline-flex items-center gap-1"><Boxes className="size-3" /> {d.counts.resources}</span>
              </span>
              <ManageMembersButton dept={{ id: d.id, name: d.name, headId: d.headId }} members={d.members} candidates={d.candidates} />
              <EditDepartmentButton dept={{ id: d.id, name: d.name, code: d.code, siteId: d.siteId, parentId: d.parentId, level: d.level }} sites={sites} niveaux={parents} />
              {empty && (
                <ConfirmActionButton
                  action={deleteDepartment}
                  hidden={{ id: d.id }}
                  triggerLabel=""
                  triggerIcon={<Trash2 className="size-4" />}
                  triggerVariant="ghost"
                  triggerSize="icon-sm"
                  title={`Supprimer le service « ${d.name} » ?`}
                  description="Cette action est définitive. Seul un service vide (sans agent, ressource ni sous-service) peut être supprimé."
                  confirmLabel="Supprimer"
                  confirmVariant="destructive"
                />
              )}
            </span>
          </div>
        );
      })}

      {/* Zone pour remonter un service à la racine (sans parent). */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (dragId) setOverId("ROOT"); }}
        onDragLeave={() => setOverId((o) => (o === "ROOT" ? null : o))}
        onDrop={(e) => { e.preventDefault(); if (dragId) drop(null); }}
        className={cn(
          "mt-1 flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-xs text-muted-foreground transition-colors",
          overId === "ROOT" ? "border-advanced bg-advanced-soft/50 text-advanced-fg" : "border-border/70",
          !dragId && "opacity-0",
        )}
        aria-hidden={!dragId}
      >
        <MoveDown className="size-3.5" /> Déposer ici pour le mettre au niveau racine (sans parent)
      </div>
    </div>
  );
}
