// Re-draws the corners of an icon body with a chosen radius.
//
// Works on the normalised paths in data/icons.json (only M L C Q A Z, absolute):
//  - a whole rounded rectangle (squares, cards, pills) is rebuilt with the new radius
//  - a full circle becomes a rounded square for a small radius, and stays a circle for a large one
//  - a sharp joint between two straight lines becomes an exact circular corner
//  - a sharp point on a curved shape (heart tip, moon tips, cloud base, eye corners) is softened with a quadratic corner
//  - smooth curves are left exactly as drawn

type Pt = [number, number];
interface Seg {
  c: string;
  n: number[];
}

const f = (n: number) => String(Math.round(n * 100) / 100);
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const len = (a: Pt) => Math.hypot(a[0], a[1]);
const unit = (a: Pt): Pt => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l];
};
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const endOf = (s: Seg): Pt => [s.n[s.n.length - 2], s.n[s.n.length - 1]];
const segStr = (s: Seg) => (s.c === "Z" ? "Z" : s.c + s.n.map(f).join(" "));
const segsStr = (segs: Seg[]) => segs.map(segStr).join("");
const eq = (a: Pt, b: Pt, e = 1e-6) => Math.abs(a[0] - b[0]) < e && Math.abs(a[1] - b[1]) < e;
const pt = (q: Pt) => `${f(q[0])} ${f(q[1])}`;

function parse(d: string): Seg[] {
  const toks = d.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  const out: Seg[] = [];
  let i = 0;
  while (i < toks.length) {
    const c = toks[i++];
    const n = c === "M" || c === "L" ? 2 : c === "C" ? 6 : c === "Q" ? 4 : c === "A" ? 7 : 0;
    out.push({ c, n: toks.slice(i, i + n).map(Number) });
    i += n;
  }
  return out;
}

/** Intersection of two lines, or null when they are parallel. */
function meet(p1: Pt, d1: Pt, p2: Pt, d2: Pt): Pt | null {
  const det = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(det) < 1e-6) return null;
  const t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / det;
  return [p1[0] + d1[0] * t, p1[1] + d1[1] * t];
}

// ---- pieces: every segment as a straight line or a cubic ----------------------------------------
/** L: [from, to]. C: [from, control1, control2, to] */
type Piece = Pt[];
const isLine = (pc: Piece) => pc.length === 2;
const startOf = (pc: Piece) => pc[0];
const finish = (pc: Piece) => pc[pc.length - 1];

/** A circular arc as cubic curves (at most a quarter turn each). */
function arcToCubics(p0: Pt, s: Seg): Piece[] {
  const [rx0, , , large, sweep, x, y] = s.n;
  const p1: Pt = [x, y];
  const chord = len(sub(p1, p0));
  const r = Math.max(rx0, chord / 2);
  const mid = lerp(p0, p1, 0.5);
  const h = Math.sqrt(Math.max(0, r * r - (chord / 2) ** 2));
  const nrm = unit([-(p1[1] - p0[1]), p1[0] - p0[0]]);
  const sign = large === sweep ? -1 : 1;
  const c: Pt = [mid[0] + nrm[0] * h * sign, mid[1] + nrm[1] * h * sign];
  const a0 = Math.atan2(p0[1] - c[1], p0[0] - c[0]);
  const a1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]);
  let da = a1 - a0;
  if (sweep && da < 0) da += Math.PI * 2;
  if (!sweep && da > 0) da -= Math.PI * 2;
  const n = Math.max(1, Math.ceil(Math.abs(da) / (Math.PI / 2) - 1e-6));
  const step = da / n;
  const k = (4 / 3) * Math.tan(step / 4);
  const out: Piece[] = [];
  for (let i = 0; i < n; i++) {
    const s0 = a0 + step * i, s1 = s0 + step;
    const q0: Pt = [c[0] + r * Math.cos(s0), c[1] + r * Math.sin(s0)];
    const q3: Pt = [c[0] + r * Math.cos(s1), c[1] + r * Math.sin(s1)];
    out.push([q0, [q0[0] - k * r * Math.sin(s0), q0[1] + k * r * Math.cos(s0)], [q3[0] + k * r * Math.sin(s1), q3[1] - k * r * Math.cos(s1)], q3]);
  }
  out[0][0] = p0;
  out[out.length - 1][3] = p1;
  return out;
}

