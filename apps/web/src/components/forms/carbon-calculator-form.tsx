"use client";

import { Calculator, Loader2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  calculateFootprintBreakdown,
  type CalculatorInput,
  type FootprintBreakdown
} from "@ecohabit/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { apiFetch } from "@/lib/api-client";
import { formatKg } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

type NumberPath =
  | "transportation.carKm"
  | "transportation.transitKm"
  | "transportation.trainKm"
  | "transportation.bikeOrWalkKm"
  | "transportation.shortFlights"
  | "transportation.longFlights"
  | "homeEnergy.electricityKwh"
  | "homeEnergy.naturalGasTherms"
  | "homeEnergy.renewablePercentage"
  | "food.meatMeals"
  | "food.vegetarianMeals"
  | "food.veganMeals"
  | "food.localFoodMeals"
  | "shopping.clothingItems"
  | "shopping.electronicsSpendUsd"
  | "shopping.deliveryOrders"
  | "waste.landfillBags"
  | "waste.recyclingBags";

const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(today.getDate() - 6);

const initialInput: CalculatorInput = {
  periodStart: weekAgo.toISOString(),
  periodEnd: today.toISOString(),
  transportation: {
    carKm: 120,
    fuelType: "gasoline",
    transitKm: 20,
    trainKm: 0,
    bikeOrWalkKm: 8,
    shortFlights: 0,
    longFlights: 0
  },
  homeEnergy: {
    electricityKwh: 85,
    naturalGasTherms: 6,
    renewablePercentage: 15
  },
  food: {
    meatMeals: 5,
    vegetarianMeals: 7,
    veganMeals: 2,
    localFoodMeals: 4
  },
  shopping: {
    clothingItems: 1,
    electronicsSpendUsd: 0,
    deliveryOrders: 2
  },
  waste: {
    landfillBags: 2,
    recyclingBags: 2
  }
};

function dateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

