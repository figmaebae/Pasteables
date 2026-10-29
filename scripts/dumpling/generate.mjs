// Dumpling Buddy base character, following the approved reference sheet: a wide, soft bun-shaped body with a short neck and
// three rounded pleat folds on top, big glossy eyes, a tiny "w" mouth, slanted blush marks, tiny round hands and short legs.
// run: node scripts/dumpling/generate.mjs   ->  scripts/dumpling/base.svg
import fs from "node:fs";
const INK = "#4A2418", DOUGH = "#FCE6C6", HAND = "#FCE6C6", EYE = "#3A1D14", SW = 4.6;
// one continuous body: three folds on a short neck, wide shoulders, plump lower half, smooth round bottom
const BODY =
  "M135 176Q156 126 178 160Q199 126 221 160Q242 126 264 176" +
  "C270 198 300 206 330 240C366 282 374 346 340 386C310 420 252 428 200 428C148 428 90 420 60 386C26 346 34 282 70 240C100 210 128 200 135 176Z";
// small rounded mitten hands, tucked behind the lower sides of the body (placement copied from the reference): the body overlaps the inner edge
const MITTEN = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="24.5" ry="22" transform="rotate(${rot} ${x} ${y})"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 122 392 346" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Dumpling Buddy">
  <defs><clipPath id="dumpling-body"><path d="${BODY}"/></clipPath></defs>
  <!-- short legs (behind the body) -->
  <g id="legs" fill="${HAND}" stroke="${INK}" stroke-width="${SW}">
    <rect x="130" y="414" width="46" height="42" rx="19"/>
    <rect x="223" y="414" width="46" height="42" rx="19"/>
  </g>
  <!-- hands: behind the body, most of each mitten shows outside the outline -->
  <g id="hands" fill="${HAND}" stroke="${INK}" stroke-width="${SW}">${MITTEN(37, 373, -12)}${MITTEN(363, 371, 12)}</g>
  <!-- body -->
  <g id="body">
    <path d="${BODY}" fill="${DOUGH}"/>
    <g clip-path="url(#dumpling-body)">
      <path d="M26 352Q200 468 380 328V470H26Z" fill="#F1C48C" opacity=".5"/>
      <path d="M338 300Q350 352 318 398" stroke="#F1C48C" stroke-width="20" opacity=".45"/>
    </g>
    <path d="${BODY}" stroke="${INK}" stroke-width="${SW}"/>
    <path d="M96 216L108 208" stroke="${DOUGH}" stroke-width="7"/>
  </g>
  <!-- face -->
  <g id="face">
    <ellipse cx="135" cy="293" rx="22" ry="23.5" fill="${EYE}"/><ellipse cx="262" cy="291" rx="22" ry="23.5" fill="${EYE}"/>
    <circle cx="144" cy="284" r="8" fill="#fff"/><circle cx="271" cy="282" r="8" fill="#fff"/>
    <circle cx="127" cy="303" r="3.5" fill="#fff"/><circle cx="254" cy="301" r="3.5" fill="#fff"/>
    <path d="M176 318Q186 334 197 320Q208 334 220 318" stroke="${INK}" stroke-width="4.4"/>
    <g stroke="#F0647A" stroke-width="5">
      <path d="M78 330L89 314M91 333L102 317M104 335L115 319"/>
      <path d="M287 328L298 312M300 331L311 315M313 333L324 317"/>
    </g>
  </g>
</svg>
`;
fs.writeFileSync("scripts/dumpling/base.svg", svg);
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/dumpling.svg", svg);
fs.writeFileSync(dir + "/dumpling.html", `<body style="margin:20px;background:#fffdf9"><img src="dumpling.svg?t=${Date.now()}" width="480"> <img src="dumpling.svg?t=${Date.now()}" width="64"> <img src="dumpling.svg?t=${Date.now()}" width="32">`);
console.log("ok", svg.length);
