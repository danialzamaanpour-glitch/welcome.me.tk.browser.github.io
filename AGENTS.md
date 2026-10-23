# Notes for agents working in this repo

## Layout

- `web/` — Vite 6 + React 18 + TypeScript. Styling is plain CSS (`web/src/styles/*.css`,
  imported by `web/src/index.css`); there is no Tailwind/PostCSS step.
- `api/` — Express 4 + `pg`. `server.js` is the whole API; `db.js` holds the pool + schema.
- `assets/` — the original uploads (hero ad, logo, product still, section photos, the film).
  Everything in `web/public/frames` and `web/public/media` is **derived** from these.

## Run / verify

```bash
docker compose -f docker-compose.base44.yml up -d
docker compose -f docker-compose.base44.yml exec web npx tsc --noEmit
curl -s localhost:8000/api/health          # {"ok":true,...}
```

`migrate` is a one-shot service (`restart: "no"`); `api` waits for `service_completed_successfully`,
`web` waits for `api` to be healthy. Both app services run `npm ci` on boot against the committed
lockfiles — keep `package-lock.json` in sync with `package.json` or startup fails.

## Media pipeline (easy to break)

`scripts/build-media.sh` regenerates every derived asset with ffmpeg in Docker:

- `web/public/frames/desktop/f001..f121.webp` and `frames/mobile/…` — **one file per video frame**.
- `FRAME_COUNT` in `web/src/components/CinematicScroll.tsx` must equal the number of files.
  If the film changes, re-run the script and update that constant.

The cinematic is a canvas painting `round(progress × (FRAME_COUNT - 1))`, not a `<video>`; do not
"fix" it by adding playback. Frame changes are the only thing that redraws.

## Layout traps

- `.hero-scroll` is 150vh with a sticky `.hero`; the cinematic section then slides over it.
  The hero fade is driven by `--hp` over the **whole** wrapper height (not half a viewport) —
  fading earlier leaves a black gap before the next section arrives.
- `.services` has `margin-top: -48px` + rounded top edge so it rises over the sequence end.
  Keep the cinematic's own `z-index` below it.
- Fixed header offset comes from `scroll-margin-top` in `web/src/index.css`.

## Content rules

- `web/src/config/site.ts` holds contact details. They are intentionally empty; empty values
  render as "به‌زودی" placeholders. Never invent a phone, address, social URL, price or credential.
- Persian copy lives in `web/src/data/content.ts` and the components. Keep it RTL-safe
  (logical CSS properties: `inset-inline-*`, `margin-inline-*`).

## Sandbox / preview specifics

- Vite `server.allowedHosts` is extended with `.${BASE44_SANDBOX_HOST_DOMAIN}` and
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`; both are empty outside the sandbox, which restores
  the default behaviour. Never hardcode a resolved `*-base44-preview*` host.
- `BASE44_PREVIEW_MODE` is passed through to the services but no code branches on it today.
- The browser only ever talks to port 3000: `/api` is proxied to the `api` service by
  `web/vite.config.ts`. Don't hardcode `http://localhost:8000` in the client.

## Tests

There is no test runner. Verification is: `tsc --noEmit`, a real `POST /api/orders`, and checking
that `.cinematic__frame-count` increases scrolling down and decreases scrolling up.
