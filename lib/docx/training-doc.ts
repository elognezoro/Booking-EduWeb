import { Packer, Table } from "docx";
import { ROLE_GUIDES } from "@/lib/guides";
import { ROLE_META } from "@/lib/enums";
import { ROLE_PERMISSIONS, PERMISSION_LABELS, PERMISSIONS, type Permission } from "@/lib/permissions";
import { TRAINING_CONTENT } from "@/lib/training-content";
import { roleWrappers, ROLE_TRAINING_ORDER, ROLE_FAMILIES } from "@/lib/training";
import { buildDocument, coverParagraphs, loadLogo, h1, h2, h3, body, callout, bullet, step, sub, label, simpleTable, spacer } from "./common";

const ABCD = ["A", "B", "C", "D", "E", "F"];
type Node = ReturnType<typeof body> | Table;

/** Construit le document Word du support de formation complet (équivalent de /guides/formation). */
export async function buildTrainingDocx(): Promise<Buffer> {
  const logo = loadLogo();
  const c = TRAINING_CONTENT;
  const wrappers = roleWrappers(c);
  const out: Node[] = [];

  /* -------- Partie I — Présentation & cadre -------- */
  out.push(h1("Partie I — Présentation & cadre général"));
  for (const b of c.apercu.presentation) {
    out.push(h3(b.titre));
    out.push(body(b.texte));
  }
  out.push(h2("Périmètre fonctionnel"));
  for (const p of c.apercu.perimetre) out.push(bullet(p));
  out.push(h2("Lexique"));
  for (const g of c.apercu.glossaire) out.push(label(g.terme, g.definition));

  /* -------- Partie II — Syllabus -------- */
  out.push(h1("Partie II — Syllabus de la formation"));
  out.push(callout(c.syllabus.intitule));
  out.push(label("Durée totale", c.syllabus.duree));
  out.push(h3("Public cible"));
  for (const p of c.syllabus.publicCible) out.push(bullet(p));
  out.push(h3("Prérequis"));
  for (const p of c.syllabus.prerequis) out.push(bullet(p));
  out.push(h3("Finalité"));
  out.push(callout(c.syllabus.finalite));
  out.push(h3("Objectifs pédagogiques généraux"));
  for (const o of c.syllabus.objectifsGeneraux) out.push(bullet(`[${o.niveauBloom}] ${o.objectif}`));
  out.push(h3("Compétences visées"));
  for (const cmp of c.syllabus.competences) out.push(bullet(cmp));
  out.push(h3("Volume horaire indicatif"));
  out.push(simpleTable(["Élément", "Durée"], c.syllabus.volumeHoraire.map((v) => [v.label, v.valeur])));
  out.push(spacer());
  out.push(h3("Modalités"));
  for (const m of c.syllabus.modalites) out.push(bullet(m));
  out.push(h3("Méthodes pédagogiques"));
  for (const m of c.syllabus.methodes) out.push(bullet(m));
  out.push(h3("Moyens & ressources"));
  for (const m of c.syllabus.moyens) out.push(bullet(m));
  out.push(h3("Dispositif d'évaluation"));
  for (const e of c.syllabus.evaluation) out.push(bullet(`${e.type} — ${e.description}`));
  out.push(h3("Critères de réussite"));
  for (const cr of c.syllabus.criteresReussite) out.push(bullet(cr));

  /* -------- Partie III — Architecture & parcours -------- */
  out.push(h1("Partie III — Architecture & parcours"));
  out.push(body("La formation s'organise en un tronc commun (modules T1 à T3, suivis par tous les profils) puis un module métier propre à chaque rôle."));
  out.push(
    simpleTable(
      ["Famille", "Rôles concernés", "Parcours"],
      ROLE_FAMILIES.map((f) => [f.famille, f.roles.map((r) => ROLE_META[r].label).join(", "), "Tronc commun (T1–T3) + module métier"]),
    ),
  );

  /* -------- Partie IV — Tronc commun -------- */
  out.push(h1("Partie IV — Tronc commun"));
  for (const m of c.modulesCommuns.modules) {
    out.push(h2(`${m.code} — ${m.titre}`));
    out.push(label("Public", m.public));
    out.push(label("Durée", m.duree));
    if (m.prerequis.length) out.push(label("Prérequis", m.prerequis.join(" · ")));
    out.push(h3("Objectifs pédagogiques"));
    for (const o of m.objectifs) out.push(bullet(o));
    out.push(h3("Compétences visées"));
    for (const cmp of m.competences) out.push(bullet(cmp));
    out.push(h3("Déroulé"));
    for (const d of m.deroule) {
      out.push(body(`• ${d.titre}`));
      d.points.forEach((pt) => out.push(sub(pt)));
    }
    out.push(h3("Atelier pratique"));
    for (const a of m.atelier) out.push(bullet(a));
    out.push(h3("Évaluation du module"));
    for (const e of m.evaluation) out.push(bullet(e));
  }

  /* -------- Partie V — Modules par rôle -------- */
  out.push(h1("Partie V — Modules de formation par rôle"));
  ROLE_TRAINING_ORDER.forEach((role, idx) => {
    const guide = ROLE_GUIDES[role];
    const w = wrappers[role];
    if (!guide || !w) return;
    out.push(h2(`M${idx + 1} — ${guide.title}`));
    out.push(label("Public", ROLE_META[role].label));
    out.push(label("Durée", w.duree));
    if (w.prerequis.length) out.push(label("Prérequis", w.prerequis.join(" · ")));
    out.push(h3("Objectifs pédagogiques"));
    for (const o of w.objectifs) out.push(bullet(o));
    out.push(h3("Compétences visées"));
    for (const cmp of w.competences) out.push(bullet(cmp));
    out.push(h3("Déroulé détaillé"));
    out.push(body(guide.intro));
    guide.sections.forEach((s) => {
      out.push(body(`• ${s.title}`));
      s.steps.forEach((st, i) => out.push(step(i + 1, st)));
    });
    out.push(h3("Atelier pratique"));
    for (const a of w.atelier) out.push(bullet(a));
    out.push(h3("Évaluation du module"));
    for (const e of w.evaluation) out.push(bullet(e));
  });

  /* -------- Partie VI — Évaluation & QCM -------- */
  out.push(h1("Partie VI — Évaluation & validation des acquis"));
  out.push(body("Évaluation sommative par questionnaire à choix multiples (une seule bonne réponse par question). Seuil de réussite recommandé : 70 % de bonnes réponses. Le corrigé figure à la fin de chaque thème."));
  c.qcm.banques.forEach((bank, bi) => {
    out.push(h2(`Thème ${bi + 1} — ${bank.theme}`));
    bank.questions.forEach((q, qi) => {
      out.push(body(`${qi + 1}. ${q.enonce}`));
      q.options.forEach((opt, oi) => out.push(sub(`${ABCD[oi]}. ${opt}`)));
    });
    out.push(h3(`Corrigé — ${bank.theme}`));
    bank.questions.forEach((q, qi) => out.push(bullet(`${qi + 1}. ${ABCD[q.bonneReponse] ?? "?"} — ${q.justification}`)));
  });

  /* -------- Partie VII — Annexes -------- */
  out.push(h1("Partie VII — Annexes"));

  out.push(h2("Annexe A — Matrice des rôles et permissions"));
  out.push(body("Permissions effectivement accordées à chaque rôle dans l'application."));
  for (const role of ROLE_TRAINING_ORDER) {
    const perms = (PERMISSIONS as readonly Permission[]).filter((p) => ROLE_PERMISSIONS[role].includes(p));
    out.push(h3(`${ROLE_META[role].label} (${perms.length})`));
    out.push(body(perms.map((p) => PERMISSION_LABELS[p]).join(" · ")));
  }

  out.push(h2("Annexe B — Imports par fichier CSV"));
  for (const m of c.annexes.importCsv) {
    out.push(h3(m.fichier));
    out.push(label("Colonnes", m.colonnes.join(", ")));
    m.etapes.forEach((e, i) => out.push(step(i + 1, e)));
  }

  out.push(h2("Annexe C — Gestion du mot de passe"));
  for (const p of c.annexes.motDePasse) {
    out.push(h3(p.scenario));
    p.etapes.forEach((e, i) => out.push(step(i + 1, e)));
  }

  out.push(h2("Annexe D — Dépannage & questions fréquentes"));
  for (const f of c.annexes.depannage) {
    out.push(body(`• ${f.probleme}`));
    out.push(callout(f.solution));
  }

  out.push(h2("Annexe E — Fiche formateur (session type)"));
  out.push(simpleTable(["Phase", "Durée", "Activité"], c.annexes.ficheFormateur.deroule.map((d) => [d.phase, d.duree, d.activite])));
  out.push(spacer());
  out.push(h3("Conseils d'animation"));
  for (const cseil of c.annexes.ficheFormateur.conseils) out.push(bullet(cseil));
  out.push(h3("Matériel requis"));
  for (const mat of c.annexes.ficheFormateur.materiel) out.push(bullet(mat));

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const cover = coverParagraphs(logo, {
    kicker: "Support de formation",
    title: "EduWeb Booking",
    subtitle: "Manuel de formation des utilisateurs",
    description: c.syllabus.finalite,
    meta: [`Document généré le ${today}`, "Édition pilote — ENS d'Abidjan, Côte d'Ivoire"],
  });

  const doc = buildDocument({ docLabel: "EduWeb Booking — Manuel de formation", cover, body: out });
  return Packer.toBuffer(doc);
}
