"use client";

import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatKg } from "@/lib/utils";

type EcoScoreCardProps = {
  score: number;
  totalKgCo2e: number;
  avoidedKgCo2e: number;
  budgetKg: number;
};

export function EcoScoreCard({ score, totalKgCo2e, avoidedKgCo2e, budgetKg }: EcoScoreCardProps) {
  const budgetUsed = Math.min(100, (totalKgCo2e / budgetKg) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Eco Score</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Behavior, trend, goals, and footprint combined</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-md bg-accent text-primary">
          <Gauge className="h-5 w-5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-end gap-3">
          <span className="text-6xl font-semibold leading-none">{score}</span>
          <span className="pb-2 text-sm font-medium text-muted-foreground">/ 100</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Monthly budget used</span>
            <span className="font-medium">{Math.round(budgetUsed)}%</span>
          </div>
          <Progress label="Monthly carbon budget used" value={budgetUsed} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Current period</p>
            <p className="mt-1 text-lg font-semibold">{formatKg(totalKgCo2e)}</p>
          </div>
          <div className="rounded-md border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Avoided by habits</p>
            <p className="mt-1 text-lg font-semibold">{formatKg(avoidedKgCo2e)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
