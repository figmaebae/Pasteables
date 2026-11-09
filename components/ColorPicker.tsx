"use client";

import { useEffect, useId, useRef, useState } from "react";

type Hsv = { h: number; s: number; v: number };

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** "#abc", "abc", "#AABBCC" or "aabbcc" -> "#AABBCC", or null when it isn't a hex colour. */
export function parseHex(text: string): string | null {
  const t = text.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(t)) return "#" + t.split("").map((c) => c + c).join("").toUpperCase();
  if (/^[0-9a-fA-F]{6}$/.test(t)) return "#" + t.toUpperCase();
  return null;
}

function hexToHsv(hex: string, keepHue = 0): Hsv {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = keepHue;
  if (d > 0) {
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return "#" + [f(5), f(3), f(1)].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };

/** A small colour picker: a saturation/brightness area, a hue slider and a hex field. */
export default function ColorPicker({ value, onChange, onClose }: { value: string; onChange: (hex: string) => void; onClose: () => void }) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(parseHex(value) ?? "#292724"));
  const [text, setText] = useState(() => parseHex(value) ?? "#292724");
  const [bad, setBad] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const hexId = useId();
  const hex = hsvToHex(hsv);
  const eyeDropper = typeof window !== "undefined" ? (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper : undefined;

  // close on an outside click or Escape (Escape only closes this panel, not the whole dialog)
  useEffect(() => {
    const down = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node) && !(e.target as HTMLElement).closest?.(".ic-sw.wheel")) onClose();
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [onClose]);
  useEffect(() => {
    const first = root.current?.querySelector<HTMLElement>("[data-area]");
    first?.focus({ preventScroll: true });
  }, []);

  const apply = (next: Hsv) => {
    setHsv(next);
    const h = hsvToHex(next);
    setText(h);
    setBad(false);
    onChange(h);
  };
  const fromPointer = (e: React.PointerEvent) => {
    const r = area.current!.getBoundingClientRect();
    apply({ ...hsv, s: clamp((e.clientX - r.left) / r.width, 0, 1), v: 1 - clamp((e.clientY - r.top) / r.height, 0, 1) });
  };

  return (
    <div
      ref={root}
      className="ic-cp"
      role="dialog"
      aria-label="Pick a color"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div
        ref={area}
        data-area
        className="ic-cp-area"
        style={{ background: `linear-gradient(to top,#000,rgba(0,0,0,0)),linear-gradient(to right,#fff,rgba(255,255,255,0)),hsl(${Math.round(hsv.h)} 100% 50%)` }}
        tabIndex={0}
        role="slider"
        aria-label="Saturation and brightness"
        aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons) fromPointer(e);
        }}
        onKeyDown={(e) => {
          const d = e.shiftKey ? 0.1 : 0.02;
          if (e.key === "ArrowLeft") apply({ ...hsv, s: clamp(hsv.s - d, 0, 1) });
          else if (e.key === "ArrowRight") apply({ ...hsv, s: clamp(hsv.s + d, 0, 1) });
          else if (e.key === "ArrowUp") apply({ ...hsv, v: clamp(hsv.v + d, 0, 1) });
          else if (e.key === "ArrowDown") apply({ ...hsv, v: clamp(hsv.v - d, 0, 1) });
          else return;
          e.preventDefault();
        }}
      >
        <span className="ic-cp-dot" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }} />
      </div>

      <input className="ic-cp-hue" type="range" min={0} max={360} step={1} value={Math.round(hsv.h)} onChange={(e) => apply({ ...hsv, h: parseInt(e.target.value, 10) })} aria-label="Hue" />

      <div className="ic-cp-row">
        {eyeDropper && (
          <button
            type="button"
            className="ic-cp-eye"
            aria-label="Pick a color from the screen"
            title="Pick a color from the screen"
            onClick={async () => {
              try {
                const r = await new eyeDropper().open();
                const h = parseHex(r.sRGBHex);
                if (h) apply(hexToHsv(h, hsv.h));
              } catch {}
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 7l3 3M4 20l1-4 9-9 3 3-9 9ZM15.5 5.5l1.5-1.5a2 2 0 0 1 3 3l-1.5 1.5" />
            </svg>
          </button>
        )}
        <span className="ic-cp-chip" style={{ background: hex }} aria-hidden="true" />
        <div className="ic-cp-hex">
          <label htmlFor={hexId}>Hex</label>
          <input
            id={hexId}
            type="text"
            value={text}
            spellCheck={false}
            autoComplete="off"
            maxLength={7}
            aria-invalid={bad}
            aria-describedby={bad ? `${hexId}-err` : undefined}
            onChange={(e) => {
              const t = e.target.value;
              setText(t);
              const h = parseHex(t);
              if (h) {
                setBad(false);
                setHsv((cur) => hexToHsv(h, cur.h));
                onChange(h);
              } else setBad(/[^0-9a-fA-F]/.test(t.trim().replace(/^#/, ""))); // only flag characters that can never be hex while typing
            }}
            onBlur={() => {
              // an unfinished or invalid value goes back to the last good colour
              if (!parseHex(text)) {
                setText(hex);
                setBad(false);
              } else setText(parseHex(text)!);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const h = parseHex(text);
                if (h) onClose();
                else setBad(true);
              }
            }}
          />
        </div>
      </div>
      {bad && (
        <p id={`${hexId}-err`} className="ic-cp-err" role="alert">
          Enter a hex code like #3B54F0
        </p>
      )}
    </div>
  );
}
