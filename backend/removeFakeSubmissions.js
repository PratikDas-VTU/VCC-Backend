const { db } = require("./firebaseConfig");

/**
 * Remove fake test submissions
 */

async function removeFakeSubmissions() {
    try {
        console.log("🗑️  Removing fake test submissions...\n");

        const testVccIds = ["TEST001", "TEST002", "TEST003", "TEST004", "TEST005"];

        for (const vccId of testVccIds) {
            await db.ref(`teams/${vccId}`).remove();
            console.log(`✅ Removed ${vccId}`);
        }

        console.log("\n🎉 All fake submissions removed!\n");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error removing fake submissions:", error);
        process.exit(1);
    }
}

// Run
removeFakeSubmissions();
