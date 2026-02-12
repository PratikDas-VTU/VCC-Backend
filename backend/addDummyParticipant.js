const { auth } = require("./firebaseConfig");
const { createTeam, createTeamUser } = require("./services/firebaseService");

/**
 * Add a dummy test participant for testing
 */

async function addDummyParticipant() {
    try {
        console.log("🧪 Creating dummy test participant...\n");

        const dummyTeam = {
            vccId: "VCC999",
            teamNo: 999,
            teamSize: 2,

            M1_Name: "Test User",
            M1_Email: "test@vibeathon.com",
            M1_Phone: "1234567890",
            M1_College: "Test College",

            M2_Name: "Test Partner",
            M2_Email: "partner@vibeathon.com",
            M2_Phone: "0987654321",
            M2_College: "Test College",

            leaderName: "Test User",
            email: "test@vibeathon.com",
            phone: "1234567890",
            college: "Test College",

            members: [
                {
                    name: "Test User",
                    email: "test@vibeathon.com",
                    phone: "1234567890",
                    college: "Test College"
                },
                {
                    name: "Test Partner",
                    email: "partner@vibeathon.com",
                    phone: "0987654321",
                    college: "Test College"
                }
            ],

            hackathonStart: null,
            githubUrl: null,
            deploymentUrl: null,
            sessionEnded: false
        };

        // Create Firebase Auth user
        console.log("🔐 Creating Firebase Auth user...");
        let userRecord;
        try {
            userRecord = await createTeamUser(dummyTeam.M1_Email, dummyTeam.M1_Phone);
            console.log(`   ✅ User created with UID: ${userRecord.uid}`);
        } catch (error) {
            if (error.code === "auth/email-already-exists") {
                console.log(`   ℹ️  User already exists, getting existing user...`);
                userRecord = await auth.getUserByEmail(dummyTeam.M1_Email);
            } else {
                throw error;
            }
        }

        // Set custom claims
        console.log("🎫 Setting custom claims...");
        await auth.setCustomUserClaims(userRecord.uid, {
            vccId: dummyTeam.vccId,
            teamNo: dummyTeam.teamNo,
            role: "participant"
        });
        console.log(`   ✅ Custom claims set`);

        // Create team in database
        console.log("💾 Creating team in database...");
        await createTeam(dummyTeam);
        console.log(`   ✅ Team created in Firebase Realtime Database`);

        console.log("\n🎉 Dummy test participant created successfully!\n");
        console.log("📋 Login Credentials:");
        console.log("   Email:    test@vibeathon.com");
        console.log("   Password: 1234567890");
        console.log("\n   Team ID:  VCC999");
        console.log("   Members:  2 (Test User + Test Partner)\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error creating dummy participant:", error);
        process.exit(1);
    }
}

// Run
addDummyParticipant();
