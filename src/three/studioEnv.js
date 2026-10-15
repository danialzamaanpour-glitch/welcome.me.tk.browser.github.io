import * as THREE from 'three'

/**
 * Procedural studio environment (equirectangular). A bright overhead soft box,
 * a dimmer fill card and a soft floor gradient — generated locally, then run
 * through PMREM so the physical material gets believable diffuse reflections.
 * No HDRI is downloaded.
 */
export function makeStudioEquirect() {
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#ffffff')
  sky.addColorStop(0.45, '#f4f4f3')
  sky.addColorStop(0.58, '#dcdcdb')
  sky.addColorStop(0.72, '#c8c8c7')
  sky.addColorStop(1, '#9d9d9c')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  // Overhead key soft box.
  const key = ctx.createRadialGradient(w * 0.28, h * 0.16, 4, w * 0.28, h * 0.16, w * 0.34)
  key.addColorStop(0, 'rgba(255,255,255,1)')
  key.addColorStop(0.5, 'rgba(255,255,255,0.55)')
  key.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = key
  ctx.fillRect(0, 0, w, h)

  // Broad fill card on the opposite side.
  const fill = ctx.createRadialGradient(w * 0.78, h * 0.34, 4, w * 0.78, h * 0.34, w * 0.3)
  fill.addColorStop(0, 'rgba(255,255,255,0.85)')
  fill.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, w, h)

  // Gentle horizon shadow band so the lower hemisphere stays calm.
  const floor = ctx.createLinearGradient(0, h * 0.66, 0, h)
  floor.addColorStop(0, 'rgba(120,120,120,0)')
  floor.addColorStop(1, 'rgba(70,70,70,0.5)')
  ctx.fillStyle = floor
  ctx.fillRect(0, h * 0.6, w, h * 0.4)

  return canvas
}
