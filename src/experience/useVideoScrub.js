import { useEffect, useRef, useState } from 'react'
import { cinema } from './cinematicState'
import { gsap } from './useChapterScope'

/**
 * Half a frame at 24 fps: below this, seeking could not change the picture, so
 * the seek is skipped and no redundant work reaches the decoder.
 */
const SEEK_EPSILON = 1 / 48

/**
 * Scroll-controlled film playback.
 *
 * The video is never played: it is *scrubbed*. Every animation frame this hook
 * reads the normalised scroll progress of the cinematic section, converts it to
 * a time inside the film's real duration (`loadedmetadata` supplies it — nothing
 * about the clip's length is assumed), and moves the video's playhead there.
 * Scrolling forward runs the film forward, scrolling back runs it back.
 *
 * Two rules keep it cheap and stable:
 * - only one seek is ever in flight; while the browser is seeking, the newest
 *   target is parked and applied on the `seeked` event, so a fast scroll
 *   converges instead of queueing up work;
 * - a target closer than half a frame to the current position is ignored.
 *
 * Metadata never touches the visitor's scroll position: the film follows the
 * page, never the other way round.
 *
 * Returns the ref to attach to the `<video>` and a status of
 * `loading | ready | failed | static` (static = reduced motion, no scrubbing).
 */
export function useVideoScrub({ enabled = true } = {}) {
  const videoRef = useRef(null)
  const durationRef = useRef(0)
  const pendingRef = useRef(null)
  const [status, setStatus] = useState(enabled ? 'loading' : 'static')

  useEffect(() => {
    const video = videoRef.current
    if (!enabled || !video) return undefined

    let failed = false

    const targetTime = () => {
      const duration = durationRef.current
      if (!duration) return null
      return Math.min(Math.max(cinema.progress, 0), 1) * duration
    }

    const tick = () => {
      if (failed || !durationRef.current || video.readyState < 2) return
      const target = targetTime()
      if (target === null) return
      if (video.seeking) {
        pendingRef.current = target
        return
      }
      if (Math.abs(video.currentTime - target) < SEEK_EPSILON) return
      video.currentTime = target
    }

    const onMetadata = () => {
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) {
        failed = true
        setStatus('failed')
        return
      }
      durationRef.current = duration
      video.pause()
      // Open on the frame the visitor's scroll position asks for — which is the
      // film's first frame when the presentation loads at the top of the page.
      const target = targetTime()
      if (target !== null) video.currentTime = target
      setStatus('ready')
    }

    const onSeeked = () => {
      const pending = pendingRef.current
      pendingRef.current = null
      if (pending === null) return
      if (Math.abs(video.currentTime - pending) < SEEK_EPSILON) return
      video.currentTime = pending
    }

    const onError = () => {
      failed = true
      setStatus('failed')
    }

    video.addEventListener('loadedmetadata', onMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    // Metadata can already have arrived before this effect ran.
    if (video.readyState >= 1) onMetadata()

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      video.removeEventListener('loadedmetadata', onMetadata)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
    }
  }, [enabled])

  return { videoRef, status }
}
