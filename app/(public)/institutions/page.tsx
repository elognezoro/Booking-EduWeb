import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { InstitutionPicker } from "@/components/public/institution-picker";

export const metadata: Metadata = { title: "Espaces institutions" };
export const dynamic = "force-dynamic";

export default async function InstitutionsPage() {
  const institutions = await prisma.organization.findMany({
    where: { isPlatform: false, status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { name: true, slug: true, acronym: true, city: true, primaryColor: true, logoUrl: true },
  });

  // On n'expose que les institutions disposant d'un identifiant d'espace (slug).
  const list = institutions
    .filter((i): i is typeof i & { slug: string } => !!i.slug)
    .map((i) => ({ name: i.name, slug: i.slug, acronym: i.acronym, city: i.city, primaryColor: i.primaryColor, logoUrl: i.logoUrl }));

  return (
    <section className="section py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="advanced" className="mb-4"><Building2 className="size-3.5" /> Espaces institutions</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Accédez à l'espace de votre institution</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Chaque institution dispose de son propre espace sécurisé et isolé. Recherchez et sélectionnez la vôtre pour vous connecter.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <InstitutionPicker institutions={list} />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Votre institution n'est pas listée ?{" "}
          <Link href="/register-organization" className="font-semibold text-primary hover:underline">
            Inscrivez votre institution <ArrowRight className="inline size-3.5" />
          </Link>
        </p>
      </div>
    </section>
  );
}
