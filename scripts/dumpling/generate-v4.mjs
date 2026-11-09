// Dumpling Buddy base character. Its own construction: one soft squat bao body, scalloped pleats gathering into a twisted knot,
// dough-flap hands tucked behind the body and feet that are lobes of the body outline itself.   run: node scripts/dumpling/generate.mjs
import fs from "node:fs";
const INK = "#20040F", EYE = "#1E0612", SW = 11;
const CX = 515, CY = 610, A = 306, BT = 292, BB = 232, N = 2.5;
const f = (n) => Math.round(n * 10) / 10;
const sgn = (v) => (v < 0 ? -1 : 1);
// body outline: a squished superellipse with scalloped shoulders and two foot lobes
const pts = [];
for (let i = 0; i < 360; i++) {
  const ph = (i / 360) * Math.PI * 2;
  const c = Math.cos(ph), s = Math.sin(ph);
  let x = CX + A * sgn(c) * Math.abs(c) ** (2 / N);
  const B = s < 0 ? BT : BB;
  let y = CY + B * sgn(s) * Math.abs(s) ** (2 / N);
  const u = ph + Math.PI / 2; // 0 at the top
  const uu = ((u + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (Math.abs(uu) < 1.32) {
    const win = Math.cos((uu * Math.PI) / 2.64) ** 2;
    const k = 1 + 0.03 * win * (0.5 + 0.5 * Math.cos(uu * 9.6));
    x = CX + (x - CX) * k;
    y = CY + (y - CY) * k;
  }
  if (s > 0) y += 44 * Math.exp(-(((x - 420) / 52) ** 4)) + 44 * Math.exp(-(((x - 610) / 52) ** 4)); // feet lobes (flat-topped bumps so they stay round, not pointy)
  pts.push([x, y]);
}
const BODY = "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
// pleats: creases fan out of the knot and wrap the dome
const KX = 515, KY = 352;
let creases = "", shade = "";
for (let i = -3; i <= 3; i++) {
  const t = i / 3, long = i % 2 === 0;
  const ex = KX + t * 232, ey = 468 + (long ? 66 : 10) - Math.abs(t) * 8;
  const d = `M${KX} ${KY}C${f(KX + t * 70)} ${KY + 86} ${f(ex - t * 22)} ${f(ey - 74)} ${f(ex)} ${f(ey)}`;
  creases += `<path d="${d}"/>`;
  shade += `<path d="${d}"/>`;
}
const flap = `M0 0C-46 -8 -82 22 -72 62C-64 96 -22 102 8 74Z`; // a rounded dough flap, root at (0,0)
const hand = (x, y, rot, mirror) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${mirror ? -1 : 1} 1)"><path d="${flap}" fill="#F2DBA8" stroke="${INK}" stroke-width="${SW}"/><path d="M-48 28Q-38 52 -40 74" stroke="#C48E48" stroke-width="8"/></g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="115 173 800 800" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <defs><clipPath id="body"><path d="${BODY}"/></clipPath></defs>
  <!-- twisted knot where the pleats gather -->
  <g transform="rotate(-8 515 300)"><ellipse cx="515" cy="300" rx="50" ry="34" fill="#F8E6BE" stroke="${INK}" stroke-width="${SW}"/><path d="M482 296Q500 278 524 288Q540 296 530 310" stroke="#CC9A5C" stroke-width="8"/></g>
  <!-- dough-flap hands, tucked behind the body -->
  ${hand(236, 742, -30, false)}
  ${hand(794, 742, -30, true)}
  <!-- soft bao body -->
  <path d="${BODY}" fill="#F8E6BE"/>
  <g clip-path="url(#body)">
    <path d="M170 700Q515 940 860 690V960H170Z" fill="#E5C48C" opacity=".72"/>
    <path d="M196 600Q210 780 330 850" stroke="#ECD19F" stroke-width="34" opacity=".6"/>
    <path d="M834 600Q820 780 700 850" stroke="#E2BD84" stroke-width="34" opacity=".65"/>
    <g stroke="#E6C58A" stroke-width="34" opacity=".42">${shade}</g>
    <g stroke="#C48E48" stroke-width="10">${creases}</g>
    <path d="M262 560Q258 470 318 408" stroke="#fff" stroke-width="16" opacity=".85"/>
    <circle cx="276" cy="610" r="8" fill="#fff" opacity=".9"/>
  </g>
  <path d="${BODY}" stroke="${INK}" stroke-width="${SW}"/>
  <!-- face: small, wide-set eyes low on the belly, a tiny smile and generous blush -->
  <ellipse cx="338" cy="712" rx="40" ry="22" fill="#EE8383"/><ellipse cx="692" cy="712" rx="40" ry="22" fill="#EE8383"/>
  <ellipse cx="400" cy="660" rx="31" ry="42" fill="${EYE}"/><ellipse cx="630" cy="660" rx="31" ry="42" fill="${EYE}"/>
  <circle cx="409" cy="645" r="10.5" fill="#fff"/><circle cx="621" cy="645" r="10.5" fill="#fff"/>
  <path d="M483 704Q515 736 547 704" stroke="${EYE}" stroke-width="9"/>
</svg>
`;
fs.writeFileSync("scripts/dumpling/base.svg", svg);
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/dumpling.svg", svg);
fs.writeFileSync(dir + "/dumpling.html", `<body style="margin:20px;background:#fffdf9"><img src="dumpling.svg" width="480"> <img src="dumpling.svg" width="64"> <img src="dumpling.svg" width="32">`);
console.log("ok", svg.length);
