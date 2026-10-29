// Category 3: Designers & Developers (24 reactions in 4 groups). Same approved dumpling; face, hands and small props change.
// run: node scripts/dumpling/reactions-dev.mjs
import fs from "node:fs";
import { render, hands, sparkle, heart, drop, INK, HAND, EYES_BASE, EYES_HAPPY, eyesBig, mouthSmile, mouthSmirk, mouthOpen } from "./character.mjs";
import * as P from "./parts-sad.mjs";

const VB = "-80 44 560 440";
const DIR = "scripts/dumpling/reactions/03-designer-developer";
const BLUE = "#6FA1FF", GREEN = "#4CC38A", PURPLE = "#B38BFF", YEL = "#FFC83D", RED = "#FF7A7A", ORANGE = "#FF9F5A", GREY = "#C9D1DE", DARK = "#2B3550";

// ---- poses (hand positions; the hand stays on the outer side and is drawn over the held prop)
const pose = (L = [372, -12], R = [372, 12]) => hands({ yL: L[0], rotL: L[1], yR: R[0], rotR: R[1] });
const UP_R = [326, 18], UP_L = [326, -18], ARMS = { yL: 268, rotL: -40, yR: 268, rotR: 40 };

// ---- faces
const flat = `<path d="M186 331L208 331" stroke="${INK}" stroke-width="4.6"/>`;
const hmm = `<path d="M184 333Q197 325 210 333" stroke="${INK}" stroke-width="4.6"/>`;
const browsUneven = ""; // no eyebrows in the Dumpling set
const browsWorry = P.browsSad(2);
const focus = P.eyesSide(8) + P.browsFlat;

