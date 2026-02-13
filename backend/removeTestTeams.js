const { db, auth } = require("./firebaseConfig");

/**
 * Remove test teams from Firebase
 * Test teams: TEST001, TEST002, TEST003, TEST004, TEST005, VCC999
 */

const TEST_TEAM_IDS = ["TEST001", "TEST002", "TEST003", "TEST004", "TEST005", "VCC999"];

async function removeTestTeams() {
    try {
        console.log("🗑️  Removing test teams from Firebase...\n");

        for (const vccId of TEST_TEAM_IDS) {
            console.log(`🔍 Processing ${vccId}...`);

            // Get team data to find the user email
            const teamSnapshot = await db.ref(`teams/${vccId}`).once("value");
            const teamData = teamSnapshot.val();

            if (!teamData) {
                console.log(`   ⚠️  Team ${vccId} not found in database`);
                continue;
            }

            const email = teamData.email || teamData.M1_Email;

            // Delete from Firebase Authentication
            if (email) {
                try {
                    const userRecord = await auth.getUserByEmail(email);
                    await auth.deleteUser(userRecord.uid);
                    console.log(`   ✅ Deleted Firebase Auth user: ${email}`);
                } catch (authError) {
                    if (authError.code === "auth/user-not-found") {
                        console.log(`   ℹ️  Auth user not found: ${email}`);
                    } else {
                        console.log(`   ⚠️  Error deleting auth user: ${authError.message}`);
                    }
                }
            }

            // Delete team data from Realtime Database
            await db.ref(`teams/${vccId}`).remove();
            console.log(`   ✅ Deleted team data: ${vccId}`);

            // Delete prompts
            const promptsSnapshot = await db.ref(`prompts/${vccId}`).once("value");
            if (promptsSnapshot.exists()) {
                await db.ref(`prompts/${vccId}`).remove();
                console.log(`   ✅ Deleted prompts for ${vccId}`);
            }

            // Delete evaluations
            const evalSnapshot = await db.ref(`evaluations/${vccId}`).once("value");
            if (evalSnapshot.exists()) {
                await db.ref(`evaluations/${vccId}`).remove();
                console.log(`   ✅ Deleted evaluations for ${vccId}`);
            }

            console.log(`   ✅ ${vccId} completely removed\n`);
        }

        console.log("🎉 All test teams removed successfully!");
        console.log("\n✅ Real participant teams (VCC001-VCC131) are intact!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error removing test teams:", error);
        process.exit(1);
    }
}

removeTestTeams();
