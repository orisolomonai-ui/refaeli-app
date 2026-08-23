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

`src/data/mockTrainees.js` exports the *seed* data only (15 mock trainees). Components must not import `mockTrainees` directly to read or mutate trainee state — they consume `useTrainees()` from `src/context/TraineesContext.jsx` instead. The provider (`TraineesProvider`, wrapping the router in `App.jsx`) holds the live trainees array in `useState` and exposes `getTraineeById`, `markAsPaid`, `addSession`, `updateTrainee`. This is what makes actions in `TraineeDetail` (mark as paid, log a session, edit) show up back on the `Dashboard` — they share the same in-memory state, which resets on page refresh.

### Routing & pages

`App.jsx` defines two routes: `/` (`Dashboard`) and `/trainee/:id` (`TraineeDetail`), both wrapped in the shared `Layout` (branded header). `TraineeDetail` is a shell (header + quick actions + tab bar) that renders one of three tab components from `src/components/trainee-detail/`: `StatusTab` (payment/sessions/points cards), `ProgressTab` (recharts line charts + before/after photo comparison), `HistoryTab` (merged, date-sorted timeline synthesized from `paymentHistory` + `sessionHistory` + `progress.weightHistory`).

### Data model (`src/data/mockTrainees.js`)

Each trainee has flat payment/session fields (`paymentStatus`, `lastPaymentDate`, `price`, `sessionsRemaining`, `totalSessions`, `lastSessionDate`, `points`) plus history logs (`paymentHistory`, `sessionHistory`) and a `progress` sub-object (`weightHistory`, `bodyFatHistory`, `muscleMassHistory`, `photos` — each a `{date, value|url}` array). When adding mutations, keep the flat fields and their corresponding history log in sync (see `markAsPaid`/`addSession` in `TraineesContext.jsx` for the pattern).

### Shared low-sessions logic

`src/lib/utils.js` defines `LOW_SESSIONS_THRESHOLD` and `isLowSessions(trainee)`, used consistently by `TraineeCard`, `Dashboard` (filter toggle), and `StatusTab` to trigger the red "low sessions" warning. Reuse this rather than re-deriving the threshold.

### Brand theme

Colors are defined once as Tailwind v4 `@theme` tokens in `src/index.css` (`--color-brand-black`, `--color-brand-gold`, `--color-brand-gold-dark`, `--color-brand-gold-light`, `--color-brand-canvas`) — there is no `tailwind.config.js`. Use these tokens (`bg-brand-gold`, `text-brand-gold-dark`, etc.) rather than ad-hoc colors. Neutral grays use the `zinc-*` scale app-wide (not `slate-*`, which clashes with the gold/silver brand palette). Payment-status colors (green/red) are semantic, not brand colors, and stay as `emerald-*`/`red-*`.

### RTL/bidi gotcha with numbers

The Unicode bidi algorithm reorders numeric expressions unpredictably inside RTL text — e.g. a "6 / 12" ratio, a "+2.2 ק"ג" delta, or a "₪350" amount can render with the sign/unit/symbol on the wrong side. The fix used throughout this codebase is to wrap the numeric span in `dir="ltr"` (see `TraineeCard.jsx`, `ProgressTab.jsx`, `HistoryTab.jsx`). Apply the same treatment to any new UI that mixes numbers with signs, units, or currency symbols. For recharts axes specifically, avoid the `unit` prop on `<YAxis>` (it hits the same issue in SVG text) — keep units in chart titles/legends/tooltips instead.