// ---- props
const S = (inner) => `<g stroke="${INK}" stroke-width="3.4" stroke-linejoin="round">${inner}</g>`;
const rect = (x, y, w, h, fill, rx = 5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const bars = (x, y, w, rows, c = GREY) => rows.map((rw, i) => `<rect x="${x}" y="${y + i * 9}" width="${w * rw}" height="5" rx="2.5" fill="${c}" stroke="none"/>`).join("");

const screen = (x, y, w, h, inner = "") => S(rect(x, y, w, h, "#fff", 7)) + inner;
const wireScreen = (x, y, w, h) => screen(x, y, w, h,
  `<g stroke="${INK}" stroke-width="2.4">${rect(x + 6, y + 7, w - 12, 10, "#fff", 3)}${rect(x + 6, y + 23, (w - 18) / 2, 22, "#fff", 3)}${rect(x + 12 + (w - 18) / 2, y + 23, (w - 18) / 2, 22, "#fff", 3)}${rect(x + 6, y + 51, w - 12, 8, "#fff", 3)}</g>`);
const uiScreen = (x, y, w, h) => screen(x, y, w, h,
  `<g stroke="none">${rect(x + 6, y + 7, w - 12, 14, BLUE, 4)}${rect(x + 6, y + 27, (w - 18) / 2, 18, PURPLE, 4)}${rect(x + 12 + (w - 18) / 2, y + 27, (w - 18) / 2, 18, YEL, 4)}${bars(x + 6, y + 51, w - 12, [1, 0.6])}</g>`);
const pencil = (x, y, rot, c = BLUE, len = 64) => `<g transform="translate(${x} ${y}) rotate(${rot})">${S(`<rect x="-7" y="${-len}" width="14" height="${len - 8}" rx="3" fill="${c}"/><path d="M-7 -8L0 12L7 -8Z" fill="${HAND}"/><path d="M-7 ${-len + 10}H7" />`)}<path d="M-3 4L0 12L3 4Z" fill="${INK}" stroke="none"/></g>`;
const magnifier = (hx, hy, lx, ly, r, inner = "") =>
  `<path d="M${hx} ${hy}L${lx - r * 0.7} ${ly + r * 0.7}" stroke="${INK}" stroke-width="12"/><path d="M${hx} ${hy}L${lx - r * 0.7} ${ly + r * 0.7}" stroke="${ORANGE}" stroke-width="6"/>` +
  S(`<circle cx="${lx}" cy="${ly}" r="${r}" fill="#fff"/>`) + inner + `<circle cx="${lx}" cy="${ly}" r="${r}" stroke="${INK}" stroke-width="5"/><path d="M${lx - r * 0.5} ${ly - r * 0.3}Q${lx - r * 0.35} ${ly - r * 0.6} ${lx - r * 0.05} ${ly - r * 0.65}" stroke="#fff" stroke-width="4" opacity=".0"/>`;
const palette = (x, y) => `<g transform="translate(${x} ${y}) rotate(-14)">${S(`<path d="M-38 -4C-38 -28 -10 -34 14 -30C40 -26 42 -2 30 10C20 20 12 8 4 14C-4 22 -38 22 -38 -4Z" fill="#F3D9A8"/>`)}${[[-24, -10, RED], [-12, -22, YEL], [6, -22, GREEN], [22, -12, BLUE], [-22, 6, PURPLE]].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="7" fill="${c}" stroke="${INK}" stroke-width="2.6"/>`).join("")}</g>`;
const laptop = (check = false, tilt = false) =>
  tilt
    ? S(`<path d="M342 432L446 432L452 446L336 446Z" fill="${GREY}"/><path d="M350 430L440 430L432 410L356 410Z" fill="${DARK}"/>`) + `<path d="M366 420H424" stroke="${GREEN}" stroke-width="4" opacity=".9"/>`
    : S(`<path d="M342 430L446 430L452 446L336 446Z" fill="${GREY}"/>${rect(350, 376, 90, 54, DARK, 7)}`) +
      (check ? `<path d="M375 404L390 418L416 388" stroke="${GREEN}" stroke-width="9" fill="none"/>` : `<path d="M360 390H396M360 402H412M372 414H404" stroke="${GREEN}" stroke-width="5"/><path d="M396 390H420" stroke="${ORANGE}" stroke-width="5"/>`);
const bug = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-14 -4L-24 -12M-14 4L-26 6M14 -4L24 -12M14 4L26 6M-7 -16L-12 -26M7 -16L12 -26" stroke="${INK}" stroke-width="3.2"/>${S(`<ellipse cx="0" cy="0" rx="15" ry="13" fill="${RED}"/><circle cx="0" cy="-15" r="8" fill="${RED}"/>`)}<circle cx="-3" cy="-17" r="2" fill="#fff"/><circle cx="3" cy="-17" r="2" fill="#fff"/><path d="M0 -10V12" stroke="${INK}" stroke-width="2.4"/><circle cx="-7" cy="0" r="2.4" fill="${INK}"/><circle cx="7" cy="4" r="2.4" fill="${INK}"/></g>`;
const plane = S(`<path d="M350 294L430 256L390 334Z" fill="#fff"/><path d="M390 334L380 300L430 256Z" fill="#CFE0FF"/><path d="M380 300L350 294" fill="none"/>`);
const cup = (x, y, steam = true, droop = false) =>
  S(`<path d="M${x + 36} ${y + 10}Q${x + 58} ${y + 8} ${x + 54} ${y + 28}Q${x + 50} ${y + 40} ${x + 32} ${y + 38}" fill="none" stroke-width="5"/><path d="M${x} ${y}H${x + 42}L${x + 36} ${y + 44}Q${x + 21} ${y + 50} ${x + 6} ${y + 44}Z" fill="#fff"/><path d="M${x + 3} ${y + 12}H${x + 39}L${x + 36} ${y + 44}Q${x + 21} ${y + 50} ${x + 6} ${y + 44}Z" fill="#A9693C" stroke="none"/>`) +
  (steam ? `<path d="M${x + 12} ${y - 8}Q${x + 6} ${y - 18} ${x + 12} ${y - 28}M${x + 28} ${y - 8}Q${x + 22} ${y - 18} ${x + 28} ${y - 28}" stroke="${GREY}" stroke-width="4" opacity="${droop ? 0.5 : 1}"/>` : "");
