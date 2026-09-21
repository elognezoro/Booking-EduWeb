"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission, hashPassword, type CurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { isEnsMatricule } from "@/lib/utils";
import { parseCsv, findColumn, normalizeKey } from "@/lib/csv";
import { ENS_DEPARTMENTS } from "@/lib/finances/ens-academics";
import { DEMO_STUDENTS } from "@/lib/finances/demo-students";
import { currentAcademicYear, nextAcademicYear, normalizeAcademicYear } from "@/lib/scolarite/constants";

/*
 * Actions du module Scolarité / Enrôlement.
 * Toutes exigent la permission `scolarite.manage` et sont bornées à l'institution
 * de l'utilisateur ; chaque opération sensible est tracée dans le journal d'audit
 * (actions SCOLARITE_*, consultation réservée à l'administrateur système).
 */

const BASE = "/dashboard/scolarite";

async function requireScolarite(): Promise<CurrentUser & { organizationId: string }> {
  const user = await requirePermission("scolarite.manage");
  if (!user.organizationId) redirect("/dashboard?denied=1");
  return user as CurrentUser & { organizationId: string };
}

const txt = (v: unknown, max = 160): string => String(v ?? "").trim().slice(0, max);
const email = (v: unknown): string | null => {
  const s = String(v ?? "").trim().toLowerCase().slice(0, 160);
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) ? s : null;
};
const yearOf = (v: unknown): number => (Number(v) === 2 ? 2 : 1);

/** Rapproche un intitulé libre d'un département/section du référentiel ENS (insensible aux accents). */
function matchAcademic(rawDept: string, rawSection: string): { department: string; section: string } {
  const nd = normalizeKey(rawDept);
  const dept = ENS_DEPARTMENTS.find((d) => {
    const n = normalizeKey(d.name);
    return n === nd || n.includes(nd) || nd.includes(n.replace("departement ", "").replace("departement des ", ""));
  });
  const department = dept?.name ?? rawDept.trim();
  const ns = normalizeKey(rawSection);
  const section =
    dept?.sections.find((s) => {
      const n = normalizeKey(s);
      return n === ns || n.includes(ns) || ns.includes(n);
    }) ?? rawSection.trim();
  return { department, section: section || (dept?.sections.length === 1 ? dept.sections[0] : rawSection.trim()) };
}

/* ----------------------------- Fiche étudiant ----------------------------- */

export async function createStudent(formData: FormData) {
  const user = await requireScolarite();
  const fullName = txt(formData.get("fullName"), 120);
  const department = txt(formData.get("department"), 120);
  // Discipline/spécialité optionnelle : certaines filières (Éducateurs, Inspecteurs…) n'en ont pas.
  const section = txt(formData.get("section"), 120);
  if (!fullName || !department) redirect(`${BASE}?error=invalide`);

  let matricule: string | null = null;
  const rawMat = txt(formData.get("matricule"), 40).toUpperCase();
  if (rawMat) {
    if (!isEnsMatricule(rawMat)) redirect(`${BASE}?error=matricule`);
    const dup = await prisma.student.findFirst({ where: { organizationId: user.organizationId, matricule: rawMat } });
    if (dup) redirect(`${BASE}?error=matricule-existe`);
    matricule = rawMat;
  }

  const student = await prisma.student.create({
    data: {
      organizationId: user.organizationId,
      fullName,
      matricule,
      department,
      section,
      year: yearOf(formData.get("year")),
      academicYear: normalizeAcademicYear(formData.get("academicYear")),
      tdGroup: txt(formData.get("tdGroup"), 20).toUpperCase() || null,
      email: email(formData.get("email")),
      phone: txt(formData.get("phone"), 30) || null,
    },
  });
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_STUDENT_CREATE",
    entityType: "Student",
    entityId: student.id,
    newValue: { fullName, matricule, department, section, year: student.year, academicYear: student.academicYear },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?created=1`);
}

export async function deleteStudent(formData: FormData) {
  const user = await requireScolarite();
  const id = txt(formData.get("id"));
  const s = await prisma.student.findFirst({ where: { id, organizationId: user.organizationId } });
  if (!s) redirect(`${BASE}?error=introuvable`);
  await prisma.student.delete({ where: { id: s.id } });
  // Traçabilité : instantané complet de la fiche supprimée.
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_STUDENT_DELETE",
    entityType: "Student",
    entityId: s.id,
    oldValue: {
      fullName: s.fullName, matricule: s.matricule, department: s.department, section: s.section,
      year: s.year, academicYear: s.academicYear, status: s.status, email: s.email, demo: s.demo,
    },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?deleted=1`);
}

