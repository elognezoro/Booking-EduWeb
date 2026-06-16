"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { stringifyJson } from "@/lib/json";
import { audit } from "@/lib/audit";
import { RESOURCE_STATUS } from "@/lib/enums";

const schema = z.object({
  name: z.string().min(2, "Le nom est requis."),
  code: z.string().min(1, "Le code est requis."),
  categoryId: z.string().min(1, "La catégorie est requise."),
  siteId: z.string().optional(),
  departmentId: z.string().optional(),
  managerId: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(RESOURCE_STATUS),
  capacity: z.coerce.number().int().nonnegative().optional(),
  quantityTotal: z.coerce.number().int().nonnegative().optional(),
  location: z.string().optional(),
  equipment: z.string().optional(),
  bookingMode: z.enum(["exclusive", "partial", "mixed"]),
  maxDurationMinutes: z.coerce.number().int().positive().optional(),
  minNoticeHours: z.coerce.number().int().nonnegative().optional(),
  requiresValidation: z.union([z.literal("on"), z.string()]).optional(),
  seatBased: z.union([z.literal("on"), z.string()]).optional(),
});

function extract(formData: FormData) {
  return schema.parse({
    name: formData.get("name"),
    code: formData.get("code"),
    categoryId: formData.get("categoryId"),
    siteId: formData.get("siteId") || undefined,
    departmentId: formData.get("departmentId") || undefined,
    managerId: formData.get("managerId") || undefined,
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    capacity: formData.get("capacity") || undefined,
    quantityTotal: formData.get("quantityTotal") || undefined,
    location: formData.get("location") || undefined,
    equipment: formData.get("equipment") || undefined,
    bookingMode: formData.get("bookingMode"),
    maxDurationMinutes: formData.get("maxDurationMinutes") || undefined,
    minNoticeHours: formData.get("minNoticeHours") || undefined,
    requiresValidation: formData.get("requiresValidation") || undefined,
    seatBased: formData.get("seatBased") || undefined,
  });
}

function buildData(d: z.infer<typeof schema>) {
  const equipmentArr = d.equipment ? d.equipment.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return {
    name: d.name,
    code: d.code,
    categoryId: d.categoryId,
    siteId: d.siteId || null,
    departmentId: d.departmentId || null,
    managerId: d.managerId || null,
    description: d.description || null,
    status: d.status,
    capacity: d.capacity ?? null,
    quantityTotal: d.quantityTotal ?? null,
    quantityAvailable: d.quantityTotal ?? null,
    location: d.location || null,
    equipment: stringifyJson(equipmentArr),
    rules: stringifyJson({
      bookingMode: d.bookingMode,
      seatBased: d.seatBased === "on",
      maxDurationMinutes: d.maxDurationMinutes ?? 240,
      minNoticeHours: d.minNoticeHours ?? 0,
      requiresValidation: d.requiresValidation === "on" || d.bookingMode !== "exclusive" ? d.requiresValidation === "on" : true,
    }),
  };
}

export async function createResource(formData: FormData) {
  const user = await requirePermission("resources.create");
  const d = extract(formData);
  const resource = await prisma.resource.create({
    data: { ...buildData(d), organizationId: user.organizationId! },
  });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "resource.create", entityType: "Resource", entityId: resource.id, newValue: d });
  revalidatePath("/dashboard/resources");
  redirect(`/dashboard/resources/${resource.id}`);
}

export async function updateResource(id: string, formData: FormData) {
  const user = await requirePermission("resources.update");
  const d = extract(formData);
  await prisma.resource.update({ where: { id }, data: buildData(d) });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "resource.update", entityType: "Resource", entityId: id, newValue: d });
  revalidatePath("/dashboard/resources");
  revalidatePath(`/dashboard/resources/${id}`);
  redirect(`/dashboard/resources/${id}`);
}

export async function deleteResource(formData: FormData) {
  const user = await requirePermission("resources.delete");
  const id = String(formData.get("id"));
  const bookings = await prisma.booking.count({ where: { resourceId: id } });
  if (bookings > 0) {
    // On archive si des réservations existent (préserve l'historique).
    await prisma.resource.update({ where: { id }, data: { status: "ARCHIVED" } });
  } else {
    await prisma.resource.delete({ where: { id } });
  }
  await audit({ organizationId: user.organizationId, userId: user.id, action: "resource.delete", entityType: "Resource", entityId: id });
  revalidatePath("/dashboard/resources");
  redirect("/dashboard/resources");
}
