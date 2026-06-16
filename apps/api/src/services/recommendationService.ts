import { GoogleGenAI } from "@google/genai";
import { recommendationSchema, type Recommendation } from "@ecohabit/shared";
import { z } from "zod";
import { env } from "../config/env";
import { FootprintEntry } from "../models/FootprintEntry";
import { Habit } from "../models/Habit";
import { Recommendation as RecommendationModel } from "../models/Recommendation";
import { Report } from "../models/Report";
import { UserProfile } from "../models/UserProfile";
import { ApiError } from "../utils/apiError";

const recommendationsSchema = z.array(recommendationSchema).min(3).max(5);

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");
  if (firstBracket >= 0 && lastBracket > firstBracket) {
    return text.slice(firstBracket, lastBracket + 1);
  }

  return text;
}

function fallbackRecommendations(): Recommendation[] {
  return [
    {
      title: "Replace one car trip with transit",
      rationale: "Transportation reductions are easy to verify and compound quickly when they become a repeated habit.",
      actionSteps: ["Choose one predictable trip this week", "Compare transit or shared ride options", "Log the avoided car kilometers"],
      category: "transportation",
      expectedImpactKgCo2e: 2.8,
      difficulty: "easy"
    },
    {
      title: "Plan two plant-forward meals",
      rationale: "Food changes are frequent, visible, and give users a reliable path to build confidence.",
      actionSteps: ["Pick two meals before shopping", "Use beans, lentils, tofu, or seasonal vegetables", "Track both meals as habit completions"],
      category: "food",
      expectedImpactKgCo2e: 3.8,
      difficulty: "easy"
    },
    {
      title: "Set an energy baseline",
      rationale: "Users reduce more consistently when they can see a home-energy baseline and compare each month against it.",
      actionSteps: ["Add your latest utility usage", "Choose one appliance schedule change", "Review the monthly report trend"],
      category: "homeEnergy",
      expectedImpactKgCo2e: 5,
      difficulty: "medium"
    }
  ];
}

export async function generateRecommendations(firebaseUid: string) {
  const [profile, latestReport, latestFootprints, habits] = await Promise.all([
    UserProfile.findOne({ firebaseUid }).lean(),
    Report.findOne({ firebaseUid }).sort({ periodStart: -1 }).lean(),
    FootprintEntry.find({ firebaseUid }).sort({ periodStart: -1 }).limit(3).lean(),
    Habit.find({ firebaseUid, archivedAt: { $exists: false } }).limit(10).lean()
  ]);

  let recommendations: Recommendation[];

  if (!env.GEMINI_API_KEY) {
    recommendations = fallbackRecommendations();
  } else {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const prompt = {
      role: "EcoHabit AI coach",
      instruction:
        "Return only JSON. Produce 3 to 5 personalized carbon-reduction recommendations. Favor behavior change, tracking, and habit formation. Do not shame the user.",
      userProfile: profile?.preferences,
      latestReport,
      latestFootprints: latestFootprints.map((entry) => entry.breakdown),
      activeHabits: habits.map((habit) => ({
        title: habit.title,
        category: habit.category,
        frequency: habit.frequency,
        targetCount: habit.targetCount
      })),
      schema:
        "Array<{ title, rationale, actionSteps: string[], category: transportation|homeEnergy|food|shopping|waste, expectedImpactKgCo2e: number, difficulty: easy|medium|hard }>"
    };

    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: JSON.stringify(prompt),
      config: {
        responseMimeType: "application/json",
        temperature: 0.5
      }
    });

    const text = response.text;
    if (!text) {
      throw new ApiError(502, "Gemini returned an empty recommendation response.", "AI_EMPTY_RESPONSE");
    }

    recommendations = recommendationsSchema.parse(JSON.parse(extractJson(text)));
  }

  await RecommendationModel.insertMany(
    recommendations.map((recommendation) => ({
      ...recommendation,
      firebaseUid,
      source: env.GEMINI_API_KEY ? "ai" : "system"
    }))
  );

  return RecommendationModel.find({ firebaseUid }).sort({ createdAt: -1 }).limit(10).lean();
}
