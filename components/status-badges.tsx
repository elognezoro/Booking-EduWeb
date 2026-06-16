import { Badge } from "@/components/ui/badge";
import { bookingStatusMeta, resourceStatusMeta, roleMeta } from "@/lib/enums";
import { cn } from "@/lib/utils";

export function BookingStatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = bookingStatusMeta(status);
  return (
    <Badge tone={meta.tone} dot className={className}>
      {meta.label}
    </Badge>
  );
}

export function ResourceStatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = resourceStatusMeta(status);
  return (
    <Badge tone={meta.tone} dot className={className}>
      {meta.label}
    </Badge>
  );
}

export function AvailabilityBadge({ available, label }: { available: boolean; label?: string }) {
  return (
    <Badge tone={available ? "available" : "unavailable"} dot>
      {label ?? (available ? "Disponible" : "Indisponible")}
    </Badge>
  );
}

export function RoleBadge({ roleKey, className }: { roleKey: string; className?: string }) {
  const meta = roleMeta(roleKey);
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}
      style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}
