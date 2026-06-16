import { Layers } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCollection, toggleCollection, updateCollection } from "@/app/actions/library";
import { CodeNameForm } from "@/components/library/code-name-form";
import { ManagedItemRow } from "@/components/library/managed-item-row";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const user = await requirePermission("library.manage");
  await getCurrentUser();
  const collections = await prisma.documentCollection.findMany({
    where: { organizationId: user.organizationId ?? "" },
    orderBy: { name: "asc" },
    include: { _count: { select: { documents: true } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Collections documentaires"
        description="Organisez le fonds en collections configurables."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Layers className="size-6" /></span>}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <CardHeader><CardTitle>{collections.length} collection(s)</CardTitle></CardHeader>
          <div className="divide-y divide-border">
            {collections.map((c) => (
              <ManagedItemRow
                key={c.id}
                item={{ id: c.id, name: c.name, code: c.code, active: c.active, count: c._count.documents }}
                toggleAction={toggleCollection}
                updateAction={updateCollection}
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            ))}
          </div>
        </Card>

        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardHeader><CardTitle className="text-base">Nouvelle collection</CardTitle></CardHeader>
          <CardContent>
            <CodeNameForm action={createCollection} namePlaceholder="Ex. Thèses" codePlaceholder="Ex. THS" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
