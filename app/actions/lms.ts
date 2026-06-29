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
import { DEFAULT_FORUM_CONFIG, parseForumConfig, type ForumConfig } from "@/lib/lms-forum";
import { DEFAULT_WIKI_CONFIG, parseWikiConfig, type WikiConfig } from "@/lib/lms-wiki";
import { DEFAULT_WORKSHOP_CONFIG, parseWorkshopConfig, type WorkshopConfig, type WorkshopCriterion, type WorkshopPhase, PHASE_ORDER } from "@/lib/lms-workshop";
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
  const data: { sectionId: string; type: string; title: string; position: number; content?: string; externalUrl?: string; intro?: string | null; quizConfig?: string; assignConfig?: string; forumConfig?: string; wikiConfig?: string; workshopConfig?: string } = { sectionId, type, title, position };
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
  if (type === "FORUM") {
    data.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
    data.forumConfig = JSON.stringify(DEFAULT_FORUM_CONFIG);
  }
  if (type === "WIKI") {
    data.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
    data.wikiConfig = JSON.stringify(DEFAULT_WIKI_CONFIG);
  }
  if (type === "WORKSHOP") {
    data.intro = sanitizeRich(String(formData.get("intro") || "")) || null;
    data.workshopConfig = JSON.stringify(DEFAULT_WORKSHOP_CONFIG);
  }
  const act = await prisma.lmsActivity.create({ data, select: { id: true } });
  if (type === "WIKI") {
    // Page d'accueil par défaut + révision initiale (historique cohérent dès le départ).
    const uid = (await getLmsAccess())?.userId;
    const home = await prisma.lmsWikiPage.create({ data: { activityId: act.id, slug: "accueil", title: "Accueil", content: "", isHome: true, createdById: uid ?? null, updatedById: uid ?? null } });
    if (uid) await prisma.lmsWikiRevision.create({ data: { pageId: home.id, userId: uid, content: "" } });
  }
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
    select: { id: true, type: true, quizConfig: true, assignConfig: true, forumConfig: true, wikiConfig: true, workshopConfig: true, section: { select: { courseId: true, course: { select: { slug: true } } } } },
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

/* ----------------------------- Forum (discussions + réponses) ----------------------------- */
// Peut participer (lire/écrire) : inscrit au cours OU éditeur (enseignant/gestionnaire).
async function canParticipate(access: Awaited<ReturnType<typeof getLmsAccess>>, courseId: string): Promise<{ ok: boolean; role: "TEACHER" | "STUDENT" | null; editable: boolean }> {
  if (!access) return { ok: false, role: null, editable: false };
  const editable = await canEditCourse(access, courseId);
  const role = await getCourseRole(access.userId, courseId);
  return { ok: editable || role !== null, role, editable };
}

export async function configureForum(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g || !g.editable) redirect(BASE);
  const cfg: ForumConfig = { allowStudentDiscussions: formData.get("allowStudentDiscussions") === "on" };
  await prisma.lmsActivity.update({
    where: { id: activityId },
    data: { title: String(formData.get("title") || "").trim() || undefined, intro: sanitizeRich(String(formData.get("intro") || "")) || null, forumConfig: JSON.stringify(cfg) },
  });
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
}

