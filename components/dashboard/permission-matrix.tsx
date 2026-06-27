"use client";

import * as React from "react";
import { Check, Minus, Loader2, Lock } from "lucide-react";
import { toggleRolePermission } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

interface RoleHeader { key: string; label: string; color: string }

/** Matrice rôles × permissions. L'administrateur système peut attribuer/retirer un droit en cliquant. */
export function PermissionMatrix({
  roleHeaders,
  permissions,
  labels,
  grants,
  editable,
}: {
  roleHeaders: RoleHeader[];
  permissions: readonly string[];
  labels: Record<string, string>;
  grants: Record<string, string[]>;
  editable: boolean;
}) {
  const [pending, startTransition] = React.useTransition();
  const [busyCell, setBusyCell] = React.useState<string | null>(null);

  const sets = React.useMemo(() => {
    const m: Record<string, Set<string>> = {};
    for (const r of roleHeaders) m[r.key] = new Set(grants[r.key] ?? []);
    return m;
  }, [roleHeaders, grants]);

  const toggle = (roleKey: string, permission: string, has: boolean) => {
    setBusyCell(`${roleKey}|${permission}`);
    startTransition(async () => {
      await toggleRolePermission({ roleKey, permission, granted: !has });
      setBusyCell(null);
    });
  };

  const base = "inline-flex size-6 items-center justify-center rounded-full";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-secondary/40">
          <tr>
            <th className="sticky left-0 z-10 bg-secondary/40 px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Permission</th>
            {roleHeaders.map((r) => (
              <th key={r.key} className="px-3 py-3 text-center">
                <span className="inline-block max-w-[80px] text-[11px] font-bold leading-tight" style={{ color: r.color }}>{r.label.split(" ")[0]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((p) => (
            <tr key={p} className="border-b border-border last:border-0">
              <td className="sticky left-0 z-10 bg-card px-4 py-2.5">
                <p className="font-medium text-foreground">{labels[p]}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{p}</p>
              </td>
              {roleHeaders.map((r) => {
                const isSuper = r.key === "SUPER_ADMIN";
                const isPlatformPerm = p === "platform.manage";
                const has = isSuper || sets[r.key].has(p);
                const locked = isSuper || isPlatformPerm; // super = tous les droits ; platform.manage = super uniquement
                const cellEditable = editable && !locked;
                const busy = busyCell === `${r.key}|${p}`;
                return (
                  <td key={r.key} className="px-3 py-2.5 text-center">
                    {cellEditable ? (
                      <button
                        type="button"
                        onClick={() => toggle(r.key, p, has)}
                        disabled={pending}
                        title={has ? "Retirer cette permission" : "Attribuer cette permission"}
                        className={cn(base, "transition-all hover:ring-2 hover:ring-advanced/40", has ? "bg-available-soft text-available-fg" : "bg-muted text-muted-foreground/40 hover:text-advanced-fg", pending && "opacity-60")}
                      >
                        {busy ? <Loader2 className="size-3.5 animate-spin" /> : has ? <Check className="size-3.5" /> : <Minus className="size-3.5" />}
                      </button>
                    ) : (
                      <span
                        className={cn(base, has ? "bg-available-soft text-available-fg" : "bg-muted text-muted-foreground/40")}
                        title={isSuper ? "Super administrateur : tous les droits" : isPlatformPerm ? "Réservé au super administrateur" : undefined}
                      >
                        {has ? <Check className="size-3.5" /> : isPlatformPerm && !isSuper ? <Lock className="size-3 opacity-50" /> : <Minus className="size-3.5" />}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
