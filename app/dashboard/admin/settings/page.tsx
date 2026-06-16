import { Settings, CheckCircle2, Save } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

const DAYS = [["MON", "Lun"], ["TUE", "Mar"], ["WED", "Mer"], ["THU", "Jeu"], ["FRI", "Ven"], ["SAT", "Sam"], ["SUN", "Dim"]];

export default async function SettingsAdminPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requirePermission("settings.manage");
  const user = await getCurrentUser();
  const settings = await prisma.organizationSetting.findUnique({ where: { organizationId: user!.organizationId ?? "" } });

  const workingDays = parseJson<string[]>(settings?.workingDays, ["MON", "TUE", "WED", "THU", "FRI"]);
  const hours = parseJson<{ start: string; end: string }>(settings?.openingHours, { start: "07:30", end: "19:00" });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title="Paramètres"
        description="Configurez les règles générales de réservation de votre organisation."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Settings className="size-6" /></span>}
      />
      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Paramètres enregistrés.
        </div>
      )}

      <form action={updateSettings} className="space-y-5">
        <Card>
          <CardHeader><CardTitle>Général</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="language">Langue</Label>
              <Select id="language" name="language" defaultValue={settings?.language ?? "fr"}>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select id="timezone" name="timezone" defaultValue={settings?.timezone ?? "Africa/Abidjan"}>
                <option value="Africa/Abidjan">Africa/Abidjan (GMT)</option>
                <option value="Europe/Paris">Europe/Paris</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Horaires d'ouverture</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="openStart">Ouverture</Label><Input id="openStart" name="openStart" type="time" defaultValue={hours.start} /></div>
              <div><Label htmlFor="openEnd">Fermeture</Label><Input id="openEnd" name="openEnd" type="time" defaultValue={hours.end} /></div>
            </div>
            <div>
              <Label>Jours ouvrés</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(([key, label]) => (
                  <label key={key} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary-50">
                    <input type="checkbox" name={`day_${key}`} defaultChecked={workingDays.includes(key)} className="size-4 rounded border-input text-primary focus:ring-ring" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Validation</CardTitle></CardHeader>
          <CardContent>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="allowAutoValidation" defaultChecked={settings?.allowAutoValidation ?? false} className="size-4 rounded border-input text-primary focus:ring-ring" />
              <span className="text-sm font-medium text-foreground">Autoriser la validation automatique lorsque la ressource est disponible</span>
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end"><Button type="submit" size="lg"><Save className="size-4" /> Enregistrer les paramètres</Button></div>
      </form>
    </div>
  );
}
