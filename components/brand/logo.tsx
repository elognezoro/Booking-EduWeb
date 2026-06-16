import { cn } from "@/lib/utils";

/** Marque calendrier EduWeb (SVG inline, s'adapte au fond clair ou foncé). */
export function BrandMark({ className, frame = "#064B3A" }: { className?: string; frame?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* anneaux */}
      <rect x="18" y="3" width="4" height="11" rx="2" fill={frame} />
      <rect x="42" y="3" width="4" height="11" rx="2" fill={frame} />
      {/* corps du calendrier */}
      <rect x="6" y="9" width="52" height="49" rx="11" stroke={frame} strokeWidth="4" />
      <rect x="6" y="9" width="52" height="13" rx="11" fill={frame} />
      {/* cellules */}
      <rect x="14" y="27" width="9" height="9" rx="2.4" fill="#22C55E" />
      <rect x="27.5" y="27" width="9" height="9" rx="2.4" fill="#CBD5E1" />
      <rect x="41" y="27" width="9" height="9" rx="2.4" fill="#F97316" />
      <rect x="14" y="38.5" width="9" height="9" rx="2.4" fill="#CBD5E1" />
      <rect x="27.5" y="38.5" width="9" height="9" rx="2.4" fill={frame} />
      <rect x="41" y="38.5" width="9" height="9" rx="2.4" fill="#CBD5E1" />
      <rect x="14" y="50" width="9" height="9" rx="2.4" fill="#DC2626" />
      <rect x="27.5" y="50" width="9" height="9" rx="2.4" fill="#CBD5E1" />
      <rect x="41" y="50" width="9" height="9" rx="2.4" fill="#6D5DF5" />
      {/* coche verte */}
      <path d="M16.5 31.5l1.8 1.8 3-3.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface BrandLogoProps {
  variant?: "full" | "mark";
  theme?: "light" | "dark";
  className?: string;
  textClassName?: string;
}

/** Logo complet : marque + libellé "EduWeb Booking". */
export function BrandLogo({ variant = "full", theme = "light", className, textClassName }: BrandLogoProps) {
  const frame = theme === "dark" ? "#FFFFFF" : "#064B3A";
  const primaryText = theme === "dark" ? "text-white" : "text-primary";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark className="size-9 shrink-0" frame={frame} />
      {variant === "full" && (
        <span className={cn("font-display text-xl font-extrabold leading-none tracking-tight", primaryText, textClassName)}>
          EduWeb<span className="text-available">Booking</span>
        </span>
      )}
    </span>
  );
}
