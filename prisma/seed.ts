/* EduWeb Booking — Données de démonstration (ENS d'Abidjan / Sous-Direction APRID). */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PERMISSIONS, PERMISSION_LABELS, ROLE_PERMISSIONS } from "../lib/permissions";
import { ROLE_META, type RoleKey } from "../lib/enums";
import { DEFAULT_COLLECTIONS, DEFAULT_DOMAINS } from "../lib/library/enums";
import { provisionLibrary } from "../lib/library/provision";
import { QUIZ_SEED } from "../lib/games/quiz-seed";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "password123";

async function clear() {
  // Ordre de dépendance (enfants -> parents).
  // --- Module Library ---
  await prisma.documentDuplicateWarning.deleteMany();
  await prisma.documentLoan.deleteMany();
  await prisma.documentReservation.deleteMany();
  await prisma.documentDownload.deleteMany();
  await prisma.documentConsultation.deleteMany();
  await prisma.documentReview.deleteMany();
  await prisma.documentAuthor.deleteMany();
  await prisma.documentResource.deleteMany();
  await prisma.documentCollection.deleteMany();
  await prisma.documentDomain.deleteMany();
  await prisma.digitalLibrary.deleteMany();
  await prisma.documentCodeCounter.deleteMany();
  // --- Sport cérébral ---
  await prisma.brainSportQuestion.deleteMany();
  await prisma.brainSportAttempt.deleteMany();
  await prisma.brainSportBadge.deleteMany();
  // --- Réservations de ressources ---
  await prisma.bookingReview.deleteMany();
  await prisma.bookingParticipant.deleteMany();
  await prisma.bookingStatusHistory.deleteMany();
  await prisma.bookingValidation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.resourceCategory.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.organizationSetting.deleteMany();
  await prisma.department.deleteMany();
  await prisma.site.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
}

