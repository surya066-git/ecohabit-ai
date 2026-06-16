import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const reportSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, index: true },
    period: { type: String, required: true, enum: ["weekly", "monthly"] },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    totalKgCo2e: { type: Number, required: true, min: 0 },
    avoidedKgCo2e: { type: Number, required: true, min: 0 },
    categoryBreakdown: {
      transportation: { type: Number, default: 0 },
      homeEnergy: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      waste: { type: Number, default: 0 }
    },
    insight: { type: String, required: true, trim: true, maxlength: 1000 },
    ecoScore: { type: Number, required: true, min: 0, max: 100 }
  },
  { timestamps: true }
);

reportSchema.index({ firebaseUid: 1, period: 1, periodStart: -1 });

export type ReportDocument = InferSchemaType<typeof reportSchema>;

export const Report =
  (models.Report as Model<ReportDocument> | undefined) ??
  model<ReportDocument>("Report", reportSchema);
