"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import { DEFAULT_INK, FORMAT_LABEL, formatOutput, transformSvg } from "@/lib/transform";
import type { Format } from "@/lib/transform";
import type { Gallery, Section, Tile } from "@/lib/types";

interface Studio {
  color: number; // -1 = mixed
  style: "filled" | "outlined";
  stroke: number;
  ink: string;
  eyes: number;
  format: Format;
}

const DEFAULTS: Studio = { color: -1, style: "filled", stroke: 1, ink: DEFAULT_INK, eyes: 1, format: "svg" };

function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { v: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <div className="ctl">
      <span className="ctl-label" id={id}>
        {label}
      </span>
      <div className="seg" role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={value === o.v}
            className={value === o.v ? "on" : ""}
            onClick={() => onChange(o.v)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Swatches({
  label,
  small,
  items,
  value,
  onChange,
}: {
  label: string;
  small?: boolean;
  items: { v: string; hex: string | null; title: string; sr?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="ctl">
      <span className="ctl-label" id={id}>
        {label}
      </span>
      <div className="sws" role="radiogroup" aria-labelledby={id}>
        {items.map((it) => (
          <button
            key={it.v}
            type="button"
            role="radio"
            aria-checked={value === it.v}
            className={`sw${small ? " small" : ""}${it.hex ? "" : " mixed"}${value === it.v ? " on" : ""}`}
            style={it.hex ? { background: it.hex } : undefined}
            title={it.title}
            onClick={() => onChange(it.v)}
          >
            <span className="srOnly2">{it.sr ?? it.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

async function copyText(s: string) {
  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    const a = document.createElement("textarea");
    a.value = s;
    a.style.cssText = "position:fixed;left:-9999px;opacity:0";
    document.body.appendChild(a);
    a.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    document.body.removeChild(a);
    return ok;
  }
}

const SectionView = memo(function SectionView({
  section,
  st,
  onCopied,
}: {
  section: Section;
  st: Studio;
  onCopied: (msg: string) => void;
}) {
  const { palette, base } = section;
  const outlined = st.style === "outlined";
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const render = (t: Tile, i: number) => {
    const hex =
      palette.length && base ? (st.color === -1 ? palette[i % palette.length] : palette[Math.min(st.color, palette.length - 1)]) : undefined;
    const src = outlined && t.alt ? t.alt : t.svg;
    return transformSvg(src, { from: base || undefined, to: hex, outlined, stroke: st.stroke, ink: st.ink, eyes: st.eyes });
  };

  const onClick = async (t: Tile, i: number) => {
    const ok = await copyText(formatOutput(t.name, render(t, i), st.format));
    if (ok) {
      setCopiedIdx(i);
      onCopied(`${t.name} copied as ${FORMAT_LABEL[st.format]}`);
      setTimeout(() => setCopiedIdx((c) => (c === i ? null : c)), 1800);
    } else {
      onCopied("Copy was blocked by this browser. Try opening the page in a full tab.");
    }
  };

  return (
    <section className="gsec">
      <h3>{section.title}</h3>
      <p>{section.desc}</p>
      <div className="gshelf">
        {section.tiles.map((t, i) => (
          <button
            key={t.name + i}
            type="button"
            className="gtile"
            data-state={copiedIdx === i ? "copied" : undefined}
            aria-label={`Copy ${t.name} as ${FORMAT_LABEL[st.format]}`}
            onClick={() => onClick(t, i)}
          >
            <div className="gstage" dangerouslySetInnerHTML={{ __html: render(t, i) }} />
            <div className="gcap">
              <span>{t.name}</span>
              <span className="ghint">{copiedIdx === i ? "Copied" : "Click to copy"}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
});

export default function GalleryView({
  gallery,
  hidden,
  focusTitle,
  onClose,
  onCopied,
}: {
  gallery: Gallery;
  hidden: boolean;
  focusTitle: boolean;
  onClose: () => void;
  onCopied: (msg: string) => void;
}) {
  const [st, setSt] = useState<Studio>(DEFAULTS);
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const strokeId = useId();
  const eyesId = useId();
  const patch = (p: Partial<Studio>) => setSt((s) => ({ ...s, ...p }));

  useEffect(() => {
    if (hidden) return;
    ref.current?.scrollTo(0, 0);
    if (focusTitle) titleRef.current?.focus({ preventScroll: true });
  }, [hidden, focusTitle]);

  const dirty = st.color !== -1 || st.style !== "filled" || st.stroke !== 1 || st.ink !== DEFAULT_INK || st.eyes !== 1;

  return (
    <div
      ref={ref}
      className="gal"
      id={`g-${gallery.id}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`gt-${gallery.id}`}
      hidden={hidden}
    >
      <div className="gin">
        <button type="button" className="gback" onClick={onClose}>
          &larr; Back to home
        </button>
        <div className="gh">
          <h2 id={`gt-${gallery.id}`} tabIndex={-1} ref={titleRef}>
            {gallery.title}
          </h2>
          <p>{gallery.subtitle}</p>
        </div>

        <div className="studio">
          {gallery.hasColor && (
            <Swatches
              label="Color"
              items={gallery.colors.map((c) => ({ v: String(c.v), hex: c.hex, title: c.title, sr: c.hex ? c.title : "Mixed colors" }))}
              value={String(st.color)}
              onChange={(v) => patch({ color: parseInt(v, 10) })}
            />
          )}
          <Seg
            label="Style"
            value={st.style}
            options={[
              { v: "filled", label: "Filled" },
              { v: "outlined", label: "Outlined" },
            ]}
            onChange={(style) => patch({ style })}
          />
          <div className="ctl">
            <label className="ctl-label" htmlFor={strokeId}>
              Stroke
            </label>
            <input
              id={strokeId}
              className="range"
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={st.stroke}
              onChange={(e) => patch({ stroke: parseFloat(e.target.value) })}
            />
            <output className="range-val">{st.stroke.toFixed(1)}x</output>
          </div>
          <div className="ctl">
            <label className="ctl-label" htmlFor={eyesId}>
              Eyes
            </label>
            <input
              id={eyesId}
              className="range"
              type="range"
              min={0.6}
              max={1.5}
              step={0.05}
              value={st.eyes}
              onChange={(e) => patch({ eyes: parseFloat(e.target.value) })}
            />
            <output className="range-val">{Math.round(st.eyes * 100) / 100}x</output>
          </div>
          <Swatches
            label="Ink"
            small
            items={gallery.inks.map((i) => ({ v: i.hex, hex: i.hex, title: i.title }))}
            value={st.ink}
            onChange={(ink) => patch({ ink })}
          />
          <Seg
            label="Copy as"
            value={st.format}
            options={[
              { v: "svg", label: "SVG" },
              { v: "react", label: "React" },
              { v: "flutter", label: "Flutter" },
            ]}
            onChange={(format) => patch({ format })}
          />
          <button type="button" className="reset" hidden={!dirty} onClick={() => setSt((s) => ({ ...DEFAULTS, format: s.format }))}>
            Reset
          </button>
        </div>

        {gallery.sections.map((s) => (
          <SectionView key={s.title} section={s} st={st} onCopied={onCopied} />
        ))}
      </div>
    </div>
  );
}
