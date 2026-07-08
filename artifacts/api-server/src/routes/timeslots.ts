import { Router, type IRouter } from "express";
import { eq, gte, desc, asc } from "drizzle-orm";
import { db, timeslotsTable } from "@workspace/db";
import {
  CreateTimeslotBody,
  UpdateTimeslotParams,
  UpdateTimeslotBody,
  DeleteTimeslotParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/admin-auth";

const router: IRouter = Router();

// GET /timeslots — available upcoming slots (public)
router.get("/timeslots", async (req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  const rows = await db
    .select()
    .from(timeslotsTable)
    .where(eq(timeslotsTable.isBooked, false))
    .orderBy(asc(timeslotsTable.date), asc(timeslotsTable.startTime));

  // Filter out past dates
  const upcoming = rows.filter((r) => r.date >= today);
  res.json(upcoming);
});

// POST /timeslots — create (admin only)
router.post("/timeslots", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateTimeslotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [slot] = await db
    .insert(timeslotsTable)
    .values({
      date: String(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      label: data.label ?? null,
      isBooked: false,
    })
    .returning();

  res.status(201).json(slot);
});

// GET /timeslots/all — all slots including booked (admin only)
router.get("/timeslots/all", requireAdmin, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(timeslotsTable)
    .orderBy(asc(timeslotsTable.date), asc(timeslotsTable.startTime));

  res.json(rows);
});

// PATCH /timeslots/:id — update (admin only)
router.patch("/timeslots/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateTimeslotParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTimeslotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const updateFields: Record<string, unknown> = {};
  if (data.date !== undefined) updateFields.date = String(data.date);
  if (data.startTime !== undefined) updateFields.startTime = data.startTime;
  if (data.endTime !== undefined) updateFields.endTime = data.endTime;
  if (data.label !== undefined) updateFields.label = data.label;
  if (data.isBooked !== undefined) updateFields.isBooked = data.isBooked;

  const [slot] = await db
    .update(timeslotsTable)
    .set(updateFields)
    .where(eq(timeslotsTable.id, params.data.id))
    .returning();

  if (!slot) {
    res.status(404).json({ error: "Time slot not found" });
    return;
  }

  res.json(slot);
});

// DELETE /timeslots/:id — delete (admin only)
router.delete("/timeslots/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteTimeslotParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  // Prevent deleting booked slots
  const [slot] = await db
    .select()
    .from(timeslotsTable)
    .where(eq(timeslotsTable.id, params.data.id));

  if (!slot) {
    res.status(404).json({ error: "Time slot not found" });
    return;
  }

  if (slot.isBooked) {
    res.status(400).json({ error: "Cannot delete a booked time slot." });
    return;
  }

  await db.delete(timeslotsTable).where(eq(timeslotsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
