import { Router } from "express";
import { goalCreateSchema, goalStatusSchema } from "@ecohabit/shared";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { Goal } from "../models/Goal";
import { getAuth } from "../services/profileService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const goalsRouter = Router();

const paramsSchema = z.object({ id: z.string().min(1) });
const goalUpdateSchema = goalCreateSchema.partial().extend({
  currentKgCo2e: z.number().min(0).max(100000).optional(),
  status: goalStatusSchema.optional()
});

goalsRouter.use(requireAuth);

goalsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const goals = await Goal.find({ firebaseUid: auth.uid }).sort({ targetDate: 1 }).lean();
    res.json({ goals });
  })
);

goalsRouter.post(
  "/",
  validate({ body: goalCreateSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const goal = await Goal.create({
      ...req.body,
      firebaseUid: auth.uid,
      currentKgCo2e: req.body.baselineKgCo2e
    });

    res.status(201).json({ goal });
  })
);

goalsRouter.patch(
  "/:id",
  validate({ params: paramsSchema, body: goalUpdateSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, firebaseUid: auth.uid },
      { $set: req.body },
      { new: true }
    );

    if (!goal) {
      throw new ApiError(404, "Goal not found.", "GOAL_NOT_FOUND");
    }

    res.json({ goal });
  })
);

goalsRouter.delete(
  "/:id",
  validate({ params: paramsSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, firebaseUid: auth.uid },
      { $set: { status: "paused" } },
      { new: true }
    );

    if (!goal) {
      throw new ApiError(404, "Goal not found.", "GOAL_NOT_FOUND");
    }

    res.json({ goal });
  })
);
