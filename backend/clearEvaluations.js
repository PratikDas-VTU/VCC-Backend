const { db } = require("./firebaseConfig");

/**
 * Delete all AI evaluations from Firebase
 */

async function clearEvaluations() {
    try {
        console.log("🗑️  Clearing all AI evaluations from Firebase...\n");

        // Delete all evaluations
        await db.ref("promptEvaluations").remove();

        console.log("✅ All AI evaluations cleared!\n");
        console.log("You can now run 'Run AI Evaluation' in the admin dashboard to test fresh.\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

// Run
clearEvaluations();
