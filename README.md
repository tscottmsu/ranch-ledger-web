# Ranch Ledger

Ranch Ledger is a ranch-scoped operations platform. The current foundation provides secure authentication, ranch onboarding, and administrator setup for employees, horses, trails, and activity types.

## Local setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add the project URL and publishable key from **Project Settings → API**.
3. Apply the migrations in order with the Supabase CLI or SQL Editor:
   - `supabase/migrations/20260620000000_sprint_1_foundation.sql`
   - `supabase/migrations/20260620010000_sprint_2_ranch_setup.sql`
4. In **Authentication → URL Configuration**, set the local Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` as an allowed redirect URL. Add the equivalent production callback before deployment.
5. Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run build
```

## Authentication notes

Email/password authentication must be enabled in Supabase. When email confirmation is enabled, new administrators receive Supabase's confirmation email and return through `/auth/callback` before completing ranch setup.

The root `proxy.ts` refreshes SSR auth cookies. Protected dashboard routes also verify the user in their server layout; proxy checks are not treated as the sole authorization boundary. Database access is protected with Row Level Security.
