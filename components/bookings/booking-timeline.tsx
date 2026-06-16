import { bookingStatusMeta } from "@/lib/enums";
import { TONE_DOT } from "@/lib/tone";
import { fmtDateTime } from "@/lib/dates";

export function BookingTimeline({ history }: { history: { id: string; status: string; comment: string | null; createdAt: Date | string }[] }) {
  if (history.length === 0) return null;
  return (
    <ol className="relative space-y-4 pl-6">
      <span className="absolute left-[7px] top-1.5 h-[calc(100%-12px)] w-px bg-border" />
      {history.map((h) => {
        const meta = bookingStatusMeta(h.status);
        return (
          <li key={h.id} className="relative">
            <span className={`absolute -left-[22px] top-1 size-3.5 rounded-full ring-4 ring-background ${TONE_DOT[meta.tone]}`} />
            <p className="text-sm font-bold text-foreground">{meta.label}</p>
            {h.comment && <p className="text-sm text-muted-foreground">{h.comment}</p>}
            <p className="text-xs text-muted-foreground/70">{fmtDateTime(h.createdAt)}</p>
          </li>
        );
      })}
    </ol>
  );
}
