import Link from "next/link";
import { Eye, Download, User, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DocumentTypeIcon } from "./document-type-icon";
import { DocumentStatusBadge, AccessLevelBadge } from "./document-badges";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/library/enums";

export interface DocumentCardData {
  id: string;
  title: string;
  documentType: string;
  status: string;
  accessLevel: string;
  codeShort: string | null;
  codeLong: string | null;
  temporaryCode: string | null;
  mainAuthorName: string;
  year: number | null;
  consultationCount: number;
  downloadCount: number;
  domain: { name: string };
}

export function DocumentCard({ doc }: { doc: DocumentCardData }) {
  const code = doc.codeShort ?? doc.temporaryCode ?? "—";
  return (
    <Link href={`/dashboard/library/documents/${doc.id}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden card-hover">
        <div className="flex items-start gap-3 p-5 pb-3">
          <DocumentTypeIcon type={doc.documentType} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {DOCUMENT_TYPE_LABELS[doc.documentType as DocumentType] ?? doc.documentType} · {doc.domain.name}
            </p>
            <h3 className="mt-0.5 line-clamp-2 font-bold leading-snug text-foreground group-hover:text-primary">{doc.title}</h3>
          </div>
        </div>
        <div className="flex-1 space-y-2 px-5 pb-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5"><User className="size-3.5" /> {doc.mainAuthorName}</p>
          {doc.year && <p className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> {doc.year}</p>}
          <p className="font-mono text-xs text-primary-700">{code}</p>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <DocumentStatusBadge status={doc.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Eye className="size-3.5" /> {doc.consultationCount}</span>
            <span className="inline-flex items-center gap-1"><Download className="size-3.5" /> {doc.downloadCount}</span>
          </div>
        </div>
        <div className="px-5 pb-4"><AccessLevelBadge level={doc.accessLevel} /></div>
      </Card>
    </Link>
  );
}
