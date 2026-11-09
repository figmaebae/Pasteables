// Renders an icon in Line, Solid or Duotone, and produces the SVG / React / Flutter code. Pure functions, safe on server and client.
//
// Part roles (see scripts/icons/dsl.mjs): s stroke, b body, d detail, f fill, c cutout fill, k knockout line, m muted body, g backing.

import { pathBounds, roundCorners, tilePath } from "./corners";

export type IconStyle = "line" | "solid" | "duotone";
export const STYLES: { v: IconStyle; label: string }[] = [
  { v: "line", label: "Line" },
  { v: "solid", label: "Solid" },
  { v: "duotone", label: "Duotone" },
];

/** [role, path, width?, dashed?] */
export type IconPart = [string, string, number?, number?];
export interface IconDef {
  /** id, e.g. "arrow-up" */
  i: string;
  /** name, e.g. "Arrow Up" */
  n: string;
  /** category id */
  c: string;
  /** search keywords */
  k: string;
  p: IconPart[];
  /** date added */
  a: string;
}
export interface IconCategory {
  id: string;
  name: string;
  desc: string;
  count: number;
  /** Not listed as a category and not shown unless someone searches. */
  hidden?: boolean;
}
export interface IconLibraryData {
  collection: { id: string; name: string };
  categories: IconCategory[];
  icons: IconDef[];
}

export interface IconOptions {
  size?: number | string;
  /** A CSS color. Leave unset to follow the surrounding text color (currentColor). */
  color?: string;
  /** Corner radius for Solid and Duotone, in 24 x 24 icon units (0 = sharp). Leave unset to keep the drawn corners. */
  radius?: number | null;
  /** Line thickness on the 24 x 24 grid (default 1.8). Explicit widths on individual parts scale with it. */
  stroke?: number | null;
}

const SW = 1.8; // stroke width on the 24 x 24 grid
const TINT = 0.3; // secondary tone in Duotone
const MUTED = 0.35; // inactive parts (signal bars, battery level)
const TILE_MARGIN = 3.4; // empty space between a glyph-only icon's strokes and its tile edge, on every side
const TILE = "M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Z";
const KNOCK = 2.4; // extra width cut around a knockout line in Solid

const f = (n: number) => String(Math.round(n * 100) / 100);
const has = (parts: IconPart[], roles: string) => parts.some((p) => roles.includes(p[0]));

/** Icons with a closed body keep their own silhouette; the rest sit on a tile in Solid and Duotone. */
export const isGlyphOnly = (icon: IconDef) => !has(icon.p, "bmnpo");

const stroked = (p: IconPart, extra = "", k = 1) => {
  const w = p[2] ? ` stroke-width="${f(p[2] * k)}"` : "";
  const da = p[3] ? ` stroke-dasharray="${f(2 * k)} ${f(3 * k)}"` : "";
  return `<path d="${p[1]}"${w}${da}${extra}/>`;
};
const filled = (p: IconPart, extra = "") => `<path d="${p[1]}" fill="currentColor" stroke="none"${extra}/>`;

function lineParts(parts: IconPart[], k = 1): string {
  return parts
    .map((p) => {
      switch (p[0]) {
        case "g":
        case "p":
        case "n":
        case "o":
        case "h":
          return "";
        case "f":
        case "c":
          return filled(p);
        case "m":
          return stroked(p, ` stroke-opacity="${MUTED}"`, k);
        default:
          return stroked(p, "", k);
      }
    })
    .join("");
}

function duotoneParts(parts: IconPart[], k = 1, sharpJoin = ""): string {
  return parts
    .map((p) => {
      switch (p[0]) {
        case "g":
          return filled(p, ` fill-opacity="${TINT}"`);
        case "p":
          return filled(p);
        case "l":
        case "o":
        case "h":
          return "";
        case "b":
        case "n":
          return stroked(p, ` fill="currentColor" fill-opacity="${TINT}"${sharpJoin}`, k);
        case "m":
          return stroked(p, ` fill="currentColor" fill-opacity="0.1" stroke-opacity="${MUTED}"${sharpJoin}`, k);
        case "f":
        case "c":
          return filled(p);
        default:
          return stroked(p, "", k);
      }
    })
    .join("");
}

