import {
  GraduationCap, FileText, ClipboardList, BookOpen, Presentation, FileCheck2,
  Newspaper, BookMarked, FileSignature, Archive, Microscope, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentType } from "@/lib/library/enums";

const MAP: Record<DocumentType, { icon: LucideIcon; color: string }> = {
  MEM: { icon: GraduationCap, color: "#064B3A" },
  THS: { icon: GraduationCap, color: "#172554" },
  ART: { icon: Microscope, color: "#6D5DF5" },
  RAP: { icon: ClipboardList, color: "#0891B2" },
  RST: { icon: ClipboardList, color: "#0891B2" },
  LIV: { icon: BookOpen, color: "#F97316" },
  CHO: { icon: BookMarked, color: "#F97316" },
  COM: { icon: Presentation, color: "#6D5DF5" },
  ACT: { icon: Presentation, color: "#6D5DF5" },
  ANN: { icon: FileCheck2, color: "#22C55E" },
  REV: { icon: Newspaper, color: "#0891B2" },
  SUP: { icon: BookMarked, color: "#0B5A45" },
  GUI: { icon: BookMarked, color: "#0B5A45" },
  MAN: { icon: BookOpen, color: "#0B5A45" },
  ADM: { icon: FileSignature, color: "#475569" },
  ARC: { icon: Archive, color: "#475569" },
};

export function DocumentTypeIcon({ type, size = "md", className }: { type: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const entry = MAP[type as DocumentType] ?? { icon: FileText, color: "#064B3A" };
  const Icon = entry.icon;
  const dims = size === "sm" ? "size-8" : size === "lg" ? "size-14" : "size-11";
  const iconSize = size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-5";
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-2xl", dims, className)} style={{ backgroundColor: `${entry.color}14`, color: entry.color }}>
      <Icon className={iconSize} />
    </span>
  );
}
