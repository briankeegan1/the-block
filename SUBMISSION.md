# The Block — Vehicle Auction Platform

## How to Run

```bash
# Clone the repo
git clone https://github.com/briankeegan1/the-block.git
cd the-block/app

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Requirements:** Node.js 18+ and npm.

To build for production:
```bash
npm run build
npm run preview
```

## Time Spent

Approximately 5–6 hours total, broken into:
- ~1h scaffolding (Vite + React + Tailwind v4, project structure, data analysis)
- ~2.5h core features (inventory grid, filters, search, vehicle detail page, bid flow)
- ~1h stretch features (auction status badges, watchlist with localStorage, visual polish)
- ~0.5h documentation and cleanup

I prioritized getting the core buyer experience right before adding extras. The auction badge and watchlist were high-value additions that map directly to how a real buyer would use the platform.

## Assumptions and Scope

**Included:**
- Full inventory browsing with text search and multi-filter support (7 filter categories + price range)
- 7 sort options including "ending soon" and "most bids"
- Vehicle detail pages with image gallery, full specs, condition reporting, damage notes, and pricing
- Bidding with tiered minimum increments (scales with price), quick-bid buttons, and live feedback
- Auction status badges (live/upcoming/ended) with normalized time relative to "now"
- Watchlist with localStorage persistence
- Responsive design across mobile, tablet, and desktop

**Intentionally skipped:**
- Authentication / user accounts (per challenge guidelines)
- Backend / database (frontend-only prototype, bid state is in-memory)
- Seller workflows, payments, checkout
- Real-time bid updates (would need WebSockets in production)
- Pagination (200 vehicles renders well without it)

**Simplified:**
- Auction times are normalized relative to today so the demo always has a mix of live/upcoming/ended states
- Bids are stored in module-scoped memory — they persist during a session but not across page reloads
- Reserve price is shown as "not yet met" but there's no reserve-met celebration flow

## Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Data:** Static JSON import (200 vehicles from provided dataset)

No backend, no database. This is a client-side SPA.

## What I Built

A buyer-facing auction platform where users can browse a grid of 200 vehicles, filter and sort by various criteria, view detailed vehicle pages with specs/condition/photos, and place bids with immediate feedback.

**Key flows:**
1. **Browse** — Responsive grid of vehicle cards with search, 9 filters, and 7 sort options
2. **Inspect** — Full detail page with image gallery, specs grid, condition grade with damage notes, and pricing breakdown
3. **Bid** — Quick-bid buttons at calculated increments, custom amount input, validation, success/error feedback, and updated bid count
4. **Watch** — Heart icon to save vehicles to a localStorage-backed watchlist, accessible from the header

## Notable Decisions

**Tiered bid increments** — Rather than a flat increment, the minimum bid step scales with price ($100 under $5K, $250 under $15K, $500 under $30K, $1000 above). This mirrors how real auction houses work and prevents someone from winning a $40K vehicle by bidding $1 more.

**Module-scoped bid store** — Bids are stored in a Map outside of React state so they survive component unmounts (navigating away and back). A proper implementation would use a server, but for a prototype this gives the right UX behavior.

**Normalized auction times** — The dataset has fixed dates. Instead of everything showing as "ended," I shift auction times relative to today so there's always a realistic mix of live, upcoming, and ended auctions in the demo.

**Tailwind v4** — Used the new `@tailwindcss/vite` plugin (no `tailwind.config.js` needed). Simpler setup, faster builds, aligns with where the ecosystem is heading.

**No component library** — Built all UI components from scratch with Tailwind. This keeps the bundle small, avoids fighting a design system's opinions, and makes every visual choice intentional.

**Watchlist over bid history** — Given the time box, I chose watchlist as the stretch feature because it maps to a real buyer workflow (monitoring multiple vehicles before deciding where to bid) and it demonstrates localStorage persistence cleanly.

## Testing

Manual testing across:
- Desktop (Chrome, Firefox) at various viewport widths
- Mobile viewport simulation (Chrome DevTools)
- Edge cases: no search results, empty watchlist, bid validation (below minimum, non-numeric), vehicles with 0 bids vs. active bids, vehicles with/without buy-now prices

The build pipeline includes TypeScript strict type checking (`tsc -b`) which catches type errors at build time.

## What I'd Do With More Time

- **Real-time bidding** — WebSocket connection for live bid updates across clients
- **Bid history** — Show a timeline of bids per vehicle so buyers can gauge momentum
- **Vehicle comparison** — Side-by-side comparison of 2-3 shortlisted vehicles
- **URL-persisted filters** — Encode filter state in query params so filtered views are shareable/bookmarkable
- **Accessibility audit** — ARIA labels, keyboard navigation through the image gallery, focus management on bid confirmation
- **Skeleton loading states** — Shimmer placeholders while images load
- **Unit tests** — Vitest for the format utilities, bid increment logic, and filter logic
- **Dark mode** — Tailwind makes this straightforward with `dark:` variants
