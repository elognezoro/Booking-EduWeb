"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "@/components/category-icon";
import { VALIDATION_MODES, VALIDATION_MODE_LABELS } from "@/lib/enums";

const ICONS = ["MonitorPlay", "Users", "BookOpen", "Projector", "Car", "Wrench", "PartyPopper", "Laptop", "Building2", "Box", "Calendar"];
const COLORS = ["#064B3A", "#0B5A45", "#22C55E", "#F97316", "#6D5DF5", "#172554", "#DC2626", "#0EA5E9"];

function SubmitButton({ edit }: { edit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      {edit ? "Enregistrer" : "Créer la catégorie"}
    </Button>
  );
}

export function CategoryForm({ action, category }: { action: (fd: FormData) => void; category?: any }) {
  const [icon, setIcon] = React.useState<string>(category?.icon ?? "Box");
  const [color, setColor] = React.useState<string>(category?.color ?? "#064B3A");

  return (
    <form action={action} className="space-y-5">
      <Card>
        <CardContent className="grid gap-4 py-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 sm:col-span-2">
            <CategoryIcon icon={icon} color={color} size="lg" />
            <p className="text-sm text-muted-foreground">Aperçu de l'icône de la catégorie.</p>
          </div>
          <div>
            <Label htmlFor="name" required>Nom</Label>
            <Input id="name" name="name" defaultValue={category?.name} placeholder="Ex. Salles multimédias" required />
          </div>
          <div>
            <Label htmlFor="code">Code</Label>
            <Input id="code" name="code" defaultValue={category?.code ?? ""} placeholder="Ex. SM" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={category?.description ?? ""} placeholder="À quoi sert cette catégorie ?" />
          </div>
          <div>
            <Label htmlFor="validationMode">Mode de validation</Label>
            <Select id="validationMode" name="validationMode" defaultValue={category?.validationMode ?? "SIMPLE"}>
              {VALIDATION_MODES.map((m) => <option key={m} value={m}>{VALIDATION_MODE_LABELS[m]}</option>)}
            </Select>
          </div>

          <div>
            <Label>Icône</Label>
            <input type="hidden" name="icon" value={icon} />
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className={`rounded-xl border p-2 ${icon === i ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                  <CategoryIcon icon={i} color={color} size="sm" />
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label>Couleur</Label>
            <input type="hidden" name="color" value={color} />
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} aria-label={c}
                  className={`size-9 rounded-xl ${color === c ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end"><SubmitButton edit={!!category} /></div>
    </form>
  );
}
