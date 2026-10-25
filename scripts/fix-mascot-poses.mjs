// Round-3 Mascot pose fixes: hats that sit on the head, real walking/running legs, beds, a
// proper mic, handshake/companion characters, and a few props. Edits existing tiles in place
// where the art is fine and redraws the ones that need a new composition. Idempotent only on
// the original art, so run it once after the other fix-mascot-*.mjs scripts.
import fs from "node:fs";
const p = "data/gallery-mascot.json";
const g = JSON.parse(fs.readFileSync(p, "utf8"));
const INK = "#2B2430", SKIN = "#FF8552";

/* ---------- shared pieces ---------- */
const limb = (d, hx, hy) =>
  `<path d="${d}" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" stroke-linejoin="round" fill="none" data-ow="1"/>` +
  `<circle cx="${hx}" cy="${hy}" r="11.3" fill="${INK}" data-ow="1"/>` +
  `<path d="${d}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<circle cx="${hx}" cy="${hy}" r="8.5" fill="#FFFFFF"/>`;
const limbK = (d, hx, hy, k) =>
  `<path d="${d}" stroke="${INK}" stroke-width="${+(13.6 * k).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" fill="none" data-ow="1"/>` +
  `<circle cx="${hx}" cy="${hy}" r="${+(11.3 * k).toFixed(1)}" fill="${INK}" data-ow="1"/>` +
  `<path d="${d}" stroke="#FFFFFF" stroke-width="${+(8 * k).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<circle cx="${hx}" cy="${hy}" r="${+(8.5 * k).toFixed(1)}" fill="#FFFFFF"/>`;
const patch = (x, y, c = SKIN) => `<path data-jp="1" d="M${x - 9} ${y}a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z" fill="${c}"/>`;
// arm that ends in an open palm with fingers (same hand the Waving pose uses)
const handT = (x, y, r) => `transform="translate(${x} ${y}) rotate(${r})"`;
const FING = [["-3.5 -6.1", "-11.5 -19.9"], ["-1.2 -6.9", "-4.5 -25.6"], ["1.2 -6.9", "4.5 -25.6"], ["3.5 -6.1", "11.5 -19.9"]];
const armOpen = (d, x, y, r, c = SKIN) => {
  const t = handT(x, y, r);
  const ow = `<circle cx="0" cy="0" r="11.8" fill="${INK}" data-ow="1" ${t}/>` +
    FING.map(([a, b]) => `<path d="M${a}L${b}" stroke="${INK}" stroke-width="10.2" stroke-linecap="round" stroke-linejoin="round" fill="none" data-ow="1" ${t}/>`).join("") +
    `<path d="M-6 -1L-18 -9" stroke="${INK}" stroke-width="10.4" stroke-linecap="round" stroke-linejoin="round" fill="none" data-ow="1" ${t}/>`;
  const wh = `<circle cx="0" cy="0" r="9" fill="#FFFFFF" ${t}/>` +
    FING.map(([a, b]) => `<path d="M${a}L${b}" stroke="#FFFFFF" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" fill="none" ${t}/>`).join("") +
    `<path d="M-6 -1L-18 -9" stroke="#FFFFFF" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" fill="none" ${t}/>`;
  return `<path d="${d}" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" stroke-linejoin="round" fill="none" data-ow="1"/>${ow}<path d="${d}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${wh}`;
};
const legsStd = `<path d="M89 190V264H76Q70 264 70 270Q70 276 76 276H108Q111 276 111 270V190" fill="#FFFFFF" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M151 190V264H164Q170 264 170 270Q170 276 164 276H132Q129 276 129 270V190" fill="#FFFFFF" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`;
const bodyG = (c = SKIN, id = true) =>
  `<g${id ? ' id="Body"' : ""}><g fill="${c}"><circle cx="100" cy="70" r="13"/><circle cx="121" cy="60" r="16"/><circle cx="142" cy="68" r="13"/><path d="M80 196C68 156 66 108 84 86C96 70 144 70 156 86C174 108 172 156 160 196C148 205 92 205 80 196Z"/></g><path d="M84 104Q82 120 86 140" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M112 56Q118 52 126 55" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" fill="none"/></g>`;