function at(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  console.log("🌱 Nettoyage…");
  await clear();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("🏛️  Organisation ENS d'Abidjan…");
  const org = await prisma.organization.create({
    data: {
      name: "ENS d'Abidjan",
      acronym: "ENS",
      slug: "ens-abidjan",
      isPlatform: false,
      country: "Côte d'Ivoire",
      city: "Abidjan",
      address: "08 BP 10 Abidjan 08, Côte d'Ivoire",
      primaryColor: "#064B3A",
      settings: {
        create: {
          language: "fr",
          timezone: "Africa/Abidjan",
          allowAutoValidation: false,
          workingDays: JSON.stringify(["MON", "TUE", "WED", "THU", "FRI"]),
          openingHours: JSON.stringify({ start: "07:30", end: "19:00" }),
          holidays: JSON.stringify(["2026-08-07", "2026-08-15"]),
        },
      },
      subscription: {
        create: { plan: "PILOTE", status: "ACTIVE", seats: 200, renewsAt: at(365, 9) },
      },
    },
  });

  // Organisation plateforme (pour le Super Admin EduWeb)
  const eduweb = await prisma.organization.create({
    data: { name: "EduWeb", acronym: "EW", slug: "eduweb", isPlatform: true, country: "Côte d'Ivoire", city: "Abidjan", primaryColor: "#064B3A" },
  });

  console.log("📍 Sites & services…");
  const mainSite = await prisma.site.create({
    data: { organizationId: org.id, name: "Campus principal ENS d'Abidjan", code: "ENS-MAIN", city: "Abidjan" },
  });
  await prisma.site.create({
    data: { organizationId: org.id, name: "Antenne ENS d'Abidjan", code: "ENS-ABJ", city: "Abidjan" },
  });
  await prisma.site.create({
    data: { organizationId: org.id, name: "Antenne ENS de Bouaké", code: "ENS-BKE", city: "Bouaké" },
  });

  // Niveaux organisationnels (départements de premier niveau : parentId = null)
  const niveau = async (name: string, code: string) =>
    prisma.department.create({ data: { organizationId: org.id, siteId: mainSite.id, name, code } });
  const direction = await niveau("Direction", "DIR");
  const sdaf = await niveau("Sous-Direction Administration et Finances", "SDAF");
  const aprid = await niveau("Sous-Direction des APRID", "APRID");
  const cfi = await niveau("Direction du Centre de Formation Initiale", "CFI");
  const cfc = await niveau("Direction du Centre de Formation Continue", "CFC");
  const crep = await niveau("Direction du Centre de Recherche en Education et Production", "CREP");

  // Services rattachés à un niveau (parentId renseigné)
  const addService = async (parentId: string, name: string, code: string) =>
    prisma.department.create({ data: { organizationId: org.id, siteId: mainSite.id, parentId, name, code } });
  const biblio = await addService(aprid.id, "Bibliothèque", "BIB");
  const labo = await addService(aprid.id, "Laboratoire informatique", "LAB");
  await addService(aprid.id, "Service Audiovisuel", "AV");
  await addService(direction.id, "Secrétariat de Direction", "SEC");
  await addService(direction.id, "Service Communication", "COM");
  await addService(sdaf.id, "Service du Personnel", "RH");
  await addService(sdaf.id, "Service Financier et Comptable", "FIN");
  await addService(sdaf.id, "Service du Matériel et de la Logistique", "LOG");
  await addService(cfi.id, "Scolarité (Formation Initiale)", "SCOL-FI");
  await addService(cfi.id, "Service des Stages", "STAGE");
  await addService(cfc.id, "Inscriptions (Formation Continue)", "INSC-FC");
  await addService(cfc.id, "Service des Formations", "FORM");
  await addService(crep.id, "Service de la Recherche", "RECH");
  await addService(crep.id, "Service des Publications", "PUB");

  console.log("🔐 Permissions & rôles…");
  // Catalogue de permissions
  for (const key of PERMISSIONS) {
    await prisma.permission.create({ data: { key, description: PERMISSION_LABELS[key] } });
  }
  const allPerms = await prisma.permission.findMany();
  const permByKey = new Map(allPerms.map((p) => [p.key, p.id]));

  const roleKeys = Object.keys(ROLE_META) as RoleKey[];
  const roleByKey = new Map<RoleKey, string>();
  for (const key of roleKeys) {
    const meta = ROLE_META[key];
    const isPlatform = key === "SUPER_ADMIN";
    const role = await prisma.role.create({
      data: {
        organizationId: isPlatform ? eduweb.id : org.id,
        key,
        name: meta.label,
        description: meta.description,
        color: meta.color,
        isSystem: true,
        permissions: {
          create: ROLE_PERMISSIONS[key].map((pk) => ({ permissionId: permByKey.get(pk)! })),
        },
      },
    });
    roleByKey.set(key, role.id);
  }

  console.log("👤 Utilisateurs de démonstration…");
  async function createUser(opts: {
    email: string;
    firstName: string;
    lastName: string;
    role: RoleKey;
    organizationId: string | null;
    departmentId?: string | null;
    functionTitle?: string;
  }) {
    const user = await prisma.user.create({
      data: {
        email: opts.email,
        passwordHash,
        firstName: opts.firstName,
        lastName: opts.lastName,
        functionTitle: opts.functionTitle,
        organizationId: opts.organizationId,
        departmentId: opts.departmentId ?? null,
        status: "ACTIVE",
        roles: { create: { roleId: roleByKey.get(opts.role)! } },
      },
    });
    return user;
  }

  const superAdmin = await createUser({ email: "elognezoro@gmail.com", firstName: "Admin", lastName: "Système", role: "SUPER_ADMIN", organizationId: eduweb.id, functionTitle: "Super Administrateur EduWeb" });
  // Mot de passe dédié du super administrateur (à modifier en production).
  await prisma.user.update({ where: { id: superAdmin.id }, data: { passwordHash: await bcrypt.hash("zoroel", 10) } });
  const admin = await createUser({ email: "admin.aprid@ens.ci", firstName: "Koffi", lastName: "Yao", role: "ORG_ADMIN", organizationId: org.id, departmentId: aprid.id, functionTitle: "Administrateur APRID" });
  const manager = await createUser({ email: "responsable.salles@ens.ci", firstName: "Aïcha", lastName: "Traoré", role: "RESOURCE_MANAGER", organizationId: org.id, departmentId: aprid.id, functionTitle: "Responsable des salles" });
  const validator = await createUser({ email: "validateur.aprid@ens.ci", firstName: "Jean", lastName: "Brou", role: "VALIDATOR", organizationId: org.id, departmentId: aprid.id, functionTitle: "Chef de service" });
  const technician = await createUser({ email: "technicien.aprid@ens.ci", firstName: "Moussa", lastName: "Diallo", role: "TECHNICIAN", organizationId: org.id, departmentId: labo.id, functionTitle: "Technicien informatique" });
  const teacher = await createUser({ email: "enseignant.demo@ens.ci", firstName: "Fatou", lastName: "Bamba", role: "REQUESTER", organizationId: org.id, departmentId: aprid.id, functionTitle: "Enseignante-chercheuse" });
  const teacher2 = await createUser({ email: "formateur.demo@ens.ci", firstName: "Serge", lastName: "Kouassi", role: "REQUESTER", organizationId: org.id, departmentId: labo.id, functionTitle: "Formateur" });

  // Demande de compte en attente de validation (auto-inscription)
  await prisma.user.create({
    data: {
      email: "candidat.demo@ens.ci", passwordHash, firstName: "Awa", lastName: "Candidate", functionTitle: "Étudiante en Master",
      organizationId: org.id, status: "PENDING", roles: { create: { roleId: roleByKey.get("REQUESTER")! } },
    },
  });

  console.log("🗂️  Catégories…");
  const catSalles = await prisma.resourceCategory.create({
    data: {
      organizationId: org.id, name: "Salles multimédias", code: "SM", icon: "MonitorPlay", color: "#064B3A",
      description: "Salles équipées de postes informatiques et de vidéoprojection.", validationMode: "SIMPLE",
      dynamicFields: JSON.stringify([
        { key: "etage", label: "Étage", type: "text" },
        { key: "climatisee", label: "Climatisée", type: "boolean" },
      ]),
    },
  });
  const catReunion = await prisma.resourceCategory.create({
    data: { organizationId: org.id, name: "Salles de réunion", code: "SR", icon: "Users", color: "#0B5A45", description: "Espaces de réunion et de concertation.", validationMode: "SIMPLE" },
  });
  const catDoc = await prisma.resourceCategory.create({
    data: {
      organizationId: org.id, name: "Documentation", code: "DOC", icon: "BookOpen", color: "#6D5DF5",
      description: "Mémoires, annales, rapports et ouvrages empruntables.", validationMode: "HIERARCHICAL",
      dynamicFields: JSON.stringify([
        { key: "cote", label: "Cote", type: "text", required: true },
        { key: "auteur", label: "Auteur", type: "text" },
        { key: "annee", label: "Année", type: "number" },
      ]),
    },
  });
  const catMateriel = await prisma.resourceCategory.create({
    data: {
      organizationId: org.id, name: "Matériels", code: "MAT", icon: "Projector", color: "#F97316",
      description: "Équipements mobiles : vidéoprojecteurs, ordinateurs, caméras.", validationMode: "SIMPLE",
      dynamicFields: JSON.stringify([
        { key: "inventaire", label: "N° d'inventaire", type: "text", required: true },
        { key: "caution", label: "Caution (FCFA)", type: "amount" },
      ]),
    },
  });
  const catVehicule = await prisma.resourceCategory.create({
    data: {
      organizationId: org.id, name: "Véhicules", code: "VEH", icon: "Car", color: "#172554",
      description: "Véhicules administratifs et minibus.", validationMode: "MULTI_LEVEL",
      dynamicFields: JSON.stringify([
        { key: "immatriculation", label: "Immatriculation", type: "text", required: true },
        { key: "chauffeur", label: "Chauffeur", type: "text" },
        { key: "places", label: "Places", type: "number" },
      ]),
    },
  });
  const catService = await prisma.resourceCategory.create({
    data: { organizationId: org.id, name: "Services", code: "SRV", icon: "Wrench", color: "#22C55E", description: "Prestations internes : assistance, reprographie, rendez-vous.", validationMode: "SIMPLE" },
  });
  const catEvent = await prisma.resourceCategory.create({
    data: { organizationId: org.id, name: "Espaces événementiels", code: "EVT", icon: "PartyPopper", color: "#DC2626", description: "Auditoriums, stands et espaces d'exposition.", validationMode: "CONDITIONAL" },
  });

  console.log("🏫 Ressources…");
  const exclusiveRules = JSON.stringify({ bookingMode: "exclusive", maxDurationMinutes: 10080, minNoticeHours: 1, requiresValidation: true });
  const partialRules = JSON.stringify({ bookingMode: "partial", maxDurationMinutes: 10080, minNoticeHours: 1, requiresValidation: true });
  // Salles à postes : réservation poste par poste (plan de salle).
  const seatRoomRules = JSON.stringify({ bookingMode: "partial", seatBased: true, maxDurationMinutes: 10080, minNoticeHours: 1, requiresValidation: true });

  // Salles multimédias réelles (Sous-Direction APRID) — noms & capacités exacts.
  const MM_ROOMS = [
    { code: "SM-01", name: "BRUNO NABAGNE KONE", capacity: 25 },
    { code: "SM-02", name: "LABO LANGUE 1", capacity: 25 },
    { code: "SM-03", name: "LABO LANGUE 2", capacity: 45 },
    { code: "SM-04", name: "AUDIOVISUELLE1", capacity: 25 },
    { code: "SM-05", name: "AUDIOVISUELLE2", capacity: 25 },
    { code: "SM-06", name: "BIBLIOTHEQUE NUMERIQUE", capacity: 45 },
    { code: "SM-07", name: "AKE ASSI", capacity: 20 },
    { code: "SM-08", name: "CREP 1", capacity: 20 },
  ];
  const mmRoom: Record<string, { id: string }> = {};
  for (const r of MM_ROOMS) {
    mmRoom[r.code] = await prisma.resource.create({
      data: {
        organizationId: org.id, categoryId: catSalles.id, siteId: mainSite.id, departmentId: aprid.id, managerId: manager.id,
        name: r.name, code: r.code, status: "AVAILABLE",
        capacity: r.capacity, quantityTotal: r.capacity, quantityAvailable: r.capacity,
        location: "Sous-Direction APRID",
        description: `Salle multimédia « ${r.name} » — ${r.capacity} postes informatiques. Réservation poste par poste.`,
        equipment: JSON.stringify([`${r.capacity} postes informatiques`, "Vidéoprojecteur", "Climatisation"]),
        rules: seatRoomRules, customFields: JSON.stringify({ climatisee: true }),
      },
    });
  }
  const sm1 = mmRoom["SM-01"]; // BRUNO NABAGNE KONE (25)
  const sm2 = mmRoom["SM-03"]; // LABO LANGUE 2 (45)
  const reunion = await prisma.resource.create({
    data: {
      organizationId: org.id, categoryId: catReunion.id, siteId: mainSite.id, departmentId: aprid.id, managerId: manager.id,
      name: "Salle de réunion APRID", code: "SR-01", status: "AVAILABLE", capacity: 12,
      location: "Direction APRID · RDC", description: "Salle de réunion avec écran et visioconférence.",
      equipment: JSON.stringify(["Écran 65\"", "Visioconférence", "Paperboard"]), rules: exclusiveRules,
    },
  });
  const projo = await prisma.resource.create({
    data: {
      organizationId: org.id, categoryId: catMateriel.id, siteId: mainSite.id, departmentId: labo.id, managerId: technician.id,
      name: "Vidéoprojecteur APRID 01", code: "MAT-VP-01", status: "AVAILABLE", quantityTotal: 3, quantityAvailable: 3,
      location: "Magasin APRID", description: "Vidéoprojecteur Full HD portable.", rules: partialRules,
      customFields: JSON.stringify({ inventaire: "APRID-VP-001", caution: 0 }),
    },
  });
  const laptop = await prisma.resource.create({
    data: {
      organizationId: org.id, categoryId: catMateriel.id, siteId: mainSite.id, departmentId: labo.id, managerId: technician.id,
      name: "Ordinateur portable APRID 01", code: "MAT-PC-01", status: "MAINTENANCE", quantityTotal: 5, quantityAvailable: 2,
      location: "Magasin APRID", description: "Lot d'ordinateurs portables pour formations.", rules: partialRules,
      customFields: JSON.stringify({ inventaire: "APRID-PC-001", caution: 50000 }),
    },
  });
  const fonds = await prisma.resource.create({
    data: {
      organizationId: org.id, categoryId: catDoc.id, siteId: mainSite.id, departmentId: biblio.id,
      name: "Fonds documentaire APRID — mémoires", code: "DOC-MEM", status: "AVAILABLE", quantityTotal: 200, quantityAvailable: 200,
      location: "Bibliothèque · Rez-de-chaussée", description: "Collection de mémoires et rapports consultables sur place ou empruntables.",
      rules: JSON.stringify({ bookingMode: "partial", maxDurationMinutes: 10080, minNoticeHours: 0, requiresValidation: true }),
    },
  });
  const service = await prisma.resource.create({
    data: {
      organizationId: org.id, categoryId: catService.id, siteId: mainSite.id, departmentId: labo.id, managerId: technician.id,
      name: "Assistance informatique", code: "SRV-IT", status: "AVAILABLE",
      location: "Laboratoire informatique", description: "Prise de rendez-vous pour l'assistance et le dépannage.",
      rules: JSON.stringify({ bookingMode: "exclusive", maxDurationMinutes: 60, minNoticeHours: 1, requiresValidation: false }),
    },
  });
  const minibus = await prisma.resource.create({
    data: {
      organizationId: org.id, categoryId: catVehicule.id, siteId: mainSite.id, departmentId: aprid.id, managerId: admin.id,
      name: "Minibus ENS", code: "VEH-MB-01", status: "AVAILABLE", capacity: 18,
      location: "Parking administratif", description: "Minibus 18 places pour missions et sorties pédagogiques.",
      rules: exclusiveRules, customFields: JSON.stringify({ immatriculation: "AB-1234-CI", chauffeur: "M. Coulibaly", places: 18 }),
    },
  });
  const auditorium = await prisma.resource.create({
    data: {
      organizationId: org.id, categoryId: catEvent.id, siteId: mainSite.id, departmentId: aprid.id, managerId: admin.id,
      name: "Auditorium principal", code: "EVT-AUD-01", status: "AVAILABLE", capacity: 300,
      location: "Bâtiment central", description: "Grand auditorium pour conférences et événements.",
      equipment: JSON.stringify(["Sonorisation", "Régie", "Estrade", "Climatisation"]), rules: exclusiveRules,
    },
  });

  console.log("📅 Réservations de démonstration…");
  async function createBooking(opts: {
    code: string; resourceId: string; requesterId: string; title: string; purpose: string;
    usageType: string; start: Date; end: Date; status: string; participantCount?: number; quantityRequested?: number;
    seats?: number[]; rejectionReason?: string; validatorId?: string;
  }) {
    const booking = await prisma.booking.create({
      data: {
        organizationId: org.id, resourceId: opts.resourceId, requesterId: opts.requesterId, code: opts.code,
        title: opts.title, purpose: opts.purpose, usageType: opts.usageType, startAt: opts.start, endAt: opts.end,
        status: opts.status, participantCount: opts.participantCount,
        quantityRequested: opts.seats ? opts.seats.length : opts.quantityRequested ?? 1,
        seatNumbers: opts.seats ? JSON.stringify(opts.seats) : null,
        rejectionReason: opts.rejectionReason,
        history: { create: { status: opts.status, comment: "Créée par le seed de démonstration", changedBy: opts.requesterId } },
      },
    });
    if (opts.validatorId && ["APPROVED", "REJECTED"].includes(opts.status)) {
      await prisma.bookingValidation.create({
        data: {
          bookingId: booking.id, validatorId: opts.validatorId,
          status: opts.status === "APPROVED" ? "APPROVED" : "REJECTED",
          comment: opts.rejectionReason, validatedAt: new Date(),
        },
      });
    }
    return booking;
  }

  // Postes occupés « maintenant » (plan de salle en temps réel)
  const seatRange = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const nowStart = new Date(Date.now() - 45 * 60000);
  const nowEnd = new Date(Date.now() + 105 * 60000);
  await createBooking({ code: "EB-CI-ENS-APRID-SM-2026-0101", resourceId: mmRoom["SM-06"].id, requesterId: teacher.id, title: "Recherche documentaire L3", purpose: "Séance de recherche à la bibliothèque numérique.", usageType: "PEDAGOGICAL", start: nowStart, end: nowEnd, status: "IN_PROGRESS", seats: seatRange(1, 38), validatorId: manager.id });
  await createBooking({ code: "EB-CI-ENS-APRID-SM-2026-0102", resourceId: sm1.id, requesterId: teacher2.id, title: "TP Bureautique (groupe A)", purpose: "Travaux pratiques de bureautique.", usageType: "PEDAGOGICAL", start: nowStart, end: nowEnd, status: "IN_PROGRESS", seats: seatRange(1, 10), validatorId: manager.id });

  await createBooking({ code: "EB-CI-ENS-APRID-SM-2026-0001", resourceId: sm1.id, requesterId: teacher.id, title: "TP Bureautique L1", purpose: "Travaux pratiques de bureautique pour la licence 1.", usageType: "PEDAGOGICAL", start: at(1, 9), end: at(1, 11), status: "APPROVED", seats: seatRange(1, 12), validatorId: manager.id });
  await createBooking({ code: "EB-CI-ENS-APRID-SM-2026-0002", resourceId: sm2.id, requesterId: teacher2.id, title: "Formation tableur", purpose: "Formation tableur avancé pour le personnel administratif.", usageType: "TRAINING", start: at(0, 14), end: at(0, 16, 30), status: "IN_PROGRESS", seats: seatRange(1, 20), validatorId: manager.id });
  await createBooking({ code: "EB-CI-ENS-APRID-SR-2026-0003", resourceId: reunion.id, requesterId: admin.id, title: "Réunion de coordination", purpose: "Réunion hebdomadaire de coordination APRID.", usageType: "MEETING", start: at(1, 10), end: at(1, 11, 30), status: "PENDING_VALIDATION", participantCount: 10 });
  await createBooking({ code: "EB-CI-ENS-APRID-MAT-2026-0004", resourceId: projo.id, requesterId: teacher.id, title: "Soutenance", purpose: "Vidéoprojecteur pour une soutenance de mémoire.", usageType: "EVENT", start: at(2, 8), end: at(2, 12), status: "SUBMITTED", quantityRequested: 1 });
  await createBooking({ code: "EB-CI-ENS-APRID-EVT-2026-0005", resourceId: auditorium.id, requesterId: teacher2.id, title: "Conférence inaugurale", purpose: "Conférence inaugurale de l'année universitaire.", usageType: "CONFERENCE", start: at(5, 9), end: at(5, 12), status: "PENDING_VALIDATION", participantCount: 250 });
  await createBooking({ code: "EB-CI-ENS-APRID-SM-2026-0006", resourceId: sm1.id, requesterId: teacher2.id, title: "Atelier Python", purpose: "Atelier d'initiation à Python.", usageType: "TRAINING", start: at(-3, 9), end: at(-3, 12), status: "COMPLETED", seats: seatRange(1, 25), validatorId: manager.id });
  await createBooking({ code: "EB-CI-ENS-APRID-VEH-2026-0007", resourceId: minibus.id, requesterId: teacher.id, title: "Sortie pédagogique", purpose: "Sortie pédagogique à Grand-Bassam.", usageType: "EVENT", start: at(-5, 7), end: at(-5, 18), status: "REJECTED", participantCount: 18, rejectionReason: "Véhicule déjà mobilisé pour une mission officielle.", validatorId: admin.id });
  await createBooking({ code: "EB-CI-ENS-APRID-SR-2026-0008", resourceId: reunion.id, requesterId: teacher.id, title: "Comité pédagogique", purpose: "Comité pédagogique du département.", usageType: "MEETING", start: at(-1, 15), end: at(-1, 16), status: "NO_SHOW", participantCount: 8, validatorId: manager.id });

  console.log("🛠️  Maintenance & incidents…");
  await prisma.maintenance.create({
    data: { resourceId: laptop.id, title: "Mise à jour système", description: "Réinstallation et mise à jour des portables.", startAt: at(0, 8), endAt: at(3, 18), status: "IN_PROGRESS" },
  });
  await prisma.incident.create({
    data: { resourceId: sm2.id, reporterId: teacher2.id, title: "Vidéoprojecteur instable", description: "Le vidéoprojecteur de la SM-02 s'éteint par intermittence.", urgency: "HIGH", status: "OPEN" },
  });

  console.log("🔔 Notifications de démonstration…");
  await prisma.notification.createMany({
    data: [
      { userId: teacher.id, channel: "EMAIL", type: "BOOKING_APPROVED", subject: "Réservation validée — Salle multimédia 1", content: "Votre réservation EB-CI-ENS-APRID-SM-2026-0001 a été validée.", status: "SENT", sentAt: new Date() },
      { userId: manager.id, channel: "INTERNAL", type: "BOOKING_PENDING", subject: "Nouvelle demande à valider", content: "Une nouvelle demande de réservation attend votre validation.", status: "SENT", sentAt: new Date() },
      { userId: teacher.id, channel: "EMAIL", type: "BOOKING_REJECTED", subject: "Réservation refusée — Minibus ENS", content: "Votre demande a été refusée. Motif : véhicule déjà mobilisé.", status: "SENT", sentAt: new Date() },
    ],
  });

  // ================================================================
  // EduWeb Booking Library — bibliothèque numérique APRID
  // ================================================================
  console.log("📚 Bibliothèque numérique & utilisateurs documentaires…");

  const documentalist = await createUser({ email: "documentaliste.aprid@ens.ci", firstName: "Nadège", lastName: "Aka", role: "LIBRARIAN", organizationId: org.id, departmentId: biblio.id, functionTitle: "Documentaliste APRID" });
  const depositor = await createUser({ email: "deposant.demo@ens.ci", firstName: "Yves", lastName: "Gnagne", role: "DEPOSITOR", organizationId: org.id, departmentId: aprid.id, functionTitle: "Doctorant" });
  const demoReader = await createUser({ email: "lecteur.demo@ens.ci", firstName: "Awa", lastName: "Sylla", role: "READER", organizationId: org.id, departmentId: biblio.id, functionTitle: "Étudiante" });
  await prisma.user.update({ where: { id: demoReader.id }, data: { matricule: "23-B-P17498IPS/SP" } });
  const sciValidator = await createUser({ email: "validateur.scientifique@ens.ci", firstName: "Henri", lastName: "Adou", role: "SCIENTIFIC_VALIDATOR", organizationId: org.id, departmentId: aprid.id, functionTitle: "Enseignant-chercheur" });

  const library = await prisma.digitalLibrary.create({
    data: { organizationId: org.id, departmentId: biblio.id, name: "Bibliothèque numérique APRID", code: "BIB-APRID", description: "Fonds documentaire scientifique et pédagogique de la Sous-Direction APRID." },
  });

  const collectionId: Record<string, string> = {};
  for (const c of DEFAULT_COLLECTIONS) {
    const created = await prisma.documentCollection.create({ data: { organizationId: org.id, code: c.code, name: c.name } });
    collectionId[c.code] = created.id;
  }
  const domainId: Record<string, string> = {};
  for (const d of DEFAULT_DOMAINS) {
    const created = await prisma.documentDomain.create({ data: { organizationId: org.id, code: d.code, name: d.name } });
    domainId[d.code] = created.id;
  }

  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  const counter = async (key: string) => {
    const c = await prisma.documentCodeCounter.upsert({ where: { key }, create: { key, count: 1 }, update: { count: { increment: 1 } } });
    return c.count;
  };
  const genCode = async (type: string, dom: string, col: string, year: number) => {
    const ls = await counter(`LONG|CI|ENS|APRID|${col}|${type}|${dom}|${year}`);
    const ss = await counter(`SHORT|${type}|${dom}|${year}`);
    return { codeLong: `EBL-CI-ENS-APRID-${col}-${type}-${dom}-${year}-${pad(ls, 5)}`, codeShort: `${type}-${dom}-${year}-${pad(ss, 3)}` };
  };
  const genTemp = async (type: string, dom: string, col: string, year: number) => {
    const s = await counter(`TMP|CI|ENS|APRID|${col}|${type}|${dom}|${year}`);
    return `EBL-CI-ENS-APRID-${col}-${type}-${dom}-${year}-TMP-${pad(s, 3)}`;
  };
  const slugify = (t: string) =>
    t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);

  interface DocSeed {
    title: string; type: string; col: string; dom: string; access: string; pending?: "SUBMITTED" | "NEEDS_CORRECTION";
    year: number; author: string; supervisor?: string; level?: string; abstract: string; keywords: string[];
    pages?: number; physical?: number; journal?: string; volume?: string; issue?: string; pagesRange?: string; doi?: string;
    consult?: number; downloads?: number; createdBy: string;
  }

  const docs: DocSeed[] = [
    { title: "Intégration des TICE dans l'enseignement secondaire en Côte d'Ivoire", type: "MEM", col: "MEM", dom: "TICE", access: "PHYSICAL_LOAN", year: 2026, author: "Yves Gnagne", supervisor: "Dr. Koffi Yao", level: "Master", abstract: "Étude de l'appropriation des technologies éducatives par les enseignants du secondaire et impact sur les apprentissages.", keywords: ["TICE", "enseignement secondaire", "numérique éducatif"], pages: 112, physical: 3, consult: 142, downloads: 58, createdBy: depositor.id },
    { title: "Synthèse verte de nanoparticules d'argent à partir d'extraits végétaux", type: "ART", col: "ART", dom: "CHIM", access: "PUBLIC", year: 2025, author: "Aïcha Traoré", abstract: "Approche éco-responsable de synthèse de nanoparticules et évaluation de leur activité antibactérienne.", keywords: ["chimie verte", "nanoparticules", "antibactérien"], journal: "Revue Ivoirienne de Chimie", volume: "12", issue: "2", pagesRange: "45-60", doi: "10.1234/ric.2025.0456", consult: 98, downloads: 73, createdBy: depositor.id },
    { title: "Rapport d'activités annuel de la Sous-Direction APRID", type: "RAP", col: "RAP", dom: "GOUV", access: "RESTRICTED", year: 2026, author: "Koffi Yao", abstract: "Bilan des activités, projets et indicateurs de performance de la Sous-Direction APRID.", keywords: ["gouvernance", "bilan", "APRID"], pages: 48, consult: 31, downloads: 7, createdBy: documentalist.id },
    { title: "Annales de mathématiques — concours d'entrée 2024", type: "ANN", col: "ANN", dom: "MATH", access: "PUBLIC", year: 2024, author: "Service des concours ENS", abstract: "Recueil des sujets corrigés du concours d'entrée, épreuves de mathématiques.", keywords: ["annales", "concours", "mathématiques"], pages: 64, physical: 5, consult: 210, downloads: 165, createdBy: documentalist.id },
    { title: "Guide pratique de la classe inversée", type: "SUP", col: "SUP", dom: "PED", access: "PUBLIC", year: 2026, author: "Fatou Bamba", abstract: "Support pédagogique pour la mise en œuvre de la pédagogie inversée en contexte universitaire.", keywords: ["pédagogie", "classe inversée", "innovation"], pages: 28, consult: 87, downloads: 64, createdBy: depositor.id },
    { title: "Algorithmique et structures de données — manuel d'introduction", type: "LIV", col: "LIV", dom: "INFO", access: "INTERNAL", year: 2023, author: "Serge Kouassi", abstract: "Manuel d'initiation à l'algorithmique illustré d'exemples en pseudo-code.", keywords: ["algorithmique", "informatique", "structures de données"], pages: 240, physical: 4, consult: 156, downloads: 92, createdBy: depositor.id },
    { title: "Note de service — politique de conservation documentaire", type: "ADM", col: "ADM", dom: "DOC", access: "CONFIDENTIAL", year: 2026, author: "Direction ENS", abstract: "Document administratif interne relatif à la politique de conservation et d'archivage.", keywords: ["administration", "archivage", "conservation"], pages: 6, consult: 4, downloads: 0, createdBy: documentalist.id },
    { title: "Apprentissage profond pour la détection précoce du paludisme", type: "THS", col: "MEM", dom: "IA", access: "EMBARGO", year: 2025, author: "Moussa Diallo", supervisor: "Pr. Henri Adou", level: "Doctorat", abstract: "Thèse portant sur l'application de réseaux de neurones convolutifs au diagnostic assisté.", keywords: ["intelligence artificielle", "santé", "deep learning"], pages: 187, consult: 12, downloads: 0, createdBy: depositor.id },
    { title: "Déterminants de la réussite scolaire en milieu rural", type: "ART", col: "ART", dom: "SOC", access: "PUBLIC", year: 2024, author: "Awa Koné", abstract: "Analyse des facteurs socio-économiques influençant la réussite scolaire.", keywords: ["sciences sociales", "réussite scolaire", "milieu rural"], journal: "Cahiers de l'Éducation", volume: "8", issue: "1", pagesRange: "12-34", consult: 64, downloads: 41, createdBy: depositor.id },
    { title: "Évaluation de l'impact environnemental des campus universitaires", type: "RAP", col: "RAP", dom: "ENV", access: "INTERNAL", year: 2025, author: "Jean Brou", abstract: "Rapport d'évaluation environnementale et recommandations pour des campus durables.", keywords: ["environnement", "développement durable", "campus"], pages: 72, consult: 38, downloads: 19, createdBy: depositor.id },
    // Dépôts en attente
    { title: "Usage pédagogique des tableaux numériques interactifs", type: "MEM", col: "MEM", dom: "TICE", access: "INTERNAL", pending: "SUBMITTED", year: 2026, author: "Yves Gnagne", supervisor: "Dr. Aïcha Traoré", level: "Master", abstract: "Mémoire en cours de vérification documentaire.", keywords: ["TICE", "TNI", "pédagogie"], pages: 96, createdBy: depositor.id },
    { title: "Référentiel de compétences numériques des enseignants", type: "RAP", col: "RAP", dom: "TICE", access: "INTERNAL", pending: "NEEDS_CORRECTION", year: 2026, author: "Fatou Bamba", abstract: "Document soumis nécessitant des corrections de métadonnées.", keywords: ["compétences numériques", "référentiel"], pages: 40, createdBy: depositor.id },
  ];

  const createdDocs: { id: string; title: string; physical: boolean }[] = [];

  for (const d of docs) {
    const isPending = !!d.pending;
    const codes = isPending ? null : await genCode(d.type, d.dom, d.col, d.year);
    const temp = isPending ? await genTemp(d.type, d.dom, d.col, d.year) : null;
    const status = isPending ? d.pending! : d.access === "EMBARGO" ? "EMBARGOED" : d.access === "CONFIDENTIAL" ? "CONFIDENTIAL" : d.access === "RESTRICTED" ? "RESTRICTED" : "PUBLISHED";

    const doc = await prisma.documentResource.create({
      data: {
        organizationId: org.id, libraryId: library.id, collectionId: collectionId[d.col], domainId: domainId[d.dom], departmentId: aprid.id,
        codeLong: codes?.codeLong ?? null, codeShort: codes?.codeShort ?? null, temporaryCode: temp,
        title: d.title, slug: `${slugify(d.title)}-${Math.random().toString(36).slice(2, 6)}`, abstract: d.abstract,
        documentType: d.type, year: d.year, language: "Français",
        mainAuthorName: d.author, supervisorName: d.supervisor ?? null, level: d.level ?? null,
        pageCount: d.pages ?? null, keywords: JSON.stringify(d.keywords),
        status, accessLevel: d.access,
        downloadAllowed: !["ON_SITE_ONLY", "CONFIDENTIAL"].includes(d.access),
        consultationAllowed: true,
        physicalCopyAvailable: !!d.physical, physicalCopyCount: d.physical ?? 0, availablePhysicalCopyCount: d.physical ?? 0,
        embargoUntil: d.access === "EMBARGO" ? at(120, 9) : null,
        doi: d.doi ?? null, journalName: d.journal ?? null, volume: d.volume ?? null, issue: d.issue ?? null, pages: d.pagesRange ?? null,
        fileName: isPending ? null : `${d.type.toLowerCase()}-${d.year}.pdf`,
        fileKey: null, fileMime: isPending ? null : "application/pdf", fileSize: isPending ? null : 1024 * (200 + Math.floor(Math.random() * 800)),
        fileHash: isPending ? null : `seed${Math.random().toString(36).slice(2, 18)}`,
        consultationCount: d.consult ?? 0, downloadCount: d.downloads ?? 0,
        createdById: d.createdBy,
        validatedById: isPending ? null : documentalist.id,
        validatedAt: isPending ? null : new Date(),
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
    createdDocs.push({ id: doc.id, title: doc.title, physical: !!d.physical });

    // Avis / validation documentaire
    if (!isPending) {
      await prisma.documentReview.create({ data: { documentId: doc.id, reviewerId: documentalist.id, decision: status === "PUBLISHED" ? "PUBLISHED" : "VALIDATED", comment: "Métadonnées vérifiées et conformes." } });
    }
    if (d.type === "THS" || d.type === "ART") {
      await prisma.documentReview.create({ data: { documentId: doc.id, reviewerId: sciValidator.id, decision: "SCIENCE_FAVORABLE", comment: "Avis scientifique favorable.", scientific: true } });
    }

    // Journaux de consultation / téléchargement (échantillon pour les stats)
    for (let i = 0; i < Math.min(5, d.consult ?? 0); i++) {
      await prisma.documentConsultation.create({ data: { documentId: doc.id, userId: depositor.id, createdAt: at(-Math.floor(Math.random() * 30), 10) } });
    }
    for (let i = 0; i < Math.min(4, d.downloads ?? 0); i++) {
      await prisma.documentDownload.create({ data: { documentId: doc.id, userId: depositor.id, createdAt: at(-Math.floor(Math.random() * 30), 11) } });
    }
  }

  // Co-auteurs sur l'article de chimie
  const chemDoc = createdDocs.find((d) => d.title.includes("nanoparticules"));
  if (chemDoc) {
    await prisma.documentAuthor.createMany({ data: [
      { documentId: chemDoc.id, name: "Serge Kouassi", role: "CO_AUTHOR", order: 1 },
      { documentId: chemDoc.id, name: "Awa Koné", role: "CO_AUTHOR", order: 2 },
    ] });
  }

  // Alerte de doublon sur le dépôt en attente (titre proche)
  const pendingDoc = createdDocs.find((d) => d.title.includes("tableaux numériques"));
  const ticePublished = createdDocs.find((d) => d.title.includes("Intégration des TICE"));
  if (pendingDoc && ticePublished) {
    await prisma.documentDuplicateWarning.create({ data: { documentId: pendingDoc.id, similarDocumentId: ticePublished.id, similarTitle: ticePublished.title, reason: "titre très proche, même domaine (TICE)", score: 62 } });
  }

  // Réservations & emprunts documentaires
  const physicalDocs = createdDocs.filter((d) => d.physical);
  if (physicalDocs[0]) {
    await prisma.documentReservation.create({ data: { documentId: physicalDocs[0].id, requesterId: teacher.id, type: "ON_SITE", status: "PENDING", slotStart: at(1, 9), slotEnd: at(1, 11), note: "Consultation sur place pour préparation de cours." } });
    await prisma.documentLoan.create({ data: { documentId: physicalDocs[0].id, userId: teacher2.id, status: "BORROWED", dueDate: at(7, 17) } });
  }
  if (physicalDocs[1]) {
    await prisma.documentReservation.create({ data: { documentId: physicalDocs[1].id, requesterId: teacher2.id, type: "LOAN", status: "APPROVED", note: "Emprunt pour révisions." } });
  }

  // Notification documentaliste : dépôts à vérifier
  await prisma.notification.create({ data: { userId: documentalist.id, channel: "INTERNAL", type: "DOCUMENT_SUBMITTED", subject: "Nouveaux dépôts à vérifier", content: "2 documents sont en attente de validation documentaire.", status: "SENT", sentAt: new Date() } });

  // ================================================================
  // Autres institutions (multi-tenant) — chacune a son espace isolé,
  // ses propres rôles et sa propre hiérarchie.
  // ================================================================
  console.log("🏫 Autres institutions…");
  async function provisionInstitution(opts: { name: string; acronym: string; slug: string; city: string; color: string; adminEmail: string; adminFirst: string; adminLast: string }) {
    const inst = await prisma.organization.create({
      data: {
        name: opts.name, acronym: opts.acronym, slug: opts.slug, isPlatform: false,
        country: "Côte d'Ivoire", city: opts.city, primaryColor: opts.color, status: "ACTIVE",
        settings: { create: { language: "fr", timezone: "Africa/Abidjan", allowAutoValidation: false } },
        subscription: { create: { plan: "STANDARD", status: "ACTIVE", seats: 100 } },
      },
    });
    const roleId = new Map<RoleKey, string>();
    for (const key of Object.keys(ROLE_META) as RoleKey[]) {
      if (key === "SUPER_ADMIN") continue; // le super admin est global (espace plateforme)
      const meta = ROLE_META[key];
      const role = await prisma.role.create({
        data: {
          organizationId: inst.id, key, name: meta.label, description: meta.description, color: meta.color, isSystem: true,
          permissions: { create: ROLE_PERMISSIONS[key].map((pk) => ({ permissionId: permByKey.get(pk)! })) },
        },
      });
      roleId.set(key, role.id);
    }
    const site = await prisma.site.create({ data: { organizationId: inst.id, name: `Campus ${opts.city}`, code: "MAIN", city: opts.city } });
    const dir = await prisma.department.create({ data: { organizationId: inst.id, siteId: site.id, name: "Direction", code: "DIR" } });
    await prisma.department.create({ data: { organizationId: inst.id, siteId: site.id, parentId: dir.id, name: "Scolarité", code: "SCOL" } });
    await prisma.department.create({ data: { organizationId: inst.id, siteId: site.id, parentId: dir.id, name: "Service Informatique", code: "DSI" } });
    const admin = await prisma.user.create({
      data: { email: opts.adminEmail, passwordHash, firstName: opts.adminFirst, lastName: opts.adminLast, functionTitle: "Administrateur", organizationId: inst.id, departmentId: dir.id, status: "ACTIVE", roles: { create: { roleId: roleId.get("ORG_ADMIN")! } } },
    });
    const cat = await prisma.resourceCategory.create({ data: { organizationId: inst.id, name: "Salles de réunion", code: "SR", icon: "Users", color: opts.color, validationMode: "SIMPLE" } });
    await prisma.resource.create({
      data: {
        organizationId: inst.id, categoryId: cat.id, siteId: site.id, departmentId: dir.id, managerId: admin.id,
        name: "Salle de réunion principale", code: "SR-01", status: "AVAILABLE", capacity: 20, location: `Campus ${opts.city}`,
        description: "Salle de réunion équipée.", rules: JSON.stringify({ bookingMode: "exclusive", maxDurationMinutes: 10080, minNoticeHours: 1, requiresValidation: true }),
      },
    });
    // Espace de dépôt activé par défaut (bibliothèque + collections + domaines), personnalisable ensuite.
    await provisionLibrary(prisma, { organizationId: inst.id, departmentId: dir.id, acronym: opts.acronym });
  }
  await provisionInstitution({ name: "Université Félix Houphouët-Boigny", acronym: "UFHB", slug: "ufhb", city: "Abidjan", color: "#1D4ED8", adminEmail: "admin@ufhb.ci", adminFirst: "Adjoua", adminLast: "N'Guessan" });
  await provisionInstitution({ name: "INP-HB Yamoussoukro", acronym: "INPHB", slug: "inphb", city: "Yamoussoukro", color: "#B45309", adminEmail: "admin@inphb.ci", adminFirst: "Ibrahim", adminLast: "Touré" });
  await provisionInstitution({ name: "Institut Pédagogique National de l'Enseignement Technique et Professionnel", acronym: "IPNETP", slug: "ipnetp", city: "Abidjan", color: "#7C3AED", adminEmail: "admin@ipnetp.ci", adminFirst: "Kouamé", adminLast: "Konan" });

  // Sport cérébral — banque de questions « Culture générale » (globale, éditable par le super admin).
  console.log("🧠 Banque de questions Sport cérébral…");
  for (const q of QUIZ_SEED) {
    await prisma.brainSportQuestion.create({ data: { gameSlug: "culture-generale", level: q.level, prompt: q.prompt, choices: JSON.stringify(q.choices), answerIndex: q.answerIndex, explanation: q.explanation ?? null } });
  }

  console.log("\n✅ Seed terminé avec succès.");
  console.log("\n──────────────── Comptes de démonstration ────────────────");
  console.log(` Mot de passe commun : ${DEMO_PASSWORD}\n`);
  [
    ["Super Admin (mot de passe : zoroel)", superAdmin.email],
    ["Administrateur APRID", admin.email],
    ["Responsable de ressource", manager.email],
    ["Validateur", validator.email],
    ["Technicien", technician.email],
    ["Enseignant (demandeur)", teacher.email],
    ["Formateur (demandeur)", teacher2.email],
    ["Documentaliste (Library)", documentalist.email],
    ["Déposant (Library)", depositor.email],
    ["Validateur scientifique", sciValidator.email],
    ["Lecteur interne (Library)", "lecteur.demo@ens.ci"],
  ].forEach(([role, email]) => console.log(`  • ${role.padEnd(28)} ${email}`));
  console.log("───────────────────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
