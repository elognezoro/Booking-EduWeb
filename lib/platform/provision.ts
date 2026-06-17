import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ROLE_META, type RoleKey } from "@/lib/enums";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { provisionLibrary } from "@/lib/library/provision";

export interface ProvisionOpts {
  name: string;
  acronym: string;
  slug: string;
  city?: string;
  color?: string;
  plan?: string;
  seats?: number;
  adminEmail: string;
  adminFirst: string;
  adminLast: string;
  adminPassword?: string;
  ministryId?: string; // ministère de tutelle
}

/**
 * Provisionne un établissement complet (multi-tenant) : organisation + abonnement + rôles & permissions
 * + site/services + administrateur + catégorie/ressource de démarrage + espace bibliothèque.
 * Version exécutable à la demande (admin plateforme) de la logique du seed.
 */
export async function provisionInstitution(opts: ProvisionOpts) {
  const color = opts.color || "#064B3A";
  const city = opts.city || "Abidjan";
  const password = opts.adminPassword || "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  const inst = await prisma.organization.create({
    data: {
      name: opts.name,
      acronym: opts.acronym,
      slug: opts.slug,
      isPlatform: false,
      country: "Côte d'Ivoire",
      city,
      primaryColor: color,
      status: "ACTIVE",
      ministryId: opts.ministryId || null,
      settings: { create: { language: "fr", timezone: "Africa/Abidjan", allowAutoValidation: false } },
      subscription: { create: { plan: opts.plan || "STANDARD", status: "ACTIVE", seats: opts.seats ?? 100 } },
    },
  });

  // Rôles propres à l'établissement (le super admin reste global, hors établissement).
  const perms = await prisma.permission.findMany();
  const permByKey = new Map(perms.map((p) => [p.key, p.id]));
  const roleId = new Map<RoleKey, string>();
  for (const key of Object.keys(ROLE_META) as RoleKey[]) {
    if (key === "SUPER_ADMIN") continue;
    const meta = ROLE_META[key];
    const role = await prisma.role.create({
      data: {
        organizationId: inst.id,
        key,
        name: meta.label,
        description: meta.description,
        color: meta.color,
        isSystem: true,
        permissions: {
          create: (ROLE_PERMISSIONS[key] ?? [])
            .filter((pk) => permByKey.has(pk))
            .map((pk) => ({ permissionId: permByKey.get(pk)! })),
        },
      },
    });
    roleId.set(key, role.id);
  }

  const site = await prisma.site.create({ data: { organizationId: inst.id, name: `Campus ${city}`, code: "MAIN", city } });
  const dir = await prisma.department.create({ data: { organizationId: inst.id, siteId: site.id, name: "Direction", code: "DIR" } });
  await prisma.department.create({ data: { organizationId: inst.id, siteId: site.id, parentId: dir.id, name: "Scolarité", code: "SCOL" } });
  await prisma.department.create({ data: { organizationId: inst.id, siteId: site.id, parentId: dir.id, name: "Service Informatique", code: "DSI" } });

  const admin = await prisma.user.create({
    data: {
      email: opts.adminEmail,
      passwordHash,
      firstName: opts.adminFirst,
      lastName: opts.adminLast,
      functionTitle: "Administrateur",
      organizationId: inst.id,
      departmentId: dir.id,
      status: "ACTIVE",
      roles: { create: { roleId: roleId.get("ORG_ADMIN")! } },
    },
  });

  const cat = await prisma.resourceCategory.create({
    data: { organizationId: inst.id, name: "Salles de réunion", code: "SR", icon: "Users", color, validationMode: "SIMPLE" },
  });
  await prisma.resource.create({
    data: {
      organizationId: inst.id,
      categoryId: cat.id,
      siteId: site.id,
      departmentId: dir.id,
      managerId: admin.id,
      name: "Salle de réunion principale",
      code: "SR-01",
      status: "AVAILABLE",
      capacity: 20,
      location: `Campus ${city}`,
      description: "Salle de réunion équipée.",
      rules: JSON.stringify({ bookingMode: "exclusive", maxDurationMinutes: 10080, minNoticeHours: 1, requiresValidation: true }),
    },
  });

  // Espace de dépôt (bibliothèque + collections + domaines) activé par défaut.
  await provisionLibrary(prisma, { organizationId: inst.id, departmentId: dir.id, acronym: opts.acronym });

  return { organization: inst, adminEmail: opts.adminEmail, adminPassword: password };
}
