// Drawings for Navigation & Direction and Actions & Controls. 24 x 24, stroke 1.8, round caps and joins.
import { S, B, D, F, C, K, M, G, P, L, N, T, circ, rect, dot, dotD, roundedPoly } from "./dsl.mjs";

const rot = (parts, k) => T(parts, { rot: k });
const flipX = (parts) => T(parts, { flipX: true });
const flipY = (parts) => T(parts, { flipY: true });

// ---- families ------------------------------------------------------------------------------
const arrowUp = [S("M12 19V5M6 11l6-6 6 6")];
const diagUR = [S("M7 17L17 7M8.5 7H17v8.5")];
const chevUp = [S("M6 15l6-6 6 6")];
const dChevUp = [S("M6 12l6-6 6 6M6 19l6-6 6 6")];
const caretUp = [B("M7 15l5-6 5 6Z")];
const upDown = [S("M8 20V4M4.5 7.5L8 4l3.5 3.5M16 4v16M12.5 16.5L16 20l3.5-3.5")];
// the Line version follows the reference drawing exactly, with a thinner stroke so its long thin notch stays open
const PLANE_PTS = [[21.5, 3.2], [2.5, 9.7], [8.2, 12.9], [15.7, 7.9], [10.3, 15.1], [13.6, 20.8]];
const PLANE_LINE = "M21.5 3.2L2.5 9.7L8.2 12.9L15.7 7.9L10.3 15.1L13.6 20.8Z";
// Solid and Duotone: the same shape as a plain fill with softly rounded corners (the notch apex stays sharp)
const PLANE_FILL = roundedPoly(PLANE_PTS, [1.2, 1.1, 0.4, 0, 0.5, 1.1]);
const refresh = [S("M5.45 7.41A8 8 0 0 1 17.66 6.34L20 8.5M20 4v4.5h-4.5M18.55 16.59A8 8 0 0 1 6.34 17.66L4 15.5M4 20v-4.5h4.5")];
const reload = [S("M19.3 15.4A8 8 0 1 1 17.7 6.4L20 8.5M20 4v4.5h-4.5")];
// Thumbs up, traced from the reference: a separate cuff and a hand with the thumb and two finger bumps.
// Line is a thin outline with the cuff touching the hand; Solid and Duotone are fills with a small gap between them.
const HAND_LINE = "M8.88 11.03C10.52 9.9 11.36 7.92 11.85 5.94C12.05 4.7 12.64 3.91 13.53 3.91C14.62 3.91 15.22 5.09 15.12 6.28C15.02 7.42 14.62 8.66 14.23 9.65L18.78 9.55C20.17 9.45 21.16 10.24 21.06 11.53C20.96 12.52 20.46 13.01 19.77 13.26C20.56 13.71 20.86 14.35 20.56 15.09C20.37 15.69 19.67 16.08 18.98 16.38C19.87 16.78 20.17 17.57 19.87 18.46C19.47 19.45 18.48 19.8 17.2 19.8L10.27 19.8C9.53 19.8 8.98 19.45 8.88 18.76Z";
const CUFF_LINE = "M4.43 10.24L7.1 10.24C7.7 10.24 8.19 10.73 8.19 11.33L8.19 18.71C8.19 19.31 7.7 19.8 7.1 19.8L4.43 19.8C3.83 19.8 3.34 19.31 3.34 18.71L3.34 11.33C3.34 10.73 3.83 10.24 4.43 10.24Z";
const HAND_FILL = "M9.13 11.03C10.52 9.9 11.36 7.92 11.85 5.94C12.05 4.7 12.64 3.91 13.53 3.91C14.62 3.91 15.22 5.09 15.12 6.28C15.02 7.42 14.62 8.66 14.23 9.65L18.78 9.55C20.17 9.45 21.16 10.24 21.06 11.53C20.96 12.52 20.46 13.01 19.77 13.26C20.56 13.71 20.86 14.35 20.56 15.09C20.37 15.69 19.67 16.08 18.98 16.38C19.87 16.78 20.17 17.57 19.87 18.46C19.47 19.45 18.48 19.8 17.2 19.8L10.27 19.8C9.53 19.8 9.23 19.45 9.13 18.76Z";
const CUFF_FILL = "M4.03 9.8L6.6 9.8C7.26 9.8 7.79 10.33 7.79 10.99L7.79 18.95C7.79 19.61 7.26 20.14 6.6 20.14L4.03 20.14C3.38 20.14 2.84 19.61 2.84 18.95L2.84 10.99C2.84 10.33 3.38 9.8 4.03 9.8Z";
const like = [L(CUFF_LINE, 1.3), L(HAND_LINE, 1.3), P(CUFF_FILL), N(HAND_FILL, 0.92)];
const reply = [S("M9 6L4 11l5 5M4 11h9a7 7 0 0 1 7 7v1")];
const rewind = [B("M3 6l8 6-8 6Z"), B("M12 6l8 6-8 6Z")];
const circleArrow = (d) => [B(circ(12, 12, 9)), D(d)];

