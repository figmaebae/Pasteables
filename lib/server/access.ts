import "server-only";
import { randomBytes } from "node:crypto";
import { LIFETIME_SEATS } from "@/lib/access-config";
import type { AccessInfo, Offer, Plan } from "@/lib/access-config";
import { adminAuth, db } from "./admin";
import { dodo, lifetimeProductId, monthlyProductId } from "./dodo";

export interface Who {
  uid: string;
  email: string;
  name?: string;
}

/** The signed-in person behind a request, from the Firebase ID token the page sends. Null when signed out or the token is bad. */
export async function whoIs(req: Request): Promise<Who | null> {
  const h = req.headers.get("authorization") ?? "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token) return null;
  try {
    const d = await adminAuth().verifyIdToken(token);
    if (!d.email || d.email_verified === false) return null;
    return { uid: d.uid, email: d.email.toLowerCase(), name: typeof d.name === "string" ? d.name : undefined };
  } catch {
    return null;
  }
}

interface EntitlementDoc {
  email: string;
  uid: string;
  plan: Plan;
  licenseKey: string;
  paymentId: string;
  subscriptionId?: string;
  status: "active" | "inactive";
  createdAt: number;
  checkedAt?: number;
}

const ent = (email: string) => db().collection("entitlements").doc(email.toLowerCase());

/** PSTE-XXXX-XXXX-XXXX-XXXX, from letters and digits that are easy to read out. */
export function newLicenseKey() {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(16);
  const part = (o: number) => Array.from(bytes.subarray(o, o + 4), (b) => A[b % A.length]).join("");
  return `PSTE-${part(0)}-${part(4)}-${part(8)}-${part(12)}`;
}

const HOUR = 3600_000;

/** Whether this email has paid. Monthly plans are re-checked with Dodo at most once an hour. Lifetime never lapses. */
export async function getEntitlement(email: string): Promise<{ active: boolean; plan?: Plan; licenseKey?: string }> {
  const snap = await ent(email).get();
  if (!snap.exists) return { active: false };
  const e = snap.data() as EntitlementDoc;
  if (e.plan === "lifetime") return { active: e.status === "active", plan: "lifetime", licenseKey: e.licenseKey };
  if (e.subscriptionId && (!e.checkedAt || Date.now() - e.checkedAt > HOUR)) {
    try {
      const sub = (await dodo().subscriptions.retrieve(e.subscriptionId)) as unknown as { status?: string };
      const active = sub.status === "active" || sub.status === "on_hold";
      await ent(email).update({ status: active ? "active" : "inactive", checkedAt: Date.now() });
      return { active, plan: "monthly", licenseKey: e.licenseKey };
    } catch {
      // Dodo unreachable: keep the last known answer.
    }
  }
  return { active: e.status === "active", plan: "monthly", licenseKey: e.licenseKey };
}

export async function grantEntitlement(who: Who, plan: Plan, paymentId: string, subscriptionId?: string) {
  const ref = ent(who.email);
  const snap = await ref.get();
  if (snap.exists) {
    const cur = snap.data() as EntitlementDoc;
    // A lifetime purchase is never replaced by a monthly one, and a repeat confirmation changes nothing.
    if (cur.plan === "lifetime" || cur.paymentId === paymentId) {
      if (cur.status !== "active" && cur.plan === "monthly") await ref.update({ status: "active", checkedAt: Date.now() });
      return;
    }
  }
  const doc: EntitlementDoc = {
    email: who.email,
    uid: who.uid,
    plan,
    licenseKey: snap.exists ? (snap.data() as EntitlementDoc).licenseKey : newLicenseKey(),
    paymentId,
    ...(subscriptionId ? { subscriptionId } : {}),
    status: "active",
    createdAt: Date.now(),
    checkedAt: Date.now(),
  };
  await ref.set(doc);
}

export async function lifetimeSold() {
  const agg = await db().collection("entitlements").where("plan", "==", "lifetime").count().get();
  return agg.data().count;
}

let priceCache: Record<string, { at: number; amount: number; currency: string }> = {};
async function priceOf(productId: string) {
  const hit = priceCache[productId];
  if (hit && Date.now() - hit.at < 60_000) return hit;
  const p = (await dodo().products.retrieve(productId)) as unknown as { price?: { price?: number; currency?: string } };
  const v = { at: Date.now(), amount: p.price?.price ?? 0, currency: p.price?.currency ?? "INR" };
  priceCache[productId] = v;
  return v;
}

/** What a new buyer is offered right now: the one-time price while seats last, then the monthly plan. */
export async function currentOffer(): Promise<Offer> {
  const sold = await lifetimeSold();
  const seatsLeft = Math.max(0, LIFETIME_SEATS - sold);
  if (seatsLeft > 0 && lifetimeProductId()) {
    const p = await priceOf(lifetimeProductId());
    return { kind: "lifetime", amount: p.amount, currency: p.currency, seatsLeft, seats: LIFETIME_SEATS };
  }
  if (monthlyProductId()) {
    const p = await priceOf(monthlyProductId());
    return { kind: "monthly", amount: p.amount, currency: p.currency, seatsLeft, seats: LIFETIME_SEATS };
  }
  return { kind: "closed", seatsLeft, seats: LIFETIME_SEATS };
}

export async function accessFor(who: Who | null): Promise<AccessInfo> {
  const offer = await currentOffer();
  if (!who) return { signedIn: false, active: false, offer };
  const e = await getEntitlement(who.email);
  return { signedIn: true, email: who.email, active: e.active, plan: e.plan, licenseKey: e.licenseKey, offer };
}

export function resetPriceCache() {
  priceCache = {};
}
