import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Tone } from "@/lib/enums";
import { TONE_CLASSES } from "@/lib/tone";

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "info",
  hint,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
  trend?: { value: string; up: boolean };
  className?: string;
}) {
  return (
    <Card className={cn("relative overflow-hidden p-5 card-hover", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-2xl", TONE_CLASSES[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
          <span className={cn("inline-flex items-center gap-0.5", trend.up ? "text-available-fg" : "text-unavailable-fg")}>
            {trend.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {trend.value}
          </span>
          <span className="text-muted-foreground">vs période précédente</span>
        </div>
      )}
    </Card>
  );
}
