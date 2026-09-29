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

### RTL/bidi gotcha with numbers

The Unicode bidi algorithm reorders numeric expressions inside RTL text — a "6 / 12" ratio, a "+10" sign, or a "₪350" amount can render with the sign/symbol on the wrong side. Rule: **isolate only the numeric token** (`<span dir="ltr" className="inline-block">+10</span>`, `6/12`, `₪350`) and leave any Hebrew unit or sentence text in the normal RTL flow. **Never wrap "number + Hebrew unit" (`10 נק'`, `83 ק"ג`) in `dir="ltr"`**: inside a Hebrew sentence that puts the unit *before* the number for the reader (and moves the geresh to the wrong side). Plain `{n} נק'` / `{arrow} {n} ק"ג` in RTL flow reads correctly. Don't judge this from a screenshot — measure the real visual order (per-character `Range.getBoundingClientRect()` x positions). For recharts axes, avoid the `unit` prop on `<YAxis>` (same issue in SVG text); keep units in titles/legends/tooltips.
