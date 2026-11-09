"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { FREE_ICONS_PER_DAY, FREE_STICKERS } from "@/lib/access-config";
import type { AccessInfo } from "@/lib/access-config";
import { copyText } from "@/lib/clipboard";
import type { Gallery } from "@/lib/types";

export type UpgradeReason = "icons" | "pack" | "menu";

interface AccessValue {
  /** The server's answer about this visitor; null until it arrives (or if payments aren't reachable). */
  info: AccessInfo | null;
  active: boolean;
  /** Changes whenever what this visitor may see changes (sign in, sign out, purchase). */
  key: string;
  loadGallery: (id: string) => Promise<Gallery>;
  /** Asks the server whether an icon may be copied or downloaded now. Opens the upgrade dialog when not. */
  claimIcon: (id: string) => Promise<boolean>;
  openUpgrade: (reason?: UpgradeReason) => void;
}

const Ctx = createContext<AccessValue>({
  info: null,
  active: false,
  key: "anon:0",
  loadGallery: () => Promise.reject(new Error("no provider")),
  claimIcon: async () => true,
  openUpgrade: () => {},
});
export const useAccess = () => useContext(Ctx);

const money = (amount?: number, currency = "INR") =>
  amount == null ? "" : new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: amount % 100 ? 2 : 0 }).format(amount / 100);

const REASON: Record<UpgradeReason, string> = {
  icons: `You've used your ${FREE_ICONS_PER_DAY} free icons for today. They reset at midnight, India time.`,
  pack: "This sticker is part of the full collection.",
  menu: "Get every sticker pack and every icon, now and in the future.",
};

