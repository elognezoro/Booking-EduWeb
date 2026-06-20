import { requireUser } from "@/lib/auth";
import { buildGuideDocx } from "@/lib/docx/guide-doc";
import { ROLE_GUIDES } from "@/lib/guides";
import type { RoleKey } from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Export Word (.docx) des guides par rôle de l'utilisateur connecté.
export async function GET() {
  const user = await requireUser();
  const roles = user.roles.filter((r): r is RoleKey => r in ROLE_GUIDES);
  const buf = await buildGuideDocx(roles.length ? roles : (["REQUESTER"] as RoleKey[]), {
    userName: user.fullName,
    orgName: user.organizationName ?? undefined,
  });
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="guide-eduweb-booking.docx"',
      "Cache-Control": "no-store",
    },
  });
}
