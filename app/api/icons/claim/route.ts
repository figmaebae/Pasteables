import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { FREE_ICONS_PER_DAY } from "@/lib/access-config";
import { getEntitlement, whoIs } from "@/lib/server/access";
import { db } from "@/lib/server/admin";
import { failure } from "@/lib/server/http";

export const runtime = "nodejs";

const sha = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 32);
const SALT = () => process.env.ICON_LIMIT_SALT ?? process.env.DODO_PAYMENTS_API_KEY ?? "pasteables";
/** The "day" rolls over at midnight in India. */
const dayKey = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

/**
 * Asks to copy or download an icon. People with access always get a yes. Everyone else gets a few different icons a day,
 * counted per device AND per network address together, so a second email (or a cleared cookie) on the same device or
 * connection does not reset the count. Asking again for an icon already counted today is free.
 */
export async function POST(req: Request) {
  try {
    const { id } = (await req.json().catch(() => ({}))) as { id?: string };
    if (!id || !/^[a-z0-9-]{1,80}$/.test(id)) return NextResponse.json({ error: "Bad icon." }, { status: 400 });

    const who = await whoIs(req);
    if (who && (await getEntitlement(who.email)).active) return NextResponse.json({ ok: true, unlimited: true }, { headers: { "Cache-Control": "no-store" } });

    const jar = req.headers.get("cookie") ?? "";
    let device = /(?:^|;\s*)pst_did=([A-Za-z0-9-]{20,60})/.exec(jar)?.[1];
    const fresh = !device;
    if (!device) device = randomUUID();
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

    const day = dayKey();
    const refs = [db().collection("iconClaims").doc(`${day}_d_${sha(SALT() + device)}`), db().collection("iconClaims").doc(`${day}_i_${sha(SALT() + ip)}`)];

    const result = await db().runTransaction(async (tx) => {
      const snaps = await Promise.all(refs.map((r) => tx.get(r)));
      const used = new Set<string>(snaps.flatMap((s) => (s.exists ? ((s.data()?.ids as string[]) ?? []) : [])));
      if (used.has(id)) return { ok: true, remaining: FREE_ICONS_PER_DAY - used.size };
      if (used.size >= FREE_ICONS_PER_DAY) return { ok: false, remaining: 0 };
      used.add(id);
      const ids = [...used];
      refs.forEach((r) => tx.set(r, { ids, day, updatedAt: Date.now() }));
      return { ok: true, remaining: FREE_ICONS_PER_DAY - used.size };
    });

    const res = NextResponse.json({ ...result, limit: FREE_ICONS_PER_DAY }, { headers: { "Cache-Control": "no-store" } });
    if (fresh) res.cookies.set("pst_did", device, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
    return res;
  } catch (e) {
    return failure(e);
  }
}
