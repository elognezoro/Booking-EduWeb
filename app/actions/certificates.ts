"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { certPrefix, nextCertificateNumber, DEFAULT_CERT_TITLE, DEFAULT_CERT_MENTION } from "@/lib/certificates/number";

const CERT_PATH = "/dashboard/admin/certificates";
const MAX_IMAGE_BYTES = 1_500_000; // ~1,5 Mo de data URL

function cleanImage(value: FormDataEntryValue | null): string | null | undefined {
  // undefined = inchangé ; null = à retirer ; string = nouvelle image
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) return undefined;
  if (v === "__REMOVE__") return null;
  if (!v.startsWith("data:image/")) return undefined;
  if (v.length > MAX_IMAGE_BYTES) return undefined;
  return v;
}

function normalizePrefix(raw: string): string | null {
  const cleaned = raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 12);
  return cleaned || null;
}

/* ----------------------------- Configuration ----------------------------- */
export async function saveCertificateConfig(formData: FormData) {
  const user = await requirePermission("users.manage");
  const orgId = user.organizationId;
  if (!orgId) redirect(`${CERT_PATH}?error=org`);

  const signatoryName = String(formData.get("signatoryName") || "").trim() || null;
  const signatoryTitle = String(formData.get("signatoryTitle") || "").trim() || null;
  const prefix = normalizePrefix(String(formData.get("prefix") || ""));

  const existing = await prisma.certificateConfig.findUnique({ where: { organizationId: orgId } });
  const sigNew = cleanImage(formData.get("signatureImage"));
  const stampNew = cleanImage(formData.get("stampImage"));
  const signatureImage = sigNew === undefined ? existing?.signatureImage ?? null : sigNew;
  const stampImage = stampNew === undefined ? existing?.stampImage ?? null : stampNew;

  await prisma.certificateConfig.upsert({
    where: { organizationId: orgId },
    create: { organizationId: orgId, signatoryName, signatoryTitle, prefix, signatureImage, stampImage },
    update: { signatoryName, signatoryTitle, prefix, signatureImage, stampImage },
  });
  await audit({ organizationId: orgId, userId: user.id, action: "certificate.config", entityType: "CertificateConfig", entityId: orgId });
  revalidatePath(CERT_PATH);
  redirect(`${CERT_PATH}?savedConfig=1`);
}

/* ------------------------------- Émission -------------------------------- */
export async function issueCertificate(formData: FormData) {
  const user = await requirePermission("users.manage");
  const orgId = user.organizationId;
  if (!orgId) redirect(`${CERT_PATH}?error=org`);

  const recipientName = String(formData.get("recipientName") || "").trim();
  if (!recipientName) redirect(`${CERT_PATH}?error=recipient`);

  const title = String(formData.get("title") || "").trim() || DEFAULT_CERT_TITLE;
  const mention = String(formData.get("mention") || "").trim() || DEFAULT_CERT_MENTION;
  const parcours = String(formData.get("parcours") || "").trim() || null;
  const hours = String(formData.get("hours") || "").trim() || null;
  const recipientUserId = String(formData.get("recipientUserId") || "").trim() || null;

  const [org, config] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId }, select: { name: true, acronym: true } }),
    prisma.certificateConfig.findUnique({ where: { organizationId: orgId } }),
  ]);

  const year = new Date().getFullYear();
  const prefix = certPrefix(config?.prefix, org?.acronym, org?.name ?? "EduWeb");
  const { seq, number } = await nextCertificateNumber(orgId, prefix, year);

  const cert = await prisma.certificate.create({
    data: {
      organizationId: orgId,
      number,
      seq,
      year,
      title,
      mention,
      parcours,
      hours,
      recipientName,
      recipientUserId,
      issuedById: user.id,
      issuedByName: user.fullName,
      signatoryName: config?.signatoryName ?? null,
      signatoryTitle: config?.signatoryTitle ?? null,
    },
  });
  await audit({ organizationId: orgId, userId: user.id, action: "certificate.issue", entityType: "Certificate", entityId: cert.id, newValue: { number, recipientName } });
  revalidatePath(CERT_PATH);
  redirect(`/certificates/${cert.id}?issued=1`);
}

/* ------------------------------- Révocation ------------------------------ */
export async function revokeCertificate(formData: FormData) {
  const user = await requirePermission("users.manage");
  const orgId = user.organizationId;
  const id = String(formData.get("id") || "");
  const cert = await prisma.certificate.findUnique({ where: { id }, select: { organizationId: true, number: true } });
  if (!cert || cert.organizationId !== orgId) redirect(`${CERT_PATH}?error=notfound`);
  await prisma.certificate.update({ where: { id }, data: { status: "REVOKED" } });
  await audit({ organizationId: orgId, userId: user.id, action: "certificate.revoke", entityType: "Certificate", entityId: id, newValue: { number: cert.number } });
  revalidatePath(CERT_PATH);
  redirect(`${CERT_PATH}?revoked=1`);
}
