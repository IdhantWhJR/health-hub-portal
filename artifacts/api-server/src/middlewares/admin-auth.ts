import type { Request, Response, NextFunction } from "express";

/**
 * Middleware that checks for a valid admin bearer token.
 * Token is compared against ADMIN_SECRET env var.
 * If ADMIN_SECRET is not set, falls back to ADMIN_PASSWORD.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;

  if (!secret) {
    res.status(503).json({ error: "Admin authentication not configured. Set ADMIN_SECRET." });
    return;
  }

  const auth = req.headers["authorization"] as string | undefined;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header." });
    return;
  }

  const token = auth.slice(7);
  if (token !== secret) {
    res.status(401).json({ error: "Invalid token." });
    return;
  }

  next();
}
