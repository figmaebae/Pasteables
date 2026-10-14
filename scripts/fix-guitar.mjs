// Gives the Cloud "Playing Guitar" tile an actual guitar and arms that hold it.
import fs from "node:fs";
const p = "data/gallery-clouds.json";
const g = JSON.parse(fs.readFileSync(p, "utf8"));
const INK = "#2B2430", BODY = "#BFE3FF";
const limb = (d) =>
  `<path data-ow="1" d="${d}" stroke="${INK}" stroke-width="16.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const hand = (x, y) => `<circle data-ow="1" cx="${x}" cy="${y}" r="10.8" fill="${INK}"/><circle cx="${x}" cy="${y}" r="8" fill="#FFFFFF"/>`;
const guitar =
  `<g id="Guitar">` +
  // neck, drawn as ink outline + wood, running up and to the left
  `<path d="M122 238L58 196" stroke="${INK}" stroke-width="13" stroke-linecap="round" fill="none"/>` +
  `<path d="M122 238L58 196" stroke="#8B5A2B" stroke-width="8" stroke-linecap="round" fill="none"/>` +
  `<path d="M52 192L44 186" stroke="${INK}" stroke-width="12" stroke-linecap="round" fill="none"/>` +
  `<path d="M52 192L44 186" stroke="#5A3A2A" stroke-width="7" stroke-linecap="round" fill="none"/>` +
  // body: two lobes
  `<path d="M104 228C96 214 120 204 136 214C140 208 164 210 166 228C178 238 172 262 148 264C132 268 116 264 108 254C98 248 96 236 104 228Z" fill="#F2A65A" stroke="${INK}" stroke-width="3.8" stroke-linejoin="round"/>` +
  `<circle cx="140" cy="238" r="8" fill="#5A3A2A" stroke="${INK}" stroke-width="2.4"/>` +
  `<path d="M118 252H158" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>` +
  `<path d="M110 232Q112 224 120 222" stroke="#fff" stroke-opacity=".6" stroke-width="3.4" stroke-linecap="round" fill="none"/>` +
  `</g>`;
const arms =
  `<g id="Arms">` +
  limb("M34 204Q36 190 62 194") + hand(66, 195) +
  limb("M206 204Q204 236 156 244") + hand(152, 245) +
  `</g>`;

let n = 0;
for (const s of g.sections) for (const t of s.tiles) {
  if (t.name !== "Playing Guitar") continue;
  t.svg = t.svg.replace(/<g id="Arms">[\s\S]*?<\/g><g id="Extras">/, guitar + arms + '<g id="Extras">');
  n++;
}
fs.writeFileSync(p, JSON.stringify(g));
console.log("patched", n);
