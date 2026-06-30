/**
 * Toutes les pages CERTEL (programme, diagnostic, niveaux, évaluations, certificats) sont des surfaces
 * de FORMATION : on y applique le plancher typographique « ≥ 13 px » via `.formation-scope`
 * (règle CSS dans app/globals.css). Wrapper neutre en mise en page (aucune marge/largeur imposée).
 */
export default function CertelLayout({ children }: { children: React.ReactNode }) {
  return <div className="formation-scope">{children}</div>;
}