function toPieces(from: Pt, via: "L" | Seg, to: Pt): Piece[] {
  if (via === "L") return [[from, to]];
  if (via.c === "C") return [[from, [via.n[0], via.n[1]], [via.n[2], via.n[3]], to]];
  if (via.c === "Q") {
    const q: Pt = [via.n[0], via.n[1]];
    return [[from, lerp(from, q, 2 / 3), lerp(to, q, 2 / 3), to]];
  }
  return arcToCubics(from, via);
}

/** De Casteljau: the part of a cubic between parameters u0 and u1. */
function cubicSlice(p: Piece, u0: number, u1: number): Piece {
  const split = (q: Piece, u: number): [Piece, Piece] => {
    const a = lerp(q[0], q[1], u), b = lerp(q[1], q[2], u), c = lerp(q[2], q[3], u);
    const d = lerp(a, b, u), e = lerp(b, c, u), m = lerp(d, e, u);
    return [[q[0], a, d, m], [m, e, c, q[3]]];
  };
  let q = p;
  if (u1 < 1) q = split(q, u1)[0];
  if (u0 > 0) q = split(q, u0 / (u1 || 1))[1];
  return q;
}
const at = (pc: Piece, u: number): Pt => {
  if (isLine(pc)) return lerp(pc[0], pc[1], u);
  const ab = lerp(pc[0], pc[1], u), bc = lerp(pc[1], pc[2], u), cd = lerp(pc[2], pc[3], u);
  return lerp(lerp(ab, bc, u), lerp(bc, cd, u), u);
};
const pieceLen = (pc: Piece) => {
  let l = 0, prev = pc[0];
  for (let i = 1; i <= 10; i++) {
    const q = at(pc, i / 10);
    l += len(sub(q, prev));
    prev = q;
  }
  return l;
};
/** Parameter at which the piece is `dist` (straight line) away from its start or its end. */
function paramAtDistance(pc: Piece, dist: number, fromEnd: boolean): number {
  const ref = fromEnd ? finish(pc) : startOf(pc);
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const far = len(sub(at(pc, mid), ref)) > dist;
    if (fromEnd) far ? (lo = mid) : (hi = mid);
    else far ? (hi = mid) : (lo = mid);
  }
  return (lo + hi) / 2;
}
/** Direction of travel at the start or the end of a piece. */
function tangent(pc: Piece, atEnd: boolean): Pt {
  if (isLine(pc)) return unit(sub(pc[1], pc[0]));
  const cands: [Pt, Pt][] = atEnd ? [[pc[3], pc[2]], [pc[3], pc[1]], [pc[3], pc[0]]] : [[pc[1], pc[0]], [pc[2], pc[0]], [pc[3], pc[0]]];
  for (const [a, b] of cands) if (len(sub(a, b)) > 1e-6) return unit(sub(a, b)) as Pt;
  return [1, 0];
}

interface Fillet {
  /** where the piece before the corner stops / the piece after starts (curve parameters) */
  inU: number;
  outU: number;
  outP: Pt;
  vertex: Pt;
  /** exact circular corner (line to line) */
  r?: number;
  sweep: number;
}

function roundSubpath(segs: Seg[], R: number): string {
  const closed = segs[segs.length - 1].c === "Z";
  const start: Pt = [segs[0].n[0], segs[0].n[1]];

  // 1. items, with the closing line explicit and zero-length lines dropped
  interface Item {
    s: Seg;
    from: Pt;
    to: Pt;
  }
  const items: Item[] = [];
  let cur = start;
  for (const s of segs.slice(1, closed ? -1 : undefined)) {
    const to = endOf(s);
    if (!(s.c === "L" && eq(cur, to))) items.push({ s, from: cur, to });
    cur = to;
  }
  if (closed && !eq(cur, start)) items.push({ s: { c: "L", n: [start[0], start[1]] }, from: cur, to: start });
  const n = items.length;
  if (!n) return segsStr(segs);

  // 2. a small arc between two straight lines is the rounded corner of a box: remember the sharp corner it replaces
  const corner = new Map<number, Pt>();
  items.forEach((it, k) => {
    if (it.s.c !== "A" || it.s.n[0] > 8 || Math.abs(it.s.n[0] - it.s.n[1]) > 0.01) return;
    if (!closed && (k === 0 || k === n - 1)) return;
    const prev = items[(k - 1 + n) % n], next = items[(k + 1) % n];
    if (prev.s.c !== "L" || next.s.c !== "L") return;
    const v = meet(prev.from, unit(sub(prev.to, prev.from)), next.from, unit(sub(next.to, next.from)));
    if (!v || Math.abs(len(sub(v, it.from)) - len(sub(v, it.to))) > 0.2) return;
    corner.set(k, v);
  });

  // 3. vertices (a corner arc is replaced by the sharp corner at the end of the line before it)
  const verts: { p: Pt; via: "L" | Seg }[] = [];
  for (let k = 0; k < n; k++) {
    if (corner.has(k)) continue;
    const it = items[k];
    const nextArc = corner.get((k + 1) % n);
    verts.push({ p: it.s.c === "L" && nextArc && (closed || k + 1 < n) ? nextArc : it.to, via: it.s.c === "L" ? "L" : it.s });
  }
  const origin: Pt = closed ? verts[verts.length - 1].p : start;

  // 4. pieces
  const pieces: Piece[] = [];
  let prevP = origin;
  for (const v of verts) {
    pieces.push(...toPieces(prevP, v.via, v.p));
    prevP = v.p;
  }
  const count = pieces.length;
  const after = (k: number) => (closed ? (k + 1) % count : k + 1 < count ? k + 1 : -1);
  const before = (k: number) => (closed ? (k - 1 + count) % count : k - 1);

  // 5. sharp: just draw the pieces as they are
  const writePiece = (pc: Piece, u0 = 0, u1 = 1) => {
    if (isLine(pc)) return `L${pt(lerp(pc[0], pc[1], u1))}`;
    const sl = u0 === 0 && u1 === 1 ? pc : cubicSlice(pc, u0, u1);
    return `C${pt(sl[1])} ${pt(sl[2])} ${pt(sl[3])}`;
  };
  if (R <= 0) return `M${pt(origin)}${pieces.map((pc) => writePiece(pc)).join("")}${closed ? "Z" : ""}`;

  // 6. a corner at every sharp junction
  const fillets: (Fillet | null)[] = pieces.map((pc, k) => {
    const nk = after(k);
    if (nk < 0) return null;
    const nx = pieces[nk];
    const t1 = tangent(pc, true), t2 = tangent(nx, false);
    const phi = Math.acos(Math.max(-1, Math.min(1, t1[0] * t2[0] + t1[1] * t2[1])));
    const lines = isLine(pc) && isLine(nx);
    if (phi < (lines ? 0.12 : 0.3) || phi > Math.PI - 0.05) return null;
    const room = Math.min(pieceLen(pc), pieceLen(nx)) / 2;
    const t = Math.min(R * Math.tan(phi / 2), room);
    const inU = isLine(pc) ? 1 - t / pieceLen(pc) : paramAtDistance(pc, t, true);
    const outU = isLine(nx) ? t / pieceLen(nx) : paramAtDistance(nx, t, false);
    return { inU, outU, outP: at(nx, outU), vertex: finish(pc), r: lines ? t / Math.tan(phi / 2) : undefined, sweep: t1[0] * t2[1] - t1[1] * t2[0] > 0 ? 1 : 0 };
  });
  if (!fillets.some(Boolean)) return segsStr(segs);

  // 7. write the path
  const first = closed ? fillets[before(0)]?.outP ?? origin : origin;
  let d = `M${pt(first)}`;
  pieces.forEach((pc, k) => {
    const incoming = fillets[before(k)] && (closed || k > 0) ? fillets[before(k)] : null;
    const outgoing = fillets[k];
    d += writePiece(pc, incoming ? incoming.outU : 0, outgoing ? outgoing.inU : 1);
    if (outgoing) d += outgoing.r !== undefined ? `A${f(outgoing.r)} ${f(outgoing.r)} 0 0 ${outgoing.sweep} ${pt(outgoing.outP)}` : `Q${pt(outgoing.vertex)} ${pt(outgoing.outP)}`;
  });
  return d + (closed ? "Z" : "");
}

