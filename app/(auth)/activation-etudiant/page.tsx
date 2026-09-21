import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { StudentActivationForm } from "@/components/auth/student-activation-form";

export const metadata: Metadata = { title: "Activer mon compte étudiant" };
export const dynamic = "force-dynamic";

// Activation en libre-service des comptes des étudiants enrôlés par la Scolarité
// (identité vérifiée par matricule + date de naissance des listes officielles).
export default async function StudentActivationPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  return <StudentActivationForm />;
}
