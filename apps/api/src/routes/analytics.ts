import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { Achievement } from "../models/Achievement";
import { FootprintEntry } from "../models/FootprintEntry";
import { Goal } from "../models/Goal";
import { Habit } from "../models/Habit";
import { Recommendation } from "../models/Recommendation";
import { Report } from "../models/Report";
import { ensureUserProfile, getAuth } from "../services/profileService";
import { asyncHandler } from "../utils/asyncHandler";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const profile = await ensureUserProfile(req);

    const [latestReport, footprints, habits, goals, recommendations, achievements] = await Promise.all([
      Report.findOne({ firebaseUid: auth.uid }).sort({ periodStart: -1 }).lean(),
      FootprintEntry.find({ firebaseUid: auth.uid }).sort({ periodStart: -1 }).limit(8).lean(),
      Habit.find({ firebaseUid: auth.uid, archivedAt: { $exists: false } }).sort({ createdAt: -1 }).lean(),
      Goal.find({ firebaseUid: auth.uid }).sort({ targetDate: 1 }).lean(),
      Recommendation.find({ firebaseUid: auth.uid, dismissedAt: { $exists: false } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Achievement.find({ firebaseUid: auth.uid }).sort({ unlockedAt: -1 }).limit(8).lean()
    ]);

    const totalAvoidedKgCo2e = habits.reduce(
      (total, habit) => total + habit.logs.reduce((sum, log) => sum + log.impactKgCo2e, 0),
      0
    );

    res.json({
      profile,
      latestReport,
      footprints,
      habits,
      goals,
      recommendations,
      achievements,
      summary: {
        ecoScore: profile.ecoScore,
        activeGoals: goals.filter((goal) => goal.status === "active").length,
        activeHabits: habits.length,
        totalAvoidedKgCo2e: Math.round(totalAvoidedKgCo2e * 10) / 10
      }
    });
  })
);
