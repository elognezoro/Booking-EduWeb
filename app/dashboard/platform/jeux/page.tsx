import Link from "next/link";
import { Gamepad2, CheckCircle2, Save, ArrowLeft, Lock, Info, SlidersHorizontal } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GAMES } from "@/lib/games/catalog";
import { getEffectiveGames } from "@/lib/games/config";
import { getGamesGating } from "@/lib/platform/settings";
import { saveGamesGating } from "@/app/actions/platform";
import { AvailabilitySelect } from "@/components/games/availability-select";
import { GAME_AVAILABILITIES, AVAILABILITY_META } from "@/lib/games/availability";

export const dynamic = "force-dynamic";

export default async function PlatformGamesPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requirePermission("platform.manage");
  const [g, games] = await Promise.all([getGamesGating(), getEffectiveGames({ includeHidden: true })]);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/platform" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Supervision EduWeb
      </Link>
      <PageHeader
        title="Réglages des jeux — Sport cérébral"
        description="Disponibilité de chaque jeu et accès des visiteurs non abonnés (administrateur système)."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Gamepad2 className="size-6" /></span>}
      />

      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Réglages enregistrés.
        </div>
      )}

      {/* ===================== DISPONIBILITÉ PAR JEU ===================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><SlidersHorizontal className="size-4" /> Disponibilité de chaque jeu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-50/50 px-4 py-3 text-sm text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              Choisissez, pour chaque jeu, s'il est disponible et sous quelle condition. Le changement s'applique
              aussitôt (hub public et accès direct par lien).
            </span>
          </div>

          {/* Légende des 4 modes */}
          <ul className="grid gap-2 sm:grid-cols-2">
            {GAME_AVAILABILITIES.map((mode) => (
              <li key={mode} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
                <Badge tone={AVAILABILITY_META[mode].tone} className="shrink-0">{AVAILABILITY_META[mode].label}</Badge>
                <span className="text-muted-foreground">{AVAILABILITY_META[mode].hint}</span>
              </li>
            ))}
          </ul>

          {/* Un sélecteur par jeu */}
          <div className="divide-y divide-border rounded-xl border border-border">
            {games.map((game) => (
              <div key={game.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{game.title}</span>
                  <Badge tone="neutral" className="text-[11px]">{game.category}</Badge>
                </div>
                <AvailabilitySelect slug={game.slug} value={game.availability} />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Les <strong>conditions de temps</strong> (période, plage horaire, jours), la consigne, l'audio et l'ordre des jeux
            se règlent dans la{" "}
            <Link href="/dashboard/sport-cerebral/admin/jeux" className="font-semibold text-primary hover:underline">gestion des jeux</Link>.
          </p>
        </CardContent>
      </Card>

      {/* ===================== SÉLECTION « DÉCOUVERTE » (jeux Abonnement) ===================== */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Lock className="size-4" /> Sélection « découverte » (jeux « Abonnement requis »)</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Concerne uniquement les jeux réglés sur « Abonnement requis » : combien (et lesquels) sont offerts gratuitement aux visiteurs non abonnés.</span>
          </div>
          <form action={saveGamesGating} className="space-y-6">
            <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3.5">
              <input type="checkbox" name="enabled" defaultChecked={g.enabled} className="mt-0.5 size-4 accent-primary" />
              <span>
                <span className="font-semibold text-foreground">Activer le verrouillage par abonnement</span>
                <span className="block text-sm text-muted-foreground">Si désactivé, les jeux « Abonnement requis » deviennent accessibles à tout le monde.</span>
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="mode">Sélection des jeux offerts</Label>
                <Select id="mode" name="mode" defaultValue={g.mode}>
                  <option value="random">Rotation aléatoire (par jour)</option>
                  <option value="fixed">Jeux fixes choisis</option>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">Le défi du jour reste toujours jouable, quel que soit le mode.</p>
              </div>
              <div>
                <Label htmlFor="freeCount">Nombre de jeux offerts (mode rotation)</Label>
                <Input id="freeCount" name="freeCount" type="number" min={0} max={GAMES.length} defaultValue={g.freeCount} />
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-foreground">Jeux offerts (mode « fixes choisis »)</p>
              <p className="mb-2 text-xs text-muted-foreground">Cochez les jeux accessibles sans abonnement. (Pris en compte uniquement en mode « Jeux fixes choisis ».)</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {GAMES.map((game) => (
                  <label key={game.slug} className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 text-sm">
                    <input type="checkbox" name="freeSlugs" value={game.slug} defaultChecked={g.freeSlugs.includes(game.slug)} className="size-4 accent-primary" />
                    <span className="font-medium text-foreground">{game.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit"><Save className="size-4" /> Enregistrer les réglages</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