// ---- whole-shape cases ----------------------------------------------------------------------------
/** A full circle (M, two half-turn arcs, Z) with its diameter along either axis. */
function asCircle(sp: Seg[]): { cx: number; cy: number; r: number } | null {
  if (sp.length !== 4 || sp[1].c !== "A" || sp[2].c !== "A" || sp[3].c !== "Z") return null;
  const p0: Pt = [sp[0].n[0], sp[0].n[1]], p1 = endOf(sp[1]), p2 = endOf(sp[2]);
  const rx = sp[1].n[0];
  if (Math.abs(rx - sp[1].n[1]) > 0.01 || !eq(p2, p0, 0.01) || Math.abs(len(sub(p1, p0)) - 2 * rx) > 0.05) return null;
  const c = lerp(p0, p1, 0.5);
  return { cx: c[0], cy: c[1], r: rx };
}

/** A rectangle with equal quarter-arc corners (a square, card or pill): its bounds. */
function asRoundedRect(sp: Seg[]): { x: number; y: number; w: number; h: number } | null {
  if (sp[sp.length - 1].c !== "Z" || sp.length < 5) return null;
  const pts: Pt[] = [[sp[0].n[0], sp[0].n[1]]];
  let cur = pts[0];
  for (const s of sp.slice(1, -1)) {
    const to = endOf(s);
    if (s.c === "L") {
      if (Math.abs(to[0] - cur[0]) > 1e-6 && Math.abs(to[1] - cur[1]) > 1e-6) return null;
    } else if (s.c === "A") {
      const dx = Math.abs(to[0] - cur[0]), dy = Math.abs(to[1] - cur[1]);
      if (Math.abs(s.n[0] - s.n[1]) > 0.01 || Math.abs(dx - dy) > 0.01 || Math.abs(dx - s.n[0]) > 0.01) return null;
    } else return null;
    pts.push(to);
    cur = to;
  }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  if (pts.some((p) => !(Math.abs(p[0] - x0) < 1e-6 || Math.abs(p[0] - x1) < 1e-6 || Math.abs(p[1] - y0) < 1e-6 || Math.abs(p[1] - y1) < 1e-6))) return null;
  if (x1 - x0 < 1 || y1 - y0 < 1) return null;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** A rounded rectangle path (the radius is clamped to half the shorter side). */
export function rectPath(x: number, y: number, w: number, h: number, R: number): string {
  const r = Math.max(0, Math.min(R, w / 2, h / 2));
  return r === 0
    ? `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`
    : `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`;
}

/** The rounded square tile on the 24 grid (2..22) behind glyph-only icons. */
export const tilePath = (R: number) => rectPath(2, 2, 20, 20, R);

/** Re-draw every corner of a body path with radius `R` (in 24 x 24 icon units). R = 0 gives sharp corners. */
export function roundCorners(d: string, R: number): string {
  const subs: Seg[][] = [];
  for (const s of parse(d)) {
    if (s.c === "M") subs.push([s]);
    else subs[subs.length - 1]?.push(s);
  }
  return subs
    .map((sp) => {
      const c = asCircle(sp);
      if (c) return c.r <= R ? segsStr(sp) : rectPath(c.cx - c.r, c.cy - c.r, 2 * c.r, 2 * c.r, R);
      const r = asRoundedRect(sp);
      if (r) return rectPath(r.x, r.y, r.w, r.h, R);
      return roundSubpath(sp, R);
    })
    .join("");
}

/** Bounding box [minX, minY, maxX, maxY] of a path's centre line (curves are sampled). */
export function pathBounds(d: string): [number, number, number, number] {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (q: Pt) => {
    x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]);
  };
  let cur: Pt = [0, 0];
  for (const sg of parse(d)) {
    if (sg.c === "Z") continue;
    const to = endOf(sg);
    if (sg.c === "M") add(to);
    else for (const pc of toPieces(cur, sg.c === "L" ? "L" : sg, to)) for (let i = 0; i <= 12; i++) add(at(pc, i / 12));
    cur = to;
  }
  return [x0, y0, x1, y1];
}
