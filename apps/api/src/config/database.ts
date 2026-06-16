import mongoose from "mongoose";
import { env } from "./env";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not set. Starting MongoMemoryServer for local testing.");
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { autoIndex: true });
    return;
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production"
  });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}
