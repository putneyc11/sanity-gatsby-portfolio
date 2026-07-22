// Product catalog for the shop. Prices are in USD cents so the checkout
// function can hand them straight to Stripe without float math.
// To manage products from a CMS later, mirror this shape in the Sanity
// `product` schema (studio/schemas/documents/product.js) and swap this
// module for a query.
const products = [
  {
    id: 'lf-001',
    slug: 'family-name-established-sign',
    name: 'Family Name & Established Sign',
    category: 'Signs',
    wood: 'Walnut',
    price: 14500,
    weightOz: 52,
    dimensions: '24" × 12" × 0.75"',
    lead: 'V-carved family name sign with established date, finished in matte poly.',
    description:
      'Our most-requested housewarming piece. Your family name and established year are V-carved into solid walnut on our 3-axis CNC, then hand-sanded and sealed with a matte polyurethane that deepens the grain. Includes a keyhole slot for flush wall mounting.',
    tone: ['#5d4433', '#8a6a4f'],
    art: 'sign',
    featured: true
  },
  {
    id: 'lf-002',
    slug: 'topographic-lake-map',
    name: 'Topographic Lake Map',
    category: 'Wall Art',
    wood: 'Baltic Birch',
    price: 21900,
    weightOz: 70,
    dimensions: '20" × 30" × 1.5"',
    lead: 'Layered bathymetric map of your favorite lake, CNC-cut from Baltic birch.',
    description:
      'Each depth contour of your chosen lake is machined from a separate sheet of Baltic birch, stained in graduating blues, and laminated into a dimensional map. Tell us the lake at checkout — we generate the contours from survey bathymetry data.',
    tone: ['#3d5a6c', '#7fa8b8'],
    art: 'topo',
    featured: true
  },
  {
    id: 'lf-003',
    slug: 'end-grain-cutting-board',
    name: 'End-Grain Cutting Board',
    category: 'Kitchen',
    wood: 'Maple & Walnut',
    price: 16800,
    weightOz: 96,
    dimensions: '18" × 12" × 1.75"',
    lead: 'Checkerboard end-grain board with CNC-milled juice groove and handholds.',
    description:
      'A butcher-block style board built from alternating hard maple and black walnut. The juice groove, recessed handholds, and perfectly flat faces are milled on the CNC; the finish is food-safe mineral oil and beeswax. Kind to knife edges and built to be resurfaced for decades.',
    tone: ['#7a5b3a', '#c9a876'],
    art: 'board',
    featured: true
  },
  {
    id: 'lf-004',
    slug: 'geometric-walnut-clock',
    name: 'Geometric Walnut Wall Clock',
    category: 'Home Decor',
    wood: 'Walnut',
    price: 9800,
    weightOz: 30,
    dimensions: '14" diameter × 0.75"',
    lead: 'Faceted low-poly clock face machined from a single walnut blank.',
    description:
      'Sixty facets machined into solid walnut catch the light differently every hour. Fitted with a silent quartz sweep movement and brass hands. Each clock is oiled, waxed, and numbered on the back.',
    tone: ['#4e3b2a', '#77593d'],
    art: 'clock',
    featured: false
  },
  {
    id: 'lf-005',
    slug: 'custom-logo-business-sign',
    name: 'Custom Logo Business Sign',
    category: 'Signs',
    wood: 'White Oak',
    price: 32500,
    weightOz: 120,
    dimensions: '36" × 18" × 1"',
    lead: 'Your logo, vectorized and carved in relief for lobby or storefront.',
    description:
      'Send us your logo and we handle the rest: vector conversion, a machining proof for your approval, 2.5D relief carving in white oak, and a UV-resistant finish. Standoff mounting hardware included. For illuminated or oversized signage, use the custom request form.',
    tone: ['#8a7048', '#b3966a'],
    art: 'sign',
    featured: false
  },
  {
    id: 'lf-006',
    slug: 'live-edge-serving-tray',
    name: 'Live-Edge Serving Tray',
    category: 'Kitchen',
    wood: 'Cherry',
    price: 8900,
    weightOz: 44,
    dimensions: '22" × 11" × 1"',
    lead: 'Cherry tray with CNC-milled recess and sculpted handles, natural edge intact.',
    description:
      'We flatten a live-edge cherry slab on the CNC, mill a shallow serving recess, and sculpt integral handles — leaving one natural edge untouched. Finished with food-safe hardwax oil. Grain and edge character vary board to board; no two trays match.',
    tone: ['#8c4f36', '#c07a54'],
    art: 'board',
    featured: false
  },
  {
    id: 'lf-007',
    slug: 'mid-century-record-console',
    name: 'Mid-Century Record Console',
    category: 'Furniture',
    wood: 'Walnut & Steel',
    price: 189000,
    weightOz: 1120,
    dimensions: '48" × 18" × 24"',
    lead: 'CNC-joined walnut console with record storage and cable management.',
    description:
      'Flat-pack precision meets heirloom hardwood: every joint in this console is CNC-cut for a dead-square, glue-optional assembly. Holds 200+ LPs with a turntable isolation top, milled cable channels, and hairpin steel legs. Ships freight, fully insured.',
    tone: ['#4a3626', '#6e5138'],
    art: 'furniture',
    featured: true
  },
  {
    id: 'lf-008',
    slug: 'mountain-range-silhouette',
    name: 'Mountain Range Silhouette',
    category: 'Wall Art',
    wood: 'Ash',
    price: 12400,
    weightOz: 58,
    dimensions: '36" × 12" × 0.75"',
    lead: 'Three-layer mountain skyline of your chosen range, cut in ash.',
    description:
      'Pick any mountain range — we pull the real elevation profile and machine it as three offset layers of ash with a smoked gradient stain. Ships with a French cleat for easy level hanging.',
    tone: ['#5f6c5d', '#93a08b'],
    art: 'topo',
    featured: false
  },
  {
    id: 'lf-009',
    slug: 'inlaid-chess-board',
    name: 'Inlaid Chess Board',
    category: 'Home Decor',
    wood: 'Maple & Wenge',
    price: 24500,
    weightOz: 88,
    dimensions: '20" × 20" × 1.25"',
    lead: 'Tournament-size board with zero-gap CNC inlay and coordinate engraving.',
    description:
      'Sixty-four squares of maple and wenge inlaid to tolerances only a CNC can hold — seams disappear under your fingertip. Algebraic coordinates are micro-engraved in the border, and a felt-lined underside protects your table. Pieces not included.',
    tone: ['#3a2f26', '#d8c9a3'],
    art: 'board',
    featured: false
  },
  {
    id: 'lf-010',
    slug: 'floating-nightstand-pair',
    name: 'Floating Nightstand (Pair)',
    category: 'Furniture',
    wood: 'White Oak',
    price: 54000,
    weightOz: 420,
    dimensions: '18" × 12" × 6" each',
    lead: 'Wall-mounted oak nightstands with hidden fixings and soft-close drawer.',
    description:
      'A pair of wall-hung nightstands machined from rift-sawn white oak. The CNC cuts the dovetailed drawer, the finger pull, and the concealed mounting cavity in one setup, so everything lines up — always. Hardwax oil finish; mounting template included.',
    tone: ['#9c805a', '#c4ab83'],
    art: 'furniture',
    featured: false
  },
  {
    id: 'lf-011',
    slug: 'monogram-charcuterie-board',
    name: 'Monogram Charcuterie Board',
    category: 'Kitchen',
    wood: 'Acacia',
    price: 7200,
    weightOz: 40,
    dimensions: '16" × 10" × 0.75"',
    lead: 'Paddle-style board engraved with your monogram or short message.',
    description:
      'A favorite for weddings and closings. Add up to three initials or a short message at checkout and we engrave it in your choice of script or block lettering. Finished food-safe. Orders of 10+ qualify for event pricing — ask via the contact form.',
    tone: ['#7d5a3c', '#b08a5e'],
    art: 'board',
    featured: false
  },
  {
    id: 'lf-012',
    slug: 'acoustic-slat-wall-panel',
    name: 'Acoustic Slat Wall Panel',
    category: 'Wall Art',
    wood: 'Oak & Felt',
    price: 19800,
    weightOz: 210,
    dimensions: '94" × 24" × 0.9"',
    lead: 'Oak slats on acoustic felt — warmth for your walls and your room tone.',
    description:
      'CNC-ripped oak slats bonded to 9mm recycled acoustic felt tame echo in offices, studios, and living rooms. Panels cut cleanly on site for outlets and corners. Price is per panel; for full-wall layouts send your dimensions through the custom request form.',
    tone: ['#6b5138', '#2f2b28'],
    art: 'slats',
    featured: false
  }
]

module.exports = products
