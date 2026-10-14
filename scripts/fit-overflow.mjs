// Pulls art that spilled outside its viewBox back into frame. Offsets were measured in a browser
// (union of every shape's rendered bounds incl. stroke) and are keyed by flat tile index per gallery.
import fs from "node:fs";
const FIX = {
  mascot: { 9: [1, -4.4, 0], 19: [1, 0, 4.4], 72: [0.904, 13.3, 0], 104: [1, 0, 8], 118: [1, -4.4, 0], 126: [1, 7, 0], 131: [0.89, 9.7, 0], 132: [0.904, 13.3, 0], 134: [1, -7.7, 0] },
  emoticons: { 54: [1, 0, 5], 84: [1, 0, 5.5] },
  clouds: { 17: [0.951, 5.9, -21.7], 27: [1, -6.5, 0], 40: [1, 0, 28.9], 45: [0.99, 12, 0], 61: [0.94, 6.6, 0], 62: [1, -6.2, 0], 66: [1, -4.6, 0], 69: [1, 0, 5.9], 74: [0.989, -4.3, 0], 79: [1, 0, 7.7], 80: [0.983, 6.7, 0], 81: [0.946, 10.3, 0], 102: [1, 0, 5.5], 103: [1, 0, 4] },
};
const wrap = (svg, [sc, tx, ty]) =>
  svg.includes('data-fit="1"') ? svg : svg.replace(/^(<svg[^>]*>)([\s\S]*)<\/svg>$/, `$1<g data-fit="1" transform="translate(${tx} ${ty}) scale(${sc})">$2</g></svg>`);
for (const [id, fixes] of Object.entries(FIX)) {
  const p = `data/gallery-${id}.json`;
  const g = JSON.parse(fs.readFileSync(p, "utf8"));
  let i = 0, n = 0;
  for (const s of g.sections) for (const t of s.tiles) {
    const f = fixes[i++];
    if (!f) continue;
    t.svg = wrap(t.svg, f);
    if (t.alt) t.alt = wrap(t.alt, f);
    n++;
  }
  fs.writeFileSync(p, JSON.stringify(g));
  console.log(id, "fitted", n);
}
