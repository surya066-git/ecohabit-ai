import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";

const footprintEntrySchema = new Schema(
  {
    firebaseUid: { type: String, required: true, index: true },
    periodStart: { type: Date, required: true, index: true },
    periodEnd: { type: Date, required: true, index: true },
    input: { type: Schema.Types.Mixed, required: true },
    breakdown: {
      transportation: { type: Number, required: true, min: 0 },
      homeEnergy: { type: Number, required: true, min: 0 },
      food: { type: Number, required: true, min: 0 },
      shopping: { type: Number, required: true, min: 0 },
      waste: { type: Number, required: true, min: 0 },
      totalKgCo2e: { type: Number, required: true, min: 0 }
    }
  },
  { timestamps: true }
);

footprintEntrySchema.index({ firebaseUid: 1, periodStart: -1 });

export type FootprintEntryDocument = InferSchemaType<typeof footprintEntrySchema>;

export const FootprintEntry =
  (mongoose.models.FootprintEntry as Model<FootprintEntryDocument> | undefined) ??
  model<FootprintEntryDocument>("FootprintEntry", footprintEntrySchema);
