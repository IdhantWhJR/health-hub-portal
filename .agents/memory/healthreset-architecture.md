---
name: Health Reset site architecture
description: Key decisions and conventions for Dr. Shweta Tripathi's health reset website (artifacts/healthreset + artifacts/api-server).
---

## Admin auth
- Admin logs in with `ADMIN_PASSWORD` env var → backend returns `ADMIN_SECRET` (falls back to `ADMIN_PASSWORD` if only one is set) as the bearer token.
- Frontend stores token in `localStorage` as `admin_token`; `setAuthTokenGetter(() => localStorage.getItem('admin_token'))` is called once in App.tsx so all generated hooks auto-attach it.
- Middleware: `artifacts/api-server/src/middlewares/admin-auth.ts`.
**Why:** Simple, no JWT library, suitable for a single-admin personal site.

## Email notifications
- `artifacts/api-server/src/lib/email.ts` — nodemailer, SMTP config from `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`; sends to `ADMIN_EMAIL`.
- Email send is fire-and-forget (non-blocking) in the booking route.
- If SMTP vars are missing, email is skipped with a warn log (app doesn't fail).
**Why:** Email is optional/config-dependent; should never break bookings.

## Access control on detail endpoints
- `/recipes/:id` and `/blogs/:id` return 404 for unpublished items to non-admin callers (same inline admin check as list endpoints).
**Why:** Code review flagged broken access control for unpublished drafts.

## DB schema extras
- `recipes` and `blogs` tables have `updatedAt` (not in OpenAPI spec); extra fields are returned in JSON but ignored by generated clients — acceptable drift for a v1.
- `bookingType` is plain text in DB; enum enforced at Zod/API layer.

## Design language
- Fonts: Fraunces (display/serif) + Inter Tight (sans). Custom CSS vars: cream, bone, sand, clay, terracotta, sage, olive, ink.
- All "Dt." replaced with "Dr." everywhere.
- Original homepage JSX reference kept at `artifacts/healthreset/src/_original_homepage_reference.tsx`.

## Seed data
- 3 recipes, 2 blog posts, 6 time slots seeded directly via SQL (not via API).

## Required secrets to set
- `ADMIN_PASSWORD` — admin login password (not yet set; user declined during build)
- `ADMIN_EMAIL` — already set to shwetavtripathi@gmail.com
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — for email notifications (optional; app works without them)
