// Review sheet: every icon in Line / Solid / Duotone on light and dark. run: node scripts/icons/contact-sheet.mjs [category-id]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), "sheet-"));
const compile = (f) => ts.transpileModule(fs.readFileSync(f, "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
fs.writeFileSync(`${tmp}/corners.mjs`, compile("lib/icons/corners.ts"));
fs.writeFileSync(`${tmp}/render.mjs`, compile("lib/icons/render.ts").replace('"./corners"', '"./corners.mjs"'));
const { iconMarkup } = await import(pathToFileURL(`${tmp}/render.mjs`).href);
const lib = JSON.parse(fs.readFileSync("data/icons.json", "utf8"));
const only = process.argv[2];
const RAD = process.env.RADIUS === undefined ? undefined : Number(process.env.RADIUS);
const cell = (ic, st, size) => `<div class="c" title="${ic.n}">${iconMarkup(ic, st, size, RAD)}</div>`;
const sections = lib.categories.filter((c) => !only || c.id === only).map((c) => {
  const rows = lib.icons.filter((i) => i.c === c.id).map((ic) => `<div class="r"><b>${ic.n}</b>${["line", "solid", "duotone"].map((s) => cell(ic, s, 44)).join("")}${process.env.DARK ? `<span class="d">${["line", "solid", "duotone"].map((s) => cell(ic, s, 44)).join("")}</span>` : ""}</div>`).join("");
  return `<h2>${c.name}</h2><div class="g">${rows}</div>`;
}).join("");
const html = `<!doctype html><meta charset="utf-8"><title>Icons review</title><style>
body{margin:0;padding:12px;font:12px system-ui;background:#fff;color:#222}h2{margin:26px 0 10px;font-size:18px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:8px}.r{display:flex;align-items:center;gap:6px;border:1px solid #eee;border-radius:10px;padding:6px 8px}
.r b{width:84px;font-weight:500;font-size:11px;line-height:1.2}.c{width:48px;height:48px;display:grid;place-items:center}.d{display:flex;gap:6px;background:#111;color:#fff;border-radius:8px;padding:2px 4px;margin-left:auto}
</style>${sections}`;
fs.writeFileSync((process.env.TMPDIR || "/tmp") + "/sheet/icons-review.html", html);
console.log("ok");
