// Ministères du gouvernement actuel de Côte d'Ivoire — liste de référence pré-remplie (éditable ensuite).
// Compilée par recherche web + vérification croisée (workflow). À ajuster en cas de remaniement.
export interface RefMinistry {
  name: string;
  acronym?: string;
}

export const CI_MINISTRIES: RefMinistry[] = [
  { name: "Ministère de la Défense" },
  { name: "Ministère d'État, ministère de la Fonction publique et de la Modernisation de l'administration" },
  { name: "Ministère d'État, ministère des Affaires étrangères et de la Coopération internationale", acronym: "MAE" },
  { name: "Ministère de la Justice et des Droits de l'Homme (Garde des Sceaux)" },
  { name: "Ministère de l'Intérieur et de la Sécurité", acronym: "MIS" },
  { name: "Ministère de l'Économie, des Finances et du Budget", acronym: "MEFB" },
  { name: "Ministère du Plan et du Développement" },
  { name: "Ministère du Portefeuille de l'État et des Entreprises publiques" },
  { name: "Ministère des Mines, du Pétrole et de l'Énergie", acronym: "MMPE" },
  { name: "Ministère de l'Agriculture, du Développement rural et des Productions vivrières", acronym: "MINADER" },
  { name: "Ministère du Commerce, de l'Industrie et de l'Artisanat" },
  { name: "Ministère des Transports et des Affaires maritimes" },
  { name: "Ministère des Infrastructures et de l'Entretien routier" },
  { name: "Ministère de l'Hydraulique, de l'Assainissement et de la Salubrité" },
  { name: "Ministère de l'Urbanisme, du Logement et du Cadre de vie" },
  { name: "Ministère de l'Environnement et de la Transition écologique" },
  { name: "Ministère des Eaux et Forêts" },
  { name: "Ministère des Ressources animales et halieutiques", acronym: "MIRAH" },
  { name: "Ministère de la Santé, de l'Hygiène publique et de la Couverture maladie universelle", acronym: "MSHPCMU" },
  { name: "Ministère de l'Éducation nationale, de l'Alphabétisation et de l'Enseignement technique", acronym: "MENA" },
  { name: "Ministère de l'Enseignement supérieur et de la Recherche scientifique", acronym: "MESRS" },
  { name: "Ministère de l'Emploi, de la Protection sociale et de la Formation professionnelle" },
  { name: "Ministère de la Promotion de la Jeunesse, de l'Insertion professionnelle et du Service civique" },
  { name: "Ministère de la Cohésion sociale, de la Solidarité et de la Lutte contre la pauvreté" },
  { name: "Ministère de la Femme, de la Famille et de l'Enfant", acronym: "MFFE" },
  { name: "Ministère de la Transition numérique et de l'Innovation technologique" },
  { name: "Ministère de la Communication (Porte-parole du Gouvernement)" },
  { name: "Ministère de la Culture et de la Francophonie" },
  { name: "Ministère du Tourisme et des Loisirs" },
  { name: "Ministère des Sports" },
  { name: "Ministère délégué chargé des Affaires maritimes" },
  { name: "Ministère délégué chargé de l'Intégration africaine et des Ivoiriens de l'extérieur" },
  { name: "Ministère délégué chargé de l'Enseignement technique" },
  { name: "Ministère délégué chargé des Productions vivrières" },
];
