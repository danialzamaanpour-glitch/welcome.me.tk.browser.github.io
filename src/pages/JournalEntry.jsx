import { Link, useParams } from 'react-router-dom'
import { getJournalEntry } from '../data/journal'
import { ArrowRight } from '../components/icons'
import { formatDate } from '../lib/format'
import { useReveal } from '../lib/useReveal'

export default function JournalEntry() {
  const { slug } = useParams()
  const entry = getJournalEntry(slug)
  const ref = useReveal({ stagger: 0.05 })

  if (!entry) {
    return (
      <div className="page container empty-state">
        <p className="empty-state__title">That entry has moved.</p>
        <Link className="btn btn--primary" to="/journal">
          Back to the journal
        </Link>
      </div>
    )
  }

  return (
    <article className="page journal-entry" ref={ref}>
      <div className="container journal-entry__inner">
        <Link className="micro-link reveal" to="/journal">
          <ArrowRight width={15} height={15} style={{ transform: 'rotate(180deg)' }} /> All entries
        </Link>
        <p className="micro micro--muted reveal">
          {entry.kicker} · {formatDate(entry.date)} · {entry.readingTime}
        </p>
        <h1 className="page-title reveal">{entry.title}</h1>
        <div className="journal-entry__body">
          {entry.body.map((paragraph) => (
            <p className="reveal" key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}
        </div>
        <p className="journal-entry__note reveal">
          Written for this demonstration build. Claims about construction in the journal describe the
          rendered model, not a certified factory specification.
        </p>
      </div>
    </article>
  )
}
