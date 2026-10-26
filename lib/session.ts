// Sign-ins last until 14 days of inactivity. Firebase keeps people signed in indefinitely on its own,
// so we remember when they were last here and sign them out if the gap is too long.
export const IDLE_LIMIT_MS = 14 * 24 * 60 * 60 * 1000;
const KEY = "pasteables:lastActive";

export function readLastActive(): number | null {
  try {
    const v = Number(localStorage.getItem(KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

export function markActive(now = Date.now()) {
  try {
    localStorage.setItem(KEY, String(now));
  } catch {}
}

export function clearActive() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

/** True when the visitor has been away longer than the limit. No record yet means a fresh session. */
export function hasExpired(lastActive: number | null, now = Date.now(), limit = IDLE_LIMIT_MS) {
  return lastActive !== null && now - lastActive > limit;
}
