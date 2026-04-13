# The Block — Submission

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

About 6 hours, built iteratively:

- ~1h scaffolding and data analysis (Vite + React + Tailwind v4, project structure, dataset profiling)
- ~2h core features (inventory grid, sidebar filters, search, vehicle detail pages, bidding flow)
- ~2h iteration and stretch features (proxy bidding, Buy Now, auction state logic, My Bids, won/lost states, URL-persisted filters, OPENLANE theming, polish)
- ~1h documentation and cleanup

I prioritized getting the buyer experience right — browse, evaluate, bid — before adding extras. Each feature was built iteratively based on what felt missing while using the app.

## Assumptions and Scope

**Included:**
- Full inventory browsing with text search, 10 sidebar checkbox filters, and 9 sort options
- Vehicle detail pages with image gallery, full specs, condition reports with damage notes, and pricing
- eBay-style proxy bidding with confirmation modals and toast notifications
- Buy Now with binding purchase confirmation flow
- Auction status logic gating all bidding UI (live/upcoming/ended)
- Won/Lost/Purchased outcome states based on reserve price
- Watchlist and My Bids views with sorting and localStorage persistence
- URL-persisted filters — shareable and bookmarkable filtered views
- Pagination (12 per page)
- Responsive design with mobile slide-out filter drawer
- OPENLANE brand theming (navy/blue palette, Poppins font, pill buttons)

**Intentionally skipped:**
- Authentication / user accounts (per challenge guidelines)
- Backend / database (frontend-only prototype)
- Seller workflows, payments, checkout
- Real-time multi-user bid updates (would need WebSockets)

**Simplified:**
- Auction times normalized at app load so there's always a realistic mix of live/upcoming/ended
- Single-user bidding model — your max bid always wins unless reserve isn't met
- Placeholder images from the dataset (placehold.co)
- Bid and watchlist state backed by localStorage, not a server

## Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Data:** Static JSON import (200 vehicles from provided dataset)
- **Persistence:** localStorage for bids, watchlist, and purchases
- **Backend:** None (client-side SPA)
- **Database:** None (localStorage)

## What I Built

A buyer-facing vehicle auction platform. The core experience:

### Browsing & Filtering
- Text search across make, model, year, lot, and VIN
- Sidebar checkbox filters (Best Buy-style): auction status, condition grade, make, body style, transmission, drivetrain, fuel type, province, title status, and Buy Now Only toggle
- Price range inputs
- 9 sort options including "Recommended" (live auctions first)
- Collapsible filter groups with "Show all / Show less" for long lists
- Active filter chips with individual remove buttons
- Pagination — 12 per page with numbered navigation
- URL-persisted filters — every filter, sort, and page encodes to query params

### Vehicle Details
- Image gallery with thumbnail navigation
- Specs grid (odometer, transmission, drivetrain, fuel, year, location, dealership, title status)
- Condition grade with color-coded label (Excellent → Poor)
- Damage notes with visual indicators
- Pricing summary (starting bid, Buy Now price)
- Tooltips on truncated text

### Bidding
- eBay-style proxy bidding — set a max bid, current bid only rises when others bid against you
- Tiered minimum increments ($100 under $5K, $250 under $15K, $500 under $30K, $1K above)
- Quick-bid buttons at calculated increments
- Confirmation modal before every bid warning it can't be retracted
- Toast notifications for bid feedback (6s auto-dismiss)
- Can only increase your max bid, not re-bid at the same level
- Bid validation — can't bid below starting bid or on ended/upcoming auctions

### Buy Now
- Full-width Buy Now button with price on live auctions that have a Buy Now price
- Confirmation modal with binding purchase warning
- Purchased state persisted in localStorage
- Only available on live auctions

### Auction Logic
- Live/Upcoming/Ended status badges with countdown timers
- Timers computed once at app load — ended auctions stay ended (no reset)
- Ended auctions block all bidding and Buy Now UI
- Won (gold trophy) — your max bid met the reserve on an ended auction
- Reserve Not Met (red) — your max bid was below the reserve
- Purchased (gold trophy) — Buy Now purchases
- Purchased vehicles treated as "ended" in filters and sort

### Buyer Tools
- Watchlist with localStorage persistence and heart icon toggle
- My Bids view showing all bid/purchased vehicles with sorting
- Header badge count — active live bids only (excludes purchased and ended)
- Filter persistence when navigating to/from vehicle details

