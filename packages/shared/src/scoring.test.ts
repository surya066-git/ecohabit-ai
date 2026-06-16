import { describe, expect, it } from "vitest";
import { calculateEcoScore, getAchievementCandidates } from "./scoring";

describe("calculateEcoScore", () => {
  it("rewards lower footprints, habit consistency, goals, and positive trends", () => {
    const score = calculateEcoScore({
      monthlyKgCo2e: 420,
      previousMonthlyKgCo2e: 520,
      habitCompletionRate: 0.8,
      activeGoals: 2,
      longestStreakDays: 14,
      monthlyBudgetKg: 750
    });

    expect(score).toBeGreaterThanOrEqual(60);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("getAchievementCandidates", () => {
  it("returns unlocked achievements from behavior milestones", () => {
    const achievements = getAchievementCandidates({
      ecoScore: 90,
      completedHabits: 12,
      longestStreakDays: 8,
      reductionPercentage: 12,
      recommendationsAccepted: 5
    });

    expect(achievements.map((item) => item.key)).toContain("eco-leader");
    expect(achievements.map((item) => item.key)).toContain("ten-percent-drop");
  });
});
