"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import GalleryView from "./GalleryView";
import { GALLERY_LOADERS } from "@/lib/galleries";
import type { Gallery, HeroColumn } from "@/lib/types";

/** Turn "--c:#fff;--d:0s" into a React style object (custom properties included). */
function parseStyle(css: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of css.split(";")) {
    const i = decl.indexOf(":");
    if (i > 0) out[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
  }
  return out as CSSProperties;
}

function setHash(h: string) {
  try {
    history.replaceState(null, "", h || location.pathname + location.search);
  } catch {}
}

export default function Shelf({ hero }: { hero: HeroColumn[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [popping, setPopping] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Record<string, Gallery>>({});
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: "", show: false });
  const lastTrigger = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveFocus = useRef(false);

  const say = useCallback((text: string) => {
    setToast({ text, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800);
  }, []);

  const open = useCallback((id: string, move: boolean) => {
    if (!GALLERY_LOADERS[id]) return;
    moveFocus.current = move;
    GALLERY_LOADERS[id]().then((g) => {
      setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: g }));
      setActive(id);
      setHash("#" + id);
    });
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setHash("");
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  // Deep links (#mascot) and Escape to close.
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (h) open(h, false);
      else setActive(null);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Warm the chunk on hover so the click feels instant.
  const prefetch = (id: string) => void GALLERY_LOADERS[id]?.();

  const onColumnClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (popping) return;
    lastTrigger.current = e.currentTarget;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPopping(id);
    setTimeout(
      () => {
        open(id, true);
        setPopping(null);
      },
      reduce ? 0 : 240,
    );
  };

  return (
    <>
      <main className="hero">
        <h1 className="srOnly">Vector Shelf: little vectors, one click away</h1>
        {hero.map((c) => (
          <a
            key={c.id}
            className={`col${popping === c.id ? " pop" : ""}`}
            href={`#${c.id}`}
            style={{ "--c": c.color } as CSSProperties}
            onClick={(e) => onColumnClick(e, c.id)}
            onMouseEnter={() => prefetch(c.id)}
            onFocus={() => prefetch(c.id)}
          >
            <h2 className="name">{c.name}</h2>
            <div className="info">
              <p className="desc">{c.desc}</p>
              <p className="tags">
                <span>{c.tag}</span>
                <span>{c.count}</span>
              </p>
            </div>
            <div className="art" aria-hidden="true" style={parseStyle(c.artStyle)} dangerouslySetInnerHTML={{ __html: c.svg }} />
          </a>
        ))}
      </main>

      {Object.values(loaded).map((g) => (
        <GalleryView
          key={g.id}
          gallery={g}
          hidden={active !== g.id}
          focusTitle={moveFocus.current}
          onClose={close}
          onCopied={say}
        />
      ))}

      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        {toast.text}
      </div>
    </>
  );
}
