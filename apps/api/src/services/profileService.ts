import type { Request } from "express";
import { UserProfile } from "../models/UserProfile";
import { ApiError } from "../utils/apiError";

export function getAuth(req: Request) {
  if (!req.auth) {
    throw new ApiError(401, "Authentication is required.", "AUTH_REQUIRED");
  }

  return req.auth;
}

export async function ensureUserProfile(req: Request) {
  const auth = getAuth(req);

  return UserProfile.findOneAndUpdate(
    { firebaseUid: auth.uid },
    {
      $set: {
        email: auth.email,
        displayName: auth.name,
        photoUrl: auth.picture
      },
      $setOnInsert: {
        firebaseUid: auth.uid,
        ecoScore: 50,
        longestStreakDays: 0
      }
    },
    { new: true, upsert: true }
  );
}
