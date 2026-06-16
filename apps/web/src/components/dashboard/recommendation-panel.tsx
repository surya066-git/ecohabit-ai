"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecommendationItem = {
  _id: string;
  title: string;
  rationale: string;
  actionSteps: string[];
  category: string;
  expectedImpactKgCo2e: number;
  difficulty: string;
};

type RecommendationPanelProps = {
  recommendations: RecommendationItem[];
  onGenerate?: () => void;
  generating?: boolean;
};

export function RecommendationPanel({
  recommendations,
  onGenerate,
  generating = false
}: RecommendationPanelProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>Personalized AI Actions</CardTitle>
          <p className="text-sm text-muted-foreground">Recommendations shaped by trends, habits, and goals</p>
        </div>
        <Button disabled={generating} onClick={onGenerate} size="sm" type="button" variant="outline">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Generate
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <article className="rounded-md border bg-muted/40 p-4" key={recommendation._id}>
            <div className="flex items-start gap-3">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-primary">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">{recommendation.title}</h3>
                  <Badge variant="secondary">{recommendation.category}</Badge>
                  <Badge variant="outline">{recommendation.difficulty}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{recommendation.rationale}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {recommendation.actionSteps.map((step) => (
                    <li className="flex gap-2" key={step}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
