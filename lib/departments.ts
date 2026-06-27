/** Rangs d'affichage (alignement) d'un service. La valeur est le niveau d'indentation stocké
 * (0=Direction, 1=Sous-Direction, 2=Service, 3=Sous-service) ; "" = automatique (profondeur du parent).
 * Module neutre (sans "use client") afin d'être importable côté serveur ET client. */
export const DEPARTMENT_LEVELS: { value: string; label: string }[] = [
  { value: "", label: "Automatique (suivre le rattachement)" },
  { value: "0", label: "Direction" },
  { value: "1", label: "Sous-Direction" },
  { value: "2", label: "Service" },
  { value: "3", label: "Sous-service / Bureau" },
];
