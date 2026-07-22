// POST /.netlify/functions/create-checkout
//
// Turns the cart into a Stripe Checkout Session. Prices always come from the
// server-side catalog — the client only sends product ids and quantities, so
// tampering with the request can't change what gets charged.
//
// Required environment variables (set in Netlify → Site settings → Env vars):
//   STRIPE_SECRET_KEY  — secret key from the Stripe dashboard
//   URL                — provided automatically by Netlify (site base URL)

const products = require('../../src/data/products')

const FREE_SHIPPING_THRESHOLD = 25000
const FLAT_SHIPPING_RATE = 1800

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return {statusCode: 405, body: JSON.stringify({error: 'Method not allowed'})}
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error:
          'Payments are not configured yet: set STRIPE_SECRET_KEY in the site environment.'
      })
    }
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

  let cart
  try {
    cart = JSON.parse(event.body || '{}').items
    if (!Array.isArray(cart) || cart.length === 0) throw new Error('empty')
  } catch (err) {
    return {statusCode: 400, body: JSON.stringify({error: 'Cart is empty or malformed.'})}
  }

  const lineItems = []
  let subtotal = 0
  let totalWeightOz = 0

  for (const entry of cart) {
    const product = products.find(p => p.id === entry.id)
    const quantity = Math.max(1, Math.min(50, parseInt(entry.quantity, 10) || 1))
    if (!product) {
      return {statusCode: 400, body: JSON.stringify({error: `Unknown product: ${entry.id}`})}
    }
    subtotal += product.price * quantity
    totalWeightOz += product.weightOz * quantity
    lineItems.push({
      quantity,
      price_data: {
        currency: 'usd',
        unit_amount: product.price,
        product_data: {
          name: product.name,
          description: [
            `${product.wood} · ${product.dimensions}`,
            entry.personalization ? `Personalization: ${entry.personalization}` : null
          ]
            .filter(Boolean)
            .join(' — '),
          metadata: {sku: product.id}
        }
      }
    })
  }

  const siteUrl = process.env.URL || 'http://localhost:8000'
  const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${siteUrl}/order-confirmed/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart/`,
      shipping_address_collection: {allowed_countries: ['US', 'CA']},
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: shippingAmount, currency: 'usd'},
            display_name: shippingAmount === 0 ? 'Free insured ground shipping' : 'Insured ground shipping',
            delivery_estimate: {
              minimum: {unit: 'business_day', value: 5},
              maximum: {unit: 'business_day', value: 10}
            }
          }
        }
      ],
      phone_number_collection: {enabled: true},
      // Stripe generates and emails the paid invoice; the webhook then
      // creates the shipping label once payment completes.
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Luminary Fusion Studios — CNC woodworking order',
          footer: 'Machined and hand-finished in Portland, Oregon. Thank you!'
        }
      },
      metadata: {
        total_weight_oz: String(totalWeightOz),
        personalizations: JSON.stringify(
          cart
            .filter(entry => entry.personalization)
            .map(entry => ({id: entry.id, text: String(entry.personalization).slice(0, 60)}))
        ).slice(0, 480)
      }
    })

    return {statusCode: 200, body: JSON.stringify({url: session.url})}
  } catch (err) {
    console.error('Stripe session creation failed:', err.message)
    return {statusCode: 502, body: JSON.stringify({error: 'Payment provider error — please try again.'})}
  }
}
