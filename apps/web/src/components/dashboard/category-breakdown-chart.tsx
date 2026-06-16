"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CategoryBreakdown = {
  transportation: number;
  homeEnergy: number;
  food: number;
  shopping: number;
  waste: number;
};

const labels: Record<keyof CategoryBreakdown, string> = {
  transportation: "Transport",
  homeEnergy: "Home",
  food: "Food",
  shopping: "Shopping",
  waste: "Waste"
};

export function CategoryBreakdownChart({ breakdown }: { breakdown: CategoryBreakdown }) {
  const data = Object.entries(labels).map(([key, label]) => ({
    label,
    kg: breakdown[key as keyof CategoryBreakdown]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Where reduction efforts can have the most leverage</p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
              <CartesianGrid stroke="#d7decf" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} />
              <YAxis tickLine={false} />
              <Tooltip formatter={(value) => [`${value} kg CO2e`, "Emissions"]} />
              <Bar dataKey="kg" fill="#1f7a4d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
