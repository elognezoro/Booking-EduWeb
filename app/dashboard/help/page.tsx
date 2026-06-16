import { HelpCircle, BookOpenCheck, ListChecks, LifeBuoy, Download, CircleCheck } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/status-badges";
import { ROLE_GUIDES } from "@/lib/guides";
import { ROLE_META, type RoleKey } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function HelpPage() {
  const user = await requireUser();
  const roles = user.roles.filter((r): r is RoleKey => r in ROLE_GUIDES);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Centre d'aide"
        description="Votre guide d'utilisation, adapté à votre rôle — consultable en ligne et téléchargeable en PDF."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><HelpCircle className="size-6" /></span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href="/guides/print" target="_blank" rel="noopener noreferrer"><Download className="size-4" /> Télécharger en PDF</a>
            </Button>
            <Button asChild variant="outline"><Link href="/dashboard/support"><LifeBuoy className="size-4" /> Support</Link></Button>
          </div>
        }
      />

      {/* Guide(s) propre(s) au rôle de l'utilisateur */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          <BookOpenCheck className="size-4 text-primary" /> Votre guide
        </h2>
        <div className="space-y-5">
          {roles.length === 0 ? (
            <Card><CardContent className="py-6 text-sm text-muted-foreground">Aucun guide associé à votre profil pour le moment.</CardContent></Card>
          ) : (
            roles.map((role) => {
              const guide = ROLE_GUIDES[role];
              return (
                <Card key={role}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle>{guide.title}</CardTitle>
                      <RoleBadge roleKey={role} />
                    </div>
                    <p className="text-sm text-muted-foreground">{guide.intro}</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Ce qui est possible pour ce rôle */}
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        <CircleCheck className="size-4 text-primary" /> Ce que vous pouvez faire
                      </p>
                      <ul className="space-y-1.5">
                        {guide.can.map((c, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground">
                            <CircleCheck className="mt-0.5 size-4 shrink-0 text-available-fg" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Comment procéder, étape par étape */}
                    <p className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      <ListChecks className="size-4 text-primary" /> Comment procéder
                    </p>
                    {guide.sections.map((s) => (
                      <div key={s.title}>
                        <p className="mb-2 flex items-center gap-1.5 font-bold text-foreground">
                          <ListChecks className="size-4 text-primary" /> {s.title}
                        </p>
                        <ol className="space-y-1.5 pl-1">
                          {s.steps.map((step, i) => (
                            <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary">{i + 1}</span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Tous les rôles en bref */}
      <Card>
        <CardHeader><CardTitle>Les rôles en bref</CardTitle></CardHeader>
        <CardContent className="divide-y divide-border">
          {(Object.keys(ROLE_META) as RoleKey[]).map((r) => (
            <div key={r} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <RoleBadge roleKey={r} />
              <p className="text-sm text-muted-foreground sm:max-w-md sm:text-right">{ROLE_META[r].description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
