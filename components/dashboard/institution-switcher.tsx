"use client";

import { Building2 } from "lucide-react";
import { switchInstitution } from "@/app/actions/admin";

// Sélecteur d'institution réservé au super administrateur : bascule le contexte de données
// (collections, domaines, utilisateurs, dépôt, réservations…) vers l'institution choisie.
export function InstitutionSwitcher({
  institutions,
  activeOrgId,
}: {
  institutions: { id: string; name: string; isPlatform: boolean }[];
  activeOrgId: string | null;
}) {
  if (institutions.length === 0) return null;
  return (
    <form action={switchInstitution} className="hidden items-center gap-1.5 md:flex">
      <Building2 className="size-4 shrink-0 text-muted-foreground" />
      <select
        name="orgId"
        defaultValue={activeOrgId ?? ""}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        title="Institution active"
        aria-label="Institution active"
        className="h-9 max-w-[200px] rounded-xl border border-input bg-secondary/50 px-2.5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {institutions.map((i) => (
          <option key={i.id} value={i.id}>
            {i.isPlatform ? `${i.name} · plateforme` : i.name}
          </option>
        ))}
      </select>
    </form>
  );
}
