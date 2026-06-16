import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { Achievement } from "../models/Achievement";
import { getAuth } from "../services/profileService";
import { asyncHandler } from "../utils/asyncHandler";

export const achievementsRouter = Router();

achievementsRouter.use(requireAuth);

achievementsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const achievements = await Achievement.find({ firebaseUid: auth.uid })
      .sort({ unlockedAt: -1 })
      .lean();

    res.json({ achievements });
  })
);
