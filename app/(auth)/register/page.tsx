import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Créer un compte" };
export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: { org?: string } }) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  // L'inscription se fait toujours dans l'espace d'une institution choisie au préalable.
  // Sans institution valide en contexte, on invite d'abord à la sélectionner.
  if (!searchParams.org) redirect("/institutions");

  const org = await prisma.organization.findFirst({
    where: { slug: searchParams.org, isPlatform: false, status: "ACTIVE" },
    select: { name: true, slug: true },
  });
  if (!org?.slug) redirect("/institutions");

  return <RegisterForm orgSlug={org.slug} orgName={org.name} />;
}
