"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { LogIn, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { registerRoomArrival, type RoomArrivalState } from "@/app/actions/room-attendance";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ENS_DEPARTMENTS } from "@/lib/finances/ens-academics";
import { VISIT_STATUTS, VISIT_STATUT_LABELS, type VisitStatut } from "@/lib/rooms/attendance";
import { ENS_MATRICULE_EXAMPLE } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
      Enregistrer mon arrivée
    </Button>
  );
}

export interface AttendancePrefill {
  lastName?: string;
  firstName?: string;
  gender?: string; // HOMME | FEMME
  statut?: VisitStatut;
  filiere?: string;
  section?: string;
  matricule?: string;
}

/**
 * Émargement à l'arrivée dans une salle multimédia (flash du QR code affiché en salle).
 * Champs du formulaire APRID : nom, prénoms, genre, statut, filière → discipline ;
 * l'heure d'arrivée est horodatée automatiquement par la plateforme.
 */
export function AttendanceForm({ roomId, roomName, prefill }: { roomId: string; roomName: string; prefill: AttendancePrefill }) {
  const [state, formAction] = useFormState<RoomArrivalState, FormData>(registerRoomArrival, {});
  const [statut, setStatut] = React.useState<VisitStatut>(prefill.statut ?? "ETUDIANT");
  const [dept, setDept] = React.useState(prefill.filiere ?? "");
  const sections = ENS_DEPARTMENTS.find((d) => d.name === dept)?.sections ?? [];
  const [section, setSection] = React.useState(prefill.section ?? "");

  const onDept = (name: string) => {
    setDept(name);
    setSection(ENS_DEPARTMENTS.find((d) => d.name === name)?.sections[0] ?? "");
  };

  if (state.success) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-available-soft text-available-fg">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="text-2xl font-extrabold text-foreground">Arrivée enregistrée ✅</h1>
        <p className="mt-3 text-muted-foreground">
          Votre présence en salle <strong className="text-foreground">{state.salle}</strong> est enregistrée à{" "}
          <strong className="text-foreground">{state.heure}</strong>. Le surveillant a été prévenu : il pointera votre heure
          de départ lorsque vous quitterez la salle.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Bonne séance de travail !</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Émargement — salle {roomName}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Vous venez de flasher le QR code de la salle <strong className="text-foreground">{roomName}</strong>. Vérifiez ou
        complétez les informations ci-dessous : votre heure d'arrivée sera enregistrée automatiquement.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="roomId" value={roomId} />
        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
            <AlertCircle className="size-4 shrink-0" /> {state.error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="va-nom" required>Nom</Label><Input id="va-nom" name="lastName" required maxLength={80} defaultValue={prefill.lastName ?? ""} className="uppercase" /></div>
          <div><Label htmlFor="va-prenoms" required>Prénoms</Label><Input id="va-prenoms" name="firstName" required maxLength={80} defaultValue={prefill.firstName ?? ""} /></div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="va-genre" required>Genre</Label>
            <Select id="va-genre" name="gender" required defaultValue={prefill.gender ?? ""}>
              <option value="" disabled>Sélectionner…</option>
              <option value="HOMME">Homme</option>
              <option value="FEMME">Femme</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="va-statut" required>Statut</Label>
            <Select id="va-statut" name="statut" required value={statut} onChange={(e) => setStatut(e.target.value as VisitStatut)}>
              {VISIT_STATUTS.map((s) => <option key={s} value={s}>{VISIT_STATUT_LABELS[s]}</option>)}
            </Select>
          </div>
        </div>

        {statut === "ETUDIANT" && (
          <>
            <div>
              <Label htmlFor="va-filiere">Filière</Label>
              <Select id="va-filiere" name="filiere" value={dept} onChange={(e) => onDept(e.target.value)}>
                <option value="">— Sélectionner (facultatif)</option>
                {ENS_DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
              </Select>
            </div>
            {sections.length > 0 ? (
              <div>
                <Label htmlFor="va-section">Discipline / spécialité</Label>
                <Select id="va-section" name="section" value={section} onChange={(e) => setSection(e.target.value)}>
                  {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            ) : (
              <input type="hidden" name="section" value="" />
            )}
            <div>
              <Label htmlFor="va-mat">Matricule</Label>
              <Input id="va-mat" name="matricule" maxLength={40} defaultValue={prefill.matricule ?? ""} placeholder={`Ex. ${ENS_MATRICULE_EXAMPLE} (facultatif)`} className="uppercase" />
            </div>
          </>
        )}

        <SubmitButton />
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
          Ces informations alimentent le registre de présence de la salle ; le surveillant enregistrera votre heure de départ.
        </p>
      </form>
    </div>
  );
}
