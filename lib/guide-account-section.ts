// Section universelle ajoutée à la fin de chaque guide (commune à tous les
// utilisateurs connectés). Isolée ici pour être partagée par le rendu écran
// (components/help/guide-article.tsx) et l'export Word (lib/docx).
export const ACCOUNT_SECTION = {
  title: "Gérer mon compte et ma sécurité",
  steps: [
    "Ouvrez « Mon compte » (menu Principal) pour consulter vos informations et changer votre mot de passe.",
    "Saisissez votre mot de passe actuel, puis un nouveau mot de passe (8 caractères minimum) et sa confirmation, puis cliquez sur « Mettre à jour le mot de passe ».",
    "Suivez la cloche de notifications, en haut à droite, pour les décisions et les rappels qui vous concernent.",
    "Déconnectez-vous depuis le menu portant votre nom lorsque vous avez terminé votre session.",
  ],
};
