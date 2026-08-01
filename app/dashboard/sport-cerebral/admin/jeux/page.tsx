import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowDown, Save, Upload, Trash2, Volume2, ListChecks, Gamepad2, Info } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEffectiveGames } from "@/lib/games/config";
import { saveGameConsigne, moveGameOrder, uploadGameAudio, removeGameAudio } from "@/app/actions/brain-sport";
import { AvailabilitySelect } from "@/components/games/availability-select";
import { GameScheduleForm } from "@/components/games/game-schedule-form";
import { GAME_AVAILABILITIES, AVAILABILITY_META } from "@/lib/games/availability";

export const dynamic = "force-dynamic";

export default async function GamesAdminPage() {
  await requirePermission("platform.manage");
  const games = await getEffectiveGames({ includeHidden: true });

  return (
    <div className="space-y-5">
      <Link href="/dashboard/sport-cerebral" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sport cérébral
      </Link>
      <PageHeader
        title="Gestion des jeux"
        description="Régler la disponibilité de chaque jeu, réordonner, modifier la consigne et déposer un audio (administrateur système)."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Gamepad2 className="size-6" /></span>}
        actions={<Button asChild variant="outline"><Link href="/dashboard/sport-cerebral/admin"><ListChecks className="size-4" /> Banque de questions</Link></Button>}
      />

      {/* Légende des disponibilités */}
      <Card>
        <CardContent className="py-4">
          <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-bold text-foreground"><Info className="size-4 text-primary" /> Disponibilité des jeux</p>
          <p className="mb-3 text-sm text-muted-foreground">
            Pour chaque jeu, choisissez s'il est disponible et sous quelle condition. Le réglage s'applique aussitôt (hub et accès direct).
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {GAME_AVAILABILITIES.map((mode) => (
              <li key={mode} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
                <Badge tone={AVAILABILITY_META[mode].tone} className="shrink-0">{AVAILABILITY_META[mode].label}</Badge>
                <span className="text-muted-foreground">{AVAILABILITY_META[mode].hint}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            La sélection « découverte » offerte aux non-abonnés (pour les jeux « Abonnement requis ») se règle dans{" "}
            <Link href="/dashboard/platform/jeux" className="font-semibold text-primary hover:underline">Réglages des jeux</Link>.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {games.map((g, i) => (
          <Card key={g.slug}>
            <CardContent className="space-y-3 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{g.title}</h3>
                  <Badge tone="info">{g.category}</Badge>
                  <Badge tone={g.playable ? "available" : "neutral"}>{g.playable ? "Jouable" : "Bientôt"}</Badge>
                  <Badge tone={AVAILABILITY_META[g.availability].tone}>{AVAILABILITY_META[g.availability].label}</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <form action={moveGameOrder}><input type="hidden" name="slug" value={g.slug} /><input type="hidden" name="dir" value="up" /><Button type="submit" variant="ghost" size="icon-sm" disabled={i === 0} title="Monter"><ArrowUp className="size-4" /></Button></form>
                  <form action={moveGameOrder}><input type="hidden" name="slug" value={g.slug} /><input type="hidden" name="dir" value="down" /><Button type="submit" variant="ghost" size="icon-sm" disabled={i === games.length - 1} title="Descendre"><ArrowDown className="size-4" /></Button></form>
                  <AvailabilitySelect slug={g.slug} value={g.availability} />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                {/* Consigne */}
                <form action={saveGameConsigne}>
                  <input type="hidden" name="slug" value={g.slug} />
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Consigne (vide = consigne par défaut)</label>
                  <Textarea name="consigne" rows={3} defaultValue={g.consigne} className="mt-1" />
                  <Button type="submit" size="sm" variant="outline" className="mt-2"><Save className="size-4" /> Enregistrer la consigne</Button>
                </form>

                {/* Audio */}
                <div className="rounded-xl border border-border p-3">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Volume2 className="size-4 text-primary" /> Audio de la consigne</p>
                  {g.audioUrl ? (
                    <div className="space-y-2">
                      <audio controls preload="none" src={g.audioUrl} className="h-8 w-full" />
                      <form action={removeGameAudio}><input type="hidden" name="slug" value={g.slug} /><Button type="submit" variant="ghost" size="sm" className="text-unavailable-fg"><Trash2 className="size-4" /> Retirer l'audio</Button></form>
                    </div>
                  ) : (
                    <p className="mb-2 text-xs text-muted-foreground">Aucun fichier — la synthèse vocale est utilisée par défaut.</p>
                  )}
                  <form action={uploadGameAudio} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="slug" value={g.slug} />
                    <input type="file" name="file" accept="audio/*" required className="block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-primary-50 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-primary" />
                    <Button type="submit" size="sm"><Upload className="size-4" /> Déposer</Button>
                  </form>
                </div>
              </div>

              {/* Conditions de temps (période, plage horaire, jours) */}
              <GameScheduleForm slug={g.slug} schedule={g.schedule} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
