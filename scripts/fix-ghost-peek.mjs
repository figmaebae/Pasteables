// Redraws "Peeking Around Door" in data/gallery-ghost.json: a chubby ghost leans toward a narrow blue door,
// the door overlaps its left eye/cheek and a mitten hand wraps the door's edge. run: node scripts/fix-ghost-peek.mjs
import fs from "node:fs";
const K = "#2B2430", W = "#FDFDFF", DOOR = "#7B8CF0";
const TX = Number(process.env.TX ?? 20), DW = Number(process.env.DW ?? 84);
// same open-eye size as the other ghosts (their eyes are 9x10.5 scaled by .62), corrected for this ghost's body scale
const eye = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="5.4" ry="6.6" fill="${K}"/><circle cx="${x + 1.6}" cy="${y - 2.3}" r="2.2" fill="#fff"/><circle cx="${x - 1.7}" cy="${y + 2.6}" r="1.05" fill="#fff"/>`;
const edge = 14 + DW; // door's right edge
// small hand: a short arm leaving the ghost's body and curling over the door edge; only the tip sits in front of the door
const ARM = `M${edge + 17} 208Q${edge + 6} 204 ${edge - 5} 199`;
const hand = () => `<path data-ow="1" d="${ARM}" stroke="${K}" stroke-width="15.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle data-ow="1" cx="${edge - 6}" cy="199" r="10" fill="${K}"/>` +
  `<path d="${ARM}" stroke="${W}" stroke-width="10.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle data-jp="1" cx="${edge + 17}" cy="208" r="7.9" fill="${W}"/><circle cx="${edge - 6}" cy="199" r="7.2" fill="${W}"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" width="240" height="300" fill="none" shape-rendering="geometricPrecision"><g transform="translate(0 6)">` +
  `<g transform="translate(${TX} 0) rotate(-6 120 245) translate(120 245) scale(1.03 0.98) translate(-120 -245)"><g id="Body"><path d="M68 144A52 52 0 0 1 172 144C172 176 194 196 194 232C194 250 157 250 157 240C157 250 120 250 120 240C120 250 83 250 83 240C83 250 46 250 46 232C46 196 68 176 68 144Z" fill="${W}" stroke="${K}" stroke-width="3.0" stroke-linejoin="round"/><path d="M170 160C176 186 188 206 190 228" stroke="#B8C6E0" stroke-opacity=".4" stroke-width="6" stroke-linecap="round" fill="none"/></g>` +
  `<g id="Face"><g id="Eyes">${eye(102, 148)}${eye(136, 148)}</g><ellipse cx="84" cy="165" rx="9" ry="5.4" fill="#FF8FA3" fill-opacity="0.5"/><ellipse cx="154" cy="165" rx="9" ry="5.4" fill="#FF8FA3" fill-opacity="0.5"/><path d="M112 165Q119 172.5 126 165" stroke="${K}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></g>` +
  `<g id="Extras"><rect x="14" y="34" width="${DW}" height="238" rx="10" fill="${DOOR}" stroke="${K}" stroke-width="3.6"/>` +
  `<path d="M26 54V250" stroke="#fff" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/>` +
  `<g id="Arms">${hand()}</g>` +
  `<path d="M214 118L228 112" stroke="#C4CCDB" stroke-width="3.4" stroke-linecap="round"/><path d="M216 138L232 138" stroke="#C4CCDB" stroke-width="3.4" stroke-linecap="round"/><path d="M214 158L228 164" stroke="#C4CCDB" stroke-width="3.4" stroke-linecap="round"/></g></g></svg>`;
const p = "data/gallery-ghost.json";
const d = JSON.parse(fs.readFileSync(p, "utf8"));
const t = d.sections.flatMap((s) => s.tiles).find((x) => x.name === "Peeking Around Door");
t.svg = svg;
fs.writeFileSync(p, JSON.stringify(d));
fs.writeFileSync((process.env.TMPDIR || "/tmp") + "/sheet/ghost-peek.html", `<body style="margin:20px;background:#fffdf9"><img src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}" width="460" style="background:#fff">`);
console.log("ok");
