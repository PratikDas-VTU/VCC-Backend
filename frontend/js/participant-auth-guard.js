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
      "https://vcc-backend-myyu.onrender.com/api/team/me"
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
