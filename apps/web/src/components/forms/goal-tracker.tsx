"use client";

import { Loader2, Plus, Target } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { type ActivityCategory } from "@ecohabit/shared";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { apiFetch } from "@/lib/api-client";
import { demoDashboard } from "@/lib/demo-data";
import { formatKg } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

type Goal = (typeof demoDashboard.goals)[number];

const initialForm = {
  title: "Reduce monthly footprint",
  category: "transportation" as ActivityCategory,
  baselineKgCo2e: 500,
  targetKgCo2e: 420,
  startDate: new Date().toISOString().slice(0, 10),
  targetDate: new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10)
};

export function GoalTracker() {
  const { getIdToken } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(demoDashboard.goals);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadGoals() {
      try {
        const token = await getIdToken();
        const response = await apiFetch<{ goals: Goal[] }>("/goals", token);
        setGoals(response.goals);
      } catch {
        setGoals(demoDashboard.goals);
      }
    }

    void loadGoals();
  }, [getIdToken]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...form,
      startDate: new Date(`${form.startDate}T00:00:00`).toISOString(),
      targetDate: new Date(`${form.targetDate}T23:59:59`).toISOString()
    };

    try {
      const token = await getIdToken();
      const response = await apiFetch<{ goal: Goal }>("/goals", token, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setGoals((current) => [response.goal, ...current]);
      setMessage("Goal created.");
    } catch {
      setGoals((current) => [
        {
          _id: crypto.randomUUID(),
          ...payload,
          currentKgCo2e: payload.baselineKgCo2e,
          status: "active"
        },
        ...current
      ]);
      setMessage("Goal added locally. Connect the API to persist it.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Goal Tracking</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Set Reduction Targets</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Anchor behavior change to measurable, time-bound carbon goals.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create Goal</CardTitle>
            <CardDescription>Use your latest report as the baseline when available.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label htmlFor="goal-title">Title</Label>
                <Input
                  id="goal-title"
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                  value={form.title}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-category">Category</Label>
                <Select
                  id="goal-category"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value as ActivityCategory }))
                  }
                  value={form.category}
                >
                  <option value="transportation">Transportation</option>
                  <option value="homeEnergy">Home energy</option>
                  <option value="food">Food</option>
                  <option value="shopping">Shopping</option>
                  <option value="waste">Waste</option>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="goal-baseline">Baseline kg CO2e</Label>
                  <Input
                    id="goal-baseline"
                    min={0}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, baselineKgCo2e: Number(event.target.value) }))
                    }
                    type="number"
                    value={form.baselineKgCo2e}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-target">Target kg CO2e</Label>
                  <Input
                    id="goal-target"
                    min={1}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, targetKgCo2e: Number(event.target.value) }))
                    }
                    type="number"
                    value={form.targetKgCo2e}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-start">Start date</Label>
                  <Input
                    id="goal-start"
                    onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                    type="date"
                    value={form.startDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-date">Target date</Label>
                  <Input
                    id="goal-date"
                    onChange={(event) => setForm((current) => ({ ...current, targetDate: event.target.value }))}
                    type="date"
                    value={form.targetDate}
                  />
                </div>
              </div>
              <Button disabled={loading} type="submit">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Create goal
              </Button>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Goals</CardTitle>
            <CardDescription>Progress is based on baseline, current value, and target.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {goals.map((goal) => {
              const needed = Math.max(goal.baselineKgCo2e - goal.targetKgCo2e, 1);
              const reduced = Math.max(goal.baselineKgCo2e - goal.currentKgCo2e, 0);
              const progress = Math.min(100, (reduced / needed) * 100);

              return (
                <article className="space-y-3 rounded-md border bg-muted/40 p-4" key={goal._id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                        <h3 className="font-semibold">{goal.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatKg(goal.currentKgCo2e)} current, {formatKg(goal.targetKgCo2e)} target
                      </p>
                    </div>
                    <Badge variant={goal.status === "active" ? "success" : "secondary"}>{goal.status}</Badge>
                  </div>
                  <Progress label={`${goal.title} progress`} value={progress} />
                </article>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
