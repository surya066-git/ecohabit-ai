import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";

const habitLogSchema = new Schema(
  {
    completedAt: { type: Date, required: true },
    count: { type: Number, required: true, min: 1, max: 20 },
    impactKgCo2e: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true, maxlength: 300 }
  },
  { timestamps: true }
);

const habitSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500 },
    category: {
      type: String,
      required: true,
      enum: ["transportation", "homeEnergy", "food", "shopping", "waste"]
    },
    frequency: { type: String, required: true, enum: ["daily", "weekly"] },
    targetCount: { type: Number, required: true, min: 1, max: 31 },
    estimatedImpactKgCo2e: { type: Number, required: true, min: 0 },
    archivedAt: { type: Date },
    logs: { type: [habitLogSchema], default: [] }
  },
  { timestamps: true }
);

habitSchema.index({ firebaseUid: 1, archivedAt: 1 });

export type HabitDocument = InferSchemaType<typeof habitSchema>;

export const Habit =
  (mongoose.models.Habit as Model<HabitDocument> | undefined) ??
  model<HabitDocument>("Habit", habitSchema);
