import { grantEntitlement, accessFor, whoIs } from "@/lib/server/access";
import type { Who } from "@/lib/server/access";
import { dodo, lifetimeProductId, monthlyProductId } from "@/lib/server/dodo";
import { failure, json } from "@/lib/server/http";

export const runtime = "nodejs";

interface PaymentLike {
  status?: string;
  metadata?: Record<string, string>;
  subscription_id?: string | null;
  product_cart?: { product_id: string }[];
  customer?: { email?: string };
}

/**
 * Called when the buyer comes back from Dodo. The payment is looked up with Dodo (never trusted from the URL),
 * must have succeeded, must have been started by this same signed-in account, and must be for our product.
 */
export async function POST(req: Request) {
  try {
    const who = await whoIs(req);
    if (!who) return json({ error: "Sign in first." }, { status: 401 });
    const { payment_id } = (await req.json().catch(() => ({}))) as { payment_id?: string };
    if (!payment_id || !/^[A-Za-z0-9_-]{6,80}$/.test(payment_id)) return json({ error: "Missing payment." }, { status: 400 });

    const pay = (await dodo().payments.retrieve(payment_id)) as unknown as PaymentLike;
    if (pay.status !== "succeeded") return json({ error: "That payment hasn't completed.", status: pay.status ?? "unknown" }, { status: 409 });
    if (pay.metadata?.uid !== who.uid) return json({ error: "That payment belongs to a different account." }, { status: 403 });

    const bought = (pay.product_cart ?? []).map((p) => p.product_id);
    const plan = bought.includes(lifetimeProductId()) ? "lifetime" : bought.includes(monthlyProductId()) ? "monthly" : null;
    if (!plan) return json({ error: "That payment isn't for Pasteables." }, { status: 400 });

    await grantEntitlement(who as Who, plan, payment_id, pay.subscription_id ?? undefined);
    return json(await accessFor(who));
  } catch (e) {
    return failure(e);
  }
}
