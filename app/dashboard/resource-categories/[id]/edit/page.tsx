import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { CategoryForm } from "@/components/resources/category-form";
import { updateCategory } from "@/app/actions/categories";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  await requirePermission("resource_categories.manage");
  const user = await getCurrentUser();
  const category = await prisma.resourceCategory.findFirst({ where: { id: params.id, organizationId: user!.organizationId ?? "" } });
  if (!category) notFound();
  const action = updateCategory.bind(null, category.id);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/dashboard/resource-categories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour
      </Link>
      <PageHeader title="Modifier la catégorie" description={category.name} />
      <CategoryForm action={action} category={category} />
    </div>
  );
}
