"use client";

import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AchievementItem = {
  key: string;
  title: string;
  tier: string;
  description: string;
};

export function BadgeShelf({ achievements }: { achievements: AchievementItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Badges</CardTitle>
        <p className="text-sm text-muted-foreground">Gamified milestones that reward consistency</p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <article className="rounded-md border bg-muted/40 p-4" key={achievement.key}>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-primary">
                <Award className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{achievement.title}</h3>
                <Badge className="mt-1" variant="warning">
                  {achievement.tier}
                </Badge>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{achievement.description}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
