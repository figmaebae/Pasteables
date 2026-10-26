"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { clearActive, hasExpired, markActive, readLastActive } from "@/lib/session";

type Reason = "start" | "copy";

interface AuthValue {
  user: User | null;
  /** True until Firebase has told us whether someone is signed in. */
  loading: boolean;
  /**
   * Opens the sign-in dialog. `afterSignIn` runs once sign-in succeeds and returns whether it did its job
   * (used to finish a copy the visitor started while signed out).
   */
  requestSignIn: (reason?: Reason, afterSignIn?: () => Promise<boolean>) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthValue>({ user: null, loading: true, requestSignIn: () => {}, signOut: () => {} });
export const useAuth = () => useContext(Ctx);

function explain(code: string) {
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.";
    case "auth/operation-not-allowed":
      return "Google sign-in isn't switched on yet.";
    case "auth/unauthorized-domain":
      return "This website address isn't authorized for sign-in yet.";
    case "auth/account-exists-with-different-credential":
      return "An account with this email already exists using a different sign-in method.";
    case "auth/network-request-failed":
      return "Couldn't reach the sign-in service. Check your connection and try again.";
    default:
      return "Couldn't sign in with Google. Please try again.";
  }
}

const GoogleG = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 5.04c1.5 0 2.84.52 3.9 1.53l2.9-2.9C17.05 1.99 14.76 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.4 2.64C6.4 7.24 9 5.04 12 5.04z" />
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32l3.4 2.64c2-1.85 3.44-4.57 3.44-7.97z" />
    <path fill="#FBBC05" d="M5.58 14.29a7.2 7.2 0 0 1 0-4.58l-3.4-2.64a11.97 11.97 0 0 0 0 9.86l3.4-2.64z" />
    <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.4-2.64c-1.1.74-2.5 1.18-4.53 1.18-3 0-5.6-2.2-6.42-5.07l-3.4 2.64C3.99 20.53 7.7 23 12 23z" />
  </svg>
);
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState({ text: "", show: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const after = useRef<(() => Promise<boolean>) | null>(null);
  const expired = useRef(false);

  // Auth state, plus the 14-day inactivity rule: away for longer than that means signing in again.
  useEffect(() => {
    let unsub = () => {};
    try {
      const auth = getFirebaseAuth();
      unsub = onAuthStateChanged(auth, (u) => {
        if (u && hasExpired(readLastActive())) {
          clearActive();
          setUser(null);
          setLoading(false);
          void fbSignOut(auth);
          expired.current = true;
          return;
        }
        if (u) markActive();
        else clearActive();
        setUser(u);
        setLoading(false);
        if (!u && expired.current) {
          expired.current = false;
          say("You were signed out after 2 weeks away. Sign in again to keep copying.");
        }
      });
    } catch {
      setLoading(false);
    }
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While signed in, any activity renews the 14 days (written at most once a minute).
  useEffect(() => {
    if (!user) return;
    let last = 0;
    const touch = () => {
      const now = Date.now();
      if (now - last < 60_000) return;
      last = now;
      markActive(now);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") touch();
    };
    const events = ["pointerdown", "keydown", "scroll", "focus"] as const;
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    touch();
    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user]);

  // Keep the native <dialog> in step with `open`.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const say = useCallback((text: string) => {
    setNotice({ text, show: true });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice((n) => ({ ...n, show: false })), 2600);
  }, []);

  const requestSignIn = useCallback((_reason: Reason = "start", afterSignIn?: () => Promise<boolean>) => {
    after.current = afterSignIn ?? null;
    setError("");
    setOpen(true);
  }, []);

  const signIn = async () => {
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      setOpen(false);
      const finish = after.current;
      after.current = null;
      if (finish) {
        // Try to finish the copy the visitor asked for. Browsers can refuse once the sign-in pop-up has taken focus.
        const ok = await finish().catch(() => false);
        if (!ok) say("You're signed in. Your browser blocked the automatic copy, so click the sticker again to copy it.");
      } else {
        say("Welcome to Pasteables!");
      }
    } catch (e) {
      setError(explain((e as { code?: string }).code ?? ""));
    } finally {
      setBusy(false);
    }
  };

  const signOut = useCallback(() => {
    void fbSignOut(getFirebaseAuth()).then(() => say("Signed out"));
  }, [say]);

  const value = useMemo(() => ({ user, loading, requestSignIn, signOut }), [user, loading, requestSignIn, signOut]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <dialog
        ref={dialog}
        className="auth-dialog"
        aria-labelledby="auth-title"
        onClose={() => {
          setOpen(false);
          if (!busy) after.current = null;
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="auth-dlg">
          <button type="button" className="auth-x" aria-label="Close" onClick={() => setOpen(false)}>
            ×
          </button>
          <img className="auth-logo" src="/logo.png" alt="" width={58} height={58} />
          <h2 id="auth-title">Welcome to Pasteables</h2>
          <p className="auth-sub">
            Continue with Google to get started. It takes a few seconds.
          </p>
          <button type="button" className="auth-sso" disabled={busy} onClick={signIn}>
            {GoogleG}
            {busy ? "Opening Google…" : "Continue with Google"}
          </button>
          {error ? (
            <p className="auth-err" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </dialog>
      <div className={`toast${notice.show ? " show" : ""}`} role="status" aria-live="polite">
        {notice.text}
      </div>
    </Ctx.Provider>
  );
}
