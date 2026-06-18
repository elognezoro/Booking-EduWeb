import { requireUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand/logo";
import { GuidePrintActions } from "@/components/help/guide-print-actions";
import { GuideArticle } from "@/components/help/guide-article";
import { ROLE_GUIDES } from "@/lib/guides";
import { ROLE_META, type RoleKey } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function GuidePrintPage() {
  const user = await requireUser();
  const roles = user.roles.filter((r): r is RoleKey => r in ROLE_GUIDES);
  const guides = roles.length ? roles : [];

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-start justify-between border-b border-border pb-5">
        <div>
          <BrandLogo />
          <h1 className="mt-3 text-2xl font-extrabold text-foreground">
            Guide d'utilisation{guides.length > 1 ? "s" : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user.fullName}
            {user.organizationName ? ` · ${user.organizationName}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Rôle(s) : {roles.map((r) => ROLE_META[r]?.label ?? r).join(", ") || "—"}
            {" · généré le "}
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
        <GuidePrintActions />
      </div>

      {guides.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun guide associé à votre profil pour le moment.</p>
      ) : (
        <div className="space-y-8">
          {guides.map((role) => (
            <GuideArticle key={role} guide={ROLE_GUIDES[role]} roleLabel={ROLE_META[role]?.label ?? role} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-muted-foreground">
        EduWeb Booking — Plateforme intelligente de réservation des ressources · Guide généré automatiquement.
      </p>
    </div>
  );
}
