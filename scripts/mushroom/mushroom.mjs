// Mushroom Buddy: one approved base character (see base.svg) with swappable faces and decorations.
// Only the face and the extra elements change between stickers; cap, body, hands and feet are shared.
const INK = "#20040F";
const EYE = "#1E0612";
const PINK = "#FF7FA6";
const BLUE = "#7EC8F2";
const GOLD = "#FFC83D";
const VB = "55 50 890 890";

const CAP = "M135 505C120 380 220 200 380 150C450 128 560 118 650 150C770 195 880 330 886 450C888 500 850 535 790 545Q700 468 500 455Q330 468 235 548C180 545 145 530 135 505Z";
const BODY = "M259 400L255 480C240 560 232 640 238 720C242 780 270 810 320 825C400 846 600 846 690 825C740 812 790 780 793 720C798 640 790 560 765 480L761 400Z";
const HAND = "M222 735C205 750 205 790 235 805C265 818 305 805 318 780C325 762 300 748 280 752C262 755 250 745 245 730C240 718 228 722 222 735Z";
const FOOT = "M385 830C378 868 392 888 420 888C448 888 458 868 452 830Z";
const flipH = (x) => `translate(${x} 0) scale(-1 1)`;

// ---- small drawing helpers -------------------------------------------------
const f = (n) => Math.round(n * 100) / 100;
const line = (d, w = 9, c = EYE) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none"/>`;
const sparkle = (x, y, r, fill = GOLD) =>
  `<path d="M${x} ${y - r}Q${f(x + r * 0.16)} ${f(y - r * 0.16)} ${x + r} ${y}Q${f(x + r * 0.16)} ${f(y + r * 0.16)} ${x} ${y + r}Q${f(x - r * 0.16)} ${f(y + r * 0.16)} ${x - r} ${y}Q${f(x - r * 0.16)} ${f(y - r * 0.16)} ${x} ${y - r}Z" fill="${fill}" stroke="${INK}" stroke-width="7"/>`;
