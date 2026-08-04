# Clabb — Design System

Recorded from the built world in `clabb-prototype/index.html` after the
2026-08-04 redesign. Ground truth is the code; this file describes it.

## Direction

Category standard, played straight — the warm consumer booking-app canon at
the Airbnb Experiences × ClassPass × Sweatpals bar. Chosen by the user over
a rolled "pegboard shadow-board" direction (seed key `f1ae72da`). No irony,
no smuggled quirk. The full direction contract lives as the HTML comment at
the top of `<body>` in the artifact.

## Color

| Token | Value | Role |
|---|---|---|
| `--pine` | `#22574A` | Primary actions, active tabs, focus |
| `--pine-deep` | `#1A443A` | Pressed state |
| `--pine-soft` | `#E3ECE7` | Soft chips, icon wells, selected fills |
| `--marigold` | `#E8A33D` | **Ratings/highlights only** (stars, rating bars) |
| `--clay` | `#C4643B` | **Money only** (paid prices, budgets, unread dots) |
| `--clay-deep` / `--clay-soft` | `#8F4527` / `#F7E4D6` | Paid text on tint / paid chip fill |
| `--porcelain` | `#F6F4EF` | App ground |
| `--paper` | `#FFFFFF` | Cards, bars, sheets |
| `--ink` / `--ink-soft` / `--muted` | `#24211B` / `#443F36` / `#6E675C` | Text ramp |
| `--line` | `#E6E1D7` | Hairlines |
| `--c-*` / `--c-*-d` | per craft | Craft hue pairs for media tiles |

Discipline: marigold never appears on an action; clay never appears on a
rating. One saturated surface per screen — the craft media tile.

## Type

- `--serif` (Iowan Old Style / Palatino stack): wordmark, screen titles,
  section heads, stat numbers, **every price and total**.
- `--sans` (system stack): all UI text. Weights 600–750 for emphasis;
  tabular numerals on times, totals, and card numbers.
- No eyebrow/kicker labels above headings anywhere. Form labels and
  sheet sub-lines are the only small-bold text.

## Surfaces & elevation

- Cards: `--paper`, radius 16–18, `--shadow-card` (warm-neutral, offset +
  blur — never colored glows).
- Sheets: porcelain, radius 26 top, grabber, `up` rise animation.
- Sticky CTA bars: white, radius 20 top, `--shadow-bar`, `z-index:10`.
- Media tiles: layered scenes — duo-hue craft gradient (128deg), two
  rotated watermark line-drawings of the craft glyph, radial
  highlight/vignette, SVG-noise grain overlay. Never a centered icon in a
  colored box.

## Components

- **Event card**: tile (168px) with kind pill + spots pill (white, clay
  dot) + host avatar badge overlapping the body seam; title row with
  marigold star rating; two meta lines; serif price + note.
- **Ask card**: deliberately a different object — compact row, 58px craft
  thumb, "Project ask" kicker in clay, budget tag top-right. The four
  content kinds must be tellable apart without reading (product principle).
- **Segmented control**: recessed track `#EDE9E0`, white raised active.
- **Chips**: pill, white/hairline; active = solid pine.
- **Buttons**: `.btn` pine pill radius 14; `.done` state = pine-soft with
  drawn check; ghost = white/pine border. Scale-down press transitions.
- **Icons**: single stroke-drawn SVG set (`ICONS`/`GLYPHS`), stroke 1.7–2.
  No emoji, no unicode glyphs standing in for icons (stars, checks, and
  chevrons are all drawn paths).
- **Avatars**: initials on craft hue with radial sheen; `avstack` for
  social proof ("N going · N spots left").

## Motion

One system: screens slide in 260ms `cubic-bezier(.2,.8,.2,1)`; sheets rise;
success check draws its stroke once. Press states scale 0.94–0.985.
`prefers-reduced-motion` kills all of it.

## Known constraints

- Prototype is offline and dependency-free: media tiles are authored
  CSS/SVG scenes standing in for photography. In production these slots are
  photographic (Airbnb-class art direction) and the tile grammar (kind pill,
  spots pill, host badge) transfers unchanged.
- Deep links: `#discover #mentors #create #messages #profile #detail #pay
  #mentor` boot past onboarding for tooling and demos.

## Brand kit (sibling deliverable)

`clabb-prototype/brand/` holds the identity board (vessel-C mark, tagline
board, ramps). It was authored as a standalone identity concept with its own
extended dusk-toned ramps and a "marigold = the one action" rule that
**diverges from the app system recorded here** (app: marigold = ratings,
clay = money, pine `#22574A`). Treat the app system as authoritative for
product UI; reconcile the board's ramps before using it as a spec.
