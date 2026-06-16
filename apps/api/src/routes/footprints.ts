import { Router } from "express";
import { calculateFootprintBreakdown, calculatorInputSchema } from "@ecohabit/shared";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { FootprintEntry } from "../models/FootprintEntry";
import { asyncHandler } from "../utils/asyncHandler";
import { getAuth } from "../services/profileService";

export const footprintsRouter = Router();

footprintsRouter.use(requireAuth);

footprintsRouter.get(
  "/",
  validate({
    query: z.object({
      limit: z.coerce.number().int().min(1).max(100).default(20)
    })
  }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const limit = Number(req.query.limit);
    const entries = await FootprintEntry.find({ firebaseUid: auth.uid })
      .sort({ periodStart: -1 })
      .limit(limit)
      .lean();

    res.json({ entries });
  })
);

footprintsRouter.post(
  "/calculate",
  validate({ body: calculatorInputSchema }),
  asyncHandler(async (req, res) => {
    const auth = getAuth(req);
    const breakdown = calculateFootprintBreakdown(req.body);
    const entry = await FootprintEntry.create({
      firebaseUid: auth.uid,
      periodStart: new Date(req.body.periodStart),
      periodEnd: new Date(req.body.periodEnd),
      input: req.body,
      breakdown
    });

    res.status(201).json({ entry, breakdown });
  })
);
