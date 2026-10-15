/** Thin-line icon set, drawn with currentColor. */

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const Search = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
)

export const User = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.8 20c1.3-3.6 4-5.4 7.2-5.4S17.9 16.4 19.2 20" />
  </svg>
)

export const Bag = (p) => (
  <svg {...base} {...p}>
    <path d="M5.5 7.5h13l1 12.5h-15z" />
    <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
  </svg>
)

export const Heart = ({ filled = false, ...p }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-6.8-4.3-6.8-9.2A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 6.8 2.6C18.8 15.7 12 20 12 20z" />
  </svg>
)

export const Close = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const Menu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const ArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />
  </svg>
)

export const ArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v13M6.5 12.5L12 18l5.5-5.5" />
  </svg>
)

export const ChevronDown = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
)

export const Minus = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
)

export const Plus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Check = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
)

export const Star = ({ filled = true, ...p }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 4.6l2.3 4.9 5.2.7-3.8 3.7.9 5.3-4.6-2.6-4.6 2.6.9-5.3L4.5 10.2l5.2-.7z" />
  </svg>
)

export const Truck = (p) => (
  <svg {...base} {...p}>
    <path d="M3 7.5h10v9H3z" />
    <path d="M13 10.5h4.2L21 14v2.5h-8z" />
    <circle cx="7" cy="18.5" r="1.7" />
    <circle cx="17.5" cy="18.5" r="1.7" />
  </svg>
)

export const Return = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9h11a5 5 0 0 1 0 10H8" />
    <path d="M7.5 5.5L4 9l3.5 3.5" />
  </svg>
)

export const Lock = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="10.5" width="14" height="9" rx="1.6" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
)

export const Ruler = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="9" width="18" height="6" rx="1.2" />
    <path d="M7 9v3M11 9v4M15 9v3M19 9v4" />
  </svg>
)

export const Cube = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.5l7.5 4.2v8.6L12 20.5 4.5 16.3V7.7z" />
    <path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5" />
  </svg>
)
