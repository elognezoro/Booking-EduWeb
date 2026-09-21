import Link from "next/link";
import {
  GraduationCap, Users, UserPlus, Upload, Download, Sparkles, Trash2, CheckCircle2,
  AlertTriangle, ArrowUpRight, Filter, KeyRound, BadgeCheck, CalendarRange, Info,
} from "lucide-react";
import { requirePermission, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { ConfirmActionButton } from "@/components/confirm-action";
import { StudentForm } from "@/components/scolarite/student-form";
import { ENS_DEPARTMENTS } from "@/lib/finances/ens-academics";
import {
  STUDENT_YEARS, STUDENT_STATUS, yearLabel, currentAcademicYear, nextAcademicYear,
  academicYearOptions, type StudentStatus,
} from "@/lib/scolarite/constants";
import {
  importStudentsCsv, seedDemoStudents, deleteStudentsBulk, deleteStudent,
  promoteStudent, promoteAllStudents, createStudentAccount,
} from "@/app/actions/scolarite";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalide: "Saisie invalide : nom, département et section sont obligatoires.",
  matricule: "Matricule invalide — respectez le format ENS (ex. 23-B-P17498IPS/SP).",
  "matricule-existe": "Ce matricule est déjà enrôlé dans l'institution.",
  introuvable: "Fiche introuvable.",
  csv: "Fichier CSV illisible ou vide.",
  colonnes: "Colonnes introuvables dans le CSV : il faut au minimum « nom » et « departement » (téléchargez le modèle).",
  demoexiste: "Les fiches de démonstration existent déjà — supprimez-les d'abord.",
  doublon: "Import impossible : des matricules de démonstration existent déjà.",
  "compte-deja": "Cet étudiant a déjà un compte de connexion.",
  "email-manquant": "Renseignez d'abord l'e-mail de l'étudiant (fiche à recréer avec e-mail).",
  "email-autre-org": "Cet e-mail appartient déjà à un compte d'une autre institution.",
};

