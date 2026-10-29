// Proves the shared parts still reproduce the approved base exactly. run: node scripts/dumpling/reactions-check.mjs
import fs from "node:fs";
import { render } from "./character.mjs";
const base = fs.readFileSync("scripts/dumpling/base.svg", "utf8");
const mine = render();
if (base === mine) console.log("PASS: render() with defaults is byte-identical to base.svg");
else { console.log("FAIL: differs from base.svg"); const a = base.split("\n"), b = mine.split("\n"); a.forEach((l, i) => { if (l !== b[i]) console.log(i + 1, "\n base:", l, "\n mine:", b[i]); }); process.exit(1); }