const cheeks = `<ellipse cx="88" cy="138" rx="9" ry="5.8" fill="#FF5D73" fill-opacity=".42"/><ellipse cx="152" cy="138" rx="9" ry="5.8" fill="#FF5D73" fill-opacity=".42"/>`;
const arcsUp = `<g id="Eyes"><path d="M92 124Q102 111 112 124M128 124Q138 111 148 124" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" fill="none"/></g>`;
const arcsDown = `<g id="Eyes"><path d="M92 120Q102 131 112 120M128 120Q138 131 148 120" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" fill="none"/></g>`;
const FACE = {
  happy: `<g id="Face">${cheeks}${arcsUp}<g id="Mouth"><path d="M109 138H131Q131 156 120 156Q109 156 109 138Z" fill="#FF5D73" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="120" cy="151" rx="6" ry="3.6" fill="#FF9FB0"/></g></g>`,
  calm: `<g id="Face">${cheeks}${arcsDown}<g id="Mouth"><path d="M112 142Q120 149 128 142" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" fill="none"/></g></g>`,
  sleep: `<g id="Face">${cheeks}${arcsDown}<g id="Mouth"><ellipse cx="120" cy="146" rx="4.5" ry="5.5" fill="#7A2E45" stroke="${INK}" stroke-width="2.4"/></g></g>`,
};
const noIds = (s) => s.replace(/ id="(Legs|Body|Face|Eyes|Mouth|Arms)"/g, "");
const mini = (color, cx, s, { skip = "", up = false, mood = "happy" } = {}) => {
  const L = up ? "M80 132Q72 104 78 82" : "M80 132Q62 160 68 188";
  const R = up ? "M160 132Q168 104 162 82" : "M160 132Q178 160 172 188";
  const [lx, ly] = up ? [78, 80] : [68, 190];
  const [rx, ry] = up ? [162, 80] : [172, 190];
  return `<g transform="translate(${+(cx - 120 * s).toFixed(1)} ${+(276 - 276 * s).toFixed(1)}) scale(${s})">` +
    noIds(`<g>${legsStd}</g>` + bodyG(color, false) + FACE[mood]) +
    (skip === "L" ? "" : limb(L, lx, ly) + patch(80, 132, color)) +
    (skip === "R" ? "" : limb(R, rx, ry) + patch(160, 132, color)) + `</g>`;
};
const svgWrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" width="240" height="300" fill="none">${inner}</svg>`;
const star = (x, y, c = "#FFC83D", k = 5) => `<path d="M${x} ${y - k}Q${x} ${y} ${x + k} ${y}Q${x} ${y} ${x} ${y + k}Q${x} ${y} ${x - k} ${y}Q${x} ${y} ${x} ${y - k}Z" fill="${c}"/>`;
const conf = [["#FF6B6B", 0], ["#62D2A2", 1], ["#7CC4FF", 2], ["#FFD84D", 3], ["#FF8FA3", 4], ["#A58BFA", 5]];

/* ---------- hats that actually sit on the head (hair tufts reach y≈44, hairline y≈88) ---------- */
const HAT = {
  mortar: () =>
    `<path d="M80 90C80 24 160 24 160 90Q120 100 80 90Z" fill="#2A3350" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` +
    `<path d="M62 46L120 26L178 46L120 66Z" fill="#2A3350" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` +
    `<path d="M120 46L160 50L166 74" fill="none" stroke="#FFB000" stroke-width="2.6" stroke-linecap="round"/>` +
    `<circle cx="166" cy="77" r="3.8" fill="#FFB000" stroke="${INK}" stroke-width="1.6"/><circle cx="120" cy="46" r="3" fill="#FFB000"/>`,
  straw: () =>
    `<path d="M82 88C78 26 162 26 158 88Z" fill="#F2D27A" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` +
    `<path d="M81 76Q120 84 159 76" fill="none" stroke="#FF6B6B" stroke-width="5" stroke-linecap="round"/>` +
    `<ellipse cx="120" cy="90" rx="58" ry="9" fill="#F2D27A" stroke="${INK}" stroke-width="2.8"/>`,
  beret: () =>
    `<path d="M76 88C66 50 98 32 128 34C160 36 172 62 164 88C142 98 98 98 76 88Z" fill="#7C1F3A" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` +
    `<path d="M128 34V25" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M86 82Q120 94 156 82" fill="none" stroke="#A8324F" stroke-width="3" stroke-linecap="round"/>`,
  detective: () =>
    `<path d="M80 90C78 28 162 28 160 90Q120 82 80 90Z" fill="#A8825A" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` +
    `<path d="M120 36V58M96 44Q104 56 110 90M144 44Q136 56 130 90" fill="none" stroke="#7C5C3A" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M70 92Q120 106 170 92" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M72 91Q120 103 168 91Q120 96 72 91Z" fill="#8A6A44" stroke="${INK}" stroke-width="2"/>`,
};

