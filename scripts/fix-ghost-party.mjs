// Party Time: small party hat on the head, two matching mitten hands (one holds a party blower at the mouth,
// the other rests at the side) and a few pieces of confetti. run: node scripts/fix-ghost-party.mjs
import fs from "node:fs";
const K = "#2B2430", W = "#FDFDFF";
const p = "data/gallery-ghost.json";
const d = JSON.parse(fs.readFileSync(p, "utf8"));
const t = d.sections.flatMap((s) => s.tiles).find((x) => x.name === "Party Time");
// keep the original body + closed-eye face, only the mouth becomes a small round "blowing" mouth
const cut = ['<g id="Extras">', '<g id="Arms">'].map((m) => t.svg.indexOf(m)).filter((i) => i > 0);
const body = t.svg.slice(t.svg.indexOf('<g id="Body">'), Math.min(...cut)); // body + face only, safe to re-run
const arm = (d, hx, hy, sx, sy) =>
  `<path data-ow="1" d="${d}" stroke="${K}" stroke-width="16.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<path d="${d}" stroke="${W}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<circle data-jp="1" cx="${sx}" cy="${sy}" r="10.8" fill="${W}"/>` +
  `<circle data-ow="1" cx="${hx}" cy="${hy}" r="9.8" fill="${K}"/><circle cx="${hx}" cy="${hy}" r="7" fill="${W}"/>`;
const horn = `<g id="Extras"><path d="M122.2 157.3L184.8 179.8Q191 192 171.2 204.2L119.8 161.7Z" fill="#8FD3FF" stroke="${K}" stroke-width="3.2" stroke-linejoin="round"/>` +
  `<path d="M166.1 176L173.9 190" stroke="#fff" stroke-width="2.8" stroke-linecap="round" fill="none"/></g>`;
const arms = `<g id="Arms">${arm("M72 190Q54 196 55 214", 55, 218, 72, 190)}${arm("M172 206Q160 200 149 193", 148, 192, 172, 206)}</g>`;
const hat = `<g transform="rotate(8 120 100)"><path d="M96 103L120 58L144 103Q120 111 96 103Z" fill="#FFB1CC" stroke="${K}" stroke-width="3.4" stroke-linejoin="round"/>` +
  `<path d="M106 89Q120 94 134 89M112 75Q120 78 128 75" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>` +
  `<circle cx="120" cy="56" r="5.8" fill="#FFD84D" stroke="${K}" stroke-width="2.6"/></g>`;
const bit = (x, y, c, r) => `<rect x="${x}" y="${y}" width="8" height="4.4" rx="1.3" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`;
const confetti = bit(44, 92, "#FF8FA3", 20) + bit(62, 52, "#7CC4FF", -30) + bit(190, 60, "#FFD84D", 40) + bit(30, 150, "#62D2A2", 50) + bit(212, 112, "#FF8FA3", 10) + bit(200, 188, "#7CC4FF", -25);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" width="240" height="300" fill="none" shape-rendering="geometricPrecision"><g transform="translate(0 6)">${body}${horn}${arms}${hat}${confetti}</g></svg>`;
t.svg = svg;
fs.writeFileSync(p, JSON.stringify(d));
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.writeFileSync(dir + "/party.html", `<body style="margin:20px;background:#fffdf9"><div style="width:460px;background:#fff">${svg.replace('width="240" height="300"', 'style="width:100%"')}</div>`);
console.log("ok");
