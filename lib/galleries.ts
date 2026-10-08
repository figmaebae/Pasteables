import type { Gallery } from "./types";

/** Each gallery is its own lazy chunk, so the home page never pays for 3 MB of SVG. */
export const GALLERY_LOADERS: Record<string, () => Promise<Gallery>> = {
  mascot: () => import("@/data/gallery-mascot.json").then((m) => m.default as Gallery),
  emoticons: () => import("@/data/gallery-emoticons.json").then((m) => m.default as Gallery),
  ghost: () => import("@/data/gallery-ghost.json").then((m) => m.default as Gallery),
  clouds: () => import("@/data/gallery-clouds.json").then((m) => m.default as Gallery),
};
