import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "ecohabit-api",
    timestamp: new Date().toISOString()
  });
});
