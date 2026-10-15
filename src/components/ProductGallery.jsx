import { useState } from 'react'
import GarmentArt from './GarmentArt'
import GalleryViewer from '../three/GalleryViewer'
import { colorById } from '../data/products'
import { ArrowRight, Cube } from './icons'

const ANGLES = [
  { id: 'front', label: 'Front' },
  { id: 'three', label: 'Three quarter' },
  { id: 'side', label: 'Side' },
  { id: 'detail', label: 'Detail' },
]

/**
 * Product gallery.
 *
 * The flagship piece gets the real 3D viewer (orbit, presets, zoom). Pieces
 * without a model get illustrated views, clearly labelled as illustrations —
 * this repository ships no product photography and no extra GLB assets, and the
 * UI never pretends otherwise.
 */
export default function ProductGallery({ product, colorId }) {
  const [angle, setAngle] = useState(0)
  const color = colorById(product, colorId)

  if (product.has3D) {
    return (
      <div className="gallery gallery--three">
        <GalleryViewer
          color={color.hex}
          ariaLabel={`Interactive 3D viewer — ${product.name} in ${color.name}`}
        />
        <p className="gallery__note">
          <Cube width={15} height={15} />
          Real-time 3D. No GLB garment asset exists in this repository, so the piece is generated
          geometry with runtime-generated fabric, lit in a studio scene.
        </p>
      </div>
    )
  }

  const step = (delta) => setAngle((i) => (i + delta + ANGLES.length) % ANGLES.length)

  return (
    <div className="gallery">
      <div className="gallery__stage">
        <GarmentArt
          kind={product.kind}
          color={color.hex}
          angle={ANGLES[angle].id}
          title={`${product.name} in ${color.name} — illustrated ${ANGLES[angle].label.toLowerCase()} view`}
          className="garment-art--stage"
        />
        <div className="gallery__nav">
          <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="Previous view">
            <ArrowRight width={16} height={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <span className="micro">
            {angle + 1} / {ANGLES.length} · {ANGLES[angle].label}
          </span>
          <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="Next view">
            <ArrowRight width={16} height={16} />
          </button>
        </div>
      </div>

      <ul className="gallery__thumbs">
        {ANGLES.map((a, i) => (
          <li key={a.id}>
            <button
              type="button"
              className={`gallery__thumb${i === angle ? ' is-active' : ''}`}
              onClick={() => setAngle(i)}
              aria-pressed={i === angle}
              aria-label={`${a.label} view`}
            >
              <GarmentArt kind={product.kind} color={color.hex} angle={a.id} className="garment-art--thumb" />
              <span className="visually-hidden">{a.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="gallery__note">
        Illustrated views. This build has no photography and no 3D model for this piece, so the
        angles are drawn rather than photographed.
      </p>
    </div>
  )
}
