import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Modèle CSV d'import de comptes (en-tête + exemples). Séparateur « , », encodage UTF-8 (BOM Excel).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.permissions.has("users.manage")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const lines = [
    "prenom,nom,email,fonction,role,matricule",
    "Awa,Koné,awa.kone@institution.ci,Enseignante,REQUESTER,",
    "Koffi,Yao,koffi.yao@institution.ci,Responsable des salles,RESOURCE_MANAGER,",
    "Aya,Traoré,aya.traore@ens.ci,Étudiante,READER,23-B-P17498IPS/SP",
    "Moussa,Diallo,moussa.diallo@ens.ci,Étudiant,READER,23-A-P17500SVT/SP",
  ];
  const csv = "﻿" + lines.join("\r\n") + "\r\n";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="modele-import-comptes-eduweb.csv"',
    },
  });
}
