# ♻️ Rebuy — One person's spare, another's need.

A free reuse marketplace: post the things you no longer need, and someone nearby gives them a second life.

**Live app:** https://reuseworldmarket.lovable.app
**Built for:** Hackathon 2026
**Stack:** React 19 + TanStack Start · Tailwind CSS · Supabase (Postgres, Auth, Storage)

> Waste kadhu, Avakasam.

---

## 👀 For judges — start here

Three flows carry the whole product. Open the live app and follow these:

| Flow | What to do in the app | Code to look at |
| --- | --- | --- |
| **Post an item** | Sign up → Post an item → photo + description + location + category | `src/routes/post.tsx` |
| **Browse items** | Browse → filter by category → open an item | `src/routes/browse.tsx` |
| **My listings** | My Posts / My Requests (needs login) | `src/routes/my-posts.tsx`, `src/routes/my-requests.tsx` |

Everything is free — no payments, no shipping, no middlemen.

---

## 🧱 How the app is built (frontend + backend)

```
┌───────────────────────────────┐        ┌────────────────────────────────┐
│  FRONTEND (browser)           │        │  BACKEND (Supabase)            │
│  React 19 + TanStack Start    │  HTTPS │  Auth    → email/password +    │
│  Tailwind CSS + shadcn/ui     │ ─────► │            Google sign-in      │
│  Pages in src/routes/         │        │  Postgres→ table: items        │
│  UI in src/components/        │ ◄───── │  Storage → bucket: item-photos │
└───────────────────────────────┘        └────────────────────────────────┘
        no custom server needed — Supabase is the backend
```

### Frontend

| File / folder | Role |
| --- | --- |
| `src/routes/index.tsx` | Home page — hero, featured item, stats, categories, how it works |
| `src/routes/browse.tsx` | Item grid + category filters, signed photo URLs |
| `src/routes/post.tsx` | Post an item form — photo upload + insert into `items` |
| `src/routes/my-posts.tsx` | The items the logged-in user posted |
| `src/routes/my-requests.tsx` | Requests the user made on other people's items |
| `src/routes/login.tsx`, `signup.tsx`, `forgot-password.tsx`, `reset-password.tsx` | Auth screens (email/password + Google) |
| `src/routes/__root.tsx` | App shell — header, footer, fonts, meta tags |
| `src/components/` | Reusable UI (shadcn/ui based): buttons, inputs, header, toasts |
| `src/styles.css` | The design system — colour tokens, fonts, hero gradient, utilities |
| `src/integrations/supabase/client.ts` | The single Supabase client used by the browser |

**Design system:** navy `#0B1F5C` + gold `#C9A227` on a light background, gold hairlines instead of heavy shadows. All colours and fonts live as tokens in `src/styles.css`, so the whole app re-themes from one file.

### Backend (Supabase)

No custom API server — the frontend talks to Supabase directly, and Row Level Security enforces the rules in the database.

**Database — table `items`** (`drizzle/migrations/0000_create_items.sql`)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `user_id` | uuid | who posted it |
| `name` | text | 1–100 characters |
| `description` | text | up to 1000 characters |
| `location` | text | area / city |
| `category` | enum | `furniture`, `clothes`, `electronics`, `books` |
| `photo_url` | text | path inside the `item-photos` bucket |
| `created_at` | timestamptz | default `now()` |

**Security (RLS policies)**
- Anyone (even logged out) can **read** items — that is what makes the browse page public.
- A logged-in user can **insert / update / delete only their own** items (`auth.uid() = user_id`).

**Storage — bucket `item-photos`**
- Public read of photos; uploads only into the user's own folder (`<user-id>/<file>`).
- Photos are shown through short-lived **signed URLs** (1 hour), generated in `browse.tsx`.

**Auth**
- Supabase Auth with email + password and Google sign-in.
- Password reset and recovery flows are wired in `forgot-password.tsx` / `reset-password.tsx`.

**Data flow — posting an item**
1. User picks a photo → uploaded to `item-photos/<user-id>/<file>`.
2. A row is inserted into `items` with `user_id`, name, description, location, category and the photo path.
3. The browse page selects the rows and converts photo paths into signed URLs for display.

---

## ✨ Features

- Post an item with photo, description, location and category
- Browse everything in a photo grid, filter by category
- Sign up / login (email + password, or Google), password reset
- My Posts — manage what you have listed
- My Requests — track items you asked for
- Fully responsive, mobile-first layout

## 🛠 Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19, TanStack Start (file-based routing, SSR), Tailwind CSS v4, shadcn/ui + Radix |
| Backend | Supabase — Postgres, Auth, Storage, Row Level Security |
| Data layer | Drizzle schema + SQL migrations (`drizzle/migrations`) |
| Tooling | Vite, TypeScript, Vitest, ESLint, Prettier |
| Built with | [Lovable](https://lovable.dev) — this repo is two-way synced with the Lovable project |

## 📁 Repository map

```
src/                 the app (pages, components, styles, supabase client)
public/              static assets — logo, favicon, robots.txt
supabase/            Supabase project config
drizzle/             database schema + SQL migrations (the real schema lives here)
package.json         dependencies and scripts
README.md            you are here
```

## ▶️ Run locally

```bash
git clone https://github.com/shaikasim77/reuseworldmarket.git
cd reuseworldmarket
npm install
npm run dev
```

Create a `.env` in the project root (never commit it):

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_PROJECT_ID=<project-id>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

## 🗺 Roadmap

- [ ] In-app chat between giver and receiver
- [ ] Search by keyword and distance
- [ ] Item condition and photo gallery (multiple photos)
- [ ] Notifications when someone requests your item
- [ ] Profile pages with trust badges

## 👥 Team

Built by **Shaik Asim** for the hackathon. Feedback welcome — open an issue.

---

Made with 💚 so that fewer usable things end up in a landfill.
