"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccess } from "./AccessProvider";
import IconArt from "./IconArt";
import IconDialog from "./IconDialog";
import { STYLES, matches } from "@/lib/icons/render";
import type { IconDef, IconLibraryData, IconStyle } from "@/lib/icons/render";

const RECENT_DAYS = 30;
const isStyle = (v: string | null): v is IconStyle => v === "line" || v === "solid" || v === "duotone";

export default function IconLibrary() {
  const { active, openUpgrade } = useAccess();
  const [lib, setLib] = useState<IconLibraryData | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [style, setStyle] = useState<IconStyle>("line");
  const [recent, setRecent] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastTile = useRef<HTMLElement | null>(null);
  const ready = useRef(false);

  // The data is its own chunk, so the page shell shows up first.
  useEffect(() => {
    let alive = true;
    import("@/data/icons.json")
      .then((m) => alive && setLib(m.default as unknown as IconLibraryData))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  // Read the address once the data is there (?q=, ?category=, ?style=), then keep the address in sync.
  useEffect(() => {
    if (!lib || ready.current) return;
    const sp = new URLSearchParams(window.location.search);
    setQ(sp.get("q") ?? "");
    const c = sp.get("category");
    if (c && lib.categories.some((x) => x.id === c && !x.hidden)) setCat(c);
    const s = sp.get("style");
    if (isStyle(s)) setStyle(s);
    if (sp.get("recent") === "1") setRecent(true);
    ready.current = true;
  }, [lib]);
  useEffect(() => {
    if (!ready.current) return;
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (cat !== "all") sp.set("category", cat);
    if (style !== "line") sp.set("style", style);
    if (recent) sp.set("recent", "1");
    const qs = sp.toString();
    try {
      history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
    } catch {}
  }, [q, cat, style, recent]);

  const shown = useMemo(() => (lib?.categories ?? []).filter((c) => !c.hidden), [lib]);
  const hiddenIds = useMemo(() => new Set((lib?.categories ?? []).filter((c) => c.hidden).map((c) => c.id)), [lib]);
  const shownCount = useMemo(() => (lib?.icons ?? []).filter((i) => !hiddenIds.has(i.c)).length, [lib, hiddenIds]);
  const searching = q.trim() !== "";

  const catName = useMemo(() => new Map((lib?.categories ?? []).map((c) => [c.id, c.name])), [lib]);

  const results = useMemo(() => {
    if (!lib) return [];
    const cutoff = Date.now() - RECENT_DAYS * 86400000;
    const seen = new Set<string>();
    return lib.icons.filter((ic) => {
      if (seen.has(ic.i)) return false; // never list an icon twice
      seen.add(ic.i);
      if (hiddenIds.has(ic.c) && !searching) return false; // hidden designs (the arrows) only appear in search results
      if (cat !== "all" && ic.c !== cat) return false;
      if (recent && new Date(ic.a).getTime() < cutoff) return false;
      return matches(ic, catName.get(ic.c) ?? "", q);
    });
  }, [lib, q, cat, recent, catName, hiddenIds, searching]);

  const groups = useMemo(() => {
    if (!lib) return [];
    return lib.categories.map((c) => ({ cat: c, icons: results.filter((i) => i.c === c.id) })).filter((g) => g.icons.length);
  }, [lib, results]);

  const previews = useMemo(() => {
    const m = new Map<string, IconDef[]>();
    for (const c of lib?.categories ?? []) m.set(c.id, (lib?.icons ?? []).filter((i) => i.c === c.id).slice(0, 6));
    return m;
  }, [lib]);

  const opened = openId ? results.find((i) => i.i === openId) ?? null : null;
  const openIdx = opened ? results.indexOf(opened) : -1;

  const toResults = useCallback(() => {
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
  }, []);
  // Picking a category browses that category, so it also drops any search words that would otherwise leave it empty.
  const pickCategory = (id: string) => {
    setCat((c) => (c === id ? "all" : id));
    setQ("");
    toResults();
  };
  const step = useCallback(
    (d: number) => {
      if (!results.length) return;
      const i = (openIdx + d + results.length) % results.length;
      setOpenId(results[i].i);
    },
    [results, openIdx],
  );
  const close = useCallback(() => {
    setOpenId(null);
    lastTile.current?.focus({ preventScroll: true });
  }, []);
  const reset = () => {
    setQ("");
    setCat("all");
    setRecent(false);
  };
  const filtered = searching || cat !== "all" || recent;

  return (
    <div className="ic">
      <header className="ic-top">
        <Link href="/" className="ic-word" aria-label="Pasteables home">
          <img src="/logo.png" alt="" width={40} height={40} />
          <span>Pasteables</span>
        </Link>
        <nav aria-label="Main">
          <Link href="/#packs">Stickers</Link>
          <Link href="/icons" aria-current="page">
            Icons
          </Link>
        </nav>
        <button type="button" className={`ic-unlock${active ? " pro" : ""}`} onClick={() => openUpgrade("menu")}>
          {active ? "Full access" : "Unlock all"}
        </button>
      </header>

      <main>
        <section className="ic-hero">
          <h1>Icon Library</h1>
          <p>Explore a growing collection of thoughtfully designed icons for interfaces, products, and everyday creative workflows.</p>
          <form className="ic-search" role="search" onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) toResults(); // the results sit below the category cards, so Enter takes you to them
            }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5L20 20" />
            </svg>
            <input type="text" inputMode="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search icons, categories, or keywords..." aria-label="Search icons, categories, or keywords" autoComplete="off" spellCheck={false} />
            {q && (
              <button type="button" aria-label="Clear search" onClick={() => setQ("")}>
                ✕
              </button>
            )}
          </form>
          <div className="ic-filters">
            <label>
              <span>Category</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} disabled={!lib}>
                <option value="all">All categories</option>
                {shown.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.count})
                  </option>
                ))}
              </select>
            </label>
            <div className="ic-fstyle">
              <span id="ic-style-l">Style</span>
              <div className="ic-seg" role="radiogroup" aria-labelledby="ic-style-l">
                {STYLES.map((s) => (
                  <button key={s.v} type="button" role="radio" aria-checked={style === s.v} className={style === s.v ? "on" : ""} onClick={() => setStyle(s.v)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="ic-check">
              <input type="checkbox" checked={recent} onChange={(e) => setRecent(e.target.checked)} />
              <span>Recently added</span>
            </label>
            {filtered && (
              <button type="button" className="ic-reset" onClick={reset}>
                Reset filters
              </button>
            )}
          </div>
        </section>

        <section className="ic-cats" aria-labelledby="ic-cats-h">
          <div className="ic-sec-head">
            <h2 id="ic-cats-h">{lib?.collection.name ?? "Essential UI"}</h2>
            <p>{lib ? `${shownCount} icons in ${shown.length} categories` : "Loading the library…"}</p>
          </div>
          <div className="ic-catgrid">
            {lib
              ? shown.map((c) => (
                  <button key={c.id} type="button" className={`ic-cat${cat === c.id ? " on" : ""}`} aria-pressed={cat === c.id} onClick={() => pickCategory(c.id)}>
                    <span className="ic-cat-top">
                      <b>{c.name}</b>
                      <em>{c.count}</em>
                    </span>
                    <span className="ic-cat-desc">{c.desc}</span>
                    <span className="ic-cat-prev" aria-hidden="true">
                      {previews.get(c.id)?.map((i) => <IconArt key={i.i} icon={i} style={style} size={22} />)}
                    </span>
                  </button>
                ))
              : Array.from({ length: 10 }, (_, i) => <div key={i} className="ic-cat skel" aria-hidden="true" />)}
          </div>
        </section>

        <section className="ic-results" ref={resultsRef} aria-labelledby="ic-res-h" style={{ scrollMarginTop: 90 }}>
          <div className="ic-sec-head">
            <h2 id="ic-res-h">{cat !== "all" ? catName.get(cat) : q.trim() ? "Search results" : "All icons"}</h2>
            <p role="status" aria-live="polite">
              {lib ? `${results.length} ${results.length === 1 ? "icon" : "icons"}${q.trim() ? ` for “${q.trim()}”` : ""}` : ""}
            </p>
          </div>

          {failed ? (
            <div className="ic-empty">
              <h3>The icons didn’t load</h3>
              <p>Check your connection and try again.</p>
              <button type="button" onClick={() => location.reload()}>
                Reload
              </button>
            </div>
          ) : !lib ? (
            <div className="ic-grid" aria-busy="true" aria-label="Loading icons">
              {Array.from({ length: 36 }, (_, i) => (
                <div key={i} className="ic-tile skel" aria-hidden="true" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="ic-empty">
              <IconArt icon={lib.icons.find((i) => i.i === "search") ?? lib.icons[0]} size={40} />
              <h3>No icons match{q.trim() ? ` “${q.trim()}”` : ""}</h3>
              <p>Try another word, or browse a category above.</p>
              <button type="button" onClick={reset}>
                {q ? "Clear search" : "Reset filters"}
              </button>
            </div>
          ) : (
            groups.map((g) => (
              <div key={g.cat.id} className="ic-group">
                {(cat === "all" || groups.length > 1) && (
                  <h3>
                    {g.cat.name} <small>{g.icons.length}</small>
                  </h3>
                )}
                <div className="ic-grid">
                  {g.icons.map((ic) => (
                    <button
                      key={ic.i}
                      type="button"
                      className="ic-tile"
                      aria-label={`${ic.n} icon`}
                      onClick={(e) => {
                        lastTile.current = e.currentTarget;
                        setOpenId(ic.i);
                      }}
                    >
                      <IconArt icon={ic} style={style} size={28} />
                      <span>{ic.n}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <footer className="ic-foot">
        <span>© Pasteables. All rights reserved.</span>
        <Link href="/">Back to stickers</Link>
      </footer>

      {opened && lib && <IconDialog key="dialog" icon={opened} categoryName={catName.get(opened.c) ?? ""} position={openIdx + 1} total={results.length} initialStyle={style} onClose={close} onStep={step} />}
    </div>
  );
}
