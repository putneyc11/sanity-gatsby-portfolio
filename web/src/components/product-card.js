import React, {useState} from 'react'
import {Link} from 'gatsby'
import WoodArt from './wood-art'
import {useCart, formatPrice} from '../context/cart-context'

export default function ProductCard ({product}) {
  const {addItem} = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className='card'>
      <Link to={`/shop/${product.slug}/`} className='card-media' aria-label={product.name}>
        <WoodArt tone={product.tone} art={product.art} title={product.name} />
      </Link>
      <div className='card-body'>
        <div className='card-meta'>
          <span className='chip'>{product.category}</span>
          <span className='chip'>{product.wood}</span>
        </div>
        <h3 className='card-title'>
          <Link to={`/shop/${product.slug}/`}>{product.name}</Link>
        </h3>
        <p className='card-lead'>{product.lead}</p>
        <div className='card-foot'>
          <span className='price'>{formatPrice(product.price)}</span>
          <button className='btn btn-accent btn-sm' onClick={handleAdd}>
            {added ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
