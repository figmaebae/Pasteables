// One-off extractor: turns the original single-file artifact HTML into data/*.json
import fs from "node:fs";
const src = fs.readFileSync(process.argv[2], "utf8");
const line = src.split("\n")[143];
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const text = (s) => unesc(s.replace(/<[^>]+>/g, ""));

// hero columns
const heroEnd = line.indexOf('<div class="gal"');
const heroHtml = line.slice(0, heroEnd);
const hero = [...heroHtml.matchAll(/<a class="col" href="#(\w+)" data-open="\w+" style="--c:(#\w+)"><h2 class="name">([^<]*)<\/h2><div class="info"><p class="desc">([^<]*)<\/p><p class="tags"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/p><\/div><div class="art" aria-hidden="true" style="([^"]*)">(<svg[\s\S]*?<\/svg>)<\/div><\/a>/g)]
  .map((m) => ({ id: m[1], color: m[2], name: m[3], desc: unesc(m[4]), tag: m[5], count: m[6], artStyle: m[7], svg: m[8] }));

// galleries
const galleries = [];
const parts = line.slice(heroEnd).split('<div class="gal" ').slice(1);
for (const p of parts) {
  const id = p.match(/id="g-(\w+)"/)[1];
  const title = text(p.match(/<div class="gh"><h2[^>]*>([\s\S]*?)<\/h2><p>([\s\S]*?)<\/p>/)[1]);
  const subtitle = text(p.match(/<div class="gh"><h2[^>]*>([\s\S]*?)<\/h2><p>([\s\S]*?)<\/p>/)[2]);
  const studioHtml = p.match(/<div class="studio"[\s\S]*?<button type="button" class="reset"/)[0];
  const colors = [...studioHtml.matchAll(/class="sw( mixed)?[^"]*" data-v="(-?\d+)"(?: style="background:(#\w+)")? title="([^"]*)"/g)].map((m) => ({ v: +m[2], hex: m[3] ?? null, title: m[4] }));
  const inkBlock = studioHtml.match(/data-ctl="ink">([\s\S]*?)<\/div><\/div>/)?.[1] ?? "";
  const inks = [...inkBlock.matchAll(/data-v="(#\w+)" style="background:#\w+" title="([^"]*)"/g)].map((m) => ({ hex: m[1], title: m[2] }));
  const hasColor = /data-ctl="color"/.test(studioHtml);
  const sections = [];
  for (const s of p.split('<section ').slice(1)) {
    const palette = s.match(/data-palette="([^"]*)"/)[1];
    const base = s.match(/data-base="([^"]*)"/)[1];
    const st = s.match(/<h3>([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p>/);
    const tiles = [...s.matchAll(/<button type="button" class="gtile"( data-alt="([^"]*)")?[^>]*><div class="gstage">(<svg[\s\S]*?<\/svg>)<\/div><div class="gcap"><span>([\s\S]*?)<\/span>/g)]
      .map((m) => ({ name: unesc(m[4]), svg: m[3], ...(m[2] ? { alt: unesc(m[2]) } : {}) }));
    sections.push({ title: text(st[1]), desc: text(st[2]), palette: palette ? palette.split(",") : [], base, tiles });
  }
  galleries.push({ id, title, subtitle, hasColor, colors, inks, sections });
}
fs.writeFileSync("data/hero.json", JSON.stringify(hero));
for (const g of galleries) fs.writeFileSync(`data/gallery-${g.id}.json`, JSON.stringify(g));
console.log(hero.length, galleries.map((g) => [g.id, g.hasColor, g.colors.length, g.inks.length, g.sections.length, g.sections.reduce((a, s) => a + s.tiles.length, 0), g.sections.filter(s=>s.tiles.some(t=>t.alt)).length]));
