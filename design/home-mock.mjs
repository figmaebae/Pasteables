// Builds a static visual mock of the proposed Pasteables homepage (not wired into the app). run: node design/home-mock.mjs
import fs from "node:fs";
const hero = JSON.parse(fs.readFileSync("data/hero.json", "utf8"));
const counts = Object.fromEntries(hero.map((h) => [h.id, h.count.replace("#", "")]));
const art = (h) => h.svg.replace(/ width="\d+" height="\d+"/, "");
const stickerCard = (h) => `<a class="card" href="#${h.id}" style="--c:${h.color}"><div class="stage"><div class="art" style="--w:${{ mascot: 52, emoticons: 66, ghost: 54, clouds: 62, mushroom: 66 }[h.id]}%">${art(h)}</div></div><div class="meta"><b>${h.name}</b><span>${counts[h.id]} stickers</span></div></a>`;
const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const icons = {
  ui: [ic('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'), ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'), ic('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>'), ic('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9l9 6 9-6"/>'), ic('<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>'), ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')],
  food: [ic('<path d="M7 3v8a3 3 0 0 0 3 3v7"/><path d="M4 3v6M10 3v6"/><path d="M17 21V3c-3 2-4 6-4 9h4"/>'), ic('<path d="M5 9h14l-1.5 11h-11z"/><path d="M8 9l2-5h4"/>'), ic('<circle cx="12" cy="13" r="8"/><path d="M12 5c0-2 1-3 3-3"/>'), ic('<path d="M4 20h16"/><path d="M6 20c0-6 3-10 6-10s6 4 6 10"/><path d="M12 10V6"/>'), ic('<path d="M6 3h12l-1 8a5 5 0 0 1-10 0z"/><path d="M12 16v5M8 21h8"/>'), ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')],
};
const iconCard = (name, desc, set) => `<div class="card soon"><div class="icons">${set.map((s) => `<span>${s}</span>`).join("")}</div><div class="meta"><b>${name}</b><span>${desc}</span><i class="pill">Coming soon</i></div></div>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pasteables — home design</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#FFF9F2;--ink:#2B2430;--mut:#6F6678;--line:#EDE3D6;--card:#fff;--acc:#E8683A;--r:22px}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
/* header */
header{position:sticky;top:0;z-index:10;background:rgba(255,249,242,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;gap:28px;height:68px}
.logo{display:flex;align-items:center;gap:10px;font:800 1.2rem 'Bricolage Grotesque';letter-spacing:-.01em}
.logo i{width:30px;height:30px;border-radius:9px;background:#E8F7D6;display:grid;place-items:center}
.logo i:after{content:"";width:13px;height:15px;border-radius:7px 7px 3px 7px;background:#4B2745}
nav{display:flex;gap:4px;margin-left:12px}
nav a{padding:8px 14px;border-radius:999px;font-weight:500;color:var(--mut)}
nav a.on,nav a:hover{background:#fff;color:var(--ink);box-shadow:0 0 0 1px var(--line)}
.sp{flex:1}
.btn{padding:9px 16px;border-radius:999px;background:var(--ink);color:#fff;font-weight:700;font-size:.92rem}
/* hero */
.hero{padding:76px 0 40px;text-align:center}
.hero h1{font:800 clamp(2.4rem,5.6vw,4rem)/1.04 'Bricolage Grotesque';letter-spacing:-.03em;margin:0 auto;max-width:14ch}
.hero h1 em{font-style:normal;color:var(--acc)}
.hero p{margin:18px auto 0;max-width:46ch;color:var(--mut);font-size:1.1rem;line-height:1.55}
.search{margin:30px auto 0;max-width:560px;display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--line);border-radius:999px;padding:8px 8px 8px 20px;box-shadow:0 8px 30px rgba(43,36,48,.06)}
.search svg{width:20px;height:20px;color:var(--mut);flex:none}
.search span{flex:1;text-align:left;color:#A79EAF}
.search b{background:var(--acc);color:#fff;border-radius:999px;padding:10px 20px;font-size:.92rem}
.chips{display:flex;justify-content:center;gap:8px;margin-top:18px;flex-wrap:wrap}
.chips a{padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:.9rem;font-weight:500;color:var(--mut)}
.chips a.on{background:var(--ink);color:#fff;border-color:var(--ink)}
/* sections */
section{padding:44px 0}
.head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:22px}
.head h2{font:800 1.7rem 'Bricolage Grotesque';letter-spacing:-.02em;margin:0}
.head p{margin:4px 0 0;color:var(--mut)}
.head a{font-weight:700;color:var(--acc);white-space:nowrap}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:18px}
.card{position:relative;display:block;background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;transition:transform .2s,box-shadow .2s}
a.card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(43,36,48,.10)}
.stage{position:relative;height:200px;background:color-mix(in srgb,var(--c) 26%,#fff);overflow:hidden}
.art{position:absolute;left:50%;bottom:0;width:var(--w);transform:translateX(-50%)}
.art svg{display:block;width:100%;height:auto}
.meta{padding:14px 18px 16px;display:flex;flex-direction:column;gap:2px}
.meta b{font:700 1.05rem 'Bricolage Grotesque'}
.meta span{color:var(--mut);font-size:.9rem}
/* icon packs (placeholders) */
.soon{background:#fff}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border-bottom:1px solid var(--line)}
.icons span{background:#fff;display:grid;place-items:center;height:66px;color:var(--ink)}
.icons svg{width:26px;height:26px}
.pill{align-self:flex-start;margin-top:8px;font-style:normal;font-size:.72rem;font-weight:700;background:#FFE7DC;color:#B6441C;border-radius:999px;padding:4px 10px}
.more{display:flex;align-items:center;justify-content:center;min-height:200px;border:1.5px dashed #D9CCBB;background:transparent;color:var(--mut);font-weight:500;text-align:center;padding:20px;border-radius:var(--r)}
/* formats */
.formats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.fmt{background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:22px}
.fmt code{display:inline-block;background:#F4EBDD;border-radius:8px;padding:3px 9px;font-weight:700;font-size:.85rem}
.fmt h3{font:700 1.1rem 'Bricolage Grotesque';margin:12px 0 4px}.fmt p{margin:0;color:var(--mut);line-height:1.5}
footer{margin-top:30px;border-top:1px solid var(--line);padding:30px 0 40px;color:var(--mut);display:flex;gap:20px;flex-wrap:wrap;align-items:center;justify-content:space-between;font-size:.92rem}
footer nav{margin:0}
@media(max-width:760px){.grid{grid-template-columns:repeat(2,1fr);gap:12px}.stage{height:150px}.nav{gap:12px}nav{display:none}.hero{padding-top:48px}.formats{grid-template-columns:1fr}.stage{height:170px}.head{flex-direction:column;align-items:start}}
</style></head><body>
<header><div class="wrap nav"><a class="logo" href="#"><i></i>Pasteables</a><nav><a class="on" href="#stickers">Stickers</a><a href="#icons">Icons</a><a href="#formats">Formats</a></nav><span class="sp"></span><a class="btn" href="#stickers">Browse packs</a></div></header>
<main>
<div class="wrap hero"><h1>Little vectors, <em>one click</em> away.</h1><p>Cute sticker characters and clean icons you can copy straight into your project, as SVG, React or Flutter.</p>
<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><span>Search stickers and icons…</span><b>Search</b></div>
<div class="chips"><a class="on" href="#">All</a><a href="#stickers">Stickers</a><a href="#icons">Icons</a></div></div>
<section id="stickers"><div class="wrap"><div class="head"><div><h2>Sticker packs</h2><p>Characters with a mood for everything. Click a pack to browse.</p></div><a href="#">View all →</a></div>
<div class="grid">${hero.map(stickerCard).join("")}</div></div></section>
<section id="icons"><div class="wrap"><div class="head"><div><h2>Icon packs</h2><p>Consistent, scalable icon sets for apps and sites.</p></div><a href="#">View all →</a></div>
<div class="grid">${iconCard("Everyday UI", "Home, search, alerts and more", icons.ui)}${iconCard("Food & drink", "Cafés, kitchens and snacks", icons.food)}<div class="more">More icon packs<br>on the way</div></div></div></section>
<section id="formats"><div class="wrap"><div class="head"><div><h2>Copy it your way</h2><p>Every sticker and icon exports in three formats.</p></div></div>
<div class="formats"><div class="fmt"><code>SVG</code><h3>Paste anywhere</h3><p>Drop it into Figma, a design tool or HTML.</p></div><div class="fmt"><code>React</code><h3>Ready-made component</h3><p>A typed component you can import right away.</p></div><div class="fmt"><code>Flutter</code><h3>Widget snippet</h3><p>A small widget that renders the vector.</p></div></div></div></section>
</main>
<div class="wrap"><footer><a class="logo" href="#"><i></i>Pasteables</a><nav><a href="#stickers">Stickers</a><a href="#icons">Icons</a><a href="#formats">Formats</a></nav><span>© Pasteables</span></footer></div>
</body></html>`;
fs.writeFileSync("design/home-mock.html", html);
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/home-mock.html", html);
console.log("ok", html.length);