const clock = (x, y) => `<g transform="translate(${x} ${y})">${S(`<circle cx="-18" cy="-24" r="9" fill="${RED}"/><circle cx="18" cy="-24" r="9" fill="${RED}"/><circle r="26" fill="#fff"/>`)}<path d="M0 -14V0L11 7" stroke="${INK}" stroke-width="4"/><circle r="3" fill="${INK}"/><path d="M-34 -4L-40 -8M34 -4L40 -8" stroke="${INK}" stroke-width="3.4"/></g>`;
const bulb = (x, y) => `<path d="M${x} ${y - 36}V${y - 46}M${x - 28} ${y - 24}L${x - 36} ${y - 30}M${x + 28} ${y - 24}L${x + 36} ${y - 30}" stroke="${YEL}" stroke-width="5"/>` + S(`<path d="M${x - 14} ${y + 12}C${x - 28} ${y - 4} ${x - 20} ${y - 30} ${x} ${y - 30}C${x + 20} ${y - 30} ${x + 28} ${y - 4} ${x + 14} ${y + 12}Z" fill="${YEL}"/>${rect(x - 10, y + 12, 20, 12, GREY, 4)}`);
const lamp = `<path d="M404 372L448 372L452 440L384 440Z" fill="${YEL}" opacity=".3" stroke="none"/>` + S(`<path d="M374 442H426" stroke-width="12"/>${rect(372, 436, 56, 12, DARK, 6)}`) + `<path d="M400 436L398 394L420 366" stroke="${INK}" stroke-width="9"/><path d="M400 436L398 394L420 366" stroke="${GREY}" stroke-width="4"/>` + S(`<path d="M404 356L436 346L444 376L412 380Z" fill="${ORANGE}"/>`);
const canvasBoard = (x, y) => S(rect(x, y, 82, 72, "#fff", 8)) + `<g stroke="${INK}" stroke-width="2.6"><circle cx="${x + 24}" cy="${y + 26}" r="12" fill="${RED}"/>${rect(x + 44, y + 14, 26, 26, BLUE, 4)}<path d="M${x + 20} ${y + 62}L${x + 36} ${y + 44}L${x + 52} ${y + 62}Z" fill="${YEL}"/><circle cx="${x + 66}" cy="${y + 56}" r="6" fill="${GREEN}"/></g>` + `<path d="M${x + 42} ${y + 46}L${x + 52} ${y + 72}L${x + 56} ${y + 64}L${x + 64} ${y + 68}Z" fill="${INK}" stroke="#fff" stroke-width="2.4"/>`;
const browser = (x, y, w, h) => screen(x, y, w, h, `<path d="M${x} ${y + 14}H${x + w}" stroke="${INK}" stroke-width="2.6"/><circle cx="${x + 9}" cy="${y + 7}" r="2.6" fill="${RED}" stroke="none"/><circle cx="${x + 18}" cy="${y + 7}" r="2.6" fill="${YEL}" stroke="none"/><g stroke="none">${rect(x + 7, y + 22, w - 14, 12, BLUE, 3)}${rect(x + 7, y + 40, (w - 20) / 2, 18, ORANGE, 3)}${rect(x + 13 + (w - 20) / 2, y + 40, (w - 20) / 2, 18, GREY, 3)}</g>`);
const phone = (x, y, w, h) => S(rect(x, y, w, h, "#fff", 8)) + `<g stroke="none">${rect(x + 5, y + 10, w - 10, 12, BLUE, 3)}${rect(x + 5, y + 28, w - 10, 16, PURPLE, 3)}</g>`;
const card = (x, y, c) => S(rect(x, y, 56, 70, "#fff", 8)) + `<g stroke="none">${rect(x + 7, y + 8, 42, 24, c, 5)}${bars(x + 7, y + 40, 42, [1, 0.6])}</g>`;
const exclaim = (x, y) => `<path d="M${x} ${y}V${y + 24}" stroke="${INK}" stroke-width="12"/><path d="M${x} ${y}V${y + 24}" stroke="${RED}" stroke-width="6"/><circle cx="${x}" cy="${y + 40}" r="6.5" fill="${RED}" stroke="${INK}" stroke-width="3"/>`;
const badge = (x, y) => S(`<circle cx="${x}" cy="${y}" r="18" fill="${GREEN}"/>`) + `<path d="M${x - 8} ${y}L${x - 2} ${y + 7}L${x + 9} ${y - 7}" stroke="#fff" stroke-width="5"/>`;
const moon = (x, y) => S(`<path d="M${x} ${y - 20}A20 20 0 1 0 ${x + 18} ${y + 8}A16 16 0 0 1 ${x} ${y - 20}Z" fill="${YEL}"/>`);
const dropsR = drop(334, 196, 1) + drop(364, 224, 0.7);

