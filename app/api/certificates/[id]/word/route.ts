import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildCertificateDocx } from "@/lib/docx/certificate-doc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await requirePermission("users.manage");
  const cert = await prisma.certificate.findUnique({ where: { id: params.id } });
  if (!cert) return new Response("Certificat introuvable", { status: 404 });
  const isSuper = user.roles.includes("SUPER_ADMIN");
  if (!isSuper && cert.organizationId !== user.organizationId) return new Response("Accès refusé", { status: 403 });

  const [org, config] = await Promise.all([
    prisma.organization.findUnique({ where: { id: cert.organizationId }, select: { name: true, city: true } }),
    prisma.certificateConfig.findUnique({ where: { organizationId: cert.organizationId } }),
  ]);

  const issuedOn = cert.issuedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const buf = await buildCertificateDocx(
    {
      number: cert.number,
      title: cert.title,
      mention: cert.mention,
      parcours: cert.parcours,
      hours: cert.hours,
      recipientName: cert.recipientName,
      issuedOn,
      status: cert.status,
      signatoryName: cert.signatoryName,
      signatoryTitle: cert.signatoryTitle,
    },
    { orgName: org?.name ?? "Établissement", orgCity: org?.city, signatureImage: config?.signatureImage, stampImage: config?.stampImage },
  );

  const filename = `certificat-${cert.number}.docx`.replace(/[^\w.-]+/g, "-");
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
