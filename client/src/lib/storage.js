// Server-side upload helper to avoid Firebase Storage CORS in browser

import { auth } from "./firebase";
import { getApiUrl } from "../config.js";

export async function uploadToStorage(folder, file, onProgress) {
  // Use server endpoint to avoid CORS issues
  let token = localStorage.getItem("fbToken") || "";
  try {
    if (auth?.currentUser) {
      token = await auth.currentUser.getIdToken();
      localStorage.setItem("fbToken", token);
    }
  } catch {}
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  if (onProgress) onProgress(10);
  const res = await fetch(getApiUrl("/api/upload"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    let err = "Upload failed";
    try {
      const data = await res.json();
      if (data?.error) err = data.error;
    } catch {}
    throw new Error(err);
  }
  const data = await res.json();
  if (onProgress) onProgress(100);
  return { downloadURL: data.url, fullPath: data.path };
}
