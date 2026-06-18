# DECISIONS.md — locked architectural choices

> Per AGENTS.md, this file is **frozen** — agents may not edit it without explicit owner approval.

This document records decisions that have already been made for `personal-os` so that contributors (human or AI) don't relitigate them. Add new decisions only via PR with the owner's sign-off.

## Identity

- **Owner:** Chirag Singhal (`whyiswhen@gmail.com`)
- **Public site:** [chirag127.in](https://chirag127.in)
- **Sunsetting alias:** `chirag127.in` (formerly `chirag127.github.io`); see `src/middleware/redirect-chirag127in.ts` once implemented

## Stack — locked

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Astro 6 + React 19 islands | Static-first; React only where interactivity is needed |
| Styling | Tailwind v4 (`@tailwindcss/vite`) | CSS variables defined in `src/styles/tokens.css` |
| Lint/format | Biome 2 | Zero warnings; one pattern per concern |
| Tests (unit) | Vitest 4 + Testing Library | Co-located `*.test.ts` + central `tests/unit/` |
| Tests (e2e) | Playwright | Three device profiles (chromium-desktop, firefox-desktop, webkit-mobile) |
| Hosting | Cloudflare Pages | Free tier only |
| Auth + DB | Firebase (Spark plan) | Auth + Firestore; no paid tier |
| AI runtime | Puter.js | Client-side only; no API keys shipped |
| Validation | Zod | Schemas in `src/lib/schemas/` |

## Hard constraints

- **No paid services.** Everything must work on free tiers.
- **No API keys shipped to the client** for the AI twin — Puter.js owns that.
- **`content/` is the single source of truth** for personal data. Never hardcode names, usernames, emails, or endpoints elsewhere; read from `src/lib/config.ts`.
- **No `console.log`** in production code. Use the logger at `src/lib/log.ts` (no-ops in prod).
- **Strict TypeScript.** No `any` without `// TODO(<gh-issue>): drop any` plus an explanation.
- **Conventional commits.** One concern per commit; never `git push` or open PRs without explicit instruction.

## Open / pending decisions

Tracked in [`docs/QUESTIONS.md`](./docs/QUESTIONS.md). When a question there gets answered, move the resolution into this file and close the entry there.