export default async function ScolaritePage({
  searchParams,
}: {
  searchParams: { [k: string]: string | undefined };
}) {
  const user = await requirePermission("scolarite.read");
  const canManage = hasPermission(user, "scolarite.manage");
  const orgId = user.organizationId;

  if (!orgId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="max-w-md"><CardContent className="py-10 text-center text-sm text-muted-foreground">
          La scolarité est gérée par institution — votre compte n'est rattaché à aucune institution.
        </CardContent></Card>
      </div>
    );
  }

  // Filtres (formulaire GET — la cascade Section se précise après le choix du département).
  const q = (searchParams.q ?? "").trim();
  const fDept = searchParams.dept ?? "";
  const fSection = searchParams.section ?? "";
  const fYear = searchParams.annee === "1" || searchParams.annee === "2" ? Number(searchParams.annee) : null;
  const fStatus = searchParams.statut && searchParams.statut in STUDENT_STATUS ? (searchParams.statut as StudentStatus) : null;
  const fCampagne = (searchParams.campagne ?? "").trim();

  const where = {
    organizationId: orgId,
    ...(q ? { OR: [{ fullName: { contains: q, mode: "insensitive" as const } }, { matricule: { contains: q.toUpperCase() } }] } : {}),
    ...(fDept ? { department: fDept } : {}),
    ...(fSection ? { section: fSection } : {}),
    ...(fYear ? { year: fYear } : {}),
    ...(fStatus ? { status: fStatus } : {}),
    ...(fCampagne ? { academicYear: fCampagne } : {}),
  };

  const [students, actifs, annee1, annee2, diplomes, demoCount, campagnes] = await Promise.all([
    prisma.student.findMany({ where, orderBy: [{ fullName: "asc" }], take: 400 }),
    prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
    prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE", year: 1 } }),
    prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE", year: 2 } }),
    prisma.student.count({ where: { organizationId: orgId, status: "DIPLOME" } }),
    prisma.student.count({ where: { organizationId: orgId, demo: true } }),
    prisma.student.findMany({ where: { organizationId: orgId }, distinct: ["academicYear"], select: { academicYear: true }, orderBy: { academicYear: "desc" } }),
  ]);

  const currentAY = currentAcademicYear();
  const ayOptions = [...new Set([...academicYearOptions(), ...campagnes.map((c) => c.academicYear)])].sort().reverse();
  const sectionOptions = fDept
    ? ENS_DEPARTMENTS.find((d) => d.name === fDept)?.sections ?? []
    : [...new Set(ENS_DEPARTMENTS.flatMap((d) => d.sections))];

  const kpis = [
    { label: "Étudiants actifs", value: actifs, icon: Users, cls: "bg-primary-50 text-primary" },
    { label: "Première année", value: annee1, icon: GraduationCap, cls: "bg-sky-50 text-sky-700" },
    { label: "Deuxième année", value: annee2, icon: GraduationCap, cls: "bg-advanced-soft text-advanced-fg" },
    { label: "Diplômés", value: diplomes, icon: BadgeCheck, cls: "bg-available-soft text-available-fg" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scolarité — Enrôlement des étudiants"
        description="Dossier central des étudiants de l'institution : enrôlement (manuel ou CSV), formation en deux années (Première et Deuxième année), passage d'année, comptes de connexion. Alimente la liste des payeurs (Finances)."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><GraduationCap className="size-6" /></span>}
      />

      {/* Bannières */}
      {searchParams.created && <Banner ok text="Étudiant enrôlé." />}
      {searchParams.imported && <Banner ok text={`${searchParams.imported} étudiant(s) importé(s)${Number(searchParams.skipped) > 0 ? ` · ${searchParams.skipped} ignoré(s) (matricule déjà enrôlé)` : ""}.`} />}
      {searchParams.demo && <Banner ok text={`${searchParams.demo} fiche(s) de démonstration créée(s) (réparties Première / Deuxième année).`} />}
      {searchParams.deleted && <Banner ok text={`${searchParams.deleted} fiche(s) supprimée(s).`} />}
      {searchParams.promoted && <Banner ok text="Promotion effectuée." />}
      {searchParams.promotedall !== undefined && (
        <Banner ok text={`Passage d'année effectué : ${searchParams.promotedall} passage(s) en Deuxième année, ${searchParams.graduated ?? 0} diplômé(s).`} />
      )}
      {searchParams.account && <Banner ok text="Compte de connexion créé/relié (mot de passe initial : password123)." />}
      {searchParams.error && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" /> {ERRORS[searchParams.error] ?? "Une erreur est survenue."}
        </div>
      )}

      {/* Indicateurs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-2xl font-black text-foreground">{k.value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{k.label}</p>
              </div>
              <span className={`inline-flex size-10 items-center justify-center rounded-xl ${k.cls}`}><k.icon className="size-5" /></span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* ===================== LISTE ===================== */}
        <div className="min-w-0 space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="py-4">
              <form method="get" className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-3">
                  <Input name="q" defaultValue={q} placeholder="Rechercher (nom ou matricule)…" aria-label="Recherche" />
                </div>
                <Select name="dept" defaultValue={fDept} aria-label="Filière">
                  <option value="">Toutes les filières</option>
                  {ENS_DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </Select>
                <Select name="section" defaultValue={fSection} aria-label="Discipline">
                  <option value="">Toutes les disciplines</option>
                  {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select name="annee" defaultValue={fYear ? String(fYear) : ""} aria-label="Année">
                  <option value="">Les deux années</option>
                  {STUDENT_YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                </Select>
                <Select name="statut" defaultValue={fStatus ?? ""} aria-label="Statut">
                  <option value="">Tous les statuts</option>
                  {(Object.keys(STUDENT_STATUS) as StudentStatus[]).map((s) => <option key={s} value={s}>{STUDENT_STATUS[s].label}</option>)}
                </Select>
                <Select name="campagne" defaultValue={fCampagne} aria-label="Campagne">
                  <option value="">Toutes les campagnes</option>
                  {ayOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                </Select>
                <Button type="submit" variant="outline" className="h-10"><Filter className="size-4" /> Filtrer</Button>
              </form>
            </CardContent>
          </Card>

          {/* Tableau */}
          <Card className="overflow-hidden">
            <CardHeader><CardTitle className="text-base">{students.length} étudiant(s) affiché(s)</CardTitle></CardHeader>
            {students.length === 0 ? (
              <CardContent className="pb-8"><EmptyState icon={Users} title="Aucun étudiant pour ce filtre." description={canManage ? "Enrôlez un étudiant, importez un CSV, ou générez les fiches de démonstration." : undefined} /></CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5 font-bold">Étudiant</th>
                      <th className="px-4 py-2.5 font-bold">Matricule</th>
                      <th className="px-4 py-2.5 font-bold">Filière · Discipline · TD</th>
                      <th className="px-4 py-2.5 font-bold">Année</th>
                      <th className="px-4 py-2.5 font-bold">Campagne</th>
                      <th className="px-4 py-2.5 font-bold">Statut</th>
                      {canManage && <th className="px-4 py-2.5 font-bold">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map((s) => (
                      <tr key={s.id} className="align-middle">
                        <td className="px-4 py-2.5">
                          <span className="font-semibold text-foreground">{s.fullName}</span>
                          {s.demo && <Badge tone="pending" className="ml-1.5 text-[10px]">démo</Badge>}
                          {s.email && <span className="block text-xs text-muted-foreground">{s.email}</span>}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.matricule ?? "—"}</td>
                        <td className="px-4 py-2.5 text-foreground">
                          {s.department}
                          <span className="block text-xs text-muted-foreground">
                            {[s.section, s.tdGroup].filter(Boolean).join(" · ") || "—"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5">
                          <Badge tone={s.year === 1 ? "info" : "advanced"}>{yearLabel(s.year, true)}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{s.academicYear}</td>
                        <td className="whitespace-nowrap px-4 py-2.5">
                          <Badge tone={STUDENT_STATUS[(s.status as StudentStatus) in STUDENT_STATUS ? (s.status as StudentStatus) : "ACTIVE"].tone}>
                            {STUDENT_STATUS[(s.status as StudentStatus) in STUDENT_STATUS ? (s.status as StudentStatus) : "ACTIVE"].label}
                          </Badge>
                          {s.userId && <Badge tone="available" className="ml-1" title="Compte de connexion lié"><KeyRound className="mr-0.5 inline size-3" />compte</Badge>}
                        </td>
                        {canManage && (
                          <td className="whitespace-nowrap px-4 py-2.5">
                            <div className="flex items-center gap-1">
                              {s.status === "ACTIVE" && (
                                <form action={promoteStudent}>
                                  <input type="hidden" name="id" value={s.id} />
                                  <Button type="submit" variant="ghost" size="sm" title={s.year === 1 ? "Passer en Deuxième année" : "Déclarer diplômé(e)"}>
                                    <ArrowUpRight className="size-4" /> {s.year === 1 ? "2ᵉ année" : "Diplômer"}
                                  </Button>
                                </form>
                              )}
                              {!s.userId && s.email && (
                                <form action={createStudentAccount}>
                                  <input type="hidden" name="id" value={s.id} />
                                  <Button type="submit" variant="ghost" size="sm" title="Créer le compte de connexion"><KeyRound className="size-4" /> Compte</Button>
                                </form>
                              )}
                              <ConfirmActionButton
                                action={deleteStudent}
                                hidden={{ id: s.id }}
                                triggerLabel=""
                                triggerIcon={<Trash2 className="size-4 text-unavailable" />}
                                triggerVariant="ghost"
                                triggerSize="icon-sm"
                                title={`Supprimer la fiche de « ${s.fullName} » ?`}
                                description="Suppression définitive de la fiche d'enrôlement (le compte de connexion éventuel n'est pas supprimé). L'opération est tracée dans le journal d'audit."
                                confirmLabel="Supprimer"
                                confirmVariant="destructive"
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
            La formation à l'ENS d'Abidjan dure deux années. Les étudiants ACTIFS alimentent automatiquement la liste
            des payeurs du module Finances (reçus). Toutes les opérations sont tracées dans le journal d'audit.
          </p>
        </div>

        {/* ===================== ACTIONS ===================== */}
        {canManage && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserPlus className="size-4" /> Nouvel étudiant</CardTitle></CardHeader>
              <CardContent><StudentForm academicYears={ayOptions} defaultAcademicYear={currentAY} /></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Upload className="size-4" /> Enrôlement par CSV</CardTitle></CardHeader>
              <CardContent>
                <form action={importStudentsCsv} className="space-y-2.5">
                  <FileDropzone
                    name="file"
                    accept=".csv,text/csv"
                    required
                    className="gap-1 rounded-xl px-3 py-5"
                    title="Glissez-déposez ou choisissez un fichier CSV"
                    hint="Colonnes : nom, matricule, departement, section, annee (1 ou 2), email"
                  />
                  <div>
                    <label htmlFor="import-ay" className="mb-1 block text-xs font-semibold text-muted-foreground">Campagne d'enrôlement</label>
                    <Select id="import-ay" name="academicYear" defaultValue={currentAY}>
                      {ayOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                    </Select>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="submit" size="sm"><Upload className="size-4" /> Importer</Button>
                    <Button asChild size="sm" variant="ghost">
                      <a href="/api/scolarite/students/template"><Download className="size-4" /> Modèle CSV</a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Les matricules déjà enrôlés sont ignorés (pas de doublon).</p>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarRange className="size-4" /> Passage d'année</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Clôture de campagne : les <strong>Deuxième année</strong> deviennent <strong>Diplômés</strong>, les{" "}
                  <strong>Première année</strong> passent en <strong>Deuxième année</strong> (campagne {nextAcademicYear(currentAY)}).
                </p>
                <ConfirmActionButton
                  action={promoteAllStudents}
                  hidden={{ academicYear: nextAcademicYear(currentAY) }}
                  triggerLabel="Effectuer le passage d'année"
                  triggerIcon={<ArrowUpRight className="size-4" />}
                  triggerVariant="outline"
                  fullWidthTrigger
                  title="Effectuer le passage d'année pour toute l'institution ?"
                  description={`${annee2} étudiant(s) de Deuxième année seront déclarés Diplômés et ${annee1} de Première année passeront en Deuxième année (campagne ${nextAcademicYear(currentAY)}). Opération tracée — les promotions individuelles restent possibles ligne par ligne.`}
                  confirmLabel="Confirmer le passage"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4" /> Démonstration & purge</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {demoCount === 0 ? (
                  <form action={seedDemoStudents}>
                    <Button type="submit" size="sm" variant="outline" className="w-full"><Sparkles className="size-4" /> Générer des étudiants de démonstration</Button>
                  </form>
                ) : (
                  <ConfirmActionButton
                    action={deleteStudentsBulk}
                    hidden={{ mode: "demo" }}
                    triggerLabel={`Supprimer les ${demoCount} fiches de démonstration`}
                    triggerIcon={<Trash2 className="size-4" />}
                    triggerVariant="outline"
                    fullWidthTrigger
                    title="Supprimer toutes les fiches de démonstration ?"
                    description="Seules les fiches fictives (badge « démo ») sont supprimées — les étudiants réellement enrôlés ne sont pas touchés. À faire avant l'enrôlement réel."
                    confirmLabel="Supprimer la démo"
                    confirmVariant="destructive"
                  />
                )}
                {students.length > 0 || actifs + diplomes > 0 ? (
                  <ConfirmActionButton
                    action={deleteStudentsBulk}
                    hidden={{ mode: "all" }}
                    triggerLabel="Vider tout l'enrôlement"
                    triggerIcon={<Trash2 className="size-4" />}
                    triggerVariant="ghost"
                    fullWidthTrigger
                    title="Supprimer TOUTES les fiches étudiantes de l'institution ?"
                    description="Suppression définitive de tout l'enrôlement (import CSV, saisies manuelles et démo). Les comptes de connexion et les écritures financières existants ne sont pas modifiés. Opération tracée."
                    confirmLabel="Tout supprimer"
                    confirmVariant="destructive"
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Banner({ ok, text }: { ok?: boolean; text: string }) {
  void ok;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
      <CheckCircle2 className="size-5" /> {text}
    </div>
  );
}
