import { EntriesView } from "@/components/finances/entries-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "Encaissements · Finances · EduWeb Booking" };

export default async function EncaissementsPage({
  searchParams,
}: {
  searchParams: { espace?: string; saved?: string; deleted?: string; error?: string };
}) {
  return <EntriesView kind="INCOME" searchParams={searchParams} />;
}
