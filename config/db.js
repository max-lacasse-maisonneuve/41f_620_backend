const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const cleAcces = require("../db-config.json");

admin.initializeApp({
    credential: admin.credential.cert(cleAcces),
});

const db = getFirestore();
if (process.env.NODE_ENV === "TEST") {
    db.settings({
        host: "localhost:3005",
        ssl: false,
        projectId: "test",
    });
}
module.exports = db;
