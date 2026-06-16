import { UserCheck, CheckCircle2, Check, Mail, Clock, Briefcase } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/misc";
import { RoleBadge } from "@/components/status-badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmActionButton } from "@/components/confirm-action";
import { approveAccount, rejectAccount } from "@/app/actions/admin";
import { fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function AccountRequestsPage({ searchParams }: { searchParams: { approved?: string; rejected?: string } }) {
  await requirePermission("users.manage");
  const me = await getCurrentUser();

  const requests = await prisma.user.findMany({
    where: { organizationId: me!.organizationId ?? "", status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { roles: { include: { role: true } }, department: true },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Demandes de comptes"
        description="Validez ou refusez les demandes d'inscription à votre institution."
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

      {requests.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Aucune demande en attente 🎉" description="Toutes les demandes de comptes ont été traitées." />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{requests.length} demande(s) en attente</p>
          <div className="grid gap-4 lg:grid-cols-2">
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
                    <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> demandé {fromNow(u.createdAt)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {u.roles.map((r) => <RoleBadge key={r.roleId} roleKey={r.role.key} />)}
                  </div>
                </CardContent>
                <div className="flex gap-2 border-t border-border p-4">
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
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