const HEART = "M0 34C-50 0 -44 -42 -20 -42C-8 -42 0 -34 0 -28C0 -34 8 -42 20 -42C44 -42 50 0 0 34Z";
const heart = (x, y, s = 1, fill = PINK, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="${HEART}" fill="${fill}" stroke="${INK}" stroke-width="${f(8 / s)}"/><path d="M-26 -22Q-34 -12 -30 -2" stroke="#fff" stroke-opacity=".8" stroke-width="${f(6 / s)}" fill="none"/></g>`;
const brokenHeart = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke="${INK}" stroke-width="${f(8 / s)}"><path transform="translate(-9 3) rotate(-10)" d="M0 34C-50 0 -44 -42 -20 -42C-8 -42 0 -34 0 -28L8 -12L-8 2L6 16Z" fill="${PINK}"/><path transform="translate(9 0) rotate(9)" d="M0 -28C0 -34 8 -42 20 -42C44 -42 50 0 0 34L6 16L-8 2L8 -12Z" fill="${PINK}"/></g>`;
const DROP = "M0 -32C14 -10 22 2 22 14A22 22 0 0 1 -22 14C-22 2 -14 -10 0 -32Z";
const drop = (x, y, s = 1, fill = BLUE) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="${DROP}" fill="${fill}" stroke="${INK}" stroke-width="${f(8 / s)}"/><path d="M-9 6Q-12 14 -7 20" stroke="#fff" stroke-opacity=".9" stroke-width="${f(6 / s)}" fill="none"/></g>`;
const burst = (x, y, ang, len = 34, gap = 14, n = 3, w = 9) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = ((ang + (i - (n - 1) / 2) * 28) * Math.PI) / 180;
    out.push(`M${f(x + Math.cos(a) * gap)} ${f(y + Math.sin(a) * gap)}L${f(x + Math.cos(a) * (gap + len))} ${f(y + Math.sin(a) * (gap + len))}`);
  }
  return line(out.join(""), w, INK);
};
const note = (x, y, s = 1, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M18 40V-34Q18 -22 44 -18" stroke="${INK}" stroke-width="${f(9 / s)}" fill="none"/><ellipse cx="2" cy="42" rx="19" ry="14" transform="rotate(-18 2 42)" fill="${INK}"/></g>`;

// ---- faces -----------------------------------------------------------------
const blush = (rx = 31, ry = 17, c = "#EE8383", op = 1) =>
  `<ellipse cx="302" cy="602" rx="${rx}" ry="${ry}" fill="${c}" opacity="${op}"/><ellipse cx="708" cy="600" rx="${rx}" ry="${ry}" fill="${c}" opacity="${op}"/>`;
const eyes = ({ rx = 43, ry = 68, dy = 0, hr = 12.5, hdy = 0, extra = true } = {}) => E(
  `<ellipse cx="355" cy="${575 + dy}" rx="${rx}" ry="${ry}" fill="#1E0612"/><ellipse cx="655" cy="${570 + dy}" rx="${rx}" ry="${ry}" fill="#1E0612"/>` +
  `<circle cx="358" cy="${550 + dy + hdy}" r="${hr}" fill="#fff"/><circle cx="648" cy="${543 + dy + hdy}" r="${hr}" fill="#fff"/>` +
  (extra ? `<circle cx="347" cy="${f(sY(dy, 600))}" r="${f(hr * 0.42)}" fill="#fff" opacity=".9"/><circle cx="642" cy="${f(sY(dy, 595))}" r="${f(hr * 0.42)}" fill="#fff" opacity=".9"/>` : ""));
const sY = (dy, y) => y + dy;
const E = (inner) => `<g id="Eyes">${inner}</g>`;
const happyEyes = (w = 13) => E(line("M312 590Q355 538 398 590", w) + line("M612 585Q655 533 698 585", w));
const smile = (d = "M455 570Q505 612 556 570", w = 9) => line(d, w);
const MOUTH = "#6B1426";
const TONGUE = "#F2808C";
const openMouth = (wide = 1) => {
  const hw = 57 * wide;
  const d = `M${505 - hw} 566Q505 560 ${505 + hw} 566Q${505 + hw - 2} ${640 + (wide - 1) * 20} 505 ${642 + (wide - 1) * 20}Q${505 - hw + 2} ${640 + (wide - 1) * 20} ${505 - hw} 566Z`;
  const b = 642 + (wide - 1) * 20;
  const tongue = `M${505 - 35 * wide} ${b - 14}Q505 ${b - 42}  ${505 + 35 * wide} ${b - 14}Q${505 + 22 * wide} ${b - 1} 505 ${b}Q${505 - 22 * wide} ${b - 1} ${505 - 35 * wide} ${b - 14}Z`;
  return `<path d="${d}" fill="${MOUTH}" stroke="${EYE}" stroke-width="8"/><path d="${tongue}" fill="${TONGUE}"/>`;
};
const browPair = (inner = -22, outer = 0, y = 512, gap = 0) =>
  line(`M${308 + gap} ${y + outer}L${396} ${y + inner}M${614} ${y + inner}L${702 - gap} ${y + outer}`, 10);

// ---- the shared character --------------------------------------------------
let uid = 0;
function mushroom({ face = "", behind = "", caps = "", front = "" }) {
  const p = `m${++uid}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="890" height="890" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    `<defs><clipPath id="${p}c"><path d="${CAP}"/></clipPath><clipPath id="${p}b"><path d="${BODY}"/></clipPath>` +
    `<linearGradient id="${p}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9524F"/><stop offset="1" stop-color="#D84A4A"/></linearGradient>` +
    `<linearGradient id="${p}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8403F"/><stop offset="1" stop-color="#8A3234"/></linearGradient></defs>` +
    behind +
    // tiny rounded feet
    `<g fill="#E9DABB" stroke="${INK}" stroke-width="12"><path d="${FOOT}"/><path d="${FOOT}" transform="${flipH(1000)}"/></g>` +
    // plush body
    `<path d="${BODY}" fill="#F1E5CB"/><g clip-path="url(#${p}b)"><rect x="200" y="440" width="640" height="90" fill="#C9BBA3"/><path d="M200 780Q500 870 840 780V880H200Z" fill="#E4D4B5" opacity=".7"/><path d="M310 806Q500 834 690 806" stroke="#FFF9EC" stroke-width="9" opacity=".95"/></g>` +
    `<path d="${BODY}" stroke="${INK}" stroke-width="12"/>` +
    // mitten hands
    `<g fill="#EBDDBF" stroke="${INK}" stroke-width="12"><path d="${HAND}"/><path d="${HAND}" transform="${flipH(1030)}"/></g>` +
    face +
    // glossy cap
    `<path d="${CAP}" fill="url(#${p}g)"/><g clip-path="url(#${p}c)"><path d="${CAP}" stroke="#FF7A76" stroke-width="46" opacity=".9"/><path d="M100 505Q300 440 500 420Q720 415 920 480V620H100Z" fill="url(#${p}d)" opacity=".92"/>` +
    `<g fill="#fff"><ellipse cx="493" cy="185" rx="50" ry="42"/><ellipse cx="375" cy="278" rx="53" ry="47"/><ellipse cx="770" cy="310" rx="60" ry="62"/><circle cx="603" cy="240" r="12"/><circle cx="662" cy="355" r="10"/><ellipse cx="192" cy="404" rx="21" ry="14" transform="rotate(-30 192 404)"/></g></g>` +
    `<path d="${CAP}" stroke="${INK}" stroke-width="12"/>` +
    caps + front + `</svg>`;
}
// Outline strokes are authored at 2x so the app's default 0.5x stroke shows the approved look.
// Tagging them data-bs lets the Stroke slider scale them; data-keep marks tube underlays that stay put.
const BS = new Set([INK, EYE]);
const tagStrokes = (svg) => svg.replace(/<[a-zA-Z][^>]*>/g, (tag) => {
  if (tag.includes(' data-keep="1"')) return tag.replace(' data-keep="1"', "");
  const m = tag.match(/ stroke="(#[0-9A-Fa-f]{6})"/);
  if (!m || !BS.has(m[1].toUpperCase())) return tag;
  return tag.replace(/ stroke-width="([\d.]+)"/, (_, w) => ` stroke-width="${f(w * 2)}" data-bs="1"`);
});
export const plain = (svg) => svg.replace(/<[a-zA-Z][^>]*>/g, (tag) => / data-bs="1"/.test(tag) ? tag.replace(/ stroke-width="([\d.]+)"/, (_, w) => ` stroke-width="${f(w / 2)}"`).replace(' data-bs="1"', "") : tag);

const confetti = () => {
  const c = ["#FF6FA0", "#5BC0EB", GOLD, "#7BD389", "#B58AF0"];
  const bits = [
    [150, 150, 0], [250, 90, 1], [360, 70, 2], [690, 80, 3], [820, 120, 4], [915, 250, 0], [95, 330, 3], [100, 560, 1],
    [900, 560, 2], [120, 800, 4], [880, 830, 0], [250, 920, 3], [770, 905, 1], [920, 700, 4], [90, 690, 2],
  ];
  return bits.map(([x, y, i], k) => {
    const r = (k * 47) % 90;
    return k % 3 === 0 ? `<circle cx="${x}" cy="${y}" r="17" fill="${c[i]}" stroke="${INK}" stroke-width="7"/>`
      : k % 3 === 1 ? `<rect x="${x - 12}" y="${y - 24}" width="24" height="48" rx="6" fill="${c[i]}" stroke="${INK}" stroke-width="7" transform="rotate(${r} ${x} ${y})"/>`
        : `<path d="M${x} ${y - 24}L${x + 23} ${y + 18}L${x - 23} ${y + 18}Z" fill="${c[i]}" stroke="${INK}" stroke-width="7" transform="rotate(${r} ${x} ${y})"/>`;
  }).join("") + sparkle(165, 240, 56) + sparkle(850, 430, 50, "#FF9BC0") + sparkle(500, 80, 44);
};

const headphones = () => {
  const band = "M165 470C140 340 240 170 400 125C480 100 600 100 680 130C800 175 880 300 868 430";
  return `<path d="${band}" stroke="${INK}" stroke-width="40" data-keep="1"/><path d="${band}" stroke="#FF9B3D" stroke-width="22"/>` +
    [[160, 458, -8], [870, 435, 8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="38" ry="60" transform="rotate(${r} ${x} ${y})" fill="#FF9B3D" stroke="${INK}" stroke-width="12"/><ellipse cx="${x + (x < 500 ? -4 : 4)}" cy="${y}" rx="17" ry="34" transform="rotate(${r} ${x} ${y})" fill="#FFC27A"/>`).join("");
};

