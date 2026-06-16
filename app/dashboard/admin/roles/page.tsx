import { ShieldCheck, Check, Minus } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { RoleBadge } from "@/components/status-badges";
import { ROLES, ROLE_META, type RoleKey } from "@/lib/enums";
import { PERMISSIONS, PERMISSION_LABELS, ROLE_PERMISSIONS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function RolesAdminPage() {
  await requirePermission("roles.manage");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Rôles & permissions"
        description="7 rôles prédéfinis et leurs droits d'accès. L'interface masque automatiquement les éléments interdits."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><ShieldCheck className="size-6" /></span>}
      />

      {/* Cartes de rôles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <Card key={r} className="card-hover">
            <CardContent className="py-5">
              <RoleBadge roleKey={r} />
              <p className="mt-3 text-sm text-muted-foreground">{ROLE_META[r].description}</p>
              <p className="mt-3 text-xs font-semibold text-foreground">{ROLE_PERMISSIONS[r].length} permission(s)</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matrice */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40">
              <tr>
                <th className="sticky left-0 z-10 bg-secondary/40 px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Permission</th>
                {ROLES.map((r) => (
                  <th key={r} className="px-3 py-3 text-center">
                    <span className="inline-block max-w-[80px] text-[11px] font-bold leading-tight" style={{ color: ROLE_META[r].color }}>
                      {ROLE_META[r].label.split(" ")[0]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p} className="border-b border-border last:border-0">
                  <td className="sticky left-0 z-10 bg-card px-4 py-2.5">
                    <p className="font-medium text-foreground">{PERMISSION_LABELS[p]}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{p}</p>
                  </td>
                  {ROLES.map((r) => {
                    const has = ROLE_PERMISSIONS[r as RoleKey].includes(p);
                    return (
                      <td key={r} className="px-3 py-2.5 text-center">
                        {has ? (
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-available-soft text-available-fg"><Check className="size-3.5" /></span>
                        ) : (
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40"><Minus className="size-3.5" /></span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
