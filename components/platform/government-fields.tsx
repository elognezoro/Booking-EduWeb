"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/ui/country-select";

/**
 * Champs « Nom de l'État » + « Pays » liés : choisir un pays renseigne automatiquement
 * le nom officiel de l'État (modifiable ensuite).
 */
export function GovernmentFields({ defaultName, defaultCountry }: { defaultName: string; defaultCountry: string }) {
  const [name, setName] = React.useState(defaultName);
  return (
    <>
      <div>
        <Label htmlFor="name" required>
          Nom de l'État
        </Label>
        <Input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="country">Pays</Label>
        <CountrySelect id="country" name="country" defaultValue={defaultCountry} onSelect={(c) => setName(c.official)} />
      </div>
    </>
  );
}