const boba = () =>
  // straw goes behind the cup, cup sits in front of the lower body
  `<path d="M525 705L590 618" stroke="${INK}" stroke-width="30" data-keep="1"/><path d="M525 705L590 618" stroke="#FF8FB0" stroke-width="16"/>` +
  `<path d="M422 712L578 712L556 826Q553 846 532 846L468 846Q447 846 444 826Z" fill="#F4D9B0" stroke="${INK}" stroke-width="11"/>` +
  `<path d="M436 760H564L556 826Q553 846 532 846L468 846Q447 846 444 826Z" fill="#D9AE7C"/>` +
  `<g fill="#5A3A2E"><circle cx="470" cy="822" r="10"/><circle cx="498" cy="828" r="10"/><circle cx="526" cy="822" r="10"/><circle cx="484" cy="800" r="10"/><circle cx="514" cy="802" r="10"/><circle cx="545" cy="808" r="9"/></g>` +
  `<path d="M432 770Q438 800 446 822" stroke="#fff" stroke-opacity=".7" stroke-width="7" fill="none"/>` +
  `<rect x="414" y="694" width="172" height="26" rx="13" fill="#fff" stroke="${INK}" stroke-width="11"/>`;

const screen = () =>
  `<rect x="340" y="668" width="330" height="170" rx="22" fill="#3B2F45" stroke="${INK}" stroke-width="11"/>` +
  `<rect x="358" y="684" width="294" height="138" rx="10" fill="#8FD3FF"/>` +
  `<path d="M358 760Q430 720 500 745T652 735V812Q652 822 642 822H368Q358 822 358 812Z" fill="#B8E6FF"/>` +
  `<circle cx="505" cy="753" r="30" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M497 738L522 753L497 768Z" fill="#FF7FA6"/>` +
  `<path d="M372 698Q372 692 380 692H410" stroke="#fff" stroke-opacity=".8" stroke-width="7" fill="none"/>`;

