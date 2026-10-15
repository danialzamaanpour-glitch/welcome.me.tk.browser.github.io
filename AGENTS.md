# AGENTS.md — VELORA (Base44 imported app)

VELORA is an immersive fashion storefront for a single flagship piece (the Essential
Oversized Hoodie) built as a Vite + React SPA. The home route opens with a cinematic
presentation: a generated studio **film** of the garment whose playhead is driven by the
visitor's scroll, followed by five chapters and the shopping interface. The product page
keeps a real-time 3D viewer. This file records only what is not obvious from the manifests.

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

## The hero film (`public/media`)

- `velora-hoodie.mp4` — the generated studio sequence of the flagship hoodie (Qwen, supplied
  by the client): 5.04 s, 24 fps, originally 2088 × 992 with a 128 kb/s AAC track. It was
  transcoded **once** for the web: 1920 × 912 H.264 yuv420p, CRF 20, closed GOP of 12 frames
  (`-g 12 -keyint_min 12 -sc_threshold 0`, so a scroll seek only decodes half a second),
  audio stripped (the piece is silent and nothing autoplays with sound), `+faststart`.
  Re-encode again only if you must; the file is 9.2 MB and each frame is a scrubbing target,
  so dense keyframes matter more than the bitrate.
- `velora-hoodie-poster.jpg` — that same film's first frame. It is the `poster`, the
  reduced-motion still, and the fallback if the film cannot be loaded.
- `src/experience/cinematicState.js` holds the film metadata (`FILM`), the shared scroll
  progress object (`cinema`) and the five chapter definitions (`CHAPTERS`).

The garment occupies roughly the middle 40–60 % of the frame width and runs the **full height**
of the frame, on a white studio background with a soft floor. Two consequences:

- The page is white, so the letterboxing of an uncropped frame is invisible — desktop and
  tablet show the film whole (`aspect-ratio: 2088 / 992`).
- A crop is only safe sideways. A box *narrower* than 2.1:1 (the phone's `aspect-ratio: 7 / 4`)
  crops the empty studio margins left and right; a box *wider* than 2.1:1 would crop top and
  bottom and cut the hood and hem off. **Never crop the film's height.**

## How the scroll → film mapping works

- One master `ScrollTrigger` (`start: top top`, `end: bottom bottom`) writes the section's
  normalised progress into `cinema.progress`. It has exactly one writer.
- `useVideoScrub` reads it every `gsap.ticker` frame, converts it to
  `clamp(progress) * video.duration` and seeks the paused `<video>`. The duration comes from
  `loadedmetadata` — nothing about the clip's length is hardcoded. Seeks are skipped when the
  target is closer than half a frame (1/48 s), and only one seek is ever in flight: while the
  browser is seeking, the newest target is parked and applied on `seeked`, so fast scrolling
  converges instead of queueing work.
- Metadata never moves the visitor's scroll position: the film follows the page.
- Chapter heights in `experience.css` **are** the film's timeline — each chapter's share of
  the section height is the stretch of footage its words sit over. Changing a `min-height`
  changes which frames a chapter covers and which scroll position its rail step jumps to.
  Current mapping (desktop): Arrival = opening composition, Form = the turn through the
  silhouette, Texture = the surface under raking light, Construction = the closer frames that
  show hood, pocket and trims, The Essential = the closing frame, which holds (the film never
  loops or restarts).
- The chapter rail measures the chapter elements from the live DOM (re-measured on
  `ScrollTrigger` refresh and resize), so a click scrolls to the chapter's own geometry.

## What is real and what is not (do not overstate this in copy)

- **Real:** the hero film (a generated studio sequence of the flagship garment, scrubbed by
  scroll), the 3D garment on the product page (generated geometry — soft-edged body with
  displaced cloth folds, capsule sleeves, spherical hood shell, extruded rounded-rect trims),
  the procedural fabric surfaces, the studio lighting/environment, cart/wishlist/variant
  state, filtering, search, tabs, reviews, form validation.
- **Not present:** any GLB/glTF hoodie asset, any product photography, any backend, database,
  authentication, payment provider, email service or inventory. The garment is a studio
  object, not a simulated worn garment, and the film is a studio sequence, not a fit model.
- **Persistence:** cart, wishlist, variant selections, orders, locally written reviews and the
  newsletter signup are stored in the visitor's own browser (`localStorage` keys prefixed
  `velora.`), because this repository has no server-side store.
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
| Film asset + poster | `public/media/` |
| Film metadata, chapter list, scroll progress | `src/experience/cinematicState.js` |
| Scroll → film playhead (the scrub engine) | `src/experience/useVideoScrub.js` |
| Sticky film stage / loading / fallback | `src/experience/CinematicStage.jsx` |
| Chapters 01–05 | `src/experience/chapters/**` (one scoped GSAP context per chapter) |
| Editorial detail labels | `src/experience/ChapterLabels.jsx` |
| Chapter rail (desktop rail, phone steps) | `src/experience/ScrollProgressIndicator.jsx` |
| Interactive product viewer (product page) | `src/three/GalleryViewer.jsx` |
| Procedural fabric fields / textures | `src/lib/fabricFields.js`, `src/three/fabricTextures.js` |
| Design tokens / styles | `src/styles/{tokens,components,experience,pages}.css` |

