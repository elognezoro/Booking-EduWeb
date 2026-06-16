import Link from "next/link";
import { FileStack, Eye, Download, Plus } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { catalogWhere } from "@/lib/library/access";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentTypeIcon } from "@/components/library/document-type-icon";
import { DocumentStatusBadge, AccessLevelBadge } from "@/components/library/document-badges";
import { DOCUMENT_STATUS, DOCUMENT_STATUS_META, DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "@/lib/library/enums";

export const dynamic = "force-dynamic";

export default async function DocumentsTablePage({ searchParams }: { searchParams: { q?: string; status?: string; type?: string } }) {
  await requirePermission("documents.read");
  const user = await getCurrentUser();

  const conditions: any[] = [catalogWhere(user)];
  if (searchParams.status) conditions.push({ status: searchParams.status });
  if (searchParams.type) conditions.push({ documentType: searchParams.type });
  if (searchParams.q) conditions.push({ OR: [{ title: { contains: searchParams.q } }, { codeLong: { contains: searchParams.q } }, { codeShort: { contains: searchParams.q } }, { mainAuthorName: { contains: searchParams.q } }] });

  const documents = await prisma.documentResource.findMany({
    where: { AND: conditions },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { domain: { select: { name: true } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Documents"
        description="Gérez l'ensemble des ressources documentaires."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><FileStack className="size-6" /></span>}
        actions={user!.permissions.has("documents.create") && <Button asChild><Link href="/dashboard/library/deposit"><Plus className="size-4" /> Déposer</Link></Button>}
      />

      <SearchFilterBar
        searchPlaceholder="Titre, code, auteur…"
        filters={[
          { name: "status", label: "Tous les statuts", options: DOCUMENT_STATUS.map((s) => ({ value: s, label: DOCUMENT_STATUS_META[s].label })) },
          { name: "type", label: "Tous les types", options: DOCUMENT_TYPES.map((t) => ({ value: t, label: DOCUMENT_TYPE_LABELS[t] })) },
        ]}
      />

      <p className="text-sm text-muted-foreground">{documents.length} document(s)</p>

      {documents.length === 0 ? (
        <EmptyState icon={FileStack} title="Aucun document" description="Aucune ressource ne correspond aux filtres." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Document</th>
                  <th className="px-4 py-2.5">Code</th>
                  <th className="px-4 py-2.5">Statut</th>
                  <th className="px-4 py-2.5">Accès</th>
                  <th className="px-4 py-2.5 text-center">Vues</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/library/documents/${d.id}`} className="flex items-center gap-3">
                        <DocumentTypeIcon type={d.documentType} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{d.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{d.mainAuthorName} · {d.domain.name} · {d.year ?? "—"}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3"><span className="font-mono text-xs text-primary-700">{d.codeShort ?? d.temporaryCode ?? "—"}</span></td>
                    <td className="px-4 py-3"><DocumentStatusBadge status={d.status} /></td>
                    <td className="px-4 py-3"><AccessLevelBadge level={d.accessLevel} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Eye className="size-3.5" /> {d.consultationCount}</span>
                        <span className="inline-flex items-center gap-1"><Download className="size-3.5" /> {d.downloadCount}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