// ---- stickers -----------------------------------------------------------------
const tile = (o) => tagStrokes(mushroom(o));
const happy = [
  ["Super happy", () => tile({ face: blush(37, 21, "#F07C7C") + eyes({ rx: 45, ry: 70 }) + openMouth(1), front: sparkle(120, 300, 62) + sparkle(890, 220, 52) + sparkle(890, 700, 42, "#FF9BC0") })],
  ["Blushing", () => tile({
    face: blush(40, 23, "#F3737F") + eyes({ rx: 42, ry: 58, dy: 12, hdy: 18, extra: false }) + smile("M478 604Q505 618 532 604", 8) +
      line("M272 540L284 566M290 538L302 564M308 536L320 562M702 538L714 564M720 540L732 566M738 542L750 568", 7, "#F4838C"),
  })],
  ["Proud", () => tile({
    face: blush(33, 18, "#EE7A7A") +
      E(`<path d="M312 582Q330 548 355 548Q380 548 398 582Q398 636 355 636Q312 636 312 582Z" fill="#1E0612"/><path d="M612 577Q630 543 655 543Q680 543 698 577Q698 631 655 631Q612 631 612 577Z" fill="#1E0612"/>` +
      `<circle cx="360" cy="575" r="11" fill="#fff"/><circle cx="650" cy="570" r="11" fill="#fff"/>`) + smile("M462 584Q508 618 562 578", 9),
    front: sparkle(890, 210, 66),
  })],
  ["Love", () => tile({
    face: blush(34, 19, "#F07C8C") + eyes({ rx: 46, ry: 71, hr: 14 }) + smile("M455 574Q505 616 556 574", 9),
    front: heart(140, 250, 1.25) + heart(870, 200, 1.05, "#FF9BC0", 12) + heart(505, 95, 0.85, PINK, -8),
  })],
];

