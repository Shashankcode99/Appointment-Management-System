const admin = require("firebase-admin");

const serviceAccount = require("./appointment-booking-sytem-firebase-adminsdk-v96dh-d33b7711a0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };
