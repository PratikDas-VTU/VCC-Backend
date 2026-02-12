const { db } = require("./firebaseConfig");

/**
 * Add fake test submissions for testing ranking filters
 * This creates realistic test data with varying completion times
 */

async function addFakeSubmissions() {
    try {
        console.log("🧪 Creating fake test submissions...\n");

        const fakeSubmissions = [
            {
                vccId: "TEST001",
                teamNo: 901,
                leaderName: "Fast Team Alpha",
                email: "fast@test.com",
                hackathonStart: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
                githubUrl: "https://github.com/test/fast-team",
                deploymentUrl: "https://fast-team.vercel.app",
                sessionEnded: true,
                updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // Ended 15 min ago (30 min completion)
            },
            {
                vccId: "TEST002",
                teamNo: 902,
                leaderName: "Medium Team Beta",
                email: "medium@test.com",
                hackathonStart: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 min ago
                githubUrl: "https://github.com/test/medium-team",
                deploymentUrl: "https://medium-team.netlify.app",
                sessionEnded: true,
                updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // Ended 30 min ago (60 min completion)
            },
            {
                vccId: "TEST003",
                teamNo: 903,
                leaderName: "Slow Team Gamma",
                email: "slow@test.com",
                hackathonStart: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 120 min ago
                githubUrl: "https://github.com/test/slow-team",
                deploymentUrl: "https://slow-team.vercel.app",
                sessionEnded: true,
                updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() // Ended 10 min ago (110 min completion)
            },
            {
                vccId: "TEST004",
                teamNo: 904,
                leaderName: "Quick Team Delta",
                email: "quick@test.com",
                hackathonStart: new Date(Date.now() - 50 * 60 * 1000).toISOString(), // 50 min ago
                githubUrl: "https://github.com/test/quick-team",
                deploymentUrl: "https://quick-team.vercel.app",
                sessionEnded: true,
                updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() // Ended 25 min ago (25 min completion)
            },
            {
                vccId: "TEST005",
                teamNo: 905,
                leaderName: "Average Team Epsilon",
                email: "average@test.com",
                hackathonStart: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // 75 min ago
                githubUrl: "https://github.com/test/average-team",
                deploymentUrl: "https://average-team.netlify.app",
                sessionEnded: true,
                updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // Ended 30 min ago (45 min completion)
            }
        ];

        for (const submission of fakeSubmissions) {
            const teamData = {
                ...submission,
                teamSize: 2,
                members: [
                    {
                        name: submission.leaderName,
                        email: submission.email,
                        phone: "1234567890",
                        college: "Test College"
                    }
                ],
                M1_Name: submission.leaderName,
                M1_Email: submission.email,
                M1_Phone: "1234567890",
                M1_College: "Test College",
                phone: "1234567890",
                college: "Test College",
                createdAt: new Date().toISOString()
            };

            await db.ref(`teams/${submission.vccId}`).set(teamData);
            console.log(`✅ Created ${submission.vccId}: ${submission.leaderName}`);

            // Calculate completion time
            const start = new Date(submission.hackathonStart).getTime();
            const end = new Date(submission.updatedAt).getTime();
            const completionMinutes = Math.round((end - start) / 60000);
            console.log(`   Completion time: ${completionMinutes} minutes`);
        }

        console.log("\n🎉 Fake submissions created successfully!\n");
        console.log("📊 Expected Rankings (by completion time):");
        console.log("   1. TEST004 - Quick Team Delta (25 min)");
        console.log("   2. TEST001 - Fast Team Alpha (30 min)");
        console.log("   3. TEST005 - Average Team Epsilon (45 min)");
        console.log("   4. TEST002 - Medium Team Beta (60 min)");
        console.log("   5. TEST003 - Slow Team Gamma (110 min)");
        console.log("\n⚠️  To remove these test submissions, run: node removeFakeSubmissions.js\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error creating fake submissions:", error);
        process.exit(1);
    }
}

// Run
addFakeSubmissions();
