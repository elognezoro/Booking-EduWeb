"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Building2, AlertTriangle } from "lucide-react";
import { createInstitution, type CreateOrgState } from "@/app/actions/platform";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { MinistrySelect } from "@/components/platform/ministry-select";
import { PLAN_LABELS, type Plan } from "@/lib/enums";
import { slugify } from "@/lib/utils";

const PLANS: Plan[] = ["PILOTE", "STANDARD", "PREMIUM", "NATIONAL"];

interface MinistryOpt {
  id: string;
  name: string;
  acronym: string | null;
}

export function CreateInstitutionForm({ ministries }: { ministries: MinistryOpt[] }) {
  const [state, action] = useFormState<CreateOrgState, FormData>(createInstitution, {});
  const [name, setName] = React.useState("");
  const [acronym, setAcronym] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugEdited, setSlugEdited] = React.useState(false);
  // Identifiant généré automatiquement depuis le sigle (ou le nom), tant qu'il n'est pas édité à la main.
  const autoSlug = slugify(acronym || name);
  const slugValue = slugEdited ? slug : autoSlug;
  const previewSlug = slugify(slugValue);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {state.error && (
        <div className="flex items-start gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg sm:col-span-2 lg:col-span-3">
          <AlertTriangle className="size-5 shrink-0" /> {state.error}
        </div>
      )}
      <div><Label htmlFor="name" required>Nom de l'établissement</Label><Input id="name" name="name" required placeholder="Université…" value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label htmlFor="acronym" required>Sigle</Label><Input id="acronym" name="acronym" required placeholder="UFHB" value={acronym} onChange={(e) => setAcronym(e.target.value)} /></div>
      <div>
        <Label htmlFor="slug">Identifiant</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="auto depuis le sigle / le nom"
          value={slugValue}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugEdited(e.target.value.trim() !== "");
          }}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {previewSlug ? (
            <>
              Adresse : <span className="font-mono font-semibold text-foreground">/{previewSlug}</span>
              {!slugEdited && <span> · généré automatiquement</span>}
            </>
          ) : (
            "Généré automatiquement depuis le sigle ou le nom."
          )}
        </p>
      </div>
      <div><Label htmlFor="city">Ville</Label><Input id="city" name="city" placeholder="Abidjan" /></div>
      <div>
        <Label htmlFor="ministryId">Ministère de tutelle</Label>
        <MinistrySelect id="ministryId" name="ministryId" ministries={ministries} />
        {ministries.length === 0 && (
          <p className="mt-1 text-xs text-muted-foreground">Aucun ministère enregistré. <Link href="/dashboard/platform/government" className="font-semibold text-primary hover:underline">Gérer les ministères</Link>.</p>
        )}
      </div>
      <div>
        <Label htmlFor="plan">Formule</Label>
        <Select id="plan" name="plan" defaultValue="STANDARD">{PLANS.map((p) => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}</Select>
      </div>
      <div><Label htmlFor="seats">Comptes autorisés</Label><Input id="seats" name="seats" type="number" min={1} defaultValue={100} /></div>
      <div><Label htmlFor="adminFirst" required>Prénom de l'admin</Label><Input id="adminFirst" name="adminFirst" required /></div>
      <div><Label htmlFor="adminLast" required>Nom de l'admin</Label><Input id="adminLast" name="adminLast" required /></div>
      <div><Label htmlFor="adminEmail" required>E-mail de l'admin</Label><Input id="adminEmail" name="adminEmail" type="email" required placeholder="admin@etablissement.ci" /></div>
      <div className="sm:col-span-2 lg:col-span-3">
        <SubmitButton pendingLabel="Création en cours…"><Building2 className="size-4" /> Créer l'établissement</SubmitButton>
        <p className="mt-2 text-xs text-muted-foreground">Crée l'organisation, ses rôles, son espace bibliothèque et un compte administrateur (mot de passe initial : <code>password123</code>, à changer). L'e-mail de l'admin doit être différent des comptes existants.</p>
      </div>
    </form>
  );
}
