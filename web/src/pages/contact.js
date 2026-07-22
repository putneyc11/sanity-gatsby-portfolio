import React, {useState} from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'

export const Head = () => (
  <Seo
    title='Contact Us'
    description='Start a custom CNC woodworking project — tell us about your sign, furniture, or commercial commission and get a quote within two business days.'
  />
)

const PROJECT_TYPES = [
  'Custom sign or logo carving',
  'Furniture commission',
  'Wall art / topographic map',
  'Kitchen & serving pieces',
  'Commercial / restaurant build-out',
  'Event or bulk order (10+ pieces)',
  'Question about an existing order',
  'Something else entirely'
]

const BUDGETS = ['Under $250', '$250 – $1,000', '$1,000 – $5,000', '$5,000 – $20,000', '$20,000+', 'Not sure yet — advise me']
const TIMELINES = ['No rush', 'Within 3 months', 'Within 6 weeks', 'Within 3 weeks', 'It\'s urgent — tell me what\'s possible']
const WOODS = ['No preference — recommend one', 'Walnut', 'White Oak', 'Maple', 'Cherry', 'Ash', 'Baltic Birch', 'Reclaimed / customer-supplied']

function encode (data) {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  projectType: PROJECT_TYPES[0],
  budget: BUDGETS[0],
  timeline: TIMELINES[0],
  wood: WOODS[0],
  dimensions: '',
  quantity: '1',
  installation: 'No — ship it to me',
  details: '',
  referenceLinks: '',
  hearAbout: ''
}

