import { MapPinned, Plus, Building, Boxes, Users, Trash2, CornerDownRight, Star } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmActionButton } from "@/components/confirm-action";
import { EditDepartmentButton } from "@/components/dashboard/edit-department-button";
import { ManageMembersButton } from "@/components/dashboard/manage-members-button";
import { createSite, createDepartment, deleteSite, deleteDepartment } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const fullName = (u: { firstName: string; lastName: string }) => `${u.firstName} ${u.lastName}`.trim();

export default async function SitesAdminPage() {
  await requirePermission("sites.manage");
  const user = await getCurrentUser();
  const organizationId = user!.organizationId ?? "";

  const [sites, orgUsers] = await Promise.all([
    prisma.site.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { resources: true } },
        departments: {
          orderBy: { name: "asc" },
          include: {
            _count: { select: { resources: true, users: true, children: true } },
            users: { select: { id: true, firstName: true, lastName: true }, orderBy: [{ firstName: "asc" }, { lastName: "asc" }] },
          },
        },
      },
    }),
    prisma.user.findMany({
      // Membres de l'institution + inscrits sans institution (affectables à un service).
      where: { OR: [{ organizationId }, { organizationId: null }] },
      select: { id: true, firstName: true, lastName: true, departmentId: true, organizationId: true, department: { select: { name: true } } },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    }),
  ]);

  // Niveaux (départements sans parent) de toute l'organisation, pour les sélecteurs de rattachement.
  const niveaux = sites.flatMap((s) => s.departments).filter((d) => !d.parentId).map((d) => ({ id: d.id, name: d.name }));
  const siteOptions = sites.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sites & services"
        description="Structurez votre organisation : Organisation › Site › Service › Ressources. Chaque service a un responsable et des agents."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><MapPinned className="size-6" /></span>}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {sites.map((site) => {
            const depts = site.departments;
            // Ordonner : chaque niveau suivi de ses sous-services ; les orphelins en fin.
            const ordered: { d: (typeof depts)[number]; child: boolean }[] = [];
            for (const n of depts.filter((d) => !d.parentId)) {
              ordered.push({ d: n, child: false });
              for (const c of depts.filter((d) => d.parentId === n.id)) ordered.push({ d: c, child: true });
            }
            const shown = new Set(ordered.map((o) => o.d.id));
            for (const d of depts) if (!shown.has(d.id)) ordered.push({ d, child: true });

            return (
              <Card key={site.id}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Building className="size-5" /></span>
                      <div>
                        <h3 className="font-bold text-foreground">{site.name}</h3>
                        <p className="text-xs text-muted-foreground">{site.code} {site.city && `· ${site.city}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="info"><Boxes className="size-3.5" /> {site._count.resources}</Badge>
                      {site._count.resources === 0 && (
                        <ConfirmActionButton action={deleteSite} hidden={{ id: site.id }} triggerLabel="" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="icon-sm" title={`Supprimer « ${site.name} » ?`} confirmLabel="Supprimer" confirmVariant="destructive" />
                      )}
                    </div>
                  </div>

                  {ordered.length > 0 && (
                    <div className="mt-3 space-y-0.5 border-l-2 border-border pl-3">
                      {ordered.map(({ d, child }) => {
                        const empty = d._count.users === 0 && d._count.resources === 0 && d._count.children === 0;
                        const members = d.users.map((u) => ({ id: u.id, name: fullName(u) }));
                        const head = d.users.find((u) => u.id === d.headId);
                        const candidates = orgUsers.filter((u) => u.departmentId !== d.id).map((u) => ({ id: u.id, name: fullName(u), dept: u.organizationId === null ? "sans institution" : (u.department?.name ?? null) }));
                        return (
                          <div key={d.id} className={cn("group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60", child && "ml-5")}>
                            <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
                              {child && <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />}
                              <span className="truncate">{d.name}</span>
                              {d.code && <span className="shrink-0 text-xs text-muted-foreground">· {d.code}</span>}
                              {head && <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-advanced-fg"><Star className="size-3" /> {fullName(head)}</span>}
                              {d._count.children > 0 && <span className="shrink-0 text-xs text-muted-foreground">· {d._count.children} sous-service{d._count.children > 1 ? "s" : ""}</span>}
                            </span>
                            <span className="flex shrink-0 items-center gap-2">
                              <span className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1"><Users className="size-3" /> {d._count.users}</span>
                                <span className="inline-flex items-center gap-1"><Boxes className="size-3" /> {d._count.resources}</span>
                              </span>
                              <ManageMembersButton dept={{ id: d.id, name: d.name, headId: d.headId }} members={members} candidates={candidates} />
                              <EditDepartmentButton dept={{ id: d.id, name: d.name, code: d.code, siteId: d.siteId, parentId: d.parentId }} sites={siteOptions} niveaux={niveaux} />
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
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Nouveau site</CardTitle></CardHeader>
            <CardContent>
              <form action={createSite} className="space-y-3">
                <div><Label htmlFor="sname" required>Nom</Label><Input id="sname" name="name" placeholder="Ex. Campus principal" required /></div>
                <div><Label htmlFor="scode">Code</Label><Input id="scode" name="code" placeholder="Ex. ENS-MAIN" /></div>
                <div><Label htmlFor="scity">Ville</Label><Input id="scity" name="city" placeholder="Ex. Abidjan" /></div>
                <Button type="submit" className="w-full"><Plus className="size-4" /> Ajouter le site</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Nouveau service</CardTitle></CardHeader>
            <CardContent>
              <form action={createDepartment} className="space-y-3">
                <div><Label htmlFor="dname" required>Nom</Label><Input id="dname" name="name" placeholder="Ex. Sous-Direction APRID" required /></div>
                <div><Label htmlFor="dcode">Code</Label><Input id="dcode" name="code" placeholder="Ex. APRID" /></div>
                <div>
                  <Label htmlFor="dsite">Site de rattachement</Label>
                  <Select id="dsite" name="siteId">
                    <option value="">—</option>
                    {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dparent">Rattaché au niveau (optionnel)</Label>
                  <Select id="dparent" name="parentId">
                    <option value="">— (créer un niveau)</option>
                    {niveaux.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </Select>
                </div>
                <Button type="submit" className="w-full"><Plus className="size-4" /> Ajouter le service</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
