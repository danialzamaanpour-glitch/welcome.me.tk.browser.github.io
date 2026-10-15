import Modal from '../ui/Modal.jsx'
import { SIZE_CHART } from '../../data/content.js'

/** Size chart with cm/in measurements, a how-to-measure guide and dismissal. */
export function SizeGuideModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Size Guide"
      description="Garment measurements, taken flat."
      size="lg"
    >
      <div className="-mx-6 overflow-x-auto px-6">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">VELORA garment measurements in centimetres and inches</caption>
          <thead>
            <tr className="border-b border-ink">
              {SIZE_CHART.columns.map((column) => (
                <th key={column} scope="col" className="py-3 pr-4 text-label font-semibold uppercase tracking-[0.06em]">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.rows.map((row) => (
              <tr key={row[0]} className="border-b border-line">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${row[0]}-${cellIndex}`}
                    className={cellIndex === 0 ? 'py-3 pr-4 text-meta font-semibold' : 'py-3 pr-4 text-meta text-muted tabular-nums'}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-label font-semibold uppercase tracking-[0.12em]">How to measure</h3>
          <ul className="mt-3 space-y-2 text-meta text-muted">
            {SIZE_CHART.howToMeasure.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
        <div className="border border-line bg-surface p-4">
          <h3 className="text-label font-semibold uppercase tracking-[0.12em]">Fit note</h3>
          <p className="mt-3 text-meta text-muted">
            Our hoodies and sweatshirts are cut oversized. If you are between sizes, stay true to size for the intended
            shape, or size down for a closer fit.
          </p>
        </div>
      </div>

      <p className="mt-6 text-label text-faint">{SIZE_CHART.disclaimer}</p>
    </Modal>
  )
}

export default SizeGuideModal
