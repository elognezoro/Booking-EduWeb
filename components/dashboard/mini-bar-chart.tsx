import { cn } from "@/lib/utils";

/** Histogramme léger en CSS (sans dépendance), pour les aperçus de tableau de bord. */
export function MiniBarChart({
  data,
  className,
  barClassName = "bg-primary",
}: {
  data: { label: string; value: number }[];
  className?: string;
  barClassName?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={cn("flex items-end gap-1.5", className)}>
      {data.map((d, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
          <div className="relative flex h-28 w-full items-end justify-center">
            <div
              className={cn("w-full rounded-t-md transition-all group-hover:opacity-80", barClassName)}
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 0 }}
              title={`${d.label} : ${d.value}`}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
