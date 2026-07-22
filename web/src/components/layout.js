import React, {useState} from 'react'
import {Link} from 'gatsby'
import Logo from './logo'
import {useCart} from '../context/cart-context'

const NAV_LINKS = [
  {to: '/about/', label: 'About'},
  {to: '/shop/', label: 'Shop'},
  {to: '/portfolio/', label: 'Portfolio'},
  {to: '/contact/', label: 'Contact Us'}
]

function CartIcon () {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <circle cx='9' cy='21' r='1' />
      <circle cx='20' cy='21' r='1' />
      <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
    </svg>
  )
}

export default function Layout ({children}) {
  const [navOpen, setNavOpen] = useState(false)
  const {count} = useCart()

  return (
    <>
      <header className='site-header'>
        <div className='site-header-inner'>
          <Link to='/' className='brand' onClick={() => setNavOpen(false)}>
            <Logo />
            Luminary Fusion Studios
          </Link>
          <button
            className='nav-toggle'
            aria-label='Toggle navigation'
            aria-expanded={navOpen}
            onClick={() => setNavOpen(open => !open)}
          >
            <svg width='24' height='24' viewBox='0 0 24 24' stroke='#2b2118' strokeWidth='2' strokeLinecap='round'>
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </svg>
          </button>
          <nav className={`main-nav${navOpen ? ' open' : ''}`}>
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} activeClassName='active' partiallyActive onClick={() => setNavOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to='/cart/' className='cart-link' activeClassName='active' onClick={() => setNavOpen(false)}>
              <CartIcon />
              Cart
              {count > 0 && <span className='cart-badge'>{count}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className='site-footer'>
        <div className='footer-inner'>
          <div>
            <h4>Luminary Fusion Studios</h4>
            <p style={{fontSize: '0.92rem', maxWidth: '26rem'}}>
              Precision CNC woodworking studio crafting signs, furniture, and
              heirloom pieces where digital fabrication meets hand finishing.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to='/about/'>About</Link>
            <Link to='/shop/'>Shop</Link>
            <Link to='/portfolio/'>Portfolio</Link>
            <Link to='/contact/'>Contact Us</Link>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to='/shop/?category=Signs'>Signs</Link>
            <Link to='/shop/?category=Furniture'>Furniture</Link>
            <Link to='/shop/?category=Wall%20Art'>Wall Art</Link>
            <Link to='/shop/?category=Kitchen'>Kitchen</Link>
          </div>
          <div>
            <h4>Visit the Studio</h4>
            <p style={{fontSize: '0.92rem'}}>
              1427 Sawyer Avenue<br />
              Portland, OR 97211<br />
              Tue–Sat, 9am–5pm<br />
              (503) 555-0147<br />
              hello@luminaryfusionstudios.com
            </p>
          </div>
        </div>
        <div className='footer-bottom'>
          © {new Date().getFullYear()} Luminary Fusion Studios. All pieces machined and finished in Portland, Oregon.
        </div>
      </footer>
    </>
  )
}
