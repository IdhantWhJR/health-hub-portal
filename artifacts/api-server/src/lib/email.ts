import nodemailer from "nodemailer";
import { logger } from "./logger";

export interface BookingEmailData {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  bookingType: "slot" | "direct";
  slotDate?: string | null;
  slotStartTime?: string | null;
  slotEndTime?: string | null;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendBookingNotification(data: BookingEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    logger.warn("ADMIN_EMAIL not set — skipping email notification.");
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    logger.warn(
      "SMTP credentials not fully configured (SMTP_HOST, SMTP_USER, SMTP_PASS required) — skipping email.",
    );
    return;
  }

  const isSlot = data.bookingType === "slot";
  const subject = isSlot
    ? `New Consultation Booking — ${data.name}`
    : `New Direct Contact Request — ${data.name}`;

  const slotLine = isSlot && data.slotDate
    ? `\nTime Slot: ${data.slotDate}  ${data.slotStartTime} – ${data.slotEndTime}`
    : "";

  const text = `
New ${isSlot ? "consultation booking" : "direct contact request"} received on your website.

Name:    ${data.name}
Email:   ${data.email}
Phone:   ${data.phone || "—"}
Type:    ${isSlot ? "Slot booking" : "Direct contact"}${slotLine}

Message:
${data.message || "(no message provided)"}

—
Health Reset website
  `.trim();

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject,
      text,
    });
    logger.info({ to: adminEmail, subject }, "Booking notification email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send booking notification email");
  }
}
