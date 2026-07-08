import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, bookingsTable, timeslotsTable } from "@workspace/db";
import {
  CreateBookingBody,
  DeleteBookingParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/admin-auth";
import { sendBookingNotification } from "../lib/email";

const router: IRouter = Router();

// GET /bookings — all bookings (admin only)
router.get("/bookings", requireAdmin, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(bookingsTable)
    .orderBy(desc(bookingsTable.createdAt));

  res.json(rows);
});

// POST /bookings — create a booking (public)
router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  // For slot bookings, verify the slot exists and is available
  let slotDate: string | null = null;
  let slotStartTime: string | null = null;
  let slotEndTime: string | null = null;

  if (data.bookingType === "slot") {
    if (!data.timeslotId) {
      res.status(400).json({ error: "timeslotId is required for slot bookings." });
      return;
    }

    const [slot] = await db
      .select()
      .from(timeslotsTable)
      .where(eq(timeslotsTable.id, data.timeslotId));

    if (!slot) {
      res.status(404).json({ error: "Time slot not found." });
      return;
    }

    if (slot.isBooked) {
      res.status(400).json({ error: "This time slot has already been booked." });
      return;
    }

    // Mark the slot as booked
    await db
      .update(timeslotsTable)
      .set({ isBooked: true })
      .where(eq(timeslotsTable.id, data.timeslotId));

    slotDate = slot.date;
    slotStartTime = slot.startTime;
    slotEndTime = slot.endTime;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      timeslotId: data.timeslotId ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message ?? null,
      bookingType: data.bookingType,
    })
    .returning();

  // Send email notification (non-blocking)
  sendBookingNotification({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message ?? null,
    bookingType: data.bookingType as "slot" | "direct",
    slotDate,
    slotStartTime,
    slotEndTime,
  }).catch(() => {}); // swallow — already logged inside

  res.status(201).json(booking);
});

// DELETE /bookings/:id — delete/cancel (admin only)
router.delete("/bookings/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  // If it was a slot booking, free the slot back up
  if (booking.timeslotId) {
    await db
      .update(timeslotsTable)
      .set({ isBooked: false })
      .where(eq(timeslotsTable.id, booking.timeslotId));
  }

  await db.delete(bookingsTable).where(eq(bookingsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
