# AGENTS.md — VELORA (Base44 imported app)

VELORA is an immersive 3D fashion storefront for a single flagship piece (the Essential
Oversized Hoodie) built as a Vite + React SPA with a real-time Three.js scene and a
scroll-driven chapter sequence. This file records only what is not obvious from the
manifests.

## Run it in the Base44 sandbox

```bash
docker compose -f docker-compose.base44.yml up -d --build   # host port 3000
docker compose -f docker-compose.base44.yml logs -f web     # dev server output
```

- Single service (`web`) on the plain `node:22` image, repo bind-mounted at `/app`,
  running `npm install && npm run dev` (Vite dev server, live reload).
- `node_modules` lives in the named Docker volume `velora_node_modules`, **not** in the
  repo, so dependency installs never pollute the working tree. Dependencies install on
  container start from `package.json` + the committed `package-lock.json`.
- No database, no cache, no queue, no secrets, no `.env` file. The app boots with zero
  configuration and there is nothing to supply in `/run/base44/app.env`.
- `.base44/environment.json` records `previewPort: 3000`, `healthPath: /`.

### Sandbox-only configuration

`vite.config.js` reads `BASE44_PREVIEW_MODE`:

- when it equals `"1"` (sandbox), Vite's `allowedHosts` is extended with
  `.<BASE44_SANDBOX_HOST_DOMAIN>` (the sandbox hostname rotates, so the wildcard is
  required) and file watching switches to polling, because bind-mounted edits do not
  always deliver inotify events.
- when it is unset or any other value, none of this is applied and the dev server keeps
  its default behaviour.

`BASE44_PREVIEW_MODE`, `BASE44_SANDBOX_HOST_DOMAIN`, `BASE44_PUBLIC_HOST_SUFFIX` and
`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` are passed through from Compose; no resolved
host value is ever hardcoded.

## What is real and what is not (do not overstate this in copy)

- **Real:** the 3D garment (generated geometry — soft-edged body with displaced cloth
  folds, capsule sleeves, spherical hood shell, extruded rounded-rect trims), the fabric
  surface (height fields generated at runtime → tangent-space normal + roughness maps and
  shaded macro canvases), the studio lighting/environment (procedural equirect PMREM), the
  scroll-linked camera rig, cart/wishlist/variant state, filtering, search, tabs, reviews,
  form validation.
- **Not present:** any GLB/glTF hoodie asset, any product photography, any backend,
  database, authentication, payment provider, email service or inventory. The garment is
  a studio object, not a simulated worn garment.
- **Persistence:** cart, wishlist, variant selections, orders, locally written reviews and
  the newsletter signup are stored in the visitor's own browser (`localStorage` keys
  prefixed `velora.`), because this repository has no server-side store.
- **Checkout** is explicitly labelled a demonstration: an address is collected, no card
  details, nothing is charged or shipped.
- The UI says all of this in plain language (hero chip, gallery note, purchase panel note,
  checkout banner, footer). Keep those statements accurate if you change features.

## Where things live

| Concern | Path |
| --- | --- |
| Catalogue, variants, collections | `src/data/products.js` |
| Reviews / journal copy | `src/data/reviews.js`, `src/data/journal.js` |
| Cart, wishlist, currency, orders, toasts | `src/store/ShopContext.jsx` |
| Camera + model keyframes per scroll progress | `src/three/sceneState.js` |
| Garment geometry helpers | `src/three/garment.js` |
| Procedural fabric fields / textures | `src/lib/fabricFields.js`, `src/three/fabricTextures.js` |
| Pinned stage canvas | `src/three/StageCanvas.jsx` |
| Interactive product viewer | `src/three/GalleryViewer.jsx` |
| Chapters 01–05 | `src/experience/**` (one scoped GSAP context per chapter) |
| Design tokens / styles | `src/styles/{tokens,components,experience,pages}.css` |

## Gotchas worth knowing before editing

- The story chapters live inside GSAP `gsap.context`s scoped per chapter
  (`src/experience/useChapterScope.js`); always build timelines inside that hook so they
  are reverted on unmount and route changes. Reduced motion skips the build entirely and
  leaves the chapter static.
- `.stage` is a CSS **sticky** element with `margin-bottom: -100svh` (not a pin): chapters
  scroll over it and nothing hijacks scrolling. Do not convert it to a pinned
  ScrollTrigger.
- WebGL canvases must never contribute their pixel width to layout: keep
  `min-width: 0` on grid/flex parents of a canvas or viewer, and keep the canvas containers
  on an explicit `minmax(0, 1fr)` track. A generated `<canvas>` (fabric macros) is painted
  at its measured container width for the same reason.
- The stage and viewer canvases pause themselves when off screen (`frameloop`), and the
  stage uses a lower detail level plus lower DPR on phones.
- Body uses `overflow-x: clip` (not `hidden`) so sticky scenes keep working.
- `prefers-reduced-motion` removes idle drift, pointer parallax, scrub reveals and
  smooth scrolling.

## Verifying a change

There is no test runner in this repo; verification is driving the running app on port 3000.

1. `curl -s http://localhost:3000/ | head` — must show the Vite client script (live source,
   not a prebuilt bundle).
2. Scroll the home route through chapters 01–05: the camera must follow the scroll and
   reverse when scrolling back; each chapter's heading must reveal and stay readable.
3. Chapter 04 swatches and the purchase panel's colour selector must stay in sync (one
   shared variant state), including per-colour size availability.
4. Add to bag → badge count, drawer line (product · colour · size · price) and subtotal;
   remove the line and the empty state returns.
5. Tabs must switch without any scroll interaction; Escape closes drawers/modals.
6. Check 375px, 768px, 1024px and 1440px widths for horizontal overflow
   (`documentElement.scrollWidth - clientWidth` should be 0 apart from any scrollbar
   gutter reported by the emulated mobile viewport).
