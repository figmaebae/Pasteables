// Builds the website pack from the approved Dumpling SVGs: data/gallery-dumpling.json + the homepage card art in data/hero.json.
// The source SVG files are not changed. run: node scripts/dumpling/build-gallery.mjs
import fs from "node:fs";
import { renderHooks, renderTagged } from "./character.mjs";

const R = "scripts/dumpling/reactions";
const NEW_VB = "-80 44 560 440"; // one shared canvas, so every tile shows the dumpling at the same size
const INK = "#4A2418", EYE = "#3A1D14";
const INKS = [{ hex: "#2B2430", title: "Ink" }, { hex: "#1F3A8A", title: "Navy" }, { hex: "#6B2D5C", title: "Plum" }, { hex: "#5A3A2A", title: "Cocoa" }, { hex: "#1E5B45", title: "Forest" }];

// Collect every reaction as the website needs it (eyes tagged for the Eyes slider). Running the generators also rewrites the
// SVG files, byte-for-byte as before; the tagged copies only ever go into the website data.
const tagged = new Map();
renderHooks.onRender = (o) => tagged.set(o.label, renderTagged(o));
await import("./reactions-happy.mjs");
await import("./reactions-sad.mjs");
await import("./reactions-dev.mjs");
renderHooks.onRender = undefined;

const SECTIONS = [
  { title: "Happy & positive", desc: "Eight cheerful reactions: happy, excited, laughing, sparkling and more.", dir: "01-happy-positive" },
  { title: "Sad & emotional", desc: "Eight tender ones: crying, shy, embarrassed, hugging itself.", dir: "02-sad-emotional" },
  { title: "Design & UI/UX", desc: "Stylus, wireframes, pixels and palettes.", dir: "03-designer-developer", prefix: "design-" },
  { title: "Developer life", desc: "Coding, bugs, debugging and shipping.", dir: "03-designer-developer", prefix: "dev-" },
  { title: "Design meets dev", desc: "Handoffs and revisions.", dir: "03-designer-developer", prefix: "collab-" },
  { title: "Work & productivity", desc: "Coffee, deadlines, ideas and Monday mood.", dir: "03-designer-developer", prefix: "work-" },
];

const ORDER = {
  "01-happy-positive": ["happy", "excited", "laughing-lol", "sparkling-eyes", "celebrating-yay", "proud-confident", "thumbs-up", "feeling-loved"],
  "02-sad-emotional": ["crying", "sad", "disappointed", "feeling-lonely", "shy-blushing", "embarrassed", "hugging-itself", "asking-for-comfort"],
};
const rank = (dir, file) => { const o = ORDER[dir]; return o ? o.indexOf(file.replace(/^dumpling-|\.svg$/g, "")) : 0; };
const f = (n) => String(Math.round(n * 100) / 100);
// Strokes are authored at 2x so the site's default 0.5x stroke shows the approved look; data-bs lets the Stroke slider scale them.
const tagStrokes = (svg) => svg.replace(/<[a-zA-Z][^>]*>/g, (tag) => {
  const m = tag.match(/ stroke="(#[0-9A-Fa-f]{6})"/);
  if (!m || ![INK, EYE].includes(m[1].toUpperCase())) return tag;
  return tag.replace(/ stroke-width="([\d.]+)"/, (_, w) => ` stroke-width="${f(w * 2)}" data-bs="1"`);
});

let n = 0;
const sections = SECTIONS.map((s) => {
  const files = fs.readdirSync(`${R}/${s.dir}`).filter((x) => x.endsWith(".svg") && (!s.prefix || x.startsWith(s.prefix))).sort((a, b) => rank(s.dir, a) - rank(s.dir, b) || a.localeCompare(b));
  const tiles = files.map((file) => {
    n += 1;
    const plainSvg = fs.readFileSync(`${R}/${s.dir}/${file}`, "utf8").trim();
    const name = plainSvg.match(/aria-label="Dumpling Buddy: ([^"]+)"/)[1];
    let svg = tagged.get(`Dumpling Buddy: ${name}`)?.trim();
    if (!svg) throw new Error("missing " + name);
    svg = svg
      .replace(/aria-label="Dumpling Buddy: /, 'aria-label="Dumpling: ')
      .replace(/viewBox="[^"]+"/, `viewBox="${NEW_VB}" width="560" height="440"`)
      .replace(/dumpling-body/g, `dk${n}`)
      .replace(/<!--[\s\S]*?-->\s*/g, "");
    // Outlined style: a white dumpling with the same ink line, shading removed
    const alt = svg.replace(/<g clip-path="url\(#dk\d+\)">[\s\S]*?<\/g>\s*/, "").replace(/#FCE6C6/g, "#FFFFFF");
    return { name, svg: tagStrokes(svg), alt: tagStrokes(alt) };
  });
  return { title: s.title, desc: s.desc, palette: [], base: "", tiles };
});

const gallery = {
  id: "dumpling", title: "Dumpling", subtitle: `${n} tiny dumpling reactions. Click any one to copy it.`,
  hasColor: false, colors: [], inks: INKS, inkFrom: [INK, EYE], sections,
};
fs.writeFileSync("data/gallery-dumpling.json", JSON.stringify(gallery));

const art = fs.readFileSync("scripts/dumpling/base.svg", "utf8").trim().replace(/dumpling-body/g, "dkh").replace('aria-label="Dumpling Buddy"', 'aria-label="Dumpling"').replace(/<!--[\s\S]*?-->\s*/g, "");
const hero = JSON.parse(fs.readFileSync("data/hero.json", "utf8")).filter((h) => h.id !== "dumpling");
hero.push({ id: "dumpling", color: "#E9B872", name: "Dumpling", desc: "A soft little dumpling with a reaction for every mood, from design reviews to deploys.", tag: "#dumpling", count: `#${n}`, artStyle: "--d:0.36s;--w:min(88%,27vh);--x:0%;--drop:6%", svg: art });
fs.writeFileSync("data/hero.json", JSON.stringify(hero));
console.log(n, "tiles;", sections.map((s) => s.tiles.length).join("/"));
