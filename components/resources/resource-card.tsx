import Link from "next/link";
import { MapPin, Users, Boxes, CalendarPlus, Eye, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/category-icon";
import { ResourceStatusBadge } from "@/components/status-badges";
import { fmtDateTime } from "@/lib/dates";

export interface ResourceCardData {
  id: string;
  name: string;
  code: string;
  status: string;
  capacity: number | null;
  quantityTotal: number | null;
  quantityAvailable: number | null;
  location: string | null;
  category: { name: string; icon: string | null; color: string | null };
  site?: { name: string } | null;
  department?: { name: string } | null;
  nextFreeFrom?: Date | string | null;
  bookingsCount?: number;
}

export function ResourceCard({ resource, canBook = true }: { resource: ResourceCardData; canBook?: boolean }) {
  const bookable = ["AVAILABLE", "PARTIALLY_AVAILABLE", "RESERVED"].includes(resource.status);
  return (
    <Card className="flex flex-col overflow-hidden card-hover">
      <div className="flex items-start gap-3 p-5 pb-3">
        <CategoryIcon icon={resource.category.icon} color={resource.category.color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-bold text-foreground">{resource.name}</h3>
              <p className="font-mono text-xs text-muted-foreground">{resource.code}</p>
            </div>
          </div>
        </div>
        <ResourceStatusBadge status={resource.status} />
      </div>

      <div className="flex-1 space-y-2 px-5 pb-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{resource.category.name}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
          {resource.capacity != null && (
            <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" /> {resource.capacity} places</span>
          )}
          {resource.quantityAvailable != null && resource.quantityTotal != null && (
            <span className="inline-flex items-center gap-1.5"><Boxes className="size-3.5" /> {resource.quantityAvailable}/{resource.quantityTotal} dispo.</span>
          )}
          {resource.location && (
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> {resource.location}</span>
          )}
        </div>
        {bookable && (
          <p className="flex items-center gap-1.5 text-xs text-available-fg">
            <CheckCircle2 className="size-3.5" />
            {resource.nextFreeFrom
              ? `Prochaine disponibilité : ${fmtDateTime(resource.nextFreeFrom)}`
              : "Disponible maintenant"}
          </p>
        )}
      </div>

      <div className="flex gap-2 border-t border-border p-4">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/dashboard/resources/${resource.id}`}><Eye className="size-4" /> Détails</Link>
        </Button>
        {canBook && bookable && (
          <Button asChild size="sm" className="flex-1">
            <Link href={`/dashboard/bookings/new?resourceId=${resource.id}`}><CalendarPlus className="size-4" /> Réserver</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
