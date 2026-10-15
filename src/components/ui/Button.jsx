import { Link } from 'react-router-dom'
import { cn } from '../../lib/format.js'

const VARIANTS = {
  primary: 'bg-cta text-white border border-cta hover:bg-[#1c1c1c]',
  outline: 'bg-paper text-ink border border-line hover:bg-hover hover:border-ink',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-hover',
  subtle: 'bg-surface text-ink border border-transparent hover:bg-surface2'
}

const SIZES = {
  sm: 'h-10 px-4 text-meta',
  md: 'h-12 px-6 text-[14px]',
  lg: 'h-[50px] px-8 text-[15px]'
}

/**
 * Shared button. Renders a <button>, or a router <Link> when `to` is given, or
 * an <a> when `href` is given — one visual language, correct semantics.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className,
  children,
  fullWidth = false,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-[0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
