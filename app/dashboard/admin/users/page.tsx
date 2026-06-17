import { Users, UserPlus, CheckCircle2, Power, Mail, KeyRound } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { RoleBadge } from "@/components/status-badges";
import { createUser, toggleUserStatus, resetUserPassword } from "@/app/actions/admin";
import { CsvImport } from "@/components/admin/csv-import";
import { StudentMatriculeField } from "@/components/admin/student-matricule-field";
import { ROLES, ROLE_META, USER_STATUS_META, type UserStatus } from "@/lib/enums";
import { fromNow } from "@/lib/dates";
import { ENS_MATRICULE_EXAMPLE } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage({ searchParams }: { searchParams: { created?: string; error?: string; reset?: string } }) {
  await requirePermission("users.manage");
  const me = await getCurrentUser();
  const organizationId = me!.organizationId ?? "";

  const [users, departments, org] = await Promise.all([
    prisma.user.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, include: { roles: { include: { role: true } }, department: true } }),
    prisma.department.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.organization.findUnique({ where: { id: organizationId }, select: { slug: true } }),
  ]);
  const isEns = org?.slug === "ens-abidjan";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Utilisateurs"
        description="Gérez les comptes, les rôles et les accès de votre organisation."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Users className="size-6" /></span>}
      />

      {searchParams.created && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Utilisateur créé (mot de passe par défaut : password123).
        </div>
      )}
      {searchParams.reset && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <KeyRound className="size-5" /> Mot de passe de {searchParams.reset} réinitialisé à <code>password123</code> (à changer à la première connexion).
        </div>
      )}
      {searchParams.error === "exists" && (
        <div className="rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          Un utilisateur avec cet e-mail existe déjà.
        </div>
      )}
      {searchParams.error === "matricule" && (
        <div className="rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          Matricule étudiant invalide (format attendu : {ENS_MATRICULE_EXAMPLE}).
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Liste */}
        <Card className="overflow-hidden">
          <CardHeader><CardTitle>{users.length} utilisateur(s)</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-border bg-secondary/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Utilisateur</th>
                  <th className="px-4 py-2.5">Rôle</th>
                  <th className="px-4 py-2.5">Statut</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const status = USER_STATUS_META[u.status as UserStatus] ?? { label: u.status, tone: "neutral" as const };
                  return (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar firstName={u.firstName} lastName={u.lastName} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">{u.firstName} {u.lastName}</p>
                            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => <RoleBadge key={r.roleId} roleKey={r.role.key} />)}
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge tone={status.tone} dot>{status.label}</Badge></td>
                      <td className="px-4 py-3">
                        {u.id !== me!.id && (
                          <div className="flex items-center justify-end gap-1">
                            <form action={resetUserPassword}>
                              <input type="hidden" name="id" value={u.id} />
                              <Button type="submit" variant="ghost" size="icon-sm" title="Réinitialiser le mot de passe (password123)">
                                <KeyRound className="size-4 text-muted-foreground" />
                              </Button>
                            </form>
                            <form action={toggleUserStatus}>
                              <input type="hidden" name="id" value={u.id} />
                              <Button type="submit" variant="ghost" size="icon-sm" title={u.status === "ACTIVE" ? "Suspendre" : "Réactiver"}>
                                <Power className={u.status === "ACTIVE" ? "size-4 text-available" : "size-4 text-muted-foreground"} />
                              </Button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Création + import */}
        <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserPlus className="size-4" /> Nouvel utilisateur</CardTitle></CardHeader>
          <CardContent>
            <form action={createUser} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div><Label htmlFor="firstName" required>Prénom</Label><Input id="firstName" name="firstName" required /></div>
                <div><Label htmlFor="lastName" required>Nom</Label><Input id="lastName" name="lastName" required /></div>
              </div>
              <div><Label htmlFor="email" required>E-mail</Label><Input id="email" name="email" type="email" placeholder="prenom.nom@ens.ci" required /></div>
              <div><Label htmlFor="functionTitle">Fonction</Label><Input id="functionTitle" name="functionTitle" placeholder="Ex. Enseignant" /></div>
              {isEns && <StudentMatriculeField />}
              <div>
                <Label htmlFor="roleKey" required>Rôle</Label>
                <Select id="roleKey" name="roleKey" defaultValue="REQUESTER" required>
                  {ROLES.filter((r) => r !== "SUPER_ADMIN").map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="departmentId">Service</Label>
                <Select id="departmentId" name="departmentId">
                  <option value="">—</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
              </div>
              <Button type="submit" className="w-full"><Mail className="size-4" /> Créer l'utilisateur</Button>
              <p className="text-xs text-muted-foreground">L'utilisateur pourra se connecter avec le mot de passe par défaut <code className="font-mono font-bold text-primary">password123</code>.</p>
            </form>
          </CardContent>
        </Card>

        <CsvImport />
        </div>
      </div>
    </div>
  );
}
