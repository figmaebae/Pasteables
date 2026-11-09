// Drawings for Search & Discovery, Interface Elements and Status & Feedback.
import { S, B, D, F, C, K, M, G, O, H, Q, T, circ, rect, gear, rosette, dash, dot, dotD, roundedPoly } from "./dsl.mjs";

const rot = (parts, k) => T(parts, { rot: k });
const flipX = (parts) => T(parts, { flipX: true });

const lens = [B(circ(10.5, 10.5, 6.5)), S("M15.5 15.5L20 20")];
const sliders = [S("M4 7h9M17 7h3M4 17h3M11 17h9"), B(circ(15, 7, 2)), B(circ(9, 17, 2))];
const corners = S("M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2");
const columns = [B(rect(3, 3, 4, 18, 1.5)), B(rect(10, 3, 4, 18, 1.5)), B(rect(17, 3, 4, 18, 1.5))];
const bell = [B("M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2.5h-15Z"), S("M10 21.5h4")];
const refresh = S("M5.45 7.41A8 8 0 0 1 17.66 6.34L20 8.5M20 4v4.5h-4.5M18.55 16.59A8 8 0 0 1 6.34 17.66L4 15.5M4 20v-4.5h4.5");
const cloud = B("M7 19a4.5 4.5 0 0 1-.4-8.98a6 6 0 0 1 11.5-1.1a4.8 4.8 0 0 1-.5 10.08Z");
const wifi = [S("M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"), dot(12, 19.5, 1.4)];
const battery = (bars) => [B(rect(2.5, 7, 17, 10, 2.5)), S("M22 10.5v3"), D(bars)];
const info = (shape) => [shape, D("M12 11v5.5"), dotD(12, 7.8, 2.6)];
const help = (shape) => [shape, D("M9.6 9.5a2.5 2.5 0 1 1 3.8 2.1c-.9.5-1.4 1-1.4 2"), dotD(12, 16.8, 2.6)];
const bang = (shape) => [shape, D("M12 7.5v5.5"), dotD(12, 16.5, 2.6)];
const square = B(rect(3, 3, 18, 18, 5));
const disc = B(circ(12, 12, 9));
const eyeSmall = "M7 12c1.4-2 3-3 5-3s3.6 1 5 3c-1.4 2-3 3-5 3s-3.6-1-5-3Z";

// Compass traced from the reference: a ring and a diamond needle split by a cross line.
// Line and Duotone are outlines (Duotone tints the disc and darkens the upper half of the needle); Solid is a disc with the needle cut out
// and a small triangle left inside its lower half.
const NEEDLE = { T: [16.4, 7.9], L: [10.4, 10.6], BL: [7.6, 16.6], R: [13.6, 13.6] };
const scaleAbout = (p, c, k) => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k];
const area = (pts) => pts.reduce((a, p, i) => a + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0);
const needleOuter = [NEEDLE.T, NEEDLE.L, NEEDLE.BL, NEEDLE.R].map((p) => scaleAbout(p, [12, 12.15], 1.13));
const lowerTri = [NEEDLE.L, NEEDLE.BL, NEEDLE.R];
const lowerC = [lowerTri.reduce((a, p) => a + p[0], 0) / 3, lowerTri.reduce((a, p) => a + p[1], 0) / 3];
let innerTri = lowerTri.map((p) => scaleAbout(p, lowerC, 0.62));
if (Math.sign(area(innerTri)) === Math.sign(area(needleOuter))) innerTri = innerTri.reverse(); // opposite winding makes it an island inside the hole
const poly = (pts) => "M" + pts.map((p) => p.join(" ")).join("L") + "Z";
const compassHole = roundedPoly(needleOuter, [1, 0.5, 1, 0.5]) + roundedPoly(innerTri, [0.3, 0.3, 0.3]);

