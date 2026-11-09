// Dumpling Buddy base character: a classic soup-dumpling shape. One continuous body, full and round at the bottom,
// narrowing to a gathered top with subtle pleats; tiny rounded arms that are part of the body's own outline; tiny feet.
// run: node scripts/dumpling/generate.mjs
import fs from "node:fs";
const INK = "#20040F", EYE = "#1E0612", DOUGH = "#F8E6BE";
const f = (n) => Math.round(n * 10) / 10;
const BODY = "M515 285C545 285 565 300 580 322C610 365 690 410 748 500C800 580 815 680 785 765C755 835 650 858 515 858C380 858 275 835 245 765C215 680 230 580 282 500C340 410 420 365 450 322C465 300 485 285 515 285Z";
// tiny rounded arms: short stubs that leave the lower-middle sides of the body (drawn as part of the body's outline)
const ARM_L = `<ellipse cx="226" cy="724" rx="46" ry="26" transform="rotate(-38 226 724)"/>`;
const ARM_R = `<ellipse cx="804" cy="724" rx="46" ry="26" transform="rotate(38 804 724)"/>`;
// subtle pleats gathering at the top
let creases = "";
for (let i = -3; i <= 3; i++) {
  const t = i / 3, long = i % 2 === 0;
  const ex = 515 + t * 142, ey = 452 + (long ? 56 : 8) - Math.abs(t) * 10;
  creases += `<path d="M515 314C${f(515 + t * 34)} 362 ${f(515 + t * 108)} 398 ${f(ex)} ${f(ey)}"/>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="115 188 800 800" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <defs><clipPath id="body"><path d="${BODY}"/></clipPath></defs>
  <!-- tiny feet -->
  <g fill="#F1D9A6" stroke="${INK}" stroke-width="11"><ellipse cx="432" cy="866" rx="38" ry="23"/><ellipse cx="598" cy="866" rx="38" ry="23"/></g>
  <!-- body and arms drawn as one shape: outline first, then fill, so there is a single continuous outline and no seam -->
  <g fill="${DOUGH}" stroke="${INK}" stroke-width="22"><path d="${BODY}"/>${ARM_L}${ARM_R}</g>
  <g fill="${DOUGH}"><path d="${BODY}"/>${ARM_L}${ARM_R}</g>
  <g clip-path="url(#body)">
    <path d="M200 740Q515 960 830 730V960H200Z" fill="#E5C48C" opacity=".72"/>
    <path d="M236 620Q232 780 360 850" stroke="#ECD19F" stroke-width="34" opacity=".6"/>
    <path d="M794 620Q798 780 670 850" stroke="#E2BD84" stroke-width="34" opacity=".65"/>
    <g stroke="#E6C58A" stroke-width="26" opacity=".4">${creases}</g>
    <g stroke="#CDA062" stroke-width="8">${creases}</g>
    <path d="M498 304Q515 290 534 304" stroke="#CDA062" stroke-width="8"/>
    <path d="M292 610Q284 530 336 462" stroke="#fff" stroke-width="16" opacity=".85"/>
    <circle cx="288" cy="656" r="8" fill="#fff" opacity=".9"/>
  </g>
  <!-- face -->
  <ellipse cx="346" cy="728" rx="40" ry="22" fill="#EE8383"/><ellipse cx="684" cy="728" rx="40" ry="22" fill="#EE8383"/>
  <ellipse cx="408" cy="676" rx="32" ry="44" fill="${EYE}"/><ellipse cx="622" cy="676" rx="32" ry="44" fill="${EYE}"/>
  <circle cx="417" cy="660" r="10.5" fill="#fff"/><circle cx="613" cy="660" r="10.5" fill="#fff"/>
  <path d="M485 722Q515 752 545 722" stroke="${EYE}" stroke-width="9"/>
</svg>
`;
fs.writeFileSync("scripts/dumpling/base.svg", svg);
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/dumpling.svg", svg);
fs.writeFileSync(dir + "/dumpling.html", `<body style="margin:20px;background:#fffdf9"><img src="dumpling.svg?t=${Date.now()}" width="480"> <img src="dumpling.svg?t=${Date.now()}" width="64"> <img src="dumpling.svg?t=${Date.now()}" width="32">`);
console.log("ok", svg.length);
