"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BadgeShelf } from "@/components/dashboard/badge-shelf";
import { CarbonTrendChart } from "@/components/dashboard/carbon-trend-chart";
import { CategoryBreakdownChart } from "@/components/dashboard/category-breakdown-chart";
import { EcoScoreCard } from "@/components/dashboard/eco-score-card";
import { GoalProgress } from "@/components/dashboard/goal-progress";
import { HabitSummary } from "@/components/dashboard/habit-summary";
import { RecommendationPanel } from "@/components/dashboard/recommendation-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { demoDashboard, type DashboardData } from "@/lib/demo-data";
import { useAuth } from "@/providers/auth-provider";

export function DashboardClient() {
  const { getIdToken } = useAuth();
  const [data, setData] = useState<DashboardData>(demoDashboard);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const dashboard = await apiFetch<DashboardData>("/analytics/dashboard", token);
      setData(dashboard);
      setLive(true);
    } catch {
      setData(demoDashboard);
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard();
  }, [loadDashboard]);

  async function handleGenerateRecommendations() {
    setGenerating(true);
    try {
      const token = await getIdToken();
      const response = await apiFetch<Pick<DashboardData, "recommendations">>(
        "/recommendations/generate",
        token,
        { method: "POST" }
      );
      setData((current) => ({ ...current, recommendations: response.recommendations }));
      setLive(true);
    } catch {
      setLive(false);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Awareness, tracking, and behavior change</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Dashboard Analytics</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Your Eco Score connects footprint data, habit consistency, goal progress, and AI guidance.
          </p>
        </div>
        <Button disabled={loading} onClick={() => void loadDashboard()} variant="outline">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {!live ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col gap-2 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Showing demo data until Firebase, MongoDB Atlas, and the API are connected.</span>
            <span className="font-medium text-foreground">The interface remains fully reviewable.</span>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4" aria-label="Dashboard summary">
        {[
          ["Active habits", data.summary.activeHabits],
          ["Active goals", data.summary.activeGoals],
          ["Avoided CO2e", `${data.summary.totalAvoidedKgCo2e} kg`],
          ["Longest streak", `${data.profile.longestStreakDays} days`]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]" aria-label="Score and trends">
        <EcoScoreCard
          avoidedKgCo2e={data.latestReport?.avoidedKgCo2e ?? 0}
          budgetKg={data.profile.preferences.monthlyCarbonBudgetKg}
          score={data.summary.ecoScore}
          totalKgCo2e={data.latestReport?.totalKgCo2e ?? 0}
        />
        <CarbonTrendChart points={data.footprints} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="Insights and plans">
        <CategoryBreakdownChart breakdown={data.latestReport.categoryBreakdown} />
        <GoalProgress goals={data.goals} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]" aria-label="Habits and recommendations">
        <HabitSummary habits={data.habits} />
        <RecommendationPanel
          generating={generating}
          onGenerate={() => void handleGenerateRecommendations()}
          recommendations={data.recommendations}
        />
      </section>

      <BadgeShelf achievements={data.achievements} />
    </div>
  );
}
