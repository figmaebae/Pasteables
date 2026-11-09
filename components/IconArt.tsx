import { memo } from "react";
import { iconMarkup } from "@/lib/icons/render";
import type { IconDef, IconStyle } from "@/lib/icons/render";

const cache = new Map<string, string>();
function markup(icon: IconDef, style: IconStyle, size: number, radius?: number | null, stroke?: number | null) {
  const key = `${icon.i}|${style}|${size}|${radius ?? ""}|${stroke ?? ""}`;
  let m = cache.get(key);
  if (!m) {
    m = iconMarkup(icon, style, size, radius, stroke);
    cache.set(key, m);
  }
  return m;
}

/** One icon, drawn from the shared icon data. Follows the surrounding text color. */
const IconArt = memo(function IconArt({ icon, style = "line", size = 24, radius, stroke, className }: { icon: IconDef; style?: IconStyle; size?: number; radius?: number | null; stroke?: number | null; className?: string }) {
  return <span className={className ?? "ic-art"} style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: markup(icon, style, size, radius, stroke) }} />;
});
export default IconArt;
