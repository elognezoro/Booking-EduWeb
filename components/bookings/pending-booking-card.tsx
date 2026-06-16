import Link from "next/link";
import { Clock, User as UserIcon, Users, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryIcon } from "@/components/category-icon";
import { Badge } from "@/components/ui/badge";
import { ValidationActions } from "./validation-panel";
import { fmtRange, fromNow } from "@/lib/dates";
import { USAGE_TYPE_LABELS, type UsageType } from "@/lib/enums";

export function PendingBookingCard({ booking }: { booking: any }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 py-5">
        <div className="flex items-start gap-3">
          <CategoryIcon icon={booking.resource.category.icon} color={booking.resource.category.color} />
          <div className="min-w-0 flex-1">
            <Link href={`/dashboard/bookings/${booking.id}`} className="block">
              <p className="truncate font-bold text-foreground hover:text-primary">{booking.title || booking.purpose}</p>
            </Link>
            <p className="truncate text-sm text-muted-foreground">{booking.resource.name}</p>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">{booking.code}</span>
        </div>

        <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {fmtRange(booking.startAt, booking.endAt)}</span>
          <span className="inline-flex items-center gap-1.5"><UserIcon className="size-3.5" /> {booking.requester.firstName} {booking.requester.lastName}</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{USAGE_TYPE_LABELS[booking.usageType as UsageType] ?? booking.usageType}</Badge>
            {booking.participantCount && <span className="inline-flex items-center gap-1 text-xs"><Users className="size-3" /> {booking.participantCount} pers.</span>}
            <span className="text-xs">· demandé {fromNow(booking.createdAt)}</span>
          </div>
        </div>

        {booking.purpose && booking.title && (
          <p className="mt-2 line-clamp-2 rounded-lg bg-secondary/60 p-2 text-xs text-muted-foreground"><FileText className="mr-1 inline size-3" /> {booking.purpose}</p>
        )}
      </CardContent>
      <div className="border-t border-border p-4">
        <ValidationActions bookingId={booking.id} />
      </div>
    </Card>
  );
}
