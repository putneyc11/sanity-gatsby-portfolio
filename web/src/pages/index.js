import React from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import ProductCard from '../components/product-card'
import WoodArt from '../components/wood-art'
import products from '../data/products'

export const Head = () => <Seo />

export default function IndexPage () {
  const featured = products.filter(p => p.featured).slice(0, 4)

  return (
    <Layout>
      <section className='hero'>
        <div className='hero-inner'>
          <div className='rise'>
            <span className='eyebrow'>Precision CNC Woodworking, Portland OR</span>
            <h1>Where light, grain, and machine meet.</h1>
            <p>
              Luminary Fusion Studios pairs computer-controlled precision with
              old-school hand finishing. We machine custom signs, furniture,
              and wall art to a tenth of a millimeter, then sand, oil, and wax
              every piece by hand.
            </p>
            <div className='hero-actions'>
              <Link to='/shop/' className='btn btn-accent'>Browse the shop</Link>
              <Link to='/contact/' className='btn btn-ghost'>Start a custom project</Link>
            </div>
          </div>
          <div className='hero-art rise rise-late'>
            <WoodArt tone={['#3d2f22', '#77593d']} art='topo' title='Layered topographic carving' />
          </div>
        </div>
      </section>

      <section className='section'>
        <div className='container'>
          <div className='section-head'>
            <h2>Pieces our customers keep coming back for</h2>
          </div>
          <div className='card-grid'>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <p style={{marginTop: '2rem'}}>
            <Link to='/shop/' className='btn btn-primary'>Shop all products</Link>
          </p>
        </div>
      </section>

      <section className='section section-alt'>
        <div className='container'>
          <div className='section-head'>
            <h2>From sketch to shipped, in four steps</h2>
          </div>
          <div className='process-list'>
            <div className='process-item'>
              <div>
                <h3>Design</h3>
                <p className='muted'>Pick a piece from the shop or send us your idea through the custom request form. We turn it into machine-ready vectors.</p>
              </div>
            </div>
            <div className='process-item'>
              <div>
                <h3>Machine</h3>
                <p className='muted'>Our 4'×8' CNC router carves your piece from sustainably sourced hardwood with sub-millimeter accuracy.</p>
              </div>
            </div>
            <div className='process-item'>
              <div>
                <h3>Finish</h3>
                <p className='muted'>Every piece is hand-sanded through five grits and sealed with food-safe oils or furniture-grade poly.</p>
              </div>
            </div>
            <div className='process-item'>
              <div>
                <h3>Ship</h3>
                <p className='muted'>Pay securely online. Your invoice and tracking-ready shipping label are generated the moment payment clears.</p>
              </div>
            </div>
          </div>
          <div className='stat-row'>
            <div className='stat'><strong>1,400+</strong><span>pieces shipped since 2016</span></div>
            <div className='stat'><strong>0.1mm</strong><span>machining tolerance</span></div>
            <div className='stat'><strong>2-3 wks</strong><span>typical lead time</span></div>
          </div>
        </div>
      </section>

      <section className='section'>
        <div className='container two-col'>
          <div>
            <h2>Have something one-of-a-kind in mind?</h2>
            <p className='muted'>
              Restaurant build-outs, donor walls, heirloom furniture, carved
              doors: most of our work never appears in the shop. Tell us about
              your project and we'll come back within two business days with a
              sketch and a quote.
            </p>
            <Link to='/contact/' className='btn btn-primary'>Start a custom project</Link>
          </div>
          <div style={{borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lift)'}}>
            <WoodArt tone={['#4a3626', '#8a6a4f']} art='sign' title='Custom carved commission' />
          </div>
        </div>
      </section>
    </Layout>
  )
}
