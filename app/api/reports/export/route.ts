import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingStatusMeta, USAGE_TYPE_LABELS, type UsageType } from "@/lib/enums";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.permissions.has("reports.export")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = { organizationId: user.organizationId ?? "" };
  if (status) where.status = status;
  if (from || to) {
    where.startAt = {};
    if (from) where.startAt.gte = new Date(from);
    if (to) where.startAt.lte = new Date(`${to}T23:59:59`);
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startAt: "desc" },
    include: { resource: { include: { category: true } }, requester: true },
  });

  const header = ["Code", "Ressource", "Catégorie", "Demandeur", "Début", "Fin", "Statut", "Usage", "Effectif", "Motif"];
  const lines = [header.map(csvCell).join(";")];
  for (const b of bookings) {
    lines.push(
      [
        b.code,
        b.resource.name,
        b.resource.category.name,
        `${b.requester.firstName} ${b.requester.lastName}`,
        b.startAt.toLocaleString("fr-FR"),
        b.endAt.toLocaleString("fr-FR"),
        bookingStatusMeta(b.status).label,
        USAGE_TYPE_LABELS[b.usageType as UsageType] ?? b.usageType,
        b.participantCount ?? "",
        b.purpose,
      ]
        .map(csvCell)
        .join(";")
    );
  }

  // BOM pour la compatibilité Excel (accents).
  const csv = "﻿" + lines.join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="eduweb-booking-rapport-${date}.csv"`,
    },
  });
}