export async function createDiscussion(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g) redirect(BASE);
  const part = await canParticipate(g.access, g.act.section.courseId);
  if (!part.ok) redirect(`${BASE}/cours/${g.act.section.course.slug}`);
  const cfg = parseForumConfig(g.act.forumConfig);
  // Un apprenant ne peut ouvrir une discussion que si c'est autorisé ; l'éditeur le peut toujours.
  if (!part.editable && !cfg.allowStudentDiscussions) redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  const title = String(formData.get("title") || "").trim().slice(0, 200);
  const message = sanitizeRich(String(formData.get("message") || ""));
  if (!title || !message) redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  const d = await prisma.lmsForumDiscussion.create({ data: { activityId, userId: g.access!.userId, title, message }, select: { id: true } });
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}/d/${d.id}`);
}

// Garde commune pour une discussion : renvoie la discussion + le contexte d'accès.
async function discussionGuard(discussionId: string) {
  const access = await getLmsAccess();
  const d = await prisma.lmsForumDiscussion.findUnique({
    where: { id: discussionId },
    select: { id: true, userId: true, locked: true, pinned: true, activityId: true, activity: { select: { section: { select: { courseId: true, course: { select: { slug: true } } } } } } },
  });
  if (!d) return null;
  const part = await canParticipate(access, d.activity.section.courseId);
  return { access, d, slug: d.activity.section.course.slug, ...part };
}

export async function replyPost(formData: FormData) {
  const discussionId = String(formData.get("discussionId") || "");
  const g = await discussionGuard(discussionId);
  if (!g || !g.ok) redirect(BASE);
  if (g.d.locked && !g.editable) redirect(`${BASE}/cours/${g.slug}/a/${g.d.activityId}/d/${discussionId}`);
  const message = sanitizeRich(String(formData.get("message") || ""));
  if (!message) redirect(`${BASE}/cours/${g.slug}/a/${g.d.activityId}/d/${discussionId}`);
  await prisma.lmsForumPost.create({ data: { discussionId, userId: g.access!.userId, message } });
  await prisma.lmsForumDiscussion.update({ where: { id: discussionId }, data: { lastPostAt: new Date() } });
  revalidatePath(`${BASE}/cours/${g.slug}/a/${g.d.activityId}/d/${discussionId}`);
  revalidatePath(`${BASE}/cours/${g.slug}/a/${g.d.activityId}`); // liste du forum (dernière activité / tri)
  redirect(`${BASE}/cours/${g.slug}/a/${g.d.activityId}/d/${discussionId}`);
}

export async function deletePost(formData: FormData) {
  const access = await getLmsAccess();
  const id = String(formData.get("id") || "");
  const post = await prisma.lmsForumPost.findUnique({
    where: { id },
    select: { userId: true, discussionId: true, discussion: { select: { activityId: true, createdAt: true, activity: { select: { section: { select: { courseId: true, course: { select: { slug: true } } } } } } } } },
  });
  if (!post) redirect(BASE);
  const courseId = post.discussion.activity.section.courseId;
  const editable = await canEditCourse(access, courseId);
  // Auteur ET toujours participant au cours, OU éditeur.
  const isAuthorParticipant = !!access && post.userId === access.userId && (await getCourseRole(access.userId, courseId)) !== null;
  if (!editable && !isAuthorParticipant) redirect(BASE);
  await prisma.lmsForumPost.delete({ where: { id } });
  // Recalcule la dernière activité de la discussion (sinon tri/affichage périmés).
  const last = await prisma.lmsForumPost.findFirst({ where: { discussionId: post.discussionId }, orderBy: { createdAt: "desc" }, select: { createdAt: true } });
  await prisma.lmsForumDiscussion.update({ where: { id: post.discussionId }, data: { lastPostAt: last?.createdAt ?? post.discussion.createdAt } });
  const base = `${BASE}/cours/${post.discussion.activity.section.course.slug}/a/${post.discussion.activityId}`;
  revalidatePath(`${base}/d/${post.discussionId}`);
  revalidatePath(base);
  redirect(`${base}/d/${post.discussionId}`);
}

export async function deleteDiscussion(formData: FormData) {
  const g = await discussionGuard(String(formData.get("id") || ""));
  if (!g) redirect(BASE);
  const isAuthor = !!g.access && g.d.userId === g.access.userId;
  if (!isAuthor && !g.editable) redirect(BASE);
  await prisma.lmsForumDiscussion.delete({ where: { id: g.d.id } });
  revalidatePath(`${BASE}/cours/${g.slug}/a/${g.d.activityId}`);
  redirect(`${BASE}/cours/${g.slug}/a/${g.d.activityId}`);
}

export async function toggleDiscussionFlag(formData: FormData) {
  const g = await discussionGuard(String(formData.get("id") || ""));
  if (!g || !g.editable) redirect(BASE);
  const flag = String(formData.get("flag") || "");
  const data = flag === "pinned" ? { pinned: !g.d.pinned }
    : flag === "locked" ? { locked: !g.d.locked }
    : null;
  if (!data) redirect(BASE);
  await prisma.lmsForumDiscussion.update({ where: { id: g.d.id }, data });
  revalidatePath(`${BASE}/cours/${g.slug}/a/${g.d.activityId}/d/${g.d.id}`);
  revalidatePath(`${BASE}/cours/${g.slug}/a/${g.d.activityId}`);
  redirect(`${BASE}/cours/${g.slug}/a/${g.d.activityId}/d/${g.d.id}`);
}

/* ----------------------------- Wiki (pages collaboratives + historique) ----------------------------- */
async function uniqueWikiSlug(activityId: string, title: string): Promise<string> {
  const base = slugify(title) || "page";
  let slug = base;
  for (let i = 2; i < 100; i++) {
    const exists = await prisma.lmsWikiPage.findUnique({ where: { activityId_slug: { activityId, slug } }, select: { id: true } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function configureWiki(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g || !g.editable) redirect(BASE);
  const cfg: WikiConfig = { allowStudentEdit: formData.get("allowStudentEdit") === "on" };
  await prisma.lmsActivity.update({
    where: { id: activityId },
    data: { title: String(formData.get("title") || "").trim() || undefined, intro: sanitizeRich(String(formData.get("intro") || "")) || null, wikiConfig: JSON.stringify(cfg) },
  });
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
}

// Peut éditer/créer des pages : éditeur, OU apprenant inscrit si le wiki l'autorise.
async function canEditWiki(g: NonNullable<Awaited<ReturnType<typeof activityGuard>>>): Promise<boolean> {
  if (g.editable) return true;
  if (!g.access) return false;
  const cfg = parseWikiConfig(g.act.wikiConfig);
  if (!cfg.allowStudentEdit) return false;
  return (await getCourseRole(g.access.userId, g.act.section.courseId)) !== null;
}

export async function createWikiPage(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g) redirect(BASE);
  const slugCourse = g.act.section.course.slug;
  if (!g.access || !(await canEditWiki(g))) redirect(`${BASE}/cours/${slugCourse}/a/${activityId}`);
  const uid = g.access.userId;
  const title = String(formData.get("title") || "").trim().slice(0, 200);
  if (!title) redirect(`${BASE}/cours/${slugCourse}/a/${activityId}`);
  let slug = await uniqueWikiSlug(activityId, title);
  let page: { id: string };
  try {
    page = await prisma.lmsWikiPage.create({ data: { activityId, slug, title, content: "", createdById: uid, updatedById: uid }, select: { id: true } });
  } catch {
    // Course critique sur le slug (création concurrente) : on réessaie avec un suffixe unique.
    slug = `${slug}-${Date.now().toString(36)}`;
    page = await prisma.lmsWikiPage.create({ data: { activityId, slug, title, content: "", createdById: uid, updatedById: uid }, select: { id: true } });
  }
  await prisma.lmsWikiRevision.create({ data: { pageId: page.id, userId: uid, content: "" } }); // révision initiale
  revalidatePath(`${BASE}/cours/${slugCourse}/a/${activityId}`);
  redirect(`${BASE}/cours/${slugCourse}/a/${activityId}/w/${slug}`);
}

// Garde d'une page wiki : page + contexte d'édition.
async function wikiPageGuard(pageId: string) {
  const page = await prisma.lmsWikiPage.findUnique({
    where: { id: pageId },
    select: { id: true, slug: true, isHome: true, activityId: true, activity: { select: { wikiConfig: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } } },
  });
  if (!page) return null;
  const g = await activityGuard(page.activityId);
  if (!g) return null;
  return { page, g, slug: page.activity.section.course.slug, canEdit: await canEditWiki(g) };
}

export async function saveWikiPage(formData: FormData) {
  const pageId = String(formData.get("pageId") || "");
  const w = await wikiPageGuard(pageId);
  if (!w) redirect(BASE);
  if (!w.canEdit || !w.g.access) redirect(`${BASE}/cours/${w.slug}/a/${w.page.activityId}/w/${w.page.slug}`);
  const content = sanitizeRich(String(formData.get("content") || ""));
  await prisma.lmsWikiPage.update({ where: { id: pageId }, data: { content, updatedById: w.g.access.userId } });
  await prisma.lmsWikiRevision.create({ data: { pageId, userId: w.g.access.userId, content } });
  revalidatePath(`${BASE}/cours/${w.slug}/a/${w.page.activityId}/w/${w.page.slug}`);
  redirect(`${BASE}/cours/${w.slug}/a/${w.page.activityId}/w/${w.page.slug}`);
}

export async function deleteWikiPage(formData: FormData) {
  const pageId = String(formData.get("pageId") || "");
  const w = await wikiPageGuard(pageId);
  if (!w || !w.g.editable) redirect(BASE); // suppression réservée aux enseignants/gestionnaires
  if (w.page.isHome) redirect(`${BASE}/cours/${w.slug}/a/${w.page.activityId}/w/${w.page.slug}`); // la page d'accueil n'est pas supprimable
  await prisma.lmsWikiPage.delete({ where: { id: pageId } });
  revalidatePath(`${BASE}/cours/${w.slug}/a/${w.page.activityId}`);
  redirect(`${BASE}/cours/${w.slug}/a/${w.page.activityId}`);
}

export async function revertWikiPage(formData: FormData) {
  const revisionId = String(formData.get("revisionId") || "");
  const rev = await prisma.lmsWikiRevision.findUnique({ where: { id: revisionId }, select: { content: true, pageId: true } });
  if (!rev) redirect(BASE);
  const w = await wikiPageGuard(rev.pageId);
  if (!w || !w.g.editable || !w.g.access) redirect(BASE); // restauration réservée aux enseignants/gestionnaires
  const content = sanitizeRich(rev.content); // re-nettoyage défensif au moment de la restauration
  await prisma.lmsWikiPage.update({ where: { id: rev.pageId }, data: { content, updatedById: w.g.access.userId } });
  await prisma.lmsWikiRevision.create({ data: { pageId: rev.pageId, userId: w.g.access.userId, content } });
  revalidatePath(`${BASE}/cours/${w.slug}/a/${w.page.activityId}/w/${w.page.slug}`);
  redirect(`${BASE}/cours/${w.slug}/a/${w.page.activityId}/w/${w.page.slug}`);
}

/* ----------------------------- Atelier (workshop) : remise + évaluation par les pairs ----------------------------- */
export async function configureWorkshop(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g || !g.editable) redirect(BASE);
  const current = parseWorkshopConfig(g.act.workshopConfig);
  let criteria: WorkshopCriterion[] = current.criteria;
  // Les critères ne sont modifiables qu'en phase SETUP (sinon on fausserait des notes déjà calculées).
  if (current.phase === "SETUP") {
    try {
      const raw = JSON.parse(String(formData.get("criteria") || "[]")) as { description?: string; maxScore?: unknown }[];
      const cleaned = raw
        .map((c, i) => ({ id: `c${i + 1}`, description: String(c.description || "").trim().slice(0, 300), maxScore: Math.max(1, Math.min(100, Number(c.maxScore) || 10)) }))
        .filter((c) => c.description);
      if (cleaned.length) criteria = cleaned;
    } catch { /* garde les critères courants */ }
  }
  const cfg: WorkshopConfig = {
    phase: current.phase, // la phase n'est pas modifiée ici
    instructions: sanitizeRich(String(formData.get("instructions") || "")),
    criteria,
    reviewsPerStudent: Math.max(1, Math.min(10, Number(formData.get("reviewsPerStudent")) || 2)),
  };
  await prisma.lmsActivity.update({
    where: { id: activityId },
    data: { title: String(formData.get("title") || "").trim() || undefined, intro: sanitizeRich(String(formData.get("intro") || "")) || null, workshopConfig: JSON.stringify(cfg) },
  });
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Attribue à chaque apprenant des remises de pairs à évaluer (aléatoire, hors la sienne).
// Idempotent et incrémental : ne complète que le déficit de chaque évaluateur (gère les remises tardives
// et les retours en phase ASSESSMENT sans dupliquer les attributions existantes).
async function allocateWorkshop(activityId: string, reviewsPerStudent: number) {
  const subs = await prisma.lmsWorkshopSubmission.findMany({ where: { activityId }, select: { id: true, userId: true } });
  if (subs.length < 2) return;
  const existing = await prisma.lmsWorkshopAssessment.findMany({ where: { submission: { activityId } }, select: { reviewerId: true, submissionId: true } });
  const existingPairs = new Set(existing.map((e) => `${e.reviewerId}:${e.submissionId}`));
  const outgoing = new Map<string, number>();
  for (const e of existing) outgoing.set(e.reviewerId, (outgoing.get(e.reviewerId) ?? 0) + 1);
  const rows: { submissionId: string; reviewerId: string }[] = [];
  for (const reviewer of subs) {
    const need = reviewsPerStudent - (outgoing.get(reviewer.userId) ?? 0);
    if (need <= 0) continue;
    const candidates = shuffle(subs.filter((s) => s.userId !== reviewer.userId && !existingPairs.has(`${reviewer.userId}:${s.id}`)));
    for (const target of candidates.slice(0, need)) rows.push({ submissionId: target.id, reviewerId: reviewer.userId });
  }
  if (rows.length) await prisma.lmsWorkshopAssessment.createMany({ data: rows, skipDuplicates: true });
}

export async function setWorkshopPhase(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g || !g.editable) redirect(BASE);
  const phase = String(formData.get("phase") || "");
  if (!PHASE_ORDER.includes(phase as WorkshopPhase)) redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  const cfg = parseWorkshopConfig(g.act.workshopConfig);
  cfg.phase = phase as WorkshopPhase;
  await prisma.lmsActivity.update({ where: { id: activityId }, data: { workshopConfig: JSON.stringify(cfg) } });
  if (cfg.phase === "ASSESSMENT") await allocateWorkshop(activityId, cfg.reviewsPerStudent);
  revalidatePath(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${g.act.section.course.slug}/a/${activityId}`);
}

