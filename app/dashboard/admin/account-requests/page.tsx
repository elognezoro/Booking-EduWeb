import { UserCheck, CheckCircle2, Check, Mail, Clock, Briefcase, AlertTriangle, Building2 } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";
import { RoleBadge } from "@/components/status-badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmActionButton } from "@/components/confirm-action";
import { approveAccount, rejectAccount, assignAndApproveAccount } from "@/app/actions/admin";
import { fromNow } from "@/lib/dates";
import { ROLES, ROLE_META, type RoleKey } from "@/lib/enums";

export const dynamic = "force-dynamic";

// Rôles attribuables (jamais SUPER_ADMIN — réservé à l'Admin système).
const ASSIGNABLE = (ROLES as readonly RoleKey[]).filter((r) => r !== "SUPER_ADMIN");

const ERRORS: Record<string, string> = {
  role: "Le rôle Super Administrateur ne peut pas être attribué.",
  org: "Sélectionnez un établissement valide.",
  notfound: "Demande introuvable ou déjà traitée.",
};

export default async function AccountRequestsPage({ searchParams }: { searchParams: { approved?: string; rejected?: string; error?: string } }) {
  await requirePermission("users.manage");
  const me = await getCurrentUser();
  const isSuper = me!.roles.includes("SUPER_ADMIN");

  const [requests, establishments] = await Promise.all([
    prisma.user.findMany({
      // Super admin : TOUS les comptes en attente (quelle que soit l'institution, ou sans institution).
      where: isSuper ? { status: "PENDING" } : { organizationId: me!.organizationId ?? "", status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { roles: { include: { role: true } }, organization: { select: { name: true } } },
    }),
    isSuper
      ? prisma.organization.findMany({ where: { isPlatform: false, status: "ACTIVE" }, orderBy: { name: "asc" }, select: { id: true, name: true } })
      : Promise.resolve([] as { id: string; name: string }[]),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Demandes de comptes"
        description={isSuper ? "Affectez chaque nouveau compte à un établissement et un rôle, ou refusez la demande." : "Validez ou refusez les demandes d'inscription à votre institution."}
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-pending-soft text-pending-fg"><UserCheck className="size-6" /></span>}
      />

      {searchParams.approved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Compte validé — l'utilisateur peut désormais se connecter.
        </div>
      )}
      {searchParams.rejected && (
        <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-muted-foreground">
          Demande refusée et supprimée.
        </div>
      )}
      {searchParams.error && ERRORS[searchParams.error] && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" /> {ERRORS[searchParams.error]}
        </div>
      )}

      {requests.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Aucune demande en attente 🎉" description="Toutes les demandes de comptes ont été traitées." />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{requests.length} demande(s) en attente</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {requests.map((u) => (
              <Card key={u.id} className="flex flex-col">
                <CardContent className="flex-1 py-5">
                  <div className="flex items-start gap-3">
                    <Avatar firstName={u.firstName} lastName={u.lastName} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-foreground">{u.firstName} {u.lastName}</p>
                      <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="size-3.5" /> {u.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {u.functionTitle && <span className="inline-flex items-center gap-1.5"><Briefcase className="size-3.5" /> {u.functionTitle}</span>}
                    {isSuper && u.organization && <span className="inline-flex items-center gap-1.5 font-medium text-foreground"><Building2 className="size-3.5" /> {u.organization.name}</span>}
                    <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> demandé {fromNow(u.createdAt)}</span>
                  </div>
                  {u.roles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {u.roles.map((r) => <RoleBadge key={r.roleId} roleKey={r.role.key} />)}
                    </div>
                  )}
                </CardContent>

                <div className="border-t border-border p-4">
                  {isSuper ? (
                    <div className="space-y-2.5">
                      <form action={assignAndApproveAccount} className="space-y-2.5">
                        <input type="hidden" name="id" value={u.id} />
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Building2 className="size-3.5" /> Établissement</label>
                            <Select name="organizationId" required defaultValue={u.organizationId ?? ""}>
                              <option value="" disabled>Choisir…</option>
                              {establishments.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </Select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Rôle</label>
                            <Select name="roleKey" defaultValue="REQUESTER">
                              {ASSIGNABLE.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
                            </Select>
                          </div>
                        </div>
                        <Button type="submit" variant="success" className="w-full"><Check className="size-4" /> Valider et affecter</Button>
                      </form>
                      <ConfirmActionButton
                        action={rejectAccount}
                        hidden={{ id: u.id }}
                        triggerLabel="Refuser"
                        triggerVariant="outline"
                        fullWidthTrigger
                        title={`Refuser la demande de ${u.firstName} ${u.lastName} ?`}
                        description="Le compte en attente sera supprimé et la personne en sera informée par e-mail."
                        confirmLabel="Refuser la demande"
                        confirmVariant="destructive"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <form action={approveAccount} className="flex-1">
                        <input type="hidden" name="id" value={u.id} />
                        <Button type="submit" variant="success" className="w-full"><Check className="size-4" /> Valider</Button>
                      </form>
                      <ConfirmActionButton
                        action={rejectAccount}
                        hidden={{ id: u.id }}
                        triggerLabel="Refuser"
                        triggerVariant="outline"
                        title={`Refuser la demande de ${u.firstName} ${u.lastName} ?`}
                        description="Le compte en attente sera supprimé et la personne en sera informée par e-mail."
                        confirmLabel="Refuser la demande"
                        confirmVariant="destructive"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
