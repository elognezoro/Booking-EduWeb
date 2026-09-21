import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GuidePrintActions } from "@/components/help/guide-print-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Affiches QR — salles multimédias" };

/**
 * Affiches à imprimer (une page A4 par salle) : QR code d'émargement à placarder
 * à l'entrée de chaque salle multimédia. Hors chrome du dashboard (vue impression).
 */
export default async function SallesAffichesPage() {
  const user = await requirePermission("resources.update");
  const salles = await prisma.resource.findMany({
    where: { organizationId: user.organizationId ?? "", category: { code: "SM" }, status: { not: "ARCHIVED" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, capacity: true },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Affiches QR d'émargement</h1>
          <p className="text-sm text-muted-foreground">
            Une page par salle — imprimez puis placardez chaque affiche à l'entrée de la salle correspondante.
          </p>
        </div>
        <GuidePrintActions auto={false} />
      </div>

      {salles.length === 0 && <p className="text-sm text-muted-foreground">Aucune salle multimédia configurée.</p>}

      {salles.map((s) => (
        <section key={s.id} className="mb-8 rounded-3xl border border-border bg-card p-10 text-center" style={{ pageBreakAfter: "always" }}>
          <p className="text-sm font-extrabold uppercase tracking-widest text-primary">EduWeb Booking · Registre de présence</p>
          <h2 className="mt-3 text-4xl font-extrabold text-foreground">Salle {s.name}</h2>
          {s.capacity ? <p className="mt-1 text-sm text-muted-foreground">{s.capacity} postes</p> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/rooms/${s.id}/qr`} alt={`QR d'émargement — salle ${s.name}`} className="mx-auto mt-6 size-64" />
          <p className="mx-auto mt-6 max-w-md text-lg font-semibold text-foreground">
            📱 À votre arrivée, flashez ce code avec votre téléphone pour enregistrer votre présence.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Connectez-vous d'abord à votre compte EduWeb Booking pour un remplissage automatique. Le surveillant
            enregistrera votre heure de départ.
          </p>
        </section>
      ))}
    </main>
  );
}
