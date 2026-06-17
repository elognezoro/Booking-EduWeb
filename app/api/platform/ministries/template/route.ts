import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ministriesForCountry } from "@/lib/ministries-by-country";

export const dynamic = "force-dynamic";

// Champ CSV échappé (les intitulés de ministères contiennent des virgules).
const cell = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
const slugCountry = (c: string) =>
  c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Modèle CSV de ministères, PRÉ-REMPLI selon le pays (?country=...) quand sa liste est connue,
// sinon exemples génériques. UTF-8 (BOM Excel).
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.permissions.has("platform.manage")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const country = new URL(req.url).searchParams.get("country") || "";
  const ref = ministriesForCountry(country);

  const rows = ref
    ? ref.map((m) => `${cell(m.name)},${cell(m.acronym || "")}`)
    : [
        `${cell("Ministère de l'Enseignement Supérieur et de la Recherche Scientifique")},${cell("MESRS")}`,
        `${cell("Ministère de l'Éducation nationale et de l'Alphabétisation")},${cell("MENA")}`,
        `${cell("Ministère de la Santé et de l'Hygiène publique")},${cell("")}`,
      ];
  const csv = "﻿" + ["nom,sigle", ...rows].join("\r\n") + "\r\n";

  const suffix = country ? `-${slugCountry(country)}` : "";
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="modele-ministeres${suffix}-eduweb.csv"`,
    },
  });
}