function cutMask(id: string, inner: string) {
  return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>${inner}</mask></defs>`;
}
/** Where a glyph sits inside its tile: scaled down if needed so the strokes keep TILE_MARGIN from the edge, and centred on its own bounds. */
const fitCache = new Map<string, { s: number; tf: string }>();
function glyphFit(icon: IconDef, sw = SW): { s: number; tf: string } {
  const key = `${icon.i}|${sw}`;
  const hit = fitCache.get(key);
  if (hit) return hit;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of icon.p) {
    if (p[0] === "g" || p[0] === "m") continue;
    const [a, b, c, d] = pathBounds(p[1]);
    x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d);
  }
  const room = Math.max(4, 20 - 2 * TILE_MARGIN - sw); // centre-line extent that fits once the stroke is added back
  const s = Math.min(1, room / Math.max(x1 - x0, y1 - y0, 1));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const out = { s, tf: `translate(12 12) scale(${f(s)}) translate(${f(-cx)} ${f(-cy)})` };
  fitCache.set(key, out);
  return out;
}
/** A glyph shrunk to fit its tile gets slightly thinner strokes (never below ~0.55 of full), so close strokes keep a gap. */
const strokeRatio = (icon: IconDef, sw = SW) => 0.55 + 0.45 * glyphFit(icon, sw).s;
const centred = (icon: IconDef, inner: string, sw = SW) => `<g transform="${glyphFit(icon, sw).tf}" stroke-width="${f((sw * strokeRatio(icon, sw)) / glyphFit(icon, sw).s)}">${inner}</g>`;

/** Everything inside the <svg>. */
export function iconInner(icon: IconDef, style: IconStyle, radius?: number | null, stroke?: number | null): string {
  const sw = stroke ?? SW;
  const u = sw / SW; // every explicit part width scales with the thickness
  const fit = glyphFit(icon, sw);
  const ratio = strokeRatio(icon, sw);
  const custom = radius != null && style !== "line";
  // corner radius only reshapes the filled bodies (and the tile behind glyph-only icons)
  const parts: IconPart[] = custom ? icon.p.map((p): IconPart => (p[0] === "b" || p[0] === "m" || p[0] === "g" || p[0] === "p" || p[0] === "n" || p[0] === "o" ? [p[0], roundCorners(p[1], radius), p[2], p[3]] : p)) : icon.p;
  const sharp = custom && radius === 0 ? ' stroke-linejoin="miter"' : "";
  const glyphOnly = isGlyphOnly(icon);
  const tile = parts.find((p) => p[0] === "g")?.[1] ?? (custom ? tilePath(radius) : TILE);

  if (style === "line") return lineParts(parts, u);

  if (style === "duotone") {
    if (glyphOnly) return `<path d="${tile}" fill="currentColor" fill-opacity="0.18" stroke="none"/>${centred(icon, lineParts(parts, (u * ratio) / fit.s), sw)}`;
    return duotoneParts(parts, u, sharp);
  }

  // solid
  const id = `pm-${icon.i}`;
  if (glyphOnly) {
    const cuts = parts
      .filter((p) => p[0] !== "g" && p[0] !== "m")
      .map((p) =>
        p[0] === "f" || p[0] === "c"
          ? `<path d="${p[1]}" fill="#000" stroke="none"/>`
          : `<path d="${p[1]}" fill="none" stroke="#000" stroke-width="${f((((p[2] ?? SW) * u) * ratio + 0.3) / fit.s)}"${p[3] ? ` stroke-dasharray="${f(2 / fit.s)} ${f(3 / fit.s)}"` : ""}/>`,
      )
      .join("");
    return `${cutMask(id, `<g transform="${fit.tf}">${cuts}</g>`)}<path d="${tile}" fill="currentColor" stroke="none" mask="url(#${id})"/>`;
  }
  const cuts = parts
    .map((p) => {
      if (p[0] === "d") return `<path d="${p[1]}" fill="none" stroke="#000"${p[2] ? ` stroke-width="${f(p[2] * u)}"` : ""}/>`;
      if (p[0] === "k") return `<path d="${p[1]}" fill="none" stroke="#000" stroke-width="${f((p[2] ?? SW) * u + KNOCK)}"/>`;
      if (p[0] === "c" || p[0] === "h") return `<path d="${p[1]}" fill="#000" stroke="none"/>`;
      return "";
    })
    .join("");
  const bodies = parts
    .filter((p) => p[0] === "b" || p[0] === "m" || p[0] === "n" || p[0] === "o")
    .map((p) => (p[0] === "o" ? `<path d="${p[1]}" fill="currentColor"${p[2] ? ` stroke-width="${f(p[2] * u)}"` : ' stroke="none"'}/>` : `<path d="${p[1]}" fill="currentColor"${sharp}${p[2] ? ` stroke-width="${f(p[2] * u)}"` : ""}${p[0] === "m" ? ` fill-opacity="${MUTED}" stroke-opacity="${MUTED}"` : ""}${p[3] ? ` stroke-dasharray="2 3"` : ""}/>`))
    .join("");
  const rest = parts
    .map((p) => (p[0] === "s" || p[0] === "k" ? stroked(p, "", u) : p[0] === "f" || p[0] === "p" ? filled(p) : ""))
    .join("");
  return `${cuts ? cutMask(id, cuts) : ""}<g${cuts ? ` mask="url(#${id})"` : ""}>${bodies}</g>${rest}`;
}

const sizeAttr = (s: number | string | undefined) => (s === undefined ? "24" : String(s));

/** A complete, clean SVG string. `color` is optional: without it the icon follows currentColor. */
export function iconSvg(icon: IconDef, style: IconStyle, o: IconOptions = {}): string {
  const size = sizeAttr(o.size);
  let svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${f(o.stroke ?? SW)}" stroke-linecap="round" stroke-linejoin="round">` +
    iconInner(icon, style, o.radius, o.stroke) +
    `</svg>`;
  if (o.color) svg = svg.replace(/currentColor/g, o.color);
  return svg;
}

