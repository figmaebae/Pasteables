// Picks a handful of small stickers from the packs for the homepage collage (so the page doesn't import whole galleries).
// run: node scripts/build-landing.mjs   -> data/landing-stickers.json
import fs from "node:fs";
import { plain } from "./mushroom/mushroom.mjs";
const strip = (svg) => svg.replace(/ width="\d+" height="\d+"/, "");
const load = (id) => JSON.parse(fs.readFileSync(`data/gallery-${id}.json`, "utf8"));
const tiles = (id) => load(id).sections.flatMap((s) => s.tiles.map((t) => ({ t, s })));
const want = {
  m1: ["mushroom", "Super happy"], m2: ["mushroom", "Love"], m3: ["mushroom", "Drinking boba"], m4: ["mushroom", "Celebrating"], m5: ["mushroom", "Sending a kiss"],
  g1: ["ghost", "Waving Hello"], g2: ["ghost", "Heart Eyes"],
  c1: ["clouds", "Smiling"], c2: ["clouds", "Heart Eyes"],
  a1: ["mascot", "Waving"], a2: ["mascot", "Thumbs Up"], a3: ["mascot", "Peace Sign"],
  e1: ["emoticons", null],
};
const out = {};
const tint = { g1: 2, g2: 1, c1: 3, a1: 1, a2: 3, a3: 5, e1: 0 };
for (const [key, [id, name]] of Object.entries(want)) {
  const all = tiles(id);
  const hit = (name && all.find((x) => x.t.name === name)) || all[0];
  let svg = id === "mushroom" ? plain(hit.t.svg) : hit.t.svg;
  const pal = (hit.s.palette || []).filter((c) => c.toLowerCase() !== (hit.s.base || "").toLowerCase());
  if (hit.s.base && pal.length && key in tint) svg = svg.replace(new RegExp(hit.s.base.replace("#", "\\#"), "gi"), pal[tint[key] % pal.length]);
  out[key] = strip(svg);
}
fs.writeFileSync("data/landing-stickers.json", JSON.stringify(out));
console.log(Object.keys(out).length, "stickers,", Math.round(JSON.stringify(out).length / 1024), "KB");
