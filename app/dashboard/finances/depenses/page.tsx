import { EntriesView } from "@/components/finances/entries-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dépenses · Finances · EduWeb Booking" };

export default async function DepensesPage({
  searchParams,
}: {
  searchParams: { espace?: string; saved?: string; deleted?: string; error?: string };
}) {
  return <EntriesView kind="EXPENSE" searchParams={searchParams} />;
}
