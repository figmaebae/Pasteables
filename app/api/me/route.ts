import { accessFor, whoIs } from "@/lib/server/access";
import { failure, json } from "@/lib/server/http";

export const runtime = "nodejs";

/** Who is asking, whether they have access, and what a new buyer would be offered. */
export async function GET(req: Request) {
  try {
    return json(await accessFor(await whoIs(req)));
  } catch (e) {
    return failure(e);
  }
}