/** Markup for showing the icon inside the page (decorative, follows the text color). */
export const iconMarkup = (icon: IconDef, style: IconStyle, size = 24, radius?: number | null, stroke?: number | null) =>
  iconSvg(icon, style, { size, radius, stroke }).replace("<svg ", '<svg aria-hidden="true" focusable="false" ');

export function pascal(name: string) {
  const p = name.replace(/[^A-Za-z0-9]+/g, " ").trim().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
  return /^[A-Za-z]/.test(p) ? p : `Icon${p}`;
}
export const componentName = (icon: IconDef, style: IconStyle) => `${pascal(icon.n)}${style === "line" ? "" : style === "solid" ? "Solid" : "Duotone"}Icon`;

const camel = (n: string) => n.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** One element per line, indented. `jsx` turns kebab-case attributes into camelCase. */
function pretty(markup: string, jsx: boolean, baseIndent: number) {
  const tokens = markup.replace(/>\s+</g, "><").match(/<[^>]+>/g) ?? [];
  const out: string[] = [];
  let depth = 0;
  for (const t of tokens) {
    if (t.startsWith("</")) depth -= 1;
    out.push("  ".repeat(depth + baseIndent) + (jsx ? t.replace(/ ([a-z]+(?:-[a-z]+)+)=/g, (_, n: string) => ` ${camel(n)}=`) : t));
    if (!t.startsWith("</") && !t.endsWith("/>")) depth += 1;
  }
  return out.join("\n");
}

const hexToDart = (hex: string) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return /^[0-9a-fA-F]{6}$/.test(full) ? `const Color(0xFF${full.toUpperCase()})` : null;
};

/** React component. The color is a prop (it follows the text color unless you pass one); a color picked in the studio becomes its default. */
export function iconToReact(icon: IconDef, style: IconStyle, o: IconOptions = {}): string {
  const name = componentName(icon, style);
  const colorProp = o.color ? `color = "${o.color}"` : "color";
  const root = `<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={${f(o.stroke ?? SW)}} strokeLinecap="round" strokeLinejoin="round" color={color} {...props}>`;
  return `import type { SVGProps } from "react";\n\nexport default function ${name}({ size = 24, ${colorProp}, ...props }: SVGProps<SVGSVGElement> & { size?: number | string }) {\n  return (\n    ${root}\n${pretty(iconInner(icon, style, o.radius, o.stroke), true, 3)}\n    </svg>\n  );\n}\n`;
}

/** Flutter widget (uses flutter_svg). The color follows the surrounding IconTheme unless you pass one; a color picked in the studio becomes its default. */
export function iconToFlutter(icon: IconDef, style: IconStyle, o: IconOptions = {}): string {
  const cls = componentName(icon, style);
  const dart = o.color ? hexToDart(o.color) : null;
  const svg = pretty(iconSvg(icon, style, { size: 24, radius: o.radius, stroke: o.stroke }), false, 0);
  return `import 'package:flutter/widgets.dart';\nimport 'package:flutter_svg/flutter_svg.dart';\n\n/// Needs the flutter_svg package: flutter pub add flutter_svg\nclass ${cls} extends StatelessWidget {\n  const ${cls}({super.key, this.size = 24, this.color${dart ? ` = ${dart}` : ""}});\n\n  final double size;\n  final Color? color;\n\n  static const String _svg = r\'\'\'\n${svg}\n\'\'\';\n\n  @override\n  Widget build(BuildContext context) {\n    final current = color ?? IconTheme.of(context).color ?? const Color(0xFF000000);\n    return SvgPicture.string(_svg, width: size, height: size, theme: SvgTheme(currentColor: current));\n  }\n}\n`;
}

/** Search across names, categories and keywords. Every word the user typed has to match; hyphens and spaces are ignored ("wifi" finds "Wi-Fi"). */
export function matches(icon: IconDef, categoryName: string, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = `${icon.n.toLowerCase()} ${categoryName.toLowerCase()} ${icon.k}`;
  const compact = hay.replace(/[\s-]+/g, "");
  return words.every((w) => hay.includes(w) || compact.includes(w.replace(/-/g, "")));
}
