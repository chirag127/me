# Chirag Singhal — Portfolio

> Modern, data-driven developer portfolio built with
> React 19, TypeScript, Vite, and Mantine 8.

[![CI/CD](https://github.com/chirag127/me/actions/workflows/deploy.yml/badge.svg)](https://github.com/chirag127/me/actions/workflows/deploy.yml)

## ✨ Features

- **66 pages** across 7 thematic "drives"
- **Dark theme** with glassmorphism UI
- **Real data only** — no invented stats
- **Live embeds** — GitHub stats, LeetCode card
- **Profile links** — 20+ platforms
- **Tech frequency chart** — computed from resume
- **Lazy-loaded** routes with code splitting
- **PWA-ready** with hash router

## 🗂️ Drives

| Drive | Pages | Description |
|-------|-------|-------------|
| Me | 14 | Dashboard, story, journal, interests, gear, travel, finance |
| Work | 8 | Resume, experience, TCS, skills, projects, services, education, certs |
| Code | 6 | GitHub stats, LeetCode, reputation, repos, NPM, resume JSON |
| Library | 23 | Movies, TV, music, books, anime, manga, browse history |
| Gaming | 4 | Hub, game shelf, chess, speedruns |
| Connect | 6 | Profiles, contact, guestbook, newsletter, share, widgets |
| System | 5 | Settings, theme, about, changelog, debug |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.7 |
| Build | Vite 6.4 |
| UI | Mantine 8 |
| Charts | Recharts 2 |
| Animation | Framer Motion 11 |
| State | Zustand 5 |
| Routing | react-router-dom v7 |
| Auth | Firebase Auth |
| Hosting | GitHub Pages (free) |

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/chirag127/me.git
cd me

# Install
npm install

# Dev server
npm run dev

# Production build
npx vite build
```

## 📊 Data Policy

Charts are used **only** where real, verifiable
data exists:

- ✅ Tech stack frequency (computed from
  `resume.ts` project data)
- ✅ GitHub stats (live embeds from
  github-readme-stats API)
- ✅ LeetCode card (live embed from
  leetcard.jacoblin.cool)
- ❌ No invented stats, fake ratings, or
  fabricated analytics

External platform pages (Last.fm, Trakt,
Lichess, etc.) link directly to profiles
for real-time data.

## 🏗️ Architecture

```
src/
├── components/    # Reusable UI + chart components
│   ├── charts/    # BarChartCard, AreaChartCard, PieChartCard
│   └── ui/        # GlassCard, PageHeader, StatCard
├── data/          # Resume, identity, social data
├── hooks/         # usePageMeta, useAuth
├── pages/         # 66 page components
│   ├── me/        # 14 pages
│   ├── work/      # 8 pages
│   ├── code/      # 6 pages
│   ├── library/   # 23 pages
│   ├── gaming/    # 4 pages
│   ├── connect/   # 6 pages
│   └── system/    # 5 pages
├── stores/        # Zustand state
├── router.tsx     # Route definitions
├── App.tsx        # Shell layout
└── main.tsx       # Entry point
```

## 📄 License

MIT © Chirag Singhal
