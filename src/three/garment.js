import * as THREE from 'three'

/**
 * Garment geometry helpers.
 *
 * No GLB/glTF hoodie asset exists in this repository (and none is fetched from
 * the network), so the garment is built as real geometry here: a sculpted body,
 * capsules for the sleeves, a spherical hood shell, extruded rounded-rect rings
 * for the hem band and pocket piping, and geometric folds displaced along the
 * surface normals. It is a genuine 3D object rotating in 3D space — not a flat
 * image being turned.
 */

export function roundedRectShape(w, h, r) {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  const rad = Math.min(r, Math.min(w, h) / 2 - 0.001)
  shape.moveTo(x + rad, y)
  shape.lineTo(x + w - rad, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + rad)
  shape.lineTo(x + w, y + h - rad)
  shape.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  shape.lineTo(x + rad, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - rad)
  shape.lineTo(x, y + rad)
  shape.quadraticCurveTo(x, y, x + rad, y)
  return shape
}

/**
 * A horizontal band wrapping the body (hem) or lying against it (pocket edge):
 * a rounded rectangle with a rounded rectangle hole, extruded and laid flat.
 */
export function bandGeometry({ width, depth, radius, thickness, height, flat = true }) {
  const shape = roundedRectShape(width, depth, radius)
  const inner = roundedRectShape(
    Math.max(0.02, width - thickness * 2),
    Math.max(0.02, depth - thickness * 2),
    Math.max(0.01, radius - thickness * 0.7),
  )
  shape.holes.push(inner)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 8,
  })
  if (flat) geo.rotateX(-Math.PI / 2)
  geo.computeVertexNormals()
  return geo
}

/**
 * A soft-edged box: the flat box surface projected onto a rounded box (core box
 * grown by a sphere of radius r). Subdivided so folds have somewhere to live.
 */
export function roundedBoxGeometry({
  width,
  height,
  depth,
  radius = 0.28,
  segments = [16, 14, 10],
}) {
  const geo = new THREE.BoxGeometry(width, height, depth, segments[0], segments[1], segments[2])
  const hx = width / 2
  const hy = height / 2
  const hz = depth / 2
  const r = Math.min(radius, hx, hy, hz)
  const cx = hx - r
  const cy = hy - r
  const cz = hz - r
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const qx = Math.max(-cx, Math.min(cx, x))
    const qy = Math.max(-cy, Math.min(cy, y))
    const qz = Math.max(-cz, Math.min(cz, z))
    let dx = x - qx
    let dy = y - qy
    let dz = z - qz
    const len = Math.hypot(dx, dy, dz)
    if (len > 1e-6) {
      dx /= len
      dy /= len
      dz /= len
    }
    pos.setXYZ(i, qx + dx * r, qy + dy * r, qz + dz * r)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/** Every piece of the hoodie, built once per model instance. */
export function createGarmentGeometries(detail = 'full') {
  const hi = detail === 'full'
  const body = roundedBoxGeometry({
    width: 1.44,
    height: 1.18,
    depth: 0.74,
    radius: 0.3,
    segments: hi ? [16, 14, 10] : [10, 8, 6],
  })
  sculptCloth(body, { taperTop: 0.94, foldAmp: 0.024, freq: 1, seed: 0.4 })

  const sleeve = new THREE.CapsuleGeometry(0.215, 0.7, hi ? 8 : 4, hi ? 26 : 14)
  taperAlongY(sleeve, { bottom: 0.82, top: 1 })
  sculptCloth(sleeve, { taperTop: 1, foldAmp: 0.014, freq: 1.5, seed: 1.9 })

  const cuff = new THREE.CylinderGeometry(0.228, 0.222, 0.17, hi ? 32 : 18, 3, true)

  const hem = bandGeometry({
    width: 1.47,
    depth: 0.77,
    radius: 0.3,
    thickness: 0.06,
    height: 0.15,
  })

  const pocket = bandGeometry({
    width: 0.84,
    depth: 0.45,
    radius: 0.17,
    thickness: 0.055,
    height: 0.1,
    flat: false,
  })

  const hood = new THREE.SphereGeometry(0.52, hi ? 56 : 28, hi ? 32 : 16, 0, Math.PI * 2, 0, Math.PI * 0.62)
  const hoodInner = new THREE.SphereGeometry(0.5, hi ? 28 : 16, hi ? 18 : 10, 0, Math.PI * 2, 0, Math.PI * 0.6)
  const collar = new THREE.TorusGeometry(0.315, 0.058, hi ? 14 : 8, hi ? 48 : 24)
  const cord = new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8)
  const toggle = new THREE.SphereGeometry(0.026, 12, 10)

  const wordmark = new THREE.PlaneGeometry(0.46, 0.115, 16, 1)
  const wp = wordmark.attributes.position
  for (let i = 0; i < wp.count; i++) {
    const x = wp.getX(i)
    // Bend the decal to follow the chest curvature.
    wp.setZ(i, -x * x * 1.35)
  }
  wp.needsUpdate = true
  wordmark.computeVertexNormals()

  return { body, sleeve, cuff, hem, pocket, hood, hoodInner, collar, cord, toggle, wordmark }
}

