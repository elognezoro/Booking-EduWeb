"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { checkAvailability, validateBookingWindow, suggestNextSlot, getSeatMap, checkSeatsAvailable, type SeatInfo } from "@/lib/booking-rules";
import { generateBookingCode } from "@/lib/booking-code";
import { parseJson, stringifyJson } from "@/lib/json";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { DEFAULT_RESOURCE_RULES, USAGE_TYPES, type ResourceRules } from "@/lib/enums";
import { fmtRange } from "@/lib/dates";

/* ----------------------- Vérification de créneau (UI) ----------------------- */
export interface SlotCheck {
  ok: boolean;
  available: boolean;
  reason?: string;
  errors: string[];
  conflicts: { code: string; startAt: string; endAt: string }[];
  suggestion?: { start: string; end: string } | null;
  seatBased?: boolean;
  capacity?: number;
  seats?: SeatInfo[];
}

function isSeatBased(rules: ResourceRules, capacity: number | null) {
  return !!rules.seatBased && (rules.bookingMode === "partial" || rules.bookingMode === "mixed") && !!capacity;
}

export async function checkSlotAction(input: {
  resourceId: string;
  start: string;
  end: string;
  quantityRequested?: number;
}): Promise<SlotCheck> {
  await requirePermission("bookings.create");
  const start = new Date(input.start);
  const end = new Date(input.end);

  const resource = await prisma.resource.findUnique({ where: { id: input.resourceId } });
  if (!resource) return { ok: false, available: false, errors: ["Ressource introuvable."], conflicts: [] };

  const rules: ResourceRules = { ...DEFAULT_RESOURCE_RULES, ...parseJson<Partial<ResourceRules>>(resource.rules, {}) };
  const window = validateBookingWindow(rules, start, end);
  if (!window.ok) {
    return { ok: false, available: false, errors: window.errors, conflicts: [] };
  }

  // Salle à postes : renvoyer le plan de salle pour le créneau.
  const capacity = resource.capacity ?? resource.quantityTotal ?? null;
  if (isSeatBased(rules, capacity)) {
    const seats = await getSeatMap({ resourceId: resource.id, capacity: capacity!, start, end });
    const free = seats.filter((s) => !s.occupied).length;
    return {
      ok: true,
      available: free > 0,
      reason: free > 0 ? undefined : "Aucun poste libre sur ce créneau.",
      errors: [],
      conflicts: [],
      suggestion: null,
      seatBased: true,
      capacity: capacity!,
      seats,
    };
  }

  const check = await checkAvailability({ resourceId: input.resourceId, start, end, quantityRequested: input.quantityRequested ?? 1 });
  let suggestion: { start: string; end: string } | null = null;
  if (!check.available) {
    const next = await suggestNextSlot({ resourceId: input.resourceId, start, end, quantityRequested: input.quantityRequested ?? 1 });
    if (next) suggestion = { start: next.start.toISOString(), end: next.end.toISOString() };
  }

  return {
    ok: true,
    available: check.available,
    reason: check.reason,
    errors: [],
    conflicts: check.conflicts.map((c) => ({ code: c.code, startAt: c.startAt.toISOString(), endAt: c.endAt.toISOString() })),
    suggestion,
  };
}

/* ----------------------------- Création ----------------------------- */
const createSchema = z.object({
  resourceId: z.string().min(1, "Ressource requise."),
  title: z.string().optional(),
  purpose: z.string().min(3, "Le motif est requis."),
  usageType: z.enum(USAGE_TYPES),
  participantCount: z.coerce.number().int().positive().optional(),
  quantityRequested: z.coerce.number().int().positive().optional(),
  seatNumbers: z.string().optional(),
  start: z.string().min(1, "Date de début requise."),
  end: z.string().min(1, "Date de fin requise."),
  specialNeeds: z.string().optional(),
  needsSupport: z.string().optional(),
  requesterNote: z.string().optional(),
});

export interface BookingFormState {
  error?: string;
}

