import { MapPinned, Plus, Building, Boxes, Trash2 } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmActionButton } from "@/components/confirm-action";
import { ServiceTree, type ServiceNode } from "@/components/dashboard/service-tree";
import { createSite, createDepartment, deleteSite } from "@/app/actions/admin";

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

  // Tous les services (parents possibles, profondeur libre) pour les sélecteurs de rattachement.
  const parentOptions = sites.flatMap((s) => s.departments).map((d) => ({ id: d.id, name: d.name }));
  const siteOptions = sites.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sites & services"
        description="Structurez votre organisation : Organisation › Site › Service › Ressources. Glissez-déposez un service pour le déplacer. Chaque service a un responsable et des agents."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><MapPinned className="size-6" /></span>}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {sites.map((site) => {
            const depts = site.departments;
            // Arborescence de profondeur libre : parcours en profondeur (niveau → sous-services → …).
            const byParent = new Map<string | null, typeof depts>();
            for (const d of depts) {
              const a = byParent.get(d.parentId) ?? [];
              a.push(d);
              byParent.set(d.parentId, a);
            }
            const makeNode = (d: (typeof depts)[number], depth: number): ServiceNode => {
              const head = d.users.find((u) => u.id === d.headId);
              return {
                id: d.id,
                name: d.name,
                code: d.code,
                siteId: d.siteId,
                parentId: d.parentId,
                headId: d.headId,
                depth,
                headName: head ? fullName(head) : null,
                counts: { users: d._count.users, resources: d._count.resources, children: d._count.children },
                members: d.users.map((u) => ({ id: u.id, name: fullName(u) })),
                candidates: orgUsers
                  .filter((u) => u.departmentId !== d.id)
                  .map((u) => ({ id: u.id, name: fullName(u), dept: u.organizationId === null ? "sans institution" : (u.department?.name ?? null) })),
              };
            };
            const nodes: ServiceNode[] = [];
            const visited = new Set<string>();
            const visit = (parentId: string | null, depth: number) => {
              for (const d of byParent.get(parentId) ?? []) {
                if (visited.has(d.id)) continue;
                visited.add(d.id);
                nodes.push(makeNode(d, depth));
                visit(d.id, depth + 1);
              }
            };
            visit(null, 0);
            for (const d of depts) if (!visited.has(d.id)) { visited.add(d.id); nodes.push(makeNode(d, 0)); }

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

                  {nodes.length > 0 && <ServiceTree nodes={nodes} parents={parentOptions} sites={siteOptions} />}
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
                  <Label htmlFor="dparent">Rattaché à (optionnel)</Label>
                  <Select id="dparent" name="parentId">
                    <option value="">— (aucun parent)</option>
                    {parentOptions.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
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
