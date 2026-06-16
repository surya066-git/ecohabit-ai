import type { NextFunction, Request, Response } from "express";
import { getFirebaseAdminAuth } from "../config/firebaseAdmin";
import { ApiError } from "../utils/apiError";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    return next(new ApiError(401, "Missing Firebase ID token.", "AUTH_TOKEN_MISSING"));
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token, true);
    req.auth = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    };
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired Firebase ID token.", "AUTH_TOKEN_INVALID"));
  }
}
