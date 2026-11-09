"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { useAccess } from "./AccessProvider";
import { useAuth } from "./AuthProvider";
import IconArt from "./IconArt";
import iconPreview from "@/data/icons-preview.json";
import stickerData from "@/data/landing-stickers.json";
import type { IconDef, IconStyle } from "@/lib/icons/render";
import type { HeroColumn } from "@/lib/types";

const S = stickerData as Record<string, string>;

/** Die-cut stickers floating around the hero. Widths scale with the screen so the hero never feels empty. */
const W = (min: number, vw: number, max: number) => `clamp(${min}px, ${vw}vw, ${max}px)`;
const FLOATERS: { k: string; style: CSSProperties; hide?: boolean }[] = [
  { k: "m2", style: { left: "3%", top: 330, width: W(120, 16, 220), ["--r" as string]: "-8deg" } },
  { k: "g1", style: { left: "21%", top: 695, width: W(110, 12, 165), ["--r" as string]: "6deg" }, hide: true },
  { k: "c1", style: { left: "2%", top: 865, width: W(130, 17, 240), ["--r" as string]: "-5deg" } },
  { k: "m4", style: { right: "3%", top: 440, width: W(130, 17, 230), ["--r" as string]: "7deg" } },
  { k: "a3", style: { right: "7%", top: 850, width: W(100, 12, 170), ["--r" as string]: "10deg" } },
  { k: "e1", style: { right: "26%", top: 925, width: W(100, 10, 140), ["--r" as string]: "-6deg" }, hide: true },
  { k: "a1", style: { left: "29%", top: 925, width: W(96, 9, 130), ["--r" as string]: "8deg" }, hide: true },
];

/** Text stickers (die-cut label look). */
const LABELS: { t: string; cls?: string; style: CSSProperties; hide?: boolean }[] = [
  { t: "Made to paste", style: { left: "4%", top: 585, fontSize: "clamp(1.5rem,2.6vw,2.4rem)", padding: "16px 26px", background: "#fff", color: "#292724", ["--r" as string]: "-4deg" } },
  { t: "Tiny but mighty", style: { right: "4%", top: 345, fontSize: "clamp(.95rem,1.3vw,1.2rem)", padding: "13px 22px", background: "#fff", color: "#292724", ["--r" as string]: "-9deg" } },
  { t: "Tweak, Grab & Go", style: { right: "3%", top: 710, fontSize: "clamp(1.1rem,1.7vw,1.5rem)", padding: "20px 32px", maxWidth: 280, background: "#3B54F0", color: "#fff", fontStyle: "italic", ["--r" as string]: "-13deg" }, hide: true },
];

/** The sticker pile inside the pack. Positions and sizes are in a 380 x 360 box and scale with it. */
const KIT: { k: string; l: number; t: number; w: number; r: string }[] = [
  { k: "a2", l: 26, t: 74, w: 112, r: "-8deg" },
  { k: "g2", l: 156, t: 60, w: 118, r: "6deg" },
  { k: "m1", l: 84, t: 152, w: 150, r: "-3deg" },
  { k: "c2", l: 214, t: 186, w: 124, r: "8deg" },
  { k: "m3", l: 14, t: 208, w: 124, r: "5deg" },
];

const MANIFESTO: (string | { s: string })[] = [
  "Cute", "vectors", "shape", "how", "products", "feel", { s: "m2" },
  "so", "every", "one", "is", "drawn", "with", "care,", { s: "g1" },
  "made", "easy", "to", "tweak,", { s: "a3" },
  "and", "ready", "to", "paste", "anywhere", { s: "c1" },
  "giving", "every", "project", "a", "little", "more", "joy.", { s: "m4" },
];

/** The icons shown on the homepage: 12 on a light panel and 12 on a dark one, one row per style. */
const ICONS = iconPreview as { total: number; categories: number; icons: IconDef[] };
const ROW_STYLES: IconStyle[] = ["line", "solid", "duotone"];
const PANELS = [
  { cls: "light", icons: ICONS.icons.slice(0, 12) },
  { cls: "dark", icons: ICONS.icons.slice(12, 24) },
];

