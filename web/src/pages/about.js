import React from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import WoodArt from '../components/wood-art'

export const Head = () => (
  <Seo
    title='About'
    description='The story, people, and machines behind Luminary Fusion Studios — a precision CNC woodworking shop in Portland, Oregon.'
  />
)

const TEAM = [
  {
    name: 'Rowan Ashford',
    role: 'Founder & Lead Designer',
    tone: ['#5d4433', '#c8873a'],
    bio: 'Furniture maker turned digital fabricator. Rowan draws every commission by hand before it ever touches CAM software.'
  },
  {
    name: 'Priya Natarajan',
    role: 'CNC Programmer & Machinist',
    tone: ['#3d5a6c', '#7fa8b8'],
    bio: 'Former aerospace machinist who traded aluminum for walnut. If a toolpath can be 10% cleaner, Priya will find it.'
  },
  {
    name: 'Marcus Bell',
    role: 'Finishing & Shipping',
    tone: ['#4e3b2a', '#b08a5e'],
    bio: 'The last set of hands on every piece. Marcus runs our five-grit finishing line and packs work so it arrives flawless.'
  }
]

export default function AboutPage () {
  return (
    <Layout>
      <section className='page-hero'>
        <div className='container'>
          <span className='eyebrow'>About the studio</span>
          <h1>Machines don't make heirlooms. People do.</h1>
          <p>
            We founded Luminary Fusion Studios in 2016 with a used CNC router,
            a pallet of reclaimed walnut, and a conviction: digital precision
            and hand craftsmanship aren't opposites — together they make work
            neither could make alone.
          </p>
        </div>
      </section>

      <section className='section'>
        <div className='container two-col'>
          <div style={{borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lift)'}}>
            <WoodArt tone={['#4a3626', '#8a6a4f']} art='slats' title='Inside the Luminary Fusion workshop' />
          </div>
          <div>
            <span className='eyebrow'>Our story</span>
            <h2>From garage router to full fabrication studio</h2>
            <p className='muted'>
              What started as weekend sign-making in a one-car garage is now a
              4,000 sq ft studio in Portland's Alberta Arts District, running a
              4'×8' industrial CNC router, a laser engraver, and a full
              traditional bench room. The tools changed; the rule didn't:
              nothing leaves the shop until we'd hang it in our own homes.
            </p>
            <p className='muted'>
              We mill sustainably harvested Pacific Northwest hardwoods and
              FSC-certified stock, and we plant a tree for every order through
              our county's reforestation partnership.
            </p>
          </div>
        </div>
      </section>

      <section className='section section-alt'>
        <div className='container'>
          <div className='section-head'>
            <span className='eyebrow'>What we believe</span>
            <h2>Three principles guide every cut</h2>
          </div>
          <div className='step-grid'>
            <div className='step'>
              <h3>Precision is respect</h3>
              <p className='muted'>A 0.1mm tolerance isn't showing off — it's respect for the material and the person who'll live with the piece for decades.</p>
            </div>
            <div className='step'>
              <h3>The hand finishes what the machine starts</h3>
              <p className='muted'>A router leaves perfect geometry; only sandpaper, oil, and patience leave warmth. Every piece gets both.</p>
            </div>
            <div className='step'>
              <h3>Wood is borrowed</h3>
              <p className='muted'>A tree grew longer than we've been alive. We waste as little of it as possible and design pieces meant to outlive us.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='section'>
        <div className='container'>
          <div className='section-head'>
            <span className='eyebrow'>The team</span>
            <h2>Six hands, one standard</h2>
          </div>
          <div className='team-grid'>
            {TEAM.map(member => (
              <div className='step' key={member.name}>
                <svg className='avatar' viewBox='0 0 72 72' role='img' aria-label={member.name}>
                  <circle cx='36' cy='36' r='36' fill={member.tone[0]} />
                  <circle cx='36' cy='28' r='12' fill={member.tone[1]} />
                  <path d='M12 66 a24 18 0 0 1 48 0 Z' fill={member.tone[1]} />
                </svg>
                <h3>{member.name}</h3>
                <p style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber)', margin: '0 0 0.5rem'}}>{member.role}</p>
                <p className='muted' style={{fontSize: '0.92rem'}}>{member.bio}</p>
              </div>
            ))}
          </div>
          <div className='notice notice-info' style={{marginTop: '2.5rem'}}>
            Want to see the machines run? The studio is open to visitors
            Tuesday through Saturday — or <Link to='/contact/'><strong>book a consultation</strong></Link> and
            we'll walk your project through the shop floor.
          </div>
        </div>
      </section>
    </Layout>
  )
}
