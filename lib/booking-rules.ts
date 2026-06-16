// Règles métier de réservation (réf. spec §9).
import { prisma } from "./prisma";
import { parseJson } from "./json";
import {
  BLOCKING_BOOKING_STATUS,
  DEFAULT_RESOURCE_RULES,
  type ResourceRules,
} from "./enums";
import { addMinutes } from "date-fns";

/** Chevauchement de deux créneaux (pur, testable). */
export function hasTimeOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA < endB && endA > startB;
}

export interface WindowCheck {
  ok: boolean;
  errors: string[];
}

/** Vérifie la fenêtre de réservation contre les règles de la ressource. */
export function validateBookingWindow(
  rules: ResourceRules,
  start: Date,
  end: Date,
  now: Date = new Date()
): WindowCheck {
  const errors: string[] = [];
  if (!(start instanceof Date) || isNaN(start.getTime())) errors.push("Date de début invalide.");
  if (!(end instanceof Date) || isNaN(end.getTime())) errors.push("Date de fin invalide.");
  if (errors.length) return { ok: false, errors };

  if (end <= start) errors.push("La fin doit être postérieure au début.");

  const durationMin = (end.getTime() - start.getTime()) / 60000;
  if (rules.maxDurationMinutes && durationMin > rules.maxDurationMinutes) {
    const h = Math.floor(rules.maxDurationMinutes / 60);
    errors.push(`La durée dépasse le maximum autorisé (${h}h).`);
  }

  if (rules.minNoticeHours && rules.minNoticeHours > 0) {
    const minStart = addMinutes(now, rules.minNoticeHours * 60);
    if (start < minStart) {
      errors.push(`Un préavis minimum de ${rules.minNoticeHours}h est requis.`);
    }
  }

  if (start < now) errors.push("Impossible de réserver dans le passé.");

  return { ok: errors.length === 0, errors };
}

export interface ConflictResult {
  available: boolean;
  reason?: string;
  conflicts: { id: string; code: string; startAt: Date; endAt: Date }[];
  maintenanceConflict: boolean;
  remainingCapacity?: number;
  rules: ResourceRules;
}

/** Détection complète de conflit + disponibilité (DB). */
export async function checkAvailability(params: {
  resourceId: string;
  start: Date;
  end: Date;
  quantityRequested?: number;
  excludeBookingId?: string;
}): Promise<ConflictResult> {
  const { resourceId, start, end, quantityRequested = 1, excludeBookingId } = params;

  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) {
    return { available: false, reason: "Ressource introuvable.", conflicts: [], maintenanceConflict: false, rules: DEFAULT_RESOURCE_RULES };
  }

  const rules = { ...DEFAULT_RESOURCE_RULES, ...parseJson<Partial<ResourceRules>>(resource.rules, {}) };

  // Statut bloquant
  if (["UNAVAILABLE", "OUT_OF_SERVICE", "ARCHIVED"].includes(resource.status)) {
    return { available: false, reason: "Cette ressource est momentanément indisponible.", conflicts: [], maintenanceConflict: false, rules };
  }
  if (resource.status === "MAINTENANCE") {
    return { available: false, reason: "Cette ressource est en maintenance.", conflicts: [], maintenanceConflict: true, rules };
  }

  // Maintenance planifiée chevauchante
  const maintenances = await prisma.maintenance.findMany({
    where: {
      resourceId,
      status: { in: ["PLANNED", "IN_PROGRESS"] },
      startAt: { lt: end },
      endAt: { gt: start },
    },
  });
  if (maintenances.length > 0) {
    return { available: false, reason: "Une maintenance est planifiée sur ce créneau.", conflicts: [], maintenanceConflict: true, rules };
  }

  // Réservations chevauchantes (statuts bloquants)
  const overlapping = await prisma.booking.findMany({
    where: {
      resourceId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { in: BLOCKING_BOOKING_STATUS },
      startAt: { lt: end },
      endAt: { gt: start },
    },
    select: { id: true, code: true, startAt: true, endAt: true, quantityRequested: true },
  });

  // Mode partagé : on compare la quantité demandée à la capacité restante.
  if (rules.bookingMode === "partial" || rules.bookingMode === "mixed") {
    const total = resource.quantityTotal ?? resource.capacity ?? 1;
    const used = overlapping.reduce((sum, b) => sum + (b.quantityRequested ?? 1), 0);
    const remaining = total - used;
    if (quantityRequested > remaining) {
      return {
        available: false,
        reason: `Quantité insuffisante : ${remaining} disponible(s) sur ce créneau.`,
        conflicts: overlapping,
        maintenanceConflict: false,
        remainingCapacity: Math.max(0, remaining),
        rules,
      };
    }
    return { available: true, conflicts: [], maintenanceConflict: false, remainingCapacity: remaining - quantityRequested, rules };
  }

  // Mode exclusif : tout chevauchement bloque.
  if (overlapping.length > 0) {
    return {
      available: false,
      reason: "Cette ressource est déjà réservée sur ce créneau.",
      conflicts: overlapping,
      maintenanceConflict: false,
      rules,
    };
  }

  return { available: true, conflicts: [], maintenanceConflict: false, rules };
}

