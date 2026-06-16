import { FolderTree } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDomain, toggleDomain, updateDomain } from "@/app/actions/library";
import { CodeNameForm } from "@/components/library/code-name-form";
import { ManagedItemRow } from "@/components/library/managed-item-row";

export const dynamic = "force-dynamic";

export default async function DomainsPage() {
  const user = await requirePermission("library.manage");
  await getCurrentUser();
  const domains = await prisma.documentDomain.findMany({
    where: { organizationId: user.organizationId ?? "" },
    orderBy: { name: "asc" },
    include: { _count: { select: { documents: true } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Domaines & disciplines"
        description="Classez les ressources par domaines scientifiques et pédagogiques."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><FolderTree className="size-6" /></span>}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <CardHeader><CardTitle>{domains.length} domaine(s)</CardTitle></CardHeader>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {domains.map((d) => (
              <ManagedItemRow
                key={d.id}
                item={{ id: d.id, name: d.name, code: d.code, active: d.active, count: d._count.documents }}
                toggleAction={toggleDomain}
                updateAction={updateDomain}
                activeLabel="Actif"
                inactiveLabel="Inactif"
              />
            ))}
          </div>
        </Card>

        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardHeader><CardTitle className="text-base">Nouveau domaine</CardTitle></CardHeader>
          <CardContent>
            <CodeNameForm action={createDomain} namePlaceholder="Ex. Robotique" codePlaceholder="Ex. ROB" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