/** Tight canvas for each pack's character and its width (as a share of the sticker box), so all six look the same size. */
const FIT: Record<string, { vb: string; wf: number }> = {
  mascot: { vb: "44.3 31.6 195.2 256.9", wf: 0.766 },
  emoticons: { vb: "7.7 58.2 284.6 251.1", wf: 0.893 },
  ghost: { vb: "14.2 73.0 211.6 193.5", wf: 0.936 },
  clouds: { vb: "-5.0 58.3 250.0 180.9", wf: 1.073 },
  mushroom: { vb: "27.3 98.9 945.4 819.8", wf: 0.901 },
  dumpling: { vb: "-2.5 132.0 405.0 348.9", wf: 0.893 },
};

/** Panel colors per pack. */
const COLORS: Record<string, { bg: string; fg: string; dark?: boolean }> = {
  mascot: { bg: "#C4B5A5", fg: "#2c241c" },
  emoticons: { bg: "#DB5368", fg: "#fff", dark: true },
  ghost: { bg: "#E5FAC9", fg: "#5F7B2F" },
  clouds: { bg: "#DEE8FF", fg: "#1E2E86" },
  mushroom: { bg: "#EADFFA", fg: "#4A2C8A" },
  dumpling: { bg: "#FBE7C4", fg: "#6B3A1E" },
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function Landing({
  hero,
  onOpenPack,
  onWarm,
  onHome,
}: {
  hero: HeroColumn[];
  onOpenPack: (id: string, e: MouseEvent<HTMLElement>) => void;
  onWarm: (id: string) => void;
  onHome: () => void;
}) {
  const { user, loading, requestSignIn, signOut } = useAuth();
  const { active, openUpgrade } = useAccess();
  const manifest = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const total = MANIFESTO.length;

  // Manifesto fills in from grey to dark as it scrolls into view.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = manifest.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(Math.max(0, Math.min(1, (vh * 0.78 - r.top) / (r.height * 0.8))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const initial = (user?.displayName || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="lp">
      <div className="lp-top">
        <div className="lp-left">
          <button type="button" className="lp-word" onClick={onHome} aria-label="Pasteables home">
            <img className="lp-logo-img" src="/logo.png" alt="" width={40} height={40} />
            <span className="lp-wordtext">Pasteables</span>
          </button>
          <nav className="lp-nav" aria-label="Main">
            <button type="button" onClick={() => scrollToId("packs")}>Stickers</button>
            <Link href="/icons">Icons</Link>
          </nav>
        </div>
        <div className="lp-right">
        <button type="button" className={`lp-unlock${active ? " pro" : ""}`} onClick={() => openUpgrade("menu")}>
          {active ? "Full access" : "Unlock all"}
        </button>
        {loading ? null : user ? (
          <div className="lp-me">
            {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : <i>{initial}</i>}
            <span>{user.displayName?.split(" ")[0] || "Signed in"}</span>
            <button type="button" onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <button type="button" className="lp-pill" onClick={() => requestSignIn("start")}>Get started</button>
        )}
        </div>
      </div>

      <main>
        <section className="lp-hero">
          <p className="lp-eyebrow">Free vector stickers</p>
          <h1>Cute vectors, ready to paste</h1>
          <p className="lp-sub">
            Copy any sticker as <code>SVG</code>, <code>React</code> or <code>Flutter</code> code.
          </p>
          <button type="button" className="lp-pill big" onClick={() => scrollToId("packs")}>Explore the packs</button>

          {LABELS.map((l) => (
            <span key={l.t} className={`lp-lab${l.hide ? " hide-sm" : ""}`} style={l.style} aria-hidden="true">{l.t}</span>
          ))}
          {FLOATERS.map((f) => (
            <div key={f.k} className={`lp-die${f.hide ? " hide-sm" : ""}`} style={f.style} aria-hidden="true" dangerouslySetInnerHTML={{ __html: S[f.k] }} />
          ))}

          <div className="lp-kit" aria-hidden="true">
            <div className="lp-strip">
              <b>Pasteables</b>
              <small>STICKER PACK</small>
              <em>Free</em>
            </div>
            <div className="lp-bag">
              {KIT.map((k) => (
                <div
                  key={k.k}
                  className="lp-die"
                  style={{ left: `${(k.l / 380) * 100}cqw`, top: `${(k.t / 380) * 100}cqw`, width: `${(k.w / 380) * 100}cqw`, ["--r" as string]: k.r, animationDuration: "9s" }}
                  dangerouslySetInnerHTML={{ __html: S[k.k] }}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="lp-paper">
        <section className="lp-gray" id="packs">
          <h2><span className="lp-hl">Pick a pack</span></h2>
          <div className="lp-sheet">
            {hero.map((h) => {
              const c = COLORS[h.id];
              if (!c) return null;
              return (
                <a
                  key={h.id}
                  className="lp-pk"
                  href={`#${h.id}`}
                  style={{ ["--pk" as string]: c.bg }}
                  aria-label={`${h.name}, ${h.count.replace("#", "")} stickers`}
                  onClick={(e) => onOpenPack(h.id, e)}
                  onMouseEnter={() => onWarm(h.id)}
                  onFocus={() => onWarm(h.id)}
                >
                  <span
                    className="lp-pkart"
                    style={{ ["--wf" as string]: FIT[h.id]?.wf ?? 0.8 }}
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: FIT[h.id] ? h.svg.replace(/^<svg[^>]*>/, (tag) => tag.replace(/ width="[^"]*" height="[^"]*"/, "").replace(/viewBox="[^"]*"/, `viewBox="${FIT[h.id].vb}"`)) : h.svg }}
                  />
                  <span className="lp-tag">
                    {h.name} <small>{h.count.replace("#", "")}</small>
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="lp-ico" id="icons" aria-labelledby="lp-ico-h">
          <div className="lp-ico-in">
            <div className="lp-ico-copy">
              <small>Icons</small>
              <h2 id="lp-ico-h">Icons for every idea.</h2>
              <p>A growing collection of beautiful, customizable icons for designers and developers.</p>
              <Link className="lp-pill big" href="/icons">Explore Icons</Link>
              <ul className="lp-ico-facts" aria-label="Highlights">
                <li><b>{ICONS.total}</b> icons</li>
                <li><b>3</b> styles</li>
                <li><b>SVG</b>, React, Flutter</li>
              </ul>
            </div>
            <div className="lp-ico-show" aria-hidden="true">
              {PANELS.map((pn) => (
                <div key={pn.cls} className={`lp-icp ${pn.cls}`}>
                  {pn.icons.map((ic, i) => (
                    <span key={ic.i} className="lp-ict">
                      <IconArt icon={ic} style={ROW_STYLES[Math.floor(i / 4)]} size={30} />
                    </span>
                  ))}
                </div>
              ))}
              <p className="lp-icl">Line, Solid and Duotone, on light and dark</p>
            </div>
          </div>
        </section>

        <section className="lp-mani" ref={manifest}>
          <small>Why Pasteables</small>
          <p>
            {MANIFESTO.map((t, i) => {
              const on = (i + 1) / total <= progress * 1.04;
              return typeof t === "string" ? (
                <span key={i} className={`lp-w${on ? " on" : ""}`}>{t} </span>
              ) : (
                <span key={i} className={`lp-i${on ? " on" : ""}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: S[t.s] }} />
              );
            })}
          </p>
        </section>
        </div>

        <section className="lp-end">
          <div className="lp-end-in">
            <div>
              <h2>Stickers and icons, ready to paste.</h2>
              <button type="button" className="lnk" onClick={() => scrollToId("packs")}>Browse the sticker packs ↑</button>
              <br />
              <Link className="lnk" href="/icons" style={{ marginTop: 12 }}>Explore the icon library →</Link>
              <small>© Pasteables. All rights reserved.</small>
            </div>
            <Link className="lp-note" href="/icons" aria-label="Explore the icon library">
              <div className="lp-icons">
                {ICONS.icons.slice(0, 6).map((ic) => (
                  <span key={ic.i}>
                    <IconArt icon={ic} size={26} />
                  </span>
                ))}
              </div>
              <small>Icon library</small>
              <b>Essential UI <em>{ICONS.total} icons</em></b>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
