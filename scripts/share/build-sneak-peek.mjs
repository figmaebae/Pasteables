// Builds the sneak-peek image for social posts from the real sticker art: design/share/pasteables-sneak-peek.html (+ .png via Chrome).
// run: node scripts/share/build-sneak-peek.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// the site's own transform (eye size, stroke), compiled on the fly so the image matches the gallery exactly
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), "peek-"));
fs.writeFileSync(`${tmp}/transform.mjs`, ts.transpileModule(fs.readFileSync("lib/transform.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText);
const { transformSvg, DEFAULT_INK } = await import(pathToFileURL(`${tmp}/transform.mjs`).href);

const L = JSON.parse(fs.readFileSync("data/landing-stickers.json", "utf8"));
const dump = JSON.parse(fs.readFileSync("data/gallery-dumpling.json", "utf8"));
const tile = (name) => dump.sections.flatMap((s) => s.tiles).find((t) => t.name === name);
// dumpling at the gallery defaults (0.5x stroke, 0.8x eyes), canvas cropped to the character
const D = (name, vb) =>
  transformSvg(tile(name).svg, { outlined: false, stroke: 0.5, ink: DEFAULT_INK, eyes: dump.defaultEyes, inkFrom: dump.inkFrom })
    .replace(/ width="\d+" height="\d+"/, "")
    .replace(/viewBox="[^"]*"/, `viewBox="${vb}"`);

// [art, size] per cell; sizes are nudged so every character reads about the same size
const grid = [
  [[L.a1, 1], [L.e1, 0.95], [L.g1, 1], [D("Happy", "0 112 400 360"), 0.86]],
  [[L.m1, 0.9], [L.c1, 1.08], [D("Thumbs up", "0 100 430 370"), 0.88], [L.a2, 1]],
  [[D("Coding Away", "0 110 500 360"), 0.9], [L.g2, 0.96], [L.m4, 0.9], [L.c2, 1.08]],
];
const cells = grid
  .map((row, r) =>
    row
      .map(([svg, k], c) => `<div class="cell" style="grid-row:${r + 1};grid-column:${c + 1};${c % 2 ? "transform:translateY(34px)" : ""}"><div class="st" style="width:${Math.round(168 * k)}px;height:${Math.round(168 * k)}px">${svg}</div></div>`)
      .join(""))
  .join("");

const logo = "data:image/png;base64," + fs.readFileSync("public/logo.png").toString("base64");
const html = `<!doctype html><meta charset="utf-8"><title>Pasteables sneak peek</title>
<style>
*{box-sizing:border-box;margin:0}
html,body{width:1600px;height:900px;overflow:hidden}
body{font-family:"DM Sans","Helvetica Neue",Helvetica,Arial,sans-serif;color:#292724;background:#F6F4F0;background-image:radial-gradient(#E3DFD8 2px,transparent 2px);background-size:30px 30px;position:relative}
.brand{position:absolute;left:96px;top:72px;display:flex;align-items:center;gap:16px;font-size:34px;font-weight:600;letter-spacing:-.01em}
.brand img{width:60px;height:60px;border-radius:16px}
.txt{position:absolute;left:96px;top:236px;width:700px}
.tag{display:inline-block;font-size:26px;font-weight:600;background:#292724;color:#fff;border-radius:999px;padding:10px 26px;margin-bottom:34px}
h1{font-size:104px;line-height:1.02;font-weight:500;letter-spacing:-.04em}
.hl{display:inline-block;padding:0 .12em;margin-left:-.12em;background:linear-gradient(transparent 52%,#FFD84D 52%,#FFD84D 90%,transparent 90%)}
.sub{margin-top:34px;font-size:34px;line-height:1.35;color:#57524B;max-width:620px}
.sub b{color:#292724;font-weight:600}
.url{position:absolute;left:96px;bottom:70px;font-size:32px;font-weight:600;background:#fff;border-radius:999px;padding:16px 34px;box-shadow:0 8px 24px rgba(41,39,36,.1)}
.coll{position:absolute;left:830px;top:84px;width:700px;height:730px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:0}
.cell{display:flex;align-items:center;justify-content:center}
.st{width:168px;height:168px;filter:drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff) drop-shadow(0 8px 12px rgba(0,0,0,.22))}
.st svg{display:block;width:100%;height:100%}
</style>
<div class="brand"><img src="${logo}" alt="">Pasteables</div>
<div class="txt"><span class="tag">Sneak peek</span><h1>Cute vectors,<br><span class="hl">ready to paste</span></h1>
<p class="sub">6 sticker packs, <b>470+ stickers</b>. Tweak them, then copy as SVG, React or Flutter.</p></div>
<div class="url">pasteables.vercel.app</div>
<div class="coll">${cells}</div>`;
const out = "design/share/pasteables-sneak-peek";
fs.writeFileSync(`${out}.html`, html);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1600,900", `--screenshot=${path.resolve(out)}.png`, pathToFileURL(path.resolve(`${out}.html`)).href], { stdio: "ignore" });
console.log("wrote", `${out}.png`);
