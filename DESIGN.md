# Clabb — Design System

Recorded from the built world in `clabb-prototype/index.html` after the
2026-08-09 "Midnight Studio" restyle (user-directed full visual redesign
via /high-end-visual-design: new palette, bold modern type, refined icons,
full signup flow). Ground truth is the code; this file describes it.

## Direction

Ethereal-glass consumer booking app: OLED-black ground with iris/ember
mesh glow, hairline glass surfaces, floating island tab bar, double-bezel
cards, nested-icon CTAs. Structure and flows remain the category-standard
booking canon from the 2026-08-04 redesign.

## Color

| Token | Value | Role |
|---|---|---|
| `--ground` | `#0B0C10` | App ground (OLED black, blue cast) |
| `--surface` / `--surface-2` | `#14161C` / `#101218` | Sheets, inputs |
| `--glass` / `--glass-2` | `white 5% / 8%` | Cards, chips, wells |
| `--hairline` / `--hairline-2` | `white 9% / 14%` | All borders |
| `--ink` / `--ink-soft` / `--muted` / `--faint` | `#F5F6F8 / #C9CDD6 / #A7ADBB / #7E8494` | Text ramp |
| `--iris` / `--iris-deep` | `#8B8BF4 / #5B5BD6` | **The action color**: buttons, active tabs, FAB, links, focus |
| `--ember` | `#F2A85C` | **The value color**: prices, ratings, budgets, seat scarcity |
| `--good` | `#63D6A4` | Free pricing |
| `--c-*` / `--c-*-d` | per craft | Duotone tile pairs (deepened for dark ground) |

Discipline: iris acts, ember values — never swapped. Two accents total;
everything else is glass and hairlines. Craft tiles are the only
polychrome moments.

## Type

- Display: **Clash Display 600/700** (embedded woff2, offline-safe) —
  wordmark, screen titles, card titles, stats, prices, sheet heads.
  Tight tracking (-.005 to -.02em), never below 600.
- UI: **Plus Jakarta Sans** variable 400–800 (embedded). Flagged by the
  mechanical detector as an overused face; kept deliberately — the
  invoked skill names it approved, and Clash Display carries identity.
- Tabular numerals on all data (times, totals, counts, ratings).
- Eyebrow pills (uppercase, .2em+ tracking) allowed in this world —
  welcome hero, kind tags.

## Surfaces & components

- **Double-bezel cards**: outer glass shell (`--glass`, hairline, r24,
  p6) around inner media tile (r18) — machined-hardware nesting.
- **Floating island tab bar**: detached pill, `rgba(18,20,26,.78)` +
  22px blur (fixed element — blur budget respected), iris FAB with glow.
- **Nested-icon CTAs**: primary buttons are iris gradient pills; trailing
  arrows sit inside their own `white/16` circle (`.btnic`).
- Sheets: `--surface`, r28 top, hairline top edge, cover the island
  (screenhold must NOT create a stacking context — no z-index on it).
- Sticky detail CTA: blurred glass bar, 88px bottom padding clears island.
- Icons: single hand-drawn SVG set, 24-grid, **1.5 stroke** (light,
  precise), round caps; fills only for stars and brand marks.

## Onboarding / auth

Welcome (glass mosaic w/ rotations, eyebrow, Clash wordmark) → auth
(Continue with Apple / Google / Facebook + email; sign-in variant via
`authMode`) → email form (name/email/password + Show toggle) → interests
→ mentoring. Social/email auth are demo stubs (toast + advance); brand
marks are inline SVG. Steps: `0 → 'auth' → 'email' → 1 → 2`.

## Motion

One system: `cubic-bezier(0.32,0.72,0,1)` everywhere; screens rise 18px
over 500ms; sheets rise 56px; welcome staggers its children (riseup);
press states scale .975–.98; success check draws once.
`prefers-reduced-motion` kills all of it.

## Known constraints

- Single offline file: fonts embedded as base64 (Clash 600/700 +
  PJS variable ≈ 57KB); tiles are authored CSS/SVG scenes standing in
  for photography.
- Deep links: `#discover #mentors #create #messages #profile #detail
  #pay #mentor`.

## Prior worlds

The 2026-08-04 "studio daylight" system (pine/marigold/clay, porcelain,
Palatino-class serif) and its evening-chrome variant are superseded by
this restyle at the user's direction. The brand kit under
`clabb-prototype/brand/` still reflects the old palette — treat as
historical until rebuilt.
