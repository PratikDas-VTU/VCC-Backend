const { db } = require("./firebaseConfig");

/**
 * Delete AI evaluation for VCC999 only
 */

async function clearVCC999Evaluation() {
    try {
        console.log("🗑️  Clearing AI evaluation for VCC999...\n");

        // Delete VCC999 evaluation
        await db.ref("promptEvaluations/VCC999").remove();

        console.log("✅ VCC999 AI evaluation cleared!\n");
        console.log("You can now run 'Run AI Evaluation' to evaluate VCC999 only.\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

// Run
clearVCC999Evaluation();
