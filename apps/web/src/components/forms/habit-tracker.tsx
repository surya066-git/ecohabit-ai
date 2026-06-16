"use client";

import { CheckCircle2, Loader2, Plus, Repeat2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { HABIT_LIBRARY, type ActivityCategory } from "@ecohabit/shared";
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
import { Select } from "@/components/ui/select";
import { apiFetch } from "@/lib/api-client";
import { demoDashboard } from "@/lib/demo-data";
import { useAuth } from "@/providers/auth-provider";

type Habit = (typeof demoDashboard.habits)[number] & {
  description?: string;
};

const initialForm = {
  title: "Car-free commute",
  category: "transportation" as ActivityCategory,
  frequency: "daily" as "daily" | "weekly",
  targetCount: 3,
  estimatedImpactKgCo2e: 2.8
};

export function HabitTracker() {
  const { getIdToken } = useAuth();
  const [habits, setHabits] = useState<Habit[]>(demoDashboard.habits);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadHabits() {
      try {
        const token = await getIdToken();
        const response = await apiFetch<{ habits: Habit[] }>("/habits", token);
        setHabits(response.habits);
      } catch {
        setHabits(demoDashboard.habits);
      }
    }

    void loadHabits();
  }, [getIdToken]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = await getIdToken();
      const response = await apiFetch<{ habit: Habit }>("/habits", token, {
        method: "POST",
        body: JSON.stringify(form)
      });
      setHabits((current) => [response.habit, ...current]);
      setMessage("Habit created.");
    } catch {
      setHabits((current) => [
        {
          _id: crypto.randomUUID(),
          ...form,
          logs: []
        },
        ...current
      ]);
      setMessage("Habit added locally. Connect the API to persist it.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLog(habit: Habit) {
    try {
      const token = await getIdToken();
      const response = await apiFetch<{ habit: Habit }>(`/habits/${habit._id}/logs`, token, {
        method: "POST",
        body: JSON.stringify({
          completedAt: new Date().toISOString(),
          count: 1
        })
      });
      setHabits((current) => current.map((item) => (item._id === habit._id ? response.habit : item)));
    } catch {
      setHabits((current) =>
        current.map((item) =>
          item._id === habit._id
            ? {
                ...item,
                logs: [...item.logs, { completedAt: new Date().toISOString() }]
              }
            : item
        )
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Habit Tracking</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Build Repeatable Actions</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track the behaviors that reduce emissions and make reports more actionable.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create Habit</CardTitle>
            <CardDescription>Start from a recommended behavior or enter your own.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-2">
              {HABIT_LIBRARY.map((template) => (
                <Button
                  className="justify-start"
                  key={template.title}
                  onClick={() =>
                    setForm({
                      title: template.title,
                      category: template.category,
                      frequency: template.frequency,
                      targetCount: template.frequency === "daily" ? 3 : 1,
                      estimatedImpactKgCo2e: template.impactKgCo2e
                    })
                  }
                  type="button"
                  variant="outline"
                >
                  <Repeat2 className="h-4 w-4" aria-hidden="true" />
                  {template.title}
                </Button>
              ))}
            </div>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label htmlFor="habit-title">Title</Label>
                <Input
                  id="habit-title"
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                  value={form.title}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="habit-category">Category</Label>
                  <Select
                    id="habit-category"
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
                <div className="space-y-2">
                  <Label htmlFor="habit-frequency">Frequency</Label>
                  <Select
                    id="habit-frequency"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        frequency: event.target.value as "daily" | "weekly"
                      }))
                    }
                    value={form.frequency}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="habit-target">Target count</Label>
                  <Input
                    id="habit-target"
                    min={1}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, targetCount: Number(event.target.value) }))
                    }
                    type="number"
                    value={form.targetCount}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="habit-impact">Impact kg CO2e</Label>
                  <Input
                    id="habit-impact"
                    min={0}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, estimatedImpactKgCo2e: Number(event.target.value) }))
                    }
                    step="any"
                    type="number"
                    value={form.estimatedImpactKgCo2e}
                  />
                </div>
              </div>
              <Button disabled={loading} type="submit">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Add habit
              </Button>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Habits</CardTitle>
            <CardDescription>Log completions to build streaks, avoided emissions, and badges.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {habits.map((habit) => (
              <article className="rounded-md border bg-muted/40 p-4" key={habit._id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{habit.title}</h3>
                      <Badge variant="secondary">{habit.category}</Badge>
                      <Badge variant="outline">{habit.frequency}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {habit.logs.length} completions, {habit.estimatedImpactKgCo2e} kg CO2e avoided each
                    </p>
                  </div>
                  <Button onClick={() => void handleLog(habit)} type="button">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Log today
                  </Button>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
