import {
  MonitorPlay,
  Users,
  BookOpen,
  Projector,
  Car,
  Wrench,
  PartyPopper,
  Box,
  Building2,
  Laptop,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  MonitorPlay,
  Users,
  BookOpen,
  Projector,
  Car,
  Wrench,
  PartyPopper,
  Box,
  Building2,
  Laptop,
  Calendar,
};

export function getCategoryIcon(name?: string | null): LucideIcon {
  return (name && ICONS[name]) || Box;
}

export function CategoryIcon({
  icon,
  color = "#064B3A",
  className,
  size = "md",
}: {
  icon?: string | null;
  color?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = getCategoryIcon(icon);
  const dims = size === "sm" ? "size-8" : size === "lg" ? "size-14" : "size-11";
  const iconSize = size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-5";
  const c = color || "#064B3A";
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-2xl", dims, className)}
      style={{ backgroundColor: `${c}14`, color: c }}
    >
      <Icon className={iconSize} />
    </span>
  );
}
