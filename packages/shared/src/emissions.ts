import { EMISSION_FACTORS } from "./constants";
import type { CalculatorInput, FootprintBreakdown } from "./schemas";

const roundKg = (value: number) => Math.round(value * 10) / 10;

export function calculateFootprintBreakdown(input: CalculatorInput): FootprintBreakdown {
  const transportation =
    input.transportation.carKm * EMISSION_FACTORS.carKm[input.transportation.fuelType] +
    input.transportation.transitKm * EMISSION_FACTORS.transitKm +
    input.transportation.trainKm * EMISSION_FACTORS.trainKm +
    input.transportation.bikeOrWalkKm * EMISSION_FACTORS.bikeOrWalkKm +
    input.transportation.shortFlights * EMISSION_FACTORS.flightShortHaul +
    input.transportation.longFlights * EMISSION_FACTORS.flightLongHaul;

  const renewableOffset = 1 - input.homeEnergy.renewablePercentage / 100;
  const homeEnergy =
    input.homeEnergy.electricityKwh * EMISSION_FACTORS.electricityKwh * renewableOffset +
    input.homeEnergy.naturalGasTherms * EMISSION_FACTORS.naturalGasTherm;

  const grossFood =
    input.food.meatMeals * EMISSION_FACTORS.meatMeal +
    input.food.vegetarianMeals * EMISSION_FACTORS.vegetarianMeal +
    input.food.veganMeals * EMISSION_FACTORS.veganMeal;
  const localReduction =
    Math.min(input.food.localFoodMeals, input.food.meatMeals + input.food.vegetarianMeals + input.food.veganMeals) *
    EMISSION_FACTORS.localFoodMealReduction;
  const food = Math.max(grossFood - localReduction, 0);

  const shopping =
    input.shopping.clothingItems * EMISSION_FACTORS.clothingItem +
    input.shopping.electronicsSpendUsd * EMISSION_FACTORS.electronicsSpendUsd +
    input.shopping.deliveryOrders * EMISSION_FACTORS.deliveryOrder;

  const waste = Math.max(
    input.waste.landfillBags * EMISSION_FACTORS.landfillBag -
      input.waste.recyclingBags * EMISSION_FACTORS.recyclingBagReduction,
    0
  );

  const totalKgCo2e = transportation + homeEnergy + food + shopping + waste;

  return {
    transportation: roundKg(transportation),
    homeEnergy: roundKg(homeEnergy),
    food: roundKg(food),
    shopping: roundKg(shopping),
    waste: roundKg(waste),
    totalKgCo2e: roundKg(totalKgCo2e)
  };
}

export function getLargestCategory(breakdown: FootprintBreakdown) {
  const categories = Object.entries(breakdown).filter(([key]) => key !== "totalKgCo2e");
  return categories.sort((a, b) => b[1] - a[1])[0]?.[0] ?? "transportation";
}
