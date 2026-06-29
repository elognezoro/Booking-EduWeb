import { getLmsAccess, canEditCourse } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { buildCourseMbz, type MbzSection } from "@/lib/lms-mbz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Exporte un cours LMS en sauvegarde Moodle 4.5 (.mbz). Phase 1 : sections + activités Page/Média. */
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
            where: { type: { in: ["PAGE", "URL"] } },
            orderBy: { position: "asc" },
            select: { type: true, title: true, intro: true, content: true, externalUrl: true },
          },
        },
      },
    },
  });
  if (!course) return new Response("Cours introuvable", { status: 404 });

  const sections: MbzSection[] = course.sections.map((s) => ({
    title: s.title,
    summary: s.summary,
    pages: s.activities.map((a) => {
      if (a.type === "URL") {
        const url = (a.externalUrl || "").trim();
        // Lien sûr : uniquement http(s), avec échappement d'attribut HTML (anti-injection).
        const link = /^https?:\/\//i.test(url) ? `<p><a href="${escAttr(url)}" target="_blank" rel="noopener">${escText(url)}</a></p>` : "";
        return { title: a.title, intro: null, content: `${a.intro || ""}${link}` };
      }
      return { title: a.title, intro: null, content: a.content || "" };
    }),
  }));

  if (sections.every((s) => s.pages.length === 0)) {
    return new Response("Aucune page ni média à exporter dans ce cours (phase 1 : Page/Média).", { status: 400 });
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
