import { dodo, lifetimeProductId, monthlyProductId } from "@/lib/server/dodo";
import { currentOffer, getEntitlement, whoIs } from "@/lib/server/access";
import { failure, json, siteOrigin } from "@/lib/server/http";

export const runtime = "nodejs";

/** Starts a Dodo checkout for the signed-in person and returns the page to send them to. */
export async function POST(req: Request) {
  try {
    const who = await whoIs(req);
    if (!who) return json({ error: "Sign in first." }, { status: 401 });
    if ((await getEntitlement(who.email)).active) return json({ already: true });

    const offer = await currentOffer();
    if (offer.kind === "closed") return json({ error: "Sales are paused right now." }, { status: 409 });
    const productId = offer.kind === "lifetime" ? lifetimeProductId() : monthlyProductId();

    const session = await dodo().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email: who.email, ...(who.name ? { name: who.name } : {}) },
      return_url: `${siteOrigin(req)}/?checkout=return`,
      metadata: { uid: who.uid, email: who.email, plan: offer.kind },
      feature_flags: { allow_customer_editing_email: false },
    });
    if (!session.checkout_url) throw new Error("Dodo did not return a checkout page");
    return json({ url: session.checkout_url });
  } catch (e) {
    return failure(e);
  }
}
