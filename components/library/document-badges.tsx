import { Badge } from "@/components/ui/badge";
import { documentStatusMeta, accessLevelMeta, DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/library/enums";
import { cn } from "@/lib/utils";

export function DocumentStatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = documentStatusMeta(status);
  return <Badge tone={meta.tone} dot className={className}>{meta.label}</Badge>;
}

export function AccessLevelBadge({ level, className }: { level: string; className?: string }) {
  const meta = accessLevelMeta(level);
  return <Badge tone={meta.tone} className={className}>{meta.label}</Badge>;
}

export function DocumentTypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <Badge tone="info" className={className}>
      {DOCUMENT_TYPE_LABELS[type as DocumentType] ?? type}
    </Badge>
  );
}

export function DocumentCodeBadge({ code, temporary, className }: { code: string; temporary?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-1 font-mono text-xs font-bold",
        temporary ? "bg-pending-soft text-pending-fg" : "bg-primary-50 text-primary-700",
        className
      )}
    >
      {code}
    </span>
  );
}
