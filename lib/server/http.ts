import "server-only";
import { NextResponse } from "next/server";

/** Every API answer is per visitor, so none of it may be cached. */
export const json = (body: unknown, init?: ResponseInit) =>
  NextResponse.json(body, { ...init, headers: { "Cache-Control": "private, no-store", ...(init?.headers ?? {}) } });

/** A setup problem (a missing key) is reported plainly in development and kept generic in production. */
export function failure(e: unknown, status = 500) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[api]", msg);
  const setup = /is not set/.test(msg);
  return json({ error: setup ? "Payments aren't set up on the server yet." : "Something went wrong. Please try again.", ...(process.env.NODE_ENV !== "production" ? { detail: msg } : {}) }, { status: setup ? 503 : status });
}

export function siteOrigin(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? req.headers.get("origin") ?? new URL(req.url).origin;
}
