import Link from "next/link";
import { BookCopy, Undo2, User, CalendarClock } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { returnLoan } from "@/app/actions/library";
import { LOAN_STATUS_META, type LoanStatus } from "@/lib/library/enums";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function LoansPage() {
  const user = await requirePermission("documents.review");
  await getCurrentUser();
  const loans = await prisma.documentLoan.findMany({
    where: { document: { organizationId: user.organizationId ?? "" } },
    orderBy: { borrowedAt: "desc" },
    include: { document: { select: { id: true, title: true } } },
  });

  const userIds = Array.from(new Set(loans.map((l) => l.userId)));
  const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, firstName: true, lastName: true } }) : [];
  const name = (id: string) => { const u = users.find((x) => x.id === id); return u ? `${u.firstName} ${u.lastName}` : "—"; };
  const now = new Date();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Emprunts"
        description="Suivi des emprunts d'exemplaires physiques."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><BookCopy className="size-6" /></span>}
      />

      {loans.length === 0 ? (
        <EmptyState icon={BookCopy} title="Aucun emprunt" description="Aucun exemplaire physique n'est actuellement emprunté." />
      ) : (
        <div className="space-y-2">
          {loans.map((l) => {
            const overdue = l.status === "BORROWED" && new Date(l.dueDate) < now;
            const effective = overdue ? "OVERDUE" : (l.status as LoanStatus);
            const meta = LOAN_STATUS_META[effective] ?? { label: l.status, tone: "neutral" as const };
            return (
              <Card key={l.id}>
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link href={`/dashboard/library/documents/${l.document.id}`} className="truncate font-bold text-foreground hover:text-primary">{l.document.title}</Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><User className="size-3" /> {name(l.userId)}</span>
                      <span className="inline-flex items-center gap-1"><CalendarClock className="size-3" /> Retour prévu : {fmtDate(l.dueDate)}</span>
                      {l.returnedAt && <span>· rendu le {fmtDate(l.returnedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={meta.tone} dot>{meta.label}</Badge>
                    {l.status === "BORROWED" && (
                      <form action={returnLoan}>
                        <input type="hidden" name="loanId" value={l.id} />
                        <Button type="submit" size="sm" variant="outline"><Undo2 className="size-4" /> Marquer rendu</Button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
