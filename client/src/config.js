// API Configuration
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://sudan-embassy-api-919606479278.europe-west1.run.app"
    : "http://localhost:3000");

// Firebase Configuration
export const FIREBASE_CONFIG = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sudan-embassy",
};

// Helper function to get API URL
export const getApiUrl = (endpoint) => `${API_BASE}${endpoint}`;
