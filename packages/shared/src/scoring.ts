import { DEFAULT_MONTHLY_BUDGET_KG } from "./constants";

export type EcoScoreInput = {
  monthlyKgCo2e: number;
  previousMonthlyKgCo2e?: number;
  habitCompletionRate: number;
  activeGoals: number;
  longestStreakDays: number;
  monthlyBudgetKg?: number;
};

export type AchievementCandidate = {
  key: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
};

export function calculateEcoScore(input: EcoScoreInput) {
  const budget = input.monthlyBudgetKg ?? DEFAULT_MONTHLY_BUDGET_KG;
  const footprintScore = Math.max(0, Math.min(45, 45 * (1 - input.monthlyKgCo2e / (budget * 1.5))));
  const habitScore = Math.max(0, Math.min(25, input.habitCompletionRate * 25));
  const goalScore = Math.max(0, Math.min(15, input.activeGoals * 5));
  const streakScore = Math.max(0, Math.min(10, input.longestStreakDays / 3));
  const trendScore =
    input.previousMonthlyKgCo2e && input.previousMonthlyKgCo2e > input.monthlyKgCo2e ? 5 : 0;

  return Math.round(footprintScore + habitScore + goalScore + streakScore + trendScore);
}

export function calculateReductionPercentage(currentKg: number, baselineKg: number) {
  if (baselineKg <= 0) return 0;
  return Math.max(0, Math.round(((baselineKg - currentKg) / baselineKg) * 100));
}

export function getAchievementCandidates(input: {
  ecoScore: number;
  completedHabits: number;
  longestStreakDays: number;
  reductionPercentage: number;
  recommendationsAccepted: number;
}): AchievementCandidate[] {
  const achievements: AchievementCandidate[] = [];

  if (input.completedHabits >= 1) {
    achievements.push({
      key: "first-action",
      title: "First Action",
      description: "Completed your first tracked climate habit.",
      tier: "bronze"
    });
  }

  if (input.longestStreakDays >= 7) {
    achievements.push({
      key: "seven-day-streak",
      title: "Seven-Day Streak",
      description: "Kept a sustainable habit streak alive for a full week.",
      tier: "silver"
    });
  }

  if (input.reductionPercentage >= 10) {
    achievements.push({
      key: "ten-percent-drop",
      title: "10% Carbon Drop",
      description: "Reduced footprint by at least 10% against your baseline.",
      tier: "gold"
    });
  }

  if (input.ecoScore >= 85) {
    achievements.push({
      key: "eco-leader",
      title: "Eco Leader",
      description: "Reached an Eco Score of 85 or higher.",
      tier: "platinum"
    });
  }

  if (input.recommendationsAccepted >= 5) {
    achievements.push({
      key: "ai-action-taker",
      title: "AI Action Taker",
      description: "Accepted five personalized EcoHabit AI recommendations.",
      tier: "silver"
    });
  }

  return achievements;
}
