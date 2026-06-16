import { requireUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand/logo";
import { GuidePrintActions } from "@/components/help/guide-print-actions";
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
        <div className="space-y-10">
          {guides.map((role) => {
            const guide = ROLE_GUIDES[role];
            return (
              <section key={role} className="break-inside-avoid">
                <h2 className="text-xl font-extrabold text-foreground">{guide.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{guide.intro}</p>

                <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-foreground">Ce que vous pouvez faire</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                  {guide.can.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>

                <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-foreground">Comment procéder</h3>
                <div className="mt-2 space-y-4">
                  {guide.sections.map((s) => (
                    <div key={s.title} className="break-inside-avoid">
                      <p className="font-bold text-foreground">{s.title}</p>
                      <ol className="mt-1.5 space-y-1.5 pl-1">
                        {s.steps.map((step, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-foreground">
                            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary">
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-muted-foreground">
        EduWeb Booking — Plateforme intelligente de réservation des ressources · Guide généré automatiquement.
      </p>
    </div>
  );
}
