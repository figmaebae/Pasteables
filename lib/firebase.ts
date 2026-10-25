import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Web config identifies the project; it is not a secret.
const firebaseConfig = {
  apiKey: "AIzaSyACi128GMS2tKoQ-O1SfmMMurpf8-suZwA",
  authDomain: "pasteables-98fbf.firebaseapp.com",
  projectId: "pasteables-98fbf",
  storageBucket: "pasteables-98fbf.firebasestorage.app",
  messagingSenderId: "1027017942105",
  appId: "1:1027017942105:web:d2fbc398e088189f673d48",
  measurementId: "G-JEGJDXNX05",
};

/** Browser only: one shared Firebase app. */
export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

/** Browser only. Analytics needs window, so it is skipped on the server and in unsupported browsers. */
export async function initAnalytics() {
  if (typeof window === "undefined" || !(await isSupported())) return null;
  return getAnalytics(getFirebaseApp());
}
