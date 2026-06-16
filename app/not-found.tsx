import Link from "next/link";
import { Home, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-6 text-center">
      <BrandLogo />
      <div className="mt-8">
        <p className="text-7xl font-extrabold text-gradient">404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground">Page introuvable</h1>
        <p className="mt-2 max-w-md text-muted-foreground">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild><Link href="/dashboard"><Home className="size-4" /> Tableau de bord</Link></Button>
          <Button asChild variant="outline"><Link href="/"><Search className="size-4" /> Accueil</Link></Button>
        </div>
      </div>
    </div>
  );
}