/* ---------- string surgery ---------- */
const grp = (svg, id) => {
  const a = svg.indexOf(`<g id="${id}">`);
  if (a < 0) return null;
  const re = /<g\b|<\/g>/g; re.lastIndex = a; let d = 0, m;
  while ((m = re.exec(svg))) { if (m[0] === "</g>") { d--; if (!d) return [a, re.lastIndex]; } else d++; }
  return null;
};
const setGroup = (svg, id, inner) => { const r = grp(svg, id); return svg.slice(0, r[0]) + `<g id="${id}">${inner}</g>` + svg.slice(r[1]); };
const rm = (svg, re) => svg.replace(re, "");
const pathEl = (d) => new RegExp(`<path d="${d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"]*"[^>]*\\/>`);
const addExtras = (svg, str) => svg.replace(/<\/g><\/svg>$/, `${str}</g></svg>`);
const beforeArms = (svg, str) => svg.replace('<g id="Arms">', `${str}<g id="Arms">`);

/* ---------- legs ---------- */
const stroke = (pts, w, c) => `<path d="M${pts.map((q) => q.join(" ")).join("L")}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const ow = (x) => x.replace("<path ", '<path data-ow="1" '); // outline stroke: the Stroke control thins it without eating the fill
const leg = (pts) => ow(stroke(pts, 25.2, INK)) + stroke(pts, 18.8, "#FFFFFF");
const LEGS = {
  walk: leg([[108, 186], [92, 222], [76, 254], [94, 262]]) + leg([[132, 186], [150, 224], [160, 263], [182, 263]]),
  run: leg([[108, 188], [88, 222], [56, 236], [70, 250]]) + leg([[132, 188], [162, 216], [158, 252], [180, 258]]),
  jog: leg([[108, 188], [94, 224], [70, 246], [86, 258]]) + leg([[132, 188], [152, 222], [152, 256], [174, 262]]),
};

const E = {}; // tile name -> transform(svg) => svg

/* ---------- hands & gestures ---------- */
E["Thumbs Down"] = (s) => setGroup(s, "Arms",
  limb("M80 132Q62 160 68 188", 68, 195) + patch(80, 132) +
  `<path d="M160 132Q180 126 194 140" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" fill="none" data-ow="1"/>` +
  `<path d="M206 150L206 166" stroke="${INK}" stroke-width="18" stroke-linecap="round" data-ow="1"/><circle cx="202" cy="142" r="15.5" fill="${INK}" data-ow="1"/>` +
  `<path d="M160 132Q180 126 194 140" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>` + patch(160, 132) +
  `<path d="M206 150L206 164" stroke="#FFFFFF" stroke-width="11.6" stroke-linecap="round"/><circle cx="202" cy="142" r="12.3" fill="#FFFFFF"/>` +
  `<path d="M193 136Q202 132 211 136M193 144Q202 140 211 144" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`);
E["Saluting"] = (s) => setGroup(s, "Arms",
  limb("M80 132Q62 160 68 188", 68, 195) + patch(80, 132) +
  armOpen("M160 132L196 110L152 90L140 88", 134, 86, -78) + patch(160, 132));
E["Celebrating Launch"] = (s) => {
  const a = grp(s, "Arms"); const inner = s.slice(a[0] + '<g id="Arms">'.length, a[1] - 5);
  // swap the plain right hand circle for an open palm
  const right = inner.replace(/<path d="M160 132L184 94"[\s\S]*$/, "");
  return setGroup(s, "Arms", right + armOpen("M160 132L184 94", 186, 88, 14) + patch(160, 132));
};
E["Making Decision"] = (s) => s.replace("M18 182H44M36 174L44 182L36 190", "M20 183L29 191L43 175");

