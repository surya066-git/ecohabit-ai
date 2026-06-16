import { Router } from "express";
import { reportPeriodSchema } from "@ecohabit/shared";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { Report } from "../models/Report";
import { getAuth } from "../services/profileService";
import { generateReport } from "../services/reportService";
import { asyncHandler } from "../utils/asyncHandler";

export const reportsRouter = Router();

const periodQuerySchema = z.object({
  period: reportPeriodSchema.default("weekly")
});

reportsRouter.use(requireAuth);

reportsRouter.get(
  "/",
  validate({ query: periodQuerySchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const period = reportPeriodSchema.parse(req.query.period ?? "weekly");
    const reports = await Report.find({ firebaseUid: auth.uid, period })
      .sort({ periodStart: -1 })
      .limit(12)
      .lean();

    res.json({ reports });
  })
);

reportsRouter.post(
  "/generate",
  validate({ query: periodQuerySchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const period = reportPeriodSchema.parse(req.query.period ?? "weekly");
    const report = await generateReport(auth.uid, period);
    res.status(201).json({ report });
  })
);
