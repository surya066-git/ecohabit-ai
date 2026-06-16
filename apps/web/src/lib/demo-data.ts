export const demoDashboard = {
  profile: {
    ecoScore: 78,
    longestStreakDays: 12,
    preferences: {
      monthlyCarbonBudgetKg: 750
    }
  },
  latestReport: {
    totalKgCo2e: 438,
    avoidedKgCo2e: 42,
    ecoScore: 78,
    insight:
      "Transportation is your largest source this week. Focus one repeatable commute swap before adding harder changes.",
    categoryBreakdown: {
      transportation: 168,
      homeEnergy: 102,
      food: 88,
      shopping: 54,
      waste: 26,
      totalKgCo2e: 438
    }
  },
  footprints: [
    { periodStart: "2026-05-01", breakdown: { totalKgCo2e: 522 } },
    { periodStart: "2026-05-08", breakdown: { totalKgCo2e: 491 } },
    { periodStart: "2026-05-15", breakdown: { totalKgCo2e: 470 } },
    { periodStart: "2026-05-22", breakdown: { totalKgCo2e: 456 } },
    { periodStart: "2026-05-29", breakdown: { totalKgCo2e: 438 } }
  ],
  habits: [
    {
      _id: "habit-1",
      title: "Car-free commute",
      category: "transportation",
      frequency: "daily",
      targetCount: 3,
      estimatedImpactKgCo2e: 2.8,
      logs: [{ completedAt: "2026-06-12" }, { completedAt: "2026-06-13" }]
    },
    {
      _id: "habit-2",
      title: "Plant-forward meal",
      category: "food",
      frequency: "daily",
      targetCount: 5,
      estimatedImpactKgCo2e: 1.9,
      logs: [{ completedAt: "2026-06-12" }]
    }
  ],
  goals: [
    {
      _id: "goal-1",
      title: "Cut monthly transportation emissions",
      baselineKgCo2e: 220,
      currentKgCo2e: 168,
      targetKgCo2e: 140,
      status: "active",
      targetDate: "2026-07-01"
    }
  ],
  recommendations: [
    {
      _id: "rec-1",
      title: "Swap one solo car trip",
      rationale: "Your logged trend shows transportation has the highest leverage this month.",
      actionSteps: ["Pick one recurring trip", "Choose transit, bike, or shared ride", "Log it twice this week"],
      category: "transportation",
      expectedImpactKgCo2e: 5.6,
      difficulty: "easy"
    },
    {
      _id: "rec-2",
      title: "Batch deliveries",
      rationale: "Shopping emissions are smaller than travel, but batching cuts avoidable last-mile trips.",
      actionSteps: ["Move purchases to one weekly order", "Prefer pickup when nearby"],
      category: "shopping",
      expectedImpactKgCo2e: 4.2,
      difficulty: "medium"
    }
  ],
  achievements: [
    {
      key: "first-action",
      title: "First Action",
      tier: "bronze",
      description: "Completed your first tracked climate habit."
    },
    {
      key: "seven-day-streak",
      title: "Seven-Day Streak",
      tier: "silver",
      description: "Kept a sustainable habit streak alive for a full week."
    }
  ],
  summary: {
    ecoScore: 78,
    activeGoals: 1,
    activeHabits: 2,
    totalAvoidedKgCo2e: 42
  }
};

export type DashboardData = typeof demoDashboard;
