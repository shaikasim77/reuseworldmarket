# Frontend

The app is a React 19 single-page app built with **TanStack Start** (file-based routing + SSR), styled with **Tailwind CSS v4** and **shadcn/ui** components. It runs entirely in the browser and talks to Supabase directly.

## Pages (`src/routes/`)

| File | Route | What it does |
| --- | --- | --- |
| `index.tsx` | `/` | Home — hero, featured item, stats, categories, how it works, CTA |
| `browse.tsx` | `/browse` | All items in a photo grid, category filters, signed photo URLs |
| `post.tsx` | `/post` | Post an item — photo upload + insert into the `items` table |
| `my-posts.tsx` | `/my-posts` | Items posted by the logged-in user |
| `my-requests.tsx` | `/my-requests` | Items the user has requested |
| `login.tsx` | `/login` | Email + password login (also Google sign-in) |
| `signup.tsx` | `/signup` | Create an account |
| `forgot-password.tsx` | `/forgot-password` | Send a reset link |
| `reset-password.tsx` | `/reset-password` | Set a new password from the reset link |
| `__root.tsx` | — | App shell: header, footer, fonts, meta tags, error pages |

## Components (`src/components/`)

- `SiteHeader.tsx` — logo, navigation, login/sign-up or log-out
- `GoogleButton.tsx` — Google sign-in button
- `ui/` — shadcn/ui primitives (button, input, label, badge, sonner toasts, …)

## Design system (`src/styles.css`)

All colours and fonts are defined once as CSS custom properties and mapped to Tailwind utilities, so the whole app re-themes from this one file.

| Token | Value | Used for |
| --- | --- | --- |
| `--primary` | navy `#0B1F5C` | headings, primary buttons, hero panel |
| `--gold` | `#C9A227` | accents, chips, hairlines, highlight words |
| `--background` | warm light `#FBFAF7` | page background |
| `--foreground` | near-black navy | body text |
| `--font-display` | Playfair Display | headings |
| `--font-sans` | Inter | body text |

House rules: 1px gold hairlines instead of heavy shadows, 16px card radius, roman numerals (I, II, III) for step numbers.

## How data is fetched

- One Supabase client: `src/integrations/supabase/client.ts`.
- Reads/writes happen in the page components with the Supabase JS SDK.
- Lists use `@tanstack/react-query` (`useQuery`) for caching and loading states.
- Item photos are stored as paths; the browse page converts them to 1-hour signed URLs.

```ts
// browse.tsx — read items, then resolve photo paths to signed URLs
const { data } = await supabase.from("items").select("*").order("created_at", { ascending: false });
const { data: signed } = await supabase.storage.from("item-photos").createSignedUrls(paths, 3600);
```

```ts
// post.tsx — upload the photo, then insert the row
await supabase.storage.from("item-photos").upload(`${user.id}/${file.name}`, file);
await supabase.from("items").insert({ ...values, user_id: user.id, photo_url: path });
```

## Conventions

- Mobile-first: every page works from 360px up.
- Accessibility: labels on all inputs, focus rings from the theme, semantic headings.
- No secrets in the frontend — only the publishable Supabase key is used.
