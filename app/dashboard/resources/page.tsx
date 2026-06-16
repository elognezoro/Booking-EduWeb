import Link from "next/link";
import { Boxes, Plus, SearchX } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { ResourceCard } from "@/components/resources/resource-card";
import { EmptyState } from "@/components/ui/empty-state";
import { RESOURCE_STATUS, RESOURCE_STATUS_META, BLOCKING_BOOKING_STATUS } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function ResourcesPage({ searchParams }: { searchParams: { q?: string; category?: string; status?: string; site?: string } }) {
  await requirePermission("resources.read");
  const user = await getCurrentUser();
  const organizationId = user!.organizationId ?? "";
  const canManage = user!.permissions.has("resources.create");
  const canBook = user!.permissions.has("bookings.create");

  const [categories, sites] = await Promise.all([
    prisma.resourceCategory.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.site.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
  ]);

  const where: any = { organizationId, status: { not: "ARCHIVED" } };
  if (searchParams.category) where.categoryId = searchParams.category;
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.site) where.siteId = searchParams.site;
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q } },
      { code: { contains: searchParams.q } },
      { location: { contains: searchParams.q } },
    ];
  }

  const resources = await prisma.resource.findMany({
    where,
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    include: { category: true, site: true, department: true },
  });

  // Réservations en cours pour estimer la prochaine disponibilité.
  const now = new Date();
  const current = await prisma.booking.findMany({
    where: { organizationId, status: { in: BLOCKING_BOOKING_STATUS }, startAt: { lte: now }, endAt: { gte: now } },
    select: { resourceId: true, endAt: true },
  });
  const busyUntil = new Map<string, Date>();
  for (const b of current) {
    const cur = busyUntil.get(b.resourceId);
    if (!cur || b.endAt > cur) busyUntil.set(b.resourceId, b.endAt);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Ressources"
        description="Parcourez et réservez les ressources de votre organisation."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Boxes className="size-6" /></span>}
        actions={
          canManage && (
            <Button asChild><Link href="/dashboard/resources/new"><Plus className="size-4" /> Nouvelle ressource</Link></Button>
          )
        }
      />

      <SearchFilterBar
        searchPlaceholder="Rechercher par nom, code ou lieu…"
        filters={[
          { name: "category", label: "Toutes les catégories", options: categories.map((c) => ({ value: c.id, label: c.name })) },
          { name: "status", label: "Tous les statuts", options: RESOURCE_STATUS.filter((s) => s !== "ARCHIVED").map((s) => ({ value: s, label: RESOURCE_STATUS_META[s].label })) },
          ...(sites.length > 1 ? [{ name: "site", label: "Tous les sites", options: sites.map((s) => ({ value: s.id, label: s.name })) }] : []),
        ]}
      />

      <p className="text-sm text-muted-foreground">{resources.length} ressource(s)</p>

      {resources.length === 0 ? (
        <EmptyState icon={SearchX} title="Aucune ressource trouvée" description="Aucune ressource ne correspond aux filtres sélectionnés." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              canBook={canBook}
              resource={{ ...r, nextFreeFrom: busyUntil.get(r.id) ?? null }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
