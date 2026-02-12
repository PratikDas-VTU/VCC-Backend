const admin = require("firebase-admin");

// Use environment variable in production, fallback to local file in development
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Parse the JSON string from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("✅ Using Firebase credentials from environment variable");
} else {
    // Fallback to local file for development
    serviceAccount = require("./firebase-service-account.json");
    console.log("✅ Using Firebase credentials from local file");
}

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vccvibeathon-d6ff0-default-rtdb.firebaseio.com"
});

// Export Firebase services
const db = admin.database();
const auth = admin.auth();

module.exports = {
    admin,
    db,
    auth
};