export const navigation = {
  "Arrow Up": arrowUp,
  "Arrow Down": rot(arrowUp, 2),
  "Arrow Left": rot(arrowUp, 3),
  "Arrow Right": rot(arrowUp, 1),
  "Arrow Up Left": rot(diagUR, 3),
  "Arrow Up Right": diagUR,
  "Arrow Down Left": rot(diagUR, 2),
  "Arrow Down Right": rot(diagUR, 1),
  "Chevron Up": chevUp,
  "Chevron Down": rot(chevUp, 2),
  "Chevron Left": rot(chevUp, 3),
  "Chevron Right": rot(chevUp, 1),
  "Double Chevron Up": dChevUp,
  "Double Chevron Down": rot(dChevUp, 2),
  "Double Chevron Left": rot(dChevUp, 3),
  "Double Chevron Right": rot(dChevUp, 1),
  "Caret Up": caretUp,
  "Caret Down": rot(caretUp, 2),
  "Caret Left": rot(caretUp, 3),
  "Caret Right": rot(caretUp, 1),
  "Arrow Up Down": upDown,
  "Arrow Left Right": rot(upDown, 1),
  Move: [S("M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3")],
  "External Link": [S("M14 4h6v6M20 4l-8.5 8.5M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4")],
  Expand: [S("M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7")],
  Collapse: [S("M20 10h-6V4M14 10l7-7M4 14h6v6M10 14l-7 7")],
  Maximize: [B(rect(3.5, 3.5, 17, 17, 4.5)), D("M9.5 14.5l5-5M10 9.5h4.5V14")],
  Minimize: [B(rect(3.5, 3.5, 17, 17, 4.5)), D("M14.5 9.5l-5 5M9.5 10v4.5H14")],
  Enter: [S("M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3")],
  Exit: [S("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9")],
  Back: circleArrow("M15 12H9M12 9l-3 3 3 3"),
  Forward: circleArrow("M9 12h6M12 9l3 3-3 3"),
  Undo: [S("M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11")],
  Redo: flipX([S("M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11")]),
  Refresh: refresh,
  Reload: reload,
  Rotate: [B(rect(4, 10, 10, 10, 2.5)), S("M8 5h6a5 5 0 0 1 5 5v1.5M16.5 9l2.5 2.5L21.5 9")],
  Switch: [S("M7 4L3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7")],
  Shuffle: [S("M3 6h4c4 0 6 12 10 12h4M18 15l3 3-3 3M3 18h4c1.2 0 2.2-.6 3.2-1.8M13.8 7.8C14.8 6.6 15.8 6 17 6h4M18 3l3 3-3 3")],
  Sync: [S("M3 11V9a3 3 0 0 1 3-3h14M17 3l3 3-3 3M21 13v2a3 3 0 0 1-3 3H4M7 15l-3 3 3 3")],
};

