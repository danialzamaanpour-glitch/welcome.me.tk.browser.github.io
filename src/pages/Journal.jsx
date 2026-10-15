import { Link } from 'react-router-dom'
import { JOURNAL } from '../data/journal'
import { ArrowRight } from '../components/icons'
import { useReveal } from '../lib/useReveal'
import { formatDate } from '../lib/format'

export default function Journal() {
  const ref = useReveal({ stagger: 0.07 })

  return (
    <div className="page journal" ref={ref}>
      <header className="container page-head">
        <p className="micro micro--muted reveal">Journal</p>
        <h1 className="page-title reveal">Studio notes on form, restraint and rendering cloth.</h1>
        <p className="section-copy reveal">
          Short entries written for this build. No interview subjects, models or external sources are
          claimed.
        </p>
      </header>

      <div className="container">
        <ul className="journal__list">
          {JOURNAL.map((entry) => (
            <li className="journal__item reveal" key={entry.id}>
              <Link to={`/journal/${entry.slug}`} className="journal__link">
                <p className="micro micro--muted">
                  {entry.kicker} · {formatDate(entry.date)} · {entry.readingTime}
                </p>
                <h2 className="journal__title">{entry.title}</h2>
                <p className="journal__excerpt">{entry.excerpt}</p>
                <span className="link-arrow">
                  Read <ArrowRight width={15} height={15} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
