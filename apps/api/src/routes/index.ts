import { Router } from "express";
import { achievementsRouter } from "./achievements";
import { analyticsRouter } from "./analytics";
import { footprintsRouter } from "./footprints";
import { goalsRouter } from "./goals";
import { habitsRouter } from "./habits";
import { healthRouter } from "./health";
import { meRouter } from "./me";
import { recommendationsRouter } from "./recommendations";
import { reportsRouter } from "./reports";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/me", meRouter);
apiRouter.use("/footprints", footprintsRouter);
apiRouter.use("/habits", habitsRouter);
apiRouter.use("/goals", goalsRouter);
apiRouter.use("/recommendations", recommendationsRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/achievements", achievementsRouter);
apiRouter.use("/analytics", analyticsRouter);
