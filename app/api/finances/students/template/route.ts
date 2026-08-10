import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Modèle CSV d'import des étudiants payeurs (en-tête + exemples). UTF-8 avec BOM (Excel).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.permissions.has("finances.manage")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const lines = [
    "nom,matricule,departement,section",
    "KOUASSI Aya Estelle,24-A-P12345ANG/SP,Département des Langues,Anglais",
    "TRAORE Moussa,23-B-P54321MAT/SP,Département Sciences et Technologie,Mathématiques",
    "AKA N'Da Josiane,24-A-P67890LMO/SP,Département des Arts et Lettres,Lettres Modernes",
  ];
  const csv = "﻿" + lines.join("\r\n") + "\r\n";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="modele-etudiants-payeurs-eduweb.csv"',
    },
  });
}
