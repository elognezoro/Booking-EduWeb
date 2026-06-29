"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLmsAccess, canEditCourse } from "@/lib/lms";
import { sanitizeRich } from "@/lib/lms-content";
import { normalizeData } from "@/lib/lms-questions";
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

/* ----------------------------- Activités / contenus ----------------------------- */
async function sectionGuard(sectionId: string) {
  const access = await getLmsAccess();
  const section = await prisma.lmsSection.findUnique({ where: { id: sectionId }, select: { courseId: true, course: { select: { slug: true } } } });
  if (!section || !(await canEditCourse(access, section.courseId))) return null;
  return section;
}

export async function createActivity(formData: FormData) {
  const sectionId = String(formData.get("sectionId") || "");
  const section = await sectionGuard(sectionId);
  if (!section) redirect(BASE);
  const type = String(formData.get("type") || "PAGE");
  const title = String(formData.get("title") || "").trim() || (type === "URL" ? "Média" : "Page");
  const position = await prisma.lmsActivity.count({ where: { sectionId } });
  const data: { sectionId: string; type: string; title: string; position: number; content?: string; externalUrl?: string; intro?: string | null } = { sectionId, type, title, position };
  if (type === "PAGE") data.content = sanitizeRich(String(formData.get("content") || ""));
  if (type === "URL") {
    data.externalUrl = String(formData.get("externalUrl") || "").trim();
    data.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
  }
  const act = await prisma.lmsActivity.create({ data, select: { id: true } });
  revalidatePath(`${BASE}/cours/${section.course.slug}`);
  redirect(`${BASE}/cours/${section.course.slug}/a/${act.id}`);
}

export async function updateActivity(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  const act = await prisma.lmsActivity.findUnique({ where: { id }, select: { type: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } });
  if (!act || !(await canEditCourse(access, act.section.courseId))) redirect(BASE);
  const upd: { title?: string; content?: string; externalUrl?: string; intro?: string | null } = {};
  const title = String(formData.get("title") || "").trim();
  if (title) upd.title = title;
  if (act.type === "PAGE") upd.content = sanitizeRich(String(formData.get("content") || ""));
  if (act.type === "URL") {
    upd.externalUrl = String(formData.get("externalUrl") || "").trim();
    upd.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
  }
  await prisma.lmsActivity.update({ where: { id }, data: upd });
  revalidatePath(`${BASE}/cours/${act.section.course.slug}/a/${id}`);
  redirect(`${BASE}/cours/${act.section.course.slug}/a/${id}`);
}

export async function deleteActivity(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  const act = await prisma.lmsActivity.findUnique({ where: { id }, select: { section: { select: { courseId: true, course: { select: { slug: true } } } } } });
  if (!act || !(await canEditCourse(access, act.section.courseId))) redirect(BASE);
  await prisma.lmsActivity.delete({ where: { id } });
  revalidatePath(`${BASE}/cours/${act.section.course.slug}`);
  redirect(`${BASE}/cours/${act.section.course.slug}`);
}

/* ----------------------------- Banque de questions (exerciseurs) ----------------------------- */
export async function saveQuestion(formData: FormData) {
  const access = await getLmsAccess();
  const courseId = String(formData.get("courseId") || "");
  if (!(await canEditCourse(access, courseId))) redirect(BASE);
  const id = String(formData.get("id") || "");
  const type = String(formData.get("type") || "MCQ");
  const name = String(formData.get("name") || "").trim() || "Question";
  const questionText = sanitizeRich(String(formData.get("questionText") || ""));
  const generalFeedback = sanitizeRich(String(formData.get("generalFeedback") || "")) || null;
  const defaultMark = Math.max(0, Number(formData.get("defaultMark")) || 1);
  let parsed: unknown = {};
  try { parsed = JSON.parse(String(formData.get("data") || "{}")); } catch { parsed = {}; }
  const data = JSON.stringify(normalizeData(type, parsed));

  const course = await prisma.lmsCourse.findUnique({ where: { id: courseId }, select: { slug: true } });
  if (id) {
    const q = await prisma.lmsQuestion.findUnique({ where: { id }, select: { courseId: true } });
    if (!q || q.courseId !== courseId) redirect(BASE);
    await prisma.lmsQuestion.update({ where: { id }, data: { name, questionText, generalFeedback, defaultMark, data } });
  } else {
    await prisma.lmsQuestion.create({ data: { courseId, type, name, questionText, generalFeedback, defaultMark, data, createdById: access?.userId ?? null } });
  }
  revalidatePath(`${BASE}/cours/${course?.slug}/banque`);
  redirect(`${BASE}/cours/${course?.slug}/banque`);
}

export async function deleteQuestion(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  const q = await prisma.lmsQuestion.findUnique({ where: { id }, select: { courseId: true, course: { select: { slug: true } } } });
  if (!q || !(await canEditCourse(access, q.courseId))) redirect(BASE);
  await prisma.lmsQuestion.delete({ where: { id } });
  revalidatePath(`${BASE}/cours/${q.course.slug}/banque`);
  redirect(`${BASE}/cours/${q.course.slug}/banque`);
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