export async function submitWorkshop(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const g = await activityGuard(activityId);
  if (!g) redirect(BASE);
  if (!g.access) redirect("/login?callbackUrl=/formation");
  const slug = g.act.section.course.slug;
  const userId = g.access.userId;
  const role = await getCourseRole(userId, g.act.section.courseId);
  if (role !== "STUDENT") redirect(`${BASE}/cours/${slug}/a/${activityId}`); // seuls les apprenants remettent
  const cfg = parseWorkshopConfig(g.act.workshopConfig);
  if (cfg.phase !== "SUBMISSION") redirect(`${BASE}/cours/${slug}/a/${activityId}`); // remise hors phase
  const title = String(formData.get("title") || "").trim().slice(0, 200);
  const content = sanitizeRich(String(formData.get("content") || ""));
  let fileName: string | null = null, fileMime: string | null = null, fileData: string | null = null;
  const fd = String(formData.get("fileData") || "");
  if (fd.startsWith("data:")) {
    if (dataUrlBytes(fd) > ASSIGN_MAX_FILE_MB * 1024 * 1024) redirect(`${BASE}/cours/${slug}/a/${activityId}`);
    fileName = String(formData.get("fileName") || "fichier").slice(0, 200);
    if (!isAllowedFile(fileName)) redirect(`${BASE}/cours/${slug}/a/${activityId}`);
    fileData = fd;
    fileMime = String(formData.get("fileMime") || "").slice(0, 120) || null;
  } else {
    const cur = await prisma.lmsWorkshopSubmission.findUnique({ where: { activityId_userId: { activityId, userId } }, select: { fileName: true, fileMime: true, fileData: true } });
    fileName = cur?.fileName ?? null; fileMime = cur?.fileMime ?? null; fileData = cur?.fileData ?? null;
  }
  if (!title && !content && !fileData) redirect(`${BASE}/cours/${slug}/a/${activityId}`);
  await prisma.lmsWorkshopSubmission.upsert({
    where: { activityId_userId: { activityId, userId } },
    create: { activityId, userId, title: title || "Sans titre", content, fileName, fileMime, fileData },
    update: { title: title || "Sans titre", content, fileName, fileMime, fileData },
  });
  revalidatePath(`${BASE}/cours/${slug}/a/${activityId}`);
  redirect(`${BASE}/cours/${slug}/a/${activityId}`);
}

