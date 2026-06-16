"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type TrendPoint = {
  periodStart: string;
  breakdown: {
    totalKgCo2e: number;
  };
};

export function CarbonTrendChart({ points }: { points: TrendPoint[] }) {
  const data = points
    .slice()
    .reverse()
    .map((point) => ({
      date: formatDate(point.periodStart),
      kg: point.breakdown.totalKgCo2e
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footprint Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Recent tracked periods</p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
              <CartesianGrid stroke="#d7decf" strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} />
              <YAxis tickLine={false} />
              <Tooltip formatter={(value) => [`${value} kg CO2e`, "Footprint"]} />
              <Line
                activeDot={{ r: 6 }}
                dataKey="kg"
                dot={{ r: 4 }}
                stroke="#1f7a4d"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
