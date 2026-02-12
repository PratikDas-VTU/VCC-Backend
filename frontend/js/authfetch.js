export async function authFetch(url, options = {}) {
  console.log("🔐 authFetch called with URL:", url);

  const token = localStorage.getItem("token");
  console.log("🎫 Token from localStorage:", token ? "EXISTS" : "MISSING");

  if (!token) {
    console.error("❌ No token found, redirecting to login");
    window.location.replace("participant-login.html");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page
    ...(options.headers || {}),
    "Authorization": `Bearer ${token}`
  };

  console.log("📤 Request headers:", headers);
  console.log("📤 Request options:", options);

  try {
    console.log("🌐 Calling fetch...");
    const response = await fetch(url, {
      ...options,
      headers
    });

    console.log("📥 Response received:", response);
    console.log("📊 Response status:", response.status);
    console.log("📊 Response ok:", response.ok);

    // If token expired / invalid
    if (response.status === 401 || response.status === 403) {
      console.error("❌ Unauthorized - clearing localStorage and redirecting");
      localStorage.clear();
      window.location.replace("participant-login.html");
      return;
    }

    return response;
  } catch (error) {
    console.error("❌ FETCH ERROR in authFetch:", error);
    console.error("❌ Error message:", error.message);
    throw error;
  }
}
