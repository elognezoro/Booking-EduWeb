import Link from "next/link";
import { CreditCard, Check, Users, Boxes, CalendarDays } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLAN_LABELS, type Plan } from "@/lib/enums";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  await requirePermission("organization.manage");
  const user = await getCurrentUser();
  const organizationId = user!.organizationId ?? "";

  const [subscription, userCount, resourceCount, bookingCount] = await Promise.all([
    prisma.subscription.findUnique({ where: { organizationId } }),
    prisma.user.count({ where: { organizationId } }),
    prisma.resource.count({ where: { organizationId } }),
    prisma.booking.count({ where: { organizationId } }),
  ]);

  const plan = (subscription?.plan ?? "PILOTE") as Plan;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title="Abonnement"
        description="Votre formule EduWeb Booking et son utilisation."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><CreditCard className="size-6" /></span>}
      />

      <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-glow">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="mb-2 bg-white/15 text-white ring-0">Formule actuelle</Badge>
            <h2 className="text-3xl font-extrabold">Plan {PLAN_LABELS[plan]}</h2>
            <p className="text-primary-foreground/80">{subscription?.seats ?? 0} comptes autorisés · statut {subscription?.status ?? "ACTIVE"}</p>
            {subscription?.renewsAt && <p className="mt-1 text-sm text-primary-foreground/70">Renouvellement le {fmtDate(subscription.renewsAt)}</p>}
          </div>
          <Button asChild variant="white"><Link href="/pricing">Changer de formule</Link></Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[{ i: Users, n: userCount, l: "Utilisateurs", max: subscription?.seats }, { i: Boxes, n: resourceCount, l: "Ressources" }, { i: CalendarDays, n: bookingCount, l: "Réservations" }].map((k) => (
          <Card key={k.l}>
            <CardContent className="py-5 text-center">
              <k.i className="mx-auto size-5 text-primary" />
              <p className="mt-2 text-2xl font-extrabold text-foreground">{k.n}{k.max ? <span className="text-base text-muted-foreground">/{k.max}</span> : null}</p>
              <p className="text-sm text-muted-foreground">{k.l}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Inclus dans votre formule</CardTitle></CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {["Ressources illimitées", "Calendrier multi-vues", "Workflows de validation", "Notifications e-mail", "Statistiques & rapports", "Rôles & permissions"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-available-soft text-available-fg"><Check className="size-3" /></span>{f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
