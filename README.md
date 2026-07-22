# Luminary Fusion Studios

Website for **Luminary Fusion Studios**, a precision CNC woodworking shop —
built with [Gatsby 5](https://gatsbyjs.com), deployed on
[Netlify](https://netlify.com), with Stripe payments and automated
invoice + shipping-label fulfillment.

## Pages

| Page | Route | What it does |
| --- | --- | --- |
| Home | `/` | Hero, featured products, process overview, custom-commission CTA |
| About | `/about/` | Studio story, values, and team |
| Shop | `/shop/` | Browse products; filter by search, category, wood, price band; sort by price/name/featured |
| Product | `/shop/<slug>/` | Full details, personalization, quantity, add to cart |
| Portfolio | `/portfolio/` | Selected commissions, filterable by category |
| Contact Us | `/contact/` | Detailed custom-request form (project type, budget, timeline, wood, dimensions, delivery/installation, references) |
| Cart | `/cart/` | Review order, adjust quantities, secure checkout |
| Order Confirmed | `/order-confirmed/` | Post-payment landing page |

## Ordering, payment & fulfillment pipeline

1. **Cart → checkout.** `/cart/` posts the cart (product ids + quantities only)
   to the `create-checkout` Netlify function, which prices everything from the
   server-side catalog and opens a Stripe Checkout Session with shipping
   address + phone collection.
2. **Invoice.** The session is created with `invoice_creation` enabled, so
   Stripe automatically generates and emails the paid invoice when the charge
   succeeds.
3. **Shipping label.** A Stripe webhook (`checkout.session.completed`) hits the
   `stripe-webhook` function, which verifies the signature, creates the
   shipment in [Shippo](https://goshippo.com), buys the cheapest ground-rate
   label, and writes the tracking number + label URL back onto the Stripe
   PaymentIntent — so the full order record (payment, invoice, label,
   tracking) lives in the Stripe dashboard.

### Environment variables

Set these in Netlify (Site settings → Environment variables):

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe secret key (required for checkout) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the `checkout.session.completed` webhook |
| `SHIPPO_API_TOKEN` | Shippo API token (label creation) |
| `SHIPPO_TEST_MODE` | Optional `true` to validate the pipeline without buying labels |
| `SHIP_FROM_*` | Optional override of the studio ship-from address (`NAME`, `STREET`, `CITY`, `STATE`, `ZIP`) |

Then point a Stripe webhook endpoint at
`https://<your-site>/.netlify/functions/stripe-webhook` for the
`checkout.session.completed` event.

The site builds and runs without any of these — checkout returns a friendly
"payments not configured" message until the keys are added.

### Contact form

The custom-request form on `/contact/` uses
[Netlify Forms](https://docs.netlify.com/forms/setup/) (`data-netlify`), with a
honeypot field for spam. Submissions appear under **Forms** in the Netlify
dashboard, where email notifications can be enabled.

## Development

```sh
npm run install-web   # install web dependencies
npm run dev           # http://localhost:8000
npm run build         # production build to web/public
npm run serve         # serve the production build
```

## Content

Products live in `web/src/data/products.js` and portfolio entries in
`web/src/data/portfolio.js` — prices are stored in USD cents to match Stripe,
and each product's `weightOz` feeds the shipping-label calculation. Product
imagery is generated procedurally as SVG (`wood-art.js`); to use photography,
add an image field to the data and swap the component.

`studio/` contains the original Sanity Studio (v1) from the template this
project started from, extended with a `product` schema mirroring the local
data shape. It is **not** part of the build; migrate it to Sanity v3 and add
`gatsby-source-sanity` if/when CMS-managed content is wanted.
