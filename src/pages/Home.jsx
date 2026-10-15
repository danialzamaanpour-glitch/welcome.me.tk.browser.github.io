import { useState } from 'react'
import ScrollExperience from '../experience/ScrollExperience'
import ProductSection from '../components/ProductSection'
import ProductDetails from '../components/ProductDetails'
import ProductReviews from '../components/ProductReviews'
import RelatedProducts from '../components/RelatedProducts'
import NewsletterSection from '../components/NewsletterSection'
import FinalSignature from '../components/FinalSignature'
import SizeGuideModal from '../components/SizeGuideModal'
import { FLAGSHIP_SLUG, colorById, getProductBySlug } from '../data/products'
import { useShop } from '../store/ShopContext'

/**
 * Home: the nine-chapter experience. Chapters 01–05 are the scroll-driven 3D
 * presentation; 06–09 resolve into the shopping interface.
 */
export default function Home() {
  const flagship = getProductBySlug(FLAGSHIP_SLUG)
  const { getSelection, setColor } = useShop()
  const { colorId } = getSelection(flagship)
  const color = colorById(flagship, colorId)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const openSizeGuide = () => setSizeGuideOpen(true)

  return (
    <>
      <ScrollExperience
        product={flagship}
        colorHex={color?.hex}
        colorId={colorId}
        onSelectColor={(id) => setColor(flagship, id)}
        onOpenSizeGuide={openSizeGuide}
      />

      <ProductSection product={flagship} onOpenSizeGuide={openSizeGuide} />
      <ProductDetails product={flagship} onOpenSizeGuide={openSizeGuide} />
      <ProductReviews product={flagship} />
      <RelatedProducts />
      <NewsletterSection />
      <FinalSignature />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  )
}
