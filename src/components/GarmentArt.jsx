import { useId } from 'react'

/**
 * Illustrated garment art.
 *
 * This repository contains no product photography, so every product without a
 * 3D model is drawn here as vector art in VELORA's monochrome language: a studio
 * backdrop, the garment in its own colour, ribbed trims and a soft contact
 * shadow. It is an illustration and is labelled as one in the UI — it is never
 * presented as a photograph.
 */
const KINDS = {
  hoodie: { hood: true, long: true, zip: false, hoodiePocket: true },
  sweatshirt: { hood: false, long: true, zip: false, hoodiePocket: false },
  zipup: { hood: true, long: true, zip: true, hoodiePocket: false },
  tee: { hood: false, long: false, zip: false, hoodiePocket: false },
}

export default function GarmentArt({
  kind = 'hoodie',
  color = '#292A2D',
  angle = 'front',
  className = '',
  title,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const k = KINDS[kind] || KINDS.hoodie
  const angleTransform = {
    front: 'translate(0 0)',
    three: 'translate(6 0) scale(0.94 1)',
    side: 'translate(0 0) scale(0.72 1)',
    detail: 'translate(-46 -58) scale(1.55)',
  }[angle] || 'translate(0 0)'

  const bodyTop = 96
  const bodyBottom = k.long ? 336 : 300
  const sleeveBottom = k.long ? 268 : 206

  return (
    <div className={`garment-art ${className}`} aria-hidden={title ? undefined : true}>
      <svg
        /* eslint-disable-next-line react/no-unknown-property */
        role={title ? 'img' : 'presentation'}
        aria-label={title}
        viewBox="0 0 400 430"
        className="garment-art__svg"
      >
        <defs>
          <radialGradient id={`bg-${uid}`} cx="0.42" cy="0.3" r="0.85">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="62%" stopColor="#f6f6f5" />
            <stop offset="100%" stopColor="#e8e8e7" />
          </radialGradient>
          <linearGradient id={`cloth-${uid}`} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="72%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id={`trim-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.03" />
          </linearGradient>
          <pattern id={`rib-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="transparent" />
            <path d="M1 0v6M4 0v6" stroke="#000000" strokeOpacity="0.16" strokeWidth="1" />
          </pattern>
          <filter id={`shadow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <rect width="400" height="430" fill={`url(#bg-${uid})`} />
        <ellipse cx="200" cy="386" rx="118" ry="17" fill="#8f8f8e" opacity="0.28" filter={`url(#shadow-${uid})`} />

        <g transform={angleTransform}>
          {/* Sleeves */}
          <g>
            <rect
              x="66"
              y={bodyTop + 12}
              width="70"
              height={sleeveBottom - bodyTop}
              rx="32"
              fill={color}
              transform="rotate(-16 101 120)"
            />
            <rect
              x="264"
              y={bodyTop + 12}
              width="70"
              height={sleeveBottom - bodyTop}
              rx="32"
              fill={color}
              transform="rotate(16 299 120)"
            />
            <rect
              x="60"
              y={sleeveBottom - 34}
              width="66"
              height="34"
              rx="14"
              fill={color}
              opacity="0.96"
              transform="rotate(-16 101 120)"
            />
            <rect
              x="274"
              y={sleeveBottom - 34}
              width="66"
              height="34"
              rx="14"
              fill={color}
              opacity="0.96"
              transform="rotate(16 299 120)"
            />
            <rect
              x="60"
              y={sleeveBottom - 34}
              width="66"
              height="34"
              rx="14"
              fill={`url(#rib-${uid})`}
              transform="rotate(-16 101 120)"
            />
            <rect
              x="274"
              y={sleeveBottom - 34}
              width="66"
              height="34"
              rx="14"
              fill={`url(#rib-${uid})`}
              transform="rotate(16 299 120)"
            />
          </g>

          {/* Body */}
          <rect
            x="104"
            y={bodyTop}
            width="192"
            height={bodyBottom - bodyTop}
            rx={k.long ? 28 : 22}
            fill={color}
          />
          <rect
            x="104"
            y={bodyTop}
            width="192"
            height={bodyBottom - bodyTop}
            rx={k.long ? 28 : 22}
            fill={`url(#cloth-${uid})`}
          />

          {/* Hood or crew collar */}
          {k.hood ? (
            <g>
              <path
                d={`M104 ${bodyTop + 14} C104 ${bodyTop - 48} 296 ${bodyTop - 48} 296 ${bodyTop + 14} Z`}
                fill={color}
              />
              <path
                d={`M104 ${bodyTop + 14} C104 ${bodyTop - 48} 296 ${bodyTop - 48} 296 ${bodyTop + 14} Z`}
                fill={`url(#cloth-${uid})`}
              />
              <ellipse cx="200" cy={bodyTop + 6} rx="66" ry="15" fill="#000000" opacity="0.42" />
              <ellipse cx="200" cy={bodyTop + 4} rx="66" ry="13" fill="none" stroke="#ffffff" strokeOpacity="0.12" />
            </g>
          ) : (
            <g>
              <rect x="150" y={bodyTop - 16} width="100" height="30" rx="14" fill={color} />
              <rect x="150" y={bodyTop - 16} width="100" height="30" rx="14" fill={`url(#rib-${uid})`} />
            </g>
          )}

          {/* Kangaroo pocket */}
          {k.hoodiePocket && (
            <g fill="none" stroke="#000000" strokeOpacity="0.22" strokeWidth="1.6">
              <path d={`M150 ${bodyBottom - 92} L250 ${bodyBottom - 92} L250 ${bodyBottom - 44} Q250 ${bodyBottom - 34} 240 ${bodyBottom - 34} L160 ${bodyBottom - 34} Q150 ${bodyBottom - 34} 150 ${bodyBottom - 44} Z`} />
            </g>
          )}

          {/* Zip placket */}
          {k.zip && (
            <g>
              <path d="M200 88v230" stroke="#000000" strokeOpacity="0.35" strokeWidth="2" />
              <path d="M193 96l7 12 7-12" fill="none" stroke="#000000" strokeOpacity="0.4" strokeWidth="2" />
              <circle cx="200" cy="320" r="4" fill="#000000" opacity="0.5" />
            </g>
          )}

          {/* Hem band */}
          <rect
            x="104"
            y={bodyBottom - 34}
            width="192"
            height="34"
            rx={k.long ? 24 : 20}
            fill={color}
            opacity="0.97"
          />
          <rect
            x="104"
            y={bodyBottom - 34}
            width="192"
            height="34"
            rx={k.long ? 24 : 20}
            fill={`url(#rib-${uid})`}
          />
          <rect
            x="104"
            y={bodyBottom - 34}
            width="192"
            height="34"
            rx={k.long ? 24 : 20}
            fill={`url(#trim-${uid})`}
          />

          {/* Fold hints */}
          <g fill="none" stroke="#000000" strokeOpacity="0.1" strokeWidth="2">
            <path d={`M132 ${bodyTop + 70} C160 ${bodyTop + 110} 150 ${bodyTop + 150} 136 ${bodyTop + 190}`} />
            <path d={`M268 ${bodyTop + 70} C240 ${bodyTop + 110} 250 ${bodyTop + 150} 264 ${bodyTop + 190}`} />
          </g>

          {k.hood && (
            <g stroke="#000000" strokeOpacity="0.3" strokeWidth="1.6" fill="none">
              <path d="M182 118c0 34 1 58 1 74" />
              <path d="M218 118c0 34-1 58-1 74" />
              <circle cx="183" cy="196" r="3.4" />
              <circle cx="217" cy="196" r="3.4" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
