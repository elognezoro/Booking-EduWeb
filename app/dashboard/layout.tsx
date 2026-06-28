import { requireUser, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { InstitutionSwitcher } from "@/components/dashboard/institution-switcher";
import { IdleLogout } from "@/components/dashboard/idle-logout";
import { getInactivityLogoutMinutes } from "@/lib/platform/settings";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  const orgFilter = user.organizationId ? { organizationId: user.organizationId } : {};

  // Le super administrateur peut basculer le contexte vers n'importe quelle institution.
  const institutions = isSuperAdmin(user)
    ? await prisma.organization.findMany({ orderBy: [{ isPlatform: "desc" }, { name: "asc" }], select: { id: true, name: true, isPlatform: true } })
    : [];

  const [pending, libraryReview, accountRequests, notifications, unread] = await Promise.all([
    user.permissions.has("bookings.validate")
      ? prisma.booking.count({
          where: { ...orgFilter, status: { in: ["SUBMITTED", "PENDING_VALIDATION"] } },
        })
      : Promise.resolve(0),
    user.permissions.has("documents.review")
      ? prisma.documentResource.count({
          where: { ...orgFilter, status: { in: ["SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION"] } },
        })
      : Promise.resolve(0),
    user.permissions.has("users.manage")
      ? prisma.user.count({ where: isSuperAdmin(user) ? { organizationId: null, status: "ACTIVE" } : { ...orgFilter, status: "PENDING" } })
      : Promise.resolve(0),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.notification.count({ where: { userId: user.id, readAt: null, status: { not: "READ" } } }),
  ]);

  const inactivityMinutes = await getInactivityLogoutMinutes();

  return (
    <DashboardShell
      user={{
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
        imageUrl: user.imageUrl,
        functionTitle: user.functionTitle,
        organizationName: user.organizationName,
        firstName: user.firstName,
        lastName: user.lastName,
      }}
      permissions={Array.from(user.permissions)}
      counts={{ pending, libraryReview, accountRequests }}
      institutionSwitcher={
        institutions.length > 0 ? <InstitutionSwitcher institutions={institutions} activeOrgId={user.organizationId} /> : undefined
      }
      notifications={notifications.map((n) => ({
        id: n.id,
        subject: n.subject,
        content: n.content,
        type: n.type,
        createdAt: n.createdAt.toISOString(),
        read: n.status === "READ" || n.readAt !== null,
      }))}
      unread={unread}
    >
      <IdleLogout minutes={inactivityMinutes} />
      {!user.organizationId && !isSuperAdmin(user) && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-pending/30 bg-pending-soft px-4 py-3 text-sm text-foreground">
          <span className="mt-0.5 text-base">⏳</span>
          <p><strong>Compte confirmé.</strong> Un administrateur va rattacher votre compte à votre établissement ; l'ensemble des fonctionnalités (réservations, ressources, bibliothèque…) sera alors débloqué.</p>
        </div>
      )}
      {children}
    </DashboardShell>
  );
}
