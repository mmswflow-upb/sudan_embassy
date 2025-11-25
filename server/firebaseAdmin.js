const admin = require("firebase-admin");
const path = require("path");

let app;
if (!admin.apps.length) {
  try {
    const serviceAccountPath =
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      path.join(__dirname, "credentials", "firebase-sa-key.json");
    const svc = require(serviceAccountPath);
    const projectId = svc.project_id;
    const bucketFromEnv = process.env.FIREBASE_BUCKET;
    const inferredNew = projectId
      ? `${projectId}.firebasestorage.app`
      : undefined;
    const inferredLegacy = projectId ? `${projectId}.appspot.com` : undefined;
    const chosenBucket = bucketFromEnv || inferredNew || inferredLegacy;
    app = admin.initializeApp({
      credential: admin.credential.cert(svc),
      storageBucket: chosenBucket,
    });
    // eslint-disable-next-line no-console
    console.log(
      "Firebase Admin initialized for project:",
      projectId,
      "bucket:",
      chosenBucket
    );
  } catch (err) {
    console.error(
      "Failed to initialize Firebase Admin. Ensure serviceAccountKey.json exists at project root.",
      err
    );
    throw err;
  }
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function verifyIdToken(authorizationHeader) {
  if (!authorizationHeader) return null;
  const parts = authorizationHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  const token = parts[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (e) {
    return null;
  }
}

module.exports = { admin, db, bucket, verifyIdToken };
