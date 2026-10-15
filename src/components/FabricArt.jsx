import { useEffect, useRef } from 'react'
import { paintFabric } from '../lib/fabricFields'

/**
 * Editorial fabric art.
 *
 * The macro surfaces in the detail chapters are rendered here from a generated
 * height field (real weave/ribbing geometry, shaded from a single soft key), not
 * from a photograph and not as a flat colour swatch. The caption in the UI says
 * so explicitly.
 */
export default function FabricArt({
  kind = 'twill',
  tone = '#2B2C30',
  thread,
  overlay = 'none',
  exposure = 1,
  strength = 2.1,
  className = '',
  caption,
}) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const paint = () => {
      const rect = wrap.getBoundingClientRect()
      // Painted at the size of its container (never wider), so the canvas's
      // intrinsic width can never widen the grid track it sits in.
      const measured = Math.round(rect.width || 0)
      const width = measured > 0 ? Math.min(1100, Math.max(240, measured)) : 720
      const ratio = rect.height && rect.width ? rect.height / rect.width : 0.7
      const height = Math.max(240, Math.min(820, Math.round(width * ratio)))
      const ctx = paintFabric(canvas, {
        width,
        height,
        kind,
        thread: thread || (kind === 'rib' ? 11 : 9),
        tone,
        exposure,
        strength,
      })
      if (!ctx) return

      if (overlay === 'seam') {
        const cx = width * 0.5
        ctx.save()
        // Seam shadow line plus an even topstitch run either side.
        ctx.fillStyle = 'rgba(0,0,0,0.22)'
        ctx.fillRect(cx - 1.5, 0, 3, height)
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.lineWidth = 1.6
        ctx.setLineDash([7, 6])
        ctx.beginPath()
        ctx.moveTo(cx - 12, 0)
        ctx.lineTo(cx - 12, height)
        ctx.moveTo(cx + 12, 0)
        ctx.lineTo(cx + 12, height)
        ctx.stroke()
        ctx.restore()
      }

      if (overlay === 'wordmark') {
        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const size = Math.max(26, Math.round(width * 0.072))
        ctx.font = `600 ${size}px "Inter Variable", Inter, "Helvetica Neue", Arial, sans-serif`
        if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(size * 0.22)}px`
        ctx.fillStyle = 'rgba(0,0,0,0.30)'
        ctx.fillText('ESSENTIALS COLLECTION', width / 2 + 2, height / 2 + 3)
        ctx.fillStyle = 'rgba(255,255,255,0.94)'
        ctx.fillText('ESSENTIALS COLLECTION', width / 2, height / 2)
        ctx.restore()
      }
    }

    paint()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => paint())
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [kind, tone, thread, overlay, exposure, strength])

  return (
    <figure className={`fabric-art ${className}`} ref={wrapRef}>
      <canvas ref={canvasRef} className="fabric-art__canvas" />
      {caption && <figcaption className="fabric-art__caption">{caption}</figcaption>}
    </figure>
  )
}
