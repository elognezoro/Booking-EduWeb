import { KeyRound, ShieldCheck, Users, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getManagedScope, getGrantableRoleKeys, NON_DELEGABLE_ROLES } from "@/lib/habilitations";
import { grantHabilitation, revokeHabilitation } from "@/app/actions/habilitations";
import { ROLE_META, type RoleKey } from "@/lib/enums";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { RoleBadge } from "@/components/status-badges";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalide: "Demande incomplète : membre ou rôle manquant.",
  soi: "Vous ne pouvez pas modifier vos propres habilitations.",
  perimetre: "Ce membre n'appartient pas à votre périmètre.",
  protege: "Ce compte (administrateur) est géré par l'établissement, pas par les responsables d'entité.",
  role: "Ce rôle ne peut pas être délégué : il comporte des droits que vous ne détenez pas vous-même.",
  dernier: "Impossible : un membre doit conserver au moins un rôle.",
};

export default async function HabilitationsPage({ searchParams }: { searchParams: { granted?: string; revoked?: string; rien?: string; error?: string } }) {
  const user = await requireUser();
  const scope = await getManagedScope(user);
  const grantable = await getGrantableRoleKeys(user);

  const members = scope.allIds.size
    ? await prisma.user.findMany({
        where: { organizationId: user.organizationId!, departmentId: { in: [...scope.allIds] } },
        include: { roles: { include: { role: true } } },
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      })
    : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Habilitations — mon périmètre"
        description="En tant que responsable d'entité, attribuez ou retirez des rôles aux membres de votre périmètre."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><KeyRound className="size-6" /></span>}
      />

      {searchParams.granted && <Banner tone="ok">Habilitation attribuée. Le membre a été notifié.</Banner>}
      {searchParams.revoked && <Banner tone="ok">Habilitation retirée. Le membre a été notifié.</Banner>}
      {searchParams.rien && <Banner tone="ok">Aucun changement nécessaire : le membre était déjà dans l'état demandé.</Banner>}
      {searchParams.error && <Banner tone="err">{ERRORS[searchParams.error] ?? "Une erreur est survenue."}</Banner>}

      <div className="flex items-start gap-2 rounded-xl border border-advanced/20 bg-advanced-soft/40 px-4 py-3 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-advanced-fg" />
        <p>
          Votre périmètre couvre chaque entité dont vous êtes le <strong>responsable désigné</strong> (sous-direction, service,
          filière…) ainsi que toute sa descendance. <strong>Aucune élévation</strong> : vous ne pouvez déléguer que des rôles dont
          vous détenez déjà tous les droits — jamais les rôles Administrateur ou Super administrateur — et un membre conserve
          toujours au moins un rôle. Chaque attribution ou retrait est <strong>notifié au membre et journalisé</strong>.
        </p>
      </div>

      {scope.entities.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Aucune entité sous votre responsabilité"
          description="Cet espace s'active lorsque l'administrateur vous désigne responsable d'une entité (fenêtre « Membres » de la page Sites & services)."
        />
      ) : (
        scope.entities.map((entity) => {
          const subtree = new Set(entity.subtreeIds);
          // Entités imbriquées : chaque membre n'apparaît que dans l'entité dirigée LA PLUS SPÉCIFIQUE.
          const mostSpecific = (deptId: string) =>
            [...scope.entities]
              .filter((e) => e.subtreeIds.includes(deptId))
              .sort((a, b) => a.subtreeIds.length - b.subtreeIds.length)[0]?.id;
          const list = members.filter((m) => m.departmentId && subtree.has(m.departmentId) && mostSpecific(m.departmentId) === entity.id);
          return (
            <Card key={entity.id}>
              <CardContent className="py-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 font-bold text-foreground">
                    <Users className="size-4 text-primary" /> {entity.name}
                    {entity.code && <span className="text-xs font-semibold text-muted-foreground">({entity.code})</span>}
                  </h2>
                  <span className="text-xs text-muted-foreground">{list.length} membre{list.length > 1 ? "s" : ""}</span>
                </div>

                {list.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun membre rattaché : demandez à l'administration d'affecter des agents à cette entité.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {list.map((m) => {
                      const held = m.roles.map((r) => r.role.key as RoleKey);
                      const isSelf = m.id === user.id;
                      const isProtected = held.some((k) => NON_DELEGABLE_ROLES.includes(k));
                      const addable = grantable.filter((k) => !held.includes(k));
                      const canAct = !isSelf && !isProtected;
                      return (
                        <li key={m.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {m.firstName} {m.lastName}
                              {isSelf && <span className="ml-1.5 text-xs font-semibold text-primary">· vous</span>}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {[m.functionTitle, m.departmentId ? scope.nameById.get(m.departmentId) : null].filter(Boolean).join(" — ") || m.email}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {m.roles.map((r) => {
                              const key = r.role.key as RoleKey;
                              const removable = canAct && grantable.includes(key) && m.roles.length > 1;
                              return (
                                <div key={r.roleId} className="inline-flex items-center gap-0.5">
                                  <RoleBadge roleKey={key} />
                                  {removable && (
                                    <form action={revokeHabilitation}>
                                      <input type="hidden" name="userId" value={m.id} />
                                      <input type="hidden" name="roleKey" value={key} />
                                      <Button type="submit" variant="ghost" size="icon-sm" aria-label={`Retirer le rôle ${ROLE_META[key].label} à ${m.firstName} ${m.lastName}`} title="Retirer ce rôle">
                                        <X className="size-3.5" />
                                      </Button>
                                    </form>
                                  )}
                                </div>
                              );
                            })}
                            {m.roles.length === 0 && <span className="text-xs text-muted-foreground">Aucun rôle</span>}

                            {isProtected && (
                              <span className="text-xs font-semibold text-muted-foreground">Compte administrateur — géré par l'établissement</span>
                            )}
                            {canAct && addable.length > 0 && (
                              <form action={grantHabilitation} className="flex items-center gap-1.5">
                                <input type="hidden" name="userId" value={m.id} />
                                <Select name="roleKey" defaultValue="" required className="h-8 w-auto min-w-40 py-0 text-xs" aria-label={`Attribuer un rôle à ${m.firstName} ${m.lastName}`}>
                                  <option value="" disabled>+ Attribuer un rôle…</option>
                                  {addable.map((k) => (
                                    <option key={k} value={k}>{ROLE_META[k].label}</option>
                                  ))}
                                </Select>
                                <Button type="submit" size="sm" variant="outline">Attribuer</Button>
                              </form>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

function Banner({ tone, children }: { tone: "ok" | "err"; children: React.ReactNode }) {
  const ok = tone === "ok";
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${ok ? "border-available/30 bg-available-soft text-available-fg" : "border-unavailable/30 bg-unavailable-soft text-unavailable-fg"}`}>
      {ok ? <CheckCircle2 className="size-5" /> : <AlertTriangle className="size-5" />}
      {children}
    </div>
  );
}
