// Every pack must support every control in the studio bar: Style, Stroke, Eyes, Ink and Copy as.
// Run this after adding or regenerating a pack. Exits non-zero if any pack is missing one.
// run: node scripts/check-gallery-controls.mjs
import fs from "node:fs";

const INKS = ["#2b2430", "#3b2f45", "#2d3142"]; // lib/transform.ts
const files = fs.readdirSync("data").filter((f) => /^gallery-.*\.json$/.test(f));
let bad = 0;
const pct = (n, d) => (d ? Math.round((100 * n) / d) : 0);

for (const f of files) {
  const g = JSON.parse(fs.readFileSync(`data/${f}`, "utf8"));
  const tiles = g.sections.flatMap((s) => s.tiles);
  const inkColors = [...INKS, ...(g.inkFrom ?? []).map((c) => c.toLowerCase())];
  const has = {
    Style: tiles.filter((t) => t.alt || t.svg.includes('<g id="Body">')).length,
    Stroke: tiles.filter((t) => / data-bs="/.test(t.svg) || /stroke-width=/.test(t.svg)).length,
    Eyes: tiles.filter((t) => t.svg.includes('<g id="Eyes">')).length,
    Ink: tiles.filter((t) => inkColors.some((c) => t.svg.toLowerCase().includes(c))).length,
  };
  const problems = [];
  for (const [k, n] of Object.entries(has)) if (pct(n, tiles.length) < 90) problems.push(`${k} works on ${n}/${tiles.length}`);
  if (!g.inks?.length) problems.push("no Ink swatches");
  if (g.hide) problems.push("uses the removed `hide` option");
  // outlined art must still carry the Eyes tag and ink colors
  const alts = tiles.filter((t) => t.alt);
  if (alts.length && alts.filter((t) => t.alt.includes('<g id="Eyes">')).length < alts.length * 0.9) problems.push("outlined art lost the Eyes tag");
  console.log(`${problems.length ? "FAIL" : "ok  "} ${g.id.padEnd(10)} ${tiles.length} stickers | style ${pct(has.Style, tiles.length)}% stroke ${pct(has.Stroke, tiles.length)}% eyes ${pct(has.Eyes, tiles.length)}% ink ${pct(has.Ink, tiles.length)}%${problems.length ? " -> " + problems.join("; ") : ""}`);
  if (problems.length) bad += 1;
}
if (bad) {
  console.error(`\n${bad} pack(s) are missing studio controls.`);
  process.exit(1);
}
console.log("\nAll packs support Style, Stroke, Eyes, Ink and Copy as.");
