// Pure SVG helpers (ported from the original artifact). Safe to run in the browser or on the server.

/** Ink colors used across the shelf. Anything drawn in one of these follows the ink option. */
export const INKS = ["#2B2430", "#3B2F45", "#2D3142"];
export const DEFAULT_INK = "#2B2430";
const OL = 2.8; // outline thickness around mascot limbs (matches the generator)
const num = (n: number) => String(Math.round(n * 100) / 100);
const esc = (hex: string) => hex.replace("#", "\\#");
function bodyRange(svg: string): [number, number] | null {
    const start = svg.indexOf('<g id="Body">');
    if (start < 0)
        return null;
    const re = /<g\b|<\/g>/g;
    re.lastIndex = start;
    let depth = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(svg))) {
        if (m[0] === "</g>") {
            depth -= 1;
            if (depth === 0)
                return [start, re.lastIndex];
        }
        else
            depth += 1;
    }
    return null;
}
/** True for white and near-white fills (e.g. the ghost's #FDFDFF). */
function isWhite(hex: string) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
    return [0, 2, 4].every((i) => parseInt(full.slice(i, i + 2), 16) >= 0xf8);
}
/** Turn filled body shapes into line art. Used for characters without a hand-built outlined version. */
function outlineBody(svg: string, k: number, ink: string) {
    const range = bodyRange(svg);
    if (!range)
        return svg;
    const [a, b] = range;
    const width = num(Math.max(2.5, 4.5 * k));
    const body = svg.slice(a, b).replace(/<(?:circle|ellipse|path|rect|polygon|polyline)\b[^>]*>/g, (tag: string) => {
        if (/stroke-opacity/.test(tag))
            return ""; // soft highlights
        const m = tag.match(/ fill="(#[0-9A-Fa-f]{3,8})"/);
        if (!m)
            return tag;
        const white = isWhite(m[1]);
        const color = white ? ink : m[1];
        const clean = tag
            .replace(/ stroke(?:-width|-linejoin|-linecap)?="[^"]*"/g, "")
            .replace(m[0], ` fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"`);
        return clean;
    });
    return svg.slice(0, a) + body + svg.slice(b);
}
/** Scale each eye around its own centre. Looks for the <g id="Eyes"> group every character has. */
function scaleEyes(svg: string, k?: number) {
    if (!k || k === 1)
        return svg;
    return svg.replace(/<g id="Eyes">([\s\S]*?)<\/g>/, (whole: string, inner: string) => {
        const els = inner.match(/<(circle|ellipse|path|rect)\b[^>]*?(?:\/>|><\/\1>)/g);
        if (!els || !els.length)
            return whole;
        const centres: [number, number][] = els.map((e): [number, number] => {
            const cx = e.match(/ cx="(-?[\d.]+)"/);
            const cy = e.match(/ cy="(-?[\d.]+)"/);
            if (cx && cy)
                return [parseFloat(cx[1]), parseFloat(cy[1])];
            const n = ((e.match(/ d="([^"]*)"/) ?? [])[1] ?? "").match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
            const xs = n.filter((_, i) => i % 2 === 0);
            const ys = n.filter((_, i) => i % 2 === 1);
            if (!xs.length || !ys.length)
                return [0, 0];
            return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
        });
        const mid = centres.reduce((a, c) => a + c[0], 0) / centres.length;
        const sides: string[][] = [[], []];
        const pts: [number, number][][] = [[], []];
        els.forEach((e, i) => {
            const side = centres[i][0] <= mid ? 0 : 1;
            sides[side].push(e);
            pts[side].push(centres[i]);
        });
        const groups = sides.map((g, i) => {
            if (!g.length)
                return "";
            const cx = pts[i].reduce((a, c) => a + c[0], 0) / pts[i].length;
            const cy = pts[i].reduce((a, c) => a + c[1], 0) / pts[i].length;
            return `<g transform="translate(${num(cx)} ${num(cy)}) scale(${num(k)}) translate(${num(-cx)} ${num(-cy)})">${g.join("")}</g>`;
        });
        return `<g id="Eyes">${groups.join("")}</g>`;
    });
}
export interface TransformOptions {
    from?: string;
    to?: string;
    outlined: boolean;
    stroke: number;
    ink: string;
    eyes?: number;
}
export function transformSvg(svg: string, o: TransformOptions) {
    let s = svg;
    if (o.from && o.to && o.from.toLowerCase() !== o.to.toLowerCase()) {
        s = s.replace(new RegExp(esc(o.from), "gi"), o.to);
    }
    const k = o.stroke;
    // 1. stroke scaling (done while the ink colors are still recognizable)
    if (k !== 1) {
        s = s.replace(/<[a-zA-Z][^>]*>/g, (tag: string) => {
            if (tag.startsWith("<svg"))
                return tag;
            if (/ data-ow="1"/.test(tag)) {
                // two-pass limb outline: only the part outside the white fill changes
                if (tag.startsWith("<circle"))
                    return tag.replace(/ r="([\d.]+)"/, (_: string, r: string) => ` r="${num(Math.max(0.1, +r - OL + OL * k))}"`);
                return tag.replace(/ stroke-width="([\d.]+)"/, (_: string, w: string) => ` stroke-width="${num(Math.max(0.2, +w - 2 * OL + 2 * OL * k))}"`);
            }
            if (/ data-bs="/.test(tag))
                return tag.replace(/ stroke-width="([\d.]+)"/, (_: string, w: string) => ` stroke-width="${num(+w * k)}"`);
            const lower = tag.toLowerCase();
            if (INKS.some((i) => lower.includes(`stroke="${i.toLowerCase()}"`))) {
                return tag.replace(/ stroke-width="([\d.]+)"/, (_: string, w: string) => ` stroke-width="${num(+w * k)}"`);
            }
            return tag;
        });
    }
    // 2. filled -> outlined (only for shapes without a hand-built outlined version)
    if (o.outlined && !/ data-bs="/.test(s)) {
        s = outlineBody(s, k, o.ink);
        // shoulder patches cover the limb outline where it joins the body; in line art they match the white limbs
        s = s.replace(/(<path data-jp="1"[^>]*? fill=")#[0-9A-Fa-f]{3,8}"/g, '$1#FFFFFF"');
    }
    // 3. ink color
    for (const i of INKS)
        s = s.replace(new RegExp(esc(i), "gi"), o.ink);
    // 4. eye size
    s = scaleEyes(s, o.eyes ?? 1);
    // 5. clean helper attributes
    return s.replace(/ data-(?:ow|bs|jp)="[^"]*"/g, "").trim();
}
// ---------- code export ----------
function pascal(name: string) {
    const p = name.replace(/[^A-Za-z0-9]+/g, " ").trim().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    return /^[A-Za-z]/.test(p) ? p : `Vector${p}`;
}
/** Re-indent an SVG string, collapsing empty elements into self-closing tags. */
function pretty(svg: string, convert: (t: string) => string, baseIndent: number) {
    const tokens = svg.replace(/>\s+</g, "><").match(/<[^>]+>|[^<]+/g) ?? [];
    const lines: string[] = [];
    let depth = 0;
    const pad = () => "  ".repeat(depth + baseIndent);
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.startsWith("</")) {
            depth -= 1;
            lines.push(pad() + t);
        }
        else if (t.startsWith("<")) {
            const name = (t.match(/^<([a-zA-Z0-9]+)/) ?? [])[1];
            if (t.endsWith("/>")) {
                lines.push(pad() + convert(t));
            }
            else if (tokens[i + 1] === `</${name}>`) {
                lines.push(pad() + convert(t).replace(/>$/, "/>"));
                i += 1;
            }
            else if (tokens[i + 1] && !tokens[i + 1].startsWith("<") && tokens[i + 2] === `</${name}>`) {
                lines.push(pad() + convert(t) + tokens[i + 1].trim() + tokens[i + 2]);
                i += 2;
            }
            else {
                lines.push(pad() + convert(t));
                depth += 1;
            }
        }
    }
    return lines.join("\n");
}
const camel = (n: string) => n.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
function jsxTag(tag: string) {
    return tag
        .replace(/ class=/g, " className=")
        .replace(/ (?!data-|aria-)([a-z]+(?:-[a-z]+)+)=/g, (_: string, n: string) => ` ${camel(n)}=`)
        .replace(/ xmlns:xlink=/g, " xmlnsXlink=")
        .replace(/ xlink:href=/g, " xlinkHref=");
}
function toReact(name: string, svg: string) {
    const body = pretty(svg, jsxTag, 2).replace(/^(\s*<svg\b[^>]*?)(\/?>)/, (_: string, a: string, end: string) => `${a} {...props}${end}`);
    return `import type { SVGProps } from "react";\n\nexport default function ${pascal(name)}(props: SVGProps<SVGSVGElement>) {\n  return (\n${body}\n  );\n}\n`;
}
function toFlutter(name: string, svg: string) {
    const cls = pascal(name);
    const clean = pretty(svg, (t) => t, 0);
    return `import 'package:flutter/widgets.dart';\nimport 'package:flutter_svg/flutter_svg.dart';\n\n/// Needs the flutter_svg package: flutter pub add flutter_svg\nclass ${cls} extends StatelessWidget {\n  const ${cls}({super.key, this.size});\n\n  final double? size;\n\n  static const String _svg = r'''\n${clean}\n''';\n\n  @override\n  Widget build(BuildContext context) {\n    return SvgPicture.string(_svg, width: size);\n  }\n}\n`;
}
export type Format = "svg" | "react" | "flutter";
export function formatOutput(name: string, svg: string, format: Format) {
    if (format === "react")
        return toReact(name, svg);
    if (format === "flutter")
        return toFlutter(name, svg);
    return svg;
}
export const FORMAT_LABEL: Record<Format, string> = { svg: "SVG", react: "React", flutter: "Flutter" };
