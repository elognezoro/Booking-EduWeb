import Link from "next/link";
import { Building2, Plus, CheckCircle2, AlertTriangle, Users, Boxes, CalendarDays, Power, Save, ArrowLeft, Upload, Download, Trash2 } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { ConfirmActionButton } from "@/components/confirm-action";
import { MinistrySelect } from "@/components/platform/ministry-select";
import { CreateInstitutionForm } from "@/components/platform/create-institution-form";
import { PLAN_LABELS, type Plan } from "@/lib/enums";
import { fmtDate } from "@/lib/dates";
import { updateSubscription, setOrganizationStatus, importInstitutionsCsv, deleteOrganization } from "@/app/actions/platform";

export const dynamic = "force-dynamic";

const PLANS: Plan[] = ["PILOTE", "STANDARD", "PREMIUM", "NATIONAL"];
const SUB_STATUS: { key: string; label: string }[] = [
  { key: "ACTIVE", label: "Actif" },
  { key: "SUSPENDED", label: "Suspendu" },
  { key: "CANCELLED", label: "Résilié" },
];
const isoDate = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");

export default async function PlatformOrganizationsPage({ searchParams }: { searchParams: { created?: string; saved?: string; error?: string; imported?: string; skipped?: string; deleted?: string } }) {
  await requirePermission("platform.manage");
  const [orgs, ministries] = await Promise.all([
    prisma.organization.findMany({
      where: { isPlatform: false },
      orderBy: { createdAt: "asc" },
      include: { subscription: true, ministry: true, _count: { select: { users: true, resources: true, bookings: true } } },
    }),
    prisma.ministry.findMany({ orderBy: { name: "asc" } }),
  ]);

  const errorMsg: Record<string, string> = {
    champs: "Champs obligatoires manquants.",
    slug: "Un établissement avec ce nom ou cet identifiant existe déjà.",
    email: "Cet e-mail d'administrateur est déjà utilisé.",
    csv: "Fichier CSV illisible ou vide.",
    delete: "La suppression de l'établissement a échoué. Réessayez.",
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/platform" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Supervision EduWeb
      </Link>
      <PageHeader
        title="Établissements"
        description="Inscrire, activer/suspendre et gérer l'abonnement de chaque établissement (super admin)."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Building2 className="size-6" /></span>}
      />

      {searchParams.created && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Établissement « {searchParams.created} » créé. L'administrateur peut se connecter (mot de passe par défaut : <code>password123</code>).
        </div>
      )}
      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Modifications enregistrées.
        </div>
      )}
      {searchParams.imported && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> {searchParams.imported} établissement(s) importé(s){searchParams.skipped && Number(searchParams.skipped) > 0 ? `, ${searchParams.skipped} ignoré(s) (doublon ou champ manquant)` : ""}.
        </div>
      )}
      {searchParams.deleted && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <Trash2 className="size-5" /> Établissement « {searchParams.deleted} » supprimé définitivement.
        </div>
      )}
      {searchParams.error && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" /> {errorMsg[searchParams.error] ?? "Une erreur est survenue."}
        </div>
      )}

      {/* Inscription d'un nouvel établissement */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> Inscrire un établissement</CardTitle></CardHeader>
        <CardContent>
          <CreateInstitutionForm ministries={ministries} />
        </CardContent>
      </Card>

      {/* Import CSV (cohorte d'établissements) */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Upload className="size-4" /> Import par CSV (cohorte d'établissements)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <form action={importInstitutionsCsv} className="space-y-3">
            <FileDropzone
              name="file"
              accept=".csv,text/csv"
              required
              className="gap-1.5 rounded-xl px-4 py-6"
              title="Glissez-déposez ou choisissez un fichier CSV"
              hint="Colonnes : nom, sigle, slug, ville, ministere, formule, sieges, admin_prenom, admin_nom, admin_email"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button type="submit" size="sm"><Upload className="size-4" /> Importer</Button>
              <a href="/api/platform/organizations/template" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> Télécharger le modèle CSV</a>
            </div>
          </form>
          <p className="text-xs text-muted-foreground">Chaque ligne crée un établissement complet (admin, rôles, bibliothèque). Le ministère est reconnu par sigle ou nom. Doublons (nom/identifiant/e-mail) ignorés.</p>
        </CardContent>
      </Card>

      {/* Liste des établissements */}
      <div className="space-y-4">
        {orgs.map((o) => {
          const sub = o.subscription;
          const suspended = o.status === "SUSPENDED";
          return (
            <Card key={o.id} className={suspended ? "border-unavailable/40" : undefined}>
              <CardContent className="space-y-4 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{o.name}</h3>
                      <Badge tone={suspended ? "unavailable" : "available"}>{suspended ? "Suspendu" : "Actif"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{o.acronym}{o.city ? ` · ${o.city}` : ""} · /{o.slug}{o.ministry ? ` · 🏛️ ${o.ministry.acronym ?? o.ministry.name}` : ""}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {o._count.users}</span>
                    <span className="inline-flex items-center gap-1"><Boxes className="size-3.5" /> {o._count.resources}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" /> {o._count.bookings}</span>
                    <form action={setOrganizationStatus}>
                      <input type="hidden" name="organizationId" value={o.id} />
                      <input type="hidden" name="status" value={suspended ? "ACTIVE" : "SUSPENDED"} />
                      <Button type="submit" size="sm" variant={suspended ? "default" : "outline"}>
                        <Power className="size-4" /> {suspended ? "Réactiver" : "Suspendre"}
                      </Button>
                    </form>
                    <ConfirmActionButton
                      action={deleteOrganization}
                      hidden={{ organizationId: o.id }}
                      triggerLabel="Supprimer"
                      triggerIcon={<Trash2 className="size-4" />}
                      triggerVariant="ghost"
                      triggerSize="sm"
                      title={`Supprimer « ${o.name} » ?`}
                      description="Action irréversible : tous les utilisateurs, rôles, ressources, réservations, documents et données de cet établissement seront définitivement supprimés."
                      confirmLabel="Supprimer définitivement"
                      confirmVariant="destructive"
                    />
                  </div>
                </div>

                {/* Abonnement */}
                <form action={updateSubscription} className="grid items-end gap-3 rounded-xl border border-border bg-secondary/30 p-3 sm:grid-cols-2 lg:grid-cols-3">
                  <input type="hidden" name="organizationId" value={o.id} />
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Label htmlFor={`min-${o.id}`}>Ministère de tutelle</Label>
                    <MinistrySelect id={`min-${o.id}`} name="ministryId" ministries={ministries} defaultValue={o.ministryId} />
                  </div>
                  <div>
                    <Label htmlFor={`plan-${o.id}`}>Formule</Label>
                    <Select id={`plan-${o.id}`} name="plan" defaultValue={sub?.plan ?? "PILOTE"}>{PLANS.map((p) => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}</Select>
                  </div>
                  <div>
                    <Label htmlFor={`status-${o.id}`}>Statut abonnement</Label>
                    <Select id={`status-${o.id}`} name="status" defaultValue={sub?.status ?? "ACTIVE"}>{SUB_STATUS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</Select>
                  </div>
                  <div>
                    <Label htmlFor={`seats-${o.id}`}>Comptes autorisés</Label>
                    <Input id={`seats-${o.id}`} name="seats" type="number" min={0} defaultValue={sub?.seats ?? 50} />
                  </div>
                  <div>
                    <Label htmlFor={`renews-${o.id}`}>Renouvellement</Label>
                    <Input id={`renews-${o.id}`} name="renewsAt" type="date" defaultValue={isoDate(sub?.renewsAt)} />
                  </div>
                  <Button type="submit" variant="outline"><Save className="size-4" /> Enregistrer</Button>
                </form>
                {sub?.renewsAt && <p className="text-xs text-muted-foreground">Renouvellement prévu le {fmtDate(sub.renewsAt)}.</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
