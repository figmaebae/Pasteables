// Extra face parts for Sad & Emotional. Built on character.mjs without changing it.
import { INK, EYE, DOUGH, PINK, BLUSH, EYES_BASE, hands, sparkle, drop, heart, star } from "./character.mjs";
export { INK, EYE, DOUGH, PINK, BLUSH, EYES_BASE, hands, sparkle, drop, heart };

const f = (n) => Math.round(n * 10) / 10;
const BLUE = "#8FD3FF";
export const shift = (markup, dx = 0, dy = 0) => `<g transform="translate(${dx} ${dy})">${markup}</g>`;

/** Eyebrows were removed from the Dumpling set; these stay as empty so the reaction definitions don't change. */
export const browsSad = () => "";
export const browsFlat = "";

/** Big watery eyes: large dark eyes, big highlights and a pale blue shimmer along the bottom. */
export const eyesWatery = (big = 1) => {
  const rx = 22 + 3.5 * big, ry = 23.5 + 4 * big;
  return `<ellipse cx="135" cy="293" rx="${rx}" ry="${ry}" fill="${EYE}"/><ellipse cx="262" cy="291" rx="${rx}" ry="${ry}" fill="${EYE}"/>` +
    `<path d="M${135 - rx + 3} 296A${rx - 3} ${ry - 4} 0 0 0 ${135 + rx - 3} 296Z" fill="${BLUE}" opacity=".42"/><path d="M${262 - rx + 3} 294A${rx - 3} ${ry - 4} 0 0 0 ${262 + rx - 3} 294Z" fill="${BLUE}" opacity=".42"/>` +
    `<circle cx="146" cy="281" r="${f(9 + 2 * big)}" fill="#fff"/><circle cx="273" cy="279" r="${f(9 + 2 * big)}" fill="#fff"/>` +
    `<circle cx="124" cy="304" r="4.5" fill="#fff"/><circle cx="251" cy="302" r="4.5" fill="#fff"/>`;
};
/** Base eyes with the highlights dropped low: a downcast look. */
export const eyesDown = `<ellipse cx="135" cy="294" rx="22" ry="23.5" fill="${EYE}"/><ellipse cx="262" cy="292" rx="22" ry="23.5" fill="${EYE}"/>
    <circle cx="142" cy="302" r="7" fill="#fff"/><circle cx="269" cy="300" r="7" fill="#fff"/><circle cx="127" cy="310" r="3" fill="#fff"/><circle cx="254" cy="308" r="3" fill="#fff"/>`;
/** Eyes looking sideways (dx < 0 = to the viewer's left). */
export const eyesSide = (dx = -9) =>
  `<ellipse cx="${135 + dx}" cy="293" rx="22" ry="23.5" fill="${EYE}"/><ellipse cx="${262 + dx}" cy="291" rx="22" ry="23.5" fill="${EYE}"/>` +
  `<circle cx="${144 + dx * 1.3}" cy="285" r="8" fill="#fff"/><circle cx="${271 + dx * 1.3}" cy="283" r="8" fill="#fff"/><circle cx="${127 + dx * 1.3}" cy="304" r="3.5" fill="#fff"/><circle cx="${254 + dx * 1.3}" cy="302" r="3.5" fill="#fff"/>`;
/** Half-closed eyes: heavy flat lids over the base eyes. */
export const eyesHalf = `<ellipse cx="135" cy="293" rx="22" ry="23.5" fill="${EYE}"/><ellipse cx="262" cy="291" rx="22" ry="23.5" fill="${EYE}"/>
    <path d="M108 258H162V295H108Z" fill="${DOUGH}"/><path d="M236 256H290V293H236Z" fill="${DOUGH}"/>
    <path d="M111 295H159M238 293H286" stroke="${INK}" stroke-width="4.6"/>
    <circle cx="146" cy="305" r="5.5" fill="#fff"/><circle cx="273" cy="303" r="5.5" fill="#fff"/>`;
/** Closed eyes curving downward (a flustered squeeze). */
export const eyesSqueeze = `<path d="M112 290Q135 312 158 290M239 288Q262 310 285 288" stroke="${EYE}" stroke-width="7"/>`;
/** Big pleading eyes: the largest eyes in the set, with three highlights. */
export const eyesPleading = `<ellipse cx="135" cy="292" rx="28" ry="30" fill="${EYE}"/><ellipse cx="262" cy="290" rx="28" ry="30" fill="${EYE}"/>
    <path d="M110 298A25 26 0 0 0 160 298Z" fill="${BLUE}" opacity=".4"/><path d="M237 296A25 26 0 0 0 287 296Z" fill="${BLUE}" opacity=".4"/>
    <circle cx="146" cy="279" r="12" fill="#fff"/><circle cx="273" cy="277" r="12" fill="#fff"/><circle cx="122" cy="306" r="5.5" fill="#fff"/><circle cx="249" cy="304" r="5.5" fill="#fff"/><circle cx="150" cy="302" r="3" fill="#fff"/><circle cx="277" cy="300" r="3" fill="#fff"/>`;

export const mouthFrown = `<path d="M182 337Q197 322 212 337" stroke="${INK}" stroke-width="4.6"/>`;
export const mouthTinyFrown = `<path d="M187 337Q197 328 207 337" stroke="${INK}" stroke-width="4.6"/>`;
export const mouthShy = `<path d="M186 322Q197 334 208 322" stroke="${INK}" stroke-width="4.6"/>`;
export const mouthNervous = `<path d="M177 327Q187 318 197 327Q207 336 217 327" stroke="${INK}" stroke-width="4.6"/>`;
export const mouthPout = `<path d="M184 338Q190 326 197 333Q204 326 210 338" stroke="${INK}" stroke-width="4.6" stroke-linejoin="round"/>`;
export const mouthSoft = `<path d="M178 322Q197 340 216 322" stroke="${INK}" stroke-width="4.8"/>`;

/** Blush: the base slashes, optionally with a soft pink glow behind them. */
export const blushGlow = (op = 0.34) => `<ellipse cx="96" cy="327" rx="38" ry="21" fill="${PINK}" opacity="${op}"/><ellipse cx="306" cy="325" rx="38" ry="21" fill="${PINK}" opacity="${op}"/>`;
export const blushSubtle = `<g opacity=".55">${BLUSH}</g>`;
export const blushStrong = `${blushGlow(0.38)}${BLUSH}<path d="M81 312L91 297M312 310L322 295" stroke="${PINK}" stroke-width="5"/>`;

/** Two blue tears streaming down the cheeks from under the eyes. */
const stream = (x, y) =>
  `<g stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"><path d="M${x} ${y}Q${x - 9} ${y + 28} ${x - 3} ${y + 58}Q${x + 7} ${y + 68} ${x + 15} ${y + 56}Q${x + 19} ${y + 28} ${x + 15} ${y}Z" fill="${BLUE}"/></g>` +
  `<path d="M${x + 2} ${y + 14}Q${x - 1} ${y + 32} ${x + 2} ${y + 46}" stroke="#fff" stroke-width="3.2" opacity=".85"/>`;
export const tears = stream(124, 316) + stream(258, 314);

/** A tiny rain cloud (one accent for the lonely reaction). */
export const cloud = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-27 12C-42 12 -42 -7 -27 -8C-25 -24 -4 -27 3 -14C14 -23 32 -12 27 3C40 5 38 20 25 20H-25C-33 20 -36 15 -27 12Z" fill="#E8EEF8" stroke="${INK}" stroke-width="${f(3.6 / s)}" stroke-linejoin="round"/></g>`;
export { star };
