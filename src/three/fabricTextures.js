import * as THREE from 'three'
import {
  buildField,
  fieldToNormalBytes,
  fieldToRoughnessBytes,
} from '../lib/fabricFields'

/**
 * Fabric texture singletons for the 3D material: a woven twill and a knit
 * ribbing, both generated at runtime (no external texture files). They are
 * created once and shared by every garment instance; disposeFabricTextures()
 * releases them.
 */
const MAP_SIZE = 512
const cache = {}

function canvasFrom(bytes, size) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.putImageData(new ImageData(bytes, size, size), 0, 0)
  return canvas
}

function makeSet(kind, thread, strength) {
  const field = buildField({ width: MAP_SIZE, height: MAP_SIZE, kind, thread, seed: 3 })
  const normalTex = new THREE.CanvasTexture(
    canvasFrom(fieldToNormalBytes(field, MAP_SIZE, MAP_SIZE, strength), MAP_SIZE),
  )
  const roughTex = new THREE.CanvasTexture(
    canvasFrom(fieldToRoughnessBytes(field, MAP_SIZE, MAP_SIZE, kind === 'rib' ? 0.9 : 0.84), MAP_SIZE),
  )
  for (const tex of [normalTex, roughTex]) {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.anisotropy = 4
    tex.needsUpdate = true
  }
  return { normalTex, roughTex }
}

export function getFabricMaps() {
  if (!cache.twill) cache.twill = makeSet('twill', 9, 2.3)
  if (!cache.rib) cache.rib = makeSet('rib', 11, 2.6)
  return cache
}

export function disposeFabricTextures() {
  Object.values(cache).forEach((set) => {
    set.normalTex?.dispose()
    set.roughTex?.dispose()
  })
}

/**
 * Wordmark alpha texture for the tone-on-tone chest print.
 */
export function getWordmarkAlpha(text = 'ESSENTIALS') {
  if (cache.wordmark) return cache.wordmark
  const w = 1024
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '600 116px "Inter Variable", Inter, "Helvetica Neue", Arial, sans-serif'
    if ('letterSpacing' in ctx) ctx.letterSpacing = '26px'
    ctx.fillText(text, w / 2, h / 2 + 4)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 4
  tex.needsUpdate = true
  cache.wordmark = tex
  return tex
}
