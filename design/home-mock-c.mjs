// Visual mock C of the proposed Pasteables homepage: a library layout with a left sidebar. Not wired into the app.
// run: node design/home-mock-c.mjs
import fs from "node:fs";
import { plain } from "../scripts/mushroom/mushroom.mjs";
const hero = JSON.parse(fs.readFileSync("data/hero.json", "utf8"));
const strip = (svg) => svg.replace(/ width="\d+" height="\d+"/, "");
const load = (id) => JSON.parse(fs.readFileSync(`data/gallery-${id === "emoticons" ? "emoticons" : id}.json`, "utf8"));
const galleries = Object.fromEntries(hero.map((h) => [h.id, load(h.id)]));
const tileSvg = (id, secIdx, tileIdx, k) => {
  const sec = galleries[id].sections[secIdx] ?? galleries[id].sections[0], t = sec.tiles[tileIdx] ?? sec.tiles[0];
  let svg = id === "mushroom" ? plain(t.svg) : t.svg;
  const pal = (sec.palette || []).filter((c) => c.toLowerCase() !== (sec.base || "").toLowerCase());
  if (sec.base && pal.length) svg = svg.replace(new RegExp(sec.base.replace("#", "\\#"), "gi"), pal[k % pal.length]);
  return { name: t.name, svg: strip(svg) };
};
// a mixed "latest" wall: a few from every pack
const wall = [];
const picks = { mushroom: [[0, 0], [0, 3], [1, 0], [2, 4]], mascot: [[0, 0], [0, 4], [0, 8]], emoticons: [[0, 0], [0, 3], [0, 6]], ghost: [[0, 0], [0, 4], [6, 7]], clouds: [[0, 0], [0, 3], [0, 9]] };
let n = 0;
for (let r = 0; r < 4; r++) for (const id of ["mushroom", "mascot", "emoticons", "ghost", "clouds"]) { const p = (picks[id] || [])[r]; if (p) { const t = tileSvg(id, p[0], p[1], n++); wall.push({ id, ...t }); } }
const copyIc = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5"/></svg>';
const tile = (t) => `<div class="tile"><div class="stage">${t.svg}</div><div class="cap">${t.name}</div><span class="ov">${copyIc}<b>Copy</b></span></div>`;
const side = hero.map((h) => `<a href="#${h.id}"><i style="background:${h.color}"></i>${h.name}<em>${h.count.replace("#", "")}</em></a>`).join("");
const chip = (h) => { const t = tileSvg(h.id, 0, 0, 1); return `<a class="pk" href="#${h.id}" style="--c:${h.color}"><span>${t.svg}</span><b>${h.name}</b><em>${h.count.replace("#", "")}</em></a>`; };
const feat = tileSvg("mushroom", 0, 0, 0).svg;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pasteables — home design C</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#FBF7F0;--ink:#2B2430;--mut:#7A7184;--line:#ECE3D6;--acc:#E8683A;--side:#2B2430}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}
.app{display:grid;grid-template-columns:264px 1fr;min-height:100vh}
aside{background:var(--side);color:#EDE7F2;padding:22px 16px;position:sticky;top:0;height:100vh;overflow:auto;display:flex;flex-direction:column;gap:18px}
.logo{display:flex;align-items:center;gap:10px;font:800 1.2rem 'Bricolage Grotesque';color:#fff;padding:0 8px}
.logo i{width:30px;height:30px;border-radius:9px;background:#E8F7D6;display:grid;place-items:center}.logo i:after{content:"";width:13px;height:15px;border-radius:7px 7px 3px 7px;background:#4B2745}
.sb{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;color:#B5ABC0;font-size:.92rem}
.sb svg{width:16px;height:16px}.sb kbd{margin-left:auto;font:500 .72rem 'DM Sans';border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:1px 6px}
.grp small{display:block;font:700 .7rem 'DM Sans';letter-spacing:.14em;text-transform:uppercase;color:#8F85A0;margin:0 10px 6px}
.grp a{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;font-weight:500;color:#DCD4E6}
.grp a:hover,.grp a.on{background:rgba(255,255,255,.09);color:#fff}
.grp a i{width:10px;height:10px;border-radius:50%;flex:none}.grp a em{margin-left:auto;font-style:normal;font-size:.8rem;color:#9A90A8}
.grp a.soon{color:#9A90A8}.grp a.soon i{background:transparent;border:1.5px dashed #6C6279}.grp a.soon em{font-size:.7rem;border:1px solid #4a4156;border-radius:999px;padding:1px 7px}
.fmt{margin-top:auto;border-top:1px solid rgba(255,255,255,.1);padding:14px 10px 0;font-size:.85rem;color:#B5ABC0;line-height:1.5}
.fmt b{display:block;color:#fff;margin-bottom:6px}.fmt span{display:inline-block;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:2px 9px;margin:0 4px 4px 0;font-weight:700;font-size:.74rem;color:#fff}
main{padding:26px 36px 60px;min-width:0}
.top{display:flex;align-items:center;gap:12px;margin-bottom:22px}
.top h1{font:800 1.9rem 'Bricolage Grotesque';letter-spacing:-.03em;margin:0}
.top .tabs{margin-left:auto;display:flex;gap:6px;background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px}
.top .tabs a{padding:7px 14px;border-radius:999px;font-weight:700;font-size:.88rem;color:var(--mut)}.top .tabs a.on{background:var(--ink);color:#fff}
.banner{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:20px;border-radius:30px;background:#F2C9C6;padding:30px 34px;overflow:hidden;position:relative}
.banner small{font-weight:700;color:#8A3A38;letter-spacing:.06em}.banner h2{font:800 2.7rem/1 'Bricolage Grotesque';letter-spacing:-.035em;margin:8px 0 10px}
.banner p{margin:0 0 18px;color:#5a3f45;line-height:1.5;max-width:36ch}
.btn{display:inline-flex;background:var(--ink);color:#fff;font-weight:700;border-radius:999px;padding:11px 18px;font-size:.92rem}
.banner .art{height:230px;display:grid;place-items:center}.banner .art svg{height:100%;width:auto}
h3.sec{font:800 1.1rem 'Bricolage Grotesque';margin:34px 0 14px;display:flex;justify-content:space-between;align-items:baseline}
h3.sec a{font:700 .88rem 'DM Sans';color:var(--acc)}
.packs{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.pk{background:#fff;border:1px solid var(--line);border-radius:20px;padding:12px;display:grid;grid-template-columns:1fr;gap:8px;transition:.2s}
.pk:hover{border-color:var(--c);box-shadow:0 8px 22px rgba(43,36,48,.08);transform:translateY(-2px)}
.pk span{aspect-ratio:1.5;border-radius:14px;background:color-mix(in srgb,var(--c) 28%,#fff);display:grid;place-items:center;padding:8px}.pk span svg{height:100%;width:auto;max-width:100%}
.pk b{font:700 1rem 'Bricolage Grotesque'}.pk em{font-style:normal;color:var(--mut);font-size:.82rem;margin-top:-6px}
.wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:12px}
.tile{position:relative;background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden}
.tile .stage{aspect-ratio:1;padding:16px;display:grid;place-items:center}.tile .stage svg{width:100%;height:100%}
.tile .cap{padding:0 12px 12px;font-weight:700;font-size:.86rem;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ov{position:absolute;inset:0;border-radius:20px;background:rgba(43,36,48,.74);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;opacity:0;transition:opacity .15s}
.tile:hover .ov{opacity:1}
@media(max-width:900px){.app{grid-template-columns:1fr}aside{position:static;height:auto;flex-direction:row;flex-wrap:wrap;align-items:center;padding:14px 16px}.grp,.fmt,.sb{display:none}main{padding:20px 16px 50px}.banner{grid-template-columns:1fr}.banner .art{height:170px}.packs{grid-template-columns:repeat(2,1fr)}.top{flex-wrap:wrap}.top .tabs{margin-left:0}}
</style></head><body><div class="app">
<aside><a class="logo" href="#"><i></i>Pasteables</a>
<div class="sb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>Search<kbd>/</kbd></div>
<div class="grp"><small>Browse</small><a class="on" href="#"><i style="background:#fff"></i>Everything<em>${hero.reduce((a, h) => a + +h.count.replace("#", ""), 0)}</em></a></div>
<div class="grp"><small>Sticker packs</small>${side}</div>
<div class="grp"><small>Icon packs</small><a class="soon" href="#"><i></i>Everyday UI<em>Soon</em></a><a class="soon" href="#"><i></i>Food &amp; drink<em>Soon</em></a></div>
<div class="fmt"><b>Copy as</b><span>SVG</span><span>React</span><span>Flutter</span></div></aside>
<main>
<div class="top"><h1>Library</h1><div class="tabs"><a class="on" href="#">All</a><a href="#">Stickers</a><a href="#">Icons</a></div></div>
<div class="banner"><div><small>NEW PACK</small><h2>Mushroom Buddy</h2><p>A tiny spotted mushroom with a face for every mood. 27 stickers, ready to paste.</p><a class="btn" href="#mushroom">Open pack →</a></div><div class="art">${feat}</div></div>
<h3 class="sec">Sticker packs <a href="#">See all</a></h3><div class="packs">${hero.map(chip).join("")}</div>
<h3 class="sec">Latest stickers <a href="#">Browse all →</a></h3><div class="wall">${wall.map(tile).join("")}</div>
</main></div></body></html>`;
fs.writeFileSync("design/home-mock-c.html", html);
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/home-mock-c.html", html);
console.log("ok", wall.length, html.length);
