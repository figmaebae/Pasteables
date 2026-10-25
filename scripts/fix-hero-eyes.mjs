// Home-page art: open the Emote and Ghost eyes (solid dark eye + white highlight dots, like the rest of each pack).
// run: node scripts/fix-hero-eyes.mjs
import fs from "node:fs";
const K = "#2B2430";
const p = "data/hero.json";
const h = JSON.parse(fs.readFileSync(p, "utf8"));
const swap = (svg, from, to) => { if (!svg.includes(from)) throw new Error("closed eyes not found (already opened?)"); return svg.replace(from, to); };
for (const x of h) {
  if (x.id === "emoticons")
    x.svg = swap(x.svg, `<g><path d="M104 160Q118 142 132 160M168 160Q182 142 196 160" stroke="${K}" stroke-width="6" stroke-linecap="round"/></g>`,
      `<g id="Eyes"><circle cx="118" cy="154" r="12" fill="${K}"/><circle cx="122" cy="149.6" r="4.2" fill="#FFFFFF"/><circle cx="182" cy="154" r="12" fill="${K}"/><circle cx="186" cy="149.6" r="4.2" fill="#FFFFFF"/></g>`);
  if (x.id === "ghost")
    x.svg = swap(x.svg, `<g><path d="M80 195Q90 180 100 195" stroke="${K}" stroke-width="4.6" stroke-linecap="round" fill="none"/><path d="M140 195Q150 180 160 195" stroke="${K}" stroke-width="4.6" stroke-linecap="round" fill="none"/></g>`,
      `<g id="Eyes"><ellipse cx="87" cy="192" rx="9" ry="10.5" fill="${K}"/><circle cx="89.6" cy="188.4" r="3.6" fill="#fff"/><circle cx="84.4" cy="196" r="1.7" fill="#fff"/><ellipse cx="147" cy="192" rx="9" ry="10.5" fill="${K}"/><circle cx="149.6" cy="188.4" r="3.6" fill="#fff"/><circle cx="144.4" cy="196" r="1.7" fill="#fff"/></g>`);
}
fs.writeFileSync(p, JSON.stringify(h));
console.log("ok");
