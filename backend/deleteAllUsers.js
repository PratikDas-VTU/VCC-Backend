const { auth } = require("./firebaseConfig");

/**
 * Delete all users from Firebase Authentication
 * WARNING: This is irreversible!
 */

async function deleteAllUsers() {
    try {
        console.log("🔍 Fetching all users from Firebase Authentication...");

        let allUsers = [];
        let nextPageToken;

        // Fetch all users (paginated)
        do {
            const listUsersResult = await auth.listUsers(1000, nextPageToken);
            allUsers = allUsers.concat(listUsersResult.users);
            nextPageToken = listUsersResult.pageToken;
        } while (nextPageToken);

        console.log(`📊 Found ${allUsers.length} users`);

        if (allUsers.length === 0) {
            console.log("✅ No users to delete!");
            process.exit(0);
        }

        // Confirm deletion
        console.log("\n⚠️  WARNING: This will delete ALL users from Firebase Authentication!");
        console.log("⚠️  This action is IRREVERSIBLE!");
        console.log("\nPress Ctrl+C to cancel, or wait 5 seconds to proceed...\n");

        // Wait 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log("🗑️  Starting deletion...\n");

        // Delete users in batches
        const batchSize = 100;
        let deletedCount = 0;

        for (let i = 0; i < allUsers.length; i += batchSize) {
            const batch = allUsers.slice(i, i + batchSize);
            const uids = batch.map(user => user.uid);

            try {
                const result = await auth.deleteUsers(uids);
                deletedCount += result.successCount;

                if (result.failureCount > 0) {
                    console.log(`⚠️  Failed to delete ${result.failureCount} users in this batch`);
                    result.errors.forEach(error => {
                        console.log(`   Error: ${error.error.message}`);
                    });
                }

                console.log(`✅ Deleted ${deletedCount}/${allUsers.length} users...`);
            } catch (error) {
                console.error(`❌ Error deleting batch:`, error);
            }
        }

        console.log(`\n🎉 Deletion complete! Deleted ${deletedCount} users.`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Fatal error:", error);
        process.exit(1);
    }
}

// Run deletion
deleteAllUsers();
