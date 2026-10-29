// Gives the Mushroom pack the same Style / Ink controls as the others: an outlined version of every sticker, and the colors that follow the Ink option.
// Run after the mushroom gallery is (re)generated. Idempotent. run: node scripts/mushroom/add-outlined.mjs
import fs from "node:fs";

const FILE = "data/gallery-mushroom.json";
const g = JSON.parse(fs.readFileSync(FILE, "utf8"));
const INK = "#20040F";

// white mushroom, same ink line: no shading, no gradient, spots drawn as outlined dots
const lineArt = (svg) =>
  svg
    .replace(/<g clip-path="url\(#\w+b\)">[\s\S]*?<\/g>/, "")
    .replace(/(<g clip-path="url\(#\w+c\)">)[\s\S]*?<g fill="#fff">([\s\S]*?)<\/g><\/g>/, `$1<g fill="#fff" stroke="${INK}" stroke-width="20" data-bs="1">$2</g></g>`)
    .replace(/url\(#\w+g\)/g, "#FFFFFF")
    .replace(/#(?:E9DABB|F1E5CB|EBDDBF)/g, "#FFFFFF");

for (const s of g.sections) for (const t of s.tiles) t.alt = lineArt(t.svg);
g.inkFrom = [INK, "#1E0612"];
fs.writeFileSync(FILE, JSON.stringify(g));
console.log("mushroom: outlined versions for", g.sections.reduce((n, s) => n + s.tiles.length, 0), "stickers");
