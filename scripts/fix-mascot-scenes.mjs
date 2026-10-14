// Rebuilds five Mascot scenes whose props/companions read wrong. Everything is drawn from
// constants (not from the previous art) so the script is idempotent.
//  - Road Trip: mascot rides inside the car window
//  - Exploring City: skyline of mixed heights around a mascot of similar size
//  - Meeting Friends / Supporting: companions are real mini mascots; one hand per contact point
//  - Teamwork: teammates and mascot stack hands in front without arms crossing bodies
import fs from "node:fs";
const p = "data/gallery-mascot.json";
const g = JSON.parse(fs.readFileSync(p, "utf8"));
const INK = "#2B2430";
const SKIN = "#FF8552";

const limb = (d, hx, hy) =>
  `<path d="${d}" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" stroke-linejoin="round" fill="none" data-ow="1"/>` +
  `<circle cx="${hx}" cy="${hy}" r="11.3" fill="${INK}" data-ow="1"/>` +
  `<path d="${d}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<circle cx="${hx}" cy="${hy}" r="8.5" fill="#FFFFFF"/>`;
const patch = (x, y, c = SKIN) => `<path data-jp="1" d="M${x - 9} ${y}a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z" fill="${c}"/>`;
const legs = `<g id="Legs"><path d="M89 190V264H76Q70 264 70 270Q70 276 76 276H108Q111 276 111 270V190" fill="#FFFFFF" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M151 190V264H164Q170 264 170 270Q170 276 164 276H132Q129 276 129 270V190" fill="#FFFFFF" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></g>`;
const body = (c = SKIN, id = true) =>
  `<g${id ? ' id="Body"' : ""}><g fill="${c}"><circle cx="100" cy="70" r="13"/><circle cx="121" cy="60" r="16"/><circle cx="142" cy="68" r="13"/><path d="M80 196C68 156 66 108 84 86C96 70 144 70 156 86C174 108 172 156 160 196C148 205 92 205 80 196Z"/></g><path d="M84 104Q82 120 86 140" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M112 56Q118 52 126 55" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" fill="none"/></g>`;
const cheeks = `<ellipse cx="88" cy="138" rx="9" ry="5.8" fill="#FF5D73" fill-opacity=".42"/><ellipse cx="152" cy="138" rx="9" ry="5.8" fill="#FF5D73" fill-opacity=".42"/>`;
const arcs = `<g id="Eyes"><path d="M92 124Q102 111 112 124M128 124Q138 111 148 124" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" fill="none"/></g>`;
const FACES = {
  happy: `<g id="Face">${cheeks}${arcs}<g id="Mouth"><path d="M109 138H131Q131 156 120 156Q109 156 109 138Z" fill="#FF5D73" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="120" cy="151" rx="6" ry="3.6" fill="#FF9FB0"/></g></g>`,
  smile: `<g id="Face">${cheeks}${arcs}<g id="Mouth"><path d="M109 141Q114.5 148 120 141Q125.5 148 131 141" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></g>`,
  wide: `<g id="Face">${cheeks}<g id="Eyes"><ellipse cx="102" cy="121" rx="10.6" ry="11.4" fill="#FFFFFF" stroke="${INK}" stroke-width="2.6"/><circle cx="105" cy="122" r="7" fill="${INK}"/><circle cx="107" cy="119.4" r="2.8" fill="#FFFFFF"/><ellipse cx="138" cy="121" rx="10.6" ry="11.4" fill="#FFFFFF" stroke="${INK}" stroke-width="2.6"/><circle cx="141" cy="122" r="7" fill="${INK}"/><circle cx="143" cy="119.4" r="2.8" fill="#FFFFFF"/></g><g id="Mouth"><path d="M109 141Q114.5 148 120 141Q125.5 148 131 141" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></g>`,
  worried: `<g id="Face">${cheeks}<g id="Eyes"><circle cx="102" cy="122" r="6" fill="${INK}"/><circle cx="138" cy="122" r="6" fill="${INK}"/><path d="M92 112L112 107M148 112L128 107" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/></g><g id="Mouth"><path d="M110 148Q120 140 130 148" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" fill="none"/></g></g>`,
};
const noIds = (s) => s.replace(/ id="(Legs|Body|Face|Eyes|Mouth|Arms)"/g, "");

