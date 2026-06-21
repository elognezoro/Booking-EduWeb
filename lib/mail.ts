import "server-only";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const SMTP_HOST = process.env.SMTP_HOST;
const APP_URL = process.env.APP_URL || "http://localhost:3000";

// Tous les e-mails de l'application partent au nom d'expéditeur « EduWeb Booking »,
// quelle que soit la configuration SMTP. On ne récupère que l'adresse depuis
// SMTP_FROM (qui peut être « Nom <adresse> » ou « adresse ») ou SMTP_USER.
const SENDER_NAME = "EduWeb Booking";
function senderFrom(): { name: string; address: string } {
  const raw = (process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@eduweb.ci").trim();
  const match = raw.match(/<([^>]+)>/);
  const address = (match ? match[1] : raw).trim();
  return { name: SENDER_NAME, address };
}

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
  }
  return transporter;
}

/** Gabarit e-mail HTML aux couleurs EduWeb. */
export function renderEmail(opts: { title: string; intro: string; rows?: [string, string][]; cta?: { label: string; href: string }; footer?: string }) {
  const rows = (opts.rows ?? [])
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#66736F;font-size:13px;width:140px">${k}</td><td style="padding:6px 0;color:#10231E;font-size:14px;font-weight:600">${v}</td></tr>`
    )
    .join("");
  const cta = opts.cta
    ? `<a href="${opts.cta.href}" style="display:inline-block;margin-top:18px;background:#064B3A;color:#fff;text-decoration:none;padding:12px 22px;border-radius:12px;font-weight:700;font-size:14px">${opts.cta.label}</a>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#F5F7F6;font-family:'Nunito Sans',Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:28px 16px">
    <div style="text-align:left;padding:4px 4px 18px">
      <span style="font-size:20px;font-weight:900;color:#064B3A">EduWeb<span style="color:#22C55E">Booking</span></span>
    </div>
    <div style="background:#fff;border:1px solid #E2E8E5;border-radius:20px;padding:26px">
      <h1 style="margin:0 0 6px;font-size:19px;color:#064B3A">${opts.title}</h1>
      <p style="margin:0 0 14px;color:#10231E;font-size:14px;line-height:1.6">${opts.intro}</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      ${cta}
    </div>
    <p style="text-align:center;color:#94A3B8;font-size:12px;margin-top:18px">
      ${opts.footer ?? "EduWeb Booking — Plateforme intelligente de réservation des ressources."}
    </p>
  </div></body></html>`;
}

/** Enregistre une notification interne ET tente l'envoi e-mail. */
export async function sendNotification(opts: {
  userId?: string | null;
  bookingId?: string | null;
  to?: string | null;
  subject: string;
  html: string;
  text?: string;
  type?: string;
}) {
  const notif = await prisma.notification.create({
    data: {
      userId: opts.userId ?? null,
      bookingId: opts.bookingId ?? null,
      channel: "EMAIL",
      type: opts.type ?? "INFO",
      subject: opts.subject,
      content: opts.text ?? opts.subject,
      status: "PENDING",
    },
  });

  const t = getTransporter();
  try {
    if (t && opts.to) {
      await t.sendMail({ from: senderFrom(), to: opts.to, subject: opts.subject, html: opts.html, text: opts.text });
    } else {
      // Mode dev sans SMTP : on journalise.
      console.info(`📧 [EduWeb Booking] (dev) « ${opts.subject} » → ${opts.to ?? "interne"}`);
    }
    await prisma.notification.update({ where: { id: notif.id }, data: { status: "SENT", sentAt: new Date() } });
  } catch (err) {
    console.error("Échec d'envoi e-mail :", err);
    await prisma.notification.update({ where: { id: notif.id }, data: { status: "FAILED" } });
  }
  return notif;
}

export { APP_URL };
