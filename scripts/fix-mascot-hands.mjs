// Mascot hands: the arm used to stop ~12-18 units short of the palm, leaving a visible gap
// between forearm and hand. Pull each arm's end point into its palm so the limb reads as one piece.
import fs from "node:fs";
const p = "data/gallery-mascot.json";
const g = JSON.parse(fs.readFileSync(p, "utf8"));
const PALM = /<circle cx="0" cy="0" r="[\d.]+" fill="#2B2430" data-ow="1" transform="translate\(([\d.-]+) ([\d.-]+)\) rotate\([\d.-]+\)"\/>/g;
const ARM = /<path d="(M[^"]*)" stroke="#2B2430" stroke-width="13.6"[^>]*data-ow="1"\/>/g;
const SINK = 3; // how far from the palm centre the arm end sits
const r1 = (n) => Math.round(n * 10) / 10;

function fix(svg) {
  const palms = [...svg.matchAll(PALM)].map((m) => [+m[1], +m[2]]);
  const arms = [...svg.matchAll(ARM)].map((m) => {
    const n = m[1].match(/-?[\d.]+/g).map(Number);
    return { d: m[1], end: [n[n.length - 2], n[n.length - 1]], n };
  });
  let out = svg, moved = 0;
  for (const c of palms) {
    const a = arms.map((a) => ({ a, dd: Math.hypot(a.end[0] - c[0], a.end[1] - c[1]) })).sort((x, y) => x.dd - y.dd)[0];
    if (!a || a.dd <= 7) continue;
    const [ex, ey] = a.a.end;
    const nx = r1(c[0] + ((ex - c[0]) / a.dd) * SINK), ny = r1(c[1] + ((ey - c[1]) / a.dd) * SINK);
    const tail = `${ex} ${ey}`;
    if (!a.a.d.endsWith(tail)) continue;
    const nd = a.a.d.slice(0, -tail.length) + `${nx} ${ny}`;
    out = out.split(`d="${a.a.d}"`).join(`d="${nd}"`);
    moved++;
  }
  return [out, moved];
}

let tiles = 0, arms = 0;
for (const s of g.sections) for (const t of s.tiles) {
  const [svg, n] = fix(t.svg);
  if (!n) continue;
  t.svg = svg; if (t.alt) t.alt = fix(t.alt)[0];
  tiles++; arms += n;
}
fs.writeFileSync(p, JSON.stringify(g));
console.log("tiles", tiles, "arms", arms);