/* ------------------------------------------------------------------ */
/* Plan de salle (réservation poste par poste)                          */
/* ------------------------------------------------------------------ */
export interface SeatInfo {
  number: number;
  occupied: boolean;
  occupiedUntil?: string; // ISO — moment où le poste redevient libre
}

/**
 * Calcule l'état de chaque poste d'une salle pour un créneau donné.
 * Un poste est occupé s'il figure dans une réservation bloquante qui chevauche [start,end].
 * `occupiedUntil` = fin la plus tardive parmi ces réservations (donc dispo à partir de là).
 */
export async function getSeatMap(params: {
  resourceId: string;
  capacity: number;
  start: Date;
  end: Date;
  excludeBookingId?: string;
}): Promise<SeatInfo[]> {
  const { resourceId, capacity, start, end, excludeBookingId } = params;

  const overlapping = await prisma.booking.findMany({
    where: {
      resourceId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { in: BLOCKING_BOOKING_STATUS },
      startAt: { lt: end },
      endAt: { gt: start },
      seatNumbers: { not: null },
    },
    select: { endAt: true, seatNumbers: true },
  });

  const occupiedUntil = new Map<number, Date>();
  for (const b of overlapping) {
    const seats = parseJson<number[]>(b.seatNumbers, []);
    for (const s of seats) {
      const cur = occupiedUntil.get(s);
      if (!cur || b.endAt > cur) occupiedUntil.set(s, b.endAt);
    }
  }

  const seats: SeatInfo[] = [];
  for (let n = 1; n <= capacity; n++) {
    const until = occupiedUntil.get(n);
    seats.push({ number: n, occupied: !!until, occupiedUntil: until?.toISOString() });
  }
  return seats;
}

/** Vérifie que des postes précis sont libres sur le créneau. */
export async function checkSeatsAvailable(params: {
  resourceId: string;
  capacity: number;
  start: Date;
  end: Date;
  seatNumbers: number[];
  excludeBookingId?: string;
}): Promise<{ ok: boolean; conflicting: number[] }> {
  const map = await getSeatMap(params);
  const occupied = new Set(map.filter((s) => s.occupied).map((s) => s.number));
  const conflicting = params.seatNumbers.filter((n) => occupied.has(n) || n < 1 || n > params.capacity);
  return { ok: conflicting.length === 0, conflicting };
}

/** Propose le prochain créneau libre de même durée (suggestion simple). */
export async function suggestNextSlot(params: {
  resourceId: string;
  start: Date;
  end: Date;
  quantityRequested?: number;
}): Promise<{ start: Date; end: Date } | null> {
  const durationMs = params.end.getTime() - params.start.getTime();
  let cursorStart = new Date(params.end);
  for (let i = 0; i < 16; i++) {
    const cursorEnd = new Date(cursorStart.getTime() + durationMs);
    // Respecter une plage horaire de bureau simple : 07h–19h.
    if (cursorEnd.getHours() > 19 || (cursorEnd.getHours() === 19 && cursorEnd.getMinutes() > 0)) {
      cursorStart = new Date(cursorStart);
      cursorStart.setDate(cursorStart.getDate() + 1);
      cursorStart.setHours(8, 0, 0, 0);
      continue;
    }
    const check = await checkAvailability({
      resourceId: params.resourceId,
      start: cursorStart,
      end: cursorEnd,
      quantityRequested: params.quantityRequested,
    });
    if (check.available) return { start: cursorStart, end: cursorEnd };
    cursorStart = new Date(cursorStart.getTime() + 30 * 60000);
  }
  return null;
}
