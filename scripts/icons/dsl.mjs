// Authoring toolkit for the Pasteables icon family (24 x 24 grid).
// Every icon is a list of parts; the site renders the same parts as Line, Solid and Duotone.
//
// Part roles:
//   S  stroke        open or closed outline that is always a stroke (arrows, shackles, rays)
//   B  body          closed shape: stroked in Line, filled in Solid, tinted + stroked in Duotone
//   D  detail        line drawn inside a body: stroked in Line/Duotone, cut out of the body in Solid
//   F  fill          small solid shape (dots, pupils) filled in every style
//   C  cutout fill   filled in Line/Duotone, a hole in Solid (radio dot, record dot)
//   K  knockout line a line crossing a body (slashes): stroked, and also cuts a gap in Solid
//   M  muted body    inactive part (signal bars, battery level) drawn at low opacity
//   G  backing       the soft shape behind a glyph in Duotone (and the filled tile in Solid for glyph-only icons)
//   L  line only     a stroke drawn only in Line (for icons whose Line version needs its own geometry or stroke width)
//   N  body, no line a body for Solid and Duotone that is not drawn in Line (the partner of L); its width sets the outline
//   Q  outline       a stroke drawn in Line and Duotone but not in Solid (for icons whose Solid is a separate silhouette)
//   O  solid fill    a fill drawn only in Solid (the silhouette of an icon whose Solid differs from its Line). Give it a width and it is drawn on the centre line with that outline added, so the Stroke and Corner radius sliders work on it
//   H  solid hole    a hole cut out of the Solid fills (lenses, windows); not drawn in Line or Duotone
//   P  primary fill  a plain fill with no outline, drawn in Solid and Duotone only (for icons whose Line version differs)

const R2 = (n) => Math.round(n * 100) / 100;

/** Absolute, normalised path: only M L C Q A Z. */
export function parse(d) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+/g);
  if (!toks) throw new Error("empty path: " + d);
  let i = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0, lcx = null, lcy = null;
  const out = [];
  const num = () => {
    const v = parseFloat(toks[i++]);
    if (Number.isNaN(v)) throw new Error("bad number in path: " + d);
    return v;
  };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    if (!cmd) throw new Error("path must start with a command: " + d);
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    if (C !== "S" && C !== "C") { lcx = null; lcy = null; }
    if (C === "M") { const nx = num() + ox, ny = num() + oy; out.push(["M", nx, ny]); x = sx = nx; y = sy = ny; cmd = rel ? "l" : "L"; }
    else if (C === "L") { x = num() + ox; y = num() + oy; out.push(["L", x, y]); }
    else if (C === "H") { x = num() + ox; out.push(["L", x, y]); }
    else if (C === "V") { y = num() + oy; out.push(["L", x, y]); }
    else if (C === "C") { const a = [num() + ox, num() + oy, num() + ox, num() + oy, num() + ox, num() + oy]; out.push(["C", ...a]); lcx = a[2]; lcy = a[3]; x = a[4]; y = a[5]; }
    else if (C === "S") {
      const c1x = lcx === null ? x : 2 * x - lcx, c1y = lcy === null ? y : 2 * y - lcy;
      const a = [num() + ox, num() + oy, num() + ox, num() + oy];
      out.push(["C", c1x, c1y, ...a]); lcx = a[0]; lcy = a[1]; x = a[2]; y = a[3]; continue;
    }
    else if (C === "Q") { const a = [num() + ox, num() + oy, num() + ox, num() + oy]; out.push(["Q", ...a]); x = a[2]; y = a[3]; }
    else if (C === "A") { const rx = num(), ry = num(), rot = num(), la = num(), sw = num(); x = num() + ox; y = num() + oy; out.push(["A", rx, ry, rot, la, sw, x, y]); }
    else if (C === "Z") { out.push(["Z"]); x = sx; y = sy; }
    else throw new Error("unsupported command " + cmd + " in " + d);
  }
  return out;
}

export function serialize(segs) {
  return segs
    .map(([c, ...n]) => (c === "Z" ? "Z" : c + n.map(R2).join(" ")))
    .join("")
    .replace(/ -/g, "-");
}