export default function ContactPage () {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState({state: 'idle'})

  const set = field => e => setForm(prev => ({...prev, [field]: e.target.value}))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus({state: 'loading'})
    try {
      // Netlify Forms captures this post on the deployed site; the serverless
      // fallback covers other hosts.
      const res = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: encode({'form-name': 'custom-request', ...form})
      })
      if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`)
      setStatus({state: 'success'})
      setForm(INITIAL)
    } catch (err) {
      setStatus({
        state: 'error',
        message:
          'We couldn\'t send your request just now. Please try again in a minute, ' +
          'or email us directly at hello@luminaryfusionstudios.com — we answer everything.'
      })
    }
  }

  return (
    <Layout>
      <section className='page-hero'>
        <div className='container'>
          <span className='eyebrow'>Contact us</span>
          <h1>Tell us what you're dreaming up</h1>
          <p>
            The more detail you give us — sizes, materials, deadlines, budget,
            inspiration — the faster and more accurate your quote. We reply to
            every request within two business days.
          </p>
        </div>
      </section>

      <section className='section-tight'>
        <div className='container contact-layout'>
          <div className='form-panel'>
            {status.state === 'success' ? (
              <div className='notice notice-success' role='status'>
                <h3>Request received — thank you!</h3>
                <p style={{margin: 0}}>
                  We've got your project details and will reply within two
                  business days with questions, a sketch, or a quote. A copy of
                  your request is on its way to your inbox.
                </p>
              </div>
            ) : (
              <form
                name='custom-request'
                method='POST'
                data-netlify='true'
                netlify-honeypot='bot-field'
                onSubmit={handleSubmit}
              >
                <input type='hidden' name='form-name' value='custom-request' />
                <p hidden aria-hidden='true'>
                  <label>Don't fill this out: <input name='bot-field' /></label>
                </p>

                <h2 style={{fontSize: '1.35rem'}}>Custom request form</h2>

                <div className='form-grid'>
                  <div className='form-field'>
                    <label htmlFor='cf-name'>Your name <span className='req'>*</span></label>
                    <input id='cf-name' name='name' type='text' required value={form.name} onChange={set('name')} />
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-email'>Email <span className='req'>*</span></label>
                    <input id='cf-email' name='email' type='email' required value={form.email} onChange={set('email')} />
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-phone'>Phone (optional)</label>
                    <input id='cf-phone' name='phone' type='tel' value={form.phone} onChange={set('phone')} />
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-type'>What kind of project? <span className='req'>*</span></label>
                    <select id='cf-type' name='projectType' required value={form.projectType} onChange={set('projectType')}>
                      {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-budget'>Budget range</label>
                    <select id='cf-budget' name='budget' value={form.budget} onChange={set('budget')}>
                      {BUDGETS.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <span className='form-hint'>A range helps us propose the right materials and scale.</span>
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-timeline'>When do you need it?</label>
                    <select id='cf-timeline' name='timeline' value={form.timeline} onChange={set('timeline')}>
                      {TIMELINES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-wood'>Wood preference</label>
                    <select id='cf-wood' name='wood' value={form.wood} onChange={set('wood')}>
                      {WOODS.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-quantity'>Quantity</label>
                    <input id='cf-quantity' name='quantity' type='number' min='1' value={form.quantity} onChange={set('quantity')} />
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-dimensions'>Approximate dimensions</label>
                    <input
                      id='cf-dimensions'
                      name='dimensions'
                      type='text'
                      placeholder='e.g. 36" wide × 18" tall'
                      value={form.dimensions}
                      onChange={set('dimensions')}
                    />
                  </div>
                  <div className='form-field'>
                    <label htmlFor='cf-install'>Delivery or installation?</label>
                    <select id='cf-install' name='installation' value={form.installation} onChange={set('installation')}>
                      <option>No — ship it to me</option>
                      <option>Local pickup (Portland, OR)</option>
                      <option>Local delivery</option>
                      <option>Delivery + professional installation</option>
                    </select>
                  </div>
                  <div className='form-field full'>
                    <label htmlFor='cf-details'>Describe your project <span className='req'>*</span></label>
                    <textarea
                      id='cf-details'
                      name='details'
                      required
                      placeholder='What are we making? Where will it live? Text or artwork to include, style you love, colors to match — everything helps.'
                      value={form.details}
                      onChange={set('details')}
                    />
                  </div>
                  <div className='form-field full'>
                    <label htmlFor='cf-links'>Links to inspiration or artwork files</label>
                    <input
                      id='cf-links'
                      name='referenceLinks'
                      type='text'
                      placeholder='Pinterest boards, Dropbox/Drive links to logos or sketches…'
                      value={form.referenceLinks}
                      onChange={set('referenceLinks')}
                    />
                    <span className='form-hint'>We'll request print-ready files by email once the design is agreed.</span>
                  </div>
                  <div className='form-field full'>
                    <label htmlFor='cf-hear'>How did you hear about us?</label>
                    <input id='cf-hear' name='hearAbout' type='text' value={form.hearAbout} onChange={set('hearAbout')} />
                  </div>
                </div>

                {status.state === 'error' && (
                  <div className='notice notice-error' role='alert'>{status.message}</div>
                )}

                <button
                  type='submit'
                  className='btn btn-accent'
                  style={{marginTop: '1.25rem'}}
                  disabled={status.state === 'loading'}
                >
                  {status.state === 'loading' ? 'Sending…' : 'Send my custom request'}
                </button>
              </form>
            )}
          </div>

          <aside>
            <div className='summary-panel' style={{position: 'static'}}>
              <h3>Visit the studio</h3>
              <p className='muted' style={{fontSize: '0.93rem'}}>
                1427 Sawyer Avenue<br />
                Portland, OR 97211<br /><br />
                Tuesday – Saturday<br />
                9:00am – 5:00pm
              </p>
              <h3 style={{marginTop: '1.25rem'}}>Talk to a human</h3>
              <p className='muted' style={{fontSize: '0.93rem', marginBottom: 0}}>
                (503) 555-0147<br />
                hello@luminaryfusionstudios.com
              </p>
            </div>
            <div className='notice notice-info' style={{marginTop: '1rem'}}>
              <strong>Order questions?</strong> Include your order number
              (it's on your invoice email) and pick “Question about an
              existing order” above — those jump the queue.
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  )
}
