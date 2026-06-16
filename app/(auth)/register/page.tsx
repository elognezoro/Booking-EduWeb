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

  const institutionsRaw = await prisma.organization.findMany({
    where: { isPlatform: false, status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });
  const institutions = institutionsRaw.filter((i): i is { name: string; slug: string } => !!i.slug);

  const locked = searchParams.org ? institutions.find((i) => i.slug === searchParams.org) : undefined;

  return (
    <RegisterForm
      institutions={institutions}
      defaultOrg={locked?.slug ?? searchParams.org}
      lockedName={locked?.name}
    />
  );
}
