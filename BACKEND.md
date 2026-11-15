# Backend

The backend is **Supabase**: Postgres for data, Supabase Auth for accounts, and Supabase Storage for item photos. There is no custom API server — the browser talks to Supabase over HTTPS and **Row Level Security (RLS)** enforces the rules inside the database.

```
Browser ──► Supabase Auth      (sessions, email/password, Google)
        ──► Postgres           table: items        (RLS policies)
        ──► Storage            bucket: item-photos (path = <user-id>/<file>)
```

## Database schema

Source of truth: `drizzle/migrations/0000_create_items.sql`.

**Enum** `item_category`: `furniture`, `clothes`, `electronics`, `books`

**Table `public.items`**

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key, `gen_random_uuid()` |
| `user_id` | `uuid` | not null — the poster |
| `name` | `text` | not null, 1–100 chars |
| `description` | `text` | default `''`, max 1000 chars |
| `location` | `text` | not null, 1–100 chars |
| `category` | `item_category` | not null |
| `photo_url` | `text` | nullable — path inside the storage bucket |
| `created_at` | `timestamptz` | default `now()` |

## Security model (RLS)

| Policy | Applies to | Rule |
| --- | --- | --- |
| Anyone can view items | `anon`, `authenticated` | `SELECT` allowed for everyone — the browse page is public |
| Users insert own items | `authenticated` | `INSERT` only when `auth.uid() = user_id` |
| Users update own items | `authenticated` | `UPDATE` only on rows they own |
| Users delete own items | `authenticated` | `DELETE` only on rows they own |

The service-role key is **never** shipped to the browser; only the publishable key is used client-side.

## Photo storage

**Bucket:** `item-photos`

| Policy | Rule |
| --- | --- |
| Public read item photos | `SELECT` allowed for the bucket |
| Users upload own item photos | `INSERT` only when the first path segment equals `auth.uid()` |

Flow: the browser uploads to `item-photos/<user-id>/<filename>`, saves that **path** in `items.photo_url`, and the browse page converts paths into short-lived **signed URLs** (1 hour) for display.

## Auth

- Email + password sign-up and login.
- Google sign-in (`GoogleButton` + Supabase OAuth provider).
- Password reset / recovery (`forgot-password` → email link → `reset-password`).
- Session handling lives in `src/integrations/supabase/auth-*.ts`.

## Data flows

**Post an item**
1. `upload()` the photo to `item-photos/<user-id>/<file>`.
2. `insert()` a row into `items` with `user_id`, name, description, location, category and the photo path.
3. On browse, `select()` the rows and `createSignedUrls()` for the photos.

**Browse**
1. `select * from items order by created_at desc`.
2. Collect non-null `photo_url` values → `createSignedUrls(paths, 3600)`.
3. Render the grid with the resolved URLs; filter by `category` client-side.

**Delete own item**
1. RLS allows the delete only when `auth.uid() = user_id`.
2. The row disappears from every listing.

## Limits and notes

- The category list is an enum in the database — adding a category means a migration (`ALTER TYPE`), not just a UI change.
- Database contents and uploaded photos live in Supabase, not in this repository.
- Environment values (project URL + publishable key) are provided at runtime through `.env`; secrets are never committed.
