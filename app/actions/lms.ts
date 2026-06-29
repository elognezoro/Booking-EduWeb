"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLmsAccess, canEditCourse } from "@/lib/lms";
import { slugify } from "@/lib/utils";

const BASE = "/formation";

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "cours";
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const exists = await prisma.lmsCourse.findUnique({ where: { slug }, select: { id: true } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/* ----------------------------- Cours ----------------------------- */
export async function createCourse(formData: FormData) {
  const access = await getLmsAccess();
  if (!access?.canCreateCourse) redirect(BASE);
  const data = z
    .object({ title: z.string().min(2), summary: z.string().optional(), level: z.string().optional() })
    .parse({ title: formData.get("title"), summary: formData.get("summary") || undefined, level: formData.get("level") || undefined });

  const slug = await uniqueSlug(data.title);
  const course = await prisma.lmsCourse.create({
    data: {
      slug,
      title: data.title.trim(),
      summary: data.summary?.trim() || null,
      level: data.level?.trim() || null,
      createdById: access.userId,
      // L'auteur est inscrit comme enseignant du cours + une première section vide.
      enrolments: { create: { userId: access.userId, role: "TEACHER" } },
      sections: { create: { title: "Section 1", position: 0 } },
    },
    select: { slug: true },
  });
  revalidatePath(BASE);
  redirect(`${BASE}/cours/${course.slug}`);
}

export async function updateCourse(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  if (!(await canEditCourse(access, id))) redirect(BASE);
  const data = z
    .object({ title: z.string().min(2), summary: z.string().optional(), level: z.string().optional(), visible: z.string().optional() })
    .parse({ title: formData.get("title"), summary: formData.get("summary") || undefined, level: formData.get("level") || undefined, visible: formData.get("visible") || undefined });
  const course = await prisma.lmsCourse.update({
    where: { id },
    data: { title: data.title.trim(), summary: data.summary?.trim() || null, level: data.level?.trim() || null, visible: data.visible === "on" },
    select: { slug: true },
  });
  revalidatePath(`${BASE}/cours/${course.slug}`);
  redirect(`${BASE}/cours/${course.slug}`);
}

export async function deleteCourse(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  if (!(await canEditCourse(access, id))) redirect(BASE);
  await prisma.lmsCourse.delete({ where: { id } });
  revalidatePath(BASE);
  redirect(BASE);
}

/* ----------------------------- Sections ----------------------------- */
export async function createSection(formData: FormData) {
  const access = await getLmsAccess();
  const courseId = String(formData.get("courseId") || "");
  if (!(await canEditCourse(access, courseId))) redirect(BASE);
  const title = String(formData.get("title") || "").trim() || "Nouvelle section";
  const count = await prisma.lmsSection.count({ where: { courseId } });
  const course = await prisma.lmsCourse.findUnique({ where: { id: courseId }, select: { slug: true } });
  await prisma.lmsSection.create({ data: { courseId, title, position: count } });
  if (course) revalidatePath(`${BASE}/cours/${course.slug}`);
}

export async function updateSection(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  const section = await prisma.lmsSection.findUnique({ where: { id }, select: { courseId: true, course: { select: { slug: true } } } });
  if (!section || !(await canEditCourse(access, section.courseId))) redirect(BASE);
  await prisma.lmsSection.update({
    where: { id },
    data: { title: String(formData.get("title") || "").trim() || "Section", summary: String(formData.get("summary") || "").trim() || null },
  });
  revalidatePath(`${BASE}/cours/${section.course.slug}`);
}

export async function deleteSection(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  const section = await prisma.lmsSection.findUnique({ where: { id }, select: { courseId: true, course: { select: { slug: true } } } });
  if (!section || !(await canEditCourse(access, section.courseId))) redirect(BASE);
  await prisma.lmsSection.delete({ where: { id } });
  revalidatePath(`${BASE}/cours/${section.course.slug}`);
}

/* ----------------------------- Inscription (apprenant) ----------------------------- */
export async function enrolSelf(formData: FormData) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const courseId = String(formData.get("courseId") || "");
  const course = await prisma.lmsCourse.findFirst({ where: { id: courseId, visible: true }, select: { id: true, slug: true } });
  if (!course) redirect(BASE);
  await prisma.lmsEnrolment.upsert({
    where: { courseId_userId: { courseId: course.id, userId: access.userId } },
    create: { courseId: course.id, userId: access.userId, role: "STUDENT" },
    update: {},
  });
  revalidatePath(`${BASE}/cours/${course.slug}`);
  redirect(`${BASE}/cours/${course.slug}`);
}
