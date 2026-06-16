// Module edge-safe (jose uniquement) : signature/vérification du jeton de session.
// Importable depuis le middleware ET les server components.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "eduweb_session";

export interface SessionPayload {
  sub: string; // userId
  email: string;
  name: string;
  roles: string[];
  organizationId: string | null;
  [key: string]: unknown;
}

function getSecret() {
  const secret = process.env.AUTH_SECRET || "eduweb-booking-insecure-development-secret";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload, maxAgeSeconds = 60 * 60 * 24 * 7) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("eduweb-booking")
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: "eduweb-booking" });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