/** Mirror / rotate by quarter turns about (12,12). */
export function xf(d, { rot = 0, flipX = false, flipY = false } = {}) {
  const k = ((rot % 4) + 4) % 4;
  const pt = (x, y) => {
    if (flipX) x = 24 - x;
    if (flipY) y = 24 - y;
    for (let i = 0; i < k; i++) [x, y] = [24 - y, x];
    return [x, y];
  };
  const mirrors = (flipX ? 1 : 0) + (flipY ? 1 : 0);
  return serialize(
    parse(d).map((s) => {
      if (s[0] === "Z") return s;
      if (s[0] === "A") {
        const [, rx, ry, a, la, sw, x, y] = s;
        const [nx, ny] = pt(x, y);
        return ["A", k % 2 ? ry : rx, k % 2 ? rx : ry, a, la, mirrors % 2 ? 1 - sw : sw, nx, ny];
      }
      const out = [s[0]];
      for (let i = 1; i < s.length; i += 2) out.push(...pt(s[i], s[i + 1]));
      return out;
    }),
  );
}

export const norm = (d) => serialize(parse(d));

// ---- shapes --------------------------------------------------------------------------------
export const circ = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;
export const rect = (x, y, w, h, r = 0) =>
  r
    ? `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
    : `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
export const poly = (pts) => "M" + pts.map((p) => p.join(" ")).join("L") + "Z";
/** Gear outline: n teeth between radii rIn and rOut. */
export function gear(cx = 12, cy = 12, n = 8, rOut = 9.5, rIn = 7.2, tooth = 0.2) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const step = (Math.PI * 2) / n;
    for (const [da, r] of [[-step * 0.5 + step * tooth, rIn], [-step * tooth * 0.6, rOut], [step * tooth * 0.6, rOut], [step * 0.5 - step * tooth, rIn]]) {
      pts.push([R2(cx + r * Math.sin(a + da)), R2(cy - r * Math.cos(a + da))]);
    }
  }
  return poly(pts);
}
/** Zig-zag rosette used for verified badges. */
export function rosette(cx = 12, cy = 12, n = 10, rOut = 9.5, rIn = 8) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? rIn : rOut;
    pts.push([R2(cx + r * Math.sin(a)), R2(cy - r * Math.cos(a))]);
  }
  return poly(pts);
}

// ---- parts ---------------------------------------------------------------------------------
const part = (r) => (d, w, extra) => ({ r, d: norm(d), ...(w ? { w } : {}), ...(extra ?? {}) });
export const S = part("s"), B = part("b"), D = part("d"), F = part("f"), C = part("c"), K = part("k"), M = part("m"), G = part("g"), P = part("p"), L = part("l"), N = part("n"), O = part("o"), H = part("h"), Q = part("q");
export const dash = { da: 1 };
/** Small filled dot. */
export const dot = (x, y, r = 1.25) => F(circ(x, y, r));
/** Dot cut into a body (a round-capped zero length line). */
export const dotD = (x, y, w = 2.8) => D(`M${x} ${y}h.01`, w);

/** A closed polygon with its own corner radius at each vertex (0 = sharp), as a path with small quadratic corners. */
export function roundedPoly(pts, radii) {
  const f = (n) => Math.round(n * 100) / 100;
  const n = pts.length;
  const at = (i) => {
    const v = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], r = radii[i] ?? 0;
    const dir = (p, q) => { const d = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(d[0], d[1]); return [d[0] / l, d[1] / l, l]; };
    const [ux, uy, la] = dir(v, a), [wx, wy, lb] = dir(v, b);
    const t = Math.min(r, la * 0.45, lb * 0.45);
    return { v, inP: [v[0] + ux * t, v[1] + uy * t], outP: [v[0] + wx * t, v[1] + wy * t], round: t > 0 };
  };
  const c = pts.map((_, i) => at(i));
  let d = `M${f(c[0].outP[0])} ${f(c[0].outP[1])}`;
  for (let i = 1; i <= n; i++) {
    const k = c[i % n];
    d += k.round ? `L${f(k.inP[0])} ${f(k.inP[1])}Q${f(k.v[0])} ${f(k.v[1])} ${f(k.outP[0])} ${f(k.outP[1])}` : `L${f(k.v[0])} ${f(k.v[1])}`;
  }
  return d + "Z";
}

/** Apply a transform to every part of an icon. */
export const T = (parts, o) => parts.map((p) => ({ ...p, d: xf(p.d, o) }));
