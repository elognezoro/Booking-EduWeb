import { describe, it, expect } from "vitest";
import { hasTimeOverlap, validateBookingWindow } from "@/lib/booking-rules";
import type { ResourceRules } from "@/lib/enums";

describe("hasTimeOverlap", () => {
  const base = new Date("2026-06-16T09:00:00");
  const baseEnd = new Date("2026-06-16T11:00:00");

  it("détecte un chevauchement partiel", () => {
    expect(hasTimeOverlap(base, baseEnd, new Date("2026-06-16T10:00:00"), new Date("2026-06-16T12:00:00"))).toBe(true);
  });

  it("ne détecte pas de chevauchement pour des créneaux adjacents", () => {
    expect(hasTimeOverlap(base, baseEnd, new Date("2026-06-16T11:00:00"), new Date("2026-06-16T12:00:00"))).toBe(false);
  });

  it("détecte un créneau totalement inclus", () => {
    expect(hasTimeOverlap(base, baseEnd, new Date("2026-06-16T09:30:00"), new Date("2026-06-16T10:00:00"))).toBe(true);
  });

  it("ne détecte rien pour des créneaux disjoints", () => {
    expect(hasTimeOverlap(base, baseEnd, new Date("2026-06-16T13:00:00"), new Date("2026-06-16T14:00:00"))).toBe(false);
  });
});

describe("validateBookingWindow", () => {
  const rules: ResourceRules = { bookingMode: "exclusive", maxDurationMinutes: 240, minNoticeHours: 2 };
  const now = new Date("2026-06-16T08:00:00");

  it("accepte un créneau valide", () => {
    const r = validateBookingWindow(rules, new Date("2026-06-16T11:00:00"), new Date("2026-06-16T13:00:00"), now);
    expect(r.ok).toBe(true);
  });

  it("refuse une fin avant le début", () => {
    const r = validateBookingWindow(rules, new Date("2026-06-16T13:00:00"), new Date("2026-06-16T11:00:00"), now);
    expect(r.ok).toBe(false);
  });

  it("refuse un dépassement de durée maximale", () => {
    const r = validateBookingWindow(rules, new Date("2026-06-16T11:00:00"), new Date("2026-06-16T16:00:00"), now);
    expect(r.ok).toBe(false);
  });

  it("refuse un préavis insuffisant", () => {
    const r = validateBookingWindow(rules, new Date("2026-06-16T09:00:00"), new Date("2026-06-16T10:00:00"), now);
    expect(r.ok).toBe(false);
  });

  it("refuse une réservation dans le passé", () => {
    const r = validateBookingWindow(rules, new Date("2026-06-16T06:00:00"), new Date("2026-06-16T07:00:00"), now);
    expect(r.ok).toBe(false);
  });
});
