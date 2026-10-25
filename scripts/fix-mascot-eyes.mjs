// Mascot eyes: replace "white ring + dark pupil + highlights" with the solid dark eye + white highlight dots
// used by the other characters. run: node scripts/fix-mascot-eyes.mjs
import fs from "node:fs";
const K = "#2B2430";
const eyeRe = /<ellipse cx="([\d.]+)" cy="([\d.]+)" rx="10\.6" ry="11\.4" fill="#FFFFFF" stroke="#2B2430" stroke-width="2\.6"\/><circle cx="([\d.]+)" cy="([\d.]+)" r="7" fill="#2B2430"\/>(?:<circle [^>]*?fill="#FFFFFF"\/>){1,2}/g;
const n = (v) => String(Math.round(v * 100) / 100);
const fix = (svg) => {
  let count = 0;
  const out = svg.replace(eyeRe, (_, ox, oy, px, py) => {
    count++;
    const x = +px, y = +oy + 0.5; // pupil x keeps the gaze direction; y matches the old eye centre
    return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="9.5" ry="11" fill="${K}"/><circle cx="${n(x + 2.7)}" cy="${n(y - 3.9)}" r="3.7" fill="#FFFFFF"/><circle cx="${n(x - 2.7)}" cy="${n(y + 4.2)}" r="1.8" fill="#FFFFFF"/>`;
  });
  return [out, count];
};
let eyes = 0, tiles = 0;
const p = "data/gallery-mascot.json";
const g = JSON.parse(fs.readFileSync(p, "utf8"));
for (const s of g.sections) for (const t of s.tiles) { const [o, c] = fix(t.svg); if (c) { t.svg = o; eyes += c; tiles++; } }
fs.writeFileSync(p, JSON.stringify(g));
const hp = "data/hero.json";
const h = JSON.parse(fs.readFileSync(hp, "utf8"));
for (const x of h) if (x.id === "mascot") { const [o, c] = fix(x.svg); x.svg = o; eyes += c; }
fs.writeFileSync(hp, JSON.stringify(h));
console.log("tiles", tiles, "eyes", eyes);