const sad = [
  ["Crying", () => tile({
    face: blush(31, 17, "#EE8383", 0.8) + browPair(-22, 4, 506) + eyes({ rx: 46, ry: 66, hr: 15, dy: 4 }) +
      `<path d="M320 640Q312 690 320 722Q336 738 352 722Q360 690 352 640Z" fill="${BLUE}" stroke="${INK}" stroke-width="8"/><path d="M660 636Q652 686 660 718Q676 734 692 718Q700 686 692 636Z" fill="${BLUE}" stroke="${INK}" stroke-width="8"/>` +
      line("M334 660Q331 686 335 704M674 656Q671 682 675 700", 6, "#fff") + line("M470 616Q505 590 540 616", 9),
  })],
  ["Disappointed", () => tile({
    face: blush(31, 17, "#EE8383", 0.6) + browPair(-10, 6, 520) +
      E(`<path d="M312 578H398Q398 642 355 642Q312 642 312 578Z" fill="#1E0612"/><path d="M612 573H698Q698 637 655 637Q612 637 612 573Z" fill="#1E0612"/>` +
      line("M306 578H404", 10) + line("M606 573H704", 10) + `<circle cx="368" cy="608" r="9" fill="#fff"/><circle cx="661" cy="603" r="9" fill="#fff"/>`) + line("M476 612Q505 596 534 612", 9),
  })],
  ["Worried", () => tile({
    face: blush(31, 17, "#EE8383", 0.9) + browPair(-34, 6, 516) + eyes({ rx: 45, ry: 62, hr: 11, dy: 8, extra: false }) +
      line("M462 614q11 -14 22 0t22 0t22 0t22 0", 8),
    front: drop(105, 300, 1.2) + drop(900, 320, 1.0),
  })],
  ["Heartbroken", () => tile({
    face: blush(31, 17, "#EE8383", 0.38) + browPair(-18, 4, 508) + eyes({ rx: 44, ry: 64, hr: 14, dy: 6 }) + line("M470 616Q505 596 540 616", 9),
    front: brokenHeart(870, 610, 1.35),
  })],
];

const funny = [
  ["Silly", () => tile({
    face: blush() + eyes({ rx: 47, ry: 72, hr: 14 }) +
      `<path d="M466 584Q505 580 544 584Q542 622 505 622Q468 622 466 584Z" fill="${MOUTH}" stroke="${EYE}" stroke-width="8"/>` +
      `<path d="M488 612Q488 658 506 658Q524 658 524 612Z" fill="${TONGUE}" stroke="${EYE}" stroke-width="8"/><path d="M506 618V640" stroke="#C75A68" stroke-width="5"/>`,
  })],
  ["Wink", () => tile({
    face: blush(34, 19, "#F07C7C") + E(`<ellipse cx="355" cy="575" rx="43" ry="68" fill="#1E0612"/><circle cx="358" cy="550" r="12.5" fill="#fff"/><circle cx="347" cy="600" r="5.5" fill="#fff" opacity=".9"/>` +
      line("M612 585Q655 540 698 585", 13)) + smile("M462 580Q505 614 548 580", 9),
  })],
  ["Shocked", () => tile({
    face: blush(27, 15, "#EE8383", 0.9) + line("M312 508Q355 478 398 508M612 502Q655 472 698 502", 10) +
      E(`<circle cx="355" cy="580" r="52" fill="#1E0612"/><circle cx="655" cy="575" r="52" fill="#1E0612"/><circle cx="358" cy="560" r="14" fill="#fff"/><circle cx="648" cy="553" r="14" fill="#fff"/>`) +
      `<ellipse cx="505" cy="618" rx="21" ry="28" fill="${MOUTH}" stroke="${EYE}" stroke-width="8"/>`,
    front: line("M505 62V108M396 82L424 120M614 82L586 120", 14, INK),
  })],
  ["Laughing", () => tile({
    face: blush(35, 20, "#F07C7C") + happyEyes(14) + openMouth(1.15),
    front: burst(95, 340, -150, 50, 20, 3, 13) + burst(905, 340, -30, 50, 20, 3, 13),
  })],
];

