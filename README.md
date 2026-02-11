# Soignant — Medication reminder

A simple app to help patients remember medications and let caretakers add and track them. One account can be used by both patient and caretaker.

## Features

- **Sign up / Sign in** with Supabase Auth (email + password)
- **Add medications** (name, dosage) — caretaker or same user
- **View medication list** on the Medications page
- **Mark as taken today** on the Today (dashboard) page

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Supabase (auth + database)
- React Hook Form + Zod
- React Query
- React Router

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).

2. **Run the schema** in Supabase → SQL Editor: copy and run `supabase-schema.sql`.

3. **Environment variables**  
   Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` — your project URL
   - `VITE_SUPABASE_ANON_KEY` — your anon/public key  
   (Supabase → Project Settings → API)

4. **Install and run**  
   ```bash
   npm install
   npm run dev
   ```

5. Open the app (e.g. `http://localhost:5173`), sign up, then add medications and mark them as taken on the Today page.

## Optional: Email caretaker on missed dose

To notify the caretaker when a dose is missed, you can add a Supabase Edge Function or a cron job that:

1. Runs daily (e.g. at a fixed time).
2. For each user, finds medications that have no `medication_logs` row for today.
3. Sends an email to a stored caretaker email (e.g. in a `profiles` or `caretaker_email` column) using a provider like Resend or SendGrid.

This repo does not include that implementation; the DB and UI are ready to support it.