export async function createBooking(_prev: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const user = await requirePermission("bookings.create");

  const parsed = createSchema.safeParse({
    resourceId: formData.get("resourceId"),
    title: formData.get("title") || undefined,
    purpose: formData.get("purpose"),
    usageType: formData.get("usageType"),
    participantCount: formData.get("participantCount") || undefined,
    quantityRequested: formData.get("quantityRequested") || undefined,
    seatNumbers: formData.get("seatNumbers") || undefined,
    start: formData.get("start"),
    end: formData.get("end"),
    specialNeeds: formData.get("specialNeeds") || undefined,
    needsSupport: formData.get("needsSupport") || undefined,
    requesterNote: formData.get("requesterNote") || undefined,
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides." };
  const d = parsed.data;
  const start = new Date(d.start);
  const end = new Date(d.end);

  const resource = await prisma.resource.findFirst({
    where: { id: d.resourceId, organizationId: user.organizationId ?? undefined },
    include: { category: true, department: true, organization: true },
  });
  if (!resource) return { error: "Ressource introuvable." };

  const rules: ResourceRules = { ...DEFAULT_RESOURCE_RULES, ...parseJson<Partial<ResourceRules>>(resource.rules, {}) };

  const window = validateBookingWindow(rules, start, end);
  if (!window.ok) return { error: window.errors[0] };

  // Salle à postes : on réserve des postes précis.
  const capacity = resource.capacity ?? resource.quantityTotal ?? null;
  const seatBased = isSeatBased(rules, capacity);
  let seatNumbers: number[] = [];
  if (seatBased) {
    seatNumbers = parseJson<number[]>(d.seatNumbers, []).filter((n) => Number.isInteger(n));
    if (seatNumbers.length === 0) return { error: "Sélectionnez au moins un poste sur le plan de salle." };
    const seatCheck = await checkSeatsAvailable({ resourceId: d.resourceId, capacity: capacity!, start, end, seatNumbers });
    if (!seatCheck.ok) return { error: `Des postes sélectionnés ne sont plus disponibles (n° ${seatCheck.conflicting.join(", ")}).` };
  } else {
    const check = await checkAvailability({ resourceId: d.resourceId, start, end, quantityRequested: d.quantityRequested ?? 1 });
    if (!check.available) return { error: check.reason ?? "Ce créneau n'est pas disponible." };
  }

  // Validation automatique ?
  const auto = resource.category.validationMode === "AUTO" || rules.requiresValidation === false;
  const status = auto ? "APPROVED" : "PENDING_VALIDATION";

  const code = await generateBookingCode({
    organizationId: resource.organizationId,
    orgAcronym: resource.organization.acronym,
    departmentCode: resource.department?.code,
    categoryCode: resource.category.code,
    country: resource.organization.country,
  });

  const booking = await prisma.booking.create({
    data: {
      organizationId: resource.organizationId,
      resourceId: resource.id,
      requesterId: user.id,
      code,
      title: d.title || null,
      purpose: d.purpose,
      usageType: d.usageType,
      participantCount: d.participantCount ?? (seatBased ? seatNumbers.length : null),
      quantityRequested: seatBased ? seatNumbers.length : d.quantityRequested ?? 1,
      seatNumbers: seatBased ? stringifyJson(seatNumbers) : null,
      startAt: start,
      endAt: end,
      status,
      needsSupport: d.needsSupport === "on",
      specialNeeds: d.specialNeeds || null,
      requesterNote: d.requesterNote || null,
      history: { create: { status, comment: auto ? "Validation automatique" : "Demande soumise", changedBy: user.id } },
    },
  });

  // Notifications
  await sendNotification({
    userId: user.id,
    bookingId: booking.id,
    to: user.email,
    type: auto ? "BOOKING_APPROVED" : "BOOKING_SUBMITTED",
    subject: `${auto ? "Réservation confirmée" : "Demande enregistrée"} — ${resource.name}`,
    html: renderEmail({
      title: auto ? "Réservation confirmée" : "Demande de réservation enregistrée",
      intro: auto
        ? "Votre réservation est validée automatiquement."
        : "Votre demande a bien été enregistrée et est en attente de validation.",
      rows: [["Ressource", resource.name], ["Créneau", fmtRange(start, end)], ["Motif", d.purpose], ["Code", code]],
      cta: { label: "Voir la réservation", href: `${APP_URL}/dashboard/bookings/${booking.id}` },
    }),
  });

  if (!auto && resource.managerId) {
    const manager = await prisma.user.findUnique({ where: { id: resource.managerId } });
    if (manager) {
      await sendNotification({
        userId: manager.id,
        bookingId: booking.id,
        to: manager.email,
        type: "BOOKING_PENDING",
        subject: `Nouvelle demande à valider — ${resource.name}`,
        html: renderEmail({
          title: "Nouvelle demande de réservation",
          intro: `${user.fullName} demande à réserver « ${resource.name} ».`,
          rows: [["Créneau", fmtRange(start, end)], ["Motif", d.purpose], ["Code", code]],
          cta: { label: "Examiner la demande", href: `${APP_URL}/dashboard/bookings/${booking.id}` },
        }),
      });
    }
  }

  await audit({ organizationId: resource.organizationId, userId: user.id, action: "booking.create", entityType: "Booking", entityId: booking.id, newValue: { code, status } });

  revalidatePath("/dashboard/bookings");
  redirect(`/dashboard/bookings/${booking.id}?created=1`);
}

/* ----------------------------- Décisions ----------------------------- */
async function changeStatus(bookingId: string, status: string, comment: string | undefined, action: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { resource: true, requester: true } });
  if (!booking) redirect("/dashboard/bookings");

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
      rejectionReason: status === "REJECTED" ? comment ?? null : booking.rejectionReason,
      checkedInAt: status === "IN_PROGRESS" ? new Date() : booking.checkedInAt,
      completedAt: ["COMPLETED", "CLOSED_WITHOUT_INCIDENT"].includes(status) ? new Date() : booking.completedAt,
      history: { create: { status, comment, changedBy: user.id } },
    },
  });
  await audit({ organizationId: booking.organizationId, userId: user.id, action, entityType: "Booking", entityId: bookingId, newValue: { status, comment } });
  return { user, booking };
}

