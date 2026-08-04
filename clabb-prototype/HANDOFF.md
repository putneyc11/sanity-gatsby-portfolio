# Clabb — session handoff

Context file for continuing work on the Clabb prototype in a fresh session.
Read this and `README.md` before making changes.

## Current state

- Branch: `claude/clabb-app-prototype-qspeb9` (all work lives here)
- Deliverable: `clabb-prototype/index.html` — a single self-contained,
  dependency-free interactive prototype (phone frame, vanilla JS screen
  router, sample data). Open it in a browser to run it; no build step.
- Verified working end-to-end with headless Chromium (no JS errors).

## What Clabb is

A mobile social network for creatives — tagline: *creative collaboration
feeds the soul*. Similar to Sweatpals/Meetup but focused on making art
together. Core concepts:

1. **Classes/events** — hosted by individuals or studio partners; paid
   tickets (supplies included) or free; Clabb handles registration/payment.
2. **Collab sessions** — free creative hangouts, registration only.
3. **Project asks** — one-on-one requests ("help me build shop jigs");
   mentors respond with offers (free, hourly, or fixed rate); Clabb holds
   payment until the session happens.
4. **Mentors** — verified profiles with past-project portfolios, overall
   rating + breakdown, individual reviews, rates, and session requests.
5. **Profile/onboarding** — craft interests, skill level, mentoring
   availability, hourly/per-project/free rates.

## Implemented flows (all in index.html)

Onboarding (3 steps) · Discover feed with search, craft chips, type
segmenting, and a filter sheet (craft / date / free-vs-paid) · Event
details for all three kinds · Register & pay sheet with seat qty and fee
breakdown · Free registration · Offer-to-help sheet · Mentor list +
profiles (portfolio grid, rating bars, reviews) · Request-a-session sheet ·
Create flows for all three kinds (paid toggle, supplies badge, budget
styles) · Messages list · Profile with mentoring settings.

## Design system

- Palette: pine `#22574A` (primary), marigold `#E8A33D` (ratings),
  clay `#C4643B` (paid/pricing), porcelain `#F6F4EF` ground, ink `#24211B`.
  Per-craft hues defined as `--c-*` custom properties.
- Type: Palatino-class serif (`--serif`) for wordmark/headings/big numbers;
  system sans (`--sans`) for UI text; uppercase letterspaced eyebrows.
- Photos are placeholder craft-colored tiles (prototype is fully offline).

## 2026-08-04 session

- Full visual redesign of `index.html` via /impeccable: category-standard
  canon at the Airbnb Experiences × ClassPass × Sweatpals bar (user-chosen
  over a rolled alternative). All flows kept working; layered craft-scene
  tiles, drawn SVG icon set, social-proof stacks, serif prices, sticky CTA
  bars. System recorded in repo-root `DESIGN.md`; product truth in
  repo-root `PRODUCT.md`.
- Brand kit added under `brand/` (board + PNG + README with a token
  reconciliation note); extended tokens under `design/tokens.css`.
- Deep links for demos: `#discover #mentors #create #messages #profile
  #detail #pay #mentor`.

## Likely next steps

- Replace authored tile scenes with real photography when online assets
  are allowed.
- Reconcile the brand board's ramps to the app tokens (see
  `brand/README.md`).
- Chat threads, host dashboard for studios, notifications.
- Porting the prototype to a real app framework (React Native/Expo).

When continuing: commit to this same branch and push with
`git push -u origin claude/clabb-app-prototype-qspeb9`.
