import { KeyRound, UserCog, CheckCircle2, AlertTriangle, Save, MonitorPlay } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ROLE_META, type RoleKey } from "@/lib/enums";
import { changeOwnPassword } from "@/app/actions/auth";
import { computeMyVisits } from "@/lib/rooms/visit-stats";
import { VISIT_TIME, VISIT_DATE } from "@/lib/rooms/attendance";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon compte — EduWeb Booking" };

export default async function AccountPage({ searchParams }: { searchParams: { changed?: string; error?: string } }) {
  const me = await requireUser();
  const roleLabels = me.roles.map((r) => ROLE_META[r as RoleKey]?.label ?? r).join(", ");
  const visites = await computeMyVisits(me);
  const fmtMin = (min: number) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Mon compte"
        description="Vos informations et votre mot de passe."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><UserCog className="size-6" /></span>}
      />

      <Card>
        <CardContent className="space-y-1 py-5">
          <p className="text-lg font-bold text-foreground">{me.fullName}</p>
          <p className="text-sm text-muted-foreground">{me.email}{me.functionTitle ? ` · ${me.functionTitle}` : ""}</p>
          <p className="text-sm text-muted-foreground">
            {me.organizationName ?? ""}
            {roleLabels ? ` · ${roleLabels}` : ""}
          </p>
        </CardContent>
      </Card>

      {/* Statistiques personnelles du registre des salles multimédias (émargement QR) */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MonitorPlay className="size-4 text-primary" /> Mes passages en salles multimédias</CardTitle></CardHeader>
        <CardContent>
          {visites.total === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun passage enregistré pour le moment. À votre prochaine visite d'une salle multimédia, flashez le QR code
              affiché à l'entrée : votre présence sera comptabilisée ici automatiquement.
            </p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-secondary/40 p-3 text-center">
                  <p className="text-2xl font-extrabold text-foreground">{visites.total}</p>
                  <p className="text-xs text-muted-foreground">passage{visites.total > 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/40 p-3 text-center">
                  <p className="text-2xl font-extrabold text-foreground">{fmtMin(visites.totalMinutes)}</p>
                  <p className="text-xs text-muted-foreground">temps de présence</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/40 p-3 text-center">
                  <p className="truncate text-lg font-extrabold text-foreground">{visites.topSalle ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">salle la plus fréquentée</p>
                </div>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {visites.last.map((v, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <span className="font-semibold text-foreground">{v.salle}</span>
                    <span className="text-xs text-muted-foreground">
                      {VISIT_DATE.format(v.arrivedAt)} · {VISIT_TIME.format(v.arrivedAt)}
                      {v.leftAt ? ` → ${VISIT_TIME.format(v.leftAt)} (${fmtMin(v.minutes ?? 0)})` : " "}
                      {!v.leftAt && <Badge tone="available" dot>en salle</Badge>}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><KeyRound className="size-4 text-primary" /> Changer mon mot de passe</CardTitle></CardHeader>
        <CardContent>
          {searchParams.changed && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
              <CheckCircle2 className="size-5" /> Mot de passe modifié avec succès.
            </div>
          )}
          {searchParams.error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
              <AlertTriangle className="size-5" /> {searchParams.error}
            </div>
          )}
          <form action={changeOwnPassword} className="space-y-3">
            <div><Label htmlFor="current" required>Mot de passe actuel</Label><PasswordInput id="current" name="current" required autoComplete="current-password" /></div>
            <div><Label htmlFor="password" required>Nouveau mot de passe</Label><PasswordInput id="password" name="password" required minLength={8} autoComplete="new-password" /></div>
            <div><Label htmlFor="confirm" required>Confirmer le nouveau mot de passe</Label><PasswordInput id="confirm" name="confirm" required autoComplete="new-password" /></div>
            <Button type="submit"><Save className="size-4" /> Mettre à jour le mot de passe</Button>
            <p className="text-xs text-muted-foreground">Au moins 8 caractères. Choisissez un mot de passe fort et unique.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
