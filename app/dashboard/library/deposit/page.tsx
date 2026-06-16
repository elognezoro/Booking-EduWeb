import Link from "next/link";
import { ArrowLeft, Plus, FileUp } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { DepositWizard } from "@/components/library/deposit-wizard";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function DepositPage() {
  await requirePermission("documents.create");
  const user = await getCurrentUser();
  const organizationId = user!.organizationId ?? "";

  const [collections, domains, library] = await Promise.all([
    prisma.documentCollection.findMany({ where: { organizationId, active: true }, orderBy: { name: "asc" } }),
    prisma.documentDomain.findMany({ where: { organizationId, active: true }, orderBy: { name: "asc" } }),
    prisma.digitalLibrary.findFirst({ where: { organizationId } }),
  ]);

  return (
    <div className="space-y-5">
      <Link href="/dashboard/library" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Bibliothèque
      </Link>
      <PageHeader
        title="Déposer une ressource"
        description="Renseignez les métadonnées, joignez le fichier et soumettez votre dépôt."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><FileUp className="size-6" /></span>}
      />
      {!library || collections.length === 0 || domains.length === 0 ? (
        <EmptyState icon={Plus} title="Bibliothèque non configurée" description="Aucune bibliothèque, collection ou domaine n'est encore configuré pour votre organisation." />
      ) : (
        <DepositWizard
          collections={collections.map((c) => ({ id: c.id, name: c.name, code: c.code }))}
          domains={domains.map((d) => ({ id: d.id, name: d.name, code: d.code }))}
        />
      )}
    </div>
  );
}
