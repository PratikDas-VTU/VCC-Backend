const { db } = require("./firebaseConfig");

/**
 * Reset a team's session data
 * This will clear their submissions and session status
 */

async function resetTeamSession(vccId) {
    try {
        console.log(`🔄 Resetting session for team: ${vccId}...`);

        // Get current team data
        const teamSnapshot = await db.ref(`teams/${vccId}`).once("value");
        const team = teamSnapshot.val();

        if (!team) {
            console.log(`❌ Team ${vccId} not found!`);
            process.exit(1);
        }

        console.log(`📋 Current team status:`);
        console.log(`   - GitHub URL: ${team.githubUrl || 'Not submitted'}`);
        console.log(`   - Deployment URL: ${team.deploymentUrl || 'Not submitted'}`);
        console.log(`   - Session Ended: ${team.sessionEnded ? 'Yes' : 'No'}`);
        console.log(`   - Hackathon Start: ${team.hackathonStart || 'Not started'}`);

        // Reset team data
        const updates = {
            hackathonStart: null,
            githubUrl: null,
            deploymentUrl: null,
            sessionEnded: false,
            updatedAt: new Date().toISOString()
        };

        await db.ref(`teams/${vccId}`).update(updates);

        console.log(`\n✅ Team ${vccId} session reset successfully!`);
        console.log(`   - All URLs cleared`);
        console.log(`   - Session status reset`);
        console.log(`   - Timer reset`);

        // Note: Prompts are NOT deleted (they remain in the database)
        console.log(`\n⚠️  Note: Submitted prompts are NOT deleted. They remain in the database.`);
        console.log(`   If you want to delete prompts too, you'll need to do that manually in Firebase Console.`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error resetting team session:", error);
        process.exit(1);
    }
}

// Get team VCC ID from command line argument
const vccId = process.argv[2];

if (!vccId) {
    console.log("❌ Please provide a team VCC ID");
    console.log("\nUsage: node resetTeamSession.js VCC112");
    process.exit(1);
}

// Run reset
resetTeamSession(vccId);
