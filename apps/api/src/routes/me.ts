import { Router } from "express";
import { userPreferencesSchema } from "@ecohabit/shared";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { UserProfile } from "../models/UserProfile";
import { asyncHandler } from "../utils/asyncHandler";
import { getAuth, ensureUserProfile } from "../services/profileService";

export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const profile = await ensureUserProfile(req);
    res.json({ profile });
  })
);

meRouter.patch(
  "/",
  validate({ body: userPreferencesSchema.partial() }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: auth.uid },
      {
        $set: {
          preferences: req.body,
          onboardingCompletedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );

    res.json({ profile });
  })
);