// A full little mascot in `color`, scale s, feet on y=276, centred on cx. `skip` drops an arm
// ("L"/"R") so a neighbour's hand can rest there without a second hand showing.
const mini = (color, cx, s, mood = "happy", skip = "") =>
  `<g transform="translate(${+(cx - 120 * s).toFixed(1)} ${+(276 - 276 * s).toFixed(1)}) scale(${s})">` +
  noIds(legs + body(color, false) + FACES[mood]) +
  (skip === "L" ? "" : limb("M80 132Q62 160 68 188", 68, 190) + patch(80, 132, color)) +
  (skip === "R" ? "" : limb("M160 132Q178 160 172 188", 172, 190) + patch(160, 132, color)) +
  `</g>`;

const heart = (x, y, k = 1) =>
  `<path d="M${x} ${y + 7.2 * k}C${x - 4.8 * k} ${y + 4 * k} ${x - 4.4 * k} ${y} ${x - 2 * k} ${y}C${x - 0.8 * k} ${y} ${x} ${y + 1.2 * k} ${x} ${y + 2 * k}C${x} ${y + 1.2 * k} ${x + 0.8 * k} ${y} ${x + 2 * k} ${y}C${x + 4.4 * k} ${y} ${x + 4.8 * k} ${y + 4 * k} ${x} ${y + 7.2 * k}Z" fill="#FF5C7A" stroke="${INK}" stroke-width="2.4"/>`;
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" width="240" height="300" fill="none">${inner}</svg>`;
const arms = (l, r) => `<g id="Arms">${limb(...l)}${patch(80, 132)}${limb(...r)}${patch(160, 132)}</g>`;

