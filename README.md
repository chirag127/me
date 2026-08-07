# oriz-me

- **Live app:** https://me.oriz.in
- **About / info:** https://chirag127.github.io/oriz-me/
- **For LLMs:** [llms.txt](https://me.oriz.in/llms.txt) · [llms-full.txt](https://me.oriz.in/llms-full.txt)

[![Deploy to Cloudflare Pages](https://github.com/chirag127/oriz-me/actions/workflows/deploy.yml/badge.svg)](https://github.com/chirag127/oriz-me/actions/workflows/deploy.yml)
[![GitHub stars](https://img.shields.io/github/stars/chirag127/oriz-me?style=flat)](https://github.com/chirag127/oriz-me/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

Personal OS for **[me.oriz.in](https://me.oriz.in)** — an engineer's instrument bench. A public, static dashboard that aggregates Chirag Singhal's work, open source, media library, live coding activity, and life stats.

**100% client-side, no upload, no signup, free.** No backend, no ads, no tracking wall. Optional oriz SSO exists but gates nothing public.

## What it does

- **Work** — career, projects, skills, education, certifications, open source, writing.
- **Library** — music, movies, TV, anime, manga, books, gaming, podcasts + a live activity feed.
- **Me** — now, story, timeline, values, goals, gear, philosophy, coding activity, journal, health, AI digital twin, FAQ.
- **Live readouts** — WakaTime coding time, GitHub repos, Last.fm scrobbles, Trakt films, Discord presence.
- Data from ~30 APIs pulled at build time into static JSON — no runtime backend.

## Tech

- **Astro** (`output: static`) + **React 19** islands + **Tailwind**.
- **@vite-pwa/astro** — installable PWA; static shell offline, live data network-only.
- **@chirag127/oz-ai** — g4f client-side AI (digital twin + Ask), runs in-browser, no server key.
- Hosted on **Cloudflare Pages**; scheduled workflow refreshes data snapshots.

## Develop

```bash
npm install --legacy-peer-deps
npm run dev              # astro dev
npm exec astro build     # build WITHOUT refreshing data (safe)
```

> `npm run build` runs `scripts/fetch-data.ts` first — without API keys it writes **empty** JSON over `public/data/*`. CI and Cloudflare run `astro build` **only**; committed snapshots are the source of truth. `refresh-data.yml` updates them on schedule with secrets present.

## Deploy

Push to `main` → `deploy.yml` runs `astro build` + `wrangler pages deploy dist --project-name=me-chirag127` (needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`). The info page at [chirag127.github.io/oriz-me](https://chirag127.github.io/oriz-me/) ships from `gh-info/` via `gh-pages-info.yml`.

## License

Code [MIT](./LICENSE). Prose CC-BY-4.0.
