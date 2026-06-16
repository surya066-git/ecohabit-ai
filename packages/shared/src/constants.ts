export const ACTIVITY_CATEGORIES = [
  "transportation",
  "homeEnergy",
  "food",
  "shopping",
  "waste"
] as const;

export const REPORT_PERIODS = ["weekly", "monthly"] as const;

export const GOAL_STATUSES = ["active", "completed", "paused", "missed"] as const;

export const HABIT_FREQUENCIES = ["daily", "weekly"] as const;

export const ACHIEVEMENT_TIERS = ["bronze", "silver", "gold", "platinum"] as const;

export const DEFAULT_MONTHLY_BUDGET_KG = 750;

export const EMISSION_FACTORS = {
  carKm: {
    gasoline: 0.192,
    diesel: 0.171,
    hybrid: 0.118,
    electric: 0.053
  },
  transitKm: 0.041,
  trainKm: 0.035,
  bikeOrWalkKm: 0,
  flightShortHaul: 255,
  flightLongHaul: 1100,
  electricityKwh: 0.386,
  naturalGasTherm: 5.3,
  meatMeal: 3.3,
  vegetarianMeal: 1.4,
  veganMeal: 0.9,
  localFoodMealReduction: 0.18,
  clothingItem: 18,
  electronicsSpendUsd: 0.35,
  deliveryOrder: 3.2,
  landfillBag: 8.6,
  recyclingBagReduction: 2.1
} as const;

export const HABIT_LIBRARY = [
  {
    title: "Car-free commute",
    category: "transportation",
    impactKgCo2e: 2.8,
    frequency: "daily"
  },
  {
    title: "Plant-forward meal",
    category: "food",
    impactKgCo2e: 1.9,
    frequency: "daily"
  },
  {
    title: "Cold wash laundry",
    category: "homeEnergy",
    impactKgCo2e: 0.6,
    frequency: "weekly"
  },
  {
    title: "Repair before replacing",
    category: "shopping",
    impactKgCo2e: 4.5,
    frequency: "weekly"
  },
  {
    title: "Plan a low-waste shop",
    category: "waste",
    impactKgCo2e: 2.2,
    frequency: "weekly"
  }
] as const;
