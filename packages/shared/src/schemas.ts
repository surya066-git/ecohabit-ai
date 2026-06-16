import { z } from "zod";
import {
  ACHIEVEMENT_TIERS,
  ACTIVITY_CATEGORIES,
  GOAL_STATUSES,
  HABIT_FREQUENCIES,
  REPORT_PERIODS
} from "./constants";

export const activityCategorySchema = z.enum(ACTIVITY_CATEGORIES);
export const reportPeriodSchema = z.enum(REPORT_PERIODS);
export const goalStatusSchema = z.enum(GOAL_STATUSES);
export const habitFrequencySchema = z.enum(HABIT_FREQUENCIES);
export const achievementTierSchema = z.enum(ACHIEVEMENT_TIERS);

export const calculatorInputSchema = z.object({
  periodStart: z.iso.datetime(),
  periodEnd: z.iso.datetime(),
  transportation: z.object({
    carKm: z.number().min(0).max(10000),
    fuelType: z.enum(["gasoline", "diesel", "hybrid", "electric"]),
    transitKm: z.number().min(0).max(10000),
    trainKm: z.number().min(0).max(10000),
    bikeOrWalkKm: z.number().min(0).max(10000),
    shortFlights: z.number().int().min(0).max(30),
    longFlights: z.number().int().min(0).max(20)
  }),
  homeEnergy: z.object({
    electricityKwh: z.number().min(0).max(20000),
    naturalGasTherms: z.number().min(0).max(5000),
    renewablePercentage: z.number().min(0).max(100)
  }),
  food: z.object({
    meatMeals: z.number().int().min(0).max(200),
    vegetarianMeals: z.number().int().min(0).max(200),
    veganMeals: z.number().int().min(0).max(200),
    localFoodMeals: z.number().int().min(0).max(200)
  }),
  shopping: z.object({
    clothingItems: z.number().int().min(0).max(200),
    electronicsSpendUsd: z.number().min(0).max(100000),
    deliveryOrders: z.number().int().min(0).max(300)
  }),
  waste: z.object({
    landfillBags: z.number().int().min(0).max(500),
    recyclingBags: z.number().int().min(0).max(500)
  })
});

export const footprintBreakdownSchema = z.object({
  transportation: z.number().min(0),
  homeEnergy: z.number().min(0),
  food: z.number().min(0),
  shopping: z.number().min(0),
  waste: z.number().min(0),
  totalKgCo2e: z.number().min(0)
});

export const habitCreateSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(500).optional(),
  category: activityCategorySchema,
  frequency: habitFrequencySchema,
  targetCount: z.number().int().min(1).max(31),
  estimatedImpactKgCo2e: z.number().min(0).max(10000)
});

export const habitLogSchema = z.object({
  completedAt: z.iso.datetime(),
  count: z.number().int().min(1).max(20),
  notes: z.string().trim().max(300).optional()
});

export const goalCreateSchema = z.object({
  title: z.string().trim().min(3).max(120),
  category: activityCategorySchema.optional(),
  targetKgCo2e: z.number().min(1).max(100000),
  baselineKgCo2e: z.number().min(0).max(100000),
  startDate: z.iso.datetime(),
  targetDate: z.iso.datetime()
});

export const recommendationSchema = z.object({
  title: z.string().trim().min(3).max(120),
  rationale: z.string().trim().min(10).max(700),
  actionSteps: z.array(z.string().trim().min(3).max(160)).min(1).max(5),
  category: activityCategorySchema,
  expectedImpactKgCo2e: z.number().min(0).max(10000),
  difficulty: z.enum(["easy", "medium", "hard"])
});

export const userPreferencesSchema = z.object({
  householdSize: z.number().int().min(1).max(20).default(1),
  monthlyCarbonBudgetKg: z.number().min(100).max(5000).default(750),
  primaryMotivation: z
    .enum(["saveMoney", "health", "climate", "community", "learning"])
    .default("climate"),
  city: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional()
});

export type ActivityCategory = z.infer<typeof activityCategorySchema>;
export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
export type FootprintBreakdown = z.infer<typeof footprintBreakdownSchema>;
export type HabitCreateInput = z.infer<typeof habitCreateSchema>;
export type HabitLogInput = z.infer<typeof habitLogSchema>;
export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type ReportPeriod = z.infer<typeof reportPeriodSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
