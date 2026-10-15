/**
 * WebGL capability check used to choose between the real-time 3D scene and the
 * layered vector fallback. Never throws.
 */
let cached = null

export function hasWebGL() {
  if (cached !== null) return cached
  try {
    if (typeof window === 'undefined') {
      cached = false
      return cached
    }
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    cached = Boolean(gl && typeof gl.getParameter === 'function')
    // Release the probe context immediately.
    if (gl && typeof gl.getExtension === 'function') {
      const lose = gl.getExtension('WEBGL_lose_context')
      if (lose) lose.loseContext()
    }
  } catch {
    cached = false
  }
  return cached
}
