import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page container empty-state empty-state--page">
      <p className="micro micro--muted">404</p>
      <p className="empty-state__title">This route doesn’t exist.</p>
      <p className="empty-state__copy">
        The page you asked for isn’t part of this build. The presentation and the full catalogue are
        one tap away.
      </p>
      <div className="empty-state__actions">
        <Link className="btn btn--primary" to="/">
          Back to the presentation
        </Link>
        <Link className="btn btn--ghost" to="/shop">
          Shop all pieces
        </Link>
      </div>
    </div>
  )
}