/* ----------------------------- Passage d'année ----------------------------- */

/** Promotion individuelle : 1ʳᵉ année → 2ᵉ année ; 2ᵉ année → Diplômé. */
export async function promoteStudent(formData: FormData) {
  const user = await requireScolarite();
  const id = txt(formData.get("id"));
  const s = await prisma.student.findFirst({ where: { id, organizationId: user.organizationId, status: "ACTIVE" } });
  if (!s) redirect(`${BASE}?error=introuvable`);
  const data = s.year === 1 ? { year: 2 } : { status: "DIPLOME" };
  await prisma.student.update({ where: { id: s.id }, data });
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_STUDENT_PROMOTE",
    entityType: "Student",
    entityId: s.id,
    newValue: { fullName: s.fullName, matricule: s.matricule, de: `${s.year === 1 ? "Première" : "Deuxième"} année`, vers: s.year === 1 ? "Deuxième année" : "Diplômé" },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?promoted=1`);
}

/** Passage d'année en masse (clôture de campagne) : les 2ᵉ année deviennent Diplômés, les 1ʳᵉ passent en 2ᵉ. */
export async function promoteAllStudents(formData: FormData) {
  const user = await requireScolarite();
  const target = normalizeAcademicYear(formData.get("academicYear") || nextAcademicYear(currentAcademicYear()));
  const [graduated, promoted] = await prisma.$transaction(async (tx) => {
    const g = await tx.student.updateMany({
      where: { organizationId: user.organizationId, status: "ACTIVE", year: 2 },
      data: { status: "DIPLOME" },
    });
    const p = await tx.student.updateMany({
      where: { organizationId: user.organizationId, status: "ACTIVE", year: 1 },
      data: { year: 2, academicYear: target },
    });
    return [g.count, p.count];
  });
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_PROMOTE_ALL",
    entityType: "Student",
    newValue: { diplomes: graduated, passages: promoted, academicYear: target },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?graduated=${graduated}&promotedall=${promoted}`);
}

/* ----------------------------- Import CSV & démo ----------------------------- */

export async function importStudentsCsv(formData: FormData) {
  const user = await requireScolarite();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect(`${BASE}?error=csv`);
  const rows = parseCsv(await file.text());
  if (rows.length < 2) redirect(`${BASE}?error=csv`);
  const header = rows[0];
  const iName = findColumn(header, ["nom", "nom complet", "nom_complet", "etudiant", "étudiant", "name", "fullname"]);
  const iMat = findColumn(header, ["matricule", "numero", "n°", "identifiant", "id"]);
  const iDept = findColumn(header, ["departement", "département", "dept"]);
  const iSec = findColumn(header, ["section", "filiere", "filière", "section/filiere", "section / filière"]);
  const iYear = findColumn(header, ["annee", "année", "year", "niveau"]);
  const iMail = findColumn(header, ["email", "e-mail", "mail", "courriel"]);
  const iTd = findColumn(header, ["td", "groupe", "groupe td", "groupe de td"]);
  if (iName < 0 || iDept < 0) redirect(`${BASE}?error=colonnes`);

  const academicYear = normalizeAcademicYear(formData.get("academicYear"));
  // Doublons : matricules déjà enregistrés dans l'institution + doublons internes au fichier.
  const existing = new Set(
    (
      await prisma.student.findMany({
        where: { organizationId: user.organizationId, matricule: { not: null } },
        select: { matricule: true },
      })
    ).map((s) => s.matricule as string)
  );
  let skipped = 0;
  const data: {
    organizationId: string; fullName: string; matricule: string | null;
    department: string; section: string; year: number; academicYear: string; email: string | null;
    tdGroup: string | null;
  }[] = [];
  for (const row of rows.slice(1)) {
    const fullName = (row[iName] ?? "").trim().slice(0, 120);
    if (!fullName) continue;
    const matricule = iMat >= 0 ? (row[iMat] ?? "").trim().slice(0, 40).toUpperCase() || null : null;
    if (matricule && existing.has(matricule)) {
      skipped++;
      continue;
    }
    if (matricule) existing.add(matricule);
    const { department, section } = matchAcademic((row[iDept] ?? "").trim(), iSec >= 0 ? (row[iSec] ?? "").trim() : "");
    data.push({
      organizationId: user.organizationId,
      fullName,
      matricule,
      department: department.slice(0, 120),
      section: section.slice(0, 120), // "" = filière sans discipline
      year: iYear >= 0 ? yearOf((row[iYear] ?? "").trim()) : 1,
      academicYear,
      email: iMail >= 0 ? email(row[iMail]) : null,
      tdGroup: iTd >= 0 ? (row[iTd] ?? "").trim().slice(0, 20).toUpperCase() || null : null,
    });
  }
  if (data.length === 0 && skipped === 0) redirect(`${BASE}?error=csv`);
  if (data.length > 0) await prisma.student.createMany({ data });
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_STUDENTS_IMPORT",
    entityType: "Student",
    newValue: { count: data.length, ignores: skipped, fichier: file.name, academicYear },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?imported=${data.length}&skipped=${skipped}`);
}

/** Fiches FICTIVES de démonstration (44, réparties 1ʳᵉ/2ᵉ année) — purgeables avant l'enrôlement réel. */
export async function seedDemoStudents(formData: FormData) {
  void formData;
  const user = await requireScolarite();
  const already = await prisma.student.count({ where: { organizationId: user.organizationId, demo: true } });
  if (already > 0) redirect(`${BASE}?error=demoexiste`);
  const academicYear = currentAcademicYear();
  try {
    await prisma.student.createMany({
      data: DEMO_STUDENTS.map((s, i) => ({
        organizationId: user.organizationId,
        fullName: s.fullName,
        matricule: s.matricule,
        department: s.department,
        section: s.section,
        year: (i % 2) + 1, // répartition : moitié Première année, moitié Deuxième année
        academicYear,
        demo: true,
      })),
    });
  } catch {
    redirect(`${BASE}?error=doublon`);
  }
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_STUDENTS_DEMO",
    entityType: "Student",
    newValue: { count: DEMO_STUDENTS.length, academicYear },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?demo=${DEMO_STUDENTS.length}`);
}

