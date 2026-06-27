import { ShieldCheck, CheckCircle2, Save, LogOut } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInactivityLogoutMinutes } from "@/lib/platform/settings";
import { saveInactivityLogout } from "@/app/actions/platform";

export const dynamic = "force-dynamic";

export default async function PlatformSecurityPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requirePermission("platform.manage");
  const minutes = await getInactivityLogoutMinutes();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title="Sécurité & sessions"
        description="Paramètres de sécurité appliqués à toutes les institutions de la plateforme."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><ShieldCheck className="size-6" /></span>}
      />
      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Paramètres enregistrés.
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LogOut className="size-5 text-advanced-fg" /> Déconnexion automatique après inactivité</CardTitle></CardHeader>
        <CardContent>
          <form action={saveInactivityLogout} className="space-y-4">
            <div>
              <Label htmlFor="minutes">Délai d'inactivité (minutes)</Label>
              <Input id="minutes" name="minutes" type="number" min={0} max={480} step={1} defaultValue={minutes} className="max-w-[180px]" />
              <p className="mt-1.5 text-sm text-muted-foreground">
                Tout compte inactif pendant cette durée est automatiquement déconnecté (un avertissement s'affiche juste avant).
                <strong> 0 = désactivé</strong> (aucune déconnexion automatique). Maximum&nbsp;480&nbsp;(8&nbsp;h).
              </p>
            </div>
            <div>
              <Button type="submit" size="lg"><Save className="size-4" /> Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
