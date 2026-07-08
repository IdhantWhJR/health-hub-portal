import { Router, type IRouter } from "express";
import { eq, count, and } from "drizzle-orm";
import { db, recipesTable, blogsTable, timeslotsTable, bookingsTable } from "@workspace/db";
import { AdminLoginBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/admin-auth";

const router: IRouter = Router();

// POST /admin/login
router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    res.status(503).json({ error: "Admin authentication not configured." });
    return;
  }

  if (parsed.data.password !== (process.env.ADMIN_PASSWORD || secret)) {
    res.status(401).json({ error: "Invalid password." });
    return;
  }

  // The token is ADMIN_SECRET (separate from the password if both are set)
  res.json({ token: secret });
});

// GET /admin/stats — dashboard stats (admin only)
router.get("/admin/stats", requireAdmin, async (req, res): Promise<void> => {
  const [[totalRecipes], [totalBlogs], [totalTimeslots], [totalBookings]] =
    await Promise.all([
      db.select({ count: count() }).from(recipesTable),
      db.select({ count: count() }).from(blogsTable),
      db.select({ count: count() }).from(timeslotsTable),
      db.select({ count: count() }).from(bookingsTable),
    ]);

  const [[publishedRecipes], [publishedBlogs], [availableTimeslots], [slotBookings], [directContacts]] =
    await Promise.all([
      db.select({ count: count() }).from(recipesTable).where(eq(recipesTable.published, true)),
      db.select({ count: count() }).from(blogsTable).where(eq(blogsTable.published, true)),
      db.select({ count: count() }).from(timeslotsTable).where(eq(timeslotsTable.isBooked, false)),
      db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.bookingType, "slot")),
      db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.bookingType, "direct")),
    ]);

  res.json({
    totalRecipes: Number(totalRecipes.count),
    publishedRecipes: Number(publishedRecipes.count),
    totalBlogs: Number(totalBlogs.count),
    publishedBlogs: Number(publishedBlogs.count),
    totalTimeslots: Number(totalTimeslots.count),
    availableTimeslots: Number(availableTimeslots.count),
    totalBookings: Number(totalBookings.count),
    slotBookings: Number(slotBookings.count),
    directContacts: Number(directContacts.count),
  });
});

export default router;
