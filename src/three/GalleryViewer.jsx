import { useCallback, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import HoodieModel from './HoodieModel'
import { StudioEnvironment, StudioFloor, StudioLights } from './StudioLights'
import { useInView } from '../lib/useInView'
import { useIsMobile, usePrefersReducedMotion } from '../lib/motion'
import { sampleCamera, CAMERA_KEYS } from './sceneState'

/**
 * Interactive product viewer for the flagship piece: a real 3D object on a real
 * turntable. Drag to orbit, use the angle presets, zoom with the buttons.
 *
 * Wheel and pinch are deliberately NOT captured, so the page keeps scrolling
 * normally over the canvas; vertical touch gestures stay with the page
 * (touch-action: pan-y).
 */
export const VIEW_PRESETS = [
  { id: 'front', label: 'Front', azimuth: 0, zoom: 3.25, tilt: 0 },
  { id: 'three-quarter', label: 'Three quarter', azimuth: -0.85, zoom: 3.35, tilt: 0.02 },
  { id: 'side', label: 'Side', azimuth: -1.62, zoom: 3.3, tilt: 0 },
  { id: 'back', label: 'Back', azimuth: -2.92, zoom: 3.45, tilt: -0.02 },
  { id: 'detail', label: 'Detail', azimuth: -0.32, zoom: 1.72, tilt: 0.28 },
]

export default function GalleryViewer({ color, ariaLabel }) {
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { rootMargin: '160px' })
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const [preset, setPreset] = useState('three-quarter')

  const spin = useRef({
    azimuth: -0.85,
    targetAzimuth: -0.85,
    tilt: 0.02,
    targetTilt: 0.02,
    zoom: 3.35,
    targetZoom: 3.35,
    dragging: false,
    lastX: 0,
    lastY: 0,
    custom: false,
  })

  const lightSample = useRef(
    sampleCamera(0.69, CAMERA_KEYS), // studio-spectrum lighting
  )

  const applyPreset = useCallback(
    (next) => {
      const found = VIEW_PRESETS.find((p) => p.id === next)
      if (!found) return
      setPreset(found.id)
      spin.current.targetAzimuth = found.azimuth
      spin.current.targetTilt = found.tilt
      spin.current.targetZoom = found.zoom
      spin.current.custom = false
    },
    [],
  )

  const onPointerDown = (e) => {
    const s = spin.current
    s.dragging = true
    s.lastX = e.clientX
    s.lastY = e.clientY
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    const s = spin.current
    if (!s.dragging) return
    const dx = e.clientX - s.lastX
    const dy = e.clientY - s.lastY
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.targetAzimuth -= dx * 0.011
    s.targetTilt = Math.max(-0.34, Math.min(0.5, s.targetTilt + dy * 0.005))
    s.custom = true
    setPreset((p) => (p === 'custom' ? p : 'custom'))
  }

  const endDrag = (e) => {
    spin.current.dragging = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const zoomBy = (delta) => {
    const s = spin.current
    s.targetZoom = Math.max(1.6, Math.min(4.6, s.targetZoom + delta))
  }

  const onKeyDown = (e) => {
    const s = spin.current
    const step = 0.25
    if (e.key === 'ArrowLeft') s.targetAzimuth += step
    else if (e.key === 'ArrowRight') s.targetAzimuth -= step
    else if (e.key === 'ArrowUp') s.targetTilt = Math.min(0.5, s.targetTilt + 0.08)
    else if (e.key === 'ArrowDown') s.targetTilt = Math.max(-0.34, s.targetTilt - 0.08)
    else if (e.key === '+' || e.key === '=') zoomBy(-0.3)
    else if (e.key === '-') zoomBy(0.3)
    else if (e.key === '0') applyPreset('front')
    else return
    e.preventDefault()
    s.custom = true
    setPreset('custom')
  }

  const presetLabel = useMemo(
    () => VIEW_PRESETS.find((p) => p.id === preset)?.label ?? 'Custom angle',
    [preset],
  )

  return (
    <div className="viewer">
      <div
        className="viewer__surface"
        ref={wrapRef}
        role="application"
        aria-label={ariaLabel || 'Interactive 3D product viewer'}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <Canvas
          frameloop={inView ? 'always' : 'never'}
          shadows={!isMobile}
          dpr={isMobile ? [1, 1.3] : [1, 1.75]}
          camera={{ position: [-2.6, 0.22, 2.1], fov: 32, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <ViewerRig spin={spin} reduced={reduced} />
          <StudioEnvironment />
          <StudioLights sampleRef={lightSample} castShadow={!isMobile} />
          <HoodieModel color={color} detail={isMobile ? 'reduced' : 'full'} showWordmark />
          <StudioFloor shadows={!isMobile} resolution={isMobile ? 256 : 512} />
        </Canvas>
      </div>

      <div className="viewer__controls">
        <div className="viewer__presets" role="group" aria-label="Viewing angle">
          {VIEW_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="viewer__chip"
              aria-pressed={preset === p.id}
              onClick={() => applyPreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="viewer__zoom" role="group" aria-label="Zoom">
          <button type="button" className="viewer__chip viewer__chip--icon" onClick={() => zoomBy(0.35)} aria-label="Zoom out">
            −
          </button>
          <button type="button" className="viewer__chip viewer__chip--icon" onClick={() => zoomBy(-0.35)} aria-label="Zoom in">
            +
          </button>
        </div>
      </div>

      <p className="viewer__hint" aria-live="polite">
        <span className="viewer__hint-strong">{presetLabel}</span>
        <span className="viewer__hint-text">
          Drag to rotate · arrow keys to nudge · scroll to keep browsing
        </span>
      </p>
    </div>
  )
}

function ViewerRig({ spin, reduced }) {
  const camera = useThree((s) => s.camera)

  useFrame((_, delta) => {
    const s = spin.current
    const k = reduced ? 1 : 1 - Math.exp(-delta * 9)
    s.azimuth += (s.targetAzimuth - s.azimuth) * k
    s.tilt += (s.targetTilt - s.tilt) * k
    s.zoom += (s.targetZoom - s.zoom) * k
    const d = s.zoom
    camera.position.set(Math.sin(s.azimuth) * d * 0.38, 0.24 + s.tilt * 1.6, Math.cos(s.azimuth) * d)
    camera.lookAt(0, 0.2 + s.tilt * 0.6, 0)
  })

  return null
}
