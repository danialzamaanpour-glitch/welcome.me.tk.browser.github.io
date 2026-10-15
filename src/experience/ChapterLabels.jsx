/**
 * Editorial detail labels for a chapter.
 *
 * These are interface text, never text baked into the film, and they sit in the
 * chapter's own strip instead of being pinned onto the garment: the film is a
 * moving composition with a changing crop, so a connector line drawn to a
 * feature could not stay truthful from one frame to the next. Each label only
 * names something the presentation actually shows or the catalogue actually
 * states — no composition, weight or specification claims.
 *
 * They arrive with the chapter's own scroll timeline (see the `data-film-label`
 * tweens in each chapter).
 */
export default function ChapterLabels({ labels }) {
  if (!labels?.length) return null

  return (
    <ul className="film-labels" aria-label="What this chapter shows">
      {labels.map((label) => (
        <li className="film-labels__item" data-film-label key={label}>
          <span className="film-labels__rule" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  )
}