export const search = {
  Search: lens,
  "Search Plus": [...lens, D("M10.5 8v5M8 10.5h5")],
  "Search Minus": [...lens, D("M8 10.5h5")],
  Filter: [B("M4 5h16l-6 7.5V19l-4 2v-8.5Z")],
  "Filter List": [S("M4 7h16M7 12h10M10 17h4")],
  "Funnel Classic": [B("M3 4h18l-7 9v6l-4 2v-8Z")],
  "Funnel Rounded": [B("M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5c0 .4-.15.8-.45 1.1L14 12.5V19l-4 2v-8.5L4.45 6.6A1.5 1.5 0 0 1 4 5.5Z")],
  "Tapered Filter": [S("M3 5h18M6 10h12M9 15h6M11 20h2")],
  "Filter Sliders": [S("M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"), B(circ(15, 6, 2)), B(circ(9, 12, 2)), B(circ(17, 18, 2))],
  "Filter Sliders Vertical": [S("M6 4v5M6 13v7M12 4v7M12 15v5M18 4v1M18 9v11"), B(circ(6, 11, 2)), B(circ(12, 13, 2)), B(circ(18, 7, 2))],
  "Filter Lines": [S("M3 7h18M6 12h12M9 17h6")],
  "Sort Filter": [S("M3 6h13M3 12h9M3 18h5M18 6v12M15.5 15.5L18 18l2.5-2.5")],
  "Add Filter": [B("M3 4h16l-6 7.5V17l-4 2v-7.5Z"), S("M18 15v6M15 18h6")],
  "Clear Filter": [B("M3 4h16l-6 7.5V17l-4 2v-7.5Z"), S("M16 16l5 5M21 16l-5 5")],
  "Filter Applied": [B("M3 4h16l-6 7.5V17l-4 2v-7.5Z"), S("M15.5 18.5l2 2 3.5-4")],
  "Filter Off": [B("M3 4h18l-7 9v6l-4 2v-8Z"), K("M3 3l18 18")],
  "Filter Active": [B("M2.5 6h14l-5.5 7v5.5l-3 1.5V13Z"), F(circ(19, 5.5, 2.5))],
  "Filter Square": [B(rect(3, 3, 18, 18, 4)), D("M7.5 8h9l-3.5 4.2V16l-2 1v-4.8Z")],
  "Filter Circle": [B(circ(12, 12, 9.5)), D("M7.5 8h9l-3.5 4.2V16l-2 1v-4.8Z")],
  "Funnel Solid": [F("M3 4h18l-7 9v6l-4 2v-8Z")],
  "Filter Search": [B("M3 4h16l-6 7.5V17l-4 2v-7.5Z"), S(circ(16, 16, 3)), S("M18.2 18.2L21 21")],
  "Smart Filter": [B("M3 4h16l-6 7.5V17l-4 2v-7.5Z"), S("M18 12l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z")],
  "Apply Filter": [B("M3 4h16l-6 7.5V17l-4 2v-7.5Z"), S("M18 14v7M15.5 18.5L18 21l2.5-2.5")],
  Sort: [S("M4 7h8M4 12h5M4 17h2M17 4v16M14 7l3-3 3 3M14 17l3 3 3-3")],
  "Sort Ascending": [S("M4 6h4M4 12h7M4 18h10M18 19V5M15 8l3-3 3 3")],
  "Sort Descending": [S("M4 6h10M4 12h7M4 18h4M18 5v14M15 16l3 3 3-3")],
  Funnel: [B("M5 4h14l-5.5 6.5V14L10.5 16v-5.5Z"), dot(12, 19.5, 1.2)],
  Sliders: sliders,
  Settings: [B(gear(12, 12, 8, 9.5, 7.4)), D(circ(12, 12, 2.8))],
  "Advanced Settings": [B(gear(12, 12, 6, 9.5, 7.2, 0.22)), D("M9.7 12h4.6M12 9.7v4.6")],
  Tune: rot(sliders, 1),
  Find: [...lens, D("M7.5 9.5a3.5 3.5 0 0 1 2.5-2.3")],
  "Zoom In": flipX([...lens, D("M10.5 8v5M8 10.5h5")]),
  "Zoom Out": flipX([...lens, D("M8 10.5h5")]),
  Scan: [corners, S("M4 12h16")],
  "Scan Search": [corners, B(circ(11, 11, 3.5)), S("M13.5 13.5l2.5 2.5")],
  // binoculars traced from the reference: lens rings + a body outline with two eyepiece bumps. Line and Duotone are outlines (Duotone tints the lenses); Solid is a silhouette with the lenses cut out.
  Discover: [Q("M2.89 14.35A4.16 4.16 0 1 0 11.21 14.35A4.16 4.16 0 1 0 2.89 14.35Z", 1.3), Q("M12.79 14.35A4.16 4.16 0 1 0 21.11 14.35A4.16 4.16 0 1 0 12.79 14.35Z", 1.3), Q("M11.21 14.35H12.79", 1.3), Q("M3.43 12.27L6.01 6.94C6.37 5.99 7.41 5.54 8.54 5.54C9.9 5.54 10.98 6.26 11.39 7.53L12.61 7.53C13.02 6.26 14.1 5.54 15.46 5.54C16.59 5.54 17.63 5.99 17.99 6.94L20.57 12.27", 1.3), G("M2.89 14.35A4.16 4.16 0 1 0 11.21 14.35A4.16 4.16 0 1 0 2.89 14.35Z"), G("M12.79 14.35A4.16 4.16 0 1 0 21.11 14.35A4.16 4.16 0 1 0 12.79 14.35Z"), O("M3.09 14.35A3.96 3.96 0 1 0 11.01 14.35A3.96 3.96 0 1 0 3.09 14.35Z", 1.3), O("M12.99 14.35A3.96 3.96 0 1 0 20.91 14.35A3.96 3.96 0 1 0 12.99 14.35Z", 1.3), O("M3.43 12.27L6.01 6.94C6.37 5.99 7.41 5.54 8.54 5.54C9.9 5.54 10.98 6.26 11.39 7.53L12.61 7.53C13.02 6.26 14.1 5.54 15.46 5.54C16.59 5.54 17.63 5.99 17.99 6.94L20.57 12.27L20.57 14.35L3.43 14.35Z", 1.3), O("M11.25 13.58H12.75V14.31H11.25Z", 1.3), H("M3.61 14.35A3.44 3.44 0 1 0 10.49 14.35A3.44 3.44 0 1 0 3.61 14.35Z"), H("M13.51 14.35A3.44 3.44 0 1 0 20.39 14.35A3.44 3.44 0 1 0 13.51 14.35Z")],
  Explore: [Q(circ(12, 12, 9), 1.3), Q(poly([NEEDLE.T, NEEDLE.L, NEEDLE.BL, NEEDLE.R]), 1.3), Q(poly([NEEDLE.L, NEEDLE.R]).replace("Z", ""), 1.3), G(circ(12, 12, 9)), G(poly([NEEDLE.T, NEEDLE.L, NEEDLE.R])), O(circ(12, 12, 8.85), 1.3), H(compassHole)],
};

