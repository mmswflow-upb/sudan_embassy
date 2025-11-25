// Firebase client initialization
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ_rjM0FM3JBwbwk0AOuLsb6AHbKs12pE",
  authDomain: "sudan-embassy.firebaseapp.com",
  projectId: "sudan-embassy",
  storageBucket: "sudan-embassy.firebasestorage.app",
  messagingSenderId: "919606479278",
  appId: "1:919606479278:web:4f37a0bfcfadf04dcea03f",
  measurementId: "G-LZG5WD3SDR",
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
