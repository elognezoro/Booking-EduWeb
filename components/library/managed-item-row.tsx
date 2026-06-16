"use client";

import * as React from "react";
import { Pencil, Power, Check, X, FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/** Ligne d'une collection / d'un domaine : affichage, bascule actif/inactif et modification en ligne (nom + code). */
export function ManagedItemRow({
  item,
  toggleAction,
  updateAction,
  activeLabel,
  inactiveLabel,
}: {
  item: { id: string; name: string; code: string; active: boolean; count: number };
  toggleAction: (formData: FormData) => void | Promise<void>;
  updateAction: (formData: FormData) => void | Promise<void>;
  activeLabel: string;
  inactiveLabel: string;
}) {
  const [editing, setEditing] = React.useState(false);

  if (editing) {
    return (
      <form action={updateAction} className="flex flex-wrap items-center gap-2 bg-card px-4 py-3">
        <input type="hidden" name="id" value={item.id} />
        <Input name="name" defaultValue={item.name} required aria-label="Nom" className="h-9 min-w-0 flex-1" />
        <Input name="code" defaultValue={item.code} required aria-label="Code" className="h-9 w-24 font-mono uppercase" />
        <Button type="submit" size="icon-sm" title="Enregistrer"><Check className="size-4" /></Button>
        <Button type="button" variant="ghost" size="icon-sm" title="Annuler" onClick={() => setEditing(false)}><X className="size-4" /></Button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-card px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">
          {item.name} <span className="font-mono text-xs text-muted-foreground">({item.code})</span>
        </p>
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground"><FileStack className="size-3" /> {item.count} document(s)</p>
      </div>
      <div className="flex items-center gap-1.5">
        <Badge tone={item.active ? "available" : "neutral"}>{item.active ? activeLabel : inactiveLabel}</Badge>
        <Button type="button" variant="ghost" size="icon-sm" title="Modifier" onClick={() => setEditing(true)}>
          <Pencil className="size-4 text-muted-foreground" />
        </Button>
        <form action={toggleAction}>
          <input type="hidden" name="id" value={item.id} />
          <Button type="submit" variant="ghost" size="icon-sm" title={item.active ? "Désactiver" : "Activer"}>
            <Power className={item.active ? "size-4 text-available" : "size-4 text-muted-foreground"} />
          </Button>
        </form>
      </div>
    </div>
  );
}
