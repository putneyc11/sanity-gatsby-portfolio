// POST /.netlify/functions/stripe-webhook
//
// Invoice + fulfillment pipeline. Point a Stripe webhook (event:
// `checkout.session.completed`) at this endpoint. When a payment clears:
//
//   1. Stripe has already generated the paid invoice (invoice_creation was
//      enabled on the Checkout Session) and emailed it to the customer.
//   2. We create the shipment in Shippo, purchase the cheapest ground label,
//      and attach the tracking number + label URL back onto the Stripe
//      PaymentIntent so the whole order record lives in one place.
//
// Required environment variables:
//   STRIPE_SECRET_KEY      — Stripe secret key
//   STRIPE_WEBHOOK_SECRET  — signing secret for this webhook endpoint
//   SHIPPO_API_TOKEN       — API token from the Shippo dashboard
//   SHIPPO_TEST_MODE       — optional; set to "true" to validate the pipeline
//                            without purchasing real labels
//
// Ship-from address for label generation:
//   SHIP_FROM_NAME, SHIP_FROM_STREET, SHIP_FROM_CITY, SHIP_FROM_STATE,
//   SHIP_FROM_ZIP (defaults below match the studio's address)

const SHIPPO_API = 'https://api.goshippo.com'

function shipFromAddress () {
  return {
    name: process.env.SHIP_FROM_NAME || 'Luminary Fusion Studios',
    street1: process.env.SHIP_FROM_STREET || '1427 Sawyer Avenue',
    city: process.env.SHIP_FROM_CITY || 'Portland',
    state: process.env.SHIP_FROM_STATE || 'OR',
    zip: process.env.SHIP_FROM_ZIP || '97211',
    country: 'US',
    email: 'hello@luminaryfusionstudios.com'
  }
}

async function shippoRequest (path, body) {
  const res = await fetch(`${SHIPPO_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Shippo ${path} failed (${res.status}): ${JSON.stringify(data).slice(0, 300)}`)
  }
  return data
}

async function createShippingLabel (session) {
  const shipping = session.shipping_details || session.customer_details
  if (!shipping || !shipping.address) {
    throw new Error(`Session ${session.id} has no shipping address`)
  }

  const address = shipping.address
  const weightOz = Math.max(1, parseInt((session.metadata || {}).total_weight_oz, 10) || 16)

  const shipment = await shippoRequest('/shipments/', {
    address_from: shipFromAddress(),
    address_to: {
      name: shipping.name || (session.customer_details && session.customer_details.name) || 'Customer',
      street1: address.line1,
      street2: address.line2 || '',
      city: address.city,
      state: address.state,
      zip: address.postal_code,
      country: address.country,
      email: session.customer_details && session.customer_details.email,
      phone: session.customer_details && session.customer_details.phone
    },
    parcels: [
      {
        // Standard studio shipping carton; oversized pieces are re-quoted
        // manually before dispatch.
        length: '24',
        width: '18',
        height: '6',
        distance_unit: 'in',
        weight: String(weightOz),
        mass_unit: 'oz'
      }
    ],
    async: false
  })

  const rates = (shipment.rates || []).filter(rate => rate.amount)
  if (rates.length === 0) {
    throw new Error(`No shipping rates returned for shipment ${shipment.object_id}`)
  }
  rates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))

  if (process.env.SHIPPO_TEST_MODE === 'true') {
    return {tracking_number: 'TEST-MODE-NO-LABEL', label_url: '', rate: rates[0].object_id}
  }

  const transaction = await shippoRequest('/transactions/', {
    rate: rates[0].object_id,
    label_file_type: 'PDF',
    async: false
  })

  if (transaction.status !== 'SUCCESS') {
    throw new Error(
      `Label purchase failed: ${JSON.stringify(transaction.messages || transaction.status).slice(0, 300)}`
    )
  }

  return transaction
}

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return {statusCode: 405, body: 'Method not allowed'}
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook called but Stripe environment variables are missing')
    return {statusCode: 503, body: 'Payments not configured'}
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      event.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return {statusCode: 400, body: 'Invalid signature'}
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return {statusCode: 200, body: 'Ignored'}
  }

  const session = stripeEvent.data.object

  try {
    if (!process.env.SHIPPO_API_TOKEN) {
      // Payment and invoice already succeeded — never fail the webhook for a
      // fulfillment config problem; flag the order for manual labeling instead.
      console.error(`SHIPPO_API_TOKEN missing — order ${session.id} needs a manual shipping label`)
      return {statusCode: 200, body: 'Paid; label deferred'}
    }

    const label = await createShippingLabel(session)

    // Attach fulfillment data to the PaymentIntent so the order, invoice,
    // label, and tracking number are all visible from the Stripe dashboard.
    if (session.payment_intent) {
      await stripe.paymentIntents.update(session.payment_intent, {
        metadata: {
          tracking_number: label.tracking_number || '',
          label_url: label.label_url || '',
          shippo_transaction: label.object_id || label.rate || ''
        }
      })
    }

    console.log(
      `Order ${session.id}: invoice issued by Stripe, label created`,
      label.tracking_number
    )
    return {statusCode: 200, body: 'Fulfilled'}
  } catch (err) {
    // Log loudly but acknowledge the event: payment is complete, and retrying
    // label purchase forever would risk buying duplicate labels.
    console.error(`Fulfillment error for ${session.id}:`, err.message)
    return {statusCode: 200, body: 'Paid; fulfillment needs attention'}
  }
}
