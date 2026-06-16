"use client";

import { CheckCircle2, Repeat2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HabitItem = {
  _id: string;
  title: string;
  category: string;
  frequency: string;
  targetCount: number;
  estimatedImpactKgCo2e: number;
  logs: Array<{ completedAt: string }>;
};

export function HabitSummary({ habits }: { habits: HabitItem[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>Habit Momentum</CardTitle>
          <p className="text-sm text-muted-foreground">Small repeated actions with tracked impact</p>
        </div>
        <Repeat2 className="h-5 w-5 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.map((habit) => (
          <article className="flex items-start justify-between gap-3 rounded-md border bg-muted/40 p-4" key={habit._id}>
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="text-sm font-semibold">{habit.title}</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {habit.logs.length} completions, {habit.estimatedImpactKgCo2e} kg CO2e each
              </p>
            </div>
            <Badge variant="outline">{habit.frequency}</Badge>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
