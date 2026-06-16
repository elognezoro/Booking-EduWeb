import { Globe2, Building2, Users, Boxes, CalendarDays } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { PLAN_LABELS, type Plan } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function PlatformPage() {
  await requirePermission("platform.manage");

  const [orgs, totalUsers, totalBookings, totalResources] = await Promise.all([
    prisma.organization.findMany({
      where: { isPlatform: false },
      orderBy: { createdAt: "asc" },
      include: { subscription: true, _count: { select: { users: true, resources: true, bookings: true } } },
    }),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.resource.count(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervision EduWeb"
        description="Vue globale de la plateforme et des organisations abonnées."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Globe2 className="size-6" /></span>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Organisations" value={orgs.length} icon={Building2} tone="advanced" />
        <KpiCard label="Utilisateurs" value={totalUsers} icon={Users} tone="info" />
        <KpiCard label="Ressources" value={totalResources} icon={Boxes} tone="available" />
        <KpiCard label="Réservations" value={totalBookings} icon={CalendarDays} tone="pending" />
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Organisations abonnées</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Organisation</th>
                <th className="px-4 py-2.5">Formule</th>
                <th className="px-4 py-2.5 text-center">Utilisateurs</th>
                <th className="px-4 py-2.5 text-center">Ressources</th>
                <th className="px-4 py-2.5 text-center">Réservations</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{o.name}</p>
                    <p className="text-xs text-muted-foreground">{o.acronym} · {o.city}</p>
                  </td>
                  <td className="px-4 py-3"><Badge tone="advanced">{PLAN_LABELS[(o.subscription?.plan ?? "PILOTE") as Plan]}</Badge></td>
                  <td className="px-4 py-3 text-center font-semibold">{o._count.users}</td>
                  <td className="px-4 py-3 text-center font-semibold">{o._count.resources}</td>
                  <td className="px-4 py-3 text-center font-semibold">{o._count.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
