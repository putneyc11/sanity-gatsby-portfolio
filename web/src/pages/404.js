import React from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'

export const Head = () => <Seo title='Page Not Found' />

export default function NotFoundPage () {
  return (
    <Layout>
      <section className='section'>
        <div className='container' style={{maxWidth: 640, textAlign: 'center'}}>
          <span className='eyebrow'>404</span>
          <h1>This cut went off the toolpath.</h1>
          <p className='muted'>
            The page you're looking for doesn't exist — it may have been moved,
            or the link had a knot in it.
          </p>
          <p>
            <Link to='/' className='btn btn-primary'>Back to the homepage</Link>{' '}
            <Link to='/shop/' className='btn btn-ghost'>Visit the shop</Link>
          </p>
        </div>
      </section>
    </Layout>
  )
}
