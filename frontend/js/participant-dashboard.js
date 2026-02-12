import { authFetch } from "./authfetch.js";

document.addEventListener("DOMContentLoaded", async () => {

  /* ===================== STATE ===================== */
  let timerInterval = null;

  let team;
  let TEAM_ID;
  let VCC_ID; // Declare at top level
  let hackathonStart = null;
  let sessionEnded = false;

  let warned30 = sessionStorage.getItem("warned30") === "true";
  let warned10 = sessionStorage.getItem("warned10") === "true";
  let warned5 = sessionStorage.getItem("warned5") === "true";


  /* ===================== HELPERS ===================== */
  const isValidGitHubUrl = url =>
    /^https:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/.test(url);

  const isValidDeploymentUrl = url => {
    try { new URL(url); return true; } catch { return false; }
  };

  function freezeUI() {
    [
      githubInput, deployInput,
      submitGithubBtn, submitDeployBtn,
      aiInput, promptInput, submitPromptBtn,
      endBtn
    ].forEach(el => el && (el.disabled = true));
  }

  function showSessionEndedUI() {
    sessionEnded = true;
    stopTimer();

    sessionStorage.removeItem("warned30");
    sessionStorage.removeItem("warned10");
    sessionStorage.removeItem("warned5");

    freezeUI();
    timerEl.textContent = "00:00:00";
    sessionModal.classList.add("show");
  }

  const warningBox = document.getElementById("timeWarning");

  function showTimeWarning(message, type) {
    warningBox.textContent = message;
    warningBox.className = `time-warning show ${type}`;

    setTimeout(() => {
      warningBox.classList.remove("show");
    }, 7000);
  }
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }



  /* ===================== LOAD TEAM ===================== */
  console.log("🔍 Starting team load process...");
  console.log("📍 API URL:", "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/team/me");

  try {
    console.log("📡 Making authFetch request...");
    const res = await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/team/me"
    );

    console.log("✅ Response received:", res);
    console.log("📊 Response status:", res.status);
    console.log("📋 Response headers:", [...res.headers.entries()]);

    const teamData = await res.json();
    console.log("📦 Team data parsed:", teamData);

    team = teamData;
    VCC_ID = team.vccId; // Assign to top-level variable
    sessionEnded = team.sessionEnded === true;

    console.log("✅ Team loaded successfully!");
    console.log("👥 VCC ID:", VCC_ID);
    console.log("🔒 Session Ended:", sessionEnded);

  } catch (error) {
    console.error("❌ TEAM LOAD ERROR:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    alert("Failed to load team");
    return;
  }

  /* ===================== ELEMENTS ===================== */
  const timerEl = document.getElementById("timer");

  const githubInput = document.getElementById("githubUrl");
  const deployInput = document.getElementById("deploymentUrl");
  const submitGithubBtn = document.getElementById("submitGithub");
  const submitDeployBtn = document.getElementById("submitDeployment");

  const githubStatus = document.getElementById("githubStatus");
  const deploymentStatus = document.getElementById("deploymentStatus");
  const githubError = document.getElementById("githubError");
  const deployError = document.getElementById("deployError");

  const aiInput = document.getElementById("aiNameInput");
  const promptInput = document.getElementById("promptInput");
  const submitPromptBtn = document.getElementById("submitPrompt");
  const promptTable = document.getElementById("promptTable");

  const logoutBtn = document.getElementById("logoutBtn");
  const endBtn = document.getElementById("endSession");

  const confirmModal = document.getElementById("confirmModal");
  const confirmEndBtn = document.getElementById("confirmEnd");
  const cancelEndBtn = document.getElementById("cancelEnd");
  const sessionModal = document.getElementById("sessionModal");

  const downloadBtn = document.getElementById("downloadProblem");


  // ===== TEAM INFO =====
  document.getElementById("headerTeamId").textContent = VCC_ID;
  document.getElementById("teamId").textContent = VCC_ID;
  document.getElementById("teamSize").textContent = team.teamSize;

  const membersList = document.getElementById("teamMembersList");
  membersList.innerHTML = "";

  team.members.forEach((m, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <strong>Member ${index + 1}</strong><br>
    ${m.name}<br>
    ${m.email}<br>
    ${m.phone}<br>
    ${m.college}
  `;
    membersList.appendChild(li);
  });



  /* ===================== LOAD SAVED URLS ===================== */
  if (team.githubUrl) {
    githubInput.value = team.githubUrl;
    githubStatus.textContent = "✅ Saved";
    deployInput.disabled = false;
    submitDeployBtn.disabled = false;
  }

  if (team.deploymentUrl) {
    deployInput.value = team.deploymentUrl;
    deploymentStatus.textContent = "✅ Saved";
  }

  /* ===================== SESSION ENDED ON LOAD ===================== */
  if (sessionEnded) {
    showSessionEndedUI();
    return;
  }

  /* ===================== TIMER ===================== */
  const TOTAL_TIME = 2 * 60 * 60;

  const startRes = await authFetch(
    "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/start",
    { method: "POST" }
  );
  const startData = await startRes.json();
  hackathonStart = new Date(startData.hackathonStart).getTime();

  if (downloadBtn) {
    if (hackathonStart) {
      downloadBtn.disabled = false;
    } else {
      downloadBtn.disabled = true;
    }
  }

  if (downloadBtn) {
    downloadBtn.onclick = async () => {
      const res = await authFetch(
        "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/problem-statement"
      );

      if (!res.ok) {
        alert("Problem statement not available yet");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Vibeathon_Problem_Statement.docx";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    };
  }

  timerInterval = setInterval(() => {
    if (sessionEnded || !hackathonStart) return;

    const elapsed = Math.floor((Date.now() - hackathonStart) / 1000);
    const remaining = Math.max(TOTAL_TIME - elapsed, 0);

    // Update timer display (hidden but keeps tracking)
    timerEl.textContent =
      `${String(Math.floor(remaining / 3600)).padStart(2, "0")}:` +
      `${String(Math.floor((remaining % 3600) / 60)).padStart(2, "0")}:` +
      `${String(remaining % 60).padStart(2, "0")}`;

    // Removed: Time warnings (30min, 10min, 5min)
    // Removed: Auto-end session at 0 remaining
  }, 1000);

  async function autoEndSession() {
    if (sessionEnded) return;
    await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/end",
      { method: "POST" }
    );
    showSessionEndedUI();
  }

  /* ===================== SUBMISSIONS ===================== */
  submitGithubBtn.onclick = async () => {
    if (!isValidGitHubUrl(githubInput.value)) {
      githubError.textContent = "Invalid GitHub URL";
      return;
    }
    await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/github",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: githubInput.value })
      }
    );
    location.reload();
  };

  submitDeployBtn.onclick = async () => {
    if (!isValidDeploymentUrl(deployInput.value)) {
      deployError.textContent = "Invalid Deployment URL";
      return;
    }
    await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/deployment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deploymentUrl: deployInput.value })
      }
    );
    location.reload();
  };

  submitPromptBtn.onclick = async () => {
    if (!aiInput.value || !promptInput.value) return;
    await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/prompt",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiTool: aiInput.value, promptText: promptInput.value })
      }
    );
    loadPrompts();
    aiInput.value = "";
    promptInput.value = "";
  };

  async function loadPrompts() {
    const res = await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/prompts"
    );

    const prompts = await res.json();
    promptTable.innerHTML = "";

    // Extract unique AI tools for autocomplete
    const uniqueAITools = [...new Set(prompts.map(p => p.aiTool))];

    // Populate datalist with unique AI tools
    const datalist = document.getElementById("aiToolsList");
    datalist.innerHTML = ""; // Clear existing options
    uniqueAITools.forEach(tool => {
      const option = document.createElement("option");
      option.value = tool;
      datalist.appendChild(option);
    });

    prompts.forEach((p, i) => {
      const row = document.createElement("tr");

      const c1 = document.createElement("td");
      c1.textContent = i + 1;

      const c2 = document.createElement("td");
      c2.textContent = p.aiTool;

      const c3 = document.createElement("td");
      c3.textContent = p.promptText;

      const c4 = document.createElement("td");
      c4.textContent = new Date(p.submittedAt).toLocaleString();

      row.append(c1, c2, c3, c4);
      promptTable.appendChild(row);
    });
  }

  loadPrompts();

  /* ===================== LOGOUT + END ===================== */
  logoutBtn.onclick = () => {
    stopTimer();
    sessionStorage.clear();
    localStorage.removeItem("token");
    location.href = "participant-login.html";
  };


  endBtn.onclick = () => confirmModal.classList.add("show");

  confirmEndBtn.onclick = async () => {
    await authFetch(
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app/api/submission/end",
      { method: "POST" }
    );
    showSessionEndedUI();
  };

  cancelEndBtn.onclick = () => confirmModal.classList.remove("show");

});
