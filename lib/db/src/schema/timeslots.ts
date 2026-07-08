import { pgTable, text, serial, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const timeslotsTable = pgTable("timeslots", {
  id: serial("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  label: text("label"),
  isBooked: boolean("is_booked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTimeslotSchema = createInsertSchema(timeslotsTable).omit({ id: true, createdAt: true });
export type InsertTimeslot = z.infer<typeof insertTimeslotSchema>;
export type Timeslot = typeof timeslotsTable.$inferSelect;
