import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to start the API server.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production"
  });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
