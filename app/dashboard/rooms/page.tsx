import Link from "next/link";
import { MonitorPlay, CalendarPlus, Users, CheckCircle2, AlertTriangle, DoorOpen } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSeatMap } from "@/lib/booking-rules";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SeatMap, SeatLegend } from "@/components/rooms/seat-map";
import { ResourceStatusBadge } from "@/components/status-badges";
import { AddRoomButton } from "@/components/rooms/add-room-button";
import { RoomManageBar } from "@/components/rooms/room-manage-bar";

export const dynamic = "force-dynamic";

export default async function RoomsPage({ searchParams }: { searchParams: { added?: string; saved?: string; removed?: string; capError?: string; min?: string } }) {
  await requirePermission("resources.read");
  const user = await getCurrentUser();
  const canBook = user!.permissions.has("bookings.create");
  const canManage = user!.permissions.has("resources.create");
  const canUpdate = user!.permissions.has("resources.update");
  const canDelete = user!.permissions.has("resources.delete");

  const rooms = await prisma.resource.findMany({
    where: { organizationId: user!.organizationId ?? "", category: { code: "SM" }, status: { not: "ARCHIVED" } },
    orderBy: { name: "asc" },
  });

  const now = new Date();
  const roomsWithSeats = await Promise.all(
    rooms.map(async (r) => {
      const capacity = r.capacity ?? r.quantityTotal ?? 0;
      const seats = await getSeatMap({ resourceId: r.id, capacity, start: now, end: now });
      const occupied = seats.filter((s) => s.occupied).length;
      return { room: r, capacity, seats, occupied, free: capacity - occupied };
    })
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Salles multimédias — plan des postes"
        description="Disponibilité des postes en temps réel. Cliquez sur « Réserver » pour choisir vos postes."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><MonitorPlay className="size-6" /></span>}
        actions={canManage && <AddRoomButton />}
      />

      {searchParams.added && <Banner tone="ok">Salle ajoutée avec succès.</Banner>}
      {searchParams.saved && <Banner tone="ok">Capacité mise à jour.</Banner>}
      {searchParams.removed && <Banner tone="ok">Salle retirée.</Banner>}
      {searchParams.capError && (
        <Banner tone="err">
          Impossible de réduire « {searchParams.capError} » en dessous de {searchParams.min} postes : des postes au-delà sont déjà réservés.
        </Banner>
      )}

      <Card>
        <CardContent className="py-4"><SeatLegend /></CardContent>
      </Card>

      {roomsWithSeats.length === 0 ? (
        <EmptyState icon={MonitorPlay} title="Aucune salle multimédia" description="Aucune salle multimédia n'est configurée pour votre organisation." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {roomsWithSeats.map(({ room, capacity, seats, occupied, free }) => (
            <Card key={room.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col items-center py-5">
                <div className="mb-3 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-foreground">{room.name}</h3>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Users className="size-3" /> {capacity} postes</p>
                    </div>
                    {room.status === "AVAILABLE" ? (
                      <Badge tone={free > 0 ? "available" : "unavailable"} dot>{free > 0 ? `${free} libre${free > 1 ? "s" : ""}` : "Complet"}</Badge>
                    ) : (
                      <ResourceStatusBadge status={room.status} />
                    )}
                  </div>
                </div>

                <SeatMap seats={seats} capacity={capacity} label={room.name} />

                <div className="mt-4 flex w-full items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="size-3.5 text-available" /> {free} libre(s)</span>
                  <span>{occupied} occupé(s)</span>
                </div>

                {canBook && (
                  <div className="mt-3 grid w-full gap-2">
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/bookings/new?resourceId=${room.id}`}><CalendarPlus className="size-4" /> Réserver des postes</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/dashboard/bookings/new?resourceId=${room.id}&mode=room`}><DoorOpen className="size-4" /> Réserver la salle</Link>
                    </Button>
                  </div>
                )}

                {(canUpdate || canDelete) && (
                  <div className="mt-3 w-full">
                    <RoomManageBar id={room.id} name={room.name} capacity={capacity} canUpdate={canUpdate} canDelete={canDelete} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
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
