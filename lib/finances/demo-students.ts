// Étudiants FICTIFS de démonstration (noms inventés) — répartis selon les FILIÈRES RÉELLES
// du Centre de la Formation Initiale de l'ENS d'Abidjan (référentiel lib/finances/ens-academics),
// pour tester la cascade Filière → Discipline du champ « Payeur » et l'espace Scolarité.
// Créés avec `demo: true` : purgeables en un clic avant l'enrôlement réel.

export interface DemoStudent {
  fullName: string;
  matricule: string;
  department: string; // filière
  section: string; // discipline / spécialité ("" = filière sans subdivision)
}

const PL = "Professeurs de Lycée";
const ED = "Éducateurs";
const IO = "Inspecteurs d'Orientation";

/** 4 noms fictifs par groupe ; matricules factices au format des listes officielles. */
const GROUPES: { department: string; section: string; suffix: string; names: string[] }[] = [
  { department: PL, section: "Allemand", suffix: "PL/ALL", names: ["TANOH Affoué Clarisse", "SORO Yaya", "ADOU Kouakou Elysée", "KABORE Awa"] },
  { department: PL, section: "Anglais", suffix: "PL/AN", names: ["KOUAME Adjoua Grâce", "COULIBALY Drissa", "N'GUESSAN Amenan Rachel", "SILUE Kalilou"] },
  { department: PL, section: "Espagnol", suffix: "PL/ESP", names: ["BROU Ama Sylvie", "FOFANA Moussa", "EHUI Mélèdje Olivia", "DAGO Zébié Arsène"] },
  { department: PL, section: "Histoire-Géographie", suffix: "PL/HG", names: ["KOFFI Yao Modeste", "CAMARA Aminata", "GBOGOU Djédjé Innocent", "SANOGO Rokia"] },
  { department: PL, section: "Lettres Modernes", suffix: "PL/LM", names: ["KONE Mariam", "YAO Kouadio Ferdinand", "SEKA Ahou Prisca", "DIABATE Lacina"] },
  { department: PL, section: "Mathématiques", suffix: "PL/MA", names: ["ANOH Kouassi Cyrille", "DOUMBIA Salimata", "KRA Konan Wilfried", "TRAORE Adama"] },
  { department: PL, section: "Philosophie", suffix: "PL/PH", names: ["ASSI Koffi Bertrand", "OUATTARA Fatoumata", "ZADI Gnaoré Léa", "TOURE Ibrahim"] },
  { department: PL, section: "Sciences Physiques", suffix: "PL/SP", names: ["ABOA Akoua Nadège", "DEMBELE Bakary", "LOBA Gnamien Éric", "CISSE Kadiatou"] },
  { department: PL, section: "SVT", suffix: "PL/SVT", names: ["AMANI Affoussiata", "GOGOUA Zamblé Hervé", "KONAN Amoin Solange", "OUEDRAOGO Issouf"] },
  { department: ED, section: "", suffix: "ED", names: ["KOUASSI Akissi Marthe", "BAMBA Souleymane", "AKA N'Da Estelle", "GNAHORE Serge Pacôme"] },
  { department: IO, section: "", suffix: "IO", names: ["ETTE Akwaba Josiane", "BERTE Zié Vincent", "ALLA Kouadio Norbert", "MEITE Ramata"] },
];

export const DEMO_STUDENTS: DemoStudent[] = GROUPES.flatMap((g, gi) =>
  g.names.map((fullName, i) => ({
    fullName,
    matricule: `2${i % 2 ? 4 : 5}-${"ABCDEFGHJK"[gi]}-D9${String(gi + 1).padStart(2, "0")}${i + 1}${g.suffix}`,
    department: g.department,
    section: g.section,
  }))
);
