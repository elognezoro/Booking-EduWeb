import Link from "next/link";
import { Lock, Sparkles, ArrowRight, LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GamesAccess } from "@/lib/games/access";

/** Carte de blocage affichée à la place d'un jeu réservé aux établissements abonnés. */
export function GameLocked({ title, access }: { title: string; access: GamesAccess }) {
  const anon = access.reason === "anonymous";
  return (
    <Card className="mt-5 p-8 text-center">
      <span className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-pending-soft text-pending-fg">
        <Lock className="size-7" />
      </span>
      <h2 className="text-xl font-extrabold text-foreground">« {title} » est réservé aux abonnés</h2>
      <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
        Ce jeu fait partie de la collection complète du Sport cérébral, accessible aux établissements abonnés à
        EduWeb Booking.{" "}
        {anon
          ? "Connectez-vous avec le compte d'un établissement abonné"
          : "Votre établissement n'a pas encore souscrit d'abonnement"}{" "}
        pour débloquer la totalité des jeux et des niveaux.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/pricing">
            <Sparkles className="size-4" /> Découvrir les formules
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sport-cerebral">
            Voir les jeux disponibles <ArrowRight className="size-4" />
          </Link>
        </Button>
        {anon && (
          <Button asChild variant="ghost">
            <Link href="/login">
              <LogIn className="size-4" /> Se connecter
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
