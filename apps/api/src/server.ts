import { createServer } from "node:http";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { createApp } from "./app";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = createServer(app);

  server.listen(env.PORT, () => {
    console.log(`EcoHabit API listening on http://localhost:${env.PORT}${env.API_BASE_PATH}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received. Closing API server.`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

void bootstrap().catch((error) => {
  console.error("Failed to start EcoHabit API.", error);
  process.exit(1);
});