export async function saveAssessment(formData: FormData) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const assessmentId = String(formData.get("assessmentId") || "");
  const a = await prisma.lmsWorkshopAssessment.findUnique({
    where: { id: assessmentId },
    select: { id: true, reviewerId: true, submission: { select: { activityId: true, activity: { select: { workshopConfig: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } } } } },
  });
  if (!a || a.reviewerId !== access.userId) redirect(BASE); // seul l'évaluateur attribué
  const cfg = parseWorkshopConfig(a.submission.activity.workshopConfig);
  const slug = a.submission.activity.section.course.slug;
  const dest = `${BASE}/cours/${slug}/a/${a.submission.activityId}`;
  // Défense en profondeur : l'évaluateur doit toujours être inscrit au cours.
  if ((await getCourseRole(access.userId, a.submission.activity.section.courseId)) === null) redirect(dest);
  if (cfg.phase !== "ASSESSMENT") redirect(dest); // évaluation hors phase
  const scores: Record<string, number> = {};
  for (const c of cfg.criteria) scores[c.id] = Math.max(0, Math.min(c.maxScore, Number(formData.get(`score_${c.id}`)) || 0));
  const feedback = sanitizeRich(String(formData.get("feedback") || "")) || null;
  await prisma.lmsWorkshopAssessment.update({ where: { id: assessmentId }, data: { scores: JSON.stringify(scores), feedback, submitted: true } });
  revalidatePath(dest);
  redirect(dest);
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
