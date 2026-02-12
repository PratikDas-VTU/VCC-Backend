const { db } = require("./firebaseConfig");

/**
 * Check test teams and their prompts
 */

async function checkTestTeams() {
    try {
        console.log("🔍 Checking test teams...\n");

        const testVccIds = ["TEST001", "TEST002", "TEST003", "TEST004", "TEST005"];

        for (const vccId of testVccIds) {
            console.log(`\n📋 ${vccId}:`);

            // Check team data
            const teamSnapshot = await db.ref(`teams/${vccId}`).once("value");
            const team = teamSnapshot.val();

            if (!team) {
                console.log("   ❌ Team not found");
                continue;
            }

            console.log(`   ✅ Team exists`);
            console.log(`   GitHub: ${team.githubUrl || "❌ Missing"}`);
            console.log(`   Deployment: ${team.deploymentUrl || "❌ Missing"}`);

            // Check prompts
            const promptsSnapshot = await db.ref("prompts").once("value");
            const allPrompts = promptsSnapshot.val() || {};
            const teamPrompts = Object.values(allPrompts).filter(p => p.vccId === vccId);

            console.log(`   Prompts: ${teamPrompts.length}`);

            // Check evaluation
            const evalSnapshot = await db.ref(`promptEvaluations/${vccId}`).once("value");
            const evaluation = evalSnapshot.val();

            if (evaluation) {
                console.log(`   Evaluation: ✅ Score ${evaluation.score}/40`);
            } else {
                console.log(`   Evaluation: ❌ Not evaluated`);
            }
        }

        console.log("\n");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

// Run
checkTestTeams();
