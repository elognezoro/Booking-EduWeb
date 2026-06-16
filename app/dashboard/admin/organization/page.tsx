import { Building2, CheckCircle2, Save } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrganization } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function OrganizationAdminPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requirePermission("organization.manage");
  const user = await getCurrentUser();
  const org = await prisma.organization.findUnique({ where: { id: user!.organizationId ?? "" } });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title="Organisation"
        description="Identité et coordonnées de votre organisation."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Building2 className="size-6" /></span>}
      />
      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Modifications enregistrées.
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
        <CardContent>
          <form action={updateOrganization} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name" required>Nom de l'organisation</Label>
              <Input id="name" name="name" defaultValue={org?.name} required />
            </div>
            <div>
              <Label htmlFor="acronym">Sigle</Label>
              <Input id="acronym" name="acronym" defaultValue={org?.acronym ?? ""} placeholder="Ex. ENS" />
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input id="city" name="city" defaultValue={org?.city ?? ""} placeholder="Ex. Abidjan" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea id="address" name="address" defaultValue={org?.address ?? ""} />
            </div>
            <div>
              <Label htmlFor="primaryColor">Couleur principale</Label>
              <div className="flex items-center gap-2">
                <input id="primaryColor" name="primaryColor" type="color" defaultValue={org?.primaryColor ?? "#064B3A"} className="h-10 w-16 cursor-pointer rounded-lg border border-input" />
                <span className="text-sm text-muted-foreground">Utilisée pour la charte de l'organisation.</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg"><Save className="size-4" /> Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
