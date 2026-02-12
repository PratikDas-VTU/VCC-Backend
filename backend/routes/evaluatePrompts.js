const express = require("express");
const axios = require("axios");
const { db } = require("../firebaseConfig");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// Gemini API configuration (using HackAlert API key)
const GEMINI_API_KEY = "AIzaSyCC0qTOYMF95FxVeyQkU61ATxh-h5vy6Wc";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Evaluation prompt template
const EVALUATION_PROMPT = `You are an expert evaluator for a competitive university hackathon (Vibeathon).
Your task is to evaluate the QUALITY of AI prompts used by a team, not the correctness of the generated code.

Context:
The teams were given the following problem statement:

"Design a web-based Institutional Event Resource Management System involving:
- Multiple user roles (Event Coordinator, HOD, Dean, Institutional Head, Admin/ITC)
- Multi-level approval workflows
- Dynamic venue and resource availability
- Mid-event additional requests
- Rejection handling with explanations
- Continuous state updates without violating constraints"

Evaluation Goal:
Assess how well the team's prompts demonstrate understanding, reasoning, and effective use of AI for solving this problem.

You will be given a list of prompts used by a team during development.
Evaluate ONLY the prompts, not the final code or UI.

Scoring must be STRICT, FAIR, and CONSISTENT.
Do NOT reward verbosity or copied prompts.
Do NOT reward prompts that simply ask for full solutions.

---

Evaluation Criteria with score rules (apply all):

1. Problem Understanding
- Do the prompts reflect correct understanding of roles, approvals, constraints, and system behavior?
  - prompts generic (poor: 0)
  - prompts reference roles or workflow (good: 5)
  - prompts clearly map to roles, approvals, constraints (very good: 10)

2. Iterative Prompting
- single or copy-paste prompt (poor: 0)
- some refinement (good: 5)
- clear iteration, correction, reasoning (very good: 10)

3. Reasoning & Constraints
- Do prompts explicitly mention constraints, edge cases, rejection flows, dynamic updates, or role separation?
  - no constraints mentioned (poor: 0)
  - some constraints (good: 5)
  - explicit handling of capacity, approvals, visibility (very good: 10)

4. Intentional AI Usage
- Is AI used as a thinking/design assistant rather than just a code generator?
  - AI used only for code (poor: 0)
  - AI used for logic+structure (good: 5)
  - AI used strategically for modeling and validation (very good: 10)

Total max points = 40

---

Output Format (STRICT):

Return ONLY a valid JSON object with the following fields:

{
  "score": <integer between 0 and 40>,
  "level": "<Very Poor | Basic | Good | Excellent>",
  "reasoning": "<2–4 concise sentences explaining the score>",
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"]
}

Do NOT include any extra text.
Do NOT explain the rubric.
Do NOT mention policies.`;

/**
 * POST /api/admin/evaluate-prompts
 * Evaluate all team prompts using Gemini API
 */
router.post("/evaluate-prompts", verifyAdmin, async (req, res) => {
    try {
        console.log("🤖 Starting AI evaluation of team prompts...");

        // Fetch all teams
        const teamsSnapshot = await db.ref("teams").once("value");
        const teams = teamsSnapshot.val() || {};

        // Fetch all prompts
        const promptsSnapshot = await db.ref("prompts").once("value");
        const allPrompts = promptsSnapshot.val() || {};

        // Fetch existing evaluations
        const evaluationsSnapshot = await db.ref("promptEvaluations").once("value");
        const existingEvaluations = evaluationsSnapshot.val() || {};

        const results = {
            total: 0,
            evaluated: 0,
            skipped: 0,
            failed: 0,
            details: []
        };

        // Process each team
        for (const [vccId, team] of Object.entries(teams)) {
            results.total++;

            // Skip if team has no submissions
            if (!team.githubUrl || !team.deploymentUrl) {
                console.log(`⏭️  Skipping ${vccId}: No submission`);
                results.skipped++;
                continue;
            }

            // Skip if already evaluated
            if (existingEvaluations[vccId]) {
                console.log(`⏭️  Skipping ${vccId}: Already evaluated`);
                results.skipped++;
                continue;
            }

            // Get team's prompts
            const teamPrompts = Object.values(allPrompts).filter(
                p => p.vccId === vccId
            );

            if (teamPrompts.length === 0) {
                console.log(`⏭️  Skipping ${vccId}: No prompts submitted`);
                results.skipped++;
                continue;
            }

            // Prepare prompts for evaluation
            const promptsText = teamPrompts
                .map((p, idx) => `Prompt ${idx + 1} (AI Tool: ${p.aiName}):\n${p.promptText}`)
                .join("\n\n---\n\n");

            const fullPrompt = `${EVALUATION_PROMPT}\n\n---\n\nTeam Prompts:\n\n${promptsText}`;

            try {
                console.log(`🔄 Evaluating ${vccId} (${teamPrompts.length} prompts)...`);

                // Call Gemini API
                const response = await axios.post(
                    GEMINI_API_URL,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: fullPrompt
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

                // Parse JSON response
                let evaluation;
                try {
                    evaluation = JSON.parse(content);
                } catch (e) {
                    // Try extracting JSON from response
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        evaluation = JSON.parse(jsonMatch[0]);
                    } else {
                        throw new Error("Invalid JSON response from Gemini");
                    }
                }

                // Validate evaluation structure
                if (
                    typeof evaluation.score !== "number" ||
                    !evaluation.level ||
                    !evaluation.reasoning ||
                    !Array.isArray(evaluation.strengths) ||
                    !Array.isArray(evaluation.weaknesses)
                ) {
                    throw new Error("Invalid evaluation structure");
                }

                // Ensure score is within bounds
                evaluation.score = Math.max(0, Math.min(40, evaluation.score));

                // Store evaluation in Firebase
                await db.ref(`promptEvaluations/${vccId}`).set({
                    ...evaluation,
                    evaluatedAt: new Date().toISOString(),
                    promptCount: teamPrompts.length
                });

                console.log(`✅ ${vccId}: Score ${evaluation.score}/40 (${evaluation.level})`);

                results.evaluated++;
                results.details.push({
                    vccId,
                    score: evaluation.score,
                    level: evaluation.level
                });

            } catch (error) {
                console.error(`❌ Error evaluating ${vccId}:`, error.message);
                results.failed++;
                results.details.push({
                    vccId,
                    error: error.message
                });
            }

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log("\n🎉 Evaluation complete!");
        console.log(`   Total teams: ${results.total}`);
        console.log(`   Evaluated: ${results.evaluated}`);
        console.log(`   Skipped: ${results.skipped}`);
        console.log(`   Failed: ${results.failed}`);

        res.json({
            success: true,
            message: "AI evaluation completed",
            results
        });

    } catch (error) {
        console.error("❌ Evaluation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to run AI evaluation",
            error: error.message
        });
    }
});

module.exports = router;
