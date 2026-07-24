import React, {useState} from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import WoodArt from '../components/wood-art'
import portfolio from '../data/portfolio'

export const Head = () => (
  <Seo
    title='Portfolio'
    description='Selected commissions from Luminary Fusion Studios: restaurant interiors, donor walls, heirloom furniture, and architectural carving.'
  />
)

const CATEGORIES = ['All', ...new Set(portfolio.map(item => item.category))]

export default function PortfolioPage () {
  const [category, setCategory] = useState('All')
  const shown = portfolio.filter(item => category === 'All' || item.category === category)

  return (
    <Layout>
      <section className='page-hero'>
        <div className='container'>
          <span className='eyebrow'>Portfolio</span>
          <h1>Commissions we're proud to have shipped</h1>
          <p>
            Most of our work is made-to-order and never appears in the shop.
            Here's a sample of recent commissions, from single heirloom pieces
            to full commercial build-outs.
          </p>
        </div>
      </section>

      <section className='section-tight'>
        <div className='container'>
          <div className='portfolio-filter' role='group' aria-label='Filter portfolio by category'>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`pill${category === c ? ' active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className='card-grid' style={{gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'}}>
            {shown.map(item => (
              <article className='card' key={item.id}>
                <div className='card-media'>
                  <WoodArt tone={item.tone} art={item.art} title={item.title} />
                </div>
                <div className='card-body'>
                  <div className='card-meta'>
                    <span className='chip'>{item.category}</span>
                    <span className='chip'>{item.year}</span>
                  </div>
                  <h3 className='card-title'>{item.title}</h3>
                  <p className='muted' style={{fontSize: '0.85rem', margin: '0 0 0.5rem'}}>{item.client}</p>
                  <p className='card-lead'>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>

          <div className='notice notice-info' style={{marginTop: '2.5rem'}}>
            <strong>Planning something like this?</strong> Commercial and
            residential commissions start with a conversation.{' '}
            <Link to='/contact/'><strong>Start a custom project</strong></Link> and
            we'll reply within two business days.
          </div>
        </div>
      </section>
    </Layout>
  )
}
