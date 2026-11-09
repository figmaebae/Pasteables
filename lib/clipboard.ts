/** Copy text to the clipboard, with a fallback for browsers that block the async API. Returns whether it worked. */
export async function copyText(s: string): Promise<boolean> {
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

/** Save text as a file in the browser. */
export function downloadText(filename: string, text: string, type = "image/svg+xml") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Copies text only once `gate` says yes (used to check a daily allowance first). The clipboard needs the click that started
 * it, so on browsers that allow it the write is started right away with the text arriving after the check.
 */
export async function copyGated(gate: Promise<boolean>, text: string): Promise<"ok" | "denied" | "blocked"> {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    let allowed = true;
    const blob = gate.then((ok) => {
      allowed = ok;
      if (!ok) throw new Error("denied");
      return new Blob([text], { type: "text/plain" });
    });
    try {
      await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
      return "ok";
    } catch {
      if (!allowed) return "denied";
    }
  }
  if (!(await gate)) return "denied";
  return (await copyText(text)) ? "ok" : "blocked";
}
