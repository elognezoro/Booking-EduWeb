import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Modèle CSV d'enrôlement des étudiants (en-tête + exemples). UTF-8 avec BOM (Excel).
// « annee » : 1 = Première année, 2 = Deuxième année (formation ENS en deux années).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.permissions.has("scolarite.manage")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const lines = [
    "nom,matricule,departement,section,annee,email",
    "KOUASSI Aya Estelle,24-A-P12345ANG-SP,Département des Langues,Anglais,1,aya.kouassi@exemple.ci",
    "TRAORE Moussa,23-B-P54321MAT-SP,Département Sciences et Technologie,Mathématiques,2,moussa.traore@exemple.ci",
    "AKA N'Da Josiane,24-A-P67890LMO-SP,Département des Arts et Lettres,Lettres Modernes,1,",
  ];
  const csv = "﻿" + lines.join("\r\n") + "\r\n";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="modele-enrolement-etudiants-eduweb.csv"',
    },
  });
}
