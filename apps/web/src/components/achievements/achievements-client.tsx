"use client";

import { Award, Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { demoDashboard } from "@/lib/demo-data";
import { useAuth } from "@/providers/auth-provider";

type Achievement = (typeof demoDashboard.achievements)[number];

const tierIcon = {
  bronze: Medal,
  silver: Medal,
  gold: Trophy,
  platinum: Award
};

export function AchievementsClient() {
  const { getIdToken } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>(demoDashboard.achievements);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const token = await getIdToken();
        const response = await apiFetch<{ achievements: Achievement[] }>("/achievements", token);
        setAchievements(response.achievements.length ? response.achievements : demoDashboard.achievements);
      } catch {
        setAchievements(demoDashboard.achievements);
      }
    }

    void loadAchievements();
  }, [getIdToken]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Eco Score System</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Achievement Badges</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Badges reward repeated behavior, reductions, streaks, and acting on recommendations.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const Icon = tierIcon[achievement.tier as keyof typeof tierIcon] ?? Award;

          return (
            <Card key={achievement.key}>
              <CardHeader>
                <span className="grid h-11 w-11 place-items-center rounded-md bg-accent text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="warning">{achievement.tier}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
