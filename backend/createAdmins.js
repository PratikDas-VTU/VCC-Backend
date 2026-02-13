const { auth } = require("./firebaseConfig");
const { createAdmin, createAdminUser } = require("./services/firebaseService");

/**
 * Create 5 additional admin accounts
 * admin1 / admin123
 * admin2 / admin123
 * admin3 / admin123
 * admin4 / admin123
 * admin5 / admin123
 */

const ADMINS = [
    { username: "admin1", password: "admin123" },
    { username: "admin2", password: "admin123" },
    { username: "admin3", password: "admin123" },
    { username: "admin4", password: "admin123" },
    { username: "admin5", password: "admin123" }
];

async function createAdmins() {
    try {
        console.log("👥 Creating 5 additional admin accounts...\n");

        for (const adminData of ADMINS) {
            console.log(`🔐 Creating admin: ${adminData.username}...`);
            const adminEmail = `${adminData.username}@vibeathon.internal`;

            try {
                // Create Firebase Auth user
                let userRecord;
                try {
                    userRecord = await createAdminUser(adminEmail, adminData.password);
                    console.log(`   ✅ Firebase Auth user created: ${adminEmail}`);
                } catch (error) {
                    if (error.code === "auth/email-already-exists") {
                        console.log(`   ℹ️  User already exists: ${adminEmail}`);
                        userRecord = await auth.getUserByEmail(adminEmail);
                    } else {
                        throw error;
                    }
                }

                // Create admin in database
                try {
                    const admin = await createAdmin({
                        username: adminData.username,
                        email: adminEmail,
                        role: "admin"
                    });
                    console.log(`   ✅ Admin created in database: ${adminData.username}`);

                    // Set custom claims
                    await auth.setCustomUserClaims(userRecord.uid, {
                        id: admin.id,
                        role: "admin",
                        username: admin.username
                    });
                    console.log(`   ✅ Custom claims set for ${adminData.username}`);
                } catch (dbError) {
                    console.log(`   ℹ️  Admin already exists in database: ${adminData.username}`);
                }

                console.log(`   ✅ ${adminData.username} ready!\n`);
            } catch (error) {
                console.error(`   ❌ Error creating ${adminData.username}:`, error.message);
            }
        }

        console.log("🎉 All admin accounts created successfully!\n");
        console.log("📋 Admin Login Credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Username: admin   | Password: admin123");
        console.log("Username: admin1  | Password: admin123");
        console.log("Username: admin2  | Password: admin123");
        console.log("Username: admin3  | Password: admin123");
        console.log("Username: admin4  | Password: admin123");
        console.log("Username: admin5  | Password: admin123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        console.log("✅ All admins can login at: https://vcc-tawny.vercel.app/admin-login.html");

        process.exit(0);
    } catch (error) {
        console.error("❌ Fatal error:", error);
        process.exit(1);
    }
}

createAdmins();
