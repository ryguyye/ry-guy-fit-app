# RyFit 💪

A mobile-first Progressive Web App (PWA) fitness tracker built with React + Vite. Install it on your iPhone or Android home screen and it runs like a native app — no App Store required.

**Live:** https://ry-guy-fit-app.pages.dev  
**Repo:** https://github.com/ryguyye/ry-guy-fit-app

---

## Features

- **Workout Tracker** — 36 exercises across 6 muscle groups. Log sets, reps, and weight in an active workout session.
- **Macro Scanner** — Circular progress rings for calories, protein, carbs, and fat. 12 quick-add foods + custom entry. Set daily goals.
- **GPS Gym Alerts** — Geofence your gym. Get push notifications automatically when you're within a configurable radius (100m–2km).
- **Gamification** — XP system (100 XP per workout + 10 XP per meal logged), 6 levels (Rookie → GOD MODE), 12 unlockable achievement badges, and streak tracking.
- **Offline-first** — Full service worker caching via Workbox. Works without internet after first load.

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm run preview    # preview production build locally
```

---

## Install on iPhone

1. Open Safari → go to your deployed URL
2. Tap the Share button → "Add to Home Screen"
3. Tap Add — launches fullscreen with no browser chrome

---

## Deploy (Cloudflare Pages)

1. Push to `main` on GitHub
2. Connect repo in [Cloudflare Pages](https://pages.cloudflare.com)
3. Build command: `npm run build` · Output dir: `dist`
4. Every push to `main` auto-deploys

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Build | Vite 5 |
| PWA | vite-plugin-pwa (Workbox) |
| Styling | Custom CSS with CSS variables |
| Storage | localStorage (no backend) |
| Location | Web Geolocation API |
| Notifications | Web Notifications API |

---

## Data Storage Keys

All data lives in `localStorage` — no backend, no account required.

| Key | Contents |
|-----|----------|
| `ryfit_profile` | XP, level, streak, lastWorkoutDate |
| `ryfit_workouts` | Array of completed workout sessions |
| `ryfit_macro_goals` | Daily calorie/macro targets |
| `ryfit_macro_log` | Per-day macro totals keyed by date string |
| `ryfit_meals_log` | Per-day array of individual meal entries |
| `ryfit_gyms` | Saved gym locations with lat/lng |
