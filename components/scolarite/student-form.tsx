"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStudent } from "@/app/actions/scolarite";
import { ENS_DEPARTMENTS } from "@/lib/finances/ens-academics";
import { STUDENT_YEARS } from "@/lib/scolarite/constants";
import { ENS_MATRICULE_EXAMPLE } from "@/lib/utils";

/**
 * Fiche d'enrôlement manuel d'un étudiant : cascade Département → Section/filière
 * (référentiel ENS), année de formation (Première / Deuxième — la formation ENS
 * dure deux années) et campagne académique.
 */
export function StudentForm({ academicYears, defaultAcademicYear }: { academicYears: string[]; defaultAcademicYear: string }) {
  const [dept, setDept] = React.useState(ENS_DEPARTMENTS[0].name);
  const sections = ENS_DEPARTMENTS.find((d) => d.name === dept)?.sections ?? [];
  const [section, setSection] = React.useState(sections[0] ?? "");

  const onDept = (name: string) => {
    setDept(name);
    setSection(ENS_DEPARTMENTS.find((d) => d.name === name)?.sections[0] ?? "");
  };

  return (
    <form action={createStudent} className="space-y-3">
      <div><Label htmlFor="s-name" required>Nom complet</Label><Input id="s-name" name="fullName" required maxLength={120} placeholder="Ex. KOUASSI Aya Estelle" /></div>
      <div>
        <Label htmlFor="s-mat">Matricule</Label>
        <Input id="s-mat" name="matricule" maxLength={40} placeholder={`Ex. ${ENS_MATRICULE_EXAMPLE} (facultatif)`} />
      </div>
      <div>
        <Label htmlFor="s-dept" required>Filière</Label>
        <Select id="s-dept" name="department" value={dept} onChange={(e) => onDept(e.target.value)}>
          {ENS_DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
        </Select>
      </div>
      {sections.length > 0 ? (
        <div>
          <Label htmlFor="s-sec" required>Discipline / spécialité</Label>
          <Select id="s-sec" name="section" value={section} onChange={(e) => setSection(e.target.value)}>
            {sections.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      ) : (
        <input type="hidden" name="section" value="" />
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="s-year" required>Année de formation</Label>
          <Select id="s-year" name="year" defaultValue="1">
            {STUDENT_YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="s-ay" required>Campagne</Label>
          <Select id="s-ay" name="academicYear" defaultValue={defaultAcademicYear}>
            {academicYears.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
        </div>
      </div>
      <div><Label htmlFor="s-td">Groupe de TD</Label><Input id="s-td" name="tdGroup" maxLength={20} placeholder="Ex. G1 (facultatif)" /></div>
      <div><Label htmlFor="s-email">E-mail</Label><Input id="s-email" name="email" type="email" placeholder="Pour le compte de connexion et les reçus (facultatif)" /></div>
      <div><Label htmlFor="s-phone">Téléphone</Label><Input id="s-phone" name="phone" maxLength={30} placeholder="Facultatif" /></div>
      <Button type="submit" className="w-full"><UserPlus className="size-4" /> Enrôler l'étudiant</Button>
    </form>
  );
}
