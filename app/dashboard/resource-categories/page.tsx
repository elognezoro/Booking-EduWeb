import Link from "next/link";
import { Tags, Plus, Pencil, Trash2, Boxes } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/category-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteCategory } from "@/app/actions/categories";
import { VALIDATION_MODE_LABELS, type ValidationMode } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await requirePermission("resource_categories.manage");
  const user = await getCurrentUser();
  const categories = await prisma.resourceCategory.findMany({
    where: { organizationId: user!.organizationId ?? "" },
    orderBy: { name: "asc" },
    include: { _count: { select: { resources: true } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Catégories de ressources"
        description="Organisez vos ressources et définissez leurs règles de validation."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Tags className="size-6" /></span>}
        actions={<Button asChild><Link href="/dashboard/resource-categories/new"><Plus className="size-4" /> Nouvelle catégorie</Link></Button>}
      />

      {categories.length === 0 ? (
        <EmptyState icon={Tags} title="Aucune catégorie" description="Créez votre première catégorie pour classer vos ressources." action={<Button asChild><Link href="/dashboard/resource-categories/new"><Plus className="size-4" /> Créer une catégorie</Link></Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.id} className="card-hover">
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <CategoryIcon icon={c.icon} color={c.color} size="lg" />
                  <Badge tone="advanced">{VALIDATION_MODE_LABELS[c.validationMode as ValidationMode] ?? c.validationMode}</Badge>
                </div>
                <h3 className="mt-3 font-bold text-foreground">{c.name}</h3>
                {c.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>}
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Boxes className="size-4" /> {c._count.resources} ressource(s)</p>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1"><Link href={`/dashboard/resource-categories/${c.id}/edit`}><Pencil className="size-4" /> Modifier</Link></Button>
                  <ConfirmActionButton
                    action={deleteCategory}
                    hidden={{ id: c.id }}
                    triggerLabel=""
                    triggerIcon={<Trash2 className="size-4" />}
                    triggerVariant="ghost"
                    triggerSize="icon-sm"
                    title={`Supprimer « ${c.name} » ?`}
                    description={c._count.resources > 0 ? "Cette catégorie contient des ressources et ne peut pas être supprimée." : "Cette action est définitive."}
                    confirmLabel="Supprimer"
                    confirmVariant="destructive"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
