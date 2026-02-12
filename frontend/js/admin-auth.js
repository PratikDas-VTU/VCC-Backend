document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminForm");

  if (!form) {
    console.error("Admin login form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("adminId").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (!username || !password) {
      showMessage("Please enter admin credentials", "error");
      return;
    }

    try {
      const res = await fetch(
        "https://vcc-backend-myyu.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true" // Bypass ngrok warning page
          },
          body: JSON.stringify({ username, password })
        }
      );

      const data = await res.json();
      console.log("📦 Admin login response data:", data);

      if (!res.ok) {
        console.error("❌ Admin login failed:", data.message);
        showMessage(data.message || "Invalid admin credentials", "error");
        return;
      }

      console.log("✅ Admin login successful!");
      console.log("🎫 Storing admin token:", data.token);

      // ✅ Store admin JWT
      localStorage.setItem("adminToken", data.token);

      console.log("✅ Admin token stored in localStorage");
      console.log("🔍 Verifying token storage:", localStorage.getItem("adminToken"));

      showMessage("Admin login successful", "success");

      // Small delay for UX, then redirect
      console.log("⏳ Redirecting to admin dashboard in 600ms...");
      setTimeout(() => {
        console.log("🔄 Redirecting now to admin-dashboard.html");
        window.location.replace("admin-dashboard.html");
      }, 600);

    } catch (err) {
      console.error("Admin login error:", err);
      showMessage("Unable to reach admin server", "error");
    }
  });

  /* ======================
     UI MESSAGE HANDLER
     ====================== */
  function showMessage(text, type) {
    let msg = document.getElementById("adminMsg");

    if (!msg) {
      msg = document.createElement("div");
      msg.id = "adminMsg";
      msg.style.marginTop = "12px";
      msg.style.fontSize = "14px";
      form.appendChild(msg);
    }

    msg.textContent = text;
    msg.style.color = type === "success" ? "#4ade80" : "#f87171";
  }
});
