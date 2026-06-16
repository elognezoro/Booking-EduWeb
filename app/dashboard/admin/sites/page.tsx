import { MapPinned, Plus, Building, Boxes, Users, Trash2 } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmActionButton } from "@/components/confirm-action";
import { createSite, createDepartment, deleteSite } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function SitesAdminPage() {
  await requirePermission("sites.manage");
  const user = await getCurrentUser();
  const organizationId = user!.organizationId ?? "";

  const sites = await prisma.site.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
    include: { _count: { select: { resources: true } }, departments: { include: { _count: { select: { resources: true, users: true } } } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sites & services"
        description="Structurez votre organisation : Organisation › Site › Service › Ressources."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><MapPinned className="size-6" /></span>}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {sites.map((site) => (
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
                {site.departments.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-l-2 border-border pl-4">
                    {site.departments.map((d) => (
                      <div key={d.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{d.name}</span>
                        <span className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Users className="size-3" /> {d._count.users}</span>
                          <span className="inline-flex items-center gap-1"><Boxes className="size-3" /> {d._count.resources}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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
                <Button type="submit" className="w-full"><Plus className="size-4" /> Ajouter le service</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
