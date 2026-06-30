import {
  GraduationCap,
  Target,
  ListChecks,
  CircleCheck,
  BookOpenCheck,
  FlaskConical,
  ClipboardCheck,
  Layers,
  Users,
  Clock,
  KeySquare,
  FileSpreadsheet,
  LifeBuoy,
  Presentation,
  BookMarked,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { AudioReader } from "@/components/certel/n1/audio-reader";
import { ROLE_GUIDES } from "@/lib/guides";
import { ROLE_META, type RoleKey } from "@/lib/enums";
import { ROLE_PERMISSIONS, PERMISSION_LABELS, PERMISSIONS, type Permission } from "@/lib/permissions";
import {
  type TrainingContent,
  roleWrappers,
  ROLE_TRAINING_ORDER,
  ROLE_FAMILIES,
} from "@/lib/training";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const ABCD = ["A", "B", "C", "D", "E", "F"];

/* ------------------------------------------------------------------ */
/* Briques de mise en page                                             */
/* ------------------------------------------------------------------ */

function Part({ n, title, subtitle, icon: Icon, children, id }: { n: number; title: string; subtitle?: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="break-before-page pt-2">
      <header className="mb-6 flex items-start gap-3 border-b-2 border-primary pb-3">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon className="size-6" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Partie {ROMAN[n - 1]}</p>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Block({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="break-inside-avoid">
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-primary">
        {Icon && <Icon className="size-4" />} {title}
      </h3>
      {children}
    </div>
  );
}

function Bullets({ items, marker = "disc" }: { items: string[]; marker?: "disc" | "check" }) {
  if (marker === "check") {
    return (
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-available-fg" />
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-muted-foreground marker:text-primary">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

function Chip({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-semibold text-foreground">
      <Icon className="size-3.5 text-primary" /> <span className="text-muted-foreground">{label} :</span> {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Module pédagogique (tronc commun + rôle)                            */
/* ------------------------------------------------------------------ */

function ModuleShell({
  code,
  titre,
  publicCible,
  duree,
  prerequis,
  objectifs,
  competences,
  atelier,
  evaluation,
  children,
}: {
  code: string;
  titre: string;
  publicCible: string;
  duree: string;
  prerequis: string[];
  objectifs: string[];
  competences: string[];
  atelier: string[];
  evaluation: string[];
  children?: React.ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card break-inside-avoid">
      <header className="border-b border-border bg-secondary/40 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-extrabold tracking-wide text-primary-foreground">{code}</span>
          <h3 className="text-lg font-extrabold tracking-tight text-foreground">{titre}</h3>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Chip icon={Users} label="Public" value={publicCible} />
          <Chip icon={Clock} label="Durée" value={duree} />
        </div>
      </header>
      <div className="space-y-4 px-5 py-4">
        {prerequis.length > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Prérequis : </span>
            {prerequis.join(" · ")}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Block title="Objectifs pédagogiques" icon={Target}>
            <Bullets items={objectifs} marker="check" />
          </Block>
          <Block title="Compétences visées" icon={GraduationCap}>
            <Bullets items={competences} />
          </Block>
        </div>
        {children}
        <div className="grid gap-4 sm:grid-cols-2">
          <Block title="Atelier pratique" icon={FlaskConical}>
            <Bullets items={atelier} />
          </Block>
          <Block title="Évaluation du module" icon={ClipboardCheck}>
            <Bullets items={evaluation} />
          </Block>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Document complet                                                    */
/* ------------------------------------------------------------------ */

export function TrainingManual({ content, generatedOn }: { content: TrainingContent; generatedOn: string }) {
  const { apercu, syllabus, modulesCommuns, qcm, annexes } = content;
  const wrappers = roleWrappers(content);

  const partTitles = [
    "Présentation & cadre général",
    "Syllabus de la formation",
    "Architecture & parcours",
    "Tronc commun",
    "Modules de formation par rôle",
    "Évaluation & validation des acquis",
    "Annexes",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10 text-foreground">
      {/* ---------- Couverture ---------- */}
      <section className="flex min-h-[60vh] break-after-page flex-col justify-between rounded-3xl border border-border bg-secondary/30 p-10">
        <BrandLogo />
        <div className="py-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Support de formation</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            EduWeb Booking
          </h1>
          <p className="mt-2 text-xl font-semibold text-muted-foreground">
            Manuel de formation des utilisateurs
          </p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {syllabus.finalite}
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">Plateforme intelligente de réservation des ressources &amp; bibliothèque numérique</p>
            <p>Édition pilote — ENS d'Abidjan, Côte d'Ivoire</p>
          </div>
          <p>Document généré le {generatedOn}</p>
        </div>
      </section>

      {/* ---------- Sommaire ---------- */}
      <section className="break-after-page">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground">
          <ListChecks className="size-6 text-primary" /> Sommaire
        </h2>
        <ol className="space-y-1.5">
          {partTitles.map((t, i) => (
            <li key={i}>
              <a href={`#partie-${i + 1}`} className="flex items-baseline justify-between gap-3 border-b border-dashed border-border py-1.5 text-sm hover:text-primary">
                <span className="font-semibold text-foreground">
                  <span className="mr-2 text-primary">Partie {ROMAN[i]}</span>
                  {t}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          Ce manuel se lit en complément des guides par rôle du « Centre d'aide ». Les démarches pas à pas y sont reprises et encadrées par des objectifs pédagogiques, des compétences visées, des ateliers pratiques et des modalités d'évaluation.
        </p>
      </section>

      {/* ---------- Partie I — Présentation & cadre ---------- */}
      <Part n={1} id="partie-1" title={partTitles[0]} subtitle="Contexte, périmètre et vocabulaire de la plateforme" icon={Presentation}>
        <div className="no-print -mt-2"><AudioReader text={apercu.presentation.map((b) => `${b.titre}. ${b.texte}`).join(" ")} label="Écouter la présentation" /></div>
        {apercu.presentation.map((b, i) => (
          <div key={i} className="break-inside-avoid">
            <h3 className="mb-1.5 text-base font-bold text-foreground">{b.titre}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{b.texte}</p>
          </div>
        ))}

        <Block title="Périmètre fonctionnel" icon={Layers}>
          <Bullets items={apercu.perimetre} marker="check" />
        </Block>

        <Block title="Lexique" icon={BookMarked}>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {apercu.glossaire.map((g, i) => (
              <div key={i} className="break-inside-avoid">
                <dt className="text-sm font-bold text-foreground">{g.terme}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{g.definition}</dd>
              </div>
            ))}
          </dl>
        </Block>
      </Part>

      {/* ---------- Partie II — Syllabus ---------- */}
      <Part n={2} id="partie-2" title={partTitles[1]} subtitle={syllabus.intitule} icon={GraduationCap}>
        <div className="flex flex-wrap gap-1.5">
          <Chip icon={Clock} label="Durée totale" value={syllabus.duree} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Block title="Public cible" icon={Users}>
            <Bullets items={syllabus.publicCible} />
          </Block>
          <Block title="Prérequis" icon={CircleCheck}>
            <Bullets items={syllabus.prerequis} />
          </Block>
        </div>

        <div className="rounded-xl border-l-4 border-primary bg-primary-50/50 px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">Finalité</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{syllabus.finalite}</p>
        </div>

        <Block title="Objectifs pédagogiques généraux" icon={Target}>
          <ul className="space-y-1.5">
            {syllabus.objectifsGeneraux.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-0.5 shrink-0 rounded bg-advanced-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-advanced-fg">{o.niveauBloom}</span>
                <span className="leading-relaxed">{o.objectif}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Compétences visées" icon={GraduationCap}>
          <Bullets items={syllabus.competences} marker="check" />
        </Block>

        <div className="grid gap-4 sm:grid-cols-2">
          <Block title="Volume horaire indicatif" icon={Clock}>
            <table className="w-full text-sm">
              <tbody>
                {syllabus.volumeHoraire.map((v, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5 pr-3 text-muted-foreground">{v.label}</td>
                    <td className="py-1.5 text-right font-semibold text-foreground">{v.valeur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>
          <div className="space-y-4">
            <Block title="Modalités" icon={Presentation}>
              <Bullets items={syllabus.modalites} />
            </Block>
            <Block title="Méthodes pédagogiques" icon={ListChecks}>
              <Bullets items={syllabus.methodes} />
            </Block>
          </div>
        </div>

        <Block title="Moyens & ressources" icon={Layers}>
          <Bullets items={syllabus.moyens} />
        </Block>

        <Block title="Dispositif d'évaluation" icon={ClipboardCheck}>
          <div className="space-y-2">
            {syllabus.evaluation.map((e, i) => (
              <div key={i} className="rounded-lg border border-border bg-secondary/30 px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{e.type}</p>
                <p className="text-sm leading-relaxed text-foreground">{e.description}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Critères de réussite" icon={CircleCheck}>
          <Bullets items={syllabus.criteresReussite} marker="check" />
        </Block>
      </Part>

      {/* ---------- Partie III — Architecture & parcours ---------- */}
      <Part n={3} id="partie-3" title={partTitles[2]} subtitle="Du tronc commun aux parcours par rôle" icon={Layers}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          La formation s'organise en un <strong className="text-foreground">tronc commun</strong> (modules T1 à T3, suivis par tous les profils) puis un <strong className="text-foreground">module métier</strong> propre à chaque rôle. Le tableau ci-dessous présente l'aiguillage des parcours par famille de rôles.
        </p>
        <div className="overflow-hidden rounded-xl border border-border break-inside-avoid">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Famille</th>
                <th className="px-3 py-2 font-bold text-foreground">Rôles concernés</th>
                <th className="px-3 py-2 font-bold text-foreground">Parcours</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_FAMILIES.map((f, i) => (
                <tr key={i} className="border-t border-border align-top">
                  <td className="px-3 py-2 font-semibold text-foreground">{f.famille}</td>
                  <td className="px-3 py-2 text-muted-foreground">{f.roles.map((r) => ROLE_META[r].label).join(", ")}</td>
                  <td className="px-3 py-2 text-muted-foreground">Tronc commun (T1–T3) + module métier</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Part>

      {/* ---------- Partie IV — Tronc commun ---------- */}
      <Part n={4} id="partie-4" title={partTitles[3]} subtitle="Modules transversaux communs à tous les utilisateurs" icon={ListChecks}>
        {modulesCommuns.modules.map((m, i) => (
          <ModuleShell
            key={i}
            code={m.code}
            titre={m.titre}
            publicCible={m.public}
            duree={m.duree}
            prerequis={m.prerequis}
            objectifs={m.objectifs}
            competences={m.competences}
            atelier={m.atelier}
            evaluation={m.evaluation}
          >
            <Block title="Déroulé" icon={ListChecks}>
              <div className="space-y-3">
                {m.deroule.map((d, j) => (
                  <div key={j}>
                    <p className="text-sm font-semibold text-foreground">{d.titre}</p>
                    <Bullets items={d.points} />
                  </div>
                ))}
              </div>
            </Block>
          </ModuleShell>
        ))}
      </Part>

      {/* ---------- Partie V — Modules par rôle ---------- */}
      <Part n={5} id="partie-5" title={partTitles[4]} subtitle="Un module métier par rôle, adossé au guide d'utilisation correspondant" icon={Users}>
        {ROLE_TRAINING_ORDER.map((role, idx) => {
          const guide = ROLE_GUIDES[role];
          const w = wrappers[role];
          if (!guide || !w) return null;
          return (
            <ModuleShell
              key={role}
              code={`M${idx + 1}`}
              titre={guide.title}
              publicCible={ROLE_META[role].label}
              duree={w.duree}
              prerequis={w.prerequis}
              objectifs={w.objectifs}
              competences={w.competences}
              atelier={w.atelier}
              evaluation={w.evaluation}
            >
              <Block title="Déroulé détaillé" icon={BookOpenCheck}>
                <div className="no-print mb-2"><AudioReader text={`${guide.intro} ${guide.sections.map((s) => `${s.title}. ${s.steps.join(" ")}`).join(" ")}`} label="Écouter le module" /></div>
                <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{guide.intro}</p>
                <ol className="space-y-3">
                  {guide.sections.map((s, j) => (
                    <li key={j} className="break-inside-avoid">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded bg-primary-50 text-[11px] font-bold text-primary">{j + 1}</span>
                        {s.title}
                      </p>
                      <ul className="ml-7 mt-1 list-disc space-y-0.5 text-sm leading-relaxed text-muted-foreground marker:text-primary">
                        {s.steps.map((step, k) => (
                          <li key={k}>{step}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </Block>
            </ModuleShell>
          );
        })}
      </Part>

      {/* ---------- Partie VI — Évaluation & QCM ---------- */}
      <Part n={6} id="partie-6" title={partTitles[5]} subtitle="Banque de questions à choix multiples et corrigé" icon={ClipboardCheck}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          L'évaluation sommative repose sur un questionnaire à choix multiples. Chaque question comporte une seule bonne réponse. Le corrigé figure à la fin de chaque thème. Seuil de réussite recommandé : 70 % de bonnes réponses.
        </p>
        {qcm.banques.map((bank, bi) => (
          <div key={bi} className="break-inside-avoid space-y-3">
            <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-extrabold text-primary-foreground">Thème {bi + 1}</span>
              {bank.theme}
            </h3>
            <ol className="space-y-3">
              {bank.questions.map((q, qi) => (
                <li key={qi} className="break-inside-avoid rounded-lg border border-border px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">{qi + 1}. {q.enonce}</p>
                  <ul className="mt-1.5 space-y-0.5">
                    {q.options.map((opt, oi) => (
                      <li key={oi} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="font-bold text-primary">{ABCD[oi]}.</span> {opt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="rounded-lg border-l-4 border-available bg-available-soft/40 px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-available-fg">Corrigé — {bank.theme}</p>
              <ol className="mt-1 space-y-1">
                {bank.questions.map((q, qi) => (
                  <li key={qi} className="text-sm leading-relaxed text-foreground">
                    <span className="font-bold">{qi + 1}. {ABCD[q.bonneReponse] ?? "?"}</span>
                    <span className="text-muted-foreground"> — {q.justification}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </Part>

      {/* ---------- Partie VII — Annexes ---------- */}
      <Part n={7} id="partie-7" title={partTitles[6]} subtitle="Matrice des droits, imports, sécurité, dépannage et fiche formateur" icon={Layers}>
        {/* Annexe A — Matrice rôles × permissions (dérivée du code) */}
        <Block title={`Annexe A — Matrice des rôles et permissions`} icon={ShieldCheck}>
          <p className="mb-2 text-sm text-muted-foreground">
            Permissions effectivement accordées à chaque rôle dans l'application (✔ = autorisé).
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-secondary/60">
                  <th className="sticky left-0 bg-secondary/60 px-2 py-2 text-left font-bold text-foreground">Permission</th>
                  {ROLE_TRAINING_ORDER.map((r) => (
                    <th key={r} className="px-1.5 py-2 text-center font-bold text-foreground" title={ROLE_META[r].label}>
                      {r === "SUPER_ADMIN" ? "S.ADM" : r === "ORG_ADMIN" ? "ADM" : r.slice(0, 4)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(PERMISSIONS as readonly Permission[]).map((perm) => (
                  <tr key={perm} className="border-t border-border">
                    <td className="sticky left-0 bg-card px-2 py-1 text-left text-muted-foreground">{PERMISSION_LABELS[perm]}</td>
                    {ROLE_TRAINING_ORDER.map((r) => (
                      <td key={r} className="px-1.5 py-1 text-center">
                        {ROLE_PERMISSIONS[r].includes(perm) ? <span className="font-bold text-available-fg">✔</span> : <span className="text-border">·</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Légende : {ROLE_TRAINING_ORDER.map((r) => `${r === "SUPER_ADMIN" ? "S.ADM" : r === "ORG_ADMIN" ? "ADM" : r.slice(0, 4)} = ${ROLE_META[r].label}`).join(" · ")}.
          </p>
        </Block>

        {/* Annexe B — Import CSV */}
        <Block title="Annexe B — Imports par fichier CSV" icon={FileSpreadsheet}>
          <div className="grid gap-3 sm:grid-cols-2">
            {annexes.importCsv.map((c, i) => (
              <div key={i} className="break-inside-avoid rounded-xl border border-border p-3">
                <p className="text-sm font-bold text-foreground">{c.fichier}</p>
                <p className="mt-1 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Colonnes : </span><span className="font-mono">{c.colonnes.join(", ")}</span></p>
                <ol className="mt-2 ml-4 list-decimal space-y-0.5 text-sm text-muted-foreground marker:text-primary">
                  {c.etapes.map((e, j) => (
                    <li key={j}>{e}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Block>

        {/* Annexe C — Mot de passe */}
        <Block title="Annexe C — Gestion du mot de passe" icon={KeySquare}>
          <div className="space-y-3">
            {annexes.motDePasse.map((p, i) => (
              <div key={i} className="break-inside-avoid rounded-xl border border-border p-3">
                <p className="text-sm font-bold text-foreground">{p.scenario}</p>
                <ol className="mt-1.5 ml-4 list-decimal space-y-0.5 text-sm text-muted-foreground marker:text-primary">
                  {p.etapes.map((e, j) => (
                    <li key={j}>{e}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Block>

        {/* Annexe D — Dépannage */}
        <Block title="Annexe D — Dépannage & questions fréquentes" icon={LifeBuoy}>
          <dl className="space-y-2">
            {annexes.depannage.map((f, i) => (
              <div key={i} className="break-inside-avoid rounded-lg border border-border bg-secondary/20 px-3 py-2">
                <dt className="text-sm font-bold text-foreground">{f.probleme}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{f.solution}</dd>
              </div>
            ))}
          </dl>
        </Block>

        {/* Annexe E — Fiche formateur */}
        <Block title="Annexe E — Fiche formateur (session type)" icon={Presentation}>
          <div className="overflow-hidden rounded-xl border border-border break-inside-avoid">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60 text-left">
                  <th className="px-3 py-2 font-bold text-foreground">Phase</th>
                  <th className="px-3 py-2 font-bold text-foreground">Durée</th>
                  <th className="px-3 py-2 font-bold text-foreground">Activité</th>
                </tr>
              </thead>
              <tbody>
                {annexes.ficheFormateur.deroule.map((d, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="px-3 py-2 font-semibold text-foreground">{d.phase}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{d.duree}</td>
                    <td className="px-3 py-2 text-muted-foreground">{d.activite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Block title="Conseils d'animation">
              <Bullets items={annexes.ficheFormateur.conseils} />
            </Block>
            <Block title="Matériel requis">
              <Bullets items={annexes.ficheFormateur.materiel} marker="check" />
            </Block>
          </div>
        </Block>
      </Part>

      <p className="border-t border-border pt-5 text-center text-xs text-muted-foreground">
        EduWeb Booking — Manuel de formation des utilisateurs · Document de référence à usage pédagogique · {generatedOn}
      </p>
    </div>
  );
}
