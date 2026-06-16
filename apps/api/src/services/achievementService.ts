import {
  calculateReductionPercentage,
  getAchievementCandidates
} from "@ecohabit/shared";
import { Achievement } from "../models/Achievement";
import { Recommendation } from "../models/Recommendation";

export async function unlockAchievements(input: {
  firebaseUid: string;
  ecoScore: number;
  completedHabits: number;
  longestStreakDays: number;
  currentKgCo2e: number;
  baselineKgCo2e: number;
}) {
  const recommendationsAccepted = await Recommendation.countDocuments({
    firebaseUid: input.firebaseUid,
    acceptedAt: { $exists: true }
  });

  const candidates = getAchievementCandidates({
    ecoScore: input.ecoScore,
    completedHabits: input.completedHabits,
    longestStreakDays: input.longestStreakDays,
    reductionPercentage: calculateReductionPercentage(input.currentKgCo2e, input.baselineKgCo2e),
    recommendationsAccepted
  });

  await Promise.all(
    candidates.map((candidate) =>
      Achievement.updateOne(
        { firebaseUid: input.firebaseUid, key: candidate.key },
        {
          $setOnInsert: {
            ...candidate,
            firebaseUid: input.firebaseUid,
            unlockedAt: new Date()
          }
        },
        { upsert: true }
      )
    )
  );

  return Achievement.find({ firebaseUid: input.firebaseUid }).sort({ unlockedAt: -1 }).lean();
}
