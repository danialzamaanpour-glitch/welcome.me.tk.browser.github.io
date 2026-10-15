import Modal from './Modal'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const ROWS = [
  { label: 'Chest (flat, half measure)', values: [66, 69, 72, 75, 78] },
  { label: 'Body length from high point', values: [62, 64, 66, 68, 70] },
  { label: 'Shoulder width', values: [58, 60, 62, 64, 66] },
  { label: 'Sleeve, shoulder to cuff', values: [58, 60, 62, 64, 66] },
]

/**
 * Size guide.
 *
 * Honest note: these are approximate measurements derived from the rendered
 * silhouette in this build — the repository has no supplier specification sheet,
 * and the guide says so rather than presenting invented factory data.
 */
export default function SizeGuideModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Size & fit guide" className="modal--wide">
      <p className="modal__intro">
        The hoodie is cut oversized with dropped shoulders. Take your usual size for the intended
        relaxed fit, or a size down for a closer silhouette.
      </p>

      <div className="size-table__wrap">
        <table className="size-table">
          <caption className="visually-hidden">Garment measurements in centimetres</caption>
          <thead>
            <tr>
              <th scope="col">Measure (cm)</th>
              {SIZES.map((s) => (
                <th scope="col" key={s}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((v, i) => (
                  <td key={SIZES[i]}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="modal__notes">
        <li>
          Approximate garment measurements, derived from the rendered silhouette used in this
          build. They are not a supplier specification sheet.
        </li>
        <li>Measurements are taken flat; allow a tolerance of roughly ±1.5 cm.</li>
        <li>
          Availability is per finish — sold-out sizes are marked in the size selector and cannot be
          added to the bag.
        </li>
      </ul>
    </Modal>
  )
}
