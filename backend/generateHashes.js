// Generate bcrypt hashes for all team passwords
// Run this with: node generateHashes.js
// This doesn't need MongoDB connection!

const bcrypt = require("bcryptjs");

const phones = [
    "9080662519", "6281127807", "9347112661", "7981152511", "8919525732",
    "7695853507", "8125643574", "9677295567", "9848736145", "8977115752",
    "9642165715", "8838575298", "9059897877", "9042133153", "8897440296",
    "7981550389", "9390097937", "9962614141", "9441378391", "8220978530",
    "7993397258", "6382242118", "7092450500", "9121898309", "6302574858",
    "6381135737", "9959167599", "8431173351", "9515711265", "8122995972",
    "6381744694", "6374587426", "6379290049", "9701724324", "9810759503",
    "8555854949", "9014749041", "9014896383", "8309458556", "9080227141"
];

async function generateHashes() {
    console.log("Generating password hashes...\n");

    const hashes = {};
    for (const phone of phones) {
        const hash = await bcrypt.hash(phone, 10);
        hashes[phone] = hash;
        console.log(`"${phone}": "${hash}",`);
    }

    console.log("\n✅ All hashes generated!");
    console.log("\nCopy the output above and use it in the MongoDB Compass import script.");
}

generateHashes();
