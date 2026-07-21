# Clabb — mobile app prototype

*Creative collaboration feeds the soul.*

Clabb is a social network for creatives: find classes and creative events, join
free collaboration sessions, post one-on-one "project asks," and connect with
verified mentors and teachers. Think Sweatpals/Meetup, but focused entirely on
making art together. Studios and other creative businesses can list their
existing classes and let Clabb handle registration and payment.

## Running the prototype

Open `index.html` in any browser — it's a single self-contained file with no
dependencies, no build step, and no network access required. The page shows a
phone frame with a fully interactive, sample-data version of the app; on wide
screens a side rail offers jump links into each flow.

## Flows included

- **Onboarding** — pick craft interests and skill level, opt in to mentoring,
  and set an hourly / per-project / free rate.
- **Discover (browse & search)** — feed of classes, collab sessions, and
  project asks, with text search, craft chips, a segmented type toggle, and a
  filter sheet for craft, time/date, and free vs. paid.
- **Event details & registration** —
  - *Paid class* (e.g. studio-hosted wheel throwing, supplies included):
    register-and-pay sheet with seat quantity, fee breakdown, and payment.
  - *Free collab session* (e.g. pour painting social): one-tap free
    registration.
  - *Project ask* (e.g. "help me build a crosscut sled"): a seeker describes a
    one-on-one project; helpers send an offer with a proposed rate (free,
    hourly, or fixed).
- **Mentors** — browse mentor/teacher profiles filtered by craft; each profile
  shows verification, overall rating with a star breakdown, individual
  reviews tied to past projects, a photo grid of projects done on Clabb,
  rates and availability, and a session-request flow.
- **Create** — post a new event/class (with optional paid tickets and
  supplies-included badge), a free collab session, or a project ask (with a
  budget style: skill swap, hourly, or fixed).
- **Profile & preferences** — interests, mentoring availability toggle, rate
  configuration, and your activity (asks posted, classes booked).

## Notes on the design

Palette: deep pine green (primary), marigold (ratings/highlights), clay
(paid/pricing accents) on porcelain, with a per-craft hue set for category
tiles. Wordmark and display type set in a Palatino-class serif; UI text in the
system sans. Project "photos" are placeholder craft tiles since the prototype
is fully offline.
