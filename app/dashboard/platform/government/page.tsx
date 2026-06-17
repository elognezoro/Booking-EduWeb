import Link from "next/link";
import { Landmark, Plus, Save, Trash2, CheckCircle2, AlertTriangle, ArrowLeft, Building2 } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GovernmentFields } from "@/components/platform/government-fields";
import { saveGovernment, createMinistry, updateMinistry, deleteMinistry, seedCiMinistries } from "@/app/actions/platform";

export const dynamic = "force-dynamic";

export default async function GovernmentPage({ searchParams }: { searchParams: { saved?: string; error?: string; seeded?: string } }) {
  await requirePermission("platform.manage");
  const government = await prisma.government.findFirst();
  const ministries = government
    ? await prisma.ministry.findMany({ where: { governmentId: government.id }, orderBy: { name: "asc" }, include: { _count: { select: { organizations: true } } } })
    : [];

  return (
    <div className="space-y-6">
      <Link href="/dashboard/platform" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Supervision EduWeb
      </Link>
      <PageHeader
        title="Gouvernement & ministères"
        description="Enregistrez l'État et ses ministères de tutelle, avant de rattacher les établissements."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Landmark className="size-6" /></span>}
      />

      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Enregistré.
        </div>
      )}
      {searchParams.error && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" /> Le nom est obligatoire.
        </div>
      )}
      {searchParams.seeded && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> {searchParams.seeded} ministère(s) de Côte d'Ivoire ajouté(s).
        </div>
      )}

      {/* Gouvernement */}
      <Card>
        <CardHeader><CardTitle className="text-base">Gouvernement</CardTitle></CardHeader>
        <CardContent>
          <form action={saveGovernment} className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <GovernmentFields defaultName={government?.name ?? "République de Côte d'Ivoire"} defaultCountry={government?.country ?? "Côte d'Ivoire"} />
            <Button type="submit"><Save className="size-4" /> {government ? "Mettre à jour" : "Enregistrer"}</Button>
          </form>
        </CardContent>
      </Card>

      {!government ? (
        <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Enregistrez d'abord le gouvernement ci-dessus pour pouvoir ajouter des ministères.</CardContent></Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Liste des ministères */}
          <Card className="overflow-hidden">
            <CardHeader><CardTitle className="text-base">{ministries.length} ministère(s)</CardTitle></CardHeader>
            <div className="divide-y divide-border">
              {ministries.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">Aucun ministère. Ajoutez-en un avec le formulaire.</p>
              ) : (
                ministries.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <form action={updateMinistry} className="flex flex-1 flex-wrap items-end gap-2">
                      <input type="hidden" name="id" value={m.id} />
                      <div className="min-w-[200px] flex-1"><Label htmlFor={`mn-${m.id}`}>Nom</Label><Input id={`mn-${m.id}`} name="name" defaultValue={m.name} required /></div>
                      <div className="w-28"><Label htmlFor={`ma-${m.id}`}>Sigle</Label><Input id={`ma-${m.id}`} name="acronym" defaultValue={m.acronym ?? ""} /></div>
                      <Button type="submit" variant="outline" size="sm"><Save className="size-4" /></Button>
                    </form>
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral"><Building2 className="mr-1 inline size-3" />{m._count.organizations}</Badge>
                      <form action={deleteMinistry}>
                        <input type="hidden" name="id" value={m.id} />
                        <Button type="submit" variant="ghost" size="icon-sm" title="Supprimer"><Trash2 className="size-4 text-unavailable" /></Button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Ajout d'un ministère */}
          <Card className="lg:sticky lg:top-20 lg:self-start">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> Nouveau ministère</CardTitle></CardHeader>
            <CardContent>
              <form action={createMinistry} className="space-y-3">
                <input type="hidden" name="governmentId" value={government.id} />
                <div><Label htmlFor="new-name" required>Nom du ministère</Label><Input id="new-name" name="name" required placeholder="Ministère de l'Enseignement Supérieur…" /></div>
                <div><Label htmlFor="new-acr">Sigle</Label><Input id="new-acr" name="acronym" placeholder="MESRS" /></div>
                <Button type="submit" className="w-full"><Plus className="size-4" /> Ajouter</Button>
              </form>
              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-xs text-muted-foreground">Pré-remplir avec le gouvernement actuel :</p>
                <form action={seedCiMinistries}>
                  <input type="hidden" name="governmentId" value={government.id} />
                  <Button type="submit" variant="outline" className="w-full"><Landmark className="size-4" /> Ministères de Côte d'Ivoire</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