const activities = [
  ["Drinking boba", () => tile({ face: blush(33, 18, "#F07C7C") + happyEyes(13) + smile("M470 578Q505 604 540 578", 9), front: boba() })],
  ["Listening to music", () => tile({
    face: blush(33, 18, "#F07C7C") + happyEyes(13) + smile("M470 578Q505 604 540 578", 9), caps: headphones(),
    front: note(120, 640, 1.3, -10) + note(895, 580, 1.15, 12),
  })],
  ["Watching", () => tile({
    face: blush() + eyes({ rx: 45, ry: 66, hr: 13, dy: 4, hdy: 6 }) + line("M485 602H525", 8), front: screen(),
  })],
  ["Celebrating", () => tile({ face: blush(34, 19, "#F07C7C") + eyes({ rx: 45, ry: 70 }) + openMouth(1), behind: confetti() })],
  ["Sending a kiss", () => tile({
    face: blush(34, 19, "#F07C7C") + E(`<ellipse cx="355" cy="575" rx="43" ry="68" fill="#1E0612"/><circle cx="358" cy="550" r="12.5" fill="#fff"/><circle cx="347" cy="600" r="5.5" fill="#fff" opacity=".9"/>` +
      line("M612 585Q655 540 698 585", 13)) +
      `<path d="M489 600Q489 586 505 592Q521 586 521 600Q521 612 505 622Q489 612 489 600Z" fill="#E4636F" stroke="${EYE}" stroke-width="7"/>`,
    front: heart(868, 500, 1.05, PINK, 14),
  })],
];


// ---- more little activities -------------------------------------------------
const outline = (d, fill, w = 10, extra = "") => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" ${extra}/>`;
const flowerHead = (x, y, r = 30, petal = "#FF8FB8", mid = "#FFD166") =>
  [0, 72, 144, 216, 288].map((a) => {
    const px = f(x + Math.cos(((a - 90) * Math.PI) / 180) * r), py = f(y + Math.sin(((a - 90) * Math.PI) / 180) * r);
    return `<circle cx="${px}" cy="${py}" r="${f(r * 0.72)}" fill="${petal}" stroke="${INK}" stroke-width="8"/>`;
  }).join("") + `<circle cx="${x}" cy="${y}" r="${f(r * 0.5)}" fill="${mid}" stroke="${INK}" stroke-width="7"/>`;
const flowerProp = () => {
  const stem = "M862 860Q842 780 822 700";
  return `<path d="${stem}" stroke="${INK}" stroke-width="24" data-keep="1"/><path d="${stem}" stroke="#6CC27A" stroke-width="12"/>` +
    outline("M846 800Q890 780 900 740Q860 745 846 800Z", "#6CC27A", 8) + flowerHead(822, 660, 34);
};
const crown = () => `<g transform="translate(506 160) scale(1.2) translate(-506 -150)">` +
  outline("M436 152L424 80L470 116L506 64L542 116L588 80L576 152Q506 166 436 152Z", GOLD, 11) +
  `<path d="M440 134Q506 148 572 134" stroke="${INK}" stroke-width="8" fill="none"/>` +
  `<circle cx="506" cy="108" r="11" fill="#FF6FA0" stroke="${INK}" stroke-width="6"/><circle cx="470" cy="136" r="7" fill="#5BC0EB" stroke="${INK}" stroke-width="5"/><circle cx="542" cy="136" r="7" fill="#5BC0EB" stroke="${INK}" stroke-width="5"/>` +
  `<path d="M442 112L438 98" stroke="#fff" stroke-opacity=".8" stroke-width="7" fill="none"/>` + `</g>`;
const gift = () =>
  outline("M436 742H574V842Q574 848 566 848H444Q436 848 436 842Z", "#C9B6F2", 10) +
  outline("M424 704H586V744H424Z", "#B49AEA", 10) +
  `<path d="M505 704V848" stroke="${INK}" stroke-width="34"/><path d="M505 704V848" stroke="#FF9BC0" stroke-width="22"/>` +
  outline("M505 700Q450 650 470 680Q462 706 505 704Z", "#FF9BC0", 9) + outline("M505 700Q560 650 540 680Q548 706 505 704Z", "#FF9BC0", 9) +
  `<circle cx="505" cy="702" r="14" fill="#FF7FA6" stroke="${INK}" stroke-width="8"/>`;
