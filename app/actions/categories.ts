"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { VALIDATION_MODES } from "@/lib/enums";

const schema = z.object({
  name: z.string().min(2, "Le nom est requis."),
  code: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  validationMode: z.enum(VALIDATION_MODES),
});

function extract(formData: FormData) {
  return schema.parse({
    name: formData.get("name"),
    code: formData.get("code") || undefined,
    description: formData.get("description") || undefined,
    icon: formData.get("icon") || undefined,
    color: formData.get("color") || undefined,
    validationMode: formData.get("validationMode"),
  });
}

export async function createCategory(formData: FormData) {
  const user = await requirePermission("resource_categories.manage");
  const d = extract(formData);
  await prisma.resourceCategory.create({
    data: { ...d, code: d.code ?? null, description: d.description ?? null, icon: d.icon ?? "Box", color: d.color ?? "#064B3A", organizationId: user.organizationId! },
  });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "category.create", entityType: "ResourceCategory", newValue: d });
  revalidatePath("/dashboard/resource-categories");
  redirect("/dashboard/resource-categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const user = await requirePermission("resource_categories.manage");
  const d = extract(formData);
  await prisma.resourceCategory.update({
    where: { id },
    data: { ...d, code: d.code ?? null, description: d.description ?? null, icon: d.icon ?? "Box", color: d.color ?? "#064B3A" },
  });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "category.update", entityType: "ResourceCategory", entityId: id, newValue: d });
  revalidatePath("/dashboard/resource-categories");
  redirect("/dashboard/resource-categories");
}

export async function deleteCategory(formData: FormData) {
  const user = await requirePermission("resource_categories.manage");
  const id = String(formData.get("id"));
  const count = await prisma.resource.count({ where: { categoryId: id } });
  if (count > 0) {
    redirect("/dashboard/resource-categories?error=non-empty");
  }
  await prisma.resourceCategory.delete({ where: { id } });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "category.delete", entityType: "ResourceCategory", entityId: id });
  revalidatePath("/dashboard/resource-categories");
  redirect("/dashboard/resource-categories");
}
