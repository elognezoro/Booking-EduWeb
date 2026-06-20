import { requireUser } from "@/lib/auth";
import { buildTrainingDocx } from "@/lib/docx/training-doc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Export Word (.docx) du support de formation complet.
export async function GET() {
  await requireUser();
  const buf = await buildTrainingDocx();
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="manuel-formation-eduweb-booking.docx"',
      "Cache-Control": "no-store",
    },
  });
}
