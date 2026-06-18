# ARCHITECTURE.md — high-level shape

> See [AGENTS.md](./AGENTS.md) for the rules contributors operate under and [DECISIONS.md](./DECISIONS.md) for locked choices.

## One-paragraph summary

`personal-os` is a static-first Astro 6 site with React 19 islands for the few places that need real interactivity (AI chat overlay, auth widget, journal app, command palette). All personal data flows from a single source of truth in `content/`, validated by Zod schemas before build. External APIs (GitHub, Last.fm, Letterboxd, etc.) are fetched on a daily cron via `scripts/fetch-data.ts` and dumped to `public/data/*.json` for the static build to consume — keeping the runtime free of API key plumbing. Auth and a small amount of write-state (journal, AI chat history) live in Firebase Spark. The AI twin runs client-side via Puter.js, so no provider keys ever leave the user's browser.

## Data flow

```
┌──────────────────┐      pnpm fetch-data        ┌──────────────────┐
│  External APIs   │  ─────────────────────────► │  public/data/*.  │
│  (GitHub, Last…) │     (scripts/fetch-data.ts) │       json        │
└──────────────────┘                              └──────────┬───────┘
                                                             │
┌──────────────────┐    Zod validate at build    ┌──────────▼───────┐
│   content/       │  ─────────────────────────► │   Astro build    │
│ (MDX/JSON/YAML)  │   (scripts/validate-content)│   (static HTML)  │
└──────────────────┘                              └──────────┬───────┘
                                                             │
┌──────────────────┐                              ┌──────────▼───────┐
│  React islands   │  ─────────  hydrate  ─────► │ Cloudflare Pages │
│  (chat, auth,…)  │                              │   (free tier)    │
└────────┬─────────┘                              └──────────────────┘
         │
         │ writes (journal, chat history)
         ▼
┌──────────────────┐
│ Firebase (Spark) │
│  Auth + Firestore│
└──────────────────┘
         ▲
         │ client-side LLM calls
┌────────┴─────────┐
│    Puter.js      │
│  (AI provider —  │
│   no shipped keys)│
└──────────────────┘
```

## Module ownership

See [docs/modules.md](./docs/modules.md) for per-module ownership and [docs/api.md](./docs/api.md) for the catalog of external APIs.

## Build, test, deploy

| Stage | Command | Notes |
| --- | --- | --- |
| Local dev | `pnpm dev` | Astro HMR + React fast refresh |
| Validate content | `pnpm validate-content` | Zod schemas; runs in pre-commit and CI |
| Lint | `pnpm lint` | Biome strict mode; zero warnings |
| Typecheck | `pnpm typecheck` | `astro check` then `tsc --noEmit` |
| Unit tests | `pnpm test` | Vitest |
| E2E | `pnpm test:e2e` | Playwright across 3 device profiles |
| Production build | `pnpm build` | Outputs to `./dist` |
| Deploy | `.github/workflows/deploy.yml` | Cloudflare Pages on `main` |

## What lives where

```
content/        ← personal data; only the human edits this
src/            ← code; agents may freely edit
public/         ← static assets + generated JSON / PDFs
scripts/        ← build-time data sync, content validation, resume compile
docs/           ← human-readable design notes and module map
```