const sc = (m, ax, ay, k = 1.3) => `<g transform="translate(${ax} ${ay}) scale(${k}) translate(${-ax} ${-ay})">${m}</g>`;
const R_ = (m) => sc(m, 366, 330), L_ = (m) => sc(m, 34, 330), B_ = (m) => sc(m, 394, 446, 1.25);
const L2 = (m) => sc(m, 34, 372), R2 = (m) => sc(m, 366, 372);

// ---- the 24 reactions
const G = {
  design: "Design & UI/UX", dev: "Developer Life", collab: "Designer–Developer Collaboration", work: "Work & Productivity",
};
const R = (g, file, label, o) => ({ g, file, label, o });
const list = [
  R("design", "design-01-in-the-design-flow", "In the Design Flow", { eyes: EYES_HAPPY, mouth: mouthSmile, handsSvg: pose(undefined, UP_R), behind: R_(pencil(372, 330, 32)), front: sparkle(420, 232, 9) }),
  R("design", "design-02-wireframing", "Wireframing", { eyes: P.eyesSide(-6) + P.browsFlat, mouth: P.mouthShy, handsSvg: pose(UP_L), behind: L_(wireScreen(-38, 244, 66, 86)) }),
  R("design", "design-03-pixel-perfect", "Pixel Perfect", { eyes: P.eyesSide(9) + P.browsFlat, mouth: flat, handsSvg: pose(undefined, UP_R),
    behind: R_(magnifier(372, 326, 404, 266, 30, `<g stroke="${INK}" stroke-width="2" ><rect x="385" y="247" width="12" height="12" fill="${BLUE}"/><rect x="397" y="247" width="12" height="12" fill="${PURPLE}"/><rect x="409" y="247" width="12" height="12" fill="${YEL}"/><rect x="385" y="259" width="12" height="12" fill="${YEL}"/><rect x="397" y="259" width="12" height="12" fill="${GREEN}"/><rect x="409" y="259" width="12" height="12" fill="${BLUE}"/><rect x="385" y="271" width="12" height="12" fill="${RED}"/><rect x="397" y="271" width="12" height="12" fill="${BLUE}"/><rect x="409" y="271" width="12" height="12" fill="${PURPLE}"/></g>`)) }),
  R("design", "design-04-color-palette-mode", "Color Palette Mode", { eyes: EYES_HAPPY, mouth: mouthSmile, handsSvg: pose(UP_L), behind: L_(palette(-6, 280)) }),
  R("design", "design-05-design-review", "Design Review", { eyes: EYES_BASE + browsWorry, mouth: P.mouthNervous, handsSvg: pose(undefined, UP_R), behind: R_(uiScreen(366, 236, 70, 90)), front: dropsR }),

  R("dev", "dev-01-coding-away", "Coding Away", { eyes: focus, mouth: flat, behind: B_(laptop()) }),
  R("dev", "dev-02-bug-found", "Bug Found", { eyes: P.shift(eyesBig(false), 6, 0), mouth: mouthOpen(0.6), behind: B_(laptop()), front: B_(bug(404, 352)) + exclaim(372, 170) }),
  R("dev", "dev-04-debugging", "Debugging", { eyes: P.eyesSide(8) + browsUneven, mouth: P.mouthNervous, handsSvg: pose(undefined, UP_R), behind: B_(laptop()) + R_(magnifier(372, 326, 404, 288, 26, bug(404, 292))) }),
  R("dev", "dev-05-ship-it", "Ship It!", { eyes: EYES_HAPPY, mouth: mouthSmirk, handsSvg: pose(undefined, UP_R), behind: R_(plane), front: sparkle(430, 232, 7) }),
  R("dev", "dev-06-code-compiles", "Code Compiles", { eyes: EYES_HAPPY, mouth: P.mouthSoft, behind: B_(laptop(true)), front: B_(badge(408, 336)) + sparkle(430, 300, 7) }),

  R("collab", "collab-01-handoff-ready", "Handoff Ready", { eyes: EYES_BASE, mouth: mouthSmirk, handsSvg: pose(undefined, UP_R), behind: R_(uiScreen(366, 236, 70, 90)), front: R_(badge(436, 232)) }),
  R("collab", "collab-02-one-more-revision", "One More Revision", { eyes: P.eyesHalf, mouth: P.mouthTinyFrown, handsSvg: pose(undefined, UP_R), behind: R_(pencil(372, 330, 24, ORANGE, 52)), front: drop(334, 196, 0.9) }),
  R("collab", "collab-05-perfect-match", "Perfect Match", { eyes: eyesBig(true), mouth: mouthSmile, behind: L2(card(-36, 338, BLUE)) + R2(card(380, 338, BLUE)), front: heart(204, 100, 0.9, 4) }),

  R("work", "work-02-coffee-break", "Coffee Break", { eyes: EYES_HAPPY, mouth: P.mouthSoft, handsSvg: pose(undefined, UP_R), behind: R_(cup(372, 276)) }),
  R("work", "work-03-deadline-mode", "Deadline Mode", { eyes: EYES_BASE + P.browsSad(2), mouth: P.mouthNervous, front: sc(clock(392, 214), 392, 214, 1.3) + drop(40, 214, 0.9) }),
  R("work", "work-04-brainstorming", "Brainstorming", { eyes: P.eyesSide(7) + P.browsSad(0.5), mouth: hmm, front: sc(bulb(199, 98), 199, 98, 1.25) }),
  R("work", "work-05-done-for-today", "Done for Today", { eyes: EYES_HAPPY, mouth: P.mouthSoft, behind: B_(laptop(false, true)), front: sc(moon(390, 188), 390, 188, 1.3) }),
  R("work", "work-06-monday-mood", "Monday Mood", { eyes: P.eyesHalf, mouth: P.mouthTinyFrown, handsSvg: pose(undefined, UP_R), behind: R_(cup(372, 276, true, true)), front: drop(40, 214, 0.8) }),
];

