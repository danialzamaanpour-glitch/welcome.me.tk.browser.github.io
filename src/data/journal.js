/**
 * Studio Journal.
 *
 * Short editorial entries written for this build. No external sources, models or
 * photography are claimed anywhere in them.
 */
export const JOURNAL = [
  {
    id: 'proportion-before-detail',
    slug: 'proportion-before-detail',
    title: 'Proportion Before Detail',
    kicker: 'Studio Notes',
    date: '2026-08-18',
    readingTime: '3 min',
    excerpt:
      'Why the oversized silhouette is drafted first and the detailing is added last — and what that changes about the way a garment reads.',
    body: [
      'A silhouette is a decision made before any detail exists. When the shoulder line, body width and hem length are settled first, every detail afterwards has a frame to sit inside.',
      'That order is why the Essential Oversized Hoodie reads as one shape rather than a collection of parts. The dropped shoulder creates the volume; the ribbed hem stops it; the hood provides the vertical.',
      'On screen we present it the same way: the shape first, the lighting second, the words last.',
    ],
  },
  {
    id: 'monochrome-discipline',
    slug: 'monochrome-discipline',
    title: 'The Discipline Of Monochrome',
    kicker: 'Art Direction',
    date: '2026-07-22',
    readingTime: '4 min',
    excerpt:
      'Working in white, gray and charcoal removes colour as a crutch. What is left has to carry the composition.',
    body: [
      'A monochrome palette is unforgiving. Without colour to separate surfaces, contrast, spacing and weight do the work instead.',
      'In this presentation the garment is the only object with density: everything behind it is soft white, everything in front of it is type. Fabric texture is the single source of visual interest.',
      'The discipline is simple — if an element cannot justify its contrast, it is removed.',
    ],
  },
  {
    id: 'rendering-fabric',
    slug: 'rendering-fabric',
    title: 'Rendering Fabric Honestly',
    kicker: 'Craft',
    date: '2026-06-30',
    readingTime: '5 min',
    excerpt:
      'What a real-time garment needs to look like cloth: soft key light, low specular response, and surface variation that never repeats.',
    body: [
      'Cloth does not behave like plastic. It scatters light unevenly, holds soft shadow in every fold, and has almost no mirror response.',
      'So the material is built with high roughness, low specularity and a generated weave normal map that breaks up the surface at close range. Folds are real geometry, not a printed texture.',
      'The result is not a photograph of a hoodie. It is a hoodie-shaped studio object, lit with restraint — which is the honest version of what this environment can do.',
    ],
  },
]

export const getJournalEntry = (slug) => JOURNAL.find((e) => e.slug === slug) || null
