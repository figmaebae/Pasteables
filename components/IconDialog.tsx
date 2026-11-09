"use client";

import { useEffect, useId, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import IconArt from "./IconArt";
import { copyGated, copyText, downloadText } from "@/lib/clipboard";
import { useAccess } from "./AccessProvider";
import { STYLES, componentName, iconSvg, iconToFlutter, iconToReact } from "@/lib/icons/render";
import type { IconDef, IconStyle } from "@/lib/icons/render";

const WHITE = "#FFFFFF";
const BLACK = "#000000";

export default function IconDialog({
  icon,
  categoryName,
  position,
  total,
  initialStyle,
  onClose,
  onStep,
}: {
  icon: IconDef;
  categoryName: string;
  position: number;
  total: number;
  initialStyle: IconStyle;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [style, setStyle] = useState<IconStyle>(initialStyle);
  const [bg, setBg] = useState<"light" | "dark">("light");
  const [size, setSize] = useState(64);
  const [color, setColor] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  // Corner radius (24 x 24 icon units). null keeps the drawn corners. Only Solid and Duotone have one.
  const [radius, setRadius] = useState<number | null>(null);
  // Line thickness on the 24 x 24 grid. null keeps the default (1.8). Applies to every style.
  const [stroke, setStroke] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sizeId = useId();
  const colorId = useId();
  const radiusId = useId();
  const strokeId = useId();
  // a colour that is neither white nor black came from the picker
  const custom = color !== null && color.toUpperCase() !== WHITE && color.toUpperCase() !== BLACK;

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    // Removing a modal <dialog> from the page closes it, so there is nothing else to clean up but the timer.
    return () => {
      if (noteTimer.current) clearTimeout(noteTimer.current);
    };
  }, []);

  const say = (text: string) => {
    setNote(text);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(""), 1800);
  };
  const rounded = style === "line" ? null : radius;
  const opts = { color: color ?? undefined, radius: rounded, stroke };
  const label = `${icon.n} (${STYLES.find((s) => s.v === style)?.label})`;

  const copy = async (what: string, text: string) => say((await copyText(text)) ? `${what} copied` : "Copy was blocked by this browser");
  const { claimIcon } = useAccess();
  // Copying or downloading an icon counts against the free daily allowance; customizing never does.
  const copyIcon = async (what: string, text: string) => {
    const r = await copyGated(claimIcon(icon.i), text);
    if (r === "ok") say(`${what} copied`);
    else if (r === "blocked") say("Copy was blocked by this browser");
  };
  const fileName = `${icon.i}${style === "line" ? "" : `-${style}`}.svg`;

  return (
    <dialog
      ref={ref}
      className="ic-dialog"
      aria-labelledby="ic-dt"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      onKeyDown={(e) => {
        if (e.target instanceof HTMLInputElement) return;
        if (e.key === "ArrowRight") onStep(1);
        else if (e.key === "ArrowLeft") onStep(-1);
      }}
    >
      <div className="ic-d-head">
        <div>
          <h2 id="ic-dt">{icon.n}</h2>
          <p>
            {categoryName} <span aria-hidden="true">·</span> <span>{position} of {total}</span>
          </p>
        </div>
        <div className="ic-d-nav">
          <button type="button" aria-label="Previous icon" onClick={() => onStep(-1)} disabled={total < 2}>
            ←
          </button>
          <button type="button" aria-label="Next icon" onClick={() => onStep(1)} disabled={total < 2}>
            →
          </button>
          <button type="button" aria-label="Close" className="x" onClick={() => ref.current?.close()}>
            ✕
          </button>
        </div>
      </div>

      <div className="ic-d-body">
        <div className={`ic-pv ${bg}`} style={color ? { color } : undefined}>
          <IconArt icon={icon} style={style} size={size} radius={rounded} stroke={stroke} className="ic-pv-art" />
          <small>
            {size} × {size} px
          </small>
        </div>

        <div className="ic-d-ctl">
          <div className="ic-ctl">
            <span className="ic-lab">Style</span>
            <div className="ic-styles" role="radiogroup" aria-label="Icon style">
              {STYLES.map((s) => (
                <button key={s.v} type="button" role="radio" aria-checked={style === s.v} className={style === s.v ? "on" : ""} onClick={() => setStyle(s.v)}>
                  <IconArt icon={icon} style={s.v} size={26} radius={s.v === "line" ? null : radius} stroke={stroke} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ic-ctl">
            <span className="ic-lab">Background</span>
            <div className="ic-seg" role="radiogroup" aria-label="Preview background">
              {(["light", "dark"] as const).map((b) => (
                <button key={b} type="button" role="radio" aria-checked={bg === b} className={bg === b ? "on" : ""} onClick={() => setBg(b)}>
                  {b === "light" ? "Light" : "Dark"}
                </button>
              ))}
            </div>
          </div>

          <div className="ic-ctl">
            <label className="ic-lab" htmlFor={sizeId}>
              Size
            </label>
            <div className="ic-row">
              <input id={sizeId} type="range" min={16} max={160} step={4} value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} />
              <output>{size}px</output>
            </div>
          </div>

          <div className="ic-ctl">
            <label className="ic-lab" htmlFor={strokeId}>
              Stroke
            </label>
            <div className="ic-row">
              <input id={strokeId} type="range" min={0.5} max={3.5} step={0.1} value={stroke ?? 1.8} onChange={(e) => setStroke(Math.round(parseFloat(e.target.value) * 10) / 10)} aria-valuetext={stroke === null ? "Default" : `${stroke}`} />
              <output>{stroke === null ? "Default" : stroke}</output>
              {stroke !== null && (
                <button type="button" className="ic-link" onClick={() => setStroke(null)}>
                  Reset
                </button>
              )}
            </div>
          </div>

          {style !== "line" && (
            <div className="ic-ctl">
              <label className="ic-lab" htmlFor={radiusId}>
                Corner radius
              </label>
              <div className="ic-row">
                <input id={radiusId} type="range" min={0} max={12} step={0.5} value={radius ?? 3} onChange={(e) => setRadius(parseFloat(e.target.value))} aria-valuetext={radius === null ? "Default" : `${radius}`} />
                <output>{radius === null ? "Default" : radius}</output>
                {radius !== null && (
                  <button type="button" className="ic-link" onClick={() => setRadius(null)}>
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="ic-ctl">
            <span className="ic-lab" id={colorId}>
              Color
            </span>
            <div className="ic-row">
              <div className="ic-sws" role="group" aria-labelledby={colorId}>
                <button type="button" aria-pressed={color === WHITE} className={`ic-sw white${color === WHITE ? " on" : ""}`} title="White" onClick={() => setColor(color === WHITE ? null : WHITE)}>
                  <span className="sr">White</span>
                </button>
                <button type="button" aria-pressed={color === BLACK} className={`ic-sw black${color === BLACK ? " on" : ""}`} title="Black" onClick={() => setColor(color === BLACK ? null : BLACK)}>
                  <span className="sr">Black</span>
                </button>
                {/* the round swatch opens the colour picker panel below */}
                <button
                  type="button"
                  className={`ic-sw wheel${custom ? " on has" : ""}${picking ? " open" : ""}`}
                  title="Pick a custom color"
                  aria-label="Pick a custom color"
                  aria-expanded={picking}
                  style={custom && color ? ({ ["--c" as string]: color } as React.CSSProperties) : undefined}
                  onClick={() => setPicking((o) => !o)}
                />
              </div>
              {color !== null && (
                <button type="button" className="ic-link" onClick={() => setColor(null)}>
                  Reset
                </button>
              )}
            </div>
            {picking && <ColorPicker value={color ?? "#292724"} onChange={setColor} onClose={() => setPicking(false)} />}
          </div>

          <div className="ic-acts">
            <button type="button" className="primary" onClick={() => copyIcon("SVG", iconSvg(icon, style, { size, ...opts }))}>
              Copy SVG
            </button>
            <button type="button" onClick={async () => { if (await claimIcon(icon.i)) { downloadText(fileName, iconSvg(icon, style, { size, ...opts })); say(`Downloaded ${fileName}`); } }}>
              Download SVG
            </button>
            <button type="button" onClick={() => copyIcon("React component", iconToReact(icon, style, opts))}>
              Copy React
            </button>
            <button type="button" onClick={() => copyIcon("Flutter code", iconToFlutter(icon, style, opts))}>
              Copy Flutter
            </button>
            <button type="button" onClick={() => copy("Icon name", icon.n)}>
              Copy icon name
            </button>
          </div>
          <p className="ic-hint">
            React and Flutter name: <code>{componentName(icon, style)}</code>
          </p>
          <p className="ic-note" role="status" aria-live="polite">
            {note}
          </p>
        </div>
      </div>
      <span className="sr">{label}</span>
    </dialog>
  );
}