export const interfaceElements = {
  Home: [B("M4 10.5L12 4l8 6.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"), D("M10 21v-6h4v6")],
  Dashboard: [B(rect(3, 3, 8, 10, 2)), B(rect(13, 3, 8, 6, 2)), B(rect(13, 11, 8, 10, 2)), B(rect(3, 15, 8, 6, 2))],
  Grid: [B(rect(3, 3, 7.5, 7.5, 2)), B(rect(13.5, 3, 7.5, 7.5, 2)), B(rect(3, 13.5, 7.5, 7.5, 2)), B(rect(13.5, 13.5, 7.5, 7.5, 2))],
  "Grid View": [3, 9.75, 16.5].flatMap((y) => [3, 9.75, 16.5].map((x) => B(rect(x, y, 4.5, 4.5, 1.3)))),
  "List View": [dot(4.5, 6.5, 1.3), dot(4.5, 12, 1.3), dot(4.5, 17.5, 1.3), S("M9 6.5h11M9 12h11M9 17.5h11")],
  Table: [B(rect(3, 4, 18, 16, 3)), D("M3 9.5h18M3 14.5h18M9.5 9.5V20")],
  Layout: [B(rect(3, 3, 18, 18, 3)), D("M3 9h18M9 21V9")],
  Sidebar: [B(rect(3, 4, 18, 16, 3)), D("M9 4v16"), D("M12.5 9h5M12.5 13h3")],
  Panel: [B(rect(3, 4, 18, 16, 3)), D("M3 15h18")],
  Window: [B(rect(3, 4, 18, 16, 3)), D("M3 9h18"), dotD(6.5, 6.5, 2), dotD(10, 6.5, 2)],
  "Browser Window": [B(rect(3, 4, 18, 16, 3)), D("M3 9h18"), dotD(6.5, 6.5, 2), D("M11 6.5h7"), D("M7 13.5h10")],
  // window frame traced from the reference. Line and Duotone are outlines (Duotone tints the title bar); Solid is two separate pieces with the dots cut out
  Modal: [Q("M4.43 5.04H19.57A1.73 1.73 0 0 1 21.3 6.77V17.23A1.73 1.73 0 0 1 19.57 18.96H4.43A1.73 1.73 0 0 1 2.7 17.23V6.77A1.73 1.73 0 0 1 4.43 5.04Z", 1.3), Q("M2.7 9.46H21.3", 1.3), Q("M5.19 7.33h.01", 1.5), Q("M7.58 7.33h.01", 1.5), Q("M9.97 7.33h.01", 1.5), G("M2.7 9.46V6.77A1.73 1.73 0 0 1 4.43 5.04H19.57A1.73 1.73 0 0 1 21.3 6.77V9.46Z"), O("M2.7 8.51V6.77A1.73 1.73 0 0 1 4.43 5.04H19.57A1.73 1.73 0 0 1 21.3 6.77V8.51Z", 1.3), O("M2.7 10.41H21.3V17.23A1.73 1.73 0 0 1 19.57 18.96H4.43A1.73 1.73 0 0 1 2.7 17.23Z", 1.3), H("M4.44 7.33A0.75 0.75 0 1 0 5.94 7.33A0.75 0.75 0 1 0 4.44 7.33Z"), H("M6.83 7.33A0.75 0.75 0 1 0 8.33 7.33A0.75 0.75 0 1 0 6.83 7.33Z"), H("M9.22 7.33A0.75 0.75 0 1 0 10.72 7.33A0.75 0.75 0 1 0 9.22 7.33Z")],
  // a window with an X and three burst lines, traced from the reference (the same drawing in all three styles; Solid fills the window and cuts the X out)
  Popup: [B("M4.72 8.59H16.07A1.79 1.79 0 0 1 17.86 10.38V17.96A1.79 1.79 0 0 1 16.07 19.75H4.72A1.79 1.79 0 0 1 2.93 17.96V10.38A1.79 1.79 0 0 1 4.72 8.59Z", 1.3), D("M13.75 10.4L15.75 12.4M15.75 10.4L13.75 12.4", 1.5), S("M16.17 3.92L16.5 6.37", 1.3), S("M19.94 4.86L18.05 6.98", 1.3), S("M21.35 7.78L18.99 8.44", 1.3)],
  Drawer: [B(rect(3, 4, 18, 16, 3)), D("M14.5 4v16"), D("M6.5 9h4M6.5 13h3")],
  // a card with three tabs and three dots, traced from the reference. Line and Duotone are outlines (Duotone tints the first tab); Solid is separate pieces: the body, three tabs lifted off it, and the dots cut out
  "Split View": [B(rect(3, 4, 18, 16, 3)), D("M12 4v16")],
  Columns: columns,
  Rows: rot(columns, 1),
  Stack: [B(rect(5, 3.5, 14, 3.6, 1.8)), B(rect(3, 10.2, 18, 3.6, 1.8)), B(rect(5, 16.9, 14, 3.6, 1.8))],
  Layers: [B("M12 3l9 4.5-9 4.5-9-4.5Z"), S("M3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5")],
  Section: [B(rect(3, 4, 18, 16, 3)), D("M7 9h6M7 13h10M7 16.5h7")],
  Container: [B("M12 3l8 4.5v9L12 21l-8-4.5v-9Z"), D("M4 7.5l8 4.5 8-4.5M12 12v9")],
  Widget: [B(rect(3, 3, 18, 18, 5)), D(rect(7.5, 7.5, 4, 4, 1)), D(rect(12.5, 12.5, 4, 4, 1))],
  Card: [B(rect(4, 3, 16, 18, 3)), D("M8 8h8M8 12h8M8 16h4")],
  Feed: [B(circ(5.5, 5.5, 2)), B(circ(5.5, 12, 2)), B(circ(5.5, 18.5, 2)), S("M10 5.5h11M10 12h11M10 18.5h11")],
  Sitemap: [B(rect(9, 3, 6, 5, 1.5)), B(rect(3, 16, 6, 5, 1.5)), B(rect(15, 16, 6, 5, 1.5)), S("M12 8v4M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2")],
  Breadcrumbs: [dot(4, 12, 1.4), S("M7.5 9l3 3-3 3"), dot(13.5, 12, 1.4), S("M17 9l3 3-3 3")],
  Pagination: [S("M5 8l-3 4 3 4M19 8l3 4-3 4"), dot(9, 12, 1.3), dot(12, 12, 1.3), dot(15, 12, 1.3)],
  Page: [B("M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"), D("M14 3v5h5"), D("M8 13h8M8 17h5")],
  "Page Layout": [B(rect(5, 3, 14, 18, 3)), D(rect(8, 6, 8, 5, 1)), D("M8 15h8M8 18h5")],
};

