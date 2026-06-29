import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";

/**
 * Espace formation (LMS) — couche d'accès PROPRE à ce sous-système.
 * Connexion partagée (on réutilise l'identité User), mais rôles 100 % séparés
 * d'EduWeb Booking : rôles « site » (MANAGER/TEACHER) dans LmsRole, rôles « cours »
 * (TEACHER/STUDENT) dans LmsEnrolment. Aucune permission EduWeb Booking n'est consultée ici.
 */

export type LmsCourseRole = "TEACHER" | "STUDENT";

export interface LmsAccess {
  userId: string;
  fullName: string;
  email: string;
  isManager: boolean; // gestionnaire de l'espace formation (voit/gère tout)
  isTeacherSite: boolean; // peut créer des cours
  canCreateCourse: boolean;
}

/** Accès LMS de l'utilisateur connecté (null si non connecté). */
export async function getLmsAccess(): Promise<LmsAccess | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const roles = await prisma.lmsRole.findMany({ where: { userId: user.id }, select: { role: true } });
  const set = new Set(roles.map((r) => r.role));
  const isManager = set.has("MANAGER");
  const isTeacherSite = set.has("TEACHER");
  return {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    isManager,
    isTeacherSite,
    canCreateCourse: isManager || isTeacherSite,
  };
}

/** Exige une session (toute personne connectée peut entrer dans l'espace formation, par défaut apprenant). */
export async function requireLms(): Promise<LmsAccess> {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  return access;
}

/** Noms d'affichage (et e-mails) des apprenants par id — pour l'affichage des remises/notes. */
export async function lmsDisplayNames(ids: string[]): Promise<Map<string, { fullName: string; email: string }>> {
  const uniq = [...new Set(ids)].filter(Boolean);
  if (!uniq.length) return new Map();
  const users = await prisma.user.findMany({ where: { id: { in: uniq } }, select: { id: true, firstName: true, lastName: true, email: true } });
  return new Map(users.map((u) => [u.id, { fullName: `${u.firstName} ${u.lastName}`.trim(), email: u.email }]));
}

/** Rôle de l'utilisateur DANS un cours (enseignant / étudiant), ou null s'il n'y est pas inscrit. */
export async function getCourseRole(userId: string, courseId: string): Promise<LmsCourseRole | null> {
  const e = await prisma.lmsEnrolment.findUnique({
    where: { courseId_userId: { courseId, userId } },
    select: { role: true },
  });
  return (e?.role as LmsCourseRole | undefined) ?? null;
}

/** Peut éditer le cours : gestionnaire du site OU enseignant inscrit au cours. */
export async function canEditCourse(access: LmsAccess | null, courseId: string): Promise<boolean> {
  if (!access) return false;
  if (access.isManager) return true;
  return (await getCourseRole(access.userId, courseId)) === "TEACHER";
}
