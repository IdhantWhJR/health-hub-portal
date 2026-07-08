# Running Health Hub Portal locally

## 1. Prerequisites
- Node.js 24 (`node -v`)
- pnpm (`npm i -g pnpm`)
- Postgres 16, either:
  - installed locally, **or**
  - a Supabase project (free tier is fine)

## 2. Install dependencies
```bash
pnpm install
```

## 3. Set up your database connection
```bash
cp .env.example .env
```
Edit `.env` and set `DATABASE_URL`. See comments in that file for local Postgres
vs Supabase. If using Supabase, use the **Session pooler** string, and make sure
any `@ : / # ?` in your password is percent-encoded (or just avoid symbols in
the password entirely — much less error-prone).

## 4. Push the schema
```bash
pnpm --filter @workspace/db run push
```

## 5. Seed sample data (if you want starter data)
```bash
cd lib/db
node seed.mjs
cd ../..
```

## 6. Run the API server
```bash
pnpm --filter @workspace/api-server run dev
```
Server runs on **http://localhost:5000**.

## 7. Typecheck / build (optional sanity check)
```bash
pnpm run typecheck
pnpm run build
```

## Troubleshooting
- **"DATABASE_URL, ensure the database is provisioned"** → `.env` isn't set or wasn't loaded.
- **Connection refused / timeout to Supabase** → you're on the direct (IPv6) URL; switch to the Session pooler URL.
- **Password parsing errors** → percent-encode special characters, see `.env.example`.
- If you previously pasted a real DB password into a chat (Replit AI, ChatGPT, etc.), **reset that password** in the Supabase dashboard now — treat it as compromised.
