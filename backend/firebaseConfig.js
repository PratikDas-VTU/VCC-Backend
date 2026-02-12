const admin = require("firebase-admin");

// Load service account from environment or file
const serviceAccount = require("./firebase-service-account.json");


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