export const status = {
  Info: info(square),
  "Information Circle": info(disc),
  Help: help(square),
  "Help Circle": help(disc),
  Warning: [B("M12 3.5l9.5 16.5h-19Z"), D("M12 10v4.2"), dotD(12, 17.3, 2.6)],
  Alert: [
    Q("M6.2 18.8V13.6A5.8 5.8 0 0 1 17.8 13.6V18.8", 1.3),
    G("M6.2 18.8V13.6A5.8 5.8 0 0 1 17.8 13.6V18.8Z"),
    O("M6.2 17V13.6A5.8 5.8 0 0 1 17.8 13.6V17Z", 1.3),
    B(rect(4.15, 18.8, 15.7, 2.55, 1), 1.3),
    D("M12 10.1v3.4", 1.5),
    dotD(12, 15.8, 1.9),
    S("M12 2.2v3", 1.5), S("M4.6 4.7l2.4 2.6", 1.5), S("M19.4 4.7l-2.4 2.6", 1.5), S("M1.6 9.2l3.2 1.2", 1.5), S("M22.4 9.2l-3.2 1.2", 1.5),
  ],
  Error: bang(B("M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2Z")),
  "Error Circle": bang(disc),
  "Success Circle": [S("M21 12a9 9 0 1 1-4.2-7.6"), S("M8 11l4 4 9-10")],
  Notification: [...bell, dot(18, 5.5, 2.8)],
  Bell: bell,
  "Bell Off": [...bell, K("M4 4l16 16")],
  Loading: [S("M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1")],
  "Check Badge": [B(circ(12, 9, 6.5)), S("M8.5 14.5L7 21l5-2.5 5 2.5-1.5-6.5"), D("M9.5 9l2 2 3-3.5")],
  Verified: [B(rosette(12, 12, 10, 9.5, 8.2)), D("M8.5 12.2l2.5 2.5 4.5-5")],
  Pending: [disc, D("M9.5 8.5h5L12 12l2.5 3.5h-5L12 12Z")],
  Completed: [B(rect(5, 4, 14, 17, 3)), S("M9 4v-.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V4"), D("M8.5 13l2.5 2.5 4.5-5")],
  Failed: [disc, D("M9 9l6 6M15 9l-6 6")],
  Blocked: [disc, K("M5.6 5.6l12.8 12.8")],
  Disabled: [B(rect(3, 3, 18, 18, 5)), K("M7 17L17 7")],
  Signal: [S("M7.8 5.8a6 6 0 0 0 0 8.4M16.2 5.8a6 6 0 0 1 0 8.4M12 13v8M9.5 21h5"), dot(12, 10, 1.8)],
  "Signal Low": [B(rect(3.5, 15, 3.5, 6, 1)), M(rect(10.25, 11, 3.5, 10, 1)), M(rect(17, 7, 3.5, 14, 1))],
  "Signal High": [B(rect(3.5, 15, 3.5, 6, 1)), B(rect(10.25, 11, 3.5, 10, 1)), B(rect(17, 7, 3.5, 14, 1))],
  Battery: battery("M6.5 10.5v3M10 10.5v3"),
  "Battery Low": battery("M6.5 10.5v3"),
  "Battery Full": battery("M6.5 10.5v3M10 10.5v3M13.5 10.5v3"),
  "Wi-Fi": wifi,
  "Wi-Fi Off": [...wifi, S("M3 3l18 18")],
  Cloud: [cloud],
  "Cloud Off": [cloud, K("M4 4l16 16")],
  "Sync Error": [refresh, S("M12 8.5V12"), dot(12, 15.2, 1.1)],
  Update: [disc, D("M12 16V8M8.5 11.5L12 8l3.5 3.5")],
  New: [B("M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2Z")],
  Beta: [B("M10 3h4v6l5 9a2 2 0 0 1-1.8 3H6.8A2 2 0 0 1 5 18l5-9Z"), D("M7.5 15.5h9"), S("M9 3h6")],
};
