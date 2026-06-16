"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseJson } from "@/lib/json";
import { RESOURCE_STATUS, RESOURCE_STATUS_META, type ResourceRules } from "@/lib/enums";

interface Option { id: string; name: string }

function SubmitButton({ edit }: { edit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      {edit ? "Enregistrer les modifications" : "Créer la ressource"}
    </Button>
  );
}

interface ServiceOption { id: string; name: string; parentId: string | null }

export function ResourceForm({
  action,
  categories,
  sites,
  levels,
  services,
  managers,
  resource,
}: {
  action: (formData: FormData) => void;
  categories: Option[];
  sites: Option[];
  levels: Option[];
  services: ServiceOption[];
  managers: { id: string; firstName: string; lastName: string }[];
  resource?: any;
}) {
  const edit = !!resource;
  const rules: Partial<ResourceRules> = parseJson(resource?.rules, {});
  const equipment = parseJson<string[]>(resource?.equipment, []).join(", ");

  // Niveau (parent) → Service (enfant). departmentId stocke le service choisi, sinon le niveau.
  const initialService = resource?.departmentId && services.some((s) => s.id === resource.departmentId) ? resource.departmentId : "";
  const initialLevel = (() => {
    if (!resource?.departmentId) return "";
    const svc = services.find((s) => s.id === resource.departmentId);
    if (svc) return svc.parentId ?? "";
    return levels.some((l) => l.id === resource.departmentId) ? resource.departmentId : "";
  })();
  const [levelId, setLevelId] = React.useState<string>(initialLevel);
  const [serviceId, setServiceId] = React.useState<string>(initialService);
  const levelServices = services.filter((s) => s.parentId === levelId);
  const departmentId = serviceId || levelId;

  return (
    <form action={action} className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name" required>Nom de la ressource</Label>
            <Input id="name" name="name" defaultValue={resource?.name} placeholder="Ex. Salle multimédia 1" required />
          </div>
          <div>
            <Label htmlFor="code" required>Code</Label>
            <Input id="code" name="code" defaultValue={resource?.code} placeholder="Ex. SM-01" required />
          </div>
          <div>
            <Label htmlFor="categoryId" required>Catégorie</Label>
            <Select id="categoryId" name="categoryId" defaultValue={resource?.categoryId} required>
              <option value="">Sélectionner…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="siteId">Site</Label>
            <Select id="siteId" name="siteId" defaultValue={resource?.siteId ?? ""}>
              <option value="">—</option>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="levelId">Niveau</Label>
            <Select id="levelId" value={levelId} onChange={(e) => { setLevelId(e.target.value); setServiceId(""); }}>
              <option value="">—</option>
              {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="serviceId">Service</Label>
            <Select
              id="serviceId"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              disabled={!levelId || levelServices.length === 0}
            >
              <option value="">
                {!levelId ? "Choisissez d'abord un niveau" : levelServices.length === 0 ? "Aucun service pour ce niveau" : "— (tout le niveau)"}
              </option>
              {levelServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <input type="hidden" name="departmentId" value={departmentId} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={resource?.description ?? ""} placeholder="Décrivez la ressource, ses usages et ses consignes…" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Capacité & disponibilité</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select id="status" name="status" defaultValue={resource?.status ?? "AVAILABLE"}>
              {RESOURCE_STATUS.map((s) => <option key={s} value={s}>{RESOURCE_STATUS_META[s].label}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="managerId">Responsable</Label>
            <Select id="managerId" name="managerId" defaultValue={resource?.managerId ?? ""}>
              <option value="">—</option>
              {managers.map((m) => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="capacity">Capacité (places)</Label>
            <Input id="capacity" name="capacity" type="number" min={0} defaultValue={resource?.capacity ?? ""} placeholder="Ex. 30" />
          </div>
          <div>
            <Label htmlFor="quantityTotal">Quantité totale</Label>
            <Input id="quantityTotal" name="quantityTotal" type="number" min={0} defaultValue={resource?.quantityTotal ?? ""} placeholder="Ex. 30" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="location">Localisation</Label>
            <Input id="location" name="location" defaultValue={resource?.location ?? ""} placeholder="Ex. Bâtiment B · 1er étage" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="equipment">Équipements (séparés par des virgules)</Label>
            <Input id="equipment" name="equipment" defaultValue={equipment} placeholder="Ex. Vidéoprojecteur, 30 postes, Climatisation" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Règles de réservation</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="bookingMode">Mode</Label>
            <Select id="bookingMode" name="bookingMode" defaultValue={rules.bookingMode ?? "exclusive"}>
              <option value="exclusive">Exclusive (créneau entier)</option>
              <option value="partial">Partagée (par quantité)</option>
              <option value="mixed">Mixte</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="maxDurationMinutes">Durée max. (minutes)</Label>
            <Input id="maxDurationMinutes" name="maxDurationMinutes" type="number" min={15} defaultValue={rules.maxDurationMinutes ?? 10080} />
          </div>
          <div>
            <Label htmlFor="minNoticeHours">Préavis min. (heures)</Label>
            <Input id="minNoticeHours" name="minNoticeHours" type="number" min={0} defaultValue={rules.minNoticeHours ?? 1} />
          </div>
          <label className="flex items-center gap-2 sm:col-span-3">
            <input type="checkbox" name="requiresValidation" defaultChecked={rules.requiresValidation ?? true} className="size-4 rounded border-input text-primary focus:ring-ring" />
            <span className="text-sm font-medium text-foreground">Soumettre les réservations à validation</span>
          </label>
          <label className="flex items-start gap-2 sm:col-span-3">
            <input type="checkbox" name="seatBased" defaultChecked={rules.seatBased ?? false} className="mt-0.5 size-4 rounded border-input text-primary focus:ring-ring" />
            <span className="text-sm font-medium text-foreground">
              Réservation poste par poste (plan de salle)
              <span className="block text-xs font-normal text-muted-foreground">La capacité définit le nombre de postes réservables individuellement (salles multimédias).</span>
            </span>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <SubmitButton edit={edit} />
      </div>
    </form>
  );
}
