// Builds the icon library data from the drawings.
// run: node scripts/icons/build.mjs   -> data/icons.json, data/icons-preview.json
import fs from "node:fs";
import { COLLECTION, CATEGORIES, SYNONYMS, ARROWS, MOVES, ENTERS, VARIATIONS } from "./catalog.mjs";
import { parse } from "./dsl.mjs";
import { navigation, actions } from "./draw-nav-actions.mjs";
import { search, interfaceElements, status } from "./draw-search-interface-status.mjs";
import { input, account, text, time, utility } from "./draw-input-account-text-time-utility.mjs";

const DRAWINGS = {
  "navigation-direction": navigation,
  "actions-controls": actions,
  "search-discovery": { ...search, ...Object.fromEntries(VARIATIONS.filter((v) => v.set === "Filter").map((v) => [v.name, v.parts])) },
  "interface-elements": interfaceElements,
  "status-feedback": status,
  "input-form-controls": input,
  "account-user-interface": account,
  "text-editing": text,
  "time-scheduling": time,
  "utility-miscellaneous": utility,
  ...Object.fromEntries(Object.keys({ search: 1 }).length ? [...new Set(VARIATIONS.map((v) => v.set))].filter((s) => s !== "Filter").map((s) => [`${s.toLowerCase()}-variations`, Object.fromEntries(VARIATIONS.filter((v) => v.set === s).map((v) => [v.name, v.parts]))]) : []),
  arrows: Object.fromEntries(ARROWS.map((a) => [a.name, a.parts])),
  move: Object.fromEntries(MOVES.map((a) => [a.name, a.parts])),
  enter: Object.fromEntries(ENTERS.map((a) => [a.name, a.parts])),
};
const ADDED = "2026-11-02";

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const errors = [];
const warns = [];
const icons = [];
const ids = new Set();
const names = new Set();

for (const cat of CATEGORIES) {
  const drawings = DRAWINGS[cat.id];
  for (const name of cat.names) {
    const parts = drawings[name];
    if (!parts?.length) { errors.push(`${cat.name}: "${name}" has no drawing`); continue; }
    const id = slug(name);
    if (ids.has(id) || names.has(name)) errors.push(`duplicate icon "${name}" (${id})`);
    ids.add(id); names.add(name);
    // keep every shape inside the 24 x 24 grid (endpoints only; arcs may bulge a little)
    for (const p of parts) {
      for (const seg of parse(p.d)) {
        const pts = seg[0] === "Z" ? [] : seg[0] === "A" ? [[seg[6], seg[7]]] : seg.slice(1).reduce((a, v, i, arr) => (i % 2 ? a : [...a, [v, arr[i + 1]]]), []);
        for (const [x, y] of pts) if (x < 0.5 || x > 23.5 || y < 0.5 || y > 23.5) warns.push(`${name}: point ${x},${y} is outside the grid`);
      }
    }
    const words = new Set([...name.toLowerCase().split(/[^a-z0-9]+/), ...cat.name.toLowerCase().split(/[^a-z0-9]+/), ...(SYNONYMS[name] ?? "").split(" ")].filter((w) => w && w !== "and"));
    icons.push({
      i: id,
      n: name,
      c: cat.id,
      k: [...words].join(" "),
      p: parts.map((p) => [p.r, p.d, ...(p.w || p.da ? [p.w ?? 0, p.da ?? 0] : [])]),
      a: ADDED,
    });
  }
  for (const key of Object.keys(drawings)) if (!cat.names.includes(key)) errors.push(`${cat.name}: drawing "${key}" is not in the catalog`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
if (warns.length) console.warn(`${warns.length} point(s) outside the grid:\n` + [...new Set(warns)].slice(0, 20).join("\n"));

const data = {
  collection: COLLECTION,
  categories: CATEGORIES.map((c) => ({ id: c.id, name: c.name, desc: c.desc, count: c.names.length, ...(c.hidden ? { hidden: true } : {}) })),
  icons,
};
fs.writeFileSync("data/icons.json", JSON.stringify(data));

// the few icons the homepage shows, so the homepage does not load the whole library
const PREVIEW = [
  "Home", "Search", "Settings", "Bell", "Favorite", "Calendar", "Lock", "Camera", "Cloud", "Star", "User Circle", "Bookmark",
  "Send", "Eye", "Palette", "Trash", "Check Circle", "Play", "Moon", "Shield Check", "Wi-Fi", "Explore", "Clock", "Layers",
];
const byName = new Map(icons.map((x) => [x.n, x]));
const preview = {
  total: icons.filter((x) => !CATEGORIES.find((c) => c.id === x.c).hidden).length,
  categories: CATEGORIES.filter((c) => !c.hidden).length,
  icons: PREVIEW.map((n) => {
    const x = byName.get(n);
    if (!x) throw new Error("preview icon missing: " + n);
    return x;
  }),
};
fs.writeFileSync("data/icons-preview.json", JSON.stringify(preview));
console.log(`${icons.length} icons in ${CATEGORIES.length} categories -> data/icons.json (${Math.round(JSON.stringify(data).length / 1024)} KB)`);
console.log(CATEGORIES.map((c) => `${c.name}: ${c.names.length}`).join("\n"));
