import Link from "next/link";
import { ClipboardCheck, CheckCircle2, User, CalendarDays, AlertTriangle } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentTypeIcon } from "@/components/library/document-type-icon";
import { DocumentStatusBadge, DocumentCodeBadge, AccessLevelBadge } from "@/components/library/document-badges";
import { ReviewActions } from "@/components/library/review-panel";
import { REVIEW_PENDING_STATUS, DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/library/enums";
import { fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const user = await requirePermission("documents.review");
  await getCurrentUser();
  const docs = await prisma.documentResource.findMany({
    where: { organizationId: user.organizationId ?? "", status: { in: REVIEW_PENDING_STATUS } },
    orderBy: { createdAt: "asc" },
    include: { domain: true, collection: true, duplicateWarnings: { where: { resolved: false } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Validation documentaire"
        description="Vérifiez, complétez puis validez ou rejetez les dépôts."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-pending-soft text-pending-fg"><ClipboardCheck className="size-6" /></span>}
      />

      {docs.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Tout est à jour 🎉" description="Aucun dépôt en attente de validation." />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{docs.length} dépôt(s) à vérifier</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {docs.map((d) => (
              <Card key={d.id} className="flex flex-col">
                <CardContent className="flex-1 py-5">
                  <div className="flex items-start gap-3">
                    <DocumentTypeIcon type={d.documentType} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/dashboard/library/documents/${d.id}`} className="block">
                        <p className="truncate font-bold text-foreground hover:text-primary">{d.title}</p>
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[d.documentType as DocumentType]} · {d.domain.name}</p>
                    </div>
                    {d.temporaryCode && <DocumentCodeBadge code={d.temporaryCode} temporary />}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><User className="size-3.5" /> {d.mainAuthorName}</span>
                    {d.year && <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" /> {d.year}</span>}
                    <span className="text-xs">· déposé {fromNow(d.createdAt)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <DocumentStatusBadge status={d.status} />
                    <AccessLevelBadge level={d.accessLevel} />
                    {d.duplicateWarnings.length > 0 && (
                      <Badge tone="pending"><AlertTriangle className="size-3" /> {d.duplicateWarnings.length} doublon(s)</Badge>
                    )}
                  </div>
                  {d.abstract && <p className="mt-2 line-clamp-2 rounded-lg bg-secondary/60 p-2 text-xs text-muted-foreground">{d.abstract}</p>}
                </CardContent>
                <div className="border-t border-border p-4">
                  <ReviewActions documentId={d.id} status={d.status} canReview canScience={false} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
