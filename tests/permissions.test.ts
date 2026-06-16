import { describe, it, expect } from "vitest";
import { can, canAny, permissionsForRoles, ROLE_PERMISSIONS } from "@/lib/permissions";

describe("RBAC", () => {
  it("le super admin a toutes les permissions", () => {
    expect(can(["SUPER_ADMIN"], "platform.manage")).toBe(true);
    expect(can(["SUPER_ADMIN"], "bookings.validate")).toBe(true);
  });

  it("le demandeur ne peut pas valider", () => {
    expect(can(["REQUESTER"], "bookings.validate")).toBe(false);
    expect(can(["REQUESTER"], "bookings.create")).toBe(true);
  });

  it("le validateur peut valider mais pas gérer l'organisation", () => {
    expect(can(["VALIDATOR"], "bookings.validate")).toBe(true);
    expect(can(["VALIDATOR"], "organization.manage")).toBe(false);
  });

  it("cumule les permissions de plusieurs rôles", () => {
    const perms = permissionsForRoles(["REQUESTER", "TECHNICIAN"]);
    expect(perms.has("bookings.create")).toBe(true);
    expect(perms.has("incidents.manage")).toBe(true);
  });

  it("canAny renvoie vrai si au moins une permission est accordée", () => {
    expect(canAny(["REQUESTER"], ["organization.manage", "bookings.create"])).toBe(true);
    expect(canAny(["VISITOR"], ["organization.manage", "users.manage"])).toBe(false);
  });

  it("aucun rôle d'organisation ne détient platform.manage hormis le super admin", () => {
    for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      if (role !== "SUPER_ADMIN") expect(perms).not.toContain("platform.manage");
    }
  });
});