const scarf = () => {
  const stripes = [270, 320, 370, 420, 470, 520, 570, 620, 670, 720].map((x) => `<path d="M${x} ${f(668 + Math.abs(x - 505) * 0.05)}V${f(710 + Math.abs(x - 505) * 0.05)}" stroke="#7FD1B0" stroke-width="8" fill="none"/>`).join("");
  return outline("M236 662Q505 708 797 662L801 712Q505 760 232 712Z", "#A8E6CF", 11) + stripes +
    outline("M580 726L664 722L676 812L596 820Z", "#A8E6CF", 11) + outline("M650 722L722 724L726 794L664 800Z", "#8FDDBE", 11) +
    `<path d="M598 790H668M606 808H672M668 758H722M668 776H722" stroke="#7FD1B0" stroke-width="7" fill="none"/>`;
};
const cookie = () => outline("M505 676A66 66 0 1 0 505.1 676Z", "#E0A765", 11) +
  [[478, 714, 11], [534, 706, 10], [510, 748, 11], [470, 764, 9], [548, 758, 9]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="#5A3A2E" transform="rotate(${x % 40} ${x} ${y})"/>`).join("") +
  `<path d="M446 726Q452 708 470 700" stroke="#fff" stroke-opacity=".6" stroke-width="7" fill="none"/>`;
const camera = () =>
  outline("M452 648L468 630H542L558 648Z", "#8FB8D8", 9) +
  outline("M394 646H616Q630 646 630 662V762Q630 778 616 778H394Q380 778 380 762V662Q380 646 394 646Z", "#A7D8F0", 11) +
  `<circle cx="505" cy="712" r="48" fill="#5B6C8F" stroke="${INK}" stroke-width="10"/><circle cx="505" cy="712" r="30" fill="#7F93BB" stroke="${INK}" stroke-width="6"/><circle cx="494" cy="700" r="9" fill="#fff"/>` +
  `<circle cx="590" cy="670" r="9" fill="#FFD166" stroke="${INK}" stroke-width="6"/><path d="M398 668H430" stroke="#fff" stroke-opacity=".8" stroke-width="7" fill="none"/>`;
const easel = () =>
  `<path d="M889 700L846 884M889 700L930 884M889 690V884" stroke="${INK}" stroke-width="22"/><path d="M889 700L846 884M889 700L930 884M889 690V884" stroke="#C99A62" stroke-width="10"/>` +
  outline("M836 560H940V690H836Z", "#FFF7E6", 10) + flowerHead(888, 598, 14, "#FF8FB8", "#FFD166") + `<path d="M888 614V672" stroke="#6CC27A" stroke-width="7" fill="none"/>` + `<path d="M888 650Q870 640 864 626" stroke="#6CC27A" stroke-width="6" fill="none"/>`;
const palette = () => outline("M800 890Q800 862 840 858Q890 856 928 866Q946 884 920 902Q890 912 856 910Q820 908 800 890Z", "#F3D9A8", 9) +
  [[830, 880, "#FF6FA0"], [858, 872, "#5BC0EB"], [888, 880, "#FFD166"], [912, 888, "#7BD389"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="${INK}" stroke-width="5"/>`).join("");
const piece = (x, y, c, rot) =>
  `<g transform="translate(${x} ${y}) rotate(${rot} 50 50) scale(1.15)"><g stroke="${INK}" stroke-width="12" fill="${c}"><rect x="0" y="0" width="100" height="100" rx="10"/><circle cx="50" cy="-8" r="19"/><circle cx="108" cy="50" r="19"/></g><g fill="${c}"><rect x="0" y="0" width="100" height="100" rx="10"/><circle cx="50" cy="-8" r="19"/><circle cx="108" cy="50" r="19"/></g><path d="M12 22Q14 12 26 12" stroke="#fff" stroke-opacity=".7" stroke-width="7" fill="none"/></g>`;
