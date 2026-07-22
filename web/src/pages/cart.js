import React, {useState} from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import WoodArt from '../components/wood-art'
import {useCart, formatPrice} from '../context/cart-context'

export const Head = () => <Seo title='Your Cart' />

// Flat-rate ground shipping estimate shown pre-checkout; the checkout
// function quotes the real rate from the carrier via Shippo.
const SHIPPING_ESTIMATE = 1800
const FREE_SHIPPING_THRESHOLD = 25000

export default function CartPage () {
  const {items, count, subtotal, updateQuantity, removeItem, clearCart} = useCart()
  const [status, setStatus] = useState({state: 'idle'})

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_ESTIMATE

  const handleCheckout = async () => {
    setStatus({state: 'loading'})
    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            personalization: item.personalization
          }))
        })
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        window.location.assign(data.url)
        return
      }
      throw new Error(data.error || `Checkout unavailable (${res.status})`)
    } catch (err) {
      setStatus({
        state: 'error',
        message:
          'We couldn\'t start a secure checkout session. If this keeps happening, ' +
          'email hello@luminaryfusionstudios.com and we\'ll invoice you directly. ' +
          `(${err.message})`
      })
    }
  }

  return (
    <Layout>
      <section className='page-hero'>
        <div className='container'>
          <span className='eyebrow'>Your cart</span>
          <h1>{count === 0 ? 'Your cart is empty' : `${count} item${count === 1 ? '' : 's'} ready for the router`}</h1>
        </div>
      </section>

      <section className='section-tight'>
        <div className='container'>
          {count === 0 ? (
            <div className='empty-state'>
              <h3>Nothing here yet</h3>
              <p>Browse the shop to find a piece worth making room for.</p>
              <Link to='/shop/' className='btn btn-primary'>Go to the shop</Link>
            </div>
          ) : (
            <div className='cart-layout'>
              <div>
                {items.map(item => (
                  <div className='cart-line' key={`${item.id}-${item.personalization}`}>
                    <Link to={`/shop/${item.slug}/`} className='cart-line-media'>
                      <WoodArt tone={item.tone} art={item.art} title={item.name} />
                    </Link>
                    <div>
                      <h3><Link to={`/shop/${item.slug}/`}>{item.name}</Link></h3>
                      <p className='muted' style={{margin: 0}}>
                        {item.wood} · {formatPrice(item.price)} each
                        {item.personalization && <><br />Personalization: “{item.personalization}”</>}
                      </p>
                    </div>
                    <div className='cart-line-right'>
                      <div className='qty-control' role='group' aria-label={`Quantity of ${item.name}`}>
                        <button onClick={() => updateQuantity(item.id, item.personalization, item.quantity - 1)} aria-label='Decrease'>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.personalization, item.quantity + 1)} aria-label='Increase'>+</button>
                      </div>
                      <span className='price' style={{fontSize: '1rem'}}>{formatPrice(item.price * item.quantity)}</span>
                      <button className='link-danger' onClick={() => removeItem(item.id, item.personalization)}>Remove</button>
                    </div>
                  </div>
                ))}
                <button className='link-danger' onClick={clearCart}>Empty the cart</button>
              </div>

              <aside className='summary-panel'>
                <h3>Order summary</h3>
                <div className='summary-row'><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className='summary-row'>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `${formatPrice(shipping)} est.`}</span>
                </div>
                {shipping > 0 && (
                  <p className='form-hint'>
                    Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}. Exact
                    rate is confirmed at checkout.
                  </p>
                )}
                <div className='summary-row total'><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
                <button
                  className='btn btn-accent btn-block'
                  style={{marginTop: '1rem'}}
                  onClick={handleCheckout}
                  disabled={status.state === 'loading'}
                >
                  {status.state === 'loading' ? 'Opening secure checkout…' : 'Check out securely'}
                </button>
                {status.state === 'error' && (
                  <div className='notice notice-error' role='alert'>{status.message}</div>
                )}
                <p className='form-hint' style={{marginTop: '0.9rem'}}>
                  Payments are processed by Stripe. When your payment clears,
                  our system automatically issues your invoice and creates the
                  shipping label — you'll get both by email with tracking.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
