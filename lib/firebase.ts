import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Web config identifies the project; it is not a secret.
const firebaseConfig = {
  apiKey: "AIzaSyCvptc_WJpf0hDoCgZdSJ7xCMINEIMUtl4",
  authDomain: "figmaebae-8c3e0.firebaseapp.com",
  projectId: "figmaebae-8c3e0",
  storageBucket: "figmaebae-8c3e0.firebasestorage.app",
  messagingSenderId: "149758722640",
  appId: "1:149758722640:web:af51e1bfd68ce835aa0755",
  measurementId: "G-07N4JPY00M",
};

/** Browser only. Analytics needs window, so it is skipped on the server and in unsupported browsers. */
export async function initAnalytics() {
  if (typeof window === "undefined" || !(await isSupported())) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAnalytics(app);
}
