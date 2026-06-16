import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { CategoryForm } from "@/components/resources/category-form";
import { createCategory } from "@/app/actions/categories";

export default async function NewCategoryPage() {
  await requirePermission("resource_categories.manage");
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/dashboard/resource-categories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour
      </Link>
      <PageHeader title="Nouvelle catégorie" description="Définissez une catégorie de ressources." />
      <CategoryForm action={createCategory} />
    </div>
  );
}
