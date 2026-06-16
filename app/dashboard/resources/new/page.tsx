import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { ResourceForm } from "@/components/resources/resource-form";
import { createResource } from "@/app/actions/resources";

export const dynamic = "force-dynamic";

export default async function NewResourcePage() {
  await requirePermission("resources.create");
  const user = await getCurrentUser();
  const organizationId = user!.organizationId ?? "";

  const [categories, sites, departments, managers] = await Promise.all([
    prisma.resourceCategory.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.site.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.department.findMany({ where: { organizationId }, orderBy: { name: "asc" }, select: { id: true, name: true, parentId: true } }),
    prisma.user.findMany({ where: { organizationId, status: "ACTIVE" }, orderBy: { firstName: "asc" } }),
  ]);
  const levels = departments.filter((d) => !d.parentId);
  const services = departments.filter((d) => d.parentId);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/dashboard/resources" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour
      </Link>
      <PageHeader title="Nouvelle ressource" description="Ajoutez une ressource réservable à votre organisation." />
      <ResourceForm action={createResource} categories={categories} sites={sites} levels={levels} services={services} managers={managers} />
    </div>
  );
}
