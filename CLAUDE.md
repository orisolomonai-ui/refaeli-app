# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from this directory (`refaeli-app/`):

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint (see `.oxlintrc.json`)

There is no test suite configured in this project.

## Architecture

This is a Hebrew-RTL React app (Vite + React 19 + Tailwind CSS v4 + react-router-dom) for a fitness trainer ("Refaeli Fitness Studio") to manage trainees — consolidating registration/payments, session tracking, and progress/nutrition tracking into one dashboard + detail view. There is no backend: all data is mock data held in memory.

### State: `TraineesContext`, not the static data file

`src/data/mockTrainees.js` exports the *seed* data only (15 mock trainees). Components must not import `mockTrainees` directly to read or mutate trainee state — they consume `useTrainees()` from `src/context/TraineesContext.jsx` instead. The provider (`TraineesProvider`, wrapping the router in `App.jsx`) holds the live trainees array in `useState` and exposes `getTraineeById`, `markAsPaid`, `addSession`, `updateTrainee`. This is what makes actions in `TraineeDetail` (mark as paid, log a session, edit) show up back on the `Dashboard` — they share the same in-memory state, which resets on page refresh. `useCurrentTrainee()` returns the demo user of the trainee area (`DEMO_TRAINEE_ID`, Yuval Cohen, id 1) — swap it there when real login exists.

### Routing & pages

