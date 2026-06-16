import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";

const recommendationSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    rationale: { type: String, required: true, trim: true, maxlength: 700 },
    actionSteps: { type: [String], required: true, default: [] },
    category: {
      type: String,
      required: true,
      enum: ["transportation", "homeEnergy", "food", "shopping", "waste"]
    },
    expectedImpactKgCo2e: { type: Number, required: true, min: 0 },
    difficulty: { type: String, required: true, enum: ["easy", "medium", "hard"] },
    source: { type: String, enum: ["ai", "system"], default: "ai" },
    acceptedAt: { type: Date },
    dismissedAt: { type: Date }
  },
  { timestamps: true }
);

recommendationSchema.index({ firebaseUid: 1, createdAt: -1 });

export type RecommendationDocument = InferSchemaType<typeof recommendationSchema>;

export const Recommendation =
  (mongoose.models.Recommendation as Model<RecommendationDocument> | undefined) ??
  model<RecommendationDocument>("Recommendation", recommendationSchema);
