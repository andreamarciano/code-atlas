import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../types/auth";

const jwtSecret = process.env.JWT_SECRET!;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // "Bearer token"

  if (!token) {
    res.status(401).json({ error: "Token missing or invalid" });
    return;
  }

  // token provided
  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    // verified
    (req as AuthRequest).userId = Number((decoded as JwtPayload).id);
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is invalid or expired" });
    return;
  }
}
