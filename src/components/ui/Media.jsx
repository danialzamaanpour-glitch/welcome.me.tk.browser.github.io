import { useState } from 'react'
import { mediaSrcSet, mediaUrl } from '../../lib/media.js'
import { cn } from '../../lib/format.js'

const SIZES = {
  card: '(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 90vw',
  gallery: '(min-width: 1024px) 45vw, 100vw',
  hero: '100vw',
  half: '(min-width: 768px) 45vw, 100vw',
  full: '100vw',
  thumb: '80px',
  tight: '(min-width: 1024px) 22vw, 45vw'
}

/**
 * Catalog image with a reserved aspect box (no layout shift), responsive
 * srcset, lazy loading by default and a graceful fallback if a photo fails.
 */
export function Media({ image, ratio = '3 / 4', sizes = 'card', priority = false, className = '', width = 1200 }) {
  const [failed, setFailed] = useState(false)

  if (!image) {
    return <div className={cn('media-ratio bg-surface', className)} style={{ aspectRatio: ratio }} aria-hidden="true" />
  }

  return (
    <div className={cn('media-ratio', className)} style={{ aspectRatio: ratio }}>
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface text-faint">
          <span className="text-micro uppercase tracking-[0.16em]">Image unavailable</span>
          <span className="max-w-[80%] text-center text-label">{image.alt}</span>
        </div>
      ) : (
        <img
          src={mediaUrl(image.id, width)}
          srcSet={mediaSrcSet(image.id)}
          sizes={SIZES[sizes] || SIZES.card}
          alt={image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export default Media
