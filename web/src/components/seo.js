import React from 'react'

const SITE_TITLE = 'Luminary Fusion Studios'
const SITE_DESCRIPTION =
  'Precision CNC woodworking: custom signs, furniture, wall art and heirloom pieces, machined and hand-finished in our studio.'

export default function Seo ({title, description}) {
  const fullTitle = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE
  return (
    <>
      <title>{fullTitle}</title>
      <meta name='description' content={description || SITE_DESCRIPTION} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description || SITE_DESCRIPTION} />
      <meta property='og:type' content='website' />
    </>
  )
}
