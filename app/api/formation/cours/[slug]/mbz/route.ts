import { getLmsAccess, canEditCourse } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { buildCourseMbz, type MbzSection, type MbzActivity } from "@/lib/lms-mbz";
import { parseAssignConfig } from "@/lib/lms-assign";
import { parseWorkshopConfig } from "@/lib/lms-workshop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toUnix = (iso: string | null | undefined): number | null => {
  if (!iso) return null;
  const t = Math.floor(new Date(iso).getTime() / 1000);
  return Number.isFinite(t) ? t : null;
};

/** Exporte un cours LMS en sauvegarde Moodle 4.5 (.mbz) : sections + Page/Média, Quiz, Devoir, Forum, Wiki, Atelier. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const access = await getLmsAccess();
  // Autorisation AVANT toute requête lourde.
  const found = await prisma.lmsCourse.findUnique({ where: { slug: params.slug }, select: { id: true } });
  if (!found) return new Response("Cours introuvable", { status: 404 });
  if (!(await canEditCourse(access, found.id))) return new Response("Accès refusé", { status: 403 });

  const course = await prisma.lmsCourse.findUnique({
    where: { slug: params.slug },
    select: {
      title: true, slug: true, summary: true,
      sections: {
        orderBy: { position: "asc" },
        select: {
          title: true, summary: true,
          activities: {
            where: { type: { in: ["PAGE", "URL", "QUIZ", "DEVOIR", "FORUM", "WIKI", "WORKSHOP"] } },
            orderBy: { position: "asc" },
            select: {
              type: true, title: true, intro: true, content: true, externalUrl: true,
              assignConfig: true, workshopConfig: true,
              quizQuestions: {
                orderBy: { position: "asc" },
                select: { mark: true, question: { select: { id: true, type: true, name: true, questionText: true, generalFeedback: true, defaultMark: true, data: true } } },
              },
            },
          },
        },
      },
    },
  });
  if (!course) return new Response("Cours introuvable", { status: 404 });

  const sections: MbzSection[] = course.sections.map((s) => ({
    title: s.title,
    summary: s.summary,
    // Conserve l'ordre d'affichage des activités (toutes types confondus).
    activities: s.activities.flatMap((a): MbzActivity[] => {
      switch (a.type) {
        case "PAGE":
          return [{ kind: "page", title: a.title, intro: null, content: a.content || "" }];
        case "URL": {
          const url = (a.externalUrl || "").trim();
          // Lien sûr : uniquement http(s), avec échappement d'attribut HTML (anti-injection).
          const link = /^https?:\/\//i.test(url) ? `<p><a href="${escAttr(url)}" target="_blank" rel="noopener">${escText(url)}</a></p>` : "";
          return [{ kind: "page", title: a.title, intro: null, content: `${a.intro || ""}${link}` }];
        }
        case "QUIZ":
          return [{
            kind: "quiz", title: a.title, intro: a.intro,
            questions: a.quizQuestions.map((qq) => ({
              q: { type: qq.question.type, name: qq.question.name, questionText: qq.question.questionText, generalFeedback: qq.question.generalFeedback ?? "", defaultMark: qq.question.defaultMark, data: qq.question.data },
              mark: qq.mark ?? qq.question.defaultMark,
              key: qq.question.id,
            })),
          }];
        case "DEVOIR": {
          const c = parseAssignConfig(a.assignConfig);
          return [{ kind: "assign", title: a.title, intro: a.intro, dueAt: toUnix(c.dueAt), maxGrade: c.maxGrade, allowText: c.allowText, allowFile: c.allowFile }];
        }
        case "FORUM":
          return [{ kind: "forum", title: a.title, intro: a.intro }];
        case "WIKI":
          return [{ kind: "wiki", title: a.title, intro: a.intro, firstPageTitle: "Accueil" }];
        case "WORKSHOP": {
          const c = parseWorkshopConfig(a.workshopConfig);
          const criteria = (c.criteria || []).map((cr) => ({ description: cr.description, maxScore: cr.maxScore }));
          const crit = criteria.length ? criteria : [{ description: "Qualité du travail", maxScore: 10 }];
          const total = crit.reduce((sum, c) => sum + (Number(c.maxScore) || 0), 0);
          return [{ kind: "workshop", title: a.title, intro: a.intro, criteria: crit, submissionGrade: total > 0 ? total : 80, assessmentGrade: 20 }];
        }
        default:
          return [];
      }
    }),
  }));

  const totalItems = sections.reduce((n, s) => n + s.activities.length, 0);
  if (totalItems === 0) {
    return new Response("Aucune activité exportable dans ce cours.", { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  const { filename, buffer } = buildCourseMbz({ fullname: course.title, shortname: course.slug, summary: course.summary ?? undefined, sections }, now);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "no-store",
    },
  });
}
