import Link from "next/link";
import { Clock, User as UserIcon, ChevronRight } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { BookingStatusBadge } from "@/components/status-badges";
import { fmtRange } from "@/lib/dates";
import { USAGE_TYPE_LABELS, type UsageType } from "@/lib/enums";
import { cn } from "@/lib/utils";

export interface BookingListItemData {
  id: string;
  code: string;
  title: string | null;
  purpose: string;
  usageType: string;
  status: string;
  startAt: Date | string;
  endAt: Date | string;
  resource: { name: string; category: { icon: string | null; color: string | null } };
  requester?: { firstName: string; lastName: string } | null;
}

export function BookingListItem({ booking, showRequester = false }: { booking: BookingListItemData; showRequester?: boolean }) {
  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-soft"
      )}
    >
      <CategoryIcon icon={booking.resource.category.icon} color={booking.resource.category.color} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-foreground">{booking.title || booking.purpose}</p>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {booking.resource.name} · {USAGE_TYPE_LABELS[booking.usageType as UsageType] ?? booking.usageType}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {fmtRange(booking.startAt, booking.endAt)}</span>
          {showRequester && booking.requester && (
            <span className="inline-flex items-center gap-1"><UserIcon className="size-3" /> {booking.requester.firstName} {booking.requester.lastName}</span>
          )}
        </div>
      </div>
      <BookingStatusBadge status={booking.status} />
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