/* ---------- hats ---------- */
const swapHat = (re, hat, where = "end") => (s) => addExtras(re.reduce((x, r) => rm(x, r), s), hat);
E["Learning Online"] = swapHat([pathEl("M170 44L199 34L228 44L199 54Z"), pathEl("M226 45V58")], HAT.mortar());
const gradFix = (s) => {
  let x = s.replace(/(<g id="Extras">)[\s\S]*?(<g transform="translate\(184 86\) rotate\(25\)">)/, "$1$2");
  return x.replace('<g id="Extras">', `<g id="Extras">${HAT.mortar()}`);
};
const gradHand = (s) => {
  let x = gradFix(s);
  const m = x.match(/<g transform="translate\(184 86\) rotate\(25\)">[\s\S]*?<\/g>/)[0];
  x = x.replace(m, ""); const m2 = m.replace("translate(184 86) rotate(25)", "translate(194 96) rotate(62)");
  x = x.replace('<g id="Arms">', `${m2}<g id="Arms">`);
  const a = grp(x, "Arms"), inner = x.slice(a[0] + '<g id="Arms">'.length, a[1] - 5);
  const left = inner.replace(/<path d="M160 132Q186 128 184 104"[\s\S]*$/, "");
  return setGroup(x, "Arms", left + armOpen("M160 132Q186 128 184 106", 184, 98, 18) + patch(160, 132));
};
E["Graduating"] = gradHand; E["Graduation"] = gradHand;
E["Gardening"] = swapHat([/<ellipse cx="120" cy="86" rx="52"[^>]*\/>/, pathEl("M86 86C86 62 154 62 154 86"), pathEl("M88 80H152")], HAT.straw());
E["Painting"] = swapHat([pathEl("M82 76C88 56 152 56 158 76"), pathEl("M120 60V52")], HAT.beret());
E["Investigating"] = swapHat([pathEl("M82 86Q120 40 158 86"), pathEl("M76 88Q120 98 164 88")], HAT.detective());
E["Swimming"] = (s) => {
  let x = rm(s, pathEl("M84 84C84 52 156 52 156 84Z"));
  x = x.replace('<path d="M100 62Q120 56 140 62M92 72Q120 64 148 72"', "<path d=\"M96 50Q120 40 144 50M88 66Q120 54 152 66\"");
  x = x.replace(/<path d="M26 204Q52 190[^>]*\/>/, `<path d="M0 204Q30 192 60 204T120 204T180 204T240 204V284H0Z" fill="#7CC4FF" fill-opacity=".93" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M12 224Q40 216 68 224T124 224" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round" fill="none"/>`);
  // swim cap (new, covers the hair), drawn before goggles
  return x.replace('<g id="Extras">', `<g id="Extras"><path d="M80 90C78 30 162 30 160 90Z" fill="#FF6B6B" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`);
};

/* ---------- legs: walking / running / jogging ---------- */
const swapLegs = (k) => (s) => setGroup(s, "Legs", LEGS[k]);
E["Walking"] = swapLegs("walk"); E["Running"] = swapLegs("run"); E["Jogging"] = swapLegs("jog");

/* ---------- props ---------- */
E["Singing"] = (s) => {
  let x = [pathEl("M190 132L204 108")].reduce((a, r) => rm(a, r), s);
  x = rm(x, /<circle cx="190" cy="126" r="12"[^>]*\/>/); x = rm(x, /<circle cx="(186|192)" cy="(122|128|130)" r="1\.2"[^>]*\/>/g);
  const mic =
    `<path d="M182 148L158 154" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M182 148L158 154" stroke="#4A4458" stroke-width="5.6" stroke-linecap="round"/>` +
    `<circle cx="146" cy="157" r="13.5" fill="#C4CCDB" stroke="${INK}" stroke-width="2.8"/><path d="M137 151Q146 147 155 151M135 158H157M137 165Q146 169 155 165M146 144V170" stroke="${INK}" stroke-opacity=".55" stroke-width="1.6" fill="none"/>` +
    `<path d="M156 147Q164 148 166 154" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  return addExtras(x, mic);
};

/* ---------- Walking tile in Fitness & health is removed; counts updated below ---------- */

/* ---------- full rebuilds ---------- */
E["Handshake"] = () => {
  const s = 0.78;
  const shoulderMain = [101, 164], shoulderFriend = [139, 164];
  return svgWrap(
    mini(SKIN, 76, s, { skip: "R" }) + mini("#7CC4FF", 164, s, { skip: "L" }) +
      `<path d="M107 164Q112 184 120 188" stroke="${INK}" stroke-width="10.6" stroke-linecap="round" fill="none"/><path d="M107 164Q112 184 120 188" stroke="#fff" stroke-width="6.2" stroke-linecap="round" fill="none"/><circle cx="107" cy="164" r="7" fill="${SKIN}"/>` +
      `<path d="M133 164Q128 184 120 188" stroke="${INK}" stroke-width="10.6" stroke-linecap="round" fill="none"/><path d="M133 164Q128 184 120 188" stroke="#fff" stroke-width="6.2" stroke-linecap="round" fill="none"/><circle cx="133" cy="164" r="7" fill="#7CC4FF"/>` +
      `<circle cx="117" cy="190" r="10.5" fill="${INK}"/><circle cx="123" cy="190" r="10.5" fill="${INK}"/><circle cx="117" cy="190" r="8" fill="#fff"/><circle cx="123" cy="190" r="8" fill="#fff"/><path d="M120 184V196" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M104 182l-6 -3M136 182l6 -3M120 174V166" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>` +
      "",
  );
};
E["Taking Notes"] = (s0) => {
  let s = setGroup(s0, "Arms",
    limb("M80 132Q56 156 78 200", 80, 202) + patch(80, 132) +
    `<path d="M160 132Q184 154 142 180" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" fill="none" data-ow="1"/>` +
    `<circle cx="140" cy="182" r="11.3" fill="${INK}" data-ow="1"/>` +
    `<path d="M160 132Q184 154 142 180" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>` + patch(160, 132) + `<circle cx="140" cy="182" r="8.5" fill="#FFFFFF"/>`);
  const pad =
    `<rect x="76" y="150" width="56" height="62" rx="5" fill="#FFF2A8" stroke="${INK}" stroke-width="2.8"/>` +
    `<path d="M84 168H122M84 180H122M84 192H104" stroke="#E0C65C" stroke-width="2.4" stroke-linecap="round"/>` +
    [88, 104, 120].map((x) => `<circle cx="${x}" cy="150" r="3" fill="#C4CCDB" stroke="${INK}" stroke-width="2"/>`).join("");
  s = beforeArms(setGroup(s, "Extras", ""), "");
  // pad sits behind the hands; pen is held between thumb and fingers with its tip on the page
  const penG = `<g transform="translate(140 182) rotate(38)"><rect x="-3.4" y="-30" width="6.8" height="30" rx="2" fill="#5B6CFF" stroke="${INK}" stroke-width="2.2"/><path d="M-3.4 0L0 10L3.4 0Z" fill="#FFE3B8" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/></g>`;
  s = s.replace('<g id="Arms">', `${pad}<g id="Arms">`);
  return s.replace('<g id="Extras"></g>', `<g id="Extras">${penG}<circle cx="140" cy="182" r="8.5" fill="#FFFFFF"/><path d="M96 196Q102 188 108 196T120 196" stroke="#5B6CFF" stroke-width="2.4" stroke-linecap="round" fill="none"/></g>`);
};
E["Practicing Skills"] = (s0) => {
  let s = setGroup(s0, "Arms",
    limb("M80 132Q60 150 66 172", 66, 174) + patch(80, 132) + limb("M160 132Q184 138 184 158", 184, 160) + patch(160, 132));
  const card =
    `<rect x="18" y="140" width="50" height="46" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="2.8"/>` +
    `<rect x="26" y="168" width="8" height="12" rx="1.5" fill="#7CC4FF"/><rect x="38" y="158" width="8" height="22" rx="1.5" fill="#62D2A2"/><rect x="50" y="148" width="8" height="32" rx="1.5" fill="#FFB000"/>` +
    `<path d="M26 160L38 152L48 156L60 144" stroke="#FF6B6B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  s = s.replace('<g id="Arms">', `${card}<g id="Arms">`);
  const ex =
    `<circle cx="204" cy="108" r="26" fill="#FFFFFF" stroke="${INK}" stroke-width="2.8"/><circle cx="204" cy="108" r="18" fill="#FF6B6B" stroke="${INK}" stroke-width="2"/><circle cx="204" cy="108" r="10" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/><circle cx="204" cy="108" r="4" fill="#FF6B6B"/>` +
    `<path d="M196 132L188 168M212 132L220 168" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>` +
    // arrow lodged in the bullseye, tail pointing back at the player
    `<path d="M204 108L178 140" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M178 140L172 138L176 146ZM182 134L176 132L180 140Z" fill="#FF8FA3" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>` +
    star(170, 96) + star(236, 70, "#FF8FA3", 4) + star(150, 60, "#62D2A2", 4) + `<path d="M30 112L38 104M44 100L46 92M22 126L14 122" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
  return setGroup(s, "Extras", ex);
};
E["Watching TV"] = (s) => {
  const ex = grp(s, "Extras"); const exStr = s.slice(ex[0], ex[1]);
  const cut = exStr.indexOf('<rect x="30" y="166"');
  const tv = exStr.slice('<g id="Extras">'.length, cut), pop = exStr.slice(cut, exStr.length - 4);
  const a = s.indexOf('<g id="Legs">');
  const chars = s.slice(a, ex[0]);
  const sx = 0.88;
  return s.slice(0, a) +
    `<g transform="translate(6 33.1) scale(${sx})">${chars}${pop}</g>` +
    `<path d="M168 236H238" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M176 238V276M230 238V276" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    `<g transform="translate(79.5 91.5) scale(.67)">${tv}</g>` + `</svg>`;
};
E["Popping Confetti"] = (s0) => {
  let s = setGroup(s0, "Arms", limb("M80 132Q62 160 68 188", 68, 195) + patch(80, 132) + limb("M160 132Q178 136 176 148", 176, 150) + patch(160, 132));
  const ux = 0.57, uy = -0.82; // popper axis
  const popper = `<g transform="translate(176 150) rotate(35)"><path d="M-4 0L4 0L13 -40L-13 -40Z" fill="#FF8FA3" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/><path d="M-9 -24L9 -24M-11 -32L11 -32" stroke="#fff" stroke-width="2"/><ellipse cx="0" cy="-40" rx="13" ry="4" fill="#FFD84D" stroke="${INK}" stroke-width="2.4"/></g>`;
  const mx = 176 + ux * 40, my = 150 + uy * 40; // mouth of the popper
  let burst = "";
  const rays = [-48, -36, -24, -12, 0, 12, 24];
  rays.forEach((deg, i) => {
    const a = (deg * Math.PI) / 180, dx = ux * Math.cos(a) - uy * Math.sin(a), dy = ux * Math.sin(a) + uy * Math.cos(a);
    [14, 28, 44].forEach((dist, j) => {
      const [c] = conf[(i + j) % conf.length]; const x = +(mx + dx * dist).toFixed(1), y = +(my + dy * dist + (j === 2 ? 6 : 0)).toFixed(1);
      burst += (i + j) % 3 === 0 ? `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`
        : (i + j) % 3 === 1 ? `<rect x="${x - 3}" y="${y - 1.7}" width="6" height="3.4" rx="1" fill="${c}" transform="rotate(${Math.round(deg * 2 + j * 40)} ${x} ${y})"/>`
        : `<path d="M${x - 4} ${y}q2 -4 4 0t4 0" stroke="${c}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
    });
  });
  return setGroup(s, "Extras", popper + burst + star(40, 90) + star(34, 130, "#FF8FA3", 4));
};
E["Team Success"] = () => {
  const main =
    `<g id="Legs">${legsStd}</g>${bodyG()}${FACE.happy}<g id="Arms">${armOpen("M80 132Q56 110 52 80", 52, 76, -10)}${patch(80, 132)}${armOpen("M160 132Q184 110 188 80", 188, 76, 10)}${patch(160, 132)}</g>`;
  return svgWrap(
    mini(SKIN, 40, 0.68, { up: true }) + mini(SKIN, 200, 0.68, { up: true }) + main +
      [[196, 50, "#FF6B6B"], [214, 62, "#62D2A2"], [34, 62, "#FF8FA3"], [206, 26, "#A58BFA"], [24, 100, "#FFD84D"], [50, 40, "#62D2A2"], [180, 36, "#7CC4FF"]]
        .map(([x, y, c], i) => `<rect x="${x}" y="${y}" width="6" height="3.4" rx="1" fill="${c}" transform="rotate(${20 + i * 30} ${x} ${y})"/>`).join("") + star(120, 26),
  );
};
E["Chatting"] = (s) => {
  const ex = grp(s, "Extras"); const exStr = s.slice(ex[0], ex[1]);
  // drop the little tag-like blob, keep both speech bubbles
  const noBlob = exStr.replace(/<g transform="translate\(206 278\) scale\(0\.5\)">[\s\S]*?<\/g>/, "");
  const a = s.indexOf('<g id="Legs">');
  return s.slice(0, a) + mini(SKIN, 192, 0.72, { skip: "L" }) + s.slice(a, ex[0]) + noBlob + s.slice(ex[1]);
};

/* ---- beds ---- */
const bed = (blanket, pillow) =>
  `<rect x="8" y="150" width="16" height="96" rx="6" fill="#C99A6B" stroke="${INK}" stroke-width="2.8"/>` +
  `<rect x="14" y="228" width="212" height="14" rx="4" fill="#C99A6B" stroke="${INK}" stroke-width="2.8"/>` +
  `<rect x="18" y="240" width="9" height="30" rx="2" fill="#C99A6B" stroke="${INK}" stroke-width="2.4"/><rect x="212" y="240" width="9" height="30" rx="2" fill="#C99A6B" stroke="${INK}" stroke-width="2.4"/>` +
  `<rect x="22" y="206" width="206" height="24" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="2.8"/>` +
  `<rect x="28" y="176" width="64" height="34" rx="14" fill="${pillow}" stroke="${INK}" stroke-width="2.8"/>`;
const lying = (face, tx = 4.3, ty = 253.4) =>
  `<g transform="translate(${tx} ${ty}) rotate(-90) scale(.72)">${noIds(`<g>${legsStd}</g>` + bodyG() + FACE[face])}</g>`;
const blanketShape = (c) => `<path d="M126 134Q130 124 146 126H206Q222 128 222 146V216H126Z" fill="${c}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/><path d="M126 150Q172 160 222 150" stroke="${INK}" stroke-opacity=".35" stroke-width="2.4" fill="none"/>`;
const dots = (xs) => xs.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join("");
const zzz = `<path d="M62 124h14l-14 15h14" stroke="#7C8CFF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M84 104h10l-10 11h10" stroke="#7C8CFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M102 88h7l-7 8h7" stroke="#7C8CFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
E["Sleeping"] = () =>
  svgWrap(
    `<path d="M196 40a14 14 0 1 0 14 14a11 11 0 0 1 -14 -14Z" fill="#FFE066" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>` + star(160, 56, "#FFC83D", 4) + star(220, 100, "#A58BFA", 4) +
      bed("", "#BFE3FF") + lying("sleep") + blanketShape("#8B7CFF") + dots([[150, 150], [172, 140], [196, 152], [158, 180], [188, 190], [210, 172]]) + zzz,
  );
E["Napping"] = () =>
  svgWrap(
    `<circle cx="204" cy="48" r="16" fill="#FFD84D" stroke="${INK}" stroke-width="2.6"/><path d="M204 22V16M204 80V74M178 48H172M236 48H230M186 30L182 26M222 66L226 70M222 30L226 26M186 66L182 70" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>` +
      `<g transform="translate(40 50)"><path d="M-22 8Q-34 8 -32 -2Q-30 -10 -20 -10Q-18 -22 -6 -22Q4 -22 8 -14Q22 -16 24 -4Q34 -2 30 8Z" fill="#FFFFFF" stroke="${INK}" stroke-width="2.8"/></g>` +
      bed("", "#FFE3B8") + lying("sleep") + blanketShape("#FFB3C6") +
      `<path d="M130 160Q146 168 162 160T196 160" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round" fill="none"/>` + dots([[150, 190], [180, 186], [206, 196]]) + zzz,
  );
E["Meditating"] = () => {
  const shin = (pts) => ow(stroke(pts, 25.2, INK)) + stroke(pts, 18.8, "#FFFFFF");
  return svgWrap(
    `<ellipse cx="120" cy="266" rx="86" ry="12" fill="#FFB3C6" stroke="${INK}" stroke-width="2.8"/>` +
      `<g transform="translate(0 40)">${noIds(bodyG() + FACE.calm)}</g>` +
      shin([[60, 246], [92, 252], [134, 254]]) + shin([[180, 246], [148, 252], [106, 254]]) +
      `<path d="M80 172Q54 196 66 238" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" fill="none" data-ow="1"/><circle cx="68" cy="240" r="11.3" fill="${INK}" data-ow="1"/><path d="M80 172Q54 196 66 238" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>${patch(80, 172)}<circle cx="68" cy="240" r="8.5" fill="#FFFFFF"/>` +
      `<path d="M160 172Q186 196 174 238" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" fill="none" data-ow="1"/><circle cx="172" cy="240" r="11.3" fill="${INK}" data-ow="1"/><path d="M160 172Q186 196 174 238" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>${patch(160, 172)}<circle cx="172" cy="240" r="8.5" fill="#FFFFFF"/>` +
      star(40, 100) + star(204, 90, "#62D2A2") + star(196, 150, "#FF8FA3", 4),
  );
};
E["Cycling"] = () => {
  const k = 0.72, tx = 15.6, ty = 34.9;
  const wheel = (cx) => `<circle cx="${cx}" cy="236" r="30" fill="#fff" fill-opacity=".5" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="236" r="3.4" fill="${INK}"/><path d="M${cx} 208V264M${cx - 28} 236H${cx + 28}M${cx - 20} 216L${cx + 20} 256M${cx + 20} 216L${cx - 20} 256" stroke="${INK}" stroke-opacity=".35" stroke-width="1.2"/>`;
  const bar = (pts) => ow(stroke(pts, 8, INK)) + stroke(pts, 4.4, "#FF6B6B");
  const frame = bar([[112, 236], [100, 178]]) + bar([[100, 182], [158, 176]]) + bar([[112, 236], [158, 178]]) + bar([[112, 236], [54, 236]]) + bar([[100, 182], [54, 236]]) + bar([[158, 176], [188, 236]]) + bar([[158, 176], [164, 160], [178, 156]]);
  const saddle = stroke([[86, 172], [112, 172]], 9, INK) + stroke([[86, 172], [112, 172]], 5, "#2A3350");
  const lg = (pts) => ow(stroke(pts, 15.1, INK)) + stroke(pts, 11.3, "#FFFFFF");
  const legs = lg([[96, 178], [106, 204], [98, 226]]) + lg([[112, 178], [136, 204], [128, 244]]) + stroke([[98, 226], [110, 229]], 11, INK) + stroke([[98, 226], [110, 229]], 6, "#2A3350") + stroke([[128, 244], [142, 246]], 11, INK) + stroke([[128, 244], [142, 246]], 6, "#2A3350");
  return svgWrap(
    `<path d="M0 266H240" stroke="#C4CCDB" stroke-width="3"/><path d="M10 120H30M4 136H22M16 152H32" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` +
      wheel(54) + wheel(188) + saddle + frame + legs +
      `<g transform="translate(${tx} ${ty}) scale(${k})">${noIds(bodyG() + FACE.happy)}</g>` +
      limbK("M131 132Q158 134 172 152", 176, 156, k) + limbK("M73 134Q120 120 168 150", 172, 153, k) +
      `<circle cx="112" cy="236" r="6" fill="#C4CCDB" stroke="${INK}" stroke-width="2.4"/>`,
  );
};

/* ---------- apply ---------- */
let touched = 0;
const seen = new Set();
const mascot = g.sections;
for (const sec of mascot) {
  sec.tiles = sec.tiles.filter((t) => !(t.name === "Walking" && sec.title === "Fitness & health"));
  for (const t of sec.tiles) {
    const f = E[t.name];
    if (!f) continue;
    const key = sec.title + "|" + t.name;
    t.svg = f(t.svg); delete t.alt; touched++; seen.add(t.name);
  }
}
const miss = Object.keys(E).filter((n) => !seen.has(n));
if (miss.length) console.log("MISSING", miss);
// counts
const total = mascot.reduce((a, s) => a + s.tiles.length, 0);
const fit = mascot.find((s) => s.title === "Fitness & health");
fit.desc = fit.desc.replace(/^\d+ poses/, `${fit.tiles.length} poses`);
g.subtitle = g.subtitle.replace(/^\d+ poses/, `${total} poses`);
fs.writeFileSync(p, JSON.stringify(g));
const hp = "data/hero.json";
const hero = JSON.parse(fs.readFileSync(hp, "utf8"));
hero.find((h) => h.id === "mascot").count = `#${total}`;
fs.writeFileSync(hp, JSON.stringify(hero));
console.log("tiles edited", touched, "total", total);
