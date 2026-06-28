import { GraduationCap } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TrainingExplorer } from "@/components/help/training-explorer";
import { ROLE_TRAINING } from "@/lib/role-training";
import { ROLES, ROLE_META, type RoleKey } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const user = await requireUser();
  const isAdmin = user.permissions.has("users.manage");
  const ownRoles = user.roles.filter((r): r is RoleKey => r in ROLE_TRAINING);
  // Administrateurs : formation de TOUS les rôles. Autres : leur(s) rôle(s).
  const roleKeys: RoleKey[] = isAdmin ? (ROLES as readonly RoleKey[]).filter((r) => r in ROLE_TRAINING) : ownRoles;
  // Place le(s) rôle(s) de l'utilisateur en premier.
  const ordered = [...roleKeys].sort((a, b) => Number(ownRoles.includes(b)) - Number(ownRoles.includes(a)));
  const entries = ordered.map((k) => ({ key: k, label: ROLE_META[k].label, color: ROLE_META[k].color, training: ROLE_TRAINING[k] }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Formation & auto-évaluation"
        description="Modules de prise en main de la plateforme et tests d'auto-évaluation à correction immédiate, adaptés à votre rôle."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><GraduationCap className="size-6" /></span>}
      />
      {entries.length === 0 ? (
        <Card><CardContent className="py-6 text-sm text-muted-foreground">Aucune formation associée à votre profil pour le moment.</CardContent></Card>
      ) : (
        <TrainingExplorer entries={entries} />
      )}
    </div>
  );
}
