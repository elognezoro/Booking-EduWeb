import { Building2, CheckCircle2, Save, MapPin, AlertTriangle } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CertificateImageUpload } from "@/components/certificates/image-upload";
import { CampusPerimeterFields } from "@/components/admin/campus-perimeter-field";
import { updateOrganization, updateCampusPerimeter } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function OrganizationAdminPage({ searchParams }: { searchParams: { saved?: string; error?: string } }) {
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
      {searchParams.error === "campus" && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" /> Coordonnées du périmètre invalides : renseignez latitude ET longitude (ou videz les deux champs).
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
            <div className="sm:col-span-2">
              <CertificateImageUpload name="logoUrl" label="Logo de l'institution" initial={org?.logoUrl} hint="PNG/JPEG/WebP. Affiché à la place du sigle dans le sélecteur d'institutions." />
            </div>
            <div>
              <Label htmlFor="primaryColor">Couleur principale</Label>
              <div className="flex items-center gap-2">
                <input id="primaryColor" name="primaryColor" type="color" defaultValue={org?.primaryColor ?? "#064B3A"} className="h-10 w-16 cursor-pointer rounded-lg border border-input" />
                <span className="text-sm text-muted-foreground">Utilisée pour la charte de l'organisation.</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton size="lg" pendingLabel="Enregistrement…"><Save className="size-4" /> Enregistrer</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Périmètre géographique institutionnel — anti-fraude du pointage des salles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Périmètre géographique (pointage des salles)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            L'ouverture et la fermeture des salles multimédias par les surveillants exigent leur position GPS. Une fois le
            point de référence du campus et le rayon définis ici, toute tentative <strong className="text-foreground">hors de cette
            zone sera refusée et consignée</strong>.
          </p>
          {org?.campusLat == null && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-pending/30 bg-pending-soft px-4 py-3 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p><strong>Périmètre non défini :</strong> la position des surveillants est enregistrée mais aucune tentative hors zone
              n'est encore refusée. Définissez le point de référence pour activer le blocage anti-fraude.</p>
            </div>
          )}
          <form action={updateCampusPerimeter} className="space-y-4">
            <CampusPerimeterFields initial={{ lat: org?.campusLat ?? null, lng: org?.campusLng ?? null, radiusM: org?.campusRadiusM ?? null }} />
            <SubmitButton pendingLabel="Enregistrement…"><Save className="size-4" /> Enregistrer le périmètre</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
