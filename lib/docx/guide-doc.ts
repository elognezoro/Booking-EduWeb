import { Packer } from "docx";
import { ROLE_GUIDES, type RoleGuide } from "@/lib/guides";
import { ACCOUNT_SECTION } from "@/lib/guide-account-section";
import { ROLE_META, type RoleKey } from "@/lib/enums";
import { buildDocument, coverParagraphs, loadLogo, h1, h2, h3, body, callout, bullet, step } from "./common";

/** Construit le document Word des guides par rôle (équivalent de /guides/print). */
export async function buildGuideDocx(roles: RoleKey[], opts: { userName?: string; orgName?: string }): Promise<Buffer> {
  const logo = loadLogo();
  const valid = roles.filter((r) => r in ROLE_GUIDES);
  const body_: ReturnType<typeof body>[] = [];

  for (const role of valid) {
    const guide: RoleGuide = ROLE_GUIDES[role];
    body_.push(h1(guide.title));
    if (ROLE_META[role]) body_.push(body(`Rôle : ${ROLE_META[role].label}`));
    body_.push(callout(guide.intro));

    body_.push(h2("Ce que vous pouvez faire"));
    for (const c of guide.can) body_.push(bullet(c));

    body_.push(h2("Démarche pas à pas"));
    for (const section of [...guide.sections, ACCOUNT_SECTION]) {
      body_.push(h3(section.title));
      section.steps.forEach((s, i) => body_.push(step(i + 1, s)));
    }
  }

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const cover = coverParagraphs(logo, {
    kicker: "Guide d'utilisation",
    title: "EduWeb Booking",
    subtitle: valid.length > 1 ? "Guides par rôle" : ROLE_META[valid[0]]?.label ?? "Guide par rôle",
    description: [opts.userName, opts.orgName].filter(Boolean).join(" · ") || undefined,
    meta: [`Document généré le ${today}`, "Plateforme intelligente de réservation des ressources & bibliothèque numérique"],
  });

  const doc = buildDocument({ docLabel: "EduWeb Booking — Guide d'utilisation", cover, body: body_ });
  return Packer.toBuffer(doc);
}
