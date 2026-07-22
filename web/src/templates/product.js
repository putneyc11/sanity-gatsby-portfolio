import React, {useState} from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import WoodArt from '../components/wood-art'
import ProductCard from '../components/product-card'
import products from '../data/products'
import {useCart, formatPrice} from '../context/cart-context'

export const Head = ({pageContext}) => {
  const product = products.find(p => p.slug === pageContext.slug)
  return <Seo title={product ? product.name : 'Product'} description={product && product.lead} />
}

const PERSONALIZABLE = new Set(['lf-001', 'lf-002', 'lf-005', 'lf-008', 'lf-011'])

export default function ProductTemplate ({pageContext}) {
  const product = products.find(p => p.slug === pageContext.slug)
  const {addItem} = useCart()
  const [quantity, setQuantity] = useState(1)
  const [personalization, setPersonalization] = useState('')
  const [added, setAdded] = useState(false)

  if (!product) return null

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const handleAdd = () => {
    addItem(product, quantity, personalization.trim())
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <Layout>
      <div className='container'>
        <div className='product-detail'>
          <div className='product-media'>
            <WoodArt tone={product.tone} art={product.art} title={product.name} />
          </div>
          <div>
            <nav style={{fontSize: '0.85rem', marginBottom: '0.75rem'}} aria-label='Breadcrumb'>
              <Link to='/shop/'>Shop</Link> <span className='muted'>/ {product.category}</span>
            </nav>
            <h1 style={{fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)'}}>{product.name}</h1>
            <p className='price' style={{fontSize: '1.5rem'}}>{formatPrice(product.price)}</p>
            <p className='muted'>{product.description}</p>

            <ul className='spec-list'>
              <li><span>Wood</span><span>{product.wood}</span></li>
              <li><span>Dimensions</span><span>{product.dimensions}</span></li>
              <li><span>Category</span><span>{product.category}</span></li>
              <li><span>Ships</span><span>Insured, tracking emailed with your invoice</span></li>
              <li><span>Lead time</span><span>2–3 weeks, machined to order</span></li>
            </ul>

            {PERSONALIZABLE.has(product.id) && (
              <div className='form-field' style={{marginBottom: '0.5rem'}}>
                <label htmlFor='personalization'>Personalization (optional)</label>
                <input
                  id='personalization'
                  type='text'
                  maxLength={60}
                  placeholder='Name, date, lake, monogram…'
                  value={personalization}
                  onChange={e => setPersonalization(e.target.value)}
                />
                <span className='form-hint'>We'll confirm engraving layout by email before machining.</span>
              </div>
            )}

            <div className='qty-row'>
              <div className='qty-control' role='group' aria-label='Quantity'>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label='Decrease quantity'>−</button>
                <span aria-live='polite'>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} aria-label='Increase quantity'>+</button>
              </div>
              <button className='btn btn-accent' onClick={handleAdd}>Add to cart · {formatPrice(product.price * quantity)}</button>
              {added && <span className='added-note'>Added to your cart ✓</span>}
            </div>

            <p className='muted' style={{fontSize: '0.85rem'}}>
              Secure card payment at checkout. Your invoice and shipping label
              are generated automatically when payment completes.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className='section-tight'>
            <h2 style={{fontSize: '1.5rem'}}>More {product.category.toLowerCase()}</h2>
            <div className='card-grid' style={{marginTop: '1.25rem'}}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}
