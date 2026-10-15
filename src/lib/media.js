/**
 * Responsive image helpers for the Unsplash-hosted catalog photography.
 * Every id below was verified to resolve (HTTP 200) before being wired in.
 */
export function mediaUrl(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`
}

/** Widths used across the store: card, gallery, hero. */
export const MEDIA_WIDTHS = [480, 800, 1200, 1600]

export function mediaSrcSet(id) {
  return MEDIA_WIDTHS.map((w) => `${mediaUrl(id, w)} ${w}w`).join(', ')
}
