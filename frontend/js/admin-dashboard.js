document.addEventListener("DOMContentLoaded", () => {
  console.log("🔵 Admin Dashboard: DOMContentLoaded event fired");

  /* ==========================
     ADMIN AUTH GUARD
     ========================== */
  console.log("🔐 Checking admin authentication...");
  const adminToken = localStorage.getItem("adminToken");
  console.log("🎫 Admin token from localStorage:", adminToken ? "EXISTS" : "MISSING");
  console.log("🎫 Admin token value:", adminToken);

  if (!adminToken) {
    console.error("❌ No admin token found, redirecting to login");
    window.location.replace("admin-login.html");
    return;
  }

  console.log("✅ Admin token verified, proceeding with dashboard initialization");

  /* ==========================
     ELEMENT REFERENCES
     ========================== */
  const teamTable = document.getElementById("teamTable");
  const teamModal = document.getElementById("teamModal");
  const closeModal = document.getElementById("closeModal");

  const teamInfo = document.getElementById("teamInfo");
  const teamStats = document.getElementById("teamStats");
  const promptTable = document.getElementById("promptTable");

  const totalTeamsEl = document.getElementById("totalTeams");
  const totalSubmissionsEl = document.getElementById("totalSubmissions");
  const fastestTeamEl = document.getElementById("fastestTeam");

  const logoutBtn = document.getElementById("logoutBtn");
  const logoutOverlay = document.getElementById("logoutConfirm");
  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");

  if (!teamTable || !logoutBtn) {
    console.error("Admin dashboard: required elements missing");
    return;
  }
  const rankFilter = document.getElementById("rankFilter");

  if (rankFilter) {
    rankFilter.addEventListener("change", () => {
      currentFilter = rankFilter.value;
      console.log(`🔄 Ranking filter changed to: ${currentFilter}`);
      initDashboard();
      console.log(`✅ Dashboard re-initialized with filter: ${currentFilter}`);
    });
  }


  /* ==========================
   LOGOUT LOGIC (FIXED)
   ========================== */

  if (logoutBtn && logoutOverlay && cancelLogout && confirmLogout) {

    logoutBtn.addEventListener("click", () => {
      logoutOverlay.classList.add("show");
    });

    cancelLogout.addEventListener("click", () => {
      logoutOverlay.classList.remove("show");
    });

    confirmLogout.addEventListener("click", () => {
      // clear admin auth
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token"); // safety

      // hard redirect (prevents back button issues)
      window.location.href = "admin-login.html";
    });

  } else {
    console.error("Logout elements missing in admin dashboard");
  }

  /* ==========================
     DATA
     ========================== */
  let teams = [];
  let autoRefreshInterval = null;
  let activeTeamId = null;
  let currentFilter = "time"; // default
  let promptStats = {};
  let allPrompts = [];

  // { TEAM_ID: { promptCount, uniqueAITools } }
  let promptEvaluations = {};



  /* ==========================
     ADMIN FETCH HELPER (with ngrok bypass)
     ========================== */
  async function adminFetch(url, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page
      "Authorization": `Bearer ${adminToken}`,
      ...(options.headers || {})
    };

    return fetch(url, {
      ...options,
      headers
    });
  }

  /* ==========================
     FETCH TEAMS (LIVE)
     ========================== */
  async function fetchTeams() {
    try {
      const res = await adminFetch(
        "https://vcc-backend-myyu.onrender.com/api/admin/teams"
      );

      if (!res.ok) throw new Error("Unauthorized");

      teams = await res.json();
      initDashboard();

    } catch (err) {
      console.error("Failed to fetch teams:", err);
      window.location.replace("admin-login.html");
    }
  }
  function getCompletionTime(team) {
    if (!team.sessionEnded) return null;
    if (!team.hackathonStart || !team.updatedAt) return null;

    const start = new Date(team.hackathonStart).getTime();
    const end = new Date(team.updatedAt).getTime();

    return end - start; // milliseconds
  }
  function formatDuration(ms) {
    if (!ms || ms < 0) return "—";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }

  function isValidTeam(team) {
    return (
      team.sessionEnded === true &&
      team.githubUrl &&
      team.deploymentUrl
    );
  }


  function startSilentAutoRefresh() {
    if (autoRefreshInterval) return;

    autoRefreshInterval = setInterval(async () => {
      try {
        const res = await adminFetch(
          "https://vcc-backend-myyu.onrender.com/api/admin/teams"
        );

        if (res.ok) {
          teams = await res.json();
          initDashboard(); // updates table only
        }

        // silently refresh prompts cache
        await fetchPrompts();

      } catch (err) {
        console.warn("Silent refresh failed");
      }
    }, 20000);
  }

  /* ==========================
     DASHBOARD INIT
     ========================== */
  function initDashboard() {

    /* ==========================
       METRICS
       ========================== */
    totalTeamsEl.textContent = teams.length;

    const validTeams = teams.filter(isValidTeam);


    totalSubmissionsEl.textContent = validTeams.length;

    /* ==========================
       RANKING BASE
       ========================== */
    let rankedTeams = [];

    if (currentFilter !== "none") {
      rankedTeams = validTeams.map(team => {
        const stats = promptStats[team.vccId] || {
          promptCount: Infinity,
          uniqueAITools: Infinity
        };

        const aiScore = computeTeamAIScore(team.vccId);

        return {
          ...team,
          completionTime: getCompletionTime(team),
          promptCount: stats.promptCount,
          uniqueAITools: stats.uniqueAITools,
          aiScore // ✅ OVERALL AI SCORE
        };
      });


    }

    /* ==========================
       APPLY FILTER
       ========================== */
    switch (currentFilter) {

      case "time":
        rankedTeams = rankedTeams
          .filter(t => t.completionTime !== null)
          .sort((a, b) => a.completionTime - b.completionTime);
        break;
      case "ai-score":
        rankedTeams = rankedTeams
          .filter(t => typeof t.aiScore === "number")
          .sort((a, b) => b.aiScore - a.aiScore); // highest score first
        break;


      case "prompts":
        rankedTeams.sort((a, b) =>
          (a.promptCount ?? Infinity) - (b.promptCount ?? Infinity)
        );
        break;

      case "ai":
        rankedTeams.sort((a, b) =>
          (a.uniqueAITools ?? Infinity) - (b.uniqueAITools ?? Infinity)
        );
        break;

      case "balanced":
        rankedTeams.sort((a, b) => {
          const scoreA =
            (a.completionTime / 60000) +
            (a.promptCount ?? 0) * 10 +
            (a.uniqueAITools ?? 0) * 20;

          const scoreB =
            (b.completionTime / 60000) +
            (b.promptCount ?? 0) * 10 +
            (b.uniqueAITools ?? 0) * 20;

          return scoreA - scoreB;
        });
        break;

      case "none":
      default:
        rankedTeams = [];
    }

    /* ==========================
       FASTEST TEAM CARD
       ========================== */
    if (currentFilter === "time" && rankedTeams.length > 0) {
      fastestTeamEl.textContent = rankedTeams[0].vccId;
    } else {
      fastestTeamEl.textContent = "—";
    }


    /* ==========================
       TABLE RENDER
       ========================== */
    teamTable.innerHTML = "";

    // First, render ranked teams in order
    rankedTeams.forEach((team, index) => {
      const rank = `#${index + 1}`;
      const completionTime = formatDuration(getCompletionTime(team));

      const aiScoreText =
        team.aiScore !== null && team.aiScore !== undefined
          ? team.aiScore
          : "—";

      const row = document.createElement("tr");
      row.innerHTML = `
  <td>${rank}</td>
  <td>${team.vccId}</td>
  <td>${team.leaderName || "—"}</td>
  <td>${completionTime}</td>
  <td>${aiScoreText}</td>
  <td>
    ${team.githubUrl && team.deploymentUrl
          ? `<button class="view-btn" data-id="${team.vccId}">View</button>`
          : `<span style="opacity:.6">No Submission</span>`
        }
  </td>
`;

      teamTable.appendChild(row);
    });

    // Then, render unranked teams (if filter is "none" or teams not in ranked list)
    if (currentFilter === "none") {
      teams.forEach(team => {
        const completionTime = formatDuration(getCompletionTime(team));

        const row = document.createElement("tr");
        row.innerHTML = `
  <td>—</td>
  <td>${team.vccId}</td>
  <td>${team.leaderName || "—"}</td>
  <td>${completionTime}</td>
  <td>—</td>
  <td>
    ${team.githubUrl && team.deploymentUrl
            ? `<button class="view-btn" data-id="${team.vccId}">View</button>`
            : `<span style="opacity:.6">No Submission</span>`
          }
  </td>
`;

        teamTable.appendChild(row);
      });
    } else {
      // Show unranked teams at the bottom (teams not in rankedTeams)
      const rankedVccIds = new Set(rankedTeams.map(t => t.vccId));
      const unrankedTeams = teams.filter(t => !rankedVccIds.has(t.vccId));

      unrankedTeams.forEach(team => {
        const completionTime = formatDuration(getCompletionTime(team));

        const row = document.createElement("tr");
        row.innerHTML = `
  <td>—</td>
  <td>${team.vccId}</td>
  <td>${team.leaderName || "—"}</td>
  <td>${completionTime}</td>
  <td>—</td>
  <td>
    ${team.githubUrl && team.deploymentUrl
            ? `<button class="view-btn" data-id="${team.vccId}">View</button>`
            : `<span style="opacity:.6">No Submission</span>`
          }
  </td>
`;

        teamTable.appendChild(row);
      });
    }


  }  // End of initDashboard function

  /* ==========================
   TEAM MODAL VIEW (FIXED)
   ========================== */
  teamTable.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;

    const team = teams.find(t => t.vccId === btn.dataset.id);
    if (!team) return;

    activeTeamId = team.vccId;

    /* ---------- TEAM INFO ---------- */

    teamInfo.innerHTML = `
    <div class="info-grid">
      <div><strong>Team ID:</strong> ${team.vccId}</div>
      <div><strong>Leader:</strong> ${team.leaderName}</div>

      <div><strong>Email:</strong> ${team.email}</div>
      <div><strong>Phone:</strong> ${team.phone}</div>

      <div><strong>College:</strong> ${team.college}</div>

    <div class="section">
      <div class="section-title">Team Members</div>
      <ul class="member-list">
        ${team.members
        .filter(m => m.name && m.email)
        .map((m, i) => `<li>${i + 1}. ${m.name} (${m.email})</li>`)
        .join("")}
      </ul>
    </div>

    <div class="links">
      <div><strong>GitHub:</strong>
        <a href="${team.githubUrl}" target="_blank">${team.githubUrl}</a>
      </div>
      <div><strong>Deployment:</strong>
        <a href="${team.deploymentUrl}" target="_blank">${team.deploymentUrl}</a>
      </div>
    </div>
  `;

    promptTable.innerHTML = `
    <tr>
      <td colspan="4" style="text-align:center;opacity:.6">
        Loading prompts...
      </td>
    </tr>
  `;

    fetchPrompts().then(prompts => {
      const teamPrompts = prompts.filter(p => p.vccId === team.vccId);

      const stats = promptStats[team.vccId] || { promptCount: 0, uniqueAITools: 0 };

      const promptCount = stats.promptCount;
      const uniqueAITools = stats.uniqueAITools;

      teamStats.innerHTML = `
      <div class="stat-box">
        <div class="stat-label">Session Ended</div>
        <div class="stat-value">${team.sessionEnded ? "Yes" : "No"}</div>
      </div>

      <div class="stat-box">
        <div class="stat-label">Total Prompts</div>
        <div class="stat-value">${promptCount}</div>
      </div>

      <div class="stat-box">
        <div class="stat-label">Unique AI Tools</div>
        <div class="stat-value">${uniqueAITools}</div>
      </div>
    `;

      if (teamPrompts.length === 0) {
        promptTable.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;opacity:.6">
            No prompts submitted
          </td>
        </tr>
      `;
        return;
      }

      promptTable.innerHTML = "";

      teamPrompts.forEach((p, i) => {
        const row = document.createElement("tr");

        const c1 = document.createElement("td");
        c1.textContent = i + 1;

        const c2 = document.createElement("td");
        c2.textContent = p.aiTool;

        const c3 = document.createElement("td");
        c3.textContent = p.promptText; // 🔒 SAFE

        const c4 = document.createElement("td");
        c4.textContent = new Date(p.submittedAt).toLocaleString();

        row.append(c1, c2, c3, c4);
        promptTable.appendChild(row);
      });


    });

    teamModal.classList.add("show");
  });


  closeModal.addEventListener("click", () => {
    teamModal.classList.remove("show");
    activeTeamId = null;
  });
  /**
   * Compute AI score for a team from promptEvaluations
   */
  function computeTeamAIScore(vccId) {
    const evaluation = promptEvaluations[vccId];
    if (!evaluation || typeof evaluation.score !== 'number') {
      return null;
    }
    return evaluation.score;
  }

  /**
   * Fetch AI evaluations from Firebase
   */
  async function fetchEvaluations() {
    try {
      // Fetch from Firebase Realtime Database via backend
      const res = await adminFetch(
        "https://vcc-backend-myyu.onrender.com/api/admin/prompt-evaluations"
      );

      if (!res.ok) {
        console.warn("Failed to fetch evaluations, using empty set");
        promptEvaluations = {};
        return;
      }

      const data = await res.json();

      // Convert to object keyed by vccId
      promptEvaluations = {};
      if (Array.isArray(data)) {
        // Old format - ignore for now
        console.warn("Old evaluation format detected");
      } else if (typeof data === 'object') {
        // New format: { vccId: { score, level, reasoning, ... } }
        promptEvaluations = data;
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      promptEvaluations = {};
    }
  }


  async function fetchPrompts() {
    try {
      const res = await adminFetch(
        "https://vcc-backend-myyu.onrender.com/api/admin/prompts"
      );

      if (!res.ok) {
        console.warn("Failed to fetch prompts");
        prompts = [];
        return;
      }

      // ✅ Parse response
      prompts = await res.json();

      // ✅ CRITICAL: cache all prompts for AI score calculation
      allPrompts = prompts;

      // ✅ Reset and rebuild prompt statistics
      promptStats = {};

      prompts.forEach(p => {
        if (!promptStats[p.vccId]) {
          promptStats[p.vccId] = {
            promptCount: 0,
            uniqueAITools: new Set()
          };
        }

        promptStats[p.vccId].promptCount += 1;
        promptStats[p.vccId].uniqueAITools.add(p.aiTool);
      });

      // ✅ Convert Set → number
      Object.keys(promptStats).forEach(vccId => {
        promptStats[vccId].uniqueAITools =
          promptStats[vccId].uniqueAITools.size;
      });

      return prompts;

    } catch (err) {
      console.error("fetchPrompts error:", err);
      return [];
    }
  }

  function exportToCSV(rows, filename = "vibeathon_results.csv") {
    if (!rows.length) return alert("No data to export");

    const csv = [
      Object.keys(rows[0]).join(","), // header
      ...rows.map(row =>
        Object.values(row)
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }
  /* ==========================
     EXPORT BUTTON HANDLER
     ========================== */
  const exportBtn = document.getElementById("exportBtn");

  if (exportBtn) {
    exportBtn.addEventListener("click", async () => {
      try {
        const prompts = await fetchPrompts();
        const rows = [];

        teams.forEach(team => {
          if (!isValidTeam(team)) return;

          const teamPrompts = prompts.filter(p => p.vccId === team.vccId);
          const completionTime = getCompletionTime(team);

          rows.push({
            Rank: "", // optional – ranking depends on filter
            Team_ID: team.vccId,
            Leader: team.leaderName,
            Leader_Email: team.email,
            Completion_Time_Minutes: completionTime
              ? Math.round(completionTime / 60000)
              : "—",
            Total_Prompts: teamPrompts.length,
            Unique_AI_Tools: new Set(teamPrompts.map(p => p.aiTool)).size,
            GitHub: team.githubUrl,
            Deployment: team.deploymentUrl
          });
        });

        exportToCSV(rows);

      } catch (err) {
        console.error("Export failed", err);
        alert("Failed to export data");
      }
    });
  }

  /* ==========================
     RUN AI EVALUATION (ADMIN)
     ========================== */
  const evaluateAIBtn = document.getElementById("evaluateAI");

  if (evaluateAIBtn) {
    evaluateAIBtn.addEventListener("click", async () => {
      if (!confirm("Run AI evaluation for all teams? This may take a few minutes.")) {
        return;
      }

      evaluateAIBtn.disabled = true;
      evaluateAIBtn.textContent = "🤖 Evaluating...";

      try {
        const res = await adminFetch(
          "https://vcc-backend-myyu.onrender.com/api/admin/evaluate-prompts",
          {
            method: "POST"
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Evaluation API error:", errorText);
          throw new Error(`Evaluation failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("Evaluation response:", data);

        // Show results
        if (data && data.results) {
          const { results } = data;
          alert(
            `✅ AI Evaluation Complete!\n\n` +
            `Total teams: ${results.total}\n` +
            `Evaluated: ${results.evaluated}\n` +
            `Skipped: ${results.skipped}\n` +
            `Failed: ${results.failed}`
          );
        } else {
          alert(`✅ AI Evaluation Complete!\n\n${data.message || 'Check console for details'}`);
        }

        // 🔁 Refresh evaluations so scores appear
        await fetchEvaluations();

        // 🔁 Re-render dashboard so rankings & tables update
        initDashboard();

      } catch (err) {
        console.error("AI evaluation failed:", err);
        alert(`❌ AI evaluation failed: ${err.message}\n\nCheck console for details.`);
      }
      finally {
        evaluateAIBtn.disabled = false;
        evaluateAIBtn.textContent = "Run AI Evaluation";
      }
    });
  }


  /* ==========================
     START
     ========================== */
  (async () => {
    await fetchPrompts();
    await fetchEvaluations();
    fetchTeams();
    startSilentAutoRefresh();
  })();


});
