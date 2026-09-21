// Géorepérage du pointage des salles multimédias (anti-fraude professionnelle) :
// la position GPS du surveillant est OBLIGATOIRE à l'ouverture et à la fermeture,
// et doit tomber dans le périmètre institutionnel quand celui-ci est configuré
// (Organization.campusLat/campusLng/campusRadiusM, page Organisation).

export interface CampusPerimeter {
  lat: number;
  lng: number;
  radiusM: number;
}

/** Distance en mètres entre deux points GPS (formule de haversine). */
export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000; // rayon terrestre moyen (m)
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

/** Rayon par défaut du périmètre institutionnel (m) si l'admin n'en fixe pas. */
export const DEFAULT_CAMPUS_RADIUS_M = 300;

/**
 * Vérifie qu'une position tombe dans le périmètre du campus. La précision GPS
 * annoncée est tolérée jusqu'à 100 m (plafonnée : une « précision » énorme
 * envoyée par un client frauduleux n'élargit pas la zone).
 */
export function checkWithinPerimeter(
  pos: { lat: number; lng: number; accuracy?: number | null },
  campus: CampusPerimeter
): { ok: boolean; distanceM: number } {
  const distanceM = distanceMeters(pos.lat, pos.lng, campus.lat, campus.lng);
  const tolerance = Math.min(Math.max(pos.accuracy ?? 0, 0), 100);
  return { ok: distanceM <= campus.radiusM + tolerance, distanceM };
}

/** Périmètre d'une organisation, s'il est configuré. */
export function campusOf(org: { campusLat: number | null; campusLng: number | null; campusRadiusM: number | null }): CampusPerimeter | null {
  if (org.campusLat == null || org.campusLng == null) return null;
  return { lat: org.campusLat, lng: org.campusLng, radiusM: org.campusRadiusM ?? DEFAULT_CAMPUS_RADIUS_M };
}
