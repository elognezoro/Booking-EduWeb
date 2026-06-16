import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json";
import { PageHeader } from "@/components/dashboard/page-header";
import { BookingForm } from "@/components/bookings/booking-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { ResourceRules } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function NewBookingPage({ searchParams }: { searchParams: { resourceId?: string; mode?: string } }) {
  await requirePermission("bookings.create");
  const user = await getCurrentUser();
  const organizationId = user!.organizationId ?? "";

  const [categories, resourcesRaw] = await Promise.all([
    prisma.resourceCategory.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.resource.findMany({
      where: { organizationId, status: { in: ["AVAILABLE", "PARTIALLY_AVAILABLE", "RESERVED"] } },
      orderBy: { name: "asc" },
    }),
  ]);

  const resources = resourcesRaw.map((r) => {
    const rules = parseJson<Partial<ResourceRules>>(r.rules, {});
    return {
      id: r.id, name: r.name, code: r.code, categoryId: r.categoryId,
      capacity: r.capacity, quantityTotal: r.quantityTotal, status: r.status, location: r.location,
      bookingMode: rules.bookingMode ?? "exclusive",
      seatBased: !!rules.seatBased,
    };
  });

  // On ne garde que les catégories qui ont des ressources réservables.
  const usableCategories = categories
    .filter((c) => resources.some((r) => r.categoryId === c.id))
    .map((c) => ({ id: c.id, name: c.name, icon: c.icon, color: c.color }));

  return (
    <div className="space-y-5">
      <Link href="/dashboard/bookings/my" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Mes réservations
      </Link>
      <PageHeader
        title="Nouvelle réservation"
        description="Réservez une ressource en quelques étapes."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><CalendarPlus className="size-6" /></span>}
      />
      {resources.length === 0 ? (
        <EmptyState title="Aucune ressource réservable" description="Aucune ressource n'est actuellement disponible à la réservation." action={<Button asChild><Link href="/dashboard/resources">Voir les ressources</Link></Button>} />
      ) : (
        <BookingForm categories={usableCategories} resources={resources} defaultResourceId={searchParams.resourceId} defaultMode={searchParams.mode} />
      )}
    </div>
  );
}