const puzzle = () => piece(285, 800, "#FF8FB8", -8) + piece(440, 812, "#8FD3FF", 4) + piece(590, 800, "#FFD166", -5);
const butterfly = () => `<g transform="translate(872 590) rotate(12)">` +
  outline("M0 0C-10 -50 -60 -62 -66 -28C-70 -4 -34 12 0 0Z", "#C9B6F2", 9) + outline("M0 0C10 -50 60 -62 66 -28C70 -4 34 12 0 0Z", "#C9B6F2", 9) +
  outline("M0 4C-8 30 -44 50 -48 26C-50 12 -24 2 0 4Z", "#FFB6D9", 9) + outline("M0 4C8 30 44 50 48 26C50 12 24 2 0 4Z", "#FFB6D9", 9) +
  `<ellipse cx="0" cy="0" rx="7" ry="22" fill="${INK}"/><path d="M0 -18Q-8 -42 -20 -50M0 -18Q8 -42 20 -50" stroke="${INK}" stroke-width="6" fill="none"/>` +
  `<circle cx="-36" cy="-28" r="8" fill="#fff" opacity=".8"/><circle cx="36" cy="-28" r="8" fill="#fff" opacity=".8"/></g>`;
const bubble = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#D8F0FF" fill-opacity=".65" stroke="${INK}" stroke-width="8"/><path d="M${f(x - r * 0.55)} ${f(y - r * 0.1)}Q${f(x - r * 0.5)} ${f(y - r * 0.55)} ${f(x - r * 0.1)} ${f(y - r * 0.6)}" stroke="#fff" stroke-width="${f(Math.max(5, r * 0.16))}" fill="none"/><circle cx="${f(x + r * 0.45)}" cy="${f(y + r * 0.42)}" r="${f(Math.max(3.5, r * 0.1))}" fill="#fff"/>`;
const pucker = `<path d="M492 604Q492 592 505 598Q518 592 518 604Q518 616 505 624Q492 616 492 604Z" fill="#E4636F" stroke="${EYE}" stroke-width="7"/>`;
const rosy = blush(34, 19, "#F07C7C");
const smallSmile = smile("M470 578Q505 604 540 578", 9);
activities.push(
  ["Holding a flower", () => tile({ face: rosy + happyEyes(13) + smallSmile, behind: flowerProp() })],
  ["Crowned", () => tile({ face: rosy + eyes({ rx: 44, ry: 66 }) + smile("M455 572Q505 616 556 572", 9), caps: crown() })],
  ["Giving a gift", () => tile({ face: rosy + eyes({ rx: 46, ry: 70, hr: 14 }) + openMouth(0.7), front: gift() })],
  ["Cozy scarf", () => tile({ face: rosy + happyEyes(13) + smallSmile, front: scarf() })],
  ["Cookie time", () => tile({ face: rosy + eyes({ rx: 45, ry: 68 }) + openMouth(0.55), front: cookie() })],
  ["Taking a photo", () => tile({ face: rosy + eyes({ rx: 45, ry: 60, dy: 4, hr: 11, extra: false }) + smallSmile, front: camera() })],
  ["Painting", () => tile({ face: rosy + eyes({ rx: 44, ry: 62, dy: 4, hr: 11 }) + smile("M470 580Q505 606 540 580", 9), behind: easel(), front: palette() })],
  ["Solving a puzzle", () => tile({ face: rosy + eyes({ rx: 44, ry: 60, dy: 6, hr: 11, extra: false }) + line("M488 606Q505 598 522 606", 8), front: puzzle() })],
  ["Watching a butterfly", () => tile({ face: rosy + eyes({ rx: 46, ry: 71, hr: 14 }) + smallSmile, front: butterfly() })],
  ["Blowing bubbles", () => tile({ face: rosy + eyes({ rx: 46, ry: 70, hr: 14 }) + pucker, front: bubble(150, 590, 46) + bubble(95, 490, 26) + bubble(880, 590, 36) })],
);

export const groups = [
  { title: "Happy & loved", desc: "Four joyful reactions: super happy, shy, proud and in love.", tiles: happy },
  { title: "Sad", desc: "Four gentle sad moods: crying, disappointed, worried and heartbroken.", tiles: sad },
  { title: "Funny", desc: "Four silly reactions: silly, winking, shocked and laughing.", tiles: funny },
  { title: "Little activities", desc: "Fifteen small everyday moments: boba, music, a flower, a crown, a gift, a cozy scarf, a cookie, photos, painting, a puzzle, a butterfly and bubbles.", tiles: activities },
];
export default groups;
