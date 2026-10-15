/**
 * Minimalist line-icon set (24×24, currentColor). Inline SVG keeps the icon
 * language consistent and avoids shipping an icon dependency.
 */
const PATHS = {
  menu: 'M3.5 6.5h17M3.5 12h17M3.5 17.5h17',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  user: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4.5 20.5c.7-4 3.8-6 7.5-6s6.8 2 7.5 6',
  bag: 'M6 8h12l1 12H5L6 8zM9 8V6.5a3 3 0 016 0V8',
  heart: 'M12 20.5C10.5 19.4 4.8 15.5 4.8 11.3A4.3 4.3 0 0112 8.4a4.3 4.3 0 017.2 2.9c0 4.2-5.7 8.1-7.2 9.2z',
  chevronDown: 'M6 9.5l6 6 6-6',
  chevronLeft: 'M14.5 6l-6 6 6 6',
  chevronRight: 'M9.5 6l6 6-6 6',
  arrowRight: 'M4 12h15M13.5 6.5L19 12l-5.5 5.5',
  arrowDown: 'M12 4.5v15M6.5 14L12 19.5 17.5 14',
  check: 'M5 12.5l4.5 4.5L19 7',
  truck: 'M3 7h10.5v9H3zM13.5 10.5H17l3 3v2.5h-6.5zM7 19.5a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4zM17 19.5a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z',
  returns: 'M4 11a8 8 0 0113.7-5.6M20 13a8 8 0 01-13.7 5.6M4 5.5V11h5.5M20 18.5V13h-5.5',
  shield: 'M12 3.5l7 2.8v6c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9v-6l7-2.8zM9 12l2 2 4-4',
  ruler: 'M3.5 8.5L8.5 3.5l12 12-5 5zM8 9.5l2 2M11 6.5l2 2M5.5 12l2 2',
  star: 'M12 3.6l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 10l6-.9z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10.5 11v5.5M13.5 11v5.5',
  zoom: 'M11 5a6 6 0 100 12 6 6 0 000-12zM15.5 15.5L20 20M11 8.5v5M8.5 11h5',
  filter: 'M4 7h16M7 12h10M10 17h4',
  mail: 'M3.5 6h17v12h-17zM3.5 7l8.5 6 8.5-6',
  lock: 'M7 11V8.5a5 5 0 0110 0V11M5.5 11h13v9h-13z',
  tag: 'M3.5 12.5l9-9h8v8l-9 9zM16.5 7.5h.01',
  expand: 'M4 9V4h5M20 15v5h-5M4 15v5h5M20 9V4h-5',
  layers: 'M12 3.5l8 4.2-8 4.2-8-4.2zM4 12.5l8 4.2 8-4.2M4 16.5l8 4.2 8-4.2',
  hood: 'M12 4a6 6 0 016 6v10H6V10a6 6 0 016-6zM9.5 20v-5.5a2.5 2.5 0 015 0V20',
  cuff: 'M5 8.5h14M5 12h14M5 15.5h14',
  sparkle: 'M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4z',
  grid: 'M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z',
  list: 'M4 6.5h16M4 12h16M4 17.5h16',
  sort: 'M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3',
  sliders: 'M4 8h10M18 8h2M4 16h4M12 16h8M15 5.5v5M8 13.5v5',
  info: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 11v5.5M12 8h.01',
  calendar: 'M4.5 6.5h15v13h-15zM4.5 10.5h15M9 4v4M15 4v4',
  alert: 'M12 4.5l8.5 15h-17zM12 10v4.5M12 17h.01',
  refresh: 'M20 11A8 8 0 006.3 6M4 13a8 8 0 0013.7 5M20 5.5V11h-5.5M4 18.5V13h5.5'
}

export function Icon({ name, size = 18, strokeWidth = 1.5, className = '', filled = false, title }) {
  const path = PATHS[name] || PATHS.info
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={path} />
    </svg>
  )
}

export default Icon
