"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { useAuth } from "./AuthProvider";
import stickerData from "@/data/landing-stickers.json";
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

/** A peek at the first icon pack (line icons) for the closing card. */
const ICON_PATHS = [
  "M3 11l9-8 9 8M5 10v10h14V10",
  "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  "M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0",
  "M3 7h18v12H3zM3 9l9 6 9-6",
  "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z",
  "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21a8 8 0 0 1 16 0",
];

const COLORS: Record<string, { cls: string; art: CSSProperties; dark?: boolean }> = {
  mascot: { cls: "lp-c-mascot", art: { right: "4%", bottom: 0, width: "60%" } },
  emoticons: { cls: "lp-c-emote", dark: true, art: { right: "3%", bottom: 0, width: "40%" } },
  ghost: { cls: "lp-c-ghost", art: { right: "6%", bottom: 0, width: "34%" } },
  clouds: { cls: "lp-c-cloud", art: { right: "3%", bottom: "-3%", width: "27%" } },
  mushroom: { cls: "lp-c-mushroom", art: { right: "2%", bottom: 0, width: "40%" } },
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
  const art = (id: string) => hero.find((h) => h.id === id)?.svg ?? "";

  return (
    <div className="lp">
      <div className="lp-top">
        <button type="button" className="lp-word" onClick={onHome} aria-label="Pasteables home">
          <img className="lp-logo-img" src="/logo.png" alt="" width={40} height={40} />
          <span className="lp-wordtext">Pasteables</span>
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

        <section className="lp-gray" id="packs">
          <h2>Pick a pack</h2>
          <div className="lp-bento">
            {hero.map((h) => {
              const c = COLORS[h.id];
              if (!c) return null;
              return (
                <a
                  key={h.id}
                  className={`lp-card ${c.cls}${c.dark ? " dark" : ""}`}
                  href={`#${h.id}`}
                  onClick={(e) => onOpenPack(h.id, e)}
                  onMouseEnter={() => onWarm(h.id)}
                  onFocus={() => onWarm(h.id)}
                >
                  <h3>{h.name}</h3>
                  <p>{h.desc}</p>
                  <span className="lp-chip">{h.count.replace("#", "")} stickers →</span>
                  <div className="lp-art" style={c.art} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art(h.id) }} />
                </a>
              );
            })}
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

        <section className="lp-end">
          <div className="lp-end-in">
            <div>
              <h2>Icon packs are on the way.</h2>
              <button type="button" className="lnk" onClick={() => scrollToId("packs")}>Browse the sticker packs ↑</button>
              <small>© Pasteables. All rights reserved.</small>
            </div>
            <div className="lp-note" aria-hidden="true">
              <div className="lp-icons">
                {ICON_PATHS.map((d) => (
                  <span key={d}>
                    <svg viewBox="0 0 24 24"><path d={d} /></svg>
                  </span>
                ))}
              </div>
              <small>Icon pack preview</small>
              <b>Everyday UI <em>Coming soon</em></b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
