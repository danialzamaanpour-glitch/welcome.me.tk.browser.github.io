/**
 * Scroll-driven scene state.
 *
 * One mutable rig object is written by the scroll controller and read inside the
 * render loop, so scrolling never triggers React re-renders.
 */

export const rig = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
}

export function resetRig() {
  rig.progress = 0
  rig.pointerX = 0
  rig.pointerY = 0
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
export const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Camera and model keyframes along the master scroll progress. `at` values line
 * up with the chapter boundaries of the experience section, and `posX` slides
 * the garment across the frame so editorial copy always has clear space.
 */
export const CAMERA_KEYS = [
  {
    at: 0.0,
    label: 'arrival',
    position: [-0.1, 0.16, 3.45],
    target: [0, 0.18, 0],
    rotY: -0.34,
    rotX: 0.06,
    posX: 0.24,
    posY: 0,
    scale: 1,
    fov: 32,
    keyLight: 1.85,
    rimLight: 0.75,
    fillLight: 0.55,
  },
  {
    at: 0.07,
    label: 'arrival-in',
    position: [-0.02, 0.14, 3.1],
    target: [0, 0.2, 0],
    rotY: -0.52,
    rotX: 0.04,
    posX: 0.3,
    posY: 0.02,
    scale: 1.03,
    fov: 32,
    keyLight: 1.8,
    rimLight: 0.85,
    fillLight: 0.55,
  },
  {
    at: 0.15,
    label: 'motion-three-quarter',
    position: [1.05, 0.34, 2.95],
    target: [0, 0.2, 0],
    rotY: -0.85,
    rotX: 0.02,
    posX: 0.42,
    posY: 0.02,
    scale: 1.05,
    fov: 32,
    keyLight: 1.7,
    rimLight: 1.0,
    fillLight: 0.6,
  },
  {
    at: 0.25,
    label: 'motion-side',
    position: [1.95, 0.3, 2.1],
    target: [0, 0.22, 0],
    rotY: -1.62,
    rotX: 0,
    posX: 0.5,
    posY: 0.02,
    scale: 1.02,
    fov: 32,
    keyLight: 1.55,
    rimLight: 1.25,
    fillLight: 0.6,
  },
  {
    at: 0.34,
    label: 'motion-back',
    position: [0.72, 0.62, 2.9],
    target: [0, 0.24, 0],
    rotY: -2.92,
    rotX: -0.06,
    posX: 0.44,
    posY: 0.02,
    scale: 1.0,
    fov: 32,
    keyLight: 1.5,
    rimLight: 1.35,
    fillLight: 0.62,
  },
  {
    at: 0.42,
    label: 'detail-fabric',
    position: [1.0, 0.18, 1.5],
    target: [0.1, 0.06, 0.2],
    rotY: -1.75,
    rotX: 0.04,
    posX: 0.36,
    posY: 0.02,
    scale: 1.12,
    fov: 30,
    keyLight: 1.45,
    rimLight: 1.15,
    fillLight: 0.6,
  },
  {
    at: 0.51,
    label: 'detail-construction',
    position: [0.66, 0.92, 1.62],
    target: [-0.02, 0.6, 0],
    rotY: -1.15,
    rotX: 0.2,
    posX: 0.32,
    posY: 0.02,
    scale: 1.1,
    fov: 30,
    keyLight: 1.4,
    rimLight: 1.1,
    fillLight: 0.6,
  },
  {
    at: 0.6,
    label: 'detail-signature',
    position: [0.3, 0.42, 1.22],
    target: [0.02, 0.3, 0.32],
    rotY: -0.28,
    rotX: 0.12,
    posX: 0.34,
    posY: 0.02,
    scale: 1.08,
    fov: 28,
    keyLight: 1.35,
    rimLight: 0.95,
    fillLight: 0.68,
  },
  {
    at: 0.69,
    label: 'spectrum-front',
    position: [0, 0.2, 3.0],
    target: [0, 0.2, 0],
    rotY: 0,
    rotX: 0.02,
    posX: 0.3,
    posY: 0.02,
    scale: 1,
    fov: 32,
    keyLight: 1.9,
    rimLight: 0.8,
    fillLight: 0.6,
  },
  {
    at: 0.8,
    label: 'silhouette-wide',
    // A three-quarter pull-back rather than a flat side-on view: the hood,
    // shoulder line and sleeves all stay legible from here.
    position: [-0.38, 0.4, 3.55],
    target: [0, 0.2, 0],
    rotY: -0.5,
    rotX: 0.02,
    posX: -0.52,
    posY: 0.04,
    scale: 1.06,
    fov: 32,
    keyLight: 1.95,
    rimLight: 0.9,
    fillLight: 0.58,
  },
  {
    at: 0.93,
    label: 'silhouette-resolve',
    position: [-0.3, 0.32, 3.35],
    target: [0, 0.2, 0],
    rotY: -0.34,
    rotX: 0.02,
    posX: -0.16,
    posY: 0.02,
    scale: 0.98,
    fov: 32,
    keyLight: 1.85,
    rimLight: 0.85,
    fillLight: 0.55,
  },
  {
    at: 1.0,
    label: 'exit',
    position: [0, 0.3, 3.4],
    target: [0, 0.2, 0],
    rotY: -0.2,
    rotX: 0.02,
    posX: 0,
    posY: 0.02,
    scale: 0.94,
    fov: 32,
    keyLight: 1.8,
    rimLight: 0.9,
    fillLight: 0.55,
  },
]

export function sampleCamera(progress, keys = CAMERA_KEYS) {
  const p = clamp(progress, 0, 1)
  let i = 0
  while (i < keys.length - 2 && p > keys[i + 1].at) i++
  const a = keys[i]
  const b = keys[i + 1]
  const span = Math.max(1e-6, b.at - a.at)
  const t = clamp((p - a.at) / span, 0, 1)
  const e = easeInOut(t)
  return {
    label: t < 0.5 ? a.label : b.label,
    position: [
      lerp(a.position[0], b.position[0], e),
      lerp(a.position[1], b.position[1], e),
      lerp(a.position[2], b.position[2], e),
    ],
    target: [
      lerp(a.target[0], b.target[0], e),
      lerp(a.target[1], b.target[1], e),
      lerp(a.target[2], b.target[2], e),
    ],
    rotY: lerp(a.rotY, b.rotY, e),
    rotX: lerp(a.rotX, b.rotX, e),
    posX: lerp(a.posX, b.posX, e),
    posY: lerp(a.posY, b.posY, e),
    scale: lerp(a.scale, b.scale, e),
    fov: lerp(a.fov, b.fov, e),
    keyLight: lerp(a.keyLight, b.keyLight, e),
    rimLight: lerp(a.rimLight, b.rimLight, e),
    fillLight: lerp(a.fillLight, b.fillLight, e),
  }
}

/**
 * Composition per viewport width.
 *
 * Desktop slides the garment across the frame so editorial copy always has clear
 * space. Narrower viewports lift the piece into the upper half and pull the
 * camera back, because the copy is bottom-aligned there — nothing gets cropped
 * and the copy never sits on top of the product.
 */
export function layoutFor(width) {
  if (width > 1100) {
    return { model: { xScale: 1, y: 0, scale: 1 }, adjust: (s) => s }
  }
  if (width > 820) {
    return {
      model: { xScale: 0.7, y: 0.7, scale: 0.78 },
      adjust: (s) => ({
        ...s,
        position: [s.position[0] * 0.7, s.position[1] + 0.08, s.position[2] * 1.12],
        target: [0, s.target[1] + 0.1, 0],
      }),
    }
  }
  return {
    model: { xScale: 0.2, y: 0.8, scale: 0.68 },
    adjust: (s) => ({
      ...s,
      position: [s.position[0] * 0.55, s.position[1] + 0.16, s.position[2] * 1.3],
      target: [0, s.target[1] + 0.28, 0],
    }),
  }
}
