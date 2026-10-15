import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">Page not found</h1>
      <p className="mt-3 max-w-md text-body text-muted">
        The page you are looking for has moved or never existed. The collection is still where you left it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/shop"
          className="inline-flex h-[50px] items-center bg-cta px-8 text-[15px] font-medium text-white transition-colors hover:bg-[#1c1c1c]"
        >
          Shop the collection
        </Link>
        <Link
          to="/"
          className="inline-flex h-[50px] items-center border border-line px-8 text-[15px] font-medium transition-colors hover:border-ink"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
