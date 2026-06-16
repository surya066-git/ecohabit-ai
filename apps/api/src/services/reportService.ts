import {
  ACTIVITY_CATEGORIES,
  calculateEcoScore,
  getLargestCategory,
  type ActivityCategory,
  type FootprintBreakdown,
  type ReportPeriod
} from "@ecohabit/shared";
import { FootprintEntry } from "../models/FootprintEntry";
import { Goal } from "../models/Goal";
import { Habit } from "../models/Habit";
import { Report } from "../models/Report";
import { UserProfile } from "../models/UserProfile";
import { unlockAchievements } from "./achievementService";

type Range = {
  start: Date;
  end: Date;
};

const MS_PER_DAY = 86_400_000;

function getPeriodRange(period: ReportPeriod, referenceDate = new Date()): Range {
  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  if (period === "weekly") {
    start.setDate(end.getDate() - 6);
  } else {
    start.setDate(1);
  }
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

function getPreviousRange(range: Range): Range {
  const duration = range.end.getTime() - range.start.getTime();
  const end = new Date(range.start.getTime() - 1);
  const start = new Date(end.getTime() - duration);
  return { start, end };
}

function emptyBreakdown(): Omit<FootprintBreakdown, "totalKgCo2e"> {
  return {
    transportation: 0,
    homeEnergy: 0,
    food: 0,
    shopping: 0,
    waste: 0
  };
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

async function getTotalForRange(firebaseUid: string, range: Range) {
  const entries = await FootprintEntry.find({
    firebaseUid,
    periodStart: { $gte: range.start },
    periodEnd: { $lte: range.end }
  }).lean();

  return entries.reduce((total, entry) => total + (entry.breakdown?.totalKgCo2e ?? 0), 0);
}

export async function generateReport(firebaseUid: string, period: ReportPeriod) {
  const range = getPeriodRange(period);
  const previousRange = getPreviousRange(range);

  const [entries, previousTotal, habits, activeGoals, profile] = await Promise.all([
    FootprintEntry.find({
      firebaseUid,
      periodStart: { $gte: range.start },
      periodEnd: { $lte: range.end }
    }).lean(),
    getTotalForRange(firebaseUid, previousRange),
    Habit.find({ firebaseUid, archivedAt: { $exists: false } }).lean(),
    Goal.countDocuments({ firebaseUid, status: "active" }),
    UserProfile.findOne({ firebaseUid }).lean()
  ]);

  const categoryBreakdown = entries.reduce((accumulator, entry) => {
    for (const category of ACTIVITY_CATEGORIES) {
      accumulator[category] += entry.breakdown?.[category] ?? 0;
    }
    return accumulator;
  }, emptyBreakdown());

  const totalKgCo2e = round(entries.reduce((total, entry) => total + (entry.breakdown?.totalKgCo2e ?? 0), 0));
  const completedHabitLogs = habits.flatMap((habit) =>
    habit.logs.filter((log) => log.completedAt >= range.start && log.completedAt <= range.end)
  );
  const avoidedKgCo2e = round(completedHabitLogs.reduce((total, log) => total + log.impactKgCo2e, 0));

  const periodDays = Math.max(1, Math.ceil((range.end.getTime() - range.start.getTime()) / MS_PER_DAY));
  const expectedHabitCompletions = habits.reduce((total, habit) => {
    const multiplier = habit.frequency === "daily" ? periodDays : period === "weekly" ? 1 : 4;
    return total + habit.targetCount * multiplier;
  }, 0);
  const habitCompletionRate =
    expectedHabitCompletions > 0 ? Math.min(1, completedHabitLogs.length / expectedHabitCompletions) : 0;

  const ecoScore = calculateEcoScore({
    monthlyKgCo2e: period === "monthly" ? totalKgCo2e : totalKgCo2e * 4,
    previousMonthlyKgCo2e: period === "monthly" ? previousTotal : previousTotal * 4,
    habitCompletionRate,
    activeGoals,
    longestStreakDays: profile?.longestStreakDays ?? 0,
    monthlyBudgetKg: profile?.preferences?.monthlyCarbonBudgetKg
  });

  const breakdownWithTotal: FootprintBreakdown = {
    transportation: round(categoryBreakdown.transportation),
    homeEnergy: round(categoryBreakdown.homeEnergy),
    food: round(categoryBreakdown.food),
    shopping: round(categoryBreakdown.shopping),
    waste: round(categoryBreakdown.waste),
    totalKgCo2e
  };
  const largestCategory = getLargestCategory(breakdownWithTotal) as ActivityCategory;
  const insight =
    totalKgCo2e === 0
      ? "Start by logging a footprint period so EcoHabit AI can identify patterns and recommend high-impact actions."
      : `${largestCategory} is your largest source this ${period}. Focus one small habit there before expanding to harder changes.`;

  const report = await Report.findOneAndUpdate(
    { firebaseUid, period, periodStart: range.start },
    {
      firebaseUid,
      period,
      periodStart: range.start,
      periodEnd: range.end,
      totalKgCo2e,
      avoidedKgCo2e,
      categoryBreakdown: breakdownWithTotal,
      insight,
      ecoScore
    },
    { new: true, upsert: true }
  ).lean();

  await UserProfile.updateOne({ firebaseUid }, { $set: { ecoScore } });

  await unlockAchievements({
    firebaseUid,
    ecoScore,
    completedHabits: completedHabitLogs.length,
    longestStreakDays: profile?.longestStreakDays ?? 0,
    currentKgCo2e: totalKgCo2e,
    baselineKgCo2e: previousTotal || totalKgCo2e
  });

  return report;
}
