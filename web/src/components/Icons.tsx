type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const IconPhoto = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <circle cx="8.6" cy="9.6" r="1.5" />
    <path d="M3.4 16.4l4.3-4.2a1.6 1.6 0 0 1 2.2 0l3.4 3.4 1.9-1.8a1.6 1.6 0 0 1 2.2 0l3.2 3.1" />
  </svg>
);

export const IconFrame = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="1.6" />
    <rect x="6.4" y="6.4" width="11.2" height="11.2" rx="0.8" />
    <path d="M9.6 14.6l2-2.4 1.6 1.8 1.3-1.4" />
  </svg>
);

export const IconId = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="2.6" y="5" width="18.8" height="14" rx="2" />
    <circle cx="8.4" cy="11" r="2.1" />
    <path d="M5 16.2c.6-1.5 1.9-2.3 3.4-2.3s2.8.8 3.4 2.3" />
    <path d="M15.2 10h3.2M15.2 13.2h3.2" />
  </svg>
);

export const IconShield = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M12 2.8l7 2.6v6.1c0 4.3-2.9 7.7-7 9.7-4.1-2-7-5.4-7-9.7V5.4z" />
    <path d="M8.8 11.9l2.2 2.2 4.2-4.4" />
  </svg>
);

export const IconDroplet = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M12 3.2s5.5 5.2 5.5 9.2a5.5 5.5 0 0 1-11 0c0-4 5.5-9.2 5.5-9.2z" />
    <path d="M9.7 13.4a2.4 2.4 0 0 0 2.3 2.2" />
  </svg>
);

export const IconBox = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M3.6 8.2l8.4-4 8.4 4v8.1l-8.4 4-8.4-4z" />
    <path d="M3.6 8.2l8.4 4 8.4-4M12 12.2v8" />
  </svg>
);

export const IconCheck = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.2 12.3l2.6 2.6 5-5.2" />
  </svg>
);

export const IconAlert = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.6v5.2M12 16.3v.1" />
  </svg>
);

/** RTL arrow: points left (the reading direction). */
export const IconArrow = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M19 12H5.4M11.2 6.2L5.4 12l5.8 5.8" />
  </svg>
);

export const IconPhone = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M6.2 3.6h3l1.4 3.6-2 1.4a11 11 0 0 0 5.4 5.4l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2 16.4 16.4 0 0 1-14.6-14.6 2 2 0 0 1 2-2.2z" />
  </svg>
);

export const IconMail = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="3" y="5.4" width="18" height="13.2" rx="2" />
    <path d="M3.8 7l7.3 5.4a1.5 1.5 0 0 0 1.8 0L20.2 7" />
  </svg>
);

export const IconPin = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M12 21s6.4-5.4 6.4-10.2A6.4 6.4 0 0 0 5.6 10.8C5.6 15.6 12 21 12 21z" />
    <circle cx="12" cy="10.6" r="2.4" />
  </svg>
);

export const IconInstagram = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTelegram = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M21 4.4L3.6 11.1c-.6.2-.6 1 0 1.2l4.2 1.3 1.6 4.9c.2.5.8.6 1.1.2l2.3-2.4 4.2 3c.5.3 1.1 0 1.2-.6L22 5.4c.2-.6-.4-1.2-1-.9z" />
    <path d="M7.8 13.6L18.4 6.6l-7.6 8.2-.3 3" />
  </svg>
);