fs.mkdirSync(DIR, { recursive: true });
for (const r of list) fs.writeFileSync(`${DIR}/${r.file}.svg`, render({ viewBox: VB, label: `Dumpling Buddy: ${r.label}`, ...r.o }));

const sections = Object.entries(G).map(([k, name]) =>
  `<h2>${name}</h2><div class="g">${list.filter((r) => r.g === k).map((r) => `<figure><img src="${r.file}.svg" alt="${r.label}"><figcaption>${r.label}</figcaption></figure>`).join("")}</div>`).join("");
const html = `<!doctype html><meta charset="utf-8"><title>Dumpling Buddy: Designers &amp; Developers</title>
<style>body{margin:0;padding:32px;background:#fff;font:600 14px system-ui,sans-serif;color:#4A2418;max-width:1300px}h1{font-size:26px;margin:0 0 6px}h2{font-size:18px;margin:34px 0 14px}
.g{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}figure{margin:0;border:1px solid #EEE3D4;border-radius:16px;padding:10px 8px 12px;text-align:center;background:#FFFCF7}
figure img{width:100%;display:block}figcaption{margin-top:4px;line-height:1.25}</style>
<h1>Dumpling Buddy: Designers &amp; Developers</h1>${sections}`;
fs.writeFileSync(`${DIR}/preview.html`, html);
const sheet = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(sheet, { recursive: true });
for (const r of list) fs.copyFileSync(`${DIR}/${r.file}.svg`, `${sheet}/dev-${r.file}.svg`);
fs.writeFileSync(`${sheet}/dumpling-dev-preview.html`, html.replace(/src="([a-z0-9-]+)\.svg"/g, `src="dev-$1.svg?t=${Date.now()}"`));
console.log(list.length, "svgs ->", DIR);
