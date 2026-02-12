import { authFetch } from "./authfetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  // 🚫 No token → force login
  if (!token) {
    window.location.replace("participant-login.html");
    return;
  }

  try {
    // 🔐 Validate token by hitting a protected endpoint
    const res = await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/team/me"
    );

    if (!res || !res.ok) {
      throw new Error("Session invalid");
    }

    // ✅ Token valid
    // Do nothing → allow dashboard JS to run

  } catch (err) {
    console.error("Auth guard error:", err);

    // 🧹 Clean logout on ANY auth failure
    localStorage.removeItem("token");
    sessionStorage.clear();

    window.location.replace("participant-login.html");
  }
});
