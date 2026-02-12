const { db } = require("./firebaseConfig");

/**
 * Add fake prompts to test teams for AI evaluation testing
 */

async function addFakePrompts() {
    try {
        console.log("📝 Adding fake prompts to test teams...\n");

        const fakePrompts = [
            // TEST001 - Fast Team Alpha (Good quality prompts)
            {
                vccId: "TEST001",
                prompts: [
                    {
                        aiName: "ChatGPT",
                        promptText: "Create a multi-role event management system with Event Coordinator, HOD, Dean, and Admin roles. Include approval workflows where requests flow from coordinator to HOD to Dean. Handle venue capacity constraints and prevent double-booking.",
                        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "Claude",
                        promptText: "Add rejection handling to the approval workflow. When HOD or Dean rejects a request, store the reason and notify the coordinator. Allow coordinator to modify and resubmit with changes addressing the rejection reason.",
                        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "ChatGPT",
                        promptText: "Implement dynamic venue availability checking. Show real-time capacity updates when events are approved or cancelled. Prevent overlapping bookings for same venue and time slot.",
                        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
                    }
                ]
            },
            // TEST002 - Medium Team Beta (Average quality)
            {
                vccId: "TEST002",
                prompts: [
                    {
                        aiName: "Gemini",
                        promptText: "Build an event management system with different user roles and approval system",
                        timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "Gemini",
                        promptText: "Add database schema for events, venues, and users. Include fields for event name, date, venue, status",
                        timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "ChatGPT",
                        promptText: "Create frontend forms for event creation and approval buttons for admins",
                        timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString()
                    }
                ]
            },
            // TEST003 - Slow Team Gamma (Poor quality - just asking for code)
            {
                vccId: "TEST003",
                prompts: [
                    {
                        aiName: "ChatGPT",
                        promptText: "Write complete code for event management system",
                        timestamp: new Date(Date.now() - 115 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "ChatGPT",
                        promptText: "Generate HTML CSS JavaScript for the frontend",
                        timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString()
                    }
                ]
            },
            // TEST004 - Quick Team Delta (Excellent quality - strategic use)
            {
                vccId: "TEST004",
                prompts: [
                    {
                        aiName: "Claude",
                        promptText: "Help me design the state machine for event request lifecycle: Draft -> Pending HOD -> Pending Dean -> Approved/Rejected. What edge cases should I handle for state transitions? Consider scenarios like: coordinator cancels mid-approval, HOD approves but Dean rejects, mid-event resource changes.",
                        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "ChatGPT",
                        promptText: "Design database schema to enforce these constraints: 1) Venue capacity cannot be exceeded, 2) No overlapping events in same venue, 3) Approval hierarchy must be followed (can't skip HOD to Dean), 4) Rejected requests must have reason. What indexes and validations are needed?",
                        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "Claude",
                        promptText: "Implement role-based visibility: Event Coordinator sees only their requests, HOD sees requests from their department, Dean sees all requests, Admin/ITC sees everything. How should I structure the API endpoints and middleware to enforce this?",
                        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "Gemini",
                        promptText: "Handle mid-event additional resource requests: coordinator realizes they need extra chairs during event. Design workflow: request -> immediate notification to Admin/ITC -> quick approval/rejection -> update event record. How to handle if request is impossible (resource unavailable)?",
                        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
                    }
                ]
            },
            // TEST005 - Average Team Epsilon (Basic understanding)
            {
                vccId: "TEST005",
                prompts: [
                    {
                        aiName: "ChatGPT",
                        promptText: "Create event booking system with admin approval",
                        timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "Gemini",
                        promptText: "Add user roles: coordinator who creates events, admin who approves them",
                        timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString()
                    },
                    {
                        aiName: "ChatGPT",
                        promptText: "Show list of venues with their capacity. Check if venue is available before booking",
                        timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString()
                    }
                ]
            }
        ];

        let totalAdded = 0;

        for (const teamData of fakePrompts) {
            console.log(`\n📋 Adding prompts for ${teamData.vccId}...`);

            for (const prompt of teamData.prompts) {
                const promptRef = db.ref("prompts").push();
                await promptRef.set({
                    vccId: teamData.vccId,
                    aiName: prompt.aiName,
                    promptText: prompt.promptText,
                    timestamp: prompt.timestamp,
                    createdAt: prompt.timestamp
                });

                totalAdded++;
                console.log(`   ✅ Added ${prompt.aiName} prompt`);
            }

            console.log(`   Total: ${teamData.prompts.length} prompts`);
        }

        console.log(`\n🎉 Successfully added ${totalAdded} fake prompts!\n`);
        console.log("📊 Expected AI Evaluation Scores (approximate):");
        console.log("   TEST004 - Quick Team Delta: 32-38/40 (Excellent)");
        console.log("   TEST001 - Fast Team Alpha: 25-30/40 (Good)");
        console.log("   TEST002 - Medium Team Beta: 15-20/40 (Basic)");
        console.log("   TEST005 - Average Team Epsilon: 12-18/40 (Basic)");
        console.log("   TEST003 - Slow Team Gamma: 5-10/40 (Very Poor)");
        console.log("\n✨ Now run 'Run AI Evaluation' in the admin dashboard!\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error adding fake prompts:", error);
        process.exit(1);
    }
}

// Run
addFakePrompts();
