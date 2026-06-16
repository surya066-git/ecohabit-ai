import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";

const goalSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    category: {
      type: String,
      enum: ["transportation", "homeEnergy", "food", "shopping", "waste"]
    },
    targetKgCo2e: { type: Number, required: true, min: 1 },
    baselineKgCo2e: { type: Number, required: true, min: 0 },
    currentKgCo2e: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "missed"],
      default: "active",
      index: true
    },
    startDate: { type: Date, required: true },
    targetDate: { type: Date, required: true }
  },
  { timestamps: true }
);

goalSchema.index({ firebaseUid: 1, status: 1 });

export type GoalDocument = InferSchemaType<typeof goalSchema>;

export const Goal =
  (mongoose.models.Goal as Model<GoalDocument> | undefined) ??
  model<GoalDocument>("Goal", goalSchema);