export const actions = {
  Add: [S("M12 5v14M5 12h14")],
  Remove: [S("M5 12h14")],
  Close: [S("M6 6l12 12M18 6L6 18")],
  Check: [S("M5 12.5l4.5 4.5L19 7")],
  "Check Circle": [B(circ(12, 12, 9)), D("M8 12.5l2.8 2.8L16 9.5")],
  "Check Square": [B(rect(3, 3, 18, 18, 5)), D("M8 12.5l2.8 2.8L16 9.5")],
  Delete: [B("M9.5 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9.5L3 12Z"), D("M12.5 9.5l5 5M17.5 9.5l-5 5")],
  Edit: [S("M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"), B("M17.5 3.5l3 3L12 15l-4 1 1-4Z")],
  Pencil: [B("M16 4l4 4L8.5 19.5 4 20l.5-4.5Z"), D("M13.5 6.5l4 4")],
  Copy: [B(rect(9, 9, 12, 12, 3)), S("M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2")],
  Duplicate: [B(rect(8, 8, 13, 13, 3)), D("M14.5 11.5v6M11.5 14.5h6"), S("M4.5 16V7a3 3 0 0 1 3-3H16")],
  Cut: [S(circ(6, 6.5, 2.5)), S(circ(6, 17.5, 2.5)), S("M8 8l12 9M8 16L20 7")],
  Paste: [B(rect(5, 4, 14, 17, 3)), D("M9 12h6M9 16h4"), B(rect(9, 2.5, 6, 3.5, 1.5))],
  Save: [B("M5 3h11l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"), D("M8 3v5h7V3"), D("M7 21v-6h10v6")],
  Download: [S("M12 4v11M7.5 10.5L12 15l4.5-4.5M4 19h16")],
  Upload: [S("M12 15V4M7.5 8.5L12 4l4.5 4.5M4 19h16")],
  Share: [S("M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"), B(circ(18, 5.5, 2.5)), B(circ(6, 12, 2.5)), B(circ(18, 18.5, 2.5))],
  // a paper plane with a thin notch cut in from the lower left. Line uses a thinner outline so the notch stays open; Solid and Duotone are plain fills
  Send: [L(PLANE_LINE, 1.3), P(PLANE_FILL), G("M8.2 12.9L15.7 7.9L10.3 15.1Z")],
  Import: [S("M12 3v11M8 10l4 4 4-4M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3")],
  Export: [S("M12 14V3M8 7l4-4 4 4M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3")],
  Print: [S("M7 8V3h10v5"), B("M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2Z"), D(rect(7, 14, 10, 7, 1.5))],
  Preview: [B(rect(3, 5, 18, 14, 3)), D("M7 12c1.5-2.2 3-3 5-3s3.5.8 5 3c-1.5 2.2-3 3-5 3s-3.5-.8-5-3Z"), dotD(12, 12, 2.6)],
  View: [S("M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"), S("M7.5 12c1.2-1.8 2.8-2.7 4.5-2.7s3.3.9 4.5 2.7c-1.2 1.8-2.8 2.7-4.5 2.7S8.7 13.8 7.5 12Z"), dot(12, 12, 1.2)],
  Hide: [S("M3 9c2.5 4.5 6 6.5 9 6.5s6.5-2 9-6.5M6.8 14l-2 2.8M12 16v3.4M17.2 14l2 2.8")],
  Show: [B(rect(3, 3, 18, 18, 5)), D("M7 12c1.4-2 3-3 5-3s3.6 1 5 3c-1.4 2-3 3-5 3s-3.6-1-5-3Z"), dotD(12, 12, 2.6)],
  Lock: [B(rect(5, 10.5, 14, 10.5, 3)), S("M8 10.5V8a4 4 0 0 1 8 0v2.5"), D("M12 15v2")],
  Unlock: [B(rect(5, 10.5, 14, 10.5, 3)), S("M8 10.5V8a4 4 0 0 1 7.6-1.7"), D("M12 15v2")],
  Pin: [B("M9 3.5h6l-1 5.5 3 3.5V15H7v-2.5L10 9Z"), S("M12 15v6")],
  Unpin: [B("M9 3.5h6l-1 5.5 3 3.5V15H7v-2.5L10 9Z"), S("M12 15v6"), K("M4 4l16 16")],
  Bookmark: [B("M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4Z")],
  Flag: [S("M5 21V4"), B("M5 4h12l-2.5 4 2.5 4H5")],
  Star: [B("M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.9Z")],
  Favorite: [B("M12 20S3.5 14.8 3.5 9a4.6 4.6 0 0 1 8.5-2.4A4.6 4.6 0 0 1 20.5 9C20.5 14.8 12 20 12 20Z")],
  Like: like,
  Dislike: flipY(like),
  Reply: reply,
  "Forward Message": flipX(reply),
  "Reply All": [S("M8 7l-5 5 5 5M13 7l-5 5 5 5M10 12h4a6 6 0 0 1 6 6v1")],
  Archive: [B(rect(3, 4, 18, 5, 1.5)), B("M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9Z"), D("M10 13h4")],
  Restore: [B(rect(3, 4, 18, 5, 1.5)), B("M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9Z"), D("M12 17v-5M9.5 14.5L12 12l2.5 2.5")],
  Trash: [S("M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"), B("M6 7h12l-.9 12a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9Z"), D("M10 11v6M14 11v6")],
  Clear: [B("M4.3 13.5l8-8a2 2 0 0 1 2.8 0l4.4 4.4a2 2 0 0 1 0 2.8L12 18.2H8.5Z"), D("M8 9.5l6.5 6.5"), S("M10.5 20.5H20")],
  Reset: [S("M4.7 15.4A8 8 0 1 0 6.3 6.4L4 8.5M4 4v4.5h4.5")],
  Apply: [S("M5 10.5l4.5 4.5L19 5.5M5 20h14")],
  Confirm: [S("M2.5 13l4.5 4.5 8-9.5M12 15.5l1.5 1.5 8-9.5")],
  Cancel: [B(rect(3, 3, 18, 18, 5)), D("M8.5 8.5l7 7M15.5 8.5l-7 7")],
  Submit: [B(rect(2.5, 5, 19, 14, 7)), D("M12 15.5v-7M8.8 11.5L12 8.3l3.2 3.2")],
  Continue: [S("M5 12h10M11 8l4 4-4 4M19 7v10")],
  Skip: [B("M5 5.5l9 6.5-9 6.5Z"), S("M18.5 5v14")],
  Start: [B(circ(12, 12, 9)), D("M10 9v6l5-3Z")],
  Stop: [B(rect(5, 5, 14, 14, 3))],
  Pause: [B(rect(6, 4.5, 4, 15, 1.5)), B(rect(14, 4.5, 4, 15, 1.5))],
  Play: [B("M8 5l11 7-11 7Z")],
  Resume: [S("M19.3 15.4A8 8 0 1 1 17.7 6.4L20 8.5M20 4v4.5h-4.5"), B("M10.5 9l4.5 3-4.5 3Z")],
  "Fast Forward": rewind,
  Rewind: flipX(rewind),
  More: [B(circ(12, 12, 9)), dotD(7.5, 12), dotD(12, 12), dotD(16.5, 12)],
  "More Horizontal": [dot(5, 12, 1.5), dot(12, 12, 1.5), dot(19, 12, 1.5)],
  "More Vertical": [dot(12, 5, 1.5), dot(12, 12, 1.5), dot(12, 19, 1.5)],
  Menu: [S("M4 7h16M4 12h16M4 17h16")],
};
