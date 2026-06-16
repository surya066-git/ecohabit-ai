import { Router } from "express";
import { habitCreateSchema, habitLogSchema } from "@ecohabit/shared";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { Habit } from "../models/Habit";
import { UserProfile } from "../models/UserProfile";
import { getAuth } from "../services/profileService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const habitsRouter = Router();

const paramsSchema = z.object({ id: z.string().min(1) });
const updateHabitSchema = habitCreateSchema.partial().extend({
  archived: z.boolean().optional()
});

function calculateLongestStreak(dates: Date[]) {
  const days = [...new Set(dates.map((date) => date.toISOString().slice(0, 10)))].sort();
  let longest = 0;
  let current = 0;
  let previous: Date | undefined;

  for (const day of days) {
    const date = new Date(`${day}T00:00:00.000Z`);
    const diffDays = previous ? Math.round((date.getTime() - previous.getTime()) / 86_400_000) : 1;
    current = diffDays === 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = date;
  }

  return longest;
}

habitsRouter.use(requireAuth);

habitsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const habits = await Habit.find({ firebaseUid: auth.uid, archivedAt: { $exists: false } })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ habits });
  })
);

habitsRouter.post(
  "/",
  validate({ body: habitCreateSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const habit = await Habit.create({ ...req.body, firebaseUid: auth.uid });
    res.status(201).json({ habit });
  })
);

habitsRouter.patch(
  "/:id",
  validate({ params: paramsSchema, body: updateHabitSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const update = {
      ...req.body,
      archivedAt: req.body.archived ? new Date() : undefined
    };
    delete update.archived;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, firebaseUid: auth.uid },
      { $set: update },
      { new: true }
    );

    if (!habit) {
      throw new ApiError(404, "Habit not found.", "HABIT_NOT_FOUND");
    }

    res.json({ habit });
  })
);

habitsRouter.post(
  "/:id/logs",
  validate({ params: paramsSchema, body: habitLogSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const habit = await Habit.findOne({ _id: req.params.id, firebaseUid: auth.uid });

    if (!habit) {
      throw new ApiError(404, "Habit not found.", "HABIT_NOT_FOUND");
    }

    habit.logs.push({
      completedAt: new Date(req.body.completedAt),
      count: req.body.count,
      impactKgCo2e: req.body.count * habit.estimatedImpactKgCo2e,
      notes: req.body.notes
    });
    await habit.save();

    const allLogDates = habit.logs.map((log) => log.completedAt);
    const longestStreakDays = calculateLongestStreak(allLogDates);
    await UserProfile.updateOne(
      { firebaseUid: auth.uid },
      { $max: { longestStreakDays } }
    );

    res.status(201).json({ habit, longestStreakDays });
  })
);
