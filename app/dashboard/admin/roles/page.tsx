import { ShieldCheck, Info } from "lucide-react";
import { requirePermission, isSuperAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { RoleBadge } from "@/components/status-badges";
import { ROLES, ROLE_META } from "@/lib/enums";
import { PERMISSIONS, PERMISSION_LABELS } from "@/lib/permissions";
import { getEffectiveRolePermissions } from "@/lib/role-permissions";
import { PermissionMatrix } from "@/components/dashboard/permission-matrix";

export const dynamic = "force-dynamic";

export default async function RolesAdminPage() {
  const user = await requirePermission("roles.manage");
  const isSuper = isSuperAdmin(user);
  // Super admin : matrice GLOBALE (tous les établissements). Admin d'établissement : matrice de SON établissement.
  const grants = await getEffectiveRolePermissions(isSuper ? undefined : user.organizationId);
  const roleHeaders = ROLES.map((r) => ({ key: r, label: ROLE_META[r].label, color: ROLE_META[r].color }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Rôles & permissions"
        description={isSuper
          ? "Cliquez sur une case pour attribuer ou retirer une permission à un rôle. Les changements s'appliquent à tous les établissements."
          : "Personnalisez les droits des rôles de votre établissement. Vos changements ne concernent que votre personnel."}
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><ShieldCheck className="size-6" /></span>}
      />

      <div className="flex items-start gap-2 rounded-xl border border-advanced/20 bg-advanced-soft/40 px-4 py-3 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-advanced-fg" />
        {isSuper ? (
          <p>Réglage <strong>global</strong> (tous les établissements). Le <strong>Super administrateur</strong> conserve toujours l'ensemble des droits (non modifiable), et la supervision plateforme reste réservée à ce rôle. Un établissement peut, de son côté, personnaliser les droits de son propre personnel.</p>
        ) : (
          <p><strong>Admin délégué</strong> : vos réglages s'appliquent <strong>uniquement au personnel de votre établissement</strong>, sans effet sur les autres institutions. Vous ne pouvez pas modifier le rôle Super Administrateur ni votre propre rôle, et vous ne pouvez accorder qu'un droit que vous possédez vous-même.</p>
        )}
      </div>

      {/* Cartes de rôles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <Card key={r} className="card-hover">
            <CardContent className="py-5">
              <RoleBadge roleKey={r} />
              <p className="mt-3 text-sm text-muted-foreground">{ROLE_META[r].description}</p>
              <p className="mt-3 text-xs font-semibold text-foreground">{grants[r].length} permission(s)</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matrice éditable */}
      <Card className="overflow-hidden">
        <PermissionMatrix roleHeaders={roleHeaders} permissions={PERMISSIONS} labels={PERMISSION_LABELS} grants={grants} editable editorIsSuper={isSuper} editorPermissions={Array.from(user.permissions)} />
      </Card>
    </div>
  );
}
