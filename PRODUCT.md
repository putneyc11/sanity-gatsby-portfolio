# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

*(The deliverable is a browser-hosted phone-frame prototype of a mobile app.
The design language is app-native iOS-class mobile; the artifact itself runs
as a single self-contained web page with no build step.)*

## Users

Adults who make things — or want to start. Craft-curious people looking for
in-person creative classes and company; experienced makers who mentor or
teach; studios and creative businesses listing their existing classes.
Confirmed accurate against `clabb-prototype/HANDOFF.md` on 2026-08-04.

## Product Purpose

Clabb is a mobile social network for creatives: find classes and creative
events, join free collaboration sessions, post one-on-one "project asks,"
and connect with verified mentors. Tagline (binding, never edited):
**creative collaboration feeds the soul.**

## Positioning

Sweatpals/Meetup-shaped, but focused entirely on *making art together* —
and Clabb handles registration and payment end-to-end, including holding
project-ask payment until the session happens. The mentor graph is
verified and portfolio-backed, not self-asserted.

## Operating Context

Used on a phone, often while deciding what to do tonight or this week.
Sessions happen in real studios and workshops. Four content kinds flow
through one feed: paid classes (supplies included), free collab sessions,
project asks (one-on-one, with offers at free/hourly/fixed rates), and
mentor profiles.

## Capabilities and Constraints

- Prototype is a single self-contained `index.html`: phone frame, vanilla JS
  screen router, sample data, no dependencies, no network, no build step.
- Implemented flows: 3-step onboarding · Discover (search, craft chips, type
  segmenting, filter sheet) · event details ×3 kinds · register-and-pay sheet
  (seat qty, fee breakdown) · free registration · offer-to-help sheet ·
  mentor list + profiles (portfolio grid, rating bars, reviews) ·
  request-a-session sheet · create flows ×3 · messages list · profile with
  mentoring settings.
- Photos are placeholder craft-colored tiles; the prototype stays fully
  offline.
- Must remain verified working end-to-end in headless Chromium, no JS errors.

## Brand Commitments

- Name: **Clabb**. Tagline: **creative collaboration feeds the soul.**
- Palette families: **pine** (primary), **marigold**, **clay** — with
  incumbent hexes pine `#22574A`, marigold `#E8A33D`, clay `#C4643B`,
  porcelain `#F6F4EF`, ink `#24211B`, plus per-craft `--c-*` hues.
- Semantic roles in the incumbent system: marigold = ratings/highlights,
  clay = paid/pricing.
- A brand kit exists on this branch's sibling work (vessel-C mark, serif
  voice, material studies); it is a *candidate*, not a commitment.
- **Standing direction preference (2026-08-04):** the user chose the
  category standard, played straight — the warm consumer booking-app canon
  executed at full fidelity, benchmarked against Airbnb Experiences
  (editorial warmth, photography-led cards, effortless booking), ClassPass
  (fast utilitarian schedules, spots-left clarity), and Sweatpals
  (community-event energy). No irony, no smuggled quirk.
- Type tradition to date: Palatino-class serif for wordmark/display, system
  sans for UI, uppercase letterspaced eyebrows.

## Evidence on Hand

- `clabb-prototype/index.html` — the working prototype (product truth for
  flows, copy, and sample data).
- `clabb-prototype/HANDOFF.md`, `clabb-prototype/README.md` — confirmed
  product description.
- No real customers, testimonials, metrics, or press. Pre-launch: nothing
  may be fabricated as real-world proof.

## Product Principles

1. The table is the product — classes are the excuse; time spent making
   things next to people is what Clabb actually sells.
2. Payment is plumbing, not theater — registering and paying should feel
   like reserving a seat, never like checkout friction or upsell.
3. Mentors are people before products — portfolios, voice, and reviews
   carry trust; badges and stats stay quiet.
4. Four kinds, one feed — paid class, free collab, project ask, and mentor
   must be instantly distinguishable without reading.
5. Nothing gamified — no streaks, badges, or urgency theater beyond honest
   seat scarcity.
