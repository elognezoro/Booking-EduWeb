import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string; org?: string } }) {
  // Vérification en base (et non sur le seul jeton) pour éviter toute boucle avec un cookie périmé.
  const user = await getCurrentUser();
  if (user) redirect(searchParams.callbackUrl?.startsWith("/") ? searchParams.callbackUrl : "/dashboard");

  // Connexion ciblée sur l'espace d'une institution (depuis le sélecteur).
  let institution: { name: string; acronym: string | null; primaryColor: string | null; slug: string; demoEmail: string | null } | null = null;
  if (searchParams.org) {
    const org = await prisma.organization.findFirst({
      where: { slug: searchParams.org, isPlatform: false, status: "ACTIVE" },
      select: { name: true, acronym: true, primaryColor: true, slug: true },
    });
    if (org?.slug) {
      const admin = await prisma.user.findFirst({
        where: { organizationId: { not: null }, organization: { slug: org.slug }, roles: { some: { role: { key: "ORG_ADMIN" } } } },
        select: { email: true },
      });
      institution = { ...org, slug: org.slug, demoEmail: admin?.email ?? null };
    }
  }

  return <LoginForm callbackUrl={searchParams.callbackUrl} institution={institution} />;
}
