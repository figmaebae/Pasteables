// The approved Dumpling Buddy, as reusable parts. Nothing here redesigns the character: BODY, legs, hands, shading, outline and
// the base face are copied verbatim from base.svg / generate.mjs. Reactions only swap the face parts, move the hands along the
// outer sides of the body, or add a small prop. `render()` with no options reproduces base.svg exactly (checked by reactions-check.mjs).
export const INK = "#4A2418", DOUGH = "#FCE6C6", HAND = "#FCE6C6", EYE = "#3A1D14", SW = 4.6, PINK = "#F0647A";
export const BODY =
  "M135 176Q156 126 178 160Q199 126 221 160Q242 126 264 176" +
  "C270 198 300 206 330 240C366 282 374 346 340 386C310 420 252 428 200 428C148 428 90 420 60 386C26 346 34 282 70 240C100 210 128 200 135 176Z";

const f = (n) => Math.round(n * 10) / 10;
// left edge of the body for a given height, so hands can always sit on the OUTER sides (the right edge is 400 - left)
const EDGE = [[240, 70], [265, 50], [300, 42], [330, 38.5], [360, 43], [386, 60]];
export const edgeX = (y) => {
  for (let i = 1; i < EDGE.length; i++) {
    if (y <= EDGE[i][0]) {
      const [y0, x0] = EDGE[i - 1], [y1, x1] = EDGE[i];
      return x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
    }
  }
  return EDGE[EDGE.length - 1][1];
};
const mitten = (x, y, rot) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="24.5" ry="22" transform="rotate(${rot} ${f(x)} ${f(y)})"/>`;

/** Hands tucked behind the body at a chosen height on each outer side. `rot` tilts them outward; `thumbR` adds a thumbs-up to the right hand. */
export function hands({ y = 372, rot = 12, yL, yR, rotL, rotR, thumbR = false } = {}) {
  const hl = yL ?? y, hr = yR ?? y, rl = rotL ?? -rot, rr = rotR ?? rot;
  // a hand left at its base height and tilt stays at its exact base position
  const posL = hl === 372 && rl === -12 ? [37, 373] : [edgeX(hl) - 4, hl];
  const posR = hr === 372 && rr === 12 ? [363, 371] : [400 - (edgeX(hr) - 4) + (thumbR ? 12 : 0), hr];
  const L = mitten(posL[0], posL[1], rl);
  if (!thumbR) return `<g id="hands" fill="${HAND}" stroke="${INK}" stroke-width="${SW}">${L}${mitten(posR[0], posR[1], rr)}</g>`;
  // thumbs-up: the thumb is part of the same shape (outline first, then fill) so there is one clean outline
  const [xr, yr] = posR;
  const thumb = `<ellipse cx="${f(xr + 1)}" cy="${f(yr - 27)}" rx="11" ry="17" transform="rotate(8 ${f(xr + 1)} ${f(yr - 27)})"/>`;
  const shapes = mitten(xr, yr, rr) + thumb;
  return `<g id="hands"><g fill="${HAND}" stroke="${INK}" stroke-width="${SW}">${L}</g>` +
    `<g fill="${HAND}" stroke="${INK}" stroke-width="${SW * 2}">${shapes}</g><g fill="${HAND}">${shapes}</g></g>`;
}

// ---- face parts (the base ones are verbatim) ----
export const BLUSH = `<g stroke="${PINK}" stroke-width="5">
      <path d="M78 330L89 314M91 333L102 317M104 335L115 319"/>
      <path d="M287 328L298 312M300 331L311 315M313 333L324 317"/>
    </g>`;
export const EYES_BASE = `<ellipse cx="135" cy="293" rx="22" ry="23.5" fill="${EYE}"/><ellipse cx="262" cy="291" rx="22" ry="23.5" fill="${EYE}"/>
    <circle cx="144" cy="284" r="8" fill="#fff"/><circle cx="271" cy="282" r="8" fill="#fff"/>
    <circle cx="127" cy="303" r="3.5" fill="#fff"/><circle cx="254" cy="301" r="3.5" fill="#fff"/>`;
export const MOUTH_BASE = `<path d="M176 318Q186 334 197 320Q208 334 220 318" stroke="${INK}" stroke-width="4.4"/>`;
const star = (x, y, r, fill = "#fff") =>
  `<path d="M${x} ${f(y - r)}Q${f(x + r * 0.18)} ${f(y - r * 0.18)} ${f(x + r)} ${y}Q${f(x + r * 0.18)} ${f(y + r * 0.18)} ${x} ${f(y + r)}Q${f(x - r * 0.18)} ${f(y + r * 0.18)} ${f(x - r)} ${y}Q${f(x - r * 0.18)} ${f(y - r * 0.18)} ${x} ${f(y - r)}Z" fill="${fill}"/>`;
export { star };
/** Bigger glossy eyes (a touch larger than the base) with an optional sparkle highlight. */
export const eyesBig = (sparkle = false) =>
  `<ellipse cx="135" cy="292" rx="25" ry="26.5" fill="${EYE}"/><ellipse cx="262" cy="290" rx="25" ry="26.5" fill="${EYE}"/>` +
  (sparkle
    ? `${star(146, 281, 11)}${star(273, 279, 11)}<circle cx="124" cy="306" r="4.5" fill="#fff"/><circle cx="251" cy="304" r="4.5" fill="#fff"/>`
    : `<circle cx="145" cy="282" r="9" fill="#fff"/><circle cx="272" cy="280" r="9" fill="#fff"/><circle cx="125" cy="304" r="4" fill="#fff"/><circle cx="252" cy="302" r="4" fill="#fff"/>`);
/** Happy closed eyes: two upward arcs. */
export const EYES_HAPPY = `<path d="M111 298Q135 270 159 298M238 296Q262 268 286 296" stroke="${EYE}" stroke-width="7"/>`;
/** Confident half-lidded eyes: the base eyes with a flat lid line across the top. */
export const EYES_LID = `<ellipse cx="135" cy="293" rx="22" ry="23.5" fill="${EYE}"/><ellipse cx="262" cy="291" rx="22" ry="23.5" fill="${EYE}"/>
    <path d="M111 268Q135 258 159 268V288Q135 280 111 288Z" fill="${DOUGH}"/><path d="M239 266Q262 256 285 266V286Q262 278 239 286Z" fill="${DOUGH}"/>
    <path d="M112 288Q135 280 158 288M239 286Q262 278 285 286" stroke="${INK}" stroke-width="4.4"/>
    <circle cx="146" cy="300" r="6.5" fill="#fff"/><circle cx="273" cy="298" r="6.5" fill="#fff"/>`;
export const mouthSmile = `<path d="M174 318Q197 346 222 318" stroke="${INK}" stroke-width="5"/>`;
export const mouthSmirk = `<path d="M178 322Q198 334 226 314" stroke="${INK}" stroke-width="5"/>`;
/** Open smile. size 1 = small, 2 = big laughing mouth. */
export const mouthOpen = (size = 1) =>
  size === 1
    ? `<path d="M171 313Q197 358 223 313Z" fill="#7A2E35" stroke="${INK}" stroke-width="4.4" stroke-linejoin="round"/><ellipse cx="197" cy="329" rx="9" ry="5" fill="#F0788A"/>`
    : `<path d="M162 311Q197 376 232 311Z" fill="#7A2E35" stroke="${INK}" stroke-width="4.4" stroke-linejoin="round"/><ellipse cx="197" cy="335" rx="13" ry="7" fill="#F0788A"/>`;

// ---- tiny props (always smaller than the character, same dark-brown outline family) ----
export const sparkle = (x, y, r, fill = "#FFC83D") => `<g stroke="${INK}" stroke-width="3.4" stroke-linejoin="round">${star(x, y, r, fill)}</g>`;
export const heart = (x, y, s = 1, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" stroke="${INK}" stroke-width="${f(3.6 / s)}" stroke-linejoin="round"><path d="M0 13C-22 -2 -19 -19 -8 -19C-3 -19 0 -15 0 -12C0 -15 3 -19 8 -19C19 -19 22 -2 0 13Z" fill="${PINK}"/></g>`;
export const drop = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke="${INK}" stroke-width="${f(3.2 / s)}" stroke-linejoin="round"><path d="M0 -13C6 -4 9 0 9 5A9 9 0 0 1 -9 5C-9 0 -6 -4 0 -13Z" fill="#8FD3FF"/></g>`;
export const confetti = (x, y, c, r = 0, kind = 0) =>
  kind === 0
    ? `<rect x="${x - 5}" y="${y - 10}" width="10" height="20" rx="3" fill="${c}" stroke="${INK}" stroke-width="3" transform="rotate(${r} ${x} ${y})"/>`
    : kind === 1
      ? `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="${INK}" stroke-width="3"/>`
      : `<path d="M${x} ${y - 9}L${x + 9} ${y + 7}L${x - 9} ${y + 7}Z" fill="${c}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" transform="rotate(${r} ${x} ${y})"/>`;
/** Short motion lines fanning out from a point. */
export const burst = (x, y, ang, n = 3, len = 16, gap = 10) => {
  const d = [];
  for (let i = 0; i < n; i++) {
    const a = ((ang + (i - (n - 1) / 2) * 30) * Math.PI) / 180;
    d.push(`M${f(x + Math.cos(a) * gap)} ${f(y + Math.sin(a) * gap)}L${f(x + Math.cos(a) * (gap + len))} ${f(y + Math.sin(a) * (gap + len))}`);
  }
  return `<path d="${d.join("")}" stroke="${INK}" stroke-width="4.4" fill="none"/>`;
};

/**
 * The whole character. All options default to the approved base. `viewBox` is shared by every reaction so scale stays identical.
 * `behind` goes under everything, `front` over everything (props).
 */
function renderPlain({ viewBox = "4 122 392 346", label = "Dumpling Buddy", handsSvg = hands(), eyes = EYES_BASE, mouth = MOUTH_BASE, blush = BLUSH, behind = "", front = "" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}">
  <defs><clipPath id="dumpling-body"><path d="${BODY}"/></clipPath></defs>${behind ? `\n  <g id="behind">${behind}</g>` : ""}
  <!-- short legs (behind the body) -->
  <g id="legs" fill="${HAND}" stroke="${INK}" stroke-width="${SW}">
    <rect x="130" y="414" width="46" height="42" rx="19"/>
    <rect x="223" y="414" width="46" height="42" rx="19"/>
  </g>
  <!-- hands: behind the body, most of each mitten shows outside the outline -->
  ${handsSvg}
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
    ${eyes}
    ${mouth}
    ${blush}
  </g>${front ? `\n  <g id="props">${front}</g>` : ""}
</svg>
`;
}

/** Optional observer (used by the website build). Never changes what render() returns or what the SVG files contain. */
export const renderHooks = {};
export function render(o = {}) {
  const svg = renderPlain(o);
  renderHooks.onRender?.(o, svg);
  return svg;
}
// the website build also needs the same markup with the eyes wrapped in <g id="Eyes">
export const renderTagged = (o = {}) => renderPlain({ ...o, eyes: tagEyes(o.eyes ?? EYES_BASE) });
function tagEyes(eyes) {
  // a leading translate group (the "lowered face" poses) stays outside the tag so the tag never contains a nested <g>
  const m = eyes.match(/^(<g transform="translate\([^)]*\)">)([\s\S]*)<\/g>$/);
  const [open, inner, close] = m ? [m[1], m[2], "</g>"] : ["", eyes, ""];
  if (inner.includes("<g")) throw new Error("eyes contain a nested group; cannot tag");
  return `${open}<g id="Eyes">${inner}</g>${close}`;
}
