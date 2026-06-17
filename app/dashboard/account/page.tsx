import { KeyRound, UserCog, CheckCircle2, AlertTriangle, Save } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_META, type RoleKey } from "@/lib/enums";
import { changeOwnPassword } from "@/app/actions/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon compte — EduWeb Booking" };

export default async function AccountPage({ searchParams }: { searchParams: { changed?: string; error?: string } }) {
  const me = await requireUser();
  const roleLabels = me.roles.map((r) => ROLE_META[r as RoleKey]?.label ?? r).join(", ");

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
            <div><Label htmlFor="current" required>Mot de passe actuel</Label><Input id="current" name="current" type="password" required autoComplete="current-password" /></div>
            <div><Label htmlFor="password" required>Nouveau mot de passe</Label><Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" /></div>
            <div><Label htmlFor="confirm" required>Confirmer le nouveau mot de passe</Label><Input id="confirm" name="confirm" type="password" required autoComplete="new-password" /></div>
            <Button type="submit"><Save className="size-4" /> Mettre à jour le mot de passe</Button>
            <p className="text-xs text-muted-foreground">Au moins 8 caractères. Choisissez un mot de passe fort et unique.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
