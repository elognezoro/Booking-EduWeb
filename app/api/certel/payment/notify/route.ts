import { NextRequest } from "next/server";
import { reconcileCertelPayment } from "@/lib/certel/payment";

export const dynamic = "force-dynamic";

/**
 * Webhook CinetPay (notify_url). CinetPay envoie le `cpm_trans_id` (notre transaction_id) ;
 * on revérifie l'état auprès de CinetPay (source de vérité) avant de marquer payé. Idempotent.
 */
export async function POST(req: NextRequest) {
  let transactionId: string | null = null;
  try {
    const form = await req.formData();
    transactionId = (form.get("cpm_trans_id") || form.get("transaction_id"))?.toString() || null;
  } catch {
    try {
      const body = await req.json();
      transactionId = body?.cpm_trans_id || body?.transaction_id || null;
    } catch { /* ignore */ }
  }
  if (!transactionId) return new Response("missing transaction id", { status: 400 });

  const result = await reconcileCertelPayment(transactionId);
  if (result === "UNKNOWN") return new Response("unknown transaction", { status: 404 });
  return new Response("OK", { status: 200 });
}

// CinetPay peut "pinger" l'URL en GET lors de la configuration.
export async function GET() {
  return new Response("CinetPay notify endpoint", { status: 200 });
}
