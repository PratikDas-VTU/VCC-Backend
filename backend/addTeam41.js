const { auth } = require("./firebaseConfig");
const { createTeam, createTeamUser } = require("./services/firebaseService");

async function addTeam41() {
    try {
        const teamData = {
            vccId: "VCC131",
            teamNo: 41,
            teamSize: 2,
            M1_Name: "Sri Nandhini P",
            M1_Email: "srinandhiniparthiban@gmail.com",
            M1_Phone: "9500083226",
            M1_College: "amrita vishwavidypeetham",
            M2_Name: "Arthi.B",
            M2_Email: "arthib610@gmail.com",
            M2_Phone: "7708550349",
            M2_College: "amrita vishwavidypeetham",
            members: [
                {
                    name: "Sri Nandhini P",
                    email: "srinandhiniparthiban@gmail.com",
                    phone: "9500083226",
                    college: "amrita vishwavidypeetham"
                },
                {
                    name: "Arthi.B",
                    email: "arthib610@gmail.com",
                    phone: "7708550349",
                    college: "amrita vishwavidypeetham"
                }
            ],
            leaderName: "Sri Nandhini P",
            email: "srinandhiniparthiban@gmail.com",
            phone: "9500083226",
            college: "amrita vishwavidypeetham",
            hackathonStart: null,
            githubUrl: null,
            deploymentUrl: null,
            sessionEnded: false
        };

        // Create Firebase Auth user
        console.log("🔐 Creating Firebase user for srinandhiniparthiban@gmail.com...");
        let userRecord;
        try {
            userRecord = await createTeamUser(teamData.M1_Email, teamData.M1_Phone);
            console.log(`✅ User created with UID: ${userRecord.uid}`);
        } catch (error) {
            if (error.code === "auth/email-already-exists") {
                console.log("ℹ️  User already exists, fetching...");
                userRecord = await auth.getUserByEmail(teamData.M1_Email);
            } else {
                throw error;
            }
        }

        // Set custom claims
        console.log("🎫 Setting custom claims for VCC131...");
        await auth.setCustomUserClaims(userRecord.uid, {
            vccId: "VCC131",
            teamNo: 41,
            role: "participant"
        });
        console.log("✅ Custom claims set: vccId=VCC131, teamNo=41, role=participant");

        // Create team in database
        await createTeam(teamData);
        console.log("✅ Imported team: VCC131 (Sri Nandhini P)");

        console.log("\n🎉 Team 41 added successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error adding team 41:", error);
        process.exit(1);
    }
}

addTeam41();