### Design
- OPENLANE brand theming — navy (#0A1B5F), electric blue (#0061FF), Poppins font
- Pill-shaped buttons and inputs (border-radius: 9999px)
- Card hover lift with shadow animation
- Fade-in and slide-up page transitions
- Pulsing dot on live auction badges
- Mobile-responsive with slide-out filter drawer

## Notable Decisions

**Proxy bidding over simple bidding** — A simple "enter amount, bid goes up" model lets you bid infinitely with no ceiling. The eBay proxy model is more realistic: you commit to a max, and the system bids the minimum needed to keep you ahead. This creates a natural stopping point and matches how auction buyers actually think about risk.

**Auction status gates the entire UX** — Rather than just showing status badges, auction state controls what you can do. Can't bid on ended auctions. Can't Buy Now on upcoming ones. Won/lost outcomes depend on reserve price math. This required threading status awareness through filters, sort, bid panel, cards, and the My Bids count.

**URL-persisted filters** — Filters live in query params, not React state. This means filtered views are shareable, bookmarkable, and survive navigation. A small architectural choice that makes the app feel like a real product rather than a prototype.

**Shared bid state** — One `useBids()` instance lives in App and passes down to all pages. This means placing a bid on a detail page immediately reflects in My Bids, the header count, and inventory badges. No refresh needed, no state sync bugs.

**"Ended" as the universal public status** — Following eBay's pattern: the browse view doesn't distinguish how an auction ended. It just says "Ended." Your personal outcome (Won/Lost/Purchased) appears only in personal views (detail page bid panel, My Bids). This avoids leaking private user state into public-facing UI.

**No component library** — All UI built from scratch with Tailwind. Keeps the bundle small, avoids fighting a design system's opinions, and makes every visual choice intentional and explainable.

## Testing

I tested continuously as I built — using the app as a buyer after each feature, catching gaps, and adding what was missing. Many of the stretch features came directly from this process:

- **Bidding on ended auctions** — I placed a bid, watched the timer run out, and realized nothing stopped me from bidding again. That led to auction status gating the entire bid UI.
- **Buy Now with no outcome** — After clicking Buy Now, the vehicle still showed "Live" with a countdown. That didn't make sense, so I added the purchased state and switched the badge to "Ended."
- **Won vs. lost** — I bid on a vehicle, the auction ended, and the detail page just said "Auction Ended." There was no indication I'd won. I added the reserve price check: if my max bid met the reserve, show "Won" with a trophy. If not, show "Reserve Not Met" in red so I know why I lost.
- **Bid counter inflation** — Every time I increased my max bid, the bid count went up and the current bid climbed. That's not how eBay works — raising your ceiling shouldn't change the visible state. That led to the proxy bidding rewrite.
- **Sold vehicles in Live filter** — I purchased a vehicle via Buy Now, then filtered by "Live" and it was still there. Purchased vehicles needed to be treated as "ended" in the filter logic.
- **Timer reset** — A countdown hit zero, then reset to 24 hours. The day offset was recalculating on every render instead of being fixed at app load.
- **Filters lost on navigation** — I spent time setting up filters, clicked into a vehicle, hit back, and everything was gone. That drove the URL-persisted filters and router state preservation.

Manual testing also covered:
- Desktop (Chrome, Firefox) at various viewport widths
- Mobile viewport simulation (Chrome DevTools)
- Empty states (no search results, empty watchlist, empty My Bids)
- Bid validation (below starting bid, below current max)
- Filter combinations and pagination boundaries

TypeScript strict mode (`tsc -b`) enforces type safety at build time across all components, hooks, and utilities.

## What I'd Do With More Time

**CI/CD pipeline** — GitHub Actions workflow for automated linting (ESLint), type checking (`tsc --noEmit`), and test runs on every pull request. Branch protection rules requiring passing checks before merge. Staging deploy previews via Vercel or Netlify so reviewers can see changes live before merging.

**Unit tests** — Vitest with React Testing Library. Priority targets: bid increment logic, proxy bidding state transitions, auction status computation, filter/sort logic, currency and distance formatting. These are the business-critical paths where bugs would directly affect the buyer experience.

**E2E tests** — Playwright for full user flow coverage: browse → filter → bid → confirm → verify in My Bids. Additional scenarios for Buy Now flow, auction state transitions (live → ended), watchlist add/remove, and URL filter persistence. Run in CI against the production build.

**Backend + database** — Express or Next.js API routes with PostgreSQL. Move bid state, watchlist, and purchase history server-side. Add WebSocket connections (Socket.io or native WS) for real-time bid updates across multiple concurrent buyers. This is the biggest gap between prototype and production.

**Authentication + authorization** — OAuth 2.0 (Google/GitHub) or session-based auth. Per-user bid history, watchlists, and purchase records. Role-based access if expanding to seller workflows. JWT tokens for API auth.

**Accessibility** — ARIA labels on interactive elements, keyboard navigation through image gallery and modals, focus trapping in modals, skip-to-content link, screen reader testing with NVDA/VoiceOver.

**Additional features** — Vehicle comparison (side-by-side), bid history timeline per vehicle, dark mode (Tailwind `dark:` variants), skeleton loading states, image carousel with swipe on mobile.

## AI Tool Usage

I used Claude Code throughout development. It scaffolded the project, implemented features based on my direction, and iterated on designs based on my feedback. Every product decision — what to build, how bidding should work, what logical inconsistencies to fix, what the UX should look like — was mine. I caught issues like bidding on ended auctions, sold vehicles showing as "live," timers resetting after countdown, and the bid counter inflating on max bid increases. Claude Code was the tool; the judgment was mine.
