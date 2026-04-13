# The Block — Vehicle Auction Platform

A buyer-side vehicle auction prototype built for the OPENLANE coding challenge. Browse inventory, inspect vehicles, and place bids with eBay-style proxy bidding.

## How to Run

```bash
git clone https://github.com/briankeegan1/the-block.git
cd the-block/app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Requires Node.js 18+.

For a production build:

```bash
npm run build
npm run preview
```

## Time Spent

Roughly 6–8 hours, built iteratively. Started with core browsing and detail pages, then layered in proxy bidding, Buy Now, auction state logic, and polish based on what felt missing while using the app.

## Assumptions and Scope

**Included:**
- Full inventory browsing with search, 10 sidebar filters, and 9 sort options
- Vehicle detail pages with image gallery, specs, condition reports, and damage notes
- eBay-style proxy bidding with confirmation modals and toast notifications
- Buy Now with binding purchase confirmation
- Auction status logic — live/upcoming/ended gating all bidding UI
- Won/Lost/Purchased outcome states based on reserve price
- Watchlist and My Bids views with localStorage persistence
- URL-persisted filters (shareable, bookmarkable)
- Responsive design with mobile filter drawer
- OPENLANE brand theming

**Intentionally skipped:**
- Authentication / user accounts (per challenge guidelines)
- Backend / database (frontend-only prototype)
- Seller workflows, payments, checkout
- Real-time multi-user bid updates

**Simplified:**
- Auction times normalized at app load for demo purposes
- Single-user bidding model — bid state is localStorage-backed
- Placeholder images from the dataset

## Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Data:** Static JSON (200 vehicles from provided dataset)
- **Persistence:** localStorage for bids, watchlist, and purchases

No backend or database. This is a client-side SPA.

## What I Built

A buyer-facing auction platform with four key flows:

1. **Browse** — Searchable inventory grid with sidebar checkbox filters, pagination, and multiple sort options
2. **Inspect** — Full detail pages with image gallery, specs, condition grading, damage notes, and pricing
3. **Bid** — Proxy bidding with max bid ceiling, tiered increments, confirmation modals, and auction state enforcement
4. **Track** — Watchlist and My Bids views showing active bids, won auctions, purchases, and lost bids

Full feature breakdown in [SUBMISSION.md](SUBMISSION.md).

## Notable Decisions

- **Proxy bidding** over simple increment bidding — creates a natural ceiling and matches real auction behavior
- **Auction status gates the UX** — can't bid on ended auctions, can't Buy Now on upcoming ones, won/lost states based on reserve math
- **URL-persisted filters** — filter state lives in query params, not component state, so views are shareable and survive navigation
- **No component library** — all UI built from scratch with Tailwind for full control and smaller bundle
- **"Ended" as the universal public badge** — following eBay's pattern, private outcomes (Won/Lost/Purchased) shown only in personal views

## Testing

Manual testing across desktop browsers (Chrome, Firefox) and mobile viewports. Edge cases covered: empty states, bid validation, auction state transitions, filter combinations, pagination boundaries. TypeScript strict mode (`tsc -b`) enforces type safety at build time.

## What I'd Do With More Time

- **CI/CD pipeline** — GitHub Actions for automated linting, type checking, and test runs on every PR. Staging deploy previews via Vercel or Netlify.
- **Unit tests** — Vitest for format utilities, bid increment logic, filter logic, and proxy bidding state machine. Target critical business logic first.
- **E2E tests** — Playwright for full user flows: browse → filter → bid → confirm → verify My Bids. Cover auction state transitions and Buy Now.
- **Backend + database** — Express or Next.js API routes with PostgreSQL. Move bid state server-side, add WebSocket connections for real-time bid updates across clients.
- **Authentication** — OAuth or session-based auth to support multi-user bidding, per-user watchlists, and bid history.
- **Accessibility audit** — ARIA labels, keyboard navigation, focus management on modals
- **Vehicle comparison** — side-by-side view of shortlisted vehicles
- **Dark mode** — Tailwind `dark:` variants
