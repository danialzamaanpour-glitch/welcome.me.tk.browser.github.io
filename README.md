# Danial Chap — دانیال چپ

A dark, cinematic Persian (RTL) site for a photo-printing lab: a branded opening scene,
a scroll-scrubbed film sequence, then the real business page (services, showcase, about,
order form, footer).

## Stack

| Part | Tech |
| --- | --- |
| `web/` | Vite 6 + React 18 + TypeScript, hand-written CSS in `web/src/styles` |
| `api/` | Express 4 + `pg`, order intake API |
| `db` | PostgreSQL 16 (`print_orders`) |

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d
```

- Site: <http://localhost:3000>
- API: <http://localhost:8000/api/health> (the browser normally uses `/api` through the dev server proxy)
- `migrate` is a one-shot service that creates the schema; `api` starts after it finishes.

Without Docker: `cd web && npm install && npm run dev` (the form needs the API running on
`http://localhost:8080`, or point `API_PROXY_TARGET` at it).

## The scroll sequence

The uploaded film is decoded ahead of time into **121 WebP frames** (24 fps × 5.04 s) by
`scripts/build-media.sh`. A `<canvas>` paints the frame that matches the scroll position, so
scrolling down advances the camera move and scrolling up reverses it — the video never plays on
a clock. Frames load progressively behind a progress indicator; the clean still is shown until
the first frames are ready.

- Desktop frames: `web/public/frames/desktop/` (1176 px)
- Mobile frames: `web/public/frames/mobile/` (640 px, used below 768 px)
- Replacing the film? Drop the new file at `assets/cinematic-source.mp4`, run
  `./scripts/build-media.sh`, and update `FRAME_COUNT` in `web/src/components/CinematicScroll.tsx`
  if the frame count changes.

With `prefers-reduced-motion: reduce`, the pinned sequence is replaced by a static still with
the same three passages, and all reveal/parallax motion is disabled.

## Updating business details

Everything the owner still needs to supply lives in **`web/src/config/site.ts`**:

```ts
contact: {
  phone: '', email: '', address: '', instagram: '', telegram: '',
}
```

Empty values render as honest "به‌زودی" placeholders — nothing is invented. Fill a value and it
appears in the order section and the footer (icons only appear when a link is provided).

Service titles, descriptions and showcase items live in `web/src/data/content.ts`.

## Orders

`POST /api/orders` validates the Persian form (name, phone with Persian/Arabic digits, service,
size, notes), stores the request in `print_orders` and returns a tracking reference (`DC-00001`).
Submissions are rate limited per IP (8 per 10 minutes). The form shows real success/error states
and the reference number; it never claims success on a failed request.