/** Suppression en masse : mode "demo" (fiches fictives) ou "all" (tout l'enrôlement de l'institution). */
export async function deleteStudentsBulk(formData: FormData) {
  const user = await requireScolarite();
  const mode = formData.get("mode") === "all" ? "all" : "demo";
  const res = await prisma.student.deleteMany({
    where: { organizationId: user.organizationId, ...(mode === "demo" ? { demo: true } : {}) },
  });
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_STUDENTS_DELETE",
    entityType: "Student",
    oldValue: { mode, count: res.count },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?deleted=${res.count}`);
}

/* ----------------------------- Compte de connexion ----------------------------- */

/** Crée (ou relie) le compte de connexion d'un étudiant à partir de son e-mail (rôle READER, mdp initial password123). */
export async function createStudentAccount(formData: FormData) {
  const user = await requireScolarite();
  const id = txt(formData.get("id"));
  const s = await prisma.student.findFirst({ where: { id, organizationId: user.organizationId } });
  if (!s) redirect(`${BASE}?error=introuvable`);
  if (s.userId) redirect(`${BASE}?error=compte-deja`);
  if (!s.email) redirect(`${BASE}?error=email-manquant`);

  const existing = await prisma.user.findUnique({ where: { email: s.email } });
  if (existing) {
    if (existing.organizationId && existing.organizationId !== user.organizationId) redirect(`${BASE}?error=email-autre-org`);
    await prisma.student.update({ where: { id: s.id }, data: { userId: existing.id } });
    await audit({
      organizationId: user.organizationId,
      userId: user.id,
      action: "SCOLARITE_ACCOUNT_LINK",
      entityType: "Student",
      entityId: s.id,
      newValue: { fullName: s.fullName, to: s.email },
    });
    revalidatePath(BASE);
    redirect(`${BASE}?account=1`);
  }

  // Nom de famille en tête (convention « KOUASSI Aya ») ; repli robuste sinon.
  const parts = s.fullName.trim().split(/\s+/);
  const lastName = parts[0] ?? s.fullName;
  const firstName = parts.slice(1).join(" ") || lastName;
  const role = await prisma.role.findFirst({
    where: { key: "READER", OR: [{ organizationId: user.organizationId }, { organizationId: null }] },
  });
  const created = await prisma.user.create({
    data: {
      email: s.email,
      firstName,
      lastName,
      functionTitle: "Étudiant(e)",
      matricule: s.matricule,
      organizationId: user.organizationId,
      status: "ACTIVE",
      passwordHash: await hashPassword("password123"),
      roles: role ? { create: { roleId: role.id } } : undefined,
    },
  });
  await prisma.student.update({ where: { id: s.id }, data: { userId: created.id } });
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "SCOLARITE_ACCOUNT_CREATE",
    entityType: "Student",
    entityId: s.id,
    newValue: { fullName: s.fullName, to: s.email, matricule: s.matricule },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?account=1`);
}
