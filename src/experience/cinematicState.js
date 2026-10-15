/**
 * Shared state for the cinematic presentation.
 *
 * `cinema.progress` is the normalised scroll position (0 → 1) of the whole
 * cinematic section. One writer — the master ScrollTrigger in ScrollExperience —
 * and two readers: the video scrubber maps it onto the film's real duration, and
 * the chapter rail derives the active chapter from it. Keeping it in a module
 * object means scrolling never re-renders React.
 */
export const cinema = { progress: 0 }

/** The five chapters, in scroll order. The rail and the chapters share this list. */
export const CHAPTERS = [
  { id: 'chapter-01', index: '01', label: 'Arrival' },
  { id: 'chapter-02', index: '02', label: 'Form' },
  { id: 'chapter-03', index: '03', label: 'Texture' },
  { id: 'chapter-04', index: '04', label: 'Construction' },
  { id: 'chapter-05', index: '05', label: 'The essential' },
]

/**
 * The film.
 *
 * The source is the Qwen-generated studio sequence of the flagship hoodie
 * (5.04 s, 24 fps), transcoded once for web delivery: 1920 x 912 H.264, closed
 * GOP of 12 frames so scroll seeking stays cheap, audio stripped (the piece is
 * silent and nothing autoplays with sound), faststart for a quick first frame.
 * The poster is that same film's own first frame, so nothing jumps on load.
 */
export const FILM = {
  src: '/media/velora-hoodie.mp4',
  poster: '/media/velora-hoodie-poster.jpg',
  width: 2088,
  height: 992,
  alt: 'The Essential Oversized Hoodie in Charcoal Gray, studio presentation still',
}
