// Builds data/gallery-mushroom.json and adds the Mushroom stripe to data/hero.json. run: node scripts/mushroom/build.mjs
import fs from "node:fs";
import groups, { plain } from "./mushroom.mjs";
const sections = groups.map((g) => ({ title: g.title, desc: g.desc, palette: [], base: "", tiles: g.tiles.map(([name, fn]) => ({ name, svg: fn() })) }));
const all = sections.flatMap((s) => s.tiles);
const emo = JSON.parse(fs.readFileSync("data/gallery-emoticons.json", "utf8"));
fs.writeFileSync("data/gallery-mushroom.json", JSON.stringify({
  id: "mushroom", title: "Mushroom Buddy", subtitle: `${all.length} tiny mushroom reactions. Click any one to copy it.`,
  hasColor: false, colors: [], inks: emo.inks, sections,
}));
const hero = JSON.parse(fs.readFileSync("data/hero.json", "utf8")).filter((h) => h.id !== "mushroom");
hero.push({ id: "mushroom", color: "#D9504E", name: "Mushroom", desc: "A tiny spotted mushroom with a face for every mood.", tag: "#mushroom", count: `#${all.length}`, artStyle: "--d:0.30s;--w:min(88%,27vh);--x:0%;--drop:6%", svg: plain(all[0].svg) });
fs.writeFileSync("data/hero.json", JSON.stringify(hero));
// contact sheet for eyeballing
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/mush-all.html", `<body style="margin:12px;background:#fffdf9;font:12px sans-serif"><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">${all.map((t) => `<div style="text-align:center">${plain(t.svg).replace('width="890" height="890"', 'style="width:100%;height:auto"')}${t.name}</div>`).join("")}</div>`);
console.log("mushroom tiles", all.length);
