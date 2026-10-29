// Category 2: Sad & Emotional. Same approved dumpling; only the face, the hand pose and a tiny prop change.
// run: node scripts/dumpling/reactions-sad.mjs
import fs from "node:fs";
import { render } from "./character.mjs";
import * as P from "./parts-sad.mjs";

const mitten = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="24.5" ry="22" transform="rotate(${rot} ${x} ${y})"/>`;
const VB = "-40 62 480 424"; // identical to the Happy & Positive set, so scale matches exactly
const DIR = "scripts/dumpling/reactions/02-sad-emotional";

const reactions = [
  { file: "dumpling-crying", label: "Crying",
    opts: { eyes: P.eyesWatery(1) + P.browsSad(1), mouth: P.mouthFrown, blush: P.blushSubtle, front: P.tears } },
  { file: "dumpling-sad", label: "Sad",
    opts: { eyes: P.eyesDown + P.browsSad(1), mouth: P.mouthFrown, blush: P.blushSubtle, handsSvg: P.hands({ y: 380, rot: 10 }) } },
  { file: "dumpling-disappointed", label: "Disappointed",
    opts: { eyes: P.shift(P.eyesHalf + P.browsFlat, 0, 8), mouth: P.shift(P.mouthTinyFrown, 0, 8), blush: P.shift(P.blushSubtle, 0, 8), handsSvg: P.hands({ y: 384, rot: 8 }) } },
  { file: "dumpling-feeling-lonely", label: "Feeling lonely",
    opts: { eyes: P.eyesDown, mouth: P.mouthTinyFrown, blush: P.blushSubtle,
      front: P.cloud(44, 150, 1.15) + P.drop(30, 196, 0.55) + P.drop(56, 206, 0.45) } },
  { file: "dumpling-shy-blushing", label: "Shy / Blushing",
    opts: { eyes: P.eyesSide(-9), mouth: P.mouthShy, blush: P.blushStrong, handsSvg: P.hands({ y: 338, rot: 26 }),
      front: P.sparkle(352, 168, 9) } },
  { file: "dumpling-embarrassed", label: "Embarrassed",
    opts: { eyes: P.eyesSqueeze, mouth: P.mouthNervous, blush: P.blushStrong, front: P.drop(334, 196, 1) + P.drop(364, 224, 0.7) } },
  { file: "dumpling-hugging-itself", label: "Hugging itself",
    // hands come forward over the lower sides of the belly (short, no arms); the body silhouette is unchanged
    opts: { eyes: P.eyesSqueeze, mouth: P.mouthSoft, blush: P.blushStrong, handsSvg: "",
      front: `<g fill="#FCE6C6" stroke="${P.INK}" stroke-width="4.6">${mitten(66, 356, 38)}${mitten(334, 354, -38)}</g>` + P.heart(204, 100, 0.85, 4) } },
  { file: "dumpling-asking-for-comfort", label: "Asking for comfort",
    opts: { eyes: P.eyesPleading, mouth: P.mouthPout, blush: P.blushSubtle, handsSvg: P.hands({ y: 292, rotL: -34, rotR: 34 }),
      front: P.sparkle(204, 112, 9) } },
];

fs.mkdirSync(DIR, { recursive: true });
for (const r of reactions) fs.writeFileSync(`${DIR}/${r.file}.svg`, render({ viewBox: VB, label: `Dumpling Buddy: ${r.label}`, ...r.opts }));

const cards = reactions.map((r) => `<figure><img src="${r.file}.svg" alt="${r.label}"><figcaption>${r.label}</figcaption></figure>`).join("");
const html = `<!doctype html><meta charset="utf-8"><title>Dumpling Buddy: Sad & Emotional</title>
<style>body{margin:0;padding:28px;background:#fff;font:600 15px system-ui,sans-serif;color:#4A2418}h1{font-size:22px;margin:0 0 18px}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}figure{margin:0;border:1px solid #EEE3D4;border-radius:18px;padding:12px;text-align:center}
figure img{width:100%;display:block}figcaption{margin-top:6px}</style>
<h1>Dumpling Buddy: Sad &amp; Emotional</h1><div class="g">${cards}</div>`;
fs.writeFileSync(`${DIR}/preview.html`, html);
const sheet = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(sheet, { recursive: true });
for (const r of reactions) fs.copyFileSync(`${DIR}/${r.file}.svg`, `${sheet}/sad-${r.file}.svg`);
fs.writeFileSync(`${sheet}/dumpling-sad-preview.html`, html.replace(/src="(dumpling-[a-z-]+)\.svg"/g, `src="sad-$1.svg?t=${Date.now()}"`));
console.log(reactions.length, "svgs ->", DIR);
