"use client";

import * as React from "react";
import { GripVertical, Users, Boxes, Star, CornerDownRight, Trash2, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  child: boolean;
  headName: string | null;
  counts: { users: number; resources: number; children: number };
  members: { id: string; name: string }[];
  candidates: { id: string; name: string; dept: string | null }[];
}

/** Arborescence des services d'un site, avec déplacement hiérarchique par glisser-déposer. */
export function ServiceTree({ nodes, niveaux, sites }: { nodes: ServiceNode[]; niveaux: { id: string; name: string }[]; sites: { id: string; name: string }[] }) {
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null); // id d'un niveau survolé, ou "ROOT"
  const [pending, startTransition] = React.useTransition();

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
        const isNiveau = !d.child;
        const isTarget = isNiveau && overId === d.id && dragId !== d.id;
        return (
          <div
            key={d.id}
            draggable
            onDragStart={(e) => { setDragId(d.id); e.dataTransfer.effectAllowed = "move"; }}
            onDragEnd={() => { setDragId(null); setOverId(null); }}
            onDragOver={isNiveau ? (e) => { e.preventDefault(); if (dragId && dragId !== d.id) setOverId(d.id); } : undefined}
            onDragLeave={isNiveau ? () => setOverId((o) => (o === d.id ? null : o)) : undefined}
            onDrop={isNiveau ? (e) => { e.preventDefault(); if (dragId && dragId !== d.id) drop(d.id); } : undefined}
            className={cn(
              "group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60",
              d.child && "ml-5",
              dragId === d.id && "opacity-40",
              isTarget && "ring-2 ring-advanced ring-inset bg-advanced-soft/50",
            )}
          >
            <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
              <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/60 active:cursor-grabbing" />
              {d.child && <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />}
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
              <EditDepartmentButton dept={{ id: d.id, name: d.name, code: d.code, siteId: d.siteId, parentId: d.parentId }} sites={sites} niveaux={niveaux} />
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

      {/* Zone pour remonter un service en niveau (Direction / Sous-Direction). */}
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
        <MoveDown className="size-3.5" /> Déposer ici pour en faire un niveau (sans rattachement)
      </div>
    </div>
  );
}
