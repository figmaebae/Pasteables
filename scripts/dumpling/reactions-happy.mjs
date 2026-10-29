// Category 1: Happy & Positive. One SVG per reaction, each the same approved dumpling with only the face, the hand pose
// and (where it helps) a tiny prop changed.   run: node scripts/dumpling/reactions-happy.mjs
import fs from "node:fs";
import { render, hands, EYES_BASE, EYES_HAPPY, EYES_LID, eyesBig, MOUTH_BASE, mouthSmile, mouthSmirk, mouthOpen, BLUSH, sparkle, heart, drop, confetti, burst, PINK } from "./character.mjs";

const VB = "-40 62 480 424"; // one viewBox for the whole set, so every reaction has exactly the same scale
const DIR = "scripts/dumpling/reactions/01-happy-positive";
const CONF = ["#FF6FA0", "#5BC0EB", "#FFC83D", "#7BD389", "#B58AF0"];

const reactions = [
  {
    file: "dumpling-happy", label: "Happy",
    opts: { eyes: EYES_BASE, mouth: mouthOpen(1) },
  },
  {
    file: "dumpling-excited", label: "Excited",
    opts: {
      eyes: eyesBig(), mouth: mouthOpen(2), handsSvg: hands({ y: 268, rotL: -40, rotR: 40 }),
      front: sparkle(-6, 150, 16) + sparkle(406, 160, 13) + sparkle(30, 98, 10) + burst(40, 205, -150, 3, 14, 12) + burst(360, 205, -30, 3, 14, 12),
    },
  },
  {
    file: "dumpling-laughing-lol", label: "Laughing / LOL",
    opts: {
      eyes: EYES_HAPPY, mouth: mouthOpen(2), handsSvg: hands({ y: 352, rot: 18 }),
      front: drop(98, 322, 1) + drop(300, 320, 1) + burst(-4, 250, 180, 3, 13, 10) + burst(404, 250, 0, 3, 13, 10),
    },
  },
  {
    file: "dumpling-sparkling-eyes", label: "Smiling with sparkling eyes",
    opts: {
      eyes: eyesBig(true), mouth: mouthSmile,
      front: sparkle(52, 196, 14) + sparkle(346, 190, 17) + sparkle(318, 120, 9),
    },
  },
  {
    file: "dumpling-celebrating-yay", label: "Celebrating / Yay!",
    opts: {
      eyes: EYES_HAPPY, mouth: mouthOpen(2), handsSvg: hands({ y: 258, rotL: -52, rotR: 52 }),
      behind: "",
      front:
        confetti(40, 120, CONF[0], 20, 0) + confetti(110, 84, CONF[1], -30, 2) + confetti(200, 98, CONF[2], 10, 1) + confetti(290, 84, CONF[3], 30, 0) +
        confetti(360, 118, CONF[4], -20, 2) + confetti(8, 196, CONF[2], 40, 0) + confetti(396, 198, CONF[0], -40, 1) + confetti(70, 70, CONF[3], 0, 1) +
        confetti(335, 66, CONF[1], 25, 0) + sparkle(160, 78, 11) + sparkle(250, 70, 9),
    },
  },
  {
    file: "dumpling-proud-confident", label: "Proud / Confident",
    opts: {
      eyes: EYES_LID, mouth: mouthSmirk, handsSvg: hands({ y: 352, rot: 22 }),
      front: sparkle(340, 156, 14) + sparkle(62, 360, 9) + burst(372, 130, -60, 3, 13, 10),
    },
  },
  {
    file: "dumpling-thumbs-up", label: "Thumbs up",
    opts: {
      eyes: EYES_BASE, mouth: mouthOpen(1), handsSvg: hands({ yL: 372, rotL: -12, yR: 292, rotR: 16, thumbR: true }),
      front: sparkle(420, 214, 12) + sparkle(396, 160, 8),
    },
  },
  {
    file: "dumpling-feeling-loved", label: "Feeling loved",
    opts: {
      eyes: eyesBig(), mouth: mouthSmile, handsSvg: hands({ y: 332, rot: 28 }),
      front: heart(72, 150, 1.25, -14) + heart(334, 134, 1, 12) + heart(204, 98, 0.8, 4) + heart(366, 214, 0.65, 10) + heart(34, 232, 0.7, -10),
    },
  },
];

fs.mkdirSync(DIR, { recursive: true });
for (const r of reactions) fs.writeFileSync(`${DIR}/${r.file}.svg`, render({ viewBox: VB, label: `Dumpling Buddy: ${r.label}`, ...r.opts }));

// review sheet (not part of the deliverable): all eight at a glance, plus the base for comparison and small sizes
const sheetDir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(sheetDir, { recursive: true });
for (const r of reactions) fs.copyFileSync(`${DIR}/${r.file}.svg`, `${sheetDir}/${r.file}.svg`);
fs.copyFileSync("scripts/dumpling/base.svg", `${sheetDir}/dumpling-base.svg`);
const t = Date.now();
fs.writeFileSync(`${sheetDir}/dumpling-happy.html`,
  `<body style="margin:14px;background:#fff;font:600 13px system-ui"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">` +
  reactions.map((r) => `<div style="text-align:center;border:1px solid #eee;border-radius:14px;padding:8px"><img src="${r.file}.svg?t=${t}" style="width:100%">${r.label}<br><img src="${r.file}.svg?t=${t}" width="48"> <img src="${r.file}.svg?t=${t}" width="28"></div>`).join("") +
  `</div>`);
console.log(reactions.length, "svgs ->", DIR);
