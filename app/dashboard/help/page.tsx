import { HelpCircle, BookOpenCheck, LifeBuoy, Download, GraduationCap, FileText, ChevronDown, Library } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/status-badges";
import { GuideArticle } from "@/components/help/guide-article";
import { ROLE_GUIDES } from "@/lib/guides";
import { ROLES, ROLE_META, type RoleKey } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function HelpPage() {
  const user = await requireUser();
  const roles = user.roles.filter((r): r is RoleKey => r in ROLE_GUIDES);
  // Les administrateurs (système ou d'établissement) accèdent aux guides de TOUS les rôles.
  const canSeeAllGuides = user.permissions.has("users.manage");
  const allRoles = (ROLES as readonly RoleKey[]).filter((r) => r in ROLE_GUIDES);

  return (
    <div className="formation-scope space-y-6">
      <PageHeader
        title="Centre d'aide"
        description="Votre guide d'utilisation, adapté à votre rôle — consultable en ligne et téléchargeable en PDF."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><HelpCircle className="size-6" /></span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href="/guides/print" target="_blank" rel="noopener noreferrer"><Download className="size-4" /> Mon guide (PDF)</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/api/guides/word"><FileText className="size-4" /> Mon guide (Word)</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/guides/formation" target="_blank" rel="noopener noreferrer"><GraduationCap className="size-4" /> Manuel de formation</a>
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
            roles.map((role) => <GuideArticle key={role} guide={ROLE_GUIDES[role]} roleLabel={ROLE_META[role].label} />)
          )}
        </div>
      </div>

      {/* Guides de tous les rôles — réservé aux administrateurs (système ou d'établissement) */}
      {canSeeAllGuides && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Library className="size-4 text-primary" /> Guides de tous les rôles
          </h2>
          <p className="mb-3 text-sm text-muted-foreground">En tant qu'administrateur, vous pouvez consulter le guide complet de chaque rôle pour accompagner et former votre personnel. Cliquez sur un rôle pour déplier son guide.</p>
          <div className="space-y-2.5">
            {allRoles.map((role) => (
              <details key={role} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-3.5 hover:bg-secondary/50">
                  <span className="flex items-center gap-2.5">
                    <RoleBadge roleKey={role} />
                    <span className="text-sm font-semibold text-foreground">{ROLE_GUIDES[role].title}</span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-border p-3 sm:p-4">
                  <GuideArticle guide={ROLE_GUIDES[role]} roleLabel={ROLE_META[role].label} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Support de formation académique complet */}
      <Card className="border-primary/30 bg-primary-50/40">
        <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><GraduationCap className="size-6" /></span>
            <div>
              <h3 className="font-bold text-foreground">Support de formation complet</h3>
              <p className="text-sm text-muted-foreground">Manuel académique : syllabus, modules par rôle, évaluation (QCM), glossaire et annexes — conçu pour la formation et téléchargeable en PDF.</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button asChild>
              <a href="/guides/formation" target="_blank" rel="noopener noreferrer"><GraduationCap className="size-4" /> Ouvrir le manuel</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/api/guides/formation/word"><FileText className="size-4" /> Word</a>
            </Button>
          </div>
        </CardContent>
      </Card>

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
