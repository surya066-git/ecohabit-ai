import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const achievementSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, index: true },
    key: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tier: { type: String, required: true, enum: ["bronze", "silver", "gold", "platinum"] },
    unlockedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

achievementSchema.index({ firebaseUid: 1, key: 1 }, { unique: true });

export type AchievementDocument = InferSchemaType<typeof achievementSchema>;

export const Achievement =
  (models.Achievement as Model<AchievementDocument> | undefined) ??
  model<AchievementDocument>("Achievement", achievementSchema);
