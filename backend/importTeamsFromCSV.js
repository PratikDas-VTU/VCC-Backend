const fs = require("fs");
const csv = require("csv-parser");
const { auth } = require("./firebaseConfig");
const { createTeam, createTeamUser } = require("./services/firebaseService");

/**
 * Import teams from CSV to Firebase
 * CSV Format: VCC_ID, Team_No, Team_Size, M1_Name, M1_Email, M1_Phone, M1_College, M2_Name, M2_Email, M2_Phone, M2_College
 */

const CSV_FILE = "../vibeathon-participants.csv";

async function importTeams() {
  const teams = [];

  // Read CSV
  fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on("data", (row) => {
      teams.push(row);
    })
    .on("end", async () => {
      console.log(`📄 Found ${teams.length} teams in CSV`);

      for (const row of teams) {
        try {
          const vccId = row.VCC_ID?.trim();
          const teamNo = parseInt(row.Team_No);
          const teamSize = parseInt(row.Team_Size);

          const M1_Name = row.M1_Name?.trim();
          const M1_Email = row.M1_Email?.trim();
          const M1_Phone = row.M1_Phone?.trim();
          const M1_College = row.M1_College?.trim();

          const M2_Name = row.M2_Name?.trim() || null;
          const M2_Email = row.M2_Email?.trim() || null;
          const M2_Phone = row.M2_Phone?.trim() || null;
          const M2_College = row.M2_College?.trim() || null;

          if (!vccId || !M1_Email || !M1_Phone) {
            console.log(`⚠️  Skipping invalid row: ${JSON.stringify(row)}`);
            continue;
          }

          // Create Firebase Auth user
          console.log(`🔐 Creating Firebase user for ${M1_Email}...`);
          let userRecord;
          try {
            userRecord = await createTeamUser(M1_Email, M1_Phone);
            console.log(`   ✅ User created with UID: ${userRecord.uid}`);
          } catch (error) {
            if (error.code === "auth/email-already-exists") {
              console.log(`   ℹ️  User already exists: ${M1_Email}`);
              // Get existing user
              userRecord = await auth.getUserByEmail(M1_Email);
            } else {
              throw error;
            }
          }

          // Set custom claims for role-based access control
          console.log(`🎫 Setting custom claims for ${vccId}...`);
          await auth.setCustomUserClaims(userRecord.uid, {
            vccId: vccId,
            teamNo: teamNo,
            role: "participant"
          });
          console.log(`   ✅ Custom claims set: vccId=${vccId}, teamNo=${teamNo}, role=participant`);


          // Build members array
          const members = [
            {
              name: M1_Name,
              email: M1_Email,
              phone: M1_Phone,
              college: M1_College
            }
          ];

          if (M2_Name && M2_Email) {
            members.push({
              name: M2_Name,
              email: M2_Email,
              phone: M2_Phone,
              college: M2_College
            });
          }

          // Create team in Firebase Realtime Database
          const teamData = {
            vccId,
            teamNo,
            teamSize,
            members,
            M1_Name,
            M1_Email,
            M1_Phone,
            M1_College,
            M2_Name,
            M2_Email,
            M2_Phone,
            M2_College,
            leaderName: M1_Name,
            email: M1_Email,
            phone: M1_Phone,
            college: M1_College,
            hackathonStart: null,
            githubUrl: null,
            deploymentUrl: null,
            sessionEnded: false
          };

          await createTeam(teamData);
          console.log(`✅ Imported team: ${vccId} (${M1_Name})`);

        } catch (error) {
          console.error(`❌ Error importing team ${row.VCC_ID}:`, error);
        }
      }

      console.log("\n🎉 Import completed!");
      process.exit(0);
    });
}

// Run import
importTeams().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
