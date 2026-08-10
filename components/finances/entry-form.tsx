"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFinanceEntry } from "@/app/actions/finances";
import { PAYMENT_METHODS, PAYMENT_METHOD_KEYS, type EntryKind } from "@/lib/finances/constants";
import { ENS_DEPARTMENTS, isConsultationDocumentaire, CONSULTATION_DEFAULT_AMOUNT } from "@/lib/finances/ens-academics";
import { StudentPicker, type StudentOption } from "@/components/finances/student-picker";

const OTHER = "__AUTRE__";

/**
 * Formulaire de saisie d'une écriture (encaissement / dépense).
 * - « Libellé » est une liste déroulante alimentée par les catégories de l'espace
 *   (+ « Autre » pour une saisie libre) ; choisir un libellé sélectionne la catégorie assortie.
 * - Libellé « Consultation documentaire » → cascade Département → Section/filière (ENS d'Abidjan).
 */
export function EntryForm({
  kind,
  espace,
  back,
  cashboxes,
  categories,
  students = [],
}: {
  kind: EntryKind;
  espace: string;
  back: string;
  cashboxes: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  students?: StudentOption[];
}) {
  const [label, setLabel] = React.useState(categories[0]?.name ?? OTHER);
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id ?? "");
  const [dept, setDept] = React.useState("");
  const [section, setSection] = React.useState("");
  // Montant piloté pour proposer le tarif par défaut de la consultation documentaire
  // (10 000 FCFA) sans jamais écraser une saisie manuelle.
  const defaultAmount = String(CONSULTATION_DEFAULT_AMOUNT);
  const [amount, setAmount] = React.useState(() =>
    categories[0] && isConsultationDocumentaire(categories[0].name) ? defaultAmount : ""
  );
  // Payeur (recherche étudiant) + N° de pièce auto-rempli avec le matricule de l'étudiant choisi.
  const [payer, setPayer] = React.useState("");
  const [reference, setReference] = React.useState("");
  const [autoRef, setAutoRef] = React.useState("");

  const onPickStudent = (s: StudentOption) => {
    setPayer(s.fullName);
    if (s.matricule && (reference === "" || reference === autoRef)) {
      setReference(s.matricule);
      setAutoRef(s.matricule);
    }
  };

  const isOther = label === OTHER || categories.length === 0;
  const consultation = !isOther && isConsultationDocumentaire(label);
  const sections = ENS_DEPARTMENTS.find((d) => d.name === dept)?.sections ?? [];

  const onLabelChange = (value: string) => {
    const wasConsultation = consultation;
    setLabel(value);
    // Synchronise la catégorie avec le libellé choisi (modifiable ensuite).
    const match = categories.find((c) => c.name === value);
    if (match) setCategoryId(match.id);
    if (isConsultationDocumentaire(value)) {
      // Tarif par défaut si le montant n'a pas été saisi manuellement.
      if (amount === "" || amount === defaultAmount) setAmount(defaultAmount);
    } else {
      setDept("");
      setSection("");
      if (wasConsultation && amount === defaultAmount) setAmount("");
    }
  };

  return (
    <form action={createFinanceEntry} className="space-y-3">
      <input type="hidden" name="espace" value={espace} />
      <input type="hidden" name="back" value={back} />
      <input type="hidden" name="kind" value={kind} />

      <div>
        <Label htmlFor="label-select" required>Libellé</Label>
        {categories.length > 0 ? (
          <Select
            id="label-select"
            name={isOther ? undefined : "label"}
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
            <option value={OTHER}>Autre (saisie libre)…</option>
          </Select>
        ) : (
          <p className="mb-1 text-xs text-muted-foreground">
            Aucune catégorie dans cet espace — créez-en dans « Paramètres fin. » pour un libellé en liste.
          </p>
        )}
        {isOther && (
          <Input
            name="label"
            required
            placeholder={kind === "INCOME" ? "Ex. Location salle A — atelier" : "Ex. Achat de fournitures"}
            className={categories.length > 0 ? "mt-2" : undefined}
            aria-label="Libellé (saisie libre)"
          />
        )}
      </div>

      {/* Cascade ENS : Département → Section/filière (consultation documentaire) */}
      {consultation && (
        <div className="space-y-3 rounded-xl border border-primary/20 bg-primary-50/40 p-3">
          <div>
            <Label htmlFor="deptAcad" required>Département</Label>
            <Select
              id="deptAcad"
              name="deptAcad"
              required
              value={dept}
              onChange={(e) => { setDept(e.target.value); setSection(""); }}
            >
              <option value="" disabled>— Choisir un département —</option>
              {ENS_DEPARTMENTS.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="sectionAcad" required>Section / filière</Label>
            <Select
              id="sectionAcad"
              name="sectionAcad"
              required
              value={section}
              onChange={(e) => setSection(e.target.value)}
              disabled={!dept}
            >
              <option value="" disabled>{dept ? "— Choisir une section —" : "Choisissez d'abord un département"}</option>
              {sections.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount" required>Montant (FCFA)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {consultation && (
            <p className="mt-1 text-xs text-muted-foreground">Tarif par défaut : 10 000 FCFA — modifiable.</p>
          )}
        </div>
        {/* Date : pré-remplie à la date du jour. */}
        <div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
      </div>

      <div>
        <Label htmlFor="method">Mode de paiement</Label>
        <Select id="method" name="method" defaultValue="CASH">
          {PAYMENT_METHOD_KEYS.map((m) => <option key={m} value={m}>{PAYMENT_METHODS[m]}</option>)}
        </Select>
      </div>

      {cashboxes.length > 0 && (
        <div>
          <Label htmlFor="cashboxId">Caisse / compte</Label>
          {/* Par défaut : la première caisse de l'espace (ex. « Ressources HB / APRID »). */}
          <Select id="cashboxId" name="cashboxId" defaultValue={cashboxes[0].id}>
            {cashboxes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            <option value="">— Sans caisse —</option>
          </Select>
        </div>
      )}

      {categories.length > 0 && (
        <div>
          <Label htmlFor="categoryId">Catégorie</Label>
          <Select id="categoryId" name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">— Sans catégorie —</option>
            {categories.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="thirdParty">{kind === "INCOME" ? "Payeur" : "Bénéficiaire"}</Label>
        {kind === "INCOME" && students.length > 0 ? (
          <>
            <StudentPicker
              students={students}
              department={consultation ? dept : ""}
              section={consultation ? section : ""}
              value={payer}
              onChange={setPayer}
              onPick={onPickStudent}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {consultation && (dept || section)
                ? "Liste filtrée selon le département et la section choisis."
                : "Recherchez dans la liste des étudiants, ou saisissez librement un nom."}
            </p>
          </>
        ) : (
          <Input id="thirdParty" name="thirdParty" placeholder="Nom du tiers (facultatif)" />
        )}
      </div>
      {kind === "INCOME" && (
        <div>
          <Label htmlFor="thirdPartyEmail">E-mail du payeur</Label>
          <Input id="thirdPartyEmail" name="thirdPartyEmail" type="email" placeholder="adresse@exemple.ci (facultatif)" />
          <p className="mt-1 text-xs text-muted-foreground">Si renseigné, le reçu (avec son numéro) lui est envoyé automatiquement par e-mail.</p>
        </div>
      )}
      <div>
        <Label htmlFor="reference">N° de pièce</Label>
        <Input
          id="reference"
          name="reference"
          placeholder="N° d'identification / réf. justificatif (facultatif)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        {kind === "INCOME" && students.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">Pré-rempli avec le n° d'identification (matricule) de l'étudiant sélectionné.</p>
        )}
      </div>
      <div><Label htmlFor="note">Note</Label><Textarea id="note" name="note" rows={2} /></div>
      <Button type="submit" className="w-full"><Plus className="size-4" /> Enregistrer</Button>
    </form>
  );
}
