const { db } = require("./firebaseConfig");

/**
 * Find team by email and reset session
 */

async function resetSessionByEmail() {
    try {
        const email = "rakavip2@gmail.com";
        console.log(`🔍 Finding team with email: ${email}...\n`);

        // Fetch all teams
        const teamsSnapshot = await db.ref("teams").once("value");
        const teams = teamsSnapshot.val() || {};

        let foundTeam = null;
        let foundVccId = null;

        // Find team with matching email
        for (const [vccId, team] of Object.entries(teams)) {
            if (team.email === email) {
                foundTeam = team;
                foundVccId = vccId;
                break;
            }
        }

        if (!foundTeam) {
            console.log(`❌ No team found with email: ${email}\n`);
            process.exit(1);
        }

        console.log(`✅ Found team: ${foundVccId}`);
        console.log(`   Team No: ${foundTeam.teamNo}`);
        console.log(`   Team Size: ${foundTeam.teamSize}`);
        console.log(`   Session Ended: ${foundTeam.sessionEnded || false}\n`);

        // Reset session
        console.log(`🔄 Resetting session for ${foundVccId}...\n`);

        await db.ref(`teams/${foundVccId}`).update({
            sessionEnded: false,
            hackathonStart: null
        });

        console.log(`✅ Session reset complete for ${foundVccId}!`);
        console.log(`\nThe team can now login and start fresh.\n`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

// Run
resetSessionByEmail();
