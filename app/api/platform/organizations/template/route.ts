import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Modèle CSV d'import d'établissements (en-tête + exemples). Séparateur « , », UTF-8 (BOM Excel).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.permissions.has("platform.manage")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const lines = [
    "nom,sigle,slug,ville,ministere,formule,sieges,admin_prenom,admin_nom,admin_email",
    "Université Félix Houphouët-Boigny,UFHB,ufhb,Abidjan,MESRS,STANDARD,200,Adjoua,N'Guessan,admin@ufhb.ci",
    "INP-HB Yamoussoukro,INPHB,,Yamoussoukro,MESRS,PREMIUM,150,Ibrahim,Touré,admin@inphb.ci",
    "Lycée Sainte-Marie,LSM,,Abidjan,,PILOTE,80,Marie,Koffi,admin@lsm.ci",
  ];
  const csv = "﻿" + lines.join("\r\n") + "\r\n";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="modele-import-etablissements-eduweb.csv"',
    },
  });
}
