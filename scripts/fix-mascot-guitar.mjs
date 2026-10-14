// Replaces the broken blob-and-stick guitar on the Mascot "Playing Guitar" tile with a proper
// acoustic guitar held across the body: fretting hand on the neck, strumming hand at the sound hole.
import fs from "node:fs";
const p = "data/gallery-mascot.json";
const g = JSON.parse(fs.readFileSync(p, "utf8"));
const INK = "#2B2430", SKIN = "#FF8552";

const limb = (d, hx, hy) =>
  `<path d="${d}" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" stroke-linejoin="round" fill="none" data-ow="1"/>` +
  `<circle cx="${hx}" cy="${hy}" r="11.3" fill="${INK}" data-ow="1"/>` +
  `<path d="${d}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<circle cx="${hx}" cy="${hy}" r="8.5" fill="#FFFFFF"/>`;
const patch = (x, y) => `<path data-jp="1" d="M${x - 9} ${y}a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z" fill="${SKIN}"/>`;

const arms =
  `<g id="Arms">` +
  limb("M80 132Q58 140 61 163", 61, 166) + patch(80, 132) +
  limb("M160 132Q174 178 134 211", 133, 213) + patch(160, 132) +
  `</g>`;

// Drawn upright around (118,206), then tilted so the neck points up and to the left.
const guitar =
  `<g id="Guitar" transform="rotate(-55 118 206)">` +
  // neck + headstock
  `<rect x="113.5" y="124" width="9" height="66" rx="2" fill="#8B5A2B" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>` +
  `<rect x="111" y="108" width="14" height="19" rx="3.5" fill="#5A3A2A" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>` +
  `<path d="M114 140H123M114 152H123M114 164H123M114 176H123" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>` +
  `<circle cx="115.5" cy="114" r="1.6" fill="#F4E3C1"/><circle cx="120.5" cy="114" r="1.6" fill="#F4E3C1"/><circle cx="115.5" cy="121" r="1.6" fill="#F4E3C1"/><circle cx="120.5" cy="121" r="1.6" fill="#F4E3C1"/>` +
  // body: figure-eight acoustic outline
  `<path d="M99 196C99 182 137 182 137 196C137 204 131 206 131 212C131 217 147 220 147 232C147 250 89 250 89 232C89 220 105 217 105 212C105 206 99 204 99 196Z" fill="#E8A24A" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>` +
  `<path d="M104 196Q106 188 114 187" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" fill="none"/>` +
  `<circle cx="118" cy="226" r="8.5" fill="#5A3A2A" stroke="${INK}" stroke-width="2.4"/>` +
  `<rect x="106" y="240" width="24" height="4.5" rx="2" fill="#5A3A2A" stroke="${INK}" stroke-width="1.8"/>` +
  `<path d="M118 126V240" stroke="${INK}" stroke-width="1" stroke-linecap="round"/>` +
  `</g>`;

const fix = (svg) =>
  svg
    .replace(/<g id="Arms">[\s\S]*?<\/g><g id="Extras">/, `${guitar}${arms}<g id="Extras">`)
    // drop the old guitar shapes from Extras, keep the music notes
    .replace(/(<g id="Extras">)[\s\S]*?(<g transform="translate\(40 90\)">)/, "$1$2");

let n = 0;
for (const s of g.sections)
  for (const t of s.tiles) {
    if (t.name !== "Playing Guitar") continue;
    t.svg = fix(t.svg);
    if (t.alt) t.alt = fix(t.alt);
    n++;
  }
fs.writeFileSync(p, JSON.stringify(g));
console.log("patched", n);
