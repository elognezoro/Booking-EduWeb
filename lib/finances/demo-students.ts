// Étudiants FICTIFS de démonstration (noms inventés) — répartis par département et
// section/filière de l'ENS d'Abidjan pour tester la cascade du champ « Payeur ».
// Créés avec `demo: true` : purgeables en un clic avant l'import des vrais étudiants.

export interface DemoStudent {
  fullName: string;
  matricule: string;
  department: string;
  section: string;
}

const D = {
  AL: "Département des Arts et Lettres",
  LG: "Département des Langues",
  HG: "Département Histoire et Géographie",
  ST: "Département Sciences et Technologie",
  SE: "Département des Sciences de l'Éducation",
};

export const DEMO_STUDENTS: DemoStudent[] = [
  // ——— Arts et Lettres · Arts ———
  { fullName: "KOUASSI Akissi Marthe", matricule: "24-A-P10201ART/SP", department: D.AL, section: "Arts" },
  { fullName: "BAMBA Souleymane", matricule: "24-A-P10202ART/SP", department: D.AL, section: "Arts" },
  { fullName: "AKA N'Da Estelle", matricule: "23-B-P10203ART/SP", department: D.AL, section: "Arts" },
  { fullName: "GNAHORE Serge Pacôme", matricule: "23-B-P10204ART/SP", department: D.AL, section: "Arts" },
  // ——— Arts et Lettres · Lettres Modernes ———
  { fullName: "KONE Mariam", matricule: "24-A-P10301LMO/SP", department: D.AL, section: "Lettres Modernes" },
  { fullName: "YAO Kouadio Ferdinand", matricule: "24-A-P10302LMO/SP", department: D.AL, section: "Lettres Modernes" },
  { fullName: "SEKA Ahou Prisca", matricule: "23-B-P10303LMO/SP", department: D.AL, section: "Lettres Modernes" },
  { fullName: "DIABATE Lacina", matricule: "23-B-P10304LMO/SP", department: D.AL, section: "Lettres Modernes" },
  // ——— Arts et Lettres · Philosophie ———
  { fullName: "ASSI Koffi Bertrand", matricule: "24-A-P10401PHI/SP", department: D.AL, section: "Philosophie" },
  { fullName: "OUATTARA Fatoumata", matricule: "24-A-P10402PHI/SP", department: D.AL, section: "Philosophie" },
  { fullName: "ZADI Gnaoré Léa", matricule: "23-B-P10403PHI/SP", department: D.AL, section: "Philosophie" },
  { fullName: "TOURE Ibrahim", matricule: "23-B-P10404PHI/SP", department: D.AL, section: "Philosophie" },
  // ——— Langues · Anglais ———
  { fullName: "KOUAME Adjoua Grâce", matricule: "24-A-P20101ANG/SP", department: D.LG, section: "Anglais" },
  { fullName: "COULIBALY Drissa", matricule: "24-A-P20102ANG/SP", department: D.LG, section: "Anglais" },
  { fullName: "N'GUESSAN Amenan Rachel", matricule: "23-B-P20103ANG/SP", department: D.LG, section: "Anglais" },
  { fullName: "SILUE Kalilou", matricule: "23-B-P20104ANG/SP", department: D.LG, section: "Anglais" },
  // ——— Langues · Allemand ———
  { fullName: "TANOH Affoué Clarisse", matricule: "24-A-P20201ALL/SP", department: D.LG, section: "Allemand" },
  { fullName: "SORO Yaya", matricule: "24-A-P20202ALL/SP", department: D.LG, section: "Allemand" },
  { fullName: "ADOU Kouakou Elysée", matricule: "23-B-P20203ALL/SP", department: D.LG, section: "Allemand" },
  { fullName: "KABORE Awa", matricule: "23-B-P20204ALL/SP", department: D.LG, section: "Allemand" },
  // ——— Langues · Espagnol ———
  { fullName: "BROU Ama Sylvie", matricule: "24-A-P20301ESP/SP", department: D.LG, section: "Espagnol" },
  { fullName: "FOFANA Moussa", matricule: "24-A-P20302ESP/SP", department: D.LG, section: "Espagnol" },
  { fullName: "EHUI Mélèdje Olivia", matricule: "23-B-P20303ESP/SP", department: D.LG, section: "Espagnol" },
  { fullName: "DAGO Zébié Arsène", matricule: "23-B-P20304ESP/SP", department: D.LG, section: "Espagnol" },
  // ——— Histoire et Géographie ———
  { fullName: "KOFFI Yao Modeste", matricule: "24-A-P30101HGE/SP", department: D.HG, section: "Histoire-Géographie" },
  { fullName: "CAMARA Aminata", matricule: "24-A-P30102HGE/SP", department: D.HG, section: "Histoire-Géographie" },
  { fullName: "GBOGOU Djédjé Innocent", matricule: "23-B-P30103HGE/SP", department: D.HG, section: "Histoire-Géographie" },
  { fullName: "SANOGO Rokia", matricule: "23-B-P30104HGE/SP", department: D.HG, section: "Histoire-Géographie" },
  // ——— Sciences et Technologie · Mathématiques ———
  { fullName: "ANOH Kouassi Cyrille", matricule: "24-A-P40101MAT/SP", department: D.ST, section: "Mathématiques" },
  { fullName: "DOUMBIA Salimata", matricule: "24-A-P40102MAT/SP", department: D.ST, section: "Mathématiques" },
  { fullName: "KRA Konan Wilfried", matricule: "23-B-P40103MAT/SP", department: D.ST, section: "Mathématiques" },
  { fullName: "TRAORE Adama", matricule: "23-B-P40104MAT/SP", department: D.ST, section: "Mathématiques" },
  // ——— Sciences et Technologie · Sciences Physiques ———
  { fullName: "ABOA Akoua Nadège", matricule: "24-A-P40201SPH/SP", department: D.ST, section: "Sciences Physiques" },
  { fullName: "DEMBELE Bakary", matricule: "24-A-P40202SPH/SP", department: D.ST, section: "Sciences Physiques" },
  { fullName: "LOBA Gnamien Éric", matricule: "23-B-P40203SPH/SP", department: D.ST, section: "Sciences Physiques" },
  { fullName: "CISSE Kadiatou", matricule: "23-B-P40204SPH/SP", department: D.ST, section: "Sciences Physiques" },
  // ——— Sciences et Technologie · SVT ———
  { fullName: "AMANI Affoussiata", matricule: "24-A-P40301SVT/SP", department: D.ST, section: "Sciences de la Vie et de la Terre (SVT)" },
  { fullName: "GOGOUA Zamblé Hervé", matricule: "24-A-P40302SVT/SP", department: D.ST, section: "Sciences de la Vie et de la Terre (SVT)" },
  { fullName: "KONAN Amoin Solange", matricule: "23-B-P40303SVT/SP", department: D.ST, section: "Sciences de la Vie et de la Terre (SVT)" },
  { fullName: "OUEDRAOGO Issouf", matricule: "23-B-P40304SVT/SP", department: D.ST, section: "Sciences de la Vie et de la Terre (SVT)" },
  // ——— Sciences de l'Éducation ———
  { fullName: "ETTE Akwaba Josiane", matricule: "24-A-P50101SED/SP", department: D.SE, section: "Sciences de l'Éducation" },
  { fullName: "BERTE Zié Vincent", matricule: "24-A-P50102SED/SP", department: D.SE, section: "Sciences de l'Éducation" },
  { fullName: "ALLA Kouadio Norbert", matricule: "23-B-P50103SED/SP", department: D.SE, section: "Sciences de l'Éducation" },
  { fullName: "MEITE Ramata", matricule: "23-B-P50104SED/SP", department: D.SE, section: "Sciences de l'Éducation" },
];
