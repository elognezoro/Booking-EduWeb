"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLmsAccess, canEditCourse, getCourseRole } from "@/lib/lms";
import { sanitizeRich } from "@/lib/lms-content";
import { normalizeData } from "@/lib/lms-questions";
import { DEFAULT_QUIZ_CONFIG, parseQuizConfig, gradeAttempt, type QuizConfig } from "@/lib/lms-quiz";
import { DEFAULT_ASSIGN_CONFIG, parseAssignConfig, ASSIGN_MAX_FILE_MB, dataUrlBytes, isAllowedFile, type AssignConfig } from "@/lib/lms-assign";
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
  const data: { sectionId: string; type: string; title: string; position: number; content?: string; externalUrl?: string; intro?: string | null; quizConfig?: string; assignConfig?: string } = { sectionId, type, title, position };
  if (type === "PAGE") data.content = sanitizeRich(String(formData.get("content") || ""));
  if (type === "URL") {
    data.externalUrl = String(formData.get("externalUrl") || "").trim();
    data.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
  }
  if (type === "QUIZ") {
    data.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
    data.quizConfig = JSON.stringify(DEFAULT_QUIZ_CONFIG);
  }
  if (type === "DEVOIR") {
    data.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
    data.assignConfig = JSON.stringify(DEFAULT_ASSIGN_CONFIG);
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

/* ----------------------------- Quiz (assemblage + tentatives) ----------------------------- */
async function activityGuard(activityId: string) {
  const access = await getLmsAccess();
  const act = await prisma.lmsActivity.findUnique({
    where: { id: activityId },
    select: { id: true, type: true, quizConfig: true, assignConfig: true, section: { select: { courseId: true, course: { select: { slug: true } } } } },
  });
  if (!act) return null;
  return { access, act, editable: await canEditCourse(access, act.section.courseId) };
}

export async function configureQuiz(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g || !g.editable) redirect(BASE);
  const val = (k: string) => String(formData.get(k) || "");
  const cfg: QuizConfig = {
    attempts: Math.max(0, Number(formData.get("attempts")) || 0),
    gradeMethod: (["highest", "last", "average"].includes(val("gradeMethod")) ? val("gradeMethod") : "highest") as QuizConfig["gradeMethod"],
    shuffle: formData.get("shuffle") === "on",
    timeLimitMin: Math.max(0, Number(formData.get("timeLimitMin")) || 0),
    corrige: (["immediate", "afterAttempts", "manual", "never"].includes(val("corrige")) ? val("corrige") : "afterAttempts") as QuizConfig["corrige"],
    released: parseQuizConfig(g.act.quizConfig).released,
    passing: Math.max(0, Math.min(100, Number(formData.get("passing")) || 50)),
  };
  await prisma.lmsActivity.update({
    where: { id: activityId },
    data: { title: val("title").trim() || undefined, intro: sanitizeRich(val("intro")) || null, quizConfig: JSON.stringify(cfg) },
  });
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
}