export default function AccessProvider({ children }: { children: ReactNode }) {
  const { user, loading, requestSignIn } = useAuth();
  const [info, setInfo] = useState<AccessInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<UpgradeReason>("menu");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ text: "", show: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cache = useRef(new Map<string, Promise<Gallery>>());

  const say = useCallback((text: string) => {
    setToast({ text, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200);
  }, []);

  const headers = useCallback(async (): Promise<Record<string, string>> => {
    const t = user ? await user.getIdToken() : null;
    return t ? { Authorization: `Bearer ${t}` } : {};
  }, [user]);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/me", { headers: await headers(), cache: "no-store" });
      setInfo(r.ok ? ((await r.json()) as AccessInfo) : null);
    } catch {
      setInfo(null);
    }
  }, [headers]);

  // Ask the server who this is (and whether they have paid) once Firebase has settled, and again on sign in or out.
  useEffect(() => {
    if (loading) return;
    void refresh();
  }, [loading, user?.uid, refresh]);

  const active = !!info?.active;
  const key = `${user?.uid ?? "anon"}:${active ? 1 : 0}`;

  const loadGallery = useCallback(
    (id: string) => {
      const ck = `${key}|${id}`;
      let p = cache.current.get(ck);
      if (!p) {
        p = (async () => {
          const r = await fetch(`/api/gallery/${id}`, { headers: await headers(), cache: "no-store" });
          if (!r.ok) throw new Error(`pack ${id}: ${r.status}`);
          return ((await r.json()) as { gallery: Gallery }).gallery;
        })();
        p.catch(() => cache.current.delete(ck));
        cache.current.set(ck, p);
      }
      return p;
    },
    [key, headers],
  );

  const openUpgrade = useCallback((r: UpgradeReason = "menu") => {
    setReason(r);
    setErr("");
    setOpen(true);
  }, []);

  const claimIcon = useCallback(
    async (id: string) => {
      if (active) return true;
      try {
        const r = await fetch("/api/icons/claim", { method: "POST", headers: { "Content-Type": "application/json", ...(await headers()) }, body: JSON.stringify({ id }) });
        if (r.ok) {
          const d = (await r.json()) as { ok: boolean };
          if (d.ok) return true;
          openUpgrade("icons");
          return false;
        }
        throw new Error(String(r.status));
      } catch {
        // While building locally without server keys there is nothing to check against, so don't block the work.
        if (process.env.NODE_ENV !== "production") return true;
        say("Couldn't check your daily icons. Please try again.");
        return false;
      }
    },
    [active, headers, openUpgrade, say],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const goCheckout = useCallback(async () => {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: await headers() });
      const d = (await r.json()) as { url?: string; already?: boolean; error?: string };
      if (d.already) {
        await refresh();
        setOpen(false);
        say("You already have full access.");
      } else if (d.url) {
        window.location.href = d.url;
        return;
      } else setErr(d.error ?? "Couldn't start checkout. Please try again.");
    } catch {
      setErr("Couldn't reach checkout. Check your connection and try again.");
    }
    setBusy(false);
  }, [headers, refresh, say]);

  const buy = () => {
    if (!user) {
      requestSignIn("start", async () => {
        void goCheckout();
        return true;
      });
      return;
    }
    void goCheckout();
  };

  // Coming back from Dodo: ?payment_id=…&status=… is added to the return address. The server checks the payment itself.
  const returning = useRef<string | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const p = q.get("payment_id");
    if (p && q.get("checkout") === "return") returning.current = p;
  }, []);
  useEffect(() => {
    const pid = returning.current;
    if (!pid || loading) return;
    const clean = () => {
      returning.current = null;
      try {
        history.replaceState(null, "", location.pathname + location.hash);
      } catch {}
    };
    const status = new URLSearchParams(location.search).get("status");
    if (status && status !== "succeeded" && status !== "active") {
      clean();
      say("Your payment didn't go through. You haven't been charged.");
      return;
    }
    if (!user) {
      requestSignIn("start", async () => true);
      return;
    }
    returning.current = null;
    (async () => {
      try {
        const r = await fetch("/api/checkout/confirm", { method: "POST", headers: { "Content-Type": "application/json", ...(await headers()) }, body: JSON.stringify({ payment_id: pid }) });
        const d = (await r.json()) as AccessInfo & { error?: string };
        clean();
        if (r.ok && d.active) {
          setInfo(d);
          say("You're in. Everything on Pasteables is unlocked.");
          setReason("menu");
          setOpen(true);
        } else say(d.error ?? "We couldn't confirm that payment yet. Refresh in a minute.");
      } catch {
        clean();
        say("We couldn't confirm that payment yet. Refresh in a minute.");
      }
    })();
  }, [loading, user, headers, requestSignIn, say]);

  const value = useMemo(() => ({ info, active, key, loadGallery, claimIcon, openUpgrade }), [info, active, key, loadGallery, claimIcon, openUpgrade]);

  const offer = info?.offer;
  const price = money(offer?.amount, offer?.currency);

  return (
    <Ctx.Provider value={value}>
      {children}
      <dialog ref={dialog} className="auth-dialog up-dialog" aria-labelledby="up-title" onClose={() => setOpen(false)} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <div className="auth-dlg up-dlg">
          <button type="button" className="auth-x" aria-label="Close" onClick={() => setOpen(false)}>
            ×
          </button>
          {active ? (
            <>
              <h2 id="up-title">You have full access</h2>
              <p className="auth-sub">Every sticker, every icon, and everything added later is yours to customize and copy.</p>
              {info?.licenseKey ? (
                <div className="up-key">
                  <span>Your license key</span>
                  <code>{info.licenseKey}</code>
                  <button
                    type="button"
                    onClick={async () => {
                      if (await copyText(info.licenseKey!)) {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }
                    }}
                  >
                    {copied ? "Copied" : "Copy key"}
                  </button>
                  <small>It's tied to {info.email}. Sign in with that account on any device to use it.</small>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h2 id="up-title">Unlock everything</h2>
              <p className="auth-sub">{REASON[reason]}</p>
              <ul className="up-list">
                <li>
                  <b>All sticker packs</b> including ghost, cloud, mushroom and dumpling
                </li>
                <li>
                  <b>Every icon</b> with no daily limit
                </li>
                <li>
                  <b>Everything we add later</b> at no extra cost
                </li>
              </ul>
              <p className="up-free">
                Free: the first {FREE_STICKERS} stickers of Mascot and Emotes, and {FREE_ICONS_PER_DAY} icons a day, all fully customizable.
              </p>
              {offer?.kind === "lifetime" && (
                <p className="up-price">
                  <strong>{price}</strong> one time
                  <small>
                    Launch price. {offer.seatsLeft} of {offer.seats} spots left.
                  </small>
                </p>
              )}
              {offer?.kind === "monthly" && (
                <p className="up-price">
                  <strong>{price}</strong> a month
                  <small>Cancel any time.</small>
                </p>
              )}
              {offer?.kind === "closed" && <p className="up-price">Sales are paused right now.</p>}
              {!offer && <p className="up-price">Payments aren't available yet. Try again soon.</p>}
              <button type="button" className="auth-sso up-buy" disabled={busy || !offer || offer.kind === "closed"} onClick={buy}>
                {busy ? "Opening checkout…" : user ? "Continue to payment" : "Sign in to continue"}
              </button>
              {err ? (
                <p className="auth-err" role="alert">
                  {err}
                </p>
              ) : null}
            </>
          )}
        </div>
      </dialog>
      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        {toast.text}
      </div>
    </Ctx.Provider>
  );
}
