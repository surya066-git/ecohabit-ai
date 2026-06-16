import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const userPreferencesSchema = new Schema(
  {
    householdSize: { type: Number, default: 1, min: 1, max: 20 },
    monthlyCarbonBudgetKg: { type: Number, default: 750, min: 100, max: 5000 },
    primaryMotivation: {
      type: String,
      enum: ["saveMoney", "health", "climate", "community", "learning"],
      default: "climate"
    },
    city: { type: String, trim: true, maxlength: 120 },
    country: { type: String, trim: true, maxlength: 120 }
  },
  { _id: false }
);

const userProfileSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    displayName: { type: String, trim: true, maxlength: 120 },
    photoUrl: { type: String, trim: true },
    ecoScore: { type: Number, default: 50, min: 0, max: 100 },
    longestStreakDays: { type: Number, default: 0, min: 0 },
    preferences: { type: userPreferencesSchema, default: () => ({}) },
    onboardingCompletedAt: { type: Date }
  },
  { timestamps: true }
);

export type UserProfileDocument = InferSchemaType<typeof userProfileSchema>;

export const UserProfile =
  (models.UserProfile as Model<UserProfileDocument> | undefined) ??
  model<UserProfileDocument>("UserProfile", userProfileSchema);