export async function addQuizQuestions(input: { activityId: string; questionIds: string[] }) {
  const g = await activityGuard(input.activityId);
  if (!g || !g.editable) return;
  const ids = Array.isArray(input.questionIds) ? input.questionIds.filter(Boolean) : [];
  if (!ids.length) return;
  const valid = await prisma.lmsQuestion.findMany({ where: { id: { in: ids }, courseId: g.act.section.courseId }, select: { id: true, defaultMark: true } });
  let pos = await prisma.lmsQuizQuestion.count({ where: { activityId: input.activityId } });
  for (const q of valid) {
    await prisma.lmsQuizQuestion.upsert({
      where: { activityId_questionId: { activityId: input.activityId, questionId: q.id } },
      create: { activityId: input.activityId, questionId: q.id, position: pos++, mark: q.defaultMark },
      update: {},
    });
  }
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${input.activityId}`);
}

export async function removeQuizQuestion(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  const link = await prisma.lmsQuizQuestion.findUnique({ where: { id }, select: { activity: { select: { id: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } } } });
  if (!link || !(await canEditCourse(access, link.activity.section.courseId))) redirect(BASE);
  await prisma.lmsQuizQuestion.delete({ where: { id } });
  revalidatePath(`${BASE}/cours/${link.activity.section.course.slug}/a/${link.activity.id}`);
}

export async function releaseCorrige(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g || !g.editable) redirect(BASE);
  const cfg = parseQuizConfig(g.act.quizConfig);
  cfg.released = true;
  await prisma.lmsActivity.update({ where: { id: activityId }, data: { quizConfig: JSON.stringify(cfg) } });
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
}

export async function startAttempt(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g) redirect(BASE);
  if (!g.access) redirect("/login?callbackUrl=/formation");
  const slug = g.act.section.course.slug;
  const role = await getCourseRole(g.access.userId, g.act.section.courseId);
  if (role === null && !g.editable) redirect(`${BASE}/cours/${slug}`);
  const cfg = parseQuizConfig(g.act.quizConfig);
  const used = await prisma.lmsAttempt.count({ where: { activityId, userId: g.access.userId, state: "finished" } });
  if (cfg.attempts > 0 && used >= cfg.attempts) redirect(`${BASE}/cours/${slug}/a/${activityId}`);
  const existing = await prisma.lmsAttempt.findFirst({ where: { activityId, userId: g.access.userId, state: "inprogress" } });
  if (!existing) await prisma.lmsAttempt.create({ data: { activityId, userId: g.access.userId, state: "inprogress" } });
  redirect(`${BASE}/cours/${slug}/a/${activityId}/tentative`);
}

export async function submitAttempt(input: { attemptId: string; answers: Record<string, unknown> }) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const attempt = await prisma.lmsAttempt.findUnique({
    where: { id: input.attemptId },
    select: { id: true, userId: true, state: true, activityId: true, activity: { select: { section: { select: { course: { select: { slug: true } } } } } } },
  });
  if (!attempt || attempt.userId !== access.userId || attempt.state === "finished") redirect(BASE);
  const links = await prisma.lmsQuizQuestion.findMany({
    where: { activityId: attempt.activityId },
    include: { question: { select: { id: true, type: true, data: true, defaultMark: true } } },
    orderBy: { position: "asc" },
  });
  const items = links.map((l) => ({ questionId: l.question.id, type: l.question.type, data: l.question.data, mark: l.mark ?? l.question.defaultMark }));
  const graded = gradeAttempt(items, input.answers || {});
  await prisma.lmsAttempt.update({
    where: { id: attempt.id },
    data: { state: "finished", submittedAt: new Date(), answers: JSON.stringify(input.answers || {}), score: graded.score, maxScore: graded.maxScore },
  });
  redirect(`${BASE}/cours/${attempt.activity.section.course.slug}/a/${attempt.activityId}`);
}

/* ----------------------------- Devoir (dépôt + notation) ----------------------------- */
export async function configureAssign(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g || !g.editable) redirect(BASE);
  const val = (k: string) => String(formData.get(k) || "");
  const dueRaw = val("dueAt").trim();
  // datetime-local sans fuseau : on l'interprète en UTC de façon déterministe (CI = UTC+0).
  const dueIso = dueRaw ? new Date(`${dueRaw.length === 16 ? `${dueRaw}:00` : dueRaw}Z`) : null;
  const cfg: AssignConfig = {
    dueAt: dueIso && !isNaN(dueIso.getTime()) ? dueIso.toISOString() : null,
    allowText: formData.get("allowText") === "on",
    allowFile: formData.get("allowFile") === "on",
    maxFileMb: Math.max(1, Math.min(ASSIGN_MAX_FILE_MB, Number(formData.get("maxFileMb")) || 5)),
    maxGrade: Math.max(1, Math.min(100, Number(formData.get("maxGrade")) || 20)),
    allowLate: formData.get("allowLate") === "on",
  };
  if (!cfg.allowText && !cfg.allowFile) cfg.allowText = true; // au moins un mode de remise
  await prisma.lmsActivity.update({
    where: { id: activityId },
    data: { title: val("title").trim() || undefined, intro: sanitizeRich(val("intro")) || null, assignConfig: JSON.stringify(cfg) },
  });
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
}

export async function submitAssignment(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g) redirect(BASE);
  if (!g.access) redirect("/login?callbackUrl=/formation");
  const slug = g.act.section.course.slug;
  const userId = g.access.userId;
  // Seul un APPRENANT inscrit peut remettre (un enseignant/gestionnaire ne soumet pas de devoir).
  const role = await getCourseRole(userId, g.act.section.courseId);
  if (role !== "STUDENT") redirect(`${BASE}/cours/${slug}/a/${activityId}`);
  const cfg = parseAssignConfig(g.act.assignConfig);

  // Remise déjà notée → on ne permet pas d'écraser la note.
  const existing = await prisma.lmsSubmission.findUnique({ where: { activityId_userId: { activityId, userId } }, select: { id: true, state: true } });
  if (existing?.state === "graded") redirect(`${BASE}/cours/${slug}/a/${activityId}`);
  if (!cfg.allowLate && cfg.dueAt && Date.now() > new Date(cfg.dueAt).getTime()) redirect(`${BASE}/cours/${slug}/a/${activityId}`);

  const text = cfg.allowText ? sanitizeRich(String(formData.get("text") || "")) || null : null;
  let fileName: string | null = null, fileMime: string | null = null, fileData: string | null = null;
  if (cfg.allowFile) {
    const fd = String(formData.get("fileData") || "");
    if (fd.startsWith("data:")) {
      if (dataUrlBytes(fd) > cfg.maxFileMb * 1024 * 1024) redirect(`${BASE}/cours/${slug}/a/${activityId}`);
      fileName = String(formData.get("fileName") || "fichier").slice(0, 200);
      if (!isAllowedFile(fileName)) redirect(`${BASE}/cours/${slug}/a/${activityId}`); // liste blanche d'extensions (serveur)
      fileData = fd;
      fileMime = String(formData.get("fileMime") || "").slice(0, 120) || null;
    } else if (existing) {
      // conserver le fichier existant si rien de nouveau n'est déposé
      const cur = await prisma.lmsSubmission.findUnique({ where: { id: existing.id }, select: { fileName: true, fileMime: true, fileData: true } });
      fileName = cur?.fileName ?? null; fileMime = cur?.fileMime ?? null; fileData = cur?.fileData ?? null;
    }
  }
  if (!text && !fileData) redirect(`${BASE}/cours/${slug}/a/${activityId}`); // rien à remettre

  // Écriture sûre face à la concurrence : ne jamais écraser une remise déjà notée.
  const upd = await prisma.lmsSubmission.updateMany({
    where: { activityId, userId, state: { not: "graded" } },
    data: { text, fileName, fileMime, fileData, state: "submitted", submittedAt: new Date() },
  });
  if (upd.count === 0) {
    const cur = await prisma.lmsSubmission.findUnique({ where: { activityId_userId: { activityId, userId } }, select: { id: true } });
    if (!cur) await prisma.lmsSubmission.create({ data: { activityId, userId, text, fileName, fileMime, fileData, state: "submitted" } });
  }
  revalidatePath(`${BASE}/cours/${slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${slug}/a/${activityId}`);
}

export async function removeSubmission(formData: FormData) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const id = String(formData.get("id") || "");
  const sub = await prisma.lmsSubmission.findUnique({ where: { id }, select: { userId: true, state: true, activity: { select: { id: true, section: { select: { course: { select: { slug: true } } } } } } } });
  if (!sub || sub.userId !== access.userId || sub.state === "graded") redirect(BASE);
  await prisma.lmsSubmission.delete({ where: { id } });
  revalidatePath(`${BASE}/cours/${sub.activity.section.course.slug}/a/${sub.activity.id}`);
  redirect(`${BASE}/cours/${sub.activity.section.course.slug}/a/${sub.activity.id}`);
}

export async function gradeSubmission(formData: FormData) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const id = String(formData.get("id") || "");
  const sub = await prisma.lmsSubmission.findUnique({ where: { id }, select: { activity: { select: { id: true, assignConfig: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } } } });
  if (!sub || !(await canEditCourse(access, sub.activity.section.courseId))) redirect(BASE);
  const cfg = parseAssignConfig(sub.activity.assignConfig);
  const grade = Math.max(0, Math.min(cfg.maxGrade, Number(formData.get("grade")) || 0));
  const feedback = sanitizeRich(String(formData.get("feedback") || "")) || null;
  await prisma.lmsSubmission.update({
    where: { id },
    data: { grade, feedback, state: "graded", gradedById: access.userId, gradedAt: new Date() },
  });
  revalidatePath(`${BASE}/cours/${sub.activity.section.course.slug}/a/${sub.activity.id}`);
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
