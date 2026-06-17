"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, getCurrentUser, hasPermission, type CurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { COMPETITION_COOKIE, COMPETITION_SLUGS, genCompetitionCode } from "@/lib/games/competition";

const LEVELS = ["facile", "moyen", "difficile"];

async function requireOrganizer(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!hasPermission(user, "platform.manage") && !hasPermission(user, "organization.manage")) redirect("/dashboard?denied=1");
  return user;
}

function canManage(user: CurrentUser, comp: { createdById: string; organizationId: string | null }) {
  return (
    hasPermission(user, "platform.manage") ||
    comp.createdById === user.id ||
    (!!comp.organizationId && comp.organizationId === user.organizationId)
  );
}

export async function createCompetition(formData: FormData) {
  const user = await requireOrganizer();
  const title = String(formData.get("title") || "").trim() || "Compétition";
  const gameSlug = COMPETITION_SLUGS.includes(String(formData.get("gameSlug"))) ? String(formData.get("gameSlug")) : COMPETITION_SLUGS[0];
  const level = LEVELS.includes(String(formData.get("level"))) ? String(formData.get("level")) : "facile";

  let code = genCompetitionCode();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.competition.findUnique({ where: { code } });
    if (!exists) break;
    code = genCompetitionCode();
  }
  const isPlatform = hasPermission(user, "platform.manage");
  const comp = await prisma.competition.create({
    data: { title, gameSlug, level, code, status: "OPEN", createdById: user.id, organizationId: isPlatform ? null : user.organizationId },
  });
  revalidatePath("/dashboard/competitions");
  redirect(`/dashboard/competitions/${comp.id}`);
}

export async function setCompetitionStatus(formData: FormData) {
  const user = await requireOrganizer();
  const id = String(formData.get("id"));
  const status = ["OPEN", "RUNNING", "CLOSED"].includes(String(formData.get("status"))) ? String(formData.get("status")) : "OPEN";
  const comp = await prisma.competition.findUnique({ where: { id } });
  if (comp && canManage(user, comp)) await prisma.competition.update({ where: { id }, data: { status } });
  revalidatePath(`/dashboard/competitions/${id}`);
  redirect(`/dashboard/competitions/${id}`);
}

export async function deleteCompetition(formData: FormData) {
  const user = await requireOrganizer();
  const id = String(formData.get("id"));
  const comp = await prisma.competition.findUnique({ where: { id } });
  if (comp && canManage(user, comp)) await prisma.competition.delete({ where: { id } }).catch(() => {});
  revalidatePath("/dashboard/competitions");
  redirect("/dashboard/competitions");
}

/** Rejoindre une compétition par code (public — compétiteur connecté ou invité). */
export async function joinCompetition(formData: FormData) {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const displayName = String(formData.get("displayName") || "").trim().slice(0, 40);
  const comp = await prisma.competition.findUnique({ where: { code } });
  if (!comp || comp.status === "CLOSED") redirect(`/competition/${code}?error=ferme`);
  const user = await getCurrentUser();
  const name = user ? user.fullName : displayName || "Invité";
  const participant = await prisma.competitionParticipant.create({
    data: { competitionId: comp.id, userId: user?.id ?? null, displayName: name },
  });
  cookies().set(COMPETITION_COOKIE, participant.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  revalidatePath(`/competition/${code}`);
  redirect(`/competition/${code}`);
}

export async function leaveCompetition(formData: FormData) {
  const code = String(formData.get("code") || "").trim();
  cookies().delete(COMPETITION_COOKIE);
  redirect(code ? `/competition/${code}` : "/sport-cerebral");
}
