import { Search, SearchX, Plus } from "lucide-react";
import Link from "next/link";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { catalogWhere } from "@/lib/library/access";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { DocumentCard } from "@/components/library/document-card";
import { EmptyState } from "@/components/ui/empty-state";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, ACCESS_LEVELS, ACCESS_LEVEL_META } from "@/lib/library/enums";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; collection?: string; domain?: string; access?: string };
}) {
  await requirePermission("documents.read");
  const user = await getCurrentUser();

  const [collections, domains] = await Promise.all([
    prisma.documentCollection.findMany({ where: { organizationId: user!.organizationId ?? "" }, orderBy: { name: "asc" } }),
    prisma.documentDomain.findMany({ where: { organizationId: user!.organizationId ?? "" }, orderBy: { name: "asc" } }),
  ]);

  const conditions: any[] = [catalogWhere(user)];
  if (searchParams.type) conditions.push({ documentType: searchParams.type });
  if (searchParams.collection) conditions.push({ collectionId: searchParams.collection });
  if (searchParams.domain) conditions.push({ domainId: searchParams.domain });
  if (searchParams.access) conditions.push({ accessLevel: searchParams.access });
  if (searchParams.q) {
    const q = searchParams.q;
    conditions.push({
      OR: [
        { title: { contains: q } },
        { abstract: { contains: q } },
        { mainAuthorName: { contains: q } },
        { codeLong: { contains: q } },
        { codeShort: { contains: q } },
        { keywords: { contains: q } },
      ],
    });
  }

  const documents = await prisma.documentResource.findMany({
    where: { AND: conditions },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 60,
    include: { domain: { select: { name: true } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Explorer la bibliothèque"
        description="Recherchez et filtrez les ressources documentaires."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Search className="size-6" /></span>}
        actions={user!.permissions.has("documents.create") && <Button asChild><Link href="/dashboard/library/deposit"><Plus className="size-4" /> Déposer</Link></Button>}
      />

      <SearchFilterBar
        searchPlaceholder="Titre, auteur, mot-clé, code…"
        filters={[
          { name: "type", label: "Tous les types", options: DOCUMENT_TYPES.map((t) => ({ value: t, label: DOCUMENT_TYPE_LABELS[t] })) },
          { name: "collection", label: "Toutes collections", options: collections.map((c) => ({ value: c.id, label: c.name })) },
          { name: "domain", label: "Tous domaines", options: domains.map((d) => ({ value: d.id, label: d.name })) },
          { name: "access", label: "Tout accès", options: ACCESS_LEVELS.map((a) => ({ value: a, label: ACCESS_LEVEL_META[a].label })) },
        ]}
      />

      <p className="text-sm text-muted-foreground">{documents.length} document(s)</p>

      {documents.length === 0 ? (
        <EmptyState icon={SearchX} title="Aucun document trouvé" description="Aucune ressource ne correspond à votre recherche." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {documents.map((d) => <DocumentCard key={d.id} doc={d} />)}
        </div>
      )}
    </div>
  );
}