`App.jsx` defines two areas that share one `<Routes>` list:
- **Admin:** `/` (`Dashboard`) and `/trainee/:id` (`TraineeDetail`), wrapped in `Layout` (branded header). `TraineeDetail` is a shell (header + quick actions + tab bar) that renders one of four tab components from `src/components/trainee-detail/`: `StatusTab`, `ProgressTab` (recharts + before/after photos), `HistoryTab` (timeline synthesized from `paymentHistory` + `sessionHistory` + `progress.weightHistory`), `RefaeliCashTab`.
- **Trainee area:** `/me`, `/me/rewards`, `/me/performance`, `/me/groups`, `/me/more` — a bottom-tab-nav consumer app (styled after Clalit Active: light warm surfaces, black/gold accents, not the admin's dark header), wrapped in `TraineeLayout`. `AppShell` picks the layout by pathname prefix. Pages live in `src/pages/trainee/`.
  - `TraineeLayout` renders `AppBar` (logo, `CoinChip`, notification bell → `Sheet`, profile avatar) + the page + `BottomNav`, inside a column that fills `100dvh`. On `sm:` and up it becomes a centered ~430px "phone frame" card — same markup, no separate desktop layout to maintain.
  - Screens reuse existing components rather than duplicating them: `ProgressTab`'s data feeds `TraineePerformance`'s own charts (with `ReferenceArea` health bands), and the Refaeli Cash sections from `src/components/cash/CashSections.jsx` (`EarningRulesList`, `Leaderboard`, …) are shared as-is between `RefaeliCashTab` (admin) and `TraineeRewards`/`TraineeGroups` — the trainee area is light-themed now, so no `tone="dark"` variant is needed there.
  - `TraineeMore` ("עוד") is one screen (profile header + a list of `MoreRow`s) that opens `Sheet`s for sub-content (activity timeline via `HistoryTab`, purchased rewards, referral, membership) instead of adding more routes.
- `SplashScreen` (inside the router, shown once per session via `sessionStorage` key `refaeli_entered`): "כניסת מתאמן" → `/me`, "כניסת מנהל" → dismisses and stays on the current path (so deep links like `/trainee/3` keep working). There is no real auth.

### Trainee-area design system (`src/components/trainee-area/`)

Small reusable pieces, not one-offs — reach for these before adding new UI:
- **`Icon3D`** renders `public/3d/<name>.png`, the Fluent Emoji "3D" style (Microsoft, MIT license — see `public/3d/ATTRIBUTION.md`). Check that folder for the current icon set before fetching a new one from `github.com/microsoft/fluentui-emoji` (folder names don't always match the emoji name — verify via the GitHub contents API, e.g. `Flexed biceps` has no 3D asset upstream, so `chart_increasing` stands in for muscle mass). Interface chrome (nav, search, chevrons) uses `lucide-react`, not these.
- **`Logo`** shows `public/logo.png` and falls back to the "רפ" mark on load error — no code change needed once that file is added.
- **`CoinChip`**, **`Ring`** (SVG progress ring), **`CategoryCarousel`** (the horizontal category picker with the active item enlarged in a `Ring`), **`RewardCard`**, **`Sheet`** (bottom sheet — wrap usages in `<AnimatePresence>` for the exit animation), **`CountUp`**, **`Bar`** (from `Summaries.jsx`).

### Data model (`src/data/mockTrainees.js`) and single source of truth

Each trainee has flat payment/session fields (`paymentStatus`, `lastPaymentDate`, `price`, `sessionsRemaining`, `totalSessions`, `lastSessionDate`, `points`, plus `goalWeight` and `lastWeekRank`) plus history logs (`paymentHistory`, `sessionHistory`) and a `progress` sub-object (`weightHistory`, `bodyFatHistory`, `muscleMassHistory`, `photos` — each a `{date, value|url}` array). When adding mutations, keep the flat fields and their corresponding history log in sync (see `markAsPaid`/`addSession` in `TraineesContext.jsx` for the pattern).

`rawTrainees` in that file is the seed as authored on 2026-08-20; the exported `mockTrainees` is `normalizeTrainees(rawTrainees)`: (1) `sessionHistory` is rebuilt to `min(used, 12)` entries, and `lastSessionDate`/`lastPaymentDate` are derived from the logs so they cannot drift; (2) `goalWeight`/`lastWeekRank` are merged from `EXTRAS_BY_ID`; (3) **every date is shifted by a constant so the data is "fresh" relative to today** — otherwise the admin banner and any "this month"/"this week" figure go stale as real time passes. Derived values (current/first weight, delta, goal progress, sessions this month/week, weekly day-by-day status, streak, rank and rank change, next reward, challenge month) live in `src/lib/traineeSelectors.js`; screens must read them from there instead of recomputing.

`src/data/rewards.js` has `EARNING_RULES` (shared) and two separate reward lists: `REWARDS` (admin's `RefaeliCashTab` only — don't repurpose it) and `STORE_CATALOG`/`STORE_CATEGORIES` (the trainee-area store, richer: `category`, `type`, `description`, `icon3d`). `nextReward()` in the selectors reads `STORE_CATALOG`. `TraineesContext.checkIn(id)` and `.redeem(id, reward)` are the trainee-facing mutations — `checkIn` is `addSession` plus `+10` points (matching `EARNING_RULES[0]`), `redeem` deducts points and appends to `trainee.purchasedRewards` (not present in the seed data; only exists after a first redeem, so guard with `?? []`).

### Shared low-sessions logic

`src/lib/utils.js` defines `LOW_SESSIONS_THRESHOLD` and `isLowSessions(trainee)`, used consistently by `TraineeCard`, `Dashboard` (filter toggle), and `StatusTab` to trigger the red "low sessions" warning. Reuse this rather than re-deriving the threshold.

### Brand theme

Colors are defined once as Tailwind v4 `@theme` tokens in `src/index.css` (`--color-brand-black`, `--color-brand-gold`, `--color-brand-gold-dark`, `--color-brand-gold-light`, `--color-brand-canvas`) — there is no `tailwind.config.js`. Use these tokens (`bg-brand-gold`, `text-brand-gold-dark`, etc.) rather than ad-hoc colors. Neutral grays use the `zinc-*` scale app-wide (not `slate-*`, which clashes with the gold/silver brand palette). Payment-status colors (green/red) are semantic, not brand colors, and stay as `emerald-*`/`red-*`.

### Motion conventions

`framer-motion` (`^13.1.1`) is the animation library for both areas; `src/App.jsx` wraps everything in `<MotionConfig reducedMotion="user">` so every animation (existing and future) auto-respects the OS "reduce motion" setting with no extra per-component code. Rules followed throughout:
- Only `transform`/`opacity` are animated (never `height`/`width`/`padding`), durations stay in the 150–400ms range, and drag/scroll-driven values use `useMotionValue`/`useTransform` rather than re-rendering React state every frame.
- `src/lib/motionVariants.js` exports the one shared `staggerContainer`/`staggerItem` pair used for every "list enters with a short stagger" spot (rewards grid, leaderboard, dashboard stat tiles, `TraineeMore` rows, `TraineeGroups` podium) — reuse it instead of redefining stagger timings locally.
- **`IconCardCarousel`** (`src/components/trainee-area/IconCardCarousel.jsx`): the category icon row and the card row are driven by the *same* `useMotionValue`, so dragging the cards moves the icons in the same frame. Its card track needs an explicit `dir="ltr"` regardless of page RTL — `direction: rtl` reverses flex item order, which breaks the `translateX()` math (same class of bug as `BeforeAfterSlider`). `BenefitsBanner.jsx` reuses this exact drag/snap/autoplay pattern for a single-row carousel.
- **Testing drag gestures**: in this project's Playwright+local-Chrome setup, `page.mouse` can silently fail to (re)trigger a framer-motion drag gesture, especially on a second drag on the same element. Dispatch raw `PointerEvent`s directly on the element via `page.evaluate()` instead — `pointerdown` once, several `pointermove`s **on `window`** with a small `await sleep(16)` between them (one animation frame), then `pointerup` on `window`; include `button: 0`/`buttons: 1` and `pointerType: "mouse"`. Firing all events synchronously with no delay, or targeting only the element instead of `window` for the moves, reliably fails to register the drag.
- One-time UI (`Coachmark`, skeleton flash on `/me`) follows the existing splash-screen pattern: `sessionStorage` for "once per session" (`refaeli_home_seen`), `localStorage` for "once ever" (`refaeli_coach_seen`).
- `PointsFly.jsx` flies a "+N" badge from an action (e.g. check-in) to the `CoinChip` via a global `window` `CustomEvent` (`refaeli:points-fly`) + `createPortal`, rather than threading props/context through `TraineeLayout` for a single use case.

### RTL/bidi gotcha with numbers

The Unicode bidi algorithm reorders numeric expressions inside RTL text — a "6 / 12" ratio, a "+10" sign, or a "₪350" amount can render with the sign/symbol on the wrong side. Rule: **isolate only the numeric token** (`<span dir="ltr" className="inline-block">+10</span>`, `6/12`, `₪350`) and leave any Hebrew unit or sentence text in the normal RTL flow. **Never wrap "number + Hebrew unit" (`10 נק'`, `83 ק"ג`) in `dir="ltr"`**: inside a Hebrew sentence that puts the unit *before* the number for the reader (and moves the geresh to the wrong side). Plain `{n} נק'` / `{arrow} {n} ק"ג` in RTL flow reads correctly. Don't judge this from a screenshot — measure the real visual order (per-character `Range.getBoundingClientRect()` x positions). For recharts axes, avoid the `unit` prop on `<YAxis>` (same issue in SVG text); keep units in titles/legends/tooltips.
