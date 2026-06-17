import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Modèle CSV d'import de ministères (en-tête + exemples). Séparateur « , », UTF-8 (BOM Excel).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.permissions.has("platform.manage")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const lines = [
    "nom,sigle",
    "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique,MESRS",
    "Ministère de l'Éducation nationale et de l'Alphabétisation,MENA",
    "Ministère de la Santé et de l'Hygiène publique,",
    "Ministère des Finances et du Budget,",
  ];
  const csv = "﻿" + lines.join("\r\n") + "\r\n";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="modele-import-ministeres-eduweb.csv"',
    },
  });
}
