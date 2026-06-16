import admin from "firebase-admin";
import { env } from "./env";

function getServiceAccount() {
  if (env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8");
    return JSON.parse(decoded) as admin.ServiceAccount;
  }

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  }

  throw new Error("Firebase Admin credentials are not configured.");
}

export function getFirebaseAdminAuth() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(getServiceAccount())
    });
  }

  return admin.auth();
}
