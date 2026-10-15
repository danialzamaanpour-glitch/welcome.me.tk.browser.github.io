import { useEffect, useRef, useState } from 'react'
import Media from '../ui/Media.jsx'
import Icon from '../ui/Icon.jsx'
import Modal from '../ui/Modal.jsx'
import { useEscapeKey } from '../../lib/hooks.js'
import { cn } from '../../lib/format.js'

/**
 * Product gallery: vertical thumbnail rail beside a large portrait image on
 * desktop, swipeable thumbnail row on smaller screens, plus a lightbox with
 * previous/next controls and arrow-key navigation.
 */
export function ProductGallery({ images, productName, priority = false }) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const thumbRefs = useRef([])

  useEffect(() => {
    setIndex(0)
  }, [images])

  const total = images.length
  const active = images[Math.min(index, total - 1)]

  const step = (delta) => setIndex((current) => (current + delta + total) % total)

  useEscapeKey(lightbox, () => setLightbox(false))

  if (!active) return null

  const onThumbKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = (index + 1) % total
    setIndex(next)
    thumbRefs.current[next]?.focus()
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
      {/* Thumbnails — a rail on desktop, a scrollable row on mobile. */}
      <div
        className="order-2 flex gap-3 overflow-x-auto pb-1 no-scrollbar lg:order-1 lg:w-[72px] lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
        role="tablist"
        aria-label={`${productName} images`}
        onKeyDown={onThumbKeyDown}
      >
        {images.map((image, imageIndex) => (
          <button
            key={image.id + imageIndex}
            ref={(node) => {
              thumbRefs.current[imageIndex] = node
            }}
            type="button"
            role="tab"
            aria-selected={imageIndex === index}
            aria-label={`Show image ${imageIndex + 1} of ${total}: ${image.alt}`}
            onClick={() => setIndex(imageIndex)}
            className={cn(
              'w-[64px] shrink-0 border transition-all duration-200 lg:w-full',
              imageIndex === index ? 'border-ink' : 'border-transparent hover:border-line'
            )}
          >
            <Media image={image} ratio="3 / 4" sizes="thumb" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="order-1 flex flex-1 flex-col lg:order-2">
        <div className="relative bg-surface">
          <Media image={active} ratio="3 / 4" sizes="gallery" priority={priority} />
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper/95 text-ink transition-colors duration-200 hover:border-ink"
            aria-label="Open larger image viewer"
          >
            <Icon name="zoom" size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIndex((current) => (current + 1) % total)}
          className="mx-auto mt-4 flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink"
          aria-label="Next image"
        >
          <Icon name="arrowDown" size={18} />
        </button>
      </div>

      <Modal
        open={lightbox}
        onClose={() => setLightbox(false)}
        title={`${productName} — image ${Math.min(index + 1, total)} of ${total}`}
        size="lg"
      >
        <div className="relative bg-surface">
          <Media image={active} ratio="3 / 4" sizes="half" priority />
          <button
            type="button"
            onClick={() => step(-1)}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/95 transition-colors hover:border-ink"
            aria-label="Previous image"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/95 transition-colors hover:border-ink"
            aria-label="Next image"
          >
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-label text-muted">{active.alt}</p>
          <div className="flex gap-2">
            {images.map((image, imageIndex) => (
              <button
                key={`dot-${image.id}-${imageIndex}`}
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-label={`Go to image ${imageIndex + 1}`}
                aria-current={imageIndex === index}
                className={cn('h-1.5 w-6 transition-colors', imageIndex === index ? 'bg-ink' : 'bg-line')}
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductGallery
