# Site Improvement Report — me.oriz.in

> **Generated:** 2026-06-19
> **Method:** 4 parallel research/audit agents (audit, services, digital-twin, OKF wiki) feeding a synthesizer.
> **Inputs:**
> - Site audit (Agent A) — read-only inventory of routes, components, scripts, workflows, deps
> - Services research (Agent B) — 15 service categories vs current stack (network-locked, used user-pasted oriz-blog posts as ground truth)
> - Digital-twin research (Agent C) — applied oriz-blog post 4's lifestream architecture to Astro + Firestore + Cloudflare Pages
> - OKF/LLM-wiki implementation (Agent D) — built [`knowledge/`](../knowledge/index.md) as a 26-file OKF v0.1 / Karpathy LLM-wiki (1,922 lines, 202 cross-links)
>
> **OKF wiki:** every section below cross-references the concept pages under [`knowledge/`](../knowledge/index.md). When you start a follow-up session, point your LLM agent at that directory first.

---

## Executive summary

1. **The site's architecture is sound, but adoption is incomplete.** The 4-theme × 7-accent token system exists in [`tokens.css`](../knowledge/architecture/themes.md) and works perfectly on `Layout.astro` and `Sidebar.astro`. But **56 of 57 pages still hardcode Tailwind colors** (`teal-500/10`, `text-teal-400`, etc.), so the accent dropdown only repaints ~5 components. This is the highest-leverage single fix.
2. **Firestore is the right database, not Turso.** The site already runs Firestore for chat, analytics, and admin. The events table from oriz-blog post 4's digital-twin architecture should live in Firestore (top-level `events` collection with composite indexes), not introduce a second DB. See [`knowledge/decisions/why-firestore-not-turso.md`](../knowledge/decisions/why-firestore-not-turso.md).
3. **The /api/now placeholder is the highest-impact 1-day task.** Replacing the mock in [`functions/api/now.ts`](../knowledge/components/status-strip.md) with real Lanyard + ListenBrainz + Open-Meteo (all keyless or already-credentialed) makes the homepage genuinely live.
4. **`Pagefind` is the cheapest blog/site search win.** Static, free, runs in-browser, no service dependency. Ship as a second mode in CMD-K.
5. **Five service adoptions for this quarter, in priority order:** (1) Pagefind, (2) Cloudflare Web Analytics, (3) Lanyard + ListenBrainz + Trakt + AniList + Open-Meteo aggregator → /now and /year pages, (4) Cronitor for cron heartbeats, (5) Raindrop.io as the bookmarks read-source. **Avoid:** Plausible (no free tier), Disqus (ads), Beehiiv (ads on free tier), Algolia DocSearch (won't accept personal sites), Cloudflare Images (paid only), Sanity (overkill), Wasabi (no free tier). **Killed in 2024-2025, do not waste time on:** Pocket, Omnivore, PlanetScale free, Railway free, Render Postgres free, Heroku free dynos, Atlassian Statuspage free.

---

## Inventory snapshot

(Source: Agent A audit. Detailed breakdown in [`knowledge/architecture/overview.md`](../knowledge/architecture/overview.md).)

| Surface | Count | Health |
| --- | --- | --- |
| Pages | 57 (9 sections) | All build; 8 library pages have hardcoded gradient skeletons; gaming/index is a stub |
| React/Astro components | 18 (3,721 lines) | 1 orphan: `AuthWidget.tsx` (0 imports — dead code) |
| Scripts | 15 | 7 unhooked (no `package.json` script): trakt-auth, spotify-auth, refresh-trakt-token, setup-cf-domains, setup-domains, upload-secrets, cleanup-r2 |
| Workflows | 5 | All wired; `daily-build.yml` has `continue-on-error: true` on lint/test/e2e (intentional) |
| Required GitHub secrets | 28 | Sync-firestore alone needs 26 |
| Theme tokens used by pages | 1 of 57 (Layout) | 56 pages bypass the system |
| Components used elsewhere | 17 of 18 | AuthWidget orphan |

---

## Findings, ranked by impact × effort

### 🟢 Do this week (high impact, low effort)

| # | Finding | From | Effort | Why now |
| --- | --- | --- | --- | --- |
| 1 | **Wire `functions/api/now.ts` to real Lanyard + ListenBrainz + Open-Meteo** with `Promise.allSettled` and 60 s edge cache | twin | 1 day | The homepage has a `<StatusStrip>` that's been showing mock data since Phase 1. All three upstreams are keyless or just need a username/lat-lon var. Pattern documented in twin report; `wrangler.toml` only needs `DISCORD_USER_ID`, `LB_USERNAME`, `LAT`, `LON`. See [`components/status-strip.md`](../knowledge/components/status-strip.md). |
| 2 | **Enable Cloudflare Web Analytics** | services | 5 min | One toggle in the Pages dashboard. No script weight (edge beacon), no cookies, no consent banner. The site has had no analytics signal at all. |
| 3 | **Delete `AuthWidget.tsx`** | audit | 5 min | Imported nowhere; `AuthBanner.tsx` is the active auth UI. Reduces confusion; one file fewer for future refactors to navigate. |
| 4 | **Add Cronitor heartbeat ping at the end of each Action workflow** | services | 30 min | The 6 h `sync-firestore.yml` will silently stop one day (token expiry, secret rotation, free-tier hit). Cronitor's free 5-monitor tier covers exactly the workflows we have. One `curl` line per workflow. |
| 5 | **Add Pagefind as a second mode in CMD-K** | services | 1 hr | Static index, ~3 KB shell, builds at `astro build`. The site has 50+ pages with no full-text search; CMD-K only does jumps. |
| 6 | **Run `pnpm run fetch-data` once with credentials and commit the result** | audit | 30 min after creds | 56 pages reading from `src/content/generated/` show EmptyState because the file is empty. The infrastructure works — it's just never been run end-to-end with real credentials in this session. |
| 7 | **Run `wrangler login` and deploy the current `dist/`** | audit | 5 min | Build is fresh, code is sound, only blocker is the interactive OAuth. The whole turn started with this — finish it. |

### 🟡 Do this month (medium effort, high impact)

| # | Finding | From | Effort | Notes |
| --- | --- | --- | --- | --- |
| 8 | **Token-sweep the 28 hardcoded section badges** across hub pages (`/work`, `/library`, `/me`, `/code`, `/connect`, `/gaming`, `/system`) | audit + design-audit.md | 4 hr | Single pattern duplicated 28 times: replace `bg-teal-500/10 border border-teal-500/20 text-teal-400` with the existing `var(--primary-*)` tokens. Fixes the "accent dropdown does nothing" complaint. See [`decisions/accent-token-policy.md`](../knowledge/decisions/accent-token-policy.md). |
| 9 | **Define the `events` collection** in `src/lib/events.ts` + `firestore.indexes.json` | twin | 2 hr | Top-level `events` collection, document shape per twin report (id, occurred_at, ingested_at, kind, source, visibility, title, payload). 4 composite indexes for /now, per-medium pages, and /year heatmap. |
| 10 | **ListenBrainz Workers Cron at `*/1 * * * *`** writing to `events` with `kind:"listen"` | twin | 3 hr | First ingest path. Idempotent on `${source}:${listened_at + recording_msid}`. Enables the /now page. |
| 11 | **Build `/now` page** reading the last 24h slice with Firestore `onSnapshot` for the live tail | twin | 4 hr | `client:idle` island, free-tier Firestore 100 concurrent listeners is plenty. |
| 12 | **GitHub webhook → `/api/webhooks/github`** with HMAC validation, mapping push/PR/issue/star to `kind:"code"` events | twin | 3 hr | Real-time. Existing `scripts/fetch-data.ts` GitHub poller stays as a backstop for catch-up. |
| 13 | **Trakt 15-min poll + AniList 30-min poll** writing directly to `events` instead of `src/content/generated/*.json` | twin | 4 hr | Migration from the old "fetch JSON, commit JSON" pattern to the new "fetch event, write event" pattern. Old JSON files become build-time projections from Firestore. |
| 14 | **Migrate ajv → Zod for `src/content/schemas/`** (Astro Content Collections natively use Zod) | services | 2 hr | Currently fighting the framework. Keep ajv only for the GitHub Actions cron validators consuming external API JSON. |
| 15 | **Move resume PDF to R2 with a stable URL** like `cdn.oriz.in/resume/latest.pdf` | services | 1 hr | GitHub Releases works but `releases/download/v1.2.3/resume.pdf` is a brittle public link. R2 free tier covers it; `wrangler r2 object put` step in `build-resume.yml`. Keep Releases archive too. See [`integrations/render-cv.md`](../knowledge/integrations/render-cv.md). |
| 16 | **Privacy triage admin page** at `src/pages/admin/triage.astro` (Firebase-Auth-gated) for flipping events between public/unlisted/private | twin | 4 hr | Default visibility per source: ListenBrainz → public, GitHub → public, Health Connect → private, Maps Timeline → private, Photos → private. |

### 🔵 Backlog (lower impact or higher effort)

| Finding | From | Notes |
| --- | --- | --- |
| `<PageHeader>` component (badge + h1 + description) — adopt across hub pages | audit + design-audit.md | Already on the design-audit Phase-2 list. Token-sweep (#8) gets the same visual outcome with less rewriting. |
| `<StatCard>` + `<LinkCard>` abstractions (~60 + 25 instances) | audit | Hygiene refactor. Current pages render fine. |
| Migrate 8 library pages' hardcoded fallback gradients to JSON config | audit + design-audit.md | 400+ inline gradient strings; no functional benefit until you want runtime accent on those gradients too. |
| Section-header emojis within pages | audit | Visual polish, deferred from earlier work. |
| `giscus` comments on blog posts | services | Defer until 5+ blog posts are published; activates on `chirag127.github.io` Discussions. |
| `Buttondown` newsletter (RSS-as-source) | services | Same — defer until blog has content. |
| Sentry free tier for client-side errors | services | Defer until interactive surfaces (chat, admin) hit user-reported bugs. |
| Letterboxd CSV ingest worker → `kind:"watch"` | twin | After /now ships and Trakt is the primary watch source. |
| Goodreads / Hardcover ingest | twin | Hardcover GraphQL > Goodreads CSV; Goodreads has had ads since mid-2026 per oriz-blog post 2. |
| Google Takeout (YouTube + Maps) ingest pipeline → R2 → ingest worker | twin | Every 2 months automated drop. Most value once the user has a months-long history to backfill. |
| Health Connect (Android) monthly export | twin | Per-day step events, default `visibility:"private"`. Strava is paywalled (oriz-blog post 3). |
| Backloggd monthly scrape (no API) | twin | Half-day worker; lower frequency justifies cron over webhook. |
| Spotify Extended Streaming History (one-time backfill) | twin | Quarterly pull; ListenBrainz already covers playing-now. |
| `/year/<year>` heatmap + top-10 page with `cal-heatmap` | twin | Best after a few months of events have accumulated. |
| Lighthouse CI in GitHub Actions | rebuild-plan Phase 4 | Has a pre-existing skeleton task. |
| Visual regression baselines via Playwright | rebuild-plan Phase 4 | Snapshots already capture; just need to opt in. |
| OG image generation actually emitting images | audit | Script exists, prebuild hook calls it, but `/public/og/` appears empty. Needs a debug pass. |
| Email/password Firebase auth form (Google OAuth-only currently) | audit | Adds a real auth path for non-Google identity holders. |
| Programmatic Puter.js sign-in bridge (avoid manual second login) | audit | UX nicety. |
| Hook unhooked maintenance scripts to `package.json` (trakt-auth, spotify-auth, etc.) | audit | One-time `pnpm run` improvements; doesn't gate any feature. |
| Mobile tab navigation consistency on `/code/repos`, `/library/*` filters, `/me/gear` | design-audit.md | Explicit Phase-1 deferral. |
| Alt-text audit on hero images | design-audit.md | Accessibility pass. |
| LeetCode progress bars responsive at 320px | design-audit.md | Edge-case mobile QA. |
| Email-on-failure for cron workflows | audit | Cronitor (#4) covers the alarm; this is the second-line follow-up. |

### ⚪ Don't do (and the reasons)

| Service | Why not | Source |
| --- | --- | --- |
| Plausible Cloud | No free tier (the early-adopter free era ended 2022). Self-hosted requires VPS we don't have. | services |
| Substack | 10% future revenue tax, mediocre privacy (open tracking pixels by default), Substack-branding on every email. | services |
| Beehiiv free tier | Injects ads into your emails by default. | services |
| Disqus | Free tier injects ads + ~200 KB of trackers. | services |
| Algolia DocSearch | Personal sites are routinely rejected; non-DocSearch free tier was reduced 2024 to 10K records / 10K searches/month. | services |
| Cloudflare Images | Paid only ($5/mo). Astro's build-time pipeline + R2 already covers every use case. | services |
| Sanity CMS | Overkill for one author who lives in VS Code. | services |
| Decap CMS | Useful for mobile drafting, but Astro Content Collections + a `pnpm dlx new-post` script is the right size. | services |
| A/B testing (PostHog/Statsig) | Statistically pointless under 10K monthly visitors. | services |
| Wasabi | No free tier ($7/mo minimum). | services |
| Turso | Firestore is already wired and solving auth + per-user data. Introducing a second DB doubles surface area. Defer until a query Firestore can't serve appears. | services + [`decisions/why-firestore-not-turso.md`](../knowledge/decisions/why-firestore-not-turso.md) |
| Linkding / Hoarder / Karakeep | All require a server; no free hosted tier. | services |

### 💀 Recently killed free tiers (do not start work on these)

| Service | Killed | What replaced it |
| --- | --- | --- |
| Pocket | Jul 2025 (Mozilla EOL); API disabled Nov 2025 | Raindrop.io |
| Omnivore | 2024 | Raindrop.io |
| PlanetScale free | early 2024 | Turso (free tier) or D1 |
| Railway free | 2023 | Cloudflare Workers/Pages |
| Render Postgres free | (date varies) | Neon free, Supabase free |
| Heroku free dynos | Nov 2022 | Cloudflare Workers/Pages, Fly.io |
| Atlassian Statuspage free | 2023 | Better Stack free, custom Worker |
| Strava API (new developers) | 2025 | Fitbit (now Google) for fitness |

---

## Cross-cutting themes

### Theme adoption is the single biggest visual fix

The token system exists. The accent picker works. But pages bypass it. The fix is **mechanical not architectural**:

```
bg-teal-500/10  → bg-[var(--primary-muted)]
text-teal-400   → text-[var(--primary)]
border-teal-500/20 → border-[var(--primary-subtle)]
```

Run a Grep across `src/pages/**/*.astro`, fix in batches by section. The 28 section badges alone account for ~50% of the visible "stuck on teal" surfaces. After that, the per-card variety (emerald/amber/sky for status semantics, e.g. emerald = success) is intentional and should stay. See [`decisions/accent-token-policy.md`](../knowledge/decisions/accent-token-policy.md).

### Firestore everywhere, not Turso

The lifestream architecture from oriz-blog post 4 recommends Turso. For me.oriz.in specifically, **Firestore is the right answer** because:

- Already wired (auth, chat, analytics)
- Free-tier headroom: 50K reads + 20K writes/day is plenty for ~200–500 events/day
- Security rules already give us the privacy boundary (visibility column → rules)
- Adding Turso doubles the auth/deploy/backup surface

The trade-off is real: Firestore is more expensive at write scale and clumsier at SQL aggregations like "GROUP BY date_trunc". But the failure mode is "we'll add D1 in 18 months for /year aggregations", not "we made the wrong choice today". See [`decisions/why-firestore-not-turso.md`](../knowledge/decisions/why-firestore-not-turso.md).

### The OKF/LLM-wiki is now ground truth for follow-up sessions

The new [`knowledge/`](../knowledge/index.md) directory (built by Agent D in this turn) is a 26-file, 1,922-line, 202-cross-link knowledge base that any future LLM agent — Claude Code, the in-page ChatWrapper, your own scripts — can read to answer questions about the site without re-deriving the architecture from code each time.

Maintenance protocol: every code change that touches concepts in the wiki (architecture, components, integrations, decisions, runbooks) should append a line to [`knowledge/log.md`](../knowledge/log.md) and update the relevant page. The protocol itself is documented in [`knowledge/AGENTS.md`](../knowledge/AGENTS.md) — that file is the schema for how to maintain the wiki. Karpathy's pattern: ingest, query, lint.

The 3 TBD markers Agent D flagged ([`sources/tracker-landscape-2026.md`](../knowledge/sources/tracker-landscape-2026.md)) are gaps the user should confirm next session: AniList rate limits, ListenBrainz playing-now auth, Lanyard project liveness as of 2026.

### Browser-extension reuse > writing your own

Per the digital-twin research and oriz-blog post 3:

- Install **Web Scrobbler** → ingest from **ListenBrainz** (don't write a Spotify extension)
- Install **MAL-Sync** → ingest from **AniList** (don't write Crunchyroll/9anime/MangaDex extensions)
- Install community **Trakt scrobblers** → ingest from **Trakt** (don't write Netflix/Plex/Hulu extensions)

The principle: **never ingest from the extension itself**. Always ingest from the canonical platform the extension feeds. This keeps the ingest list small and lets the extension ecosystem evolve without breaking your pipeline.

---

## 4-week phased plan

This integrates the digital-twin research (Agent C's plan) with the immediate fixes from the audit. Reorders Agent C's plan slightly to put the highest-impact, lowest-risk wins first.

### Week 1 — Real /api/now + housekeeping

**Day 1**: Run `wrangler login`, deploy current `dist/` (the deferred turn-1 task). Enable Cloudflare Web Analytics. Delete `AuthWidget.tsx`. **Day 2–3**: Replace `functions/api/now.ts` mock with Lanyard + ListenBrainz + Open-Meteo using `Promise.allSettled` and 60 s edge cache (twin report has the full pattern). Add `DISCORD_USER_ID`, `LB_USERNAME`, `LAT`, `LON` to `wrangler.toml` vars. **Day 4**: Add Pagefind as a second mode in CMD-K (`pnpm add astro-pagefind`, wire into `astro.config.mjs`). **Day 5**: Add Cronitor heartbeats to `sync-firestore.yml`, `snapshot-weekly.yml`, `daily-build.yml` (one `curl` line each). **Day 6–7**: Run `pnpm run fetch-data` once with full credentials, commit the result, ship the first end-to-end deploy with real data on every page.

**Acceptance:** Homepage hero shows real Discord presence + currently-listening track + weather. CMD-K has a "Search content" tab. Every Action ping shows green in Cronitor. Cloudflare dashboard shows real visitor counts. 56 pages now display real data instead of EmptyState.

### Week 2 — Token sweep + events table + ListenBrainz cron

**Day 1–2**: Token-sweep the 28 hardcoded section badges across `/work`, `/library`, `/me`, `/code`, `/connect`, `/gaming`, `/system`. Verify the accent dropdown now repaints all hub pages. **Day 3**: Define `events` collection in `src/lib/events.ts`; write `firestore.indexes.json` (4 composite indexes); deploy with `firebase deploy --only firestore:indexes`. **Day 4–5**: Write the ListenBrainz ingest as a Workers Cron at `*/1 * * * *`. Idempotent on `${source}:${listened_at + recording_msid}`. **Day 6–7**: Ship a minimal `/now` page reading last-24h events with Firestore `onSnapshot` for the live tail.

**Acceptance:** Every accent color now visibly repaints every hub page. ListenBrainz scrobbles appear on /now within 60 seconds.

### Week 3 — GitHub webhooks + Trakt + AniList migration

**Day 1–2**: Register GitHub webhook on the user's main repos pointing at `/api/webhooks/github`; validate `X-Hub-Signature-256` HMAC against `GITHUB_WEBHOOK_SECRET`; map push/PR/issue/star to `kind:"code"` events. **Day 3**: Backfill via existing `scripts/fetch-data.ts` GitHub call but write to `events` not `src/content/generated`. **Day 4–5**: Trakt 15-min poll Workers Cron, mapping plays → `kind:"watch"`. **Day 6**: AniList GraphQL 30-min poll → `kind:"read"` for manga, `kind:"watch"` for anime. **Day 7**: Privacy triage admin page MVP at `src/pages/admin/triage.astro` (Firebase-Auth-gated, default visibility per source).

**Acceptance:** Every git push, every Trakt scrobble, every AniList update lands on /now within 15 minutes. Admin can flip events between public/unlisted/private.

### Week 4 — /year page, manual exports, and the OKF lifestream bundle

**Day 1**: Provision R2 bucket `lifestream-raw`; wire credentials to `/api/admin/upload` (auth-gated). **Day 2–3**: Letterboxd CSV ingest worker (parse, dedupe by Letterboxd URI, write `kind:"watch"`). Goodreads CSV ingest (`kind:"read"`). Hardcover GraphQL daily cron. **Day 4**: Schedule recurring Google Takeout export (every 2 months) for YouTube history + Maps Timeline. **Day 5**: First Takeout drop → R2 → parse → ingest. Health Connect (Android) monthly export → R2 → daily-step events with `visibility:"private"` by default. Backloggd monthly scraper. **Day 6**: Build `/year/2026` page with cal-heatmap + per-medium top-10 + total counts. **Day 7**: Add a `knowledge/lifestream/` OKF bundle documenting the schema, indexes, and runbook for next-time-self.

**Acceptance:** /year/2026 renders a populated heatmap, top-10s for music/film/books/games, total counts. Private health data is visible only when authed. The lifestream's runbook is in the wiki.

### After week 4

Every additional source is one ingest worker following the same pattern (~half a day each). The events table is the canonical store; `src/content/generated/*.json` becomes a build-time projection.

---

## Cross-references into the OKF wiki

For each follow-up topic, start with the corresponding wiki page:

- **Architecture overview before any change:** [`knowledge/architecture/overview.md`](../knowledge/architecture/overview.md)
- **Data flow before touching mirror/snapshot/fetch-data:** [`knowledge/architecture/data-flow.md`](../knowledge/architecture/data-flow.md)
- **Auth before changing Firebase or Puter wiring:** [`knowledge/architecture/auth.md`](../knowledge/architecture/auth.md)
- **Themes before any color change:** [`knowledge/architecture/themes.md`](../knowledge/architecture/themes.md)
- **Status strip before wiring /api/now:** [`knowledge/components/status-strip.md`](../knowledge/components/status-strip.md)
- **Firestore policy before adding the events collection:** [`knowledge/integrations/firestore.md`](../knowledge/integrations/firestore.md)
- **Render-CV before changing resume YAML or Releases workflow:** [`knowledge/integrations/render-cv.md`](../knowledge/integrations/render-cv.md)
- **Deploy before pushing to Pages:** [`knowledge/runbooks/deploy.md`](../knowledge/runbooks/deploy.md)
- **Adding a new tracker page:** [`knowledge/runbooks/add-new-tracker-page.md`](../knowledge/runbooks/add-new-tracker-page.md)
- **Refreshing Firestore data:** [`knowledge/runbooks/refresh-firestore-data.md`](../knowledge/runbooks/refresh-firestore-data.md)
- **Tracker landscape (the 4 oriz-blog posts):** [`knowledge/sources/tracker-landscape-2026.md`](../knowledge/sources/tracker-landscape-2026.md)

---

## What this report intentionally does not cover

- **iOS-only sources** (Apple HealthKit, Apple Music) — user has no iOS device. Health Connect (Android) and ListenBrainz cover the same territory.
- **Self-hosted alternatives** (Ryot, Yamtrack, Movary, Bookwyrm) — user constraint is "no self-hosting because servers cost money."
- **Strava API** — moved to paid in 2025 per oriz-blog post 3. Use Fitbit/Garmin Connect periodic export instead.
- **Letterboxd public API** — does not exist publicly in 2026. Trakt is the substitute.
- **Goodreads API** — dead since 2021. Open Library Reading Log + Hardcover GraphQL are the substitutes.
- **OG image generation deep-dive** — script exists, prebuild hook calls it, output unverified. Needs an isolated debug session, not part of this analysis.

---

## Bottom line

The site is in better shape than the asks suggest. The architecture decisions in [`docs/REBUILD-PLAN.md`](REBUILD-PLAN.md) and [`docs/DESIGN-AUDIT.md`](DESIGN-AUDIT.md) were correct. What's missing is **adoption** of the systems already built (token sweep, run fetch-data once with real creds, deploy) and **wiring** of the next layer (real /api/now, events collection, /now and /year pages).

The OKF wiki at [`knowledge/`](../knowledge/index.md) makes future LLM-agent sessions cheap: a follow-up agent reads `index.md` first, navigates to the relevant concept, and grounds its answer there instead of re-deriving from code.

The 4-week phased plan above is sequenced so each week ships an end-user-visible win: week 1 = real homepage, week 2 = uniform accent + first live event feed, week 3 = real-time events from 4 sources, week 4 = /year page with backfill. After that, adding new sources is mechanical.
