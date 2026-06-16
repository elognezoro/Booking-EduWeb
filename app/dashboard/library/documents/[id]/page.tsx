import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Download, Eye, FileText, User, CalendarDays, Languages,
  GraduationCap, BookOpen, Hash, AlertTriangle, FlaskConical, Building2, Layers, Lock, CreditCard,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json";
import { canViewDocument, canDownloadDocument, canReserveDocument, needsAccessRequest, isDownloadPrivileged } from "@/lib/library/access";
import { setDownloadPrice, purchaseDownload, claimStudentExemption } from "@/app/actions/library";
import { Input } from "@/components/ui/input";
import { ENS_MATRICULE_EXAMPLE } from "@/lib/utils";
import { generateApaCitation } from "@/lib/library/citation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/misc";
import { DocumentTypeIcon } from "@/components/library/document-type-icon";
import { DocumentStatusBadge, AccessLevelBadge, DocumentCodeBadge } from "@/components/library/document-badges";
import { DocumentQRCode } from "@/components/library/document-qr";
import { CitationBox } from "@/components/library/citation-box";
import { ReviewActions } from "@/components/library/review-panel";
import { ReserveButton } from "@/components/library/reserve-button";
import { DOCUMENT_TYPE_LABELS, type DocumentType, documentStatusMeta } from "@/lib/library/enums";
import { fmtDateTime, fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

const REVIEW_DECISION_LABEL: Record<string, string> = {
  VALIDATED: "Validé", PUBLISHED: "Publié", NEEDS_CORRECTION: "Correction demandée",
  REJECTED: "Rejeté", SCIENCE_FAVORABLE: "Avis scientifique favorable", SCIENCE_RESERVED: "Avis scientifique réservé",
};

export default async function DocumentDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { deposited?: string; reserved?: string; exempt?: string } }) {
  const user = await requireUser();

  const doc = await prisma.documentResource.findUnique({
    where: { id: params.id },
    include: {
      collection: true, domain: true, library: true,
      authors: { orderBy: { order: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
      duplicateWarnings: { where: { resolved: false } },
    },
  });
  if (!doc) notFound();
  if (!canViewDocument(user, doc)) notFound();

  const isOrgMember = user.organizationId === doc.organizationId;
  const download = canDownloadDocument(user, doc);
  // Téléchargement payant (cadre paiement simulé)
  const price = doc.downloadPrice;
  const privileged = isDownloadPrivileged(user, doc);
  const hasPurchased = price > 0 && !privileged
    ? !!(await prisma.documentPurchase.findFirst({ where: { documentId: doc.id, userId: user.id } }))
    : false;
  const mustPay = price > 0 && !privileged && !hasPurchased;
  const canReserve = canReserveDocument(user, doc);
  const askAccess = needsAccessRequest(user, doc);
  const canReview = user.permissions.has("documents.review") && isOrgMember;
  const canScience = user.permissions.has("documents.science_review") && isOrgMember;

  const keywords = parseJson<string[]>(doc.keywords, []);
  const coAuthors = doc.authors.filter((a) => a.role === "CO_AUTHOR").map((a) => a.name);

  // Noms des relecteurs / créateur / validateur (liens String -> User)
  const userIds = Array.from(new Set([...doc.reviews.map((r) => r.reviewerId), doc.createdById, doc.validatedById].filter(Boolean) as string[]));
  const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, firstName: true, lastName: true } }) : [];
  const userName = (id?: string | null) => {
    const u = users.find((x) => x.id === id);
    return u ? `${u.firstName} ${u.lastName}` : "—";
  };

  const org = await prisma.organization.findUnique({ where: { id: doc.organizationId }, select: { name: true, slug: true } });
  const isEnsAbidjan = org?.slug === "ens-abidjan";
  const citation = generateApaCitation({ ...doc, institution: org?.name ?? undefined }, coAuthors);
  const code = doc.codeLong ?? doc.temporaryCode;

  return (
    <div className="space-y-5">
      <Link href="/dashboard/library/explore" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour à la bibliothèque
      </Link>

      {searchParams.deposited && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Votre dépôt a été enregistré et soumis à validation.
        </div>
      )}
      {searchParams.reserved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Votre demande a été transmise au documentaliste.
        </div>
      )}

      {/* En-tête */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <DocumentTypeIcon type={doc.documentType} size="lg" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {DOCUMENT_TYPE_LABELS[doc.documentType as DocumentType]} · {doc.collection.name} · {doc.domain.name}
              </p>
              <h1 className="mt-0.5 text-2xl font-extrabold leading-tight tracking-tight text-foreground">{doc.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <DocumentStatusBadge status={doc.status} />
                <AccessLevelBadge level={doc.accessLevel} />
                {code && <DocumentCodeBadge code={code} temporary={!doc.codeLong} />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {doc.abstract && (
            <Card>
              <CardHeader><CardTitle>Résumé</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{doc.abstract}</p></CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Métadonnées</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Meta icon={User} label="Auteur principal" value={doc.mainAuthorName} />
              {coAuthors.length > 0 && <Meta icon={User} label="Co-auteurs" value={coAuthors.join(", ")} />}
              {doc.supervisorName && <Meta icon={GraduationCap} label="Directeur" value={doc.supervisorName} />}
              {doc.year && <Meta icon={CalendarDays} label="Année" value={String(doc.year)} />}
              <Meta icon={Languages} label="Langue" value={doc.language} />
              {doc.level && <Meta icon={GraduationCap} label="Niveau" value={doc.level} />}
              {doc.pageCount && <Meta icon={FileText} label="Pages" value={String(doc.pageCount)} />}
              {doc.journalName && <Meta icon={BookOpen} label="Revue" value={`${doc.journalName}${doc.volume ? ` ${doc.volume}` : ""}${doc.issue ? `(${doc.issue})` : ""}`} />}
              {doc.doi && <Meta icon={Hash} label="DOI" value={doc.doi} />}
              <Meta icon={Building2} label="Institution" value={org?.name ?? "—"} />
              <Meta icon={Layers} label="Bibliothèque" value={doc.library.name} />
            </CardContent>
          </Card>

          {keywords.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Mots-clés</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">{keywords.map((k) => <Badge key={k} tone="info">{k}</Badge>)}</CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Citer ce document</CardTitle></CardHeader>
            <CardContent><CitationBox citation={citation} /></CardContent>
          </Card>

          {doc.reviews.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Historique & avis</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {doc.reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        {r.scientific && <FlaskConical className="size-3.5 text-advanced" />}
                        {REVIEW_DECISION_LABEL[r.decision] ?? r.decision}
                      </span>
                      <span className="text-xs text-muted-foreground">{userName(r.reviewerId)} · {fmtDateTime(r.createdAt)}</span>
                    </div>
                    {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-5">
          {/* Accès au fichier */}
          <Card>
            <CardHeader><CardTitle className="text-base">Accès au document</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {doc.fileKey ? (
                <>
                  {doc.consultationAllowed && (
                    <Button asChild className="w-full"><Link href={`/dashboard/library/documents/${doc.id}/read`}><Eye className="size-4" /> Consulter</Link></Button>
                  )}
                  {download.ok && doc.downloadAllowed && (
                    mustPay ? (
                      <div className="rounded-xl border border-pending/30 bg-pending-soft/40 p-3 text-center">
                        <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-foreground"><Lock className="size-4 text-pending" /> Téléchargement payant</p>
                        <p className="mt-0.5 text-lg font-extrabold text-foreground">{fmtFcfa(price)}</p>
                        <form action={purchaseDownload} className="mt-2">
                          <input type="hidden" name="id" value={doc.id} />
                          <Button type="submit" className="w-full"><CreditCard className="size-4" /> Payer et débloquer</Button>
                        </form>
                        <p className="mt-1 text-[11px] text-muted-foreground">Paiement simulé (démo) — un prestataire réel se branchera ici.</p>

                        {isEnsAbidjan && (
                          <div className="mt-3 border-t border-pending/30 pt-3 text-left">
                            <p className="text-xs font-semibold text-foreground">Étudiant de l'ENS d'Abidjan ?</p>
                            <p className="mb-1.5 text-[11px] text-muted-foreground">Saisissez votre matricule pour télécharger gratuitement.</p>
                            <form action={claimStudentExemption} className="flex items-end gap-2">
                              <input type="hidden" name="id" value={doc.id} />
                              <Input name="matricule" required aria-label="Matricule étudiant" placeholder={`Ex. ${ENS_MATRICULE_EXAMPLE}`} className="h-9 flex-1" />
                              <Button type="submit" variant="outline" size="sm">Télécharger</Button>
                            </form>
                            {searchParams.exempt === "invalid" && (
                              <p className="mt-1 text-[11px] font-semibold text-unavailable-fg">Matricule invalide ou non éligible.</p>
                            )}
                            <p className="mt-1 text-[10px] text-muted-foreground">Le matricule saisi doit correspondre à celui enregistré sur votre compte étudiant.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button asChild variant="outline" className="w-full">
                        <a href={`/api/documents/${doc.id}/file?dl=1`}><Download className="size-4" /> Télécharger{price > 0 ? " · débloqué ✓" : ""}</a>
                      </Button>
                    )
                  )}
                  {!doc.consultationAllowed && !(download.ok && doc.downloadAllowed) && (
                    <p className="rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">{download.reason ?? "Accès au fichier restreint."}</p>
                  )}
                  {canReview && (
                    <form action={setDownloadPrice} className="mt-1 flex items-end gap-2 rounded-xl border border-border p-2.5">
                      <input type="hidden" name="id" value={doc.id} />
                      <div className="flex-1">
                        <label htmlFor="price" className="text-[11px] font-semibold text-muted-foreground">Prix de téléchargement (FCFA · 0 = gratuit)</label>
                        <Input id="price" type="number" name="price" min={0} step={100} defaultValue={price} className="mt-1 h-9" />
                      </div>
                      <Button type="submit" variant="outline" size="sm">Définir</Button>
                    </form>
                  )}
                </>
              ) : (
                <p className="rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">Aucun fichier numérique attaché.</p>
              )}
              {(canReserve || askAccess) && <Separator className="my-1" />}
              <ReserveButton documentId={doc.id} canReserve={canReserve} needsRequest={askAccess && !canReserve} />
              {doc.physicalCopyAvailable && (
                <p className="text-center text-xs text-muted-foreground">{doc.availablePhysicalCopyCount}/{doc.physicalCopyCount} exemplaire(s) physique(s) disponible(s)</p>
              )}
            </CardContent>
          </Card>

          {/* Validation documentaire */}
          {(canReview || canScience) && (
            <Card>
              <CardHeader><CardTitle className="text-base">Validation documentaire</CardTitle></CardHeader>
              <CardContent>
                <ReviewActions documentId={doc.id} status={doc.status} canReview={canReview} canScience={canScience} />
              </CardContent>
            </Card>
          )}

          {/* Doublons */}
          {canReview && doc.duplicateWarnings.length > 0 && (
            <Card className="border-pending/30 bg-pending-soft/30">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4 text-pending" /> Doublons potentiels</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {doc.duplicateWarnings.map((w) => (
                  <div key={w.id}>
                    <p className="font-semibold text-foreground">{w.similarTitle ?? "Document similaire"}</p>
                    <p className="text-xs text-muted-foreground">{w.reason} · score {w.score}%</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* QR + stats */}
          <Card>
            <CardHeader><CardTitle className="text-base">Code & QR</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <DocumentQRCode documentId={doc.id} />
              <div className="grid w-full grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-secondary/60 p-3"><p className="text-xl font-extrabold text-foreground">{doc.consultationCount}</p><p className="text-xs text-muted-foreground">consultations</p></div>
                <div className="rounded-xl bg-secondary/60 p-3"><p className="text-xl font-extrabold text-foreground">{doc.downloadCount}</p><p className="text-xs text-muted-foreground">téléchargements</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Suivi */}
          <Card>
            <CardContent className="space-y-1.5 py-4 text-sm">
              <Line label="Déposé par" value={userName(doc.createdById)} />
              {doc.validatedById && <Line label="Validé par" value={userName(doc.validatedById)} />}
              {doc.validatedAt && <Line label="Validé le" value={fmtDate(doc.validatedAt)} />}
              {doc.publishedAt && <Line label="Publié le" value={fmtDate(doc.publishedAt)} />}
              {doc.status === "REJECTED" && doc.rejectedReason && (
                <p className="mt-2 rounded-lg bg-unavailable-soft p-2 text-xs text-unavailable-fg">Motif : {doc.rejectedReason}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="truncate text-sm font-semibold text-foreground">{value}</p></div>
    </div>
  );
}
function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="font-semibold text-foreground">{value}</span></div>;
}
function fmtFcfa(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
