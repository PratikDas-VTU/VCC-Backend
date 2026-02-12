document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("participantForm");
  const message = document.getElementById("loginMessage");

  if (!form || !message) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    message.className = "login-message";
    message.textContent = "Connecting to server...";

    if (!email || !password) {
      message.textContent = "Email and password are required.";
      message.classList.add("error");
      return;
    }

    try {
      const res = await fetch(
        "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true" // Bypass ngrok warning page
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        message.textContent = data.error || "Login failed.";
        message.classList.add("error");
        return;
      }

      /* =====================
         STORE AUTH DATA
      ===================== */
      localStorage.setItem("token", data.token);



      message.textContent = "Login successful. Redirecting...";
      message.classList.add("success");

      /* =====================
         REDIRECT LOGIC
      ===================== */
      setTimeout(() => {
        window.location.replace("participant-dashboard.html");
      }, 400);


    } catch (err) {
      console.error("Login error:", err);
      message.textContent = "Server unreachable. Please try again.";
      message.classList.add("error");
    }
  });
});
/* =====================================================
   RULES & GUIDELINES TOGGLE (LOGIN PAGE)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleRules");
  const rulesSection = document.getElementById("rules");

  if (toggleBtn && rulesSection) {
    toggleBtn.addEventListener("click", () => {
      rulesSection.classList.toggle("hidden");

      // Optional: scroll into view when opened
      if (!rulesSection.classList.contains("hidden")) {
        rulesSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Accordion behavior for individual rules
  document.querySelectorAll(".rule-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.closest(".rule-item").querySelector(".rule-content");
      const isOpen = content.classList.contains("open");

      // toggle current
      content.classList.toggle("open");
      btn.textContent = isOpen ? "+" : "−";
    });
  });
});
