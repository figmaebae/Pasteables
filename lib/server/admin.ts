import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import type { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/** The service account is a secret: set FIREBASE_SERVICE_ACCOUNT to its JSON (or the JSON base64 encoded). */
function app(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
  const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  return initializeApp({ credential: cert(JSON.parse(json)) });
}

export const adminAuth = () => getAuth(app());
export const db = () => getFirestore(app());