export function CarbonCalculatorForm() {
  const { getIdToken } = useAuth();
  const [input, setInput] = useState<CalculatorInput>(initialInput);
  const [result, setResult] = useState<FootprintBreakdown>(() => calculateFootprintBreakdown(initialInput));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const categories = useMemo(
    () => [
      ["Transportation", result.transportation],
      ["Home energy", result.homeEnergy],
      ["Food", result.food],
      ["Shopping", result.shopping],
      ["Waste", result.waste]
    ],
    [result]
  );

  function updateNumber(path: NumberPath, value: string) {
    const [section, key] = path.split(".") as [keyof CalculatorInput, string];
    setInput((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, number>),
        [key]: Number(value)
      }
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const localBreakdown = calculateFootprintBreakdown(input);
    setResult(localBreakdown);

    try {
      const token = await getIdToken();
      const response = await apiFetch<{ breakdown: FootprintBreakdown }>(
        "/footprints/calculate",
        token,
        {
          method: "POST",
          body: JSON.stringify(input)
        }
      );
      setResult(response.breakdown);
      setMessage("Footprint entry saved and ready for reports.");
    } catch {
      setMessage("Preview calculated locally. Connect the API to save this entry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Carbon Footprint Calculator</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Log a Period</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Capture a week or month of behavior so reports, goals, scores, and AI guidance can adapt.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Footprint Inputs</CardTitle>
            <CardDescription>Use realistic estimates; patterns matter more than perfect precision.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Period start">
                  <Input
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        periodStart: new Date(`${event.target.value}T00:00:00`).toISOString()
                      }))
                    }
                    type="date"
                    value={dateInputValue(input.periodStart)}
                  />
                </Field>
                <Field label="Period end">
                  <Input
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        periodEnd: new Date(`${event.target.value}T23:59:59`).toISOString()
                      }))
                    }
                    type="date"
                    value={dateInputValue(input.periodEnd)}
                  />
                </Field>
              </div>

              <Section title="Transportation">
                <NumberField label="Car kilometers" onChange={(value) => updateNumber("transportation.carKm", value)} value={input.transportation.carKm} />
                <Field label="Fuel type">
                  <Select
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        transportation: {
                          ...current.transportation,
                          fuelType: event.target.value as CalculatorInput["transportation"]["fuelType"]
                        }
                      }))
                    }
                    value={input.transportation.fuelType}
                  >
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </Select>
                </Field>
                <NumberField label="Transit kilometers" onChange={(value) => updateNumber("transportation.transitKm", value)} value={input.transportation.transitKm} />
                <NumberField label="Train kilometers" onChange={(value) => updateNumber("transportation.trainKm", value)} value={input.transportation.trainKm} />
                <NumberField label="Bike/walk kilometers" onChange={(value) => updateNumber("transportation.bikeOrWalkKm", value)} value={input.transportation.bikeOrWalkKm} />
                <NumberField label="Short flights" onChange={(value) => updateNumber("transportation.shortFlights", value)} value={input.transportation.shortFlights} />
                <NumberField label="Long flights" onChange={(value) => updateNumber("transportation.longFlights", value)} value={input.transportation.longFlights} />
              </Section>

              <Section title="Home energy">
                <NumberField label="Electricity kWh" onChange={(value) => updateNumber("homeEnergy.electricityKwh", value)} value={input.homeEnergy.electricityKwh} />
                <NumberField label="Natural gas therms" onChange={(value) => updateNumber("homeEnergy.naturalGasTherms", value)} value={input.homeEnergy.naturalGasTherms} />
                <NumberField label="Renewable percentage" onChange={(value) => updateNumber("homeEnergy.renewablePercentage", value)} value={input.homeEnergy.renewablePercentage} />
              </Section>

              <Section title="Food, shopping, and waste">
                <NumberField label="Meat meals" onChange={(value) => updateNumber("food.meatMeals", value)} value={input.food.meatMeals} />
                <NumberField label="Vegetarian meals" onChange={(value) => updateNumber("food.vegetarianMeals", value)} value={input.food.vegetarianMeals} />
                <NumberField label="Vegan meals" onChange={(value) => updateNumber("food.veganMeals", value)} value={input.food.veganMeals} />
                <NumberField label="Local food meals" onChange={(value) => updateNumber("food.localFoodMeals", value)} value={input.food.localFoodMeals} />
                <NumberField label="Clothing items" onChange={(value) => updateNumber("shopping.clothingItems", value)} value={input.shopping.clothingItems} />
                <NumberField label="Electronics spend USD" onChange={(value) => updateNumber("shopping.electronicsSpendUsd", value)} value={input.shopping.electronicsSpendUsd} />
                <NumberField label="Delivery orders" onChange={(value) => updateNumber("shopping.deliveryOrders", value)} value={input.shopping.deliveryOrders} />
                <NumberField label="Landfill bags" onChange={(value) => updateNumber("waste.landfillBags", value)} value={input.waste.landfillBags} />
                <NumberField label="Recycling bags" onChange={(value) => updateNumber("waste.recyclingBags", value)} value={input.waste.recyclingBags} />
              </Section>

              <Button disabled={submitting} type="submit">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Calculator className="h-4 w-4" aria-hidden="true" />}
                Calculate and save
              </Button>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Category impact for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/50 p-5">
              <p className="text-sm text-muted-foreground">Total footprint</p>
              <p className="mt-2 text-4xl font-semibold">{formatKg(result.totalKgCo2e)}</p>
            </div>
            <div className="space-y-3">
              {categories.map(([label, value]) => (
                <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm" key={label}>
                  <span>{label}</span>
                  <span className="font-medium">{formatKg(Number(value))}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div id={id}>{children}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <Input
        min={0}
        onChange={(event) => onChange(event.target.value)}
        step="any"
        type="number"
        value={value}
      />
    </Field>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-lg border p-4">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </fieldset>
  );
}
