import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/jwt";

export const dynamic = "force-dynamic";

// Efface un cookie de session périmé (utilisateur supprimé/réinitialisé) puis renvoie vers /login.
// Évite toute boucle de redirection /dashboard ⇄ /login.
export function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
