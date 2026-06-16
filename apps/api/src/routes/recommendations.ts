import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { Recommendation } from "../models/Recommendation";
import { getAuth } from "../services/profileService";
import { generateRecommendations } from "../services/recommendationService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const recommendationsRouter = Router();

const paramsSchema = z.object({ id: z.string().min(1) });
const statusSchema = z.object({
  status: z.enum(["accepted", "dismissed"])
});

recommendationsRouter.use(requireAuth);

recommendationsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const recommendations = await Recommendation.find({
      firebaseUid: auth.uid,
      dismissedAt: { $exists: false }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ recommendations });
  })
);

recommendationsRouter.post(
  "/generate",
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const recommendations = await generateRecommendations(auth.uid);
    res.status(201).json({ recommendations });
  })
);

recommendationsRouter.patch(
  "/:id",
  validate({ params: paramsSchema, body: statusSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const field = req.body.status === "accepted" ? "acceptedAt" : "dismissedAt";
    const recommendation = await Recommendation.findOneAndUpdate(
      { _id: req.params.id, firebaseUid: auth.uid },
      { $set: { [field]: new Date() } },
      { new: true }
    );

    if (!recommendation) {
      throw new ApiError(404, "Recommendation not found.", "RECOMMENDATION_NOT_FOUND");
    }

    res.json({ recommendation });
  })
);
