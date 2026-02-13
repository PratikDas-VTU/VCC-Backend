const { db, auth } = require("./firebaseConfig");

/**
 * Reset Team VCC112 data to original values from CSV
 */

async function resetTeamVCC112() {
    try {
        console.log("🔄 Resetting Team VCC112 data...\n");

        const vccId = "VCC112";
        const correctData = {
            vccId: "VCC112",
            teamNo: 1,
            teamSize: 2,
            M1_Name: "Srihari P",
            M1_Email: "rakavip2@gmail.com",
            M1_Phone: "9080662519",
            M1_College: "SRM Valliammai Engineering College",
            M2_Name: "Rakavi P",
            M2_Email: "srihari221122@gmail.com",
            M2_Phone: "9962408595",
            M2_College: "SRM Valliammai Engineering College",
            members: [
                {
                    name: "Srihari P",
                    email: "rakavip2@gmail.com",
                    phone: "9080662519",
                    college: "SRM Valliammai Engineering College"
                },
                {
                    name: "Rakavi P",
                    email: "srihari221122@gmail.com",
                    phone: "9962408595",
                    college: "SRM Valliammai Engineering College"
                }
            ],
            leaderName: "Srihari P",
            email: "rakavip2@gmail.com",
            phone: "9080662519",
            college: "SRM Valliammai Engineering College"
        };

        // Get current team data to preserve hackathon progress
        const teamSnapshot = await db.ref(`teams/${vccId}`).once("value");
        const currentData = teamSnapshot.val();

        if (!currentData) {
            console.log("❌ Team VCC112 not found in database!");
            process.exit(1);
        }

        // Preserve hackathon progress data
        const updatedData = {
            ...correctData,
            hackathonStart: currentData.hackathonStart || null,
            githubUrl: currentData.githubUrl || null,
            deploymentUrl: currentData.deploymentUrl || null,
            sessionEnded: currentData.sessionEnded || false
        };

        // Update team data in database
        await db.ref(`teams/${vccId}`).update(updatedData);
        console.log("✅ Team data updated in database");

        // Update Firebase Auth user custom claims
        try {
            const userRecord = await auth.getUserByEmail("rakavip2@gmail.com");
            await auth.setCustomUserClaims(userRecord.uid, {
                vccId: "VCC112",
                teamNo: 1,
                role: "participant"
            });
            console.log("✅ Custom claims updated for rakavip2@gmail.com");
        } catch (authError) {
            console.log("⚠️  Auth user update:", authError.message);
        }

        console.log("\n🎉 Team VCC112 data reset successfully!");
        console.log("\n📋 Correct Team Data:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("VCC ID: VCC112");
        console.log("Team No: 1");
        console.log("Leader: Srihari P");
        console.log("Email: rakavip2@gmail.com");
        console.log("Phone: 9080662519");
        console.log("Member 2: Rakavi P");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n✅ Login: rakavip2@gmail.com / 9080662519");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting team data:", error);
        process.exit(1);
    }
}

resetTeamVCC112();
