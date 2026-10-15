import { Link } from 'react-router-dom'
import GarmentArt from './GarmentArt'
import WishlistButton from './WishlistButton'
import { colorById } from '../data/products'
import { discountPercent } from '../lib/format'
import { useShop } from '../store/ShopContext'

export default function ProductCard({ product, angle = 'front', className = '' }) {
  const { money, getSelection } = useShop()
  const { colorId } = getSelection(product)
  const color = colorById(product, colorId)
  const discount = discountPercent(product.price, product.compareAt)

  return (
    <article className={`card reveal ${className}`}>
      <div className="card__media">
        <Link to={`/product/${product.slug}`} aria-label={`${product.name} — view product`}>
          <GarmentArt kind={product.kind} color={color.hex} angle={angle} />
        </Link>
        <div className="card__badges">
          {product.badge && <span className="pill">{product.badge}</span>}
          {discount && <span className="pill pill--dark">−{discount}%</span>}
        </div>
        <WishlistButton product={product} className="card__wish" />
      </div>
      <div className="card__body">
        <h3 className="card__title">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="card__meta">{color?.name}</p>
        <p className="card__price">
          <span>{money(product.price)}</span>
          {product.compareAt && <s>{money(product.compareAt)}</s>}
        </p>
      </div>
    </article>
  )
}
