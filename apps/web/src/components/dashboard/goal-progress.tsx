"use client";

import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatKg } from "@/lib/utils";

type GoalItem = {
  _id: string;
  title: string;
  baselineKgCo2e: number;
  currentKgCo2e: number;
  targetKgCo2e: number;
  status: string;
};

export function GoalProgress({ goals }: { goals: GoalItem[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>Goal Tracking</CardTitle>
          <p className="text-sm text-muted-foreground">Reduction targets and live progress</p>
        </div>
        <Target className="h-5 w-5 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length ? (
          goals.map((goal) => {
            const reductionNeeded = Math.max(goal.baselineKgCo2e - goal.targetKgCo2e, 1);
            const reduced = Math.max(goal.baselineKgCo2e - goal.currentKgCo2e, 0);
            const progress = Math.min(100, (reduced / reductionNeeded) * 100);

            return (
              <article className="space-y-3 rounded-md border bg-muted/40 p-4" key={goal._id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{goal.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatKg(goal.currentKgCo2e)} now, target {formatKg(goal.targetKgCo2e)}
                    </p>
                  </div>
                  <Badge variant={goal.status === "active" ? "success" : "secondary"}>{goal.status}</Badge>
                </div>
                <Progress label={`${goal.title} progress`} value={progress} />
              </article>
            );
          })
        ) : (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Create a goal to turn reports into a measurable reduction target.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
