import type { Metadata } from "next";
import { MonitorPlay } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AttendanceForm, type AttendancePrefill } from "@/components/rooms/attendance-form";
import type { VisitStatut } from "@/lib/rooms/attendance";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Émargement salle multimédia" };

/**
 * Page publique ouverte par le QR code affiché dans chaque salle multimédia :
 * l'arrivant émarge (formulaire APRID), pré-rempli automatiquement s'il est
 * connecté à son compte EduWeb Booking (fiche étudiante comprise).
 */
export default async function SalleEmargementPage({ params }: { params: { id: string } }) {
  const salle = await prisma.resource.findFirst({
    where: { id: params.id, category: { code: "SM" }, status: { not: "ARCHIVED" } },
    select: { id: true, name: true, organizationId: true, organization: { select: { name: true } } },
  });

  const user = await getCurrentUser();
  const prefill: AttendancePrefill = {};
  if (user && salle) {
    prefill.lastName = user.lastName;
    prefill.firstName = user.firstName;
    const matricule = (await prisma.user.findUnique({ where: { id: user.id }, select: { matricule: true } }))?.matricule ?? null;
    const fiche = await prisma.student.findFirst({
      where: {
        OR: [
          { userId: user.id },
          ...(matricule ? [{ organizationId: salle.organizationId, matricule }] : []),
        ],
      },
    });
    if (fiche) {
      prefill.statut = "ETUDIANT" as VisitStatut;
      prefill.gender = fiche.gender === "M" ? "HOMME" : fiche.gender === "F" ? "FEMME" : undefined;
      prefill.filiere = fiche.department || undefined;
      prefill.section = fiche.section || undefined;
      prefill.matricule = fiche.matricule ?? undefined;
    } else {
      prefill.matricule = matricule ?? undefined;
      prefill.statut = /enseignant|formateur|professeur/i.test(user.functionTitle ?? "") ? "ENSEIGNANT" : "ETUDIANT";
    }
  }

  return (
    <main className="flex min-h-dvh items-start justify-center bg-secondary/40 px-4 py-8 sm:items-center">
      <div className="w-full max-w-lg">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><MonitorPlay className="size-6" /></span>
          <div>
            <p className="text-sm font-extrabold text-primary">EduWeb Booking</p>
            <p className="text-xs text-muted-foreground">{salle?.organization.name ?? "Salles multimédias"} — registre de présence</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          {!salle ? (
            <div className="text-center">
              <h1 className="text-xl font-extrabold text-foreground">Salle introuvable</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ce QR code ne correspond à aucune salle multimédia active. Rapprochez-vous du surveillant de la salle.
              </p>
            </div>
          ) : (
            <AttendanceForm roomId={salle.id} roomName={salle.name} prefill={prefill} />
          )}
        </div>

        {!user && salle && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Astuce : <a href={`/login`} className="font-semibold text-primary hover:underline">connectez-vous</a> avant de flasher
            le QR pour un remplissage automatique.
          </p>
        )}
      </div>
    </main>
  );
}
