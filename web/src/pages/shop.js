import React, {useEffect, useMemo, useState} from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import ProductCard from '../components/product-card'
import products from '../data/products'
import {formatPrice} from '../context/cart-context'

export const Head = () => (
  <Seo
    title='Shop'
    description='Browse CNC-crafted signs, furniture, wall art, and kitchen pieces. Filter by category, wood, and price — secure checkout with automatic invoicing and shipping.'
  />
)

const CATEGORIES = ['All', ...new Set(products.map(p => p.category))]
const WOODS = ['All', ...new Set(products.map(p => p.wood))]

const PRICE_BANDS = [
  {label: 'Any price', min: 0, max: Infinity},
  {label: 'Under $100', min: 0, max: 10000},
  {label: '$100 – $250', min: 10000, max: 25000},
  {label: '$250 – $600', min: 25000, max: 60000},
  {label: '$600 and up', min: 60000, max: Infinity}
]

const SORTS = {
  featured: {label: 'Featured', fn: (a, b) => Number(b.featured) - Number(a.featured)},
  'price-asc': {label: 'Price: low to high', fn: (a, b) => a.price - b.price},
  'price-desc': {label: 'Price: high to low', fn: (a, b) => b.price - a.price},
  name: {label: 'Name A–Z', fn: (a, b) => a.name.localeCompare(b.name)}
}

export default function ShopPage ({location}) {
  const [category, setCategory] = useState('All')
  const [wood, setWood] = useState('All')
  const [priceBand, setPriceBand] = useState(0)
  const [sort, setSort] = useState('featured')
  const [query, setQuery] = useState('')

  // Honor deep links like /shop/?category=Signs from the footer and emails.
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const linked = params.get('category')
    if (linked && CATEGORIES.includes(linked)) setCategory(linked)
  }, [location.search])

  const filtered = useMemo(() => {
    const band = PRICE_BANDS[priceBand]
    const q = query.trim().toLowerCase()
    return products
      .filter(p => category === 'All' || p.category === category)
      .filter(p => wood === 'All' || p.wood === wood)
      .filter(p => p.price >= band.min && p.price < band.max)
      .filter(
        p =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.lead.toLowerCase().includes(q) ||
          p.wood.toLowerCase().includes(q)
      )
      .sort(SORTS[sort].fn)
  }, [category, wood, priceBand, sort, query])

  const resetFilters = () => {
    setCategory('All')
    setWood('All')
    setPriceBand(0)
    setQuery('')
  }

  return (
    <Layout>
      <section className='page-hero'>
        <div className='container'>
          <span className='eyebrow'>The shop</span>
          <h1>CNC-crafted, hand-finished, ready to ship</h1>
          <p>
            Every piece below is machined to order in our Portland studio.
            Checkout is secure — payment, your invoice, and a shipping label
            are processed automatically the moment your order clears.
          </p>
        </div>
      </section>

      <section className='section-tight'>
        <div className='container'>
          <div className='filter-bar'>
            <div className='filter-field'>
              <label htmlFor='filter-search'>Search</label>
              <input
                id='filter-search'
                type='search'
                placeholder='Search products…'
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className='filter-field'>
              <label htmlFor='filter-category'>Category</label>
              <select id='filter-category' value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className='filter-field'>
              <label htmlFor='filter-wood'>Wood</label>
              <select id='filter-wood' value={wood} onChange={e => setWood(e.target.value)}>
                {WOODS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div className='filter-field'>
              <label htmlFor='filter-price'>Price</label>
              <select id='filter-price' value={priceBand} onChange={e => setPriceBand(Number(e.target.value))}>
                {PRICE_BANDS.map((band, i) => <option key={band.label} value={i}>{band.label}</option>)}
              </select>
            </div>
            <div className='filter-field'>
              <label htmlFor='filter-sort'>Sort by</label>
              <select id='filter-sort' value={sort} onChange={e => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <p className='filter-count'>
            Showing <strong>{filtered.length}</strong> of {products.length} pieces
            {filtered.length > 0 && filtered.length < products.length && (
              <> · <button className='link-danger' style={{color: 'var(--wood)'}} onClick={resetFilters}>clear filters</button></>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className='empty-state'>
              <h3>No pieces match those filters</h3>
              <p>
                Try widening your search — or if you're after something specific,{' '}
                we probably make it to order.
              </p>
              <button className='btn btn-primary' onClick={resetFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className='card-grid'>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className='notice notice-info' style={{marginTop: '2.5rem'}}>
            <strong>Don't see it here?</strong> Most of our work is made to
            order. Prices range from {formatPrice(Math.min(...products.map(p => p.price)))} stock
            pieces to fully bespoke commissions — <a href='/contact/'><strong>send us a custom request</strong></a>.
          </div>
        </div>
      </section>
    </Layout>
  )
}