export async function approveBooking(formData: FormData) {
  const user = await requirePermission("bookings.validate");
  const bookingId = String(formData.get("bookingId"));
  const comment = (formData.get("comment") as string) || undefined;
  const { booking } = await changeStatus(bookingId, "APPROVED", comment, "booking.approve");
  await prisma.bookingValidation.create({ data: { bookingId, validatorId: user.id, status: "APPROVED", comment, validatedAt: new Date() } });
  await sendNotification({
    userId: booking.requesterId, bookingId, to: booking.requester.email, type: "BOOKING_APPROVED",
    subject: `Réservation validée — ${booking.resource.name}`,
    html: renderEmail({ title: "Réservation validée ✅", intro: "Bonne nouvelle, votre demande a été approuvée.", rows: [["Ressource", booking.resource.name], ["Créneau", fmtRange(booking.startAt, booking.endAt)], ["Code", booking.code]], cta: { label: "Voir la réservation", href: `${APP_URL}/dashboard/bookings/${bookingId}` } }),
  });
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  revalidatePath("/dashboard/bookings/pending");
  redirect(`/dashboard/bookings/${bookingId}`);
}

export async function rejectBooking(formData: FormData) {
  const user = await requirePermission("bookings.reject");
  const bookingId = String(formData.get("bookingId"));
  const comment = (formData.get("comment") as string) || "Demande refusée.";
  const { booking } = await changeStatus(bookingId, "REJECTED", comment, "booking.reject");
  await prisma.bookingValidation.create({ data: { bookingId, validatorId: user.id, status: "REJECTED", comment, validatedAt: new Date() } });
  await sendNotification({
    userId: booking.requesterId, bookingId, to: booking.requester.email, type: "BOOKING_REJECTED",
    subject: `Réservation refusée — ${booking.resource.name}`,
    html: renderEmail({ title: "Réservation refusée", intro: "Votre demande n'a pas pu être approuvée.", rows: [["Ressource", booking.resource.name], ["Créneau", fmtRange(booking.startAt, booking.endAt)], ["Motif du refus", comment]], cta: { label: "Voir le détail", href: `${APP_URL}/dashboard/bookings/${bookingId}` } }),
  });
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  revalidatePath("/dashboard/bookings/pending");
  redirect(`/dashboard/bookings/${bookingId}`);
}

export async function cancelBooking(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const bookingId = String(formData.get("bookingId"));
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) redirect("/dashboard/bookings");
  const isOwner = booking.requesterId === user.id;
  const canAll = user.permissions.has("bookings.cancel_all");
  if (!isOwner && !canAll) redirect(`/dashboard/bookings/${bookingId}`);
  await changeStatus(bookingId, isOwner ? "CANCELLED_BY_USER" : "CANCELLED_BY_ADMIN", "Annulation", "booking.cancel");
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  redirect(`/dashboard/bookings/${bookingId}`);
}

export async function checkInBooking(formData: FormData) {
  await requirePermission("bookings.read_own");
  const bookingId = String(formData.get("bookingId"));
  await changeStatus(bookingId, "IN_PROGRESS", "Présence confirmée", "booking.checkin");
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  redirect(`/dashboard/bookings/${bookingId}`);
}

export async function completeBooking(formData: FormData) {
  await requirePermission("bookings.read_own");
  const bookingId = String(formData.get("bookingId"));
  await changeStatus(bookingId, "COMPLETED", "Activité terminée", "booking.complete");
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  redirect(`/dashboard/bookings/${bookingId}`);
}
