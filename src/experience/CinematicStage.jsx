import { FILM } from './cinematicState'
import { useVideoScrub } from './useVideoScrub'

/**
 * The cinematic stage: the generated studio film of the flagship hoodie.
 *
 * There is no autoplay, no loop and no player chrome — the film's playhead *is*
 * the visitor's scroll position (see useVideoScrub), so the garment is explored
 * by scrolling the page rather than by watching a clip run.
 *
 * The stage is a CSS sticky element, not a pinned scroll-jack, so page
 * navigation keeps working normally. Until the first frame is decodable the
 * poster (the film's own opening frame) is on screen, so the stage never shows
 * a black rectangle; if the film cannot be loaded at all the poster stays as a
 * still presentation and the rest of the page is untouched.
 */
export default function CinematicStage({ reduced }) {
  const { videoRef, status } = useVideoScrub({ enabled: !reduced })
  const still = reduced || status === 'failed'

  return (
    <div className="stage">
      <div className="stage__media">
        <figure className="cinema">
          {still ? (
            <img className="cinema__video" src={FILM.poster} alt={FILM.alt} decoding="async" />
          ) : (
            <video
              ref={videoRef}
              className="cinema__video"
              src={FILM.src}
              poster={FILM.poster}
              preload="auto"
              muted
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
            />
          )}
          {status === 'loading' && (
            <span className="cinema__status micro micro--muted">Loading the film</span>
          )}
        </figure>
      </div>
    </div>
  )
}
