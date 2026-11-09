import { FREE_PACKS, FREE_STICKERS } from "@/lib/access-config";
import { getEntitlement, whoIs } from "@/lib/server/access";
import { failure, json } from "@/lib/server/http";
import type { Gallery } from "@/lib/types";

export const runtime = "nodejs";

// The pack data lives only on the server. A visitor gets the stickers they are allowed to use and nothing else.
const LOADERS: Record<string, () => Promise<Gallery>> = {
  mascot: () => import("@/data/gallery-mascot.json").then((m) => m.default as unknown as Gallery),
  emoticons: () => import("@/data/gallery-emoticons.json").then((m) => m.default as unknown as Gallery),
  ghost: () => import("@/data/gallery-ghost.json").then((m) => m.default as unknown as Gallery),
  mushroom: () => import("@/data/gallery-mushroom.json").then((m) => m.default as unknown as Gallery),
  dumpling: () => import("@/data/gallery-dumpling.json").then((m) => m.default as unknown as Gallery),
  clouds: () => import("@/data/gallery-clouds.json").then((m) => m.default as unknown as Gallery),
};

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const load = LOADERS[id];
    if (!load) return json({ error: "No such pack." }, { status: 404 });
    const gallery = await load();

    const who = await whoIs(req);
    const entitled = who ? (await getEntitlement(who.email)).active : false;
    if (entitled) return json({ gallery, access: true });

    const free = (FREE_PACKS as readonly string[]).includes(id);
    let n = 0;
    const redacted: Gallery = {
      ...gallery,
      sections: gallery.sections.map((s) => ({
        ...s,
        tiles: s.tiles.map((t) => (free && n++ < FREE_STICKERS ? t : { name: t.name, svg: "", locked: true })),
      })),
    };
    return json({ gallery: redacted, access: false });
  } catch (e) {
    return failure(e);
  }
}
