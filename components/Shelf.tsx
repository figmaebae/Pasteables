"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GalleryView from "./GalleryView";
import Landing from "./Landing";
import { GALLERY_LOADERS } from "@/lib/galleries";
import type { Gallery, HeroColumn } from "@/lib/types";

function setHash(h: string) {
  try {
    history.replaceState(null, "", h || location.pathname + location.search);
  } catch {}
}

export default function Shelf({ hero }: { hero: HeroColumn[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Record<string, Gallery>>({});
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: "", show: false });
  const lastTrigger = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveFocus = useRef(false);
  // True when opening a pack added a history entry, so closing can simply go back to the homepage.
  const pushed = useRef(false);

  const say = useCallback((text: string) => {
    setToast({ text, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800);
  }, []);

  const open = useCallback((id: string, move: boolean, push = false) => {
    if (!GALLERY_LOADERS[id]) return;
    moveFocus.current = move;
    GALLERY_LOADERS[id]().then((g) => {
      setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: g }));
      setActive(id);
      if (push && location.hash !== "#" + id) {
        // A real history entry: the browser's Back button returns to the homepage instead of leaving the site.
        try {
          history.pushState(null, "", "#" + id);
          pushed.current = true;
        } catch {
          setHash("#" + id);
        }
      } else {
        setHash("#" + id);
      }
    });
  }, []);

  const close = useCallback(() => {
    setActive(null);
    if (pushed.current) {
      pushed.current = false;
      history.back();
    } else {
      setHash("");
    }
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  // Deep links (#mascot) and Escape to close.
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (h) open(h, false);
      else {
        pushed.current = false;
        setActive(null);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const onKey = (e: KeyboardEvent) => {
      // Escape inside the sign-in dialog only closes the dialog, not the pack behind it.
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // The page behind an open gallery shouldn't scroll.
  useEffect(() => {
    document.documentElement.style.overflow = active ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [active]);

  // Warm the chunk on hover so the click feels instant.
  const prefetch = (id: string) => void GALLERY_LOADERS[id]?.();

  const onPackClick = (id: string, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    lastTrigger.current = e.currentTarget;
    open(id, true, true);
  };

  // The logo goes home: out of a pack if one is open, otherwise back to the top of the page.
  const onHome = () => {
    if (active) close();
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Landing hero={hero} onOpenPack={onPackClick} onWarm={prefetch} onHome={onHome} />

      {Object.values(loaded).map((g) => (
        <GalleryView
          key={g.id}
          gallery={g}
          hidden={active !== g.id}
          focusTitle={moveFocus.current}
          onCopied={say}
        />
      ))}

      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        {toast.text}
      </div>
    </>
  );
}
