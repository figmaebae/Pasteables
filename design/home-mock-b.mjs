// Visual mock B of the proposed Pasteables homepage: full-width "shelf" rows per pack. Not wired into the app.
// run: node design/home-mock-b.mjs
import fs from "node:fs";
import { plain } from "../scripts/mushroom/mushroom.mjs";
const hero = JSON.parse(fs.readFileSync("data/hero.json", "utf8"));
const files = { mascot: "mascot", emoticons: "emoticons", ghost: "ghost", clouds: "clouds", mushroom: "mushroom" };
const strip = (svg) => svg.replace(/ width="\d+" height="\d+"/, "");
const thumbs = (id) => {
  const g = JSON.parse(fs.readFileSync(`data/gallery-${files[id]}.json`, "utf8"));
  const secs = g.sections;
  const flat = secs.flatMap((sec) => sec.tiles.map((t) => ({ t, sec })));
  const pick = id === "mushroom" ? [0, 2, 3, 5, 8, 12, 16] : [0, 1, 2, 3, 4, 5, 6];
  return pick.map((i, k) => flat[i]).filter(Boolean).map(({ t, sec }, k) => {
    let svg = id === "mushroom" ? plain(t.svg) : t.svg;
    const pal = (sec.palette || []).filter((c) => c.toLowerCase() !== (sec.base || "").toLowerCase());
    if (sec.base && pal.length) svg = svg.replace(new RegExp(sec.base.replace("#", "\\#"), "gi"), pal[(k + 1) % pal.length]);
    return `<span class="t">${strip(svg)}</span>`;
  }).join("");
};
const band = (h) => `<a class="band" href="#${h.id}" style="--c:${h.color}"><div class="lead"><small>${h.count.replace("#", "")} stickers</small><h3>${h.name}</h3><p>${h.desc}</p><span class="open">Open pack <i>→</i></span></div><div class="row">${thumbs(h.id)}</div></a>`;
const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const set = [
  '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>', '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9l9 6 9-6"/>', '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>', '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
].map(ic);
const iconBand = (name, desc) => `<div class="band ibr"><div class="lead"><small>Coming soon</small><h3>${name}</h3><p>${desc}</p><span class="open dim">Notify me</span></div><div class="row">${set.map((s) => `<span class="t ico">${s}</span>`).join("")}</div></div>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pasteables — home design B</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#FBF6EE;--ink:#2B2430;--mut:#6F6678;--acc:#E8683A}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}.wrap{max-width:1240px;margin:0 auto;padding:0 28px}
header .wrap{display:flex;align-items:center;height:76px;gap:30px}
.logo{display:flex;align-items:center;gap:10px;font:800 1.25rem 'Bricolage Grotesque';letter-spacing:-.01em}
.logo i{width:30px;height:30px;border-radius:9px;background:#E8F7D6;display:grid;place-items:center}.logo i:after{content:"";width:13px;height:15px;border-radius:7px 7px 3px 7px;background:#4B2745}
header nav{display:flex;gap:26px;margin-left:auto;font-weight:500}
header nav a{color:var(--mut)}header nav a:hover,header nav a.on{color:var(--ink)}
.hero{padding:54px 0 46px;display:grid;grid-template-columns:1.25fr .75fr;gap:40px;align-items:end}
.hero h1{font:800 clamp(2.8rem,7vw,5.6rem)/.96 'Bricolage Grotesque';letter-spacing:-.04em;margin:0}
.hero h1 span{color:var(--acc)}
.hero aside{color:var(--mut);font-size:1.1rem;line-height:1.55}
.fm{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}.fm b{font:700 .82rem 'DM Sans';border:1.5px solid var(--ink);border-radius:999px;padding:5px 12px;color:var(--ink)}
.label{display:flex;align-items:baseline;justify-content:space-between;margin:34px 0 14px;font:800 .8rem 'DM Sans';letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}
.label em{font-style:normal;letter-spacing:0;text-transform:none;font-weight:500}
.band{display:grid;grid-template-columns:300px 1fr;gap:26px;align-items:center;border-radius:30px;padding:26px 28px;margin-bottom:14px;background:color-mix(in srgb,var(--c,#2B2430) 30%,#fff);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden}
a.band:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(43,36,48,.12)}
.lead small{font-weight:700;color:color-mix(in srgb,var(--c) 55%,#2B2430);font-size:.82rem}
.lead h3{font:800 2.5rem/1 'Bricolage Grotesque';letter-spacing:-.03em;margin:6px 0 8px}
.lead p{margin:0 0 16px;color:#4d4556;line-height:1.5;font-size:.95rem;max-width:30ch}
.open{display:inline-flex;gap:6px;align-items:center;background:var(--ink);color:#fff;font-weight:700;font-size:.88rem;padding:9px 16px;border-radius:999px}
a.band:hover .open i{transform:translateX(3px)}.open i{font-style:normal;transition:transform .2s}
.row{display:flex;gap:10px;min-width:0;justify-content:flex-end}
.t{flex:1 1 0;max-width:128px;aspect-ratio:1;background:rgba(255,255,255,.62);border-radius:22px;display:grid;place-items:center;padding:10px;min-width:0}
.t svg{width:100%;height:100%;display:block}
.ibr{background:#2B2430;color:#fff}.ibr .lead small{color:#FFB08F}.ibr .lead p{color:#cbc3d3}.ibr .open{background:#fff;color:var(--ink)}.open.dim{opacity:.9}
.ico{background:rgba(255,255,255,.08);color:#fff}.ico svg{width:46%;height:46%}
.fmt{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:6px 0 10px}
.fmt div{border-top:2px solid var(--ink);padding-top:14px}.fmt b{font:800 1.15rem 'Bricolage Grotesque'}.fmt p{margin:6px 0 0;color:var(--mut);line-height:1.5}
footer{margin-top:46px;padding:26px 0 44px;border-top:1px solid #E7DDCE;display:flex;justify-content:space-between;color:var(--mut);font-size:.92rem;gap:16px;flex-wrap:wrap}
@media(max-width:860px){.hero{grid-template-columns:1fr}.band{grid-template-columns:1fr}.row{overflow-x:auto;justify-content:flex-start;padding-bottom:4px}.t{flex:0 0 96px}.fmt{grid-template-columns:1fr}header nav{display:none}.lead h3{font-size:2.1rem}}
</style></head><body>
<header><div class="wrap"><a class="logo" href="#"><i></i>Pasteables</a><nav><a class="on" href="#stickers">Stickers</a><a href="#icons">Icons</a><a href="#about">How it works</a></nav></div></header>
<main class="wrap">
<section class="hero"><div><h1>Vectors you can <span>paste</span> anywhere.</h1></div><aside>Sticker characters and icon sets, drawn to match. Click one to copy it as SVG, React or Flutter.<div class="fm"><b>SVG</b><b>React</b><b>Flutter</b></div></aside></section>
<div class="label" id="stickers"><span>Sticker packs</span><em>${hero.length} packs</em></div>
${hero.map(band).join("")}
<div class="label" id="icons"><span>Icon packs</span><em>Launching soon</em></div>
${iconBand("Everyday UI", "Clean line icons for apps and sites: home, search, alerts and more.")}
${iconBand("Food & drink", "Cafés, kitchens and snacks in the same soft line style.")}
<div class="label" id="about"><span>How it works</span></div>
<div class="fmt"><div><b>1. Pick a pack</b><p>Open a sticker or icon pack and look around.</p></div><div><b>2. Tweak it</b><p>Change color, stroke, ink and eyes, live.</p></div><div><b>3. Copy it</b><p>One click copies SVG, a React component or a Flutter widget.</p></div></div>
</main>
<div class="wrap"><footer><a class="logo" href="#"><i></i>Pasteables</a><span>© Pasteables</span></footer></div>
</body></html>`;
fs.writeFileSync("design/home-mock-b.html", html);
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/home-mock-b.html", html);
console.log("ok", html.length);
