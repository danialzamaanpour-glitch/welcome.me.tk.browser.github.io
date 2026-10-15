/**
 * Procedural fabric fields.
 *
 * The repository ships no texture files, so the weave, the knit ribbing and the
 * brushed fleece surface used by both the 3D garment and the editorial detail
 * art are generated here as real height fields. The same field is then turned
 * into a tangent-space normal map (for the 3D material) or shaded into a canvas
 * (for the DOM detail art), which keeps the two presentations consistent.
 */

export function hash2(x, y) {
  let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}

/** Smoothed value noise. */
export function valueNoise(x, y, scale) {
  const sx = x / scale
  const sy = y / scale
  const x0 = Math.floor(sx)
  const y0 = Math.floor(sy)
  const fx = sx - x0
  const fy = sy - y0
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash2(x0, y0)
  const b = hash2(x0 + 1, y0)
  const c = hash2(x0, y0 + 1)
  const d = hash2(x0 + 1, y0 + 1)
  return (a * (1 - ux) + b * ux) * (1 - uy) + (c * (1 - ux) + d * ux) * uy
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * Height field in [0,1] describing a fabric surface.
 * kind: 'twill' (woven), 'rib' (knit ribbing), 'fleece' (brushed/looped).
 */
export function buildField({ width, height, kind = 'twill', thread = 9, seed = 1 }) {
  const field = new Float32Array(width * height)
  const col = thread * 1.15
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let h
      if (kind === 'rib') {
        const fx = (x % col) / col - 0.5
        const rx = Math.sqrt(Math.max(0, 0.25 - fx * fx)) * 2
        const course = Math.sin((y / (thread * 0.85)) * Math.PI * 2) * 0.5 + 0.5
        h = 0.26 + 0.5 * rx + 0.1 * course
      } else if (kind === 'fleece') {
        h = 0.42 + valueNoise(x + seed * 31, y, 6.5) * 0.3 + valueNoise(x, y + seed * 17, 2.6) * 0.16
      } else {
        const ix = Math.floor(x / thread)
        const iy = Math.floor(y / thread)
        const fx = (x % thread) / thread - 0.5
        const fy = (y % thread) / thread - 0.5
        const warpUp = (ix + 2 * iy) % 4 < 2
        const rx = Math.sqrt(Math.max(0, 0.25 - fx * fx)) * 2
        const ry = Math.sqrt(Math.max(0, 0.25 - fy * fy)) * 2
        h = warpUp ? 0.34 + 0.42 * rx + 0.12 * ry : 0.27 + 0.42 * ry + 0.12 * rx
        h += (valueNoise(x, y, 4.2) - 0.5) * 0.09
      }
      field[y * width + x] = clamp01(h)
    }
  }
  return field
}

const wrap = (v, max) => (v < 0 ? max - 1 : v >= max ? 0 : v)

/** Tangent-space normal map (RGB bytes) derived from the height field. */
export function fieldToNormalBytes(field, width, height, strength = 2.1) {
  const out = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const l = field[y * width + wrap(x - 1, width)]
      const r = field[y * width + wrap(x + 1, width)]
      const u = field[wrap(y - 1, height) * width + x]
      const d = field[wrap(y + 1, height) * width + x]
      const nx = (l - r) * strength
      const ny = (u - d) * strength
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1)
      const i = (y * width + x) * 4
      out[i] = (nx * inv * 0.5 + 0.5) * 255
      out[i + 1] = (ny * inv * 0.5 + 0.5) * 255
      out[i + 2] = (inv * 0.5 + 0.5) * 255
      out[i + 3] = 255
    }
  }
  return out
}

/** Roughness map (grayscale bytes) derived from the same field. */
export function fieldToRoughnessBytes(field, width, height, base = 0.82, range = 0.16) {
  const out = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    const v = clamp01(base + (1 - field[i]) * range)
    const g = v * 255
    out[i * 4] = g
    out[i * 4 + 1] = g
    out[i * 4 + 2] = g
    out[i * 4 + 3] = 255
  }
  return out
}

export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/**
 * Paints a shaded fabric macro onto a 2D canvas: the height field is lit from
 * the upper left with soft ambient occlusion in the valleys, then toned.
 * This is a rendered surface, not a photograph.
 */
export function paintFabric(canvas, options = {}) {
  const {
    width = 900,
    height = 620,
    kind = 'twill',
    thread = 9,
    tone = '#2B2C30',
    strength = 2.1,
    exposure = 1,
    vignette = 0.42,
    seed = 1,
  } = options
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  canvas.width = width
  canvas.height = height

  const field = buildField({ width, height, kind, thread, seed })
  const img = ctx.createImageData(width, height)
  const rgb = hexToRgb(tone)
  const at = (x, y) => field[wrap(y, height) * width + wrap(x, width)]
  const lx = -0.52
  const ly = -0.68
  const lz = 0.52
  const cx = width * 0.42
  const cy = height * 0.34
  const maxR = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy))

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const h = at(x, y)
      const nxS = (at(x - 1, y) - at(x + 1, y)) * strength
      const nyS = (at(x, y - 1) - at(x, y + 1)) * strength
      const inv = 1 / Math.sqrt(nxS * nxS + nyS * nyS + 1)
      const nxn = nxS * inv
      const nyn = nyS * inv
      const nzn = inv
      const lam = Math.max(0, nxn * lx + nyn * ly + nzn * lz)
      const ambient = 0.34 + 0.3 * h
      const spec = Math.pow(lam, 9) * 0.09
      // Soft field falloff keeps the macro from looking flat.
      const r = Math.hypot(x - cx, y - cy) / maxR
      const falloff = 1 - vignette * r * r
      // Gentle large-scale undulation, as cloth never sits perfectly flat.
      const drift = 0.92 + 0.16 * valueNoise(x, y, 90)
      const shade = clamp01((ambient + 0.82 * lam) * falloff * exposure * drift)
      const i = (y * width + x) * 4
      const spec255 = spec * 255
      img.data[i] = Math.min(255, rgb.r * shade + spec255)
      img.data[i + 1] = Math.min(255, rgb.g * shade + spec255)
      img.data[i + 2] = Math.min(255, rgb.b * shade + spec255)
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return ctx
}
