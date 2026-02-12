const { db } = require("./firebaseConfig");

/**
 * View detailed evaluation results
 */

async function viewEvaluations() {
    try {
        console.log("📊 AI Evaluation Results\n");
        console.log("=".repeat(80) + "\n");

        const evaluationsSnapshot = await db.ref("promptEvaluations").once("value");
        const evaluations = evaluationsSnapshot.val() || {};

        if (Object.keys(evaluations).length === 0) {
            console.log("❌ No evaluations found\n");
            process.exit(0);
        }

        // Sort by score descending
        const sorted = Object.entries(evaluations).sort((a, b) => b[1].score - a[1].score);

        for (const [vccId, evaluation] of sorted) {
            console.log(`🏆 ${vccId}`);
            console.log(`   Score: ${evaluation.score}/40 (${evaluation.level})`);
            console.log(`   Prompts evaluated: ${evaluation.promptCount}`);
            console.log(`   Evaluated at: ${new Date(evaluation.evaluatedAt).toLocaleString()}`);
            console.log(`\n   📝 Reasoning:`);
            console.log(`   ${evaluation.reasoning}\n`);

            if (evaluation.strengths && evaluation.strengths.length > 0) {
                console.log(`   ✅ Strengths:`);
                evaluation.strengths.forEach(s => console.log(`      • ${s}`));
                console.log();
            }

            if (evaluation.weaknesses && evaluation.weaknesses.length > 0) {
                console.log(`   ⚠️  Weaknesses:`);
                evaluation.weaknesses.forEach(w => console.log(`      • ${w}`));
                console.log();
            }

            console.log("   " + "-".repeat(76) + "\n");
        }

        console.log("=".repeat(80) + "\n");
        console.log(`Total evaluations: ${Object.keys(evaluations).length}\n`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

// Run
viewEvaluations();
