const express = require("express");
const { db } = require("../firebaseConfig");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  getAllTeams,
  getAllPrompts,
  getPromptsByVccId,
  createPromptEvaluation,
  getAllPromptEvaluations,
  getEvaluatedPromptIds
} = require("../services/firebaseService");
const { evaluatePrompt } = require("../services/geminiEvaluator");

const router = express.Router();

/* =========================
   GET ALL TEAMS (ADMIN)
   ========================= */
router.get("/teams", verifyAdmin, async (req, res) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error("Admin fetch teams error:", err);
    res.status(500).json({
      message: "Failed to fetch teams"
    });
  }
});

/* =========================
   GET ALL PROMPTS (ADMIN)
   ========================= */
router.get("/prompts", verifyAdmin, async (req, res) => {
  try {
    const prompts = await getAllPrompts();
    res.json(prompts);
  } catch (err) {
    console.error("Admin fetch prompts error:", err);
    res.status(500).json({
      message: "Failed to fetch prompts"
    });
  }
});

/* ==================================================
   GET TEAM-SPECIFIC PROMPT ANALYTICS (ADMIN)
   ================================================== */
router.get("/teams/:vccId/prompts", verifyAdmin, async (req, res) => {
  try {
    const { vccId } = req.params;

    // Fetch all prompts for this team
    const prompts = await getPromptsByVccId(vccId);

    // Analytics
    const totalPrompts = prompts.length;

    const uniqueAIsSet = new Set(
      prompts.map(p => p.aiTool).filter(Boolean)
    );

    const uniqueAIs = Array.from(uniqueAIsSet);

    res.json({
      vccId,
      totalPrompts,
      uniqueAICount: uniqueAIs.length,
      uniqueAIs,
      prompts
    });

  } catch (err) {
    console.error("Admin team prompt analytics error:", err);
    res.status(500).json({
      message: "Failed to fetch team prompt analytics"
    });
  }
});



/* =========================
   GET PROMPT EVALUATIONS
   ========================= */
router.get("/prompt-evaluations", verifyAdmin, async (req, res) => {
  try {
    // Fetch from Firebase Realtime Database
    const evaluationsSnapshot = await db.ref("promptEvaluations").once("value");
    const evaluations = evaluationsSnapshot.val() || {};

    // Return as object keyed by vccId
    res.json(evaluations);
  } catch (err) {
    console.error("Fetch evaluations error:", err);
    res.status(500).json({
      message: "Failed to fetch evaluations"
    });
  }
});

module.exports = router;
