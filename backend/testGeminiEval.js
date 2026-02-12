const { db } = require("./firebaseConfig");
const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyBYigBd0chNf4Xzp8F_f-gTR6EBkvi_q6g";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

async function testGeminiEvaluation() {
    try {
        console.log("🧪 Testing Gemini API evaluation...\n");

        // Get TEST004 prompts
        const promptsSnapshot = await db.ref("prompts").once("value");
        const allPrompts = promptsSnapshot.val() || {};
        const teamPrompts = Object.values(allPrompts).filter(p => p.vccId === "TEST004");

        console.log(`Found ${teamPrompts.length} prompts for TEST004\n`);

        const promptsText = teamPrompts
            .map((p, idx) => `Prompt ${idx + 1} (AI Tool: ${p.aiName}):\n${p.promptText}`)
            .join("\n\n---\n\n");

        console.log("Prompts to evaluate:");
        console.log(promptsText);
        console.log("\n" + "=".repeat(80) + "\n");

        const evaluationPrompt = "You are an expert evaluator. Evaluate these prompts and return ONLY valid JSON with: score (0-40), level, reasoning, strengths array, weaknesses array.";

        const fullPrompt = `${evaluationPrompt}\n\nPrompts:\n${promptsText}`;

        console.log("Calling Gemini API...\n");

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

        console.log("✅ Gemini API Response:");
        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log(content);
        console.log("\n" + "=".repeat(80) + "\n");

        // Try parsing
        try {
            const evaluation = JSON.parse(content);
            console.log("✅ Parsed evaluation:");
            console.log(JSON.stringify(evaluation, null, 2));
        } catch (e) {
            console.log("⚠️  Could not parse as JSON, trying to extract...");
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const evaluation = JSON.parse(jsonMatch[0]);
                console.log("✅ Extracted evaluation:");
                console.log(JSON.stringify(evaluation, null, 2));
            } else {
                console.log("❌ No JSON found in response");
            }
        }

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        process.exit(1);
    }
}

testGeminiEvaluation();