const SCENES = {
  "Meeting Friends": () =>
    svg(
      mini("#7CC4FF", 42, 0.6, "happy", "R") + mini("#A58BFA", 198, 0.6, "happy", "L") +
        legs + body() + FACES.happy +
        arms(["M80 132Q58 150 66 186", 66, 190], ["M160 132Q182 150 174 186", 174, 190]) +
        `<g id="Extras">${heart(34, 112)}${heart(198, 112)}${heart(116, 22)}</g>`,
    ),
  Supporting: () =>
    svg(
      mini("#A58BFA", 198, 0.62, "happy", "L") +
        legs + body() + FACES.smile +
        arms(["M80 132Q62 160 68 188", 68, 195], ["M160 132Q192 130 177 183", 177, 185]) +
        `<g id="Extras">${heart(196, 98)}${heart(40, 86, 0.9)}</g>`,
    ),
  Teamwork: () => {
    // mascot in the middle, a touch smaller; teammates flank it and everyone's hands meet in front
    const main = `<g transform="translate(21.6 49.7) scale(.82)">${legs}${body()}${FACES.happy}</g>`;
    const reach = (d) =>
      `<path d="${d}" stroke="${INK}" stroke-width="13.6" stroke-linecap="round" fill="none" data-ow="1"/><path d="${d}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="11.3" fill="${INK}" data-ow="1"/><circle cx="${x}" cy="${y}" r="8.5" fill="#FFFFFF"/>`;
    return svg(
      mini("#62D2A2", 42, 0.62, "happy", "R") + mini("#5BB8F5", 198, 0.62, "happy", "L") + main +
        `<g id="Arms">${reach("M67 188Q82 206 108 206")}${reach("M173 188Q158 206 132 206")}` +
        `<g transform="translate(21.6 49.7) scale(.82)">${limb("M80 132Q70 160 106 170", 108, 171)}${patch(80, 132)}${limb("M160 132Q170 160 134 170", 132, 171)}${patch(160, 132)}</g>` +
        `${hand(108, 206)}${hand(132, 206)}</g>` +
        `<g id="Extras"><path d="M120 28Q120 33 125 33Q120 33 120 38Q120 33 115 33Q120 33 120 28Z" fill="#FFC83D"/></g>`,
    );
  },
  "Exploring City": () => {
    const blds = [
      { x: 6, w: 42, h: 170, c: "#BFE3FF" },
      { x: 50, w: 30, h: 118, c: "#FFE3B8" },
      { x: 160, w: 34, h: 196, c: "#E6E0FF" },
      { x: 196, w: 38, h: 138, c: "#FFB3C6" },
    ];
    let city = "";
    for (const b of blds) {
      const top = 276 - b.h;
      city += `<rect x="${b.x}" y="${top}" width="${b.w}" height="${b.h}" rx="2" fill="${b.c}" stroke="${INK}" stroke-width="2.4"/>`;
      for (let y = top + 12; y < 262; y += 20) for (let x = b.x + 7; x < b.x + b.w - 8; x += 13) city += `<rect x="${x}" y="${y}" width="6" height="7" rx="1" fill="#FFE066"/>`;
    }
    const legsWalk = legs.replace('stroke-linecap="round"/><path', 'stroke-linecap="round" transform="rotate(8 100 190)"/><path').replace(/(<path d="M151[^>]*?)\/>/, '$1 transform="rotate(-8 140 190)"/>');
    const pin = `<g transform="translate(120 76)"><path d="M0 0C-12 -14 -14 -26 -14 -30A14 14 0 1 1 14 -30C14 -26 12 -14 0 0Z" fill="#FF6B6B" stroke="${INK}" stroke-width="2.8"/><circle cx="0" cy="-30" r="5" fill="#fff"/></g>`;
    return svg(
      `<path d="M0 276H240" stroke="#C4CCDB" stroke-width="3"/>${city}` +
        `<g transform="translate(18 41.4) scale(.85)">${legsWalk}${body()}${FACES.wide}${arms(["M80 132Q62 160 68 188", 68, 195], ["M160 132Q178 150 172 164", 172, 166])}</g>` +
        `<g id="Extras">${pin}</g>`,
    );
  },
  "Road Trip": () =>
    svg(
      `<circle cx="204" cy="40" r="14" fill="#FFD84D" stroke="${INK}" stroke-width="2.6"/>` +
        `<g transform="translate(50 56)"><path d="M-22 8Q-34 8 -32 -2Q-30 -10 -20 -10Q-18 -22 -6 -22Q4 -22 8 -14Q22 -16 24 -4Q34 -2 30 8Z" fill="#FFFFFF" stroke="${INK}" stroke-width="2.8"/></g>` +
        `<path d="M8 90H26M4 106H20" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>` +
        `<path d="M10 270H230" stroke="#C4CCDB" stroke-width="3"/>` +
        `<path d="M60 204L80 118Q84 104 100 104H152Q166 104 172 118L192 204Z" fill="#FF6B6B" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` +
        `<path d="M72 200L89 124Q91 116 101 116H151Q160 116 164 124L181 200Z" fill="#BFE3FF" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>` +
        `<g transform="translate(33.6 74) scale(.72)">${noIds(body())}${noIds(FACES.happy)}</g>` +
        `<path d="M14 236Q14 214 36 210L62 204Q74 196 92 196H168Q186 196 198 206L216 212Q228 216 228 232V250H14Z" fill="#FF6B6B" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` +
        `<path d="M120 200V246M54 224H72" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` +
        `<circle cx="66" cy="250" r="15" fill="#2A3350" stroke="${INK}" stroke-width="3"/><circle cx="66" cy="250" r="6" fill="#C4CCDB" stroke="${INK}" stroke-width="2"/>` +
        `<circle cx="174" cy="250" r="15" fill="#2A3350" stroke="${INK}" stroke-width="3"/><circle cx="174" cy="250" r="6" fill="#C4CCDB" stroke="${INK}" stroke-width="2"/>` +
        `<circle cx="214" cy="226" r="5" fill="#FFD84D" stroke="${INK}" stroke-width="1.8"/>`,
    ),
};

let n = 0;
for (const s of g.sections) for (const t of s.tiles) {
  const f = SCENES[t.name];
  if (!f) continue;
  t.svg = f();
  delete t.alt; // outlined style is derived from the new art
  n++;
}
fs.writeFileSync(p, JSON.stringify(g));
console.log("rebuilt", n);