## Gotchas worth knowing before editing

- The film is **scrubbed, never played**: no `play()`, no `loop`, no controls. Do not add an
  autoplay loop as a "fallback" — it breaks the whole gesture.
- `.stage` is a CSS **sticky** element with `margin-bottom: -100svh` (not a pin): chapters
  scroll over it and nothing hijacks scrolling. Do not convert it to a pinned ScrollTrigger.
- Chapter copy is always rendered in the strip *under* the film (`justify-content: flex-end`
  plus `--stage-bottom-gap`), so type can never cover the garment at any viewport. Keep that
  invariant when restyling.
- The story chapters live inside GSAP `gsap.context`s scoped per chapter
  (`src/experience/useChapterScope.js`); always build timelines inside that hook so they are
  reverted on unmount and route changes. Reduced motion skips the build entirely and leaves
  the chapter static.
- With `prefers-reduced-motion` no `<video>` is rendered at all: the poster is shown as a
  static presentation and `cinema.progress` is never scrubbed.
- WebGL canvases must never contribute their pixel width to layout: keep `min-width: 0` on
  grid/flex parents of a canvas or viewer. The product page viewer is the only WebGL left.
- Body uses `overflow-x: clip` (not `hidden`) so sticky scenes keep working.
- `prefers-reduced-motion` removes idle drift, pointer parallax, scrub reveals and smooth
  scrolling.

## Verifying a change

There is no test runner in this repo; verification is driving the running app on port 3000.

1. `curl -s http://localhost:3000/ | head` — must show the Vite client script (live source,
   not a prebuilt bundle).
2. `curl -sI http://localhost:3000/media/velora-hoodie.mp4` — must answer `200 video/mp4`.
3. On the home route, before any scrolling: the film shows its first frame, `<video>.paused`
   is `true`, and `currentTime` is ~0.
4. Scroll into the presentation: `video.currentTime` must grow with the page and **shrink**
   when scrolling back, the active step in the chapter rail must follow, and clicking a rail
   step must scroll to that chapter's own position.
5. At the end of the section the film sits on its final frame and does not loop.
6. The purchase panel below, the colour selector (chapter 05 swatches and the panel share one
   variant state), the size guide, cart drawer and tabs must all still work.
7. Check 375 px, 768 px, 1106 px and 1440 px widths for horizontal overflow
   (`documentElement.scrollWidth - clientWidth` should be 0 apart from any scrollbar gutter
   reported by the emulated mobile viewport) and confirm the film never overlaps the copy.