const smoothstep = (t) => t * t * (3 - 2 * t)

/**
 * Cloth sculpture: gentle taper through the body plus layered fold displacement
 * along the surface normal, so light catches real geometry rather than a print.
 */
export function sculptCloth(geometry, { taperTop = 0.93, foldAmp = 0.022, freq = 1, seed = 0 } = {}) {
  geometry.computeBoundingBox()
  const bb = geometry.boundingBox
  const minY = bb.min.y
  const maxY = bb.max.y
  const span = Math.max(0.0001, maxY - minY)
  const pos = geometry.attributes.position
  const nrm = geometry.attributes.normal
  const v = new THREE.Vector3()
  const n = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    n.fromBufferAttribute(nrm, i)
    const t = (v.y - minY) / span
    // Shoulders narrow slightly; the hem stays boxy. Oversized silhouette.
    const s = 1 - (1 - taperTop) * smoothstep(Math.min(1, Math.max(0, (t - 0.45) / 0.55)))
    v.x *= s
    v.z *= s
    // Folds: two crossing wave fields plus a low-frequency drape, strongest in
    // the body of the garment and damped at the trims.
    const a = Math.sin(v.x * 5.1 * freq + v.z * 2.4 + seed * 1.7)
    const b = Math.cos(v.y * 6.3 * freq - v.x * 2.1 + seed * 0.9)
    const drape = Math.sin(v.x * 2.2 + v.y * 1.4 + seed * 2.3) * 0.6
    const edgeDamp = 1 - Math.abs(t - 0.5) * 1.1
    const offset = (a * b * 0.55 + drape * 0.45) * foldAmp * edgeDamp
    v.addScaledVector(n, offset)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

/** Slight taper along the local Y axis (sleeves narrow towards the cuff). */
export function taperAlongY(geometry, { bottom = 0.78, top = 1 } = {}) {
  geometry.computeBoundingBox()
  const bb = geometry.boundingBox
  const span = Math.max(0.0001, bb.max.y - bb.min.y)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const t = (y - bb.min.y) / span
    const s = bottom + (top - bottom) * t
    pos.setXYZ(i, x * s, y, z * s)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

/**
 * A garment measurement sheet is not available, so the size guide reports the
 * measurements of this rendered model as an explicit approximation.
 */
export function lighten(hex, amount = 0.15) {
  const c = new THREE.Color(hex)
  const hsl = {}
  c.getHSL(hsl)
  c.setHSL(hsl.h, hsl.s, Math.min(1, hsl.l + amount))
  return `#${c.getHexString()}`
}

export function darken(hex, amount = 0.2) {
  const c = new THREE.Color(hex)
  const hsl = {}
  c.getHSL(hsl)
  c.setHSL(hsl.h, hsl.s, Math.max(0, hsl.l - amount))
  return `#${c.getHexString()}`
}
