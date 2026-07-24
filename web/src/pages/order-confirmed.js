import React, {useEffect} from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import {useCart} from '../context/cart-context'

export const Head = () => <Seo title='Order Confirmed' />

// Stripe Checkout redirects here on success (see create-checkout function).
export default function OrderConfirmedPage () {
  const {clearCart} = useCart()

  useEffect(() => {
    clearCart()
    // clearCart is stable for the life of the provider; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <section className='section'>
        <div className='container' style={{maxWidth: 720, textAlign: 'center'}}>
          <span className='eyebrow'>Order confirmed</span>
          <h1>The router is warming up.</h1>
          <p className='muted' style={{fontSize: '1.05rem'}}>
            Thank you. Your payment went through. Here's what happens next:
          </p>
          <div className='step-grid' style={{textAlign: 'left', marginTop: '2rem'}}>
            <div className='step'>
              <span className='step-num'>1</span>
              <h3>Invoice</h3>
              <p className='muted'>Your paid invoice has been generated and emailed to you automatically.</p>
            </div>
            <div className='step'>
              <span className='step-num'>2</span>
              <h3>Making</h3>
              <p className='muted'>We machine and hand-finish your piece, typically 2-3 weeks. Personalized layouts are confirmed by email first.</p>
            </div>
            <div className='step'>
              <span className='step-num'>3</span>
              <h3>Shipping</h3>
              <p className='muted'>Your shipping label and tracking number were created with your order; tracking goes live the day it leaves the studio.</p>
            </div>
          </div>
          <p style={{marginTop: '2.5rem'}}>
            <Link to='/shop/' className='btn btn-primary'>Keep browsing</Link>
          </p>
        </div>
      </section>
    </Layout>
  )
}
