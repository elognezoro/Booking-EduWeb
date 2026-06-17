/**
 * Changer le mot de passe d'un compte EduWeb Booking (super admin ou tout utilisateur).
 *
 * Usage :
 *   npm run set-password -- <email> [nouveau-mot-de-passe]
 *
 * Exemples :
 *   npm run set-password -- elognezoro@gmail.com "MonNouveauMotDePasse!2026"
 *   npm run set-password -- lecteur.demo@ens.ci          (génère un mot de passe fort)
 *
 * Agit sur la base définie par DATABASE_URL (.env). À exécuter localement.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const prisma = new PrismaClient();

/** Mot de passe fort aléatoire (par défaut 16 caractères). */
function generateStrongPassword(length = 16): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*?";
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

async function findUser(email: string) {
  const raw = email.trim();
  return (
    (await prisma.user.findUnique({ where: { email: raw } })) ??
    (await prisma.user.findUnique({ where: { email: raw.toLowerCase() } }))
  );
}

async function main() {
  const [email, providedPassword] = process.argv.slice(2);

  if (!email) {
    console.error("Usage : npm run set-password -- <email> [nouveau-mot-de-passe]");
    console.error("Si le mot de passe est omis, un mot de passe fort est généré et affiché.");
    process.exit(1);
  }

  const user = await findUser(email);
  if (!user) {
    console.error(`✗ Aucun utilisateur trouvé avec l'e-mail : ${email}`);
    process.exit(1);
  }

  const generated = !providedPassword || providedPassword.length === 0;
  const password = generated ? generateStrongPassword() : providedPassword;

  if (password.length < 8) {
    console.error("✗ Le mot de passe doit comporter au moins 8 caractères.");
    process.exit(1);
  }
  if (!generated && password.length < 12) {
    console.warn("⚠ Mot de passe court (< 12 caractères) : privilégiez un mot de passe plus long.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  console.log("✓ Mot de passe mis à jour avec succès.");
  console.log(`  Utilisateur : ${user.firstName} ${user.lastName} <${user.email}>`);
  if (generated) {
    console.log(`  Nouveau mot de passe (généré) : ${password}`);
    console.log("  → Notez-le et communiquez-le de façon sécurisée.");
  } else {
    console.log("  Le nouveau mot de passe fourni est désormais actif.");
  }
}

main()
  .catch((e) => {
    console.error("Erreur :", e instanceof Error ? e.message : String(e));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
