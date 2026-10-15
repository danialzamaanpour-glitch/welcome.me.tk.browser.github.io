# VELORA

A premium minimalist fashion e-commerce storefront — React + Vite, no backend required.

VELORA is a contemporary essentials label: heavyweight hoodies, sweatshirts and tees, presented
through a monochrome editorial interface. The product detail experience is the centrepiece: a
thumbnail gallery beside a large portrait image, colour and size configuration, a size guide, a
tabbed information archive, reviews, and a "You May Also Like" grid.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | React 18 + Vite |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 (design tokens in `tailwind.config.js`) |
| Data | In-repo catalog (`src/data/products.js`), reviews, editorial content |
| State | React context + `localStorage` (`src/lib/store.jsx`) |
| Build output | Static assets — deployable to any static host |

No database, no server runtime, no external API keys.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static bundle in dist/
```

### Running in the Base44 sandbox

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

This runs the Vite dev server from the cloned source on `node:22` with the repo bind-mounted, so
edits appear live. `node_modules` lives in a named volume and is installed on container start
(`npm ci` when `package-lock.json` is present, otherwise `npm install`).

### Sandbox-only configuration overrides

The preview proxies a public host to host port 3000, so the dev server must accept a hostname that
is not `localhost`:

- **`vite.config.js`** — when `BASE44_PREVIEW_MODE === '1'`, `server.allowedHosts` is set to
  `['.' + BASE44_SANDBOX_HOST_DOMAIN]`. The sandbox id is part of that host and rotates on
  re-import, so the wildcard is required; an exact host would break.
  With `BASE44_PREVIEW_MODE` unset (or any other value) the option is left `undefined`, which keeps
  Vite's stock allowlist and behaviour for local development and production builds.
- **File-watch polling** is enabled in the same file (`server.watch.usePolling`), because bind
  mounts on the sandbox microVM do not always emit inotify events. This is harmless locally.

Everything else is stock application configuration: no CSP, frame or cookie settings are modified
for the preview.

## Project structure

```
src/
  data/          catalog, reviews, editorial + policy content (single source of truth)
  lib/           store (cart, wishlist, currency, overlays), currency, formatting, hooks, SEO
  components/
    layout/      announcement bar, header, mobile drawer, footer, newsletter
    product/     card, gallery, purchase panel, details tabs, reviews, recommendations, listing
    cart/        cart drawer
    search/      search overlay
    ui/          button, modal, drawer, icons, media, stars, toast, accordion, breadcrumbs
  pages/         home, shop, product, collections, new arrivals, sale, search, cart, checkout,
                 account, wishlist, blog, info pages, 404
```

## What is real and what is sample data

This is a complete, working storefront front-end — but it is deliberately honest about what it does
not have:

- **Works**: navigation, search, filtering and sorting, product gallery, colour/size selection,
  size guide, cart with quantities and totals, wishlist, form validation, responsive layout,
  dark-on-light accessible controls, reduced-motion support.
- **Sample data**: products, prices, ratings, review text and editorial copy.
- **Not connected**: payments (checkout validates and confirms but charges nothing), order
  fulfilment (no orders are transmitted or stored), authentication (the account area is a
  device-local demo; passwords are never stored), newsletter delivery, and live FX rates for the
  currency selector.

Products with `stock: 0` are treated as sold out: the card shows a "Sold Out" chip, the purchase
panel disables its size and add-to-cart controls. `src/data/products.js` is the single place to
edit any of this.
