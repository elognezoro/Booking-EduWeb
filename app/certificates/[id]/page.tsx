import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { GuidePrintActions } from "@/components/help/guide-print-actions";
import { CertificateDocument } from "@/components/certificates/certificate-document";

export const dynamic = "force-dynamic";

export default async function CertificateViewPage({ params }: { params: { id: string } }) {
  const user = await requirePermission("users.manage");
  const cert = await prisma.certificate.findUnique({ where: { id: params.id } });
  if (!cert) notFound();
  const isSuper = user.roles.includes("SUPER_ADMIN");
  if (!isSuper && cert.organizationId !== user.organizationId) notFound();

  const [org, config] = await Promise.all([
    prisma.organization.findUnique({ where: { id: cert.organizationId }, select: { name: true, city: true } }),
    prisma.certificateConfig.findUnique({ where: { organizationId: cert.organizationId } }),
  ]);

  const issuedOn = cert.issuedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-secondary/20 p-6 sm:p-10">
      <style>{`@media print { @page { size: A4 landscape; margin: 12mm; } .no-print { display: none !important; } body { background: #fff; } }`}</style>

      <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between gap-2">
        <Button asChild variant="ghost"><Link href="/dashboard/admin/certificates"><ArrowLeft className="size-4" /> Journal des certificats</Link></Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline"><a href={`/api/certificates/${cert.id}/word`}><FileText className="size-4" /> Word</a></Button>
          <GuidePrintActions auto={false} />
        </div>
      </div>

      <CertificateDocument
        cert={{
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
        }}
        orgName={org?.name ?? "Établissement"}
        orgCity={org?.city}
        signatureImage={config?.signatureImage}
        stampImage={config?.stampImage}
      />
    </div>
  );
}
