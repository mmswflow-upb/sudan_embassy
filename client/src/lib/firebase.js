// Firebase client initialization
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Analytics in supported environments (e.g., browser, https/localhost)
export let analytics = undefined;
export const auth = getAuth(firebaseApp);
if (typeof window !== "undefined") {
  isSupported()
    .then((ok) => {
      if (ok) {
        analytics = getAnalytics(firebaseApp);
      }
    })
    .catch(() => {});

  // Keep an up-to-date ID token for authenticated admin actions
  onAuthStateChanged(auth, async (user) => {
    try {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("fbToken", token);
      } else {
        localStorage.removeItem("fbToken");
      }
    } catch {}
  });
}

export default firebaseApp;
