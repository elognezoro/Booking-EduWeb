import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Protection de l'espace connecté uniquement.
  // NB : la redirection « déjà connecté » est gérée côté page /login via getCurrentUser
  // (vérification en base), afin d'éviter toute boucle de redirection avec un jeton périmé.
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
