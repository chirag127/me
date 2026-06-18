# Rebuild Prompt — `personal-os`

> Paste the section below (everything from `# ROLE & MISSION` to the end) into a fresh Claude Code session opened in an empty new repository. The prompt assumes a high-tier model (Opus 4.x or equivalent). It is self-contained: the model does not need to read this `plan.md`.

---

# ROLE & MISSION

You are the lead engineer rebuilding **Chirag Singhal's personal site** from scratch in a new, empty repository. The previous version (built with a low-tier model) lives at `https://github.com/chirag127/chirag127.github.io` and is deployed at `me.oriz.in`. You are not migrating files; you are reimplementing the product with a substantially better architecture, design, and code quality.

The new site is a **Personal OS / Life Dashboard**: a single hub that aggregates Chirag's professional identity (portfolio, résumé, career), creative consumption (movies, books, music, anime, manga, games, podcasts), code presence (GitHub, LeetCode, NPM, Stack Overflow, etc.), social presence (Bluesky, Mastodon, Reddit, HN, etc.), and an **AI digital twin** that can answer any question about him using all of that data. It must work for three audiences simultaneously:

1. **Recruiters** — must find résumé, projects, skills, contact within 5 seconds.
2. **Curious visitors / friends** — explore movies, books, music, journal, etc.
3. **Chirag himself** — admin dashboard, journal, chat history.

UI quality is paramount. This is a portfolio piece in itself. **Do not ship anything generic-looking.**

---

# IDENTITY & CONFIG

- **Repo name:** `personal-os` (GitHub: `chirag127/personal-os`)
- **Primary deploy domain:** `me.oriz.in` (Cloudflare Pages, custom domain)
- **Secondary domain:** `chirag127.in` (currently active; **will not be renewed** — treat as a sunsetting alias, configure redirect-to-primary, do not depend on it)
- **Owner email:** `whyiswhen@gmail.com` (replaces the old `hi@chirag127.in` everywhere)
- **Owner name:** Chirag Singhal
- **Location:** Bhubaneswar, India (lat 20.2961, lng 85.8245)
- **GitHub username:** `chirag127`

The full username/API map for every external service is in the `CONFIG` block at the end of this prompt. Use it verbatim.

---

# KICKOFF CHECKLIST — DO THIS BEFORE WRITING ANY CODE

Execute these in order. Report what you did at each step before moving on.

1. **Read this entire prompt twice.** On second pass, list every uncertainty or implicit decision back to the user as a numbered question. Do not invent answers — ask.
2. **Verify available skills.** Run the equivalent of "list skills" and confirm `frontend-design`, `web-design-reviewer`, `webapp-testing`, `playwright-e2e`, `verify`, and `code-review` are present. If any are missing, install them via the skills CLI / marketplace before proceeding. These are mandatory for this build.
3. **Web-search current best practices** (June 2026) for each of the following before deciding the stack. Cite what you find:
   - Astro 6.x vs Next.js 15 App Router vs SvelteKit 2.x — which is best for a static-mostly site with ~30 API integrations, selective interactivity (chat, dashboards), and free hosting on Cloudflare Pages in 2026?
   - Tailwind CSS v4 vs CSS-in-JS vs vanilla CSS Modules in 2026 — defaults and pitfalls.
   - Best free AI chat option that requires **no API key shipped from the client and no paid backend** — confirm Puter.js is still the right pick, or recommend a free alternative (Cloudflare Workers AI free tier, Groq free tier, Google AI Studio free tier).
   - Firebase Spark plan limits as of 2026 (Firestore reads/writes/storage, Auth quotas) — confirm Firestore + Auth is still free at the scale of a personal site (<10k visitors/month).
   - Cloudflare Pages free-tier build minutes, custom-domain setup, environment-variable handling for build-time API fetches.
   - Each external API in CONFIG — current free-tier status, auth requirement, rate limits. Flag any that have become paid or deprecated since 2024. (Don't audit all 30 individually; spot-check Trakt, TMDB, Lastfm, OpenLibrary, AniList, Lichess, Bluesky.)
4. **Choose the framework** with explicit justification (3-5 sentences, citing the search results). Default expectation: **Astro 6.x + React 19 islands + Tailwind v4**, because the previous build proved the architecture and the constraints haven't changed. Override only if web search surfaces a clear reason. State your choice.
5. **Run the `frontend-design` skill** to establish the visual direction before scaffolding. Generate 2-3 distinct mood-board / design-direction options aligned with "Personal OS dashboard, dark-first, recruiter-friendly, alive with live data." Present them to the user, get a pick, then proceed.
6. **Scaffold the repo** in the empty directory you've been started in. Initialize git, set up package manager (pnpm), TypeScript strict, Biome, the chosen framework, Tailwind v4, Vitest, Playwright. Commit "chore: scaffold".
7. **Only then** start building.

If any kickoff step fails or surfaces a blocker, **stop and report**. Do not work around it silently.

---

# PRODUCT REQUIREMENTS

## Information architecture

Top-level sections (sidebar nav, command palette, sitemap):

- **Home** (`/`) — Personal OS dashboard. Hero with current status (now playing, currently reading, currently watching, last commit, location/weather, Discord status from Lanyard). Cards for each major life-app. Recruiter-prominent CTAs (résumé, projects, contact). AI chat opener.
- **Work** (`/work`) — Career timeline, skills matrix, featured projects, education, certifications, downloadable PDF résumé. Sub-routes: `/work/career`, `/work/skills`, `/work/projects`, `/work/education`, `/work/certifications`.
- **Code** (`/code`) — Live GitHub stats, repos (sortable, searchable), language breakdown, contribution graph, NPM packages, LeetCode + CodeWars stats, Holopin badges, Stack Overflow profile, WakaTime activity. Sub-routes per platform.
- **Library** (`/library`) — Media consumption hub. Sub-routes: `/library/movies`, `/library/movies-watched`, `/library/movies-watchlist`, `/library/movies-rated`, `/library/shows`, `/library/anime`, `/library/anime-completed`, `/library/anime-plan-to-watch`, `/library/manga`, `/library/books`, `/library/books-read`, `/library/books-want-to-read`, `/library/music`, `/library/music-recent`, `/library/music-top-artists`, `/library/music-top-tracks`, `/library/podcasts`, `/library/videos`, `/library/twitch`, `/library/mixcloud`. Each is a real, designed page — not a placeholder.
- **Gaming** (`/gaming`) — Lichess profile (rating, games, openings), Steam library and recent playtime, Backloggd, Speedrun.com.
- **Connect** (`/connect`) — Social hub: Bluesky, Mastodon, Pixelfed, Reddit, HN, contact form. Sub-routes per platform.
- **Me** (`/me`) — Personal: story, philosophy, interests, gear, journal (private, Firebase-synced), finance tracker (localStorage-only).
- **System** (`/system`) — Admin dashboard (Firestore analytics, chat history view, gated to admin emails), changelog, status page.
- **Legal** — `/privacy`, `/terms`, `/cookie-policy`, `/disclaimer`.
- **404** — Custom branded 404.

The sidebar must collapse cleanly on mobile (drawer) and tablet (icon-rail). A **command palette** (⌘K / Ctrl-K) provides keyboard navigation and full-text search across all pages and indexed content.

## Homepage requirements (the hero is everything)

The homepage is the single most important page. It must feel **alive**. Specifically:

- **Status strip** at the top: current location + weather (Open-Meteo, no key needed), Discord presence (Lanyard), local time at Bhubaneswar.
- **Hero**: Chirag's name, one-line tagline ("Software engineer · AI agents · Cloud · building [latest project]"), avatar, primary CTA (Talk to my digital twin → opens chat overlay) and secondary CTA (Résumé → PDF download).
- **Now panel**: Now playing (Lastfm), currently reading (OpenLibrary), currently watching (Trakt), latest commit (GitHub events), latest post (Bluesky/Mastodon/Dev.to). Each links to the relevant `/library/*` or `/code/*` page.
- **Featured work**: 3-4 hand-picked projects with screenshots, role, stack, link, GitHub.
- **Stats counters** (animated on view): GitHub stars, repos, total movies watched, books read, tracks scrobbled, chess games. Pulled from build-time data.
- **Activity feed** (live): unified timeline of recent actions across all sources, last 30 days.
- **Skills matrix**: visual, not a bullet list.
- **Testimonials** (if data exists in `src/data/testimonials.ts`).
- **Footer** with all social links and contact.

## Module specification (apply to every life-app)

Every module (movies, books, music, code, etc.) follows the same shape:

- **Hub page** (`/library`, `/code`, etc.): overview cards linking into sub-pages, plus the freshest items inline.
- **Sub-pages**: list views with sorting, filtering, search, and visual richness (posters, covers, album art).
- **Detail interactions**: hover/click reveals details; for movies/shows/books, link out to the canonical source.
- **Empty states**: every module must handle "API down / no data" gracefully with a real designed empty state, not a stack trace.
- **Loading states**: skeleton shimmers, not spinners.
- **Each page is built** at build time from `public/data/*.json` (generated by the daily fetch-data script). Runtime fetches only for genuinely live data (chat, weather, Discord status).

## AI digital twin

Use **Puter.js** (free, no API keys shipped, browser-side). Implement:

- **Chat overlay** (full-screen on mobile, side-panel on desktop) accessible from any page. ⌘J keyboard shortcut.
- **Multi-model selector**: list of free Puter.js models with a fallback chain (if model A errors, try B, then C). Surface the active model in the UI.
- **Personality modes**: Professional, Casual, Witty, Technical (changes system prompt).
- **Tool registry**: at least 20 tools the agent can call to answer questions, each backed by `public/data/*.json`. Examples: `getMovies`, `getBooks`, `getMusic`, `getGitHub`, `getSkills`, `getResume`, `getProjects`, `getCodebase`, `getContact`, `getGear`, `getSocial`, `getTrending`, `searchPages`, `getWeather`, `getNowPlaying`, `getCurrentlyReading`, `getRecentCommits`, `getLichessStats`, `getAnime`, `getJournal` (gated to authed-as-Chirag).
- **Agentic flow**: plan → act → verify → respond, with the steps streamed to the UI as collapsible thinking blocks.
- **Intent classifier**: an initial cheap LLM call that picks 1-3 tools to invoke before the main response — no regex routing.
- **Memory**: chat history persisted to Firestore per signed-in user (anonymous users get localStorage-only).
- **Fallback**: if Puter.js is unreachable, surface a friendly "AI offline" state with a link to email Chirag instead.
- **Out-of-scope answer**: when asked something genuinely outside the knowledge base (e.g. opinions Chirag hasn't recorded), the twin must say so honestly and offer to email Chirag (EmailJS).

## Authentication & Firestore

- **Firebase Auth**: Google OAuth + email/password.
- **Firestore collections**: `chatMessages`, `journalEntries`, plus any analytics collections needed for the admin dashboard.
- **Admin gating**: hardcode `whyiswhen@gmail.com` as the admin email. Admin-only routes/components must check this server-side via Firestore rules and client-side for UI.
- **Firestore rules** (`firestore.rules`): users can read/write only their own documents; admin can read all; nobody can write to other users' data. Ship them with the repo.
- **Firestore indexes** (`firestore.indexes.json`): include any composite indexes the queries need.
- **Public Firebase config keys** are checked into the repo (they are not secrets). Anything actually-secret stays in GitHub Actions secrets.

## Data layer

- **`src/lib/config.ts`** — single source of truth, structured exactly like the CONFIG block at the end of this prompt. All other code reads from it; no hardcoded usernames anywhere else.
- **`src/lib/api/<service>.ts`** — one file per external API, each exporting typed fetch functions. No leaking of API shapes into UI; every API module returns clean domain types.
- **`scripts/fetch-data.ts`** — a single Node script that runs every API in `CONFIG`, normalizes the data, and writes to `public/data/*.json`. Concurrency-limited (`p-limit(2)`) to avoid rate-limiting. Robust to individual API failures: a failure in one module must not block the others; it logs the error, writes a stale-flag entry, and continues. Run from CI daily (cron) and on-demand locally.
- **Posters / covers / album art**: stored in `public/posters/`, `public/covers/`, etc. The fetch script downloads missing assets (3-tier fallback: local cache → primary API → zero-auth fallback like TVMaze for shows, Jikan for anime, OpenLibrary covers for books). Committed to repo. **Do not** use Cloudflare R2 — keep it free and in-repo.
- **Stale data handling**: each `public/data/*.json` includes `{fetchedAt, isStale, source}`. UI surfaces a subtle "data from N days ago" indicator when `isStale`.

## Design system

Match or exceed the existing tokens. Default direction (override only after running `frontend-design`):

- **Aesthetic**: Dark-first "Spatial Black" with subtle violet/teal accents, glass-morphism cards, gradient hero glows, generous whitespace, confident typography.
- **Colors**: dark base (#030303 surface), neutral ramp, primary teal (#14b8a6), accent violet (#8b5cf6), status colors (emerald/amber/rose/sky).
- **Typography**: Inter (sans), Outfit (display, used for hero/section titles), JetBrains Mono (code/numbers).
- **Spacing**: 4px grid.
- **Motion**: Framer Motion for purposeful animations only — page transitions, chat thinking blocks, stat counters. **No animation for the sake of animation.** Respect `prefers-reduced-motion`.
- **Light mode**: ship it, but dark is the default.
- **Tokens file**: `src/styles/tokens.css` with semantic CSS variables. Tailwind v4 reads from these so colors are theme-able.
- **Components**: ship a small in-repo component kit (Button, Card, Input, Badge, Tabs, Dialog, Tooltip, Skeleton, EmptyState, ErrorState, Toast). Don't pull in shadcn/ui or a heavy library — write them lean. Each component has Vitest coverage.
- **Iconography**: Lucide React.
- **Hand off the design** to the `web-design-reviewer` skill at the end of every major page; iterate until it passes.

## Testing

- **Vitest** for unit/component tests. Every utility, every API normalizer, every component with non-trivial logic has tests. Aim for 70%+ coverage on `src/lib/`.
- **Playwright** for e2e, three projects: `chromium-desktop`, `chromium-mobile (Pixel 5)`, `webkit-mobile (iPhone 13)`. Test suites:
  - `all-pages.spec.ts` — every route renders without console errors, has a meaningful title, no broken links.
  - `homepage.spec.ts` — hero, status strip, now panel, stats, activity feed.
  - `navigation.spec.ts` — sidebar, command palette, mobile drawer.
  - `library/*.spec.ts` — each library sub-page loads its data.
  - `chat.spec.ts` — opens, sends a message, receives a response (or graceful offline state).
  - `auth.spec.ts` — sign-in flow (mocked Firebase emulator if run in CI).
  - `accessibility.spec.ts` — axe-core scan on every top-level route.
  - `screenshots.spec.ts` — visual regression baselines per device.
- **Lighthouse CI**: budget of >=95 on Performance, Accessibility, Best Practices, SEO for Home, Work, Code, Library hub.
- **Tests run in CI on every push** and must pass before deploy.

## CI/CD

- **GitHub Actions workflow** `daily-build.yml`:
  - Triggers: push to `main`, manual dispatch, daily cron at `30 20 * * *` (20:30 UTC = 02:00 IST).
  - Steps: install → lint (Biome) → typecheck (tsc) → unit test (Vitest) → e2e test (Playwright) → fetch-data → build → deploy to Cloudflare Pages via Wrangler.
  - Step "fetch-data" reads all needed secrets from GitHub Secrets (Trakt, TMDB, Lastfm, Spotify, Steam, WakaTime, YouTube, Bluesky, Dev.to, GitHub PAT). The build must succeed even if some secrets are missing — those modules degrade gracefully.
  - Commit refreshed `public/data/` and `public/posters/` back to `main` if changed (with `[skip ci]`).
- **Cloudflare Pages**: project `personal-os`, primary domain `me.oriz.in`, redirect `chirag127.in` → `me.oriz.in` (until expiry).
- **Status page** (`/system/status`): shows last successful fetch per API + last build time, fed from a `public/data/_meta.json`.

## SEO, PWA, accessibility

- Open Graph + Twitter cards on every page (auto-generated OG images per page using `@vercel/og` or equivalent free OG-image lib that runs at build time).
- `sitemap.xml` and `robots.txt` generated at build.
- JSON-LD structured data: `Person` on `/`, `Article` on blog/journal posts, `BreadcrumbList` site-wide.
- PWA manifest, installable, basic service worker for offline shell.
- WCAG 2.2 AA: keyboard navigable everywhere, focus rings visible, color contrast verified, ARIA on all interactive components, axe-core clean.
- `prefers-reduced-motion` respected throughout.
- `prefers-color-scheme` honored on first visit.

## Performance budget

- Homepage: <50KB JS critical path, <100KB total JS, <500KB total page weight, FCP <1s on 4G, TTI <2s.
- Sub-pages: skeleton renders <300ms.
- Images: WebP/AVIF with original fallback, `loading="lazy"` below the fold, explicit width/height to prevent CLS.
- No client-side router fetching of HTML (rely on Astro's prefetch / framework default).

## Privacy & legal

- No third-party analytics. Period. Build a self-hosted page-view counter into Firestore if metrics are wanted (admin-only view).
- No cookies except Firebase Auth's. Cookie banner if any cookies are set.
- Privacy policy reflects: Firebase Auth, Firestore (chat + journal), EmailJS (contact form), no trackers.
- Finance tracker: localStorage only, never leaves the browser. Big banner saying so.
- Journal: encrypted-at-rest by browser, synced to Firestore for the owner's account only.

---

# DELIVERABLES (in order)

1. **`README.md`** — what the site is, how to run it, deploy it, contribute. Badges. Screenshots.
2. **`ARCHITECTURE.md`** — high-level diagram, data flow, decision log explaining stack choices (cite the kickoff web searches).
3. **`AGENTS.md`** — guidance for AI coding agents working on this repo: structure, conventions, do-nots, useful commands.
4. **`docs/modules.md`** — one section per life-app module: data source, build-time vs runtime, owned files, key types.
5. **`docs/design.md`** — design tokens, components, motion principles, accessibility rules. Output of the `frontend-design` and `web-design-reviewer` runs.
6. **`docs/api.md`** — every external API used: endpoint, auth method, rate limit, fallback strategy, secrets envvar.
7. **The site itself** — every route in the IA above implemented, designed, tested.
8. **Daily build CI** green on first push to `main`.
9. **Live deploy** at `me.oriz.in`.

---

# DEFINITION OF DONE

Do not declare the rebuild complete until **all** of these are true. State each one explicitly with evidence.

- [ ] Every route in the IA renders with real data on a fresh `pnpm install && pnpm build`.
- [ ] Every API in CONFIG either ships with a working module or is documented in `docs/api.md` as deferred with a stated reason.
- [ ] AI chat answers questions about movies, books, music, code, skills, and contact correctly using the tool registry.
- [ ] Firebase Auth works with Google OAuth in production.
- [ ] Admin dashboard is gated to `whyiswhen@gmail.com` and shows live Firestore stats.
- [ ] Lighthouse: 95+ on Performance, A11y, Best Practices, SEO for the homepage.
- [ ] Playwright e2e suite green across all three device profiles.
- [ ] Vitest coverage report shows >=70% on `src/lib/`.
- [ ] CI daily build is green and committing fresh data.
- [ ] `me.oriz.in` resolves to the deployed site with HTTPS and the correct `Person` JSON-LD.
- [ ] `chirag127.in` redirects to `me.oriz.in`.
- [ ] `web-design-reviewer` skill ran on every top-level page and any flagged issues are fixed.
- [ ] No `TODO` / `FIXME` comments left in the code without an associated GitHub issue link.

---

# RULES OF ENGAGEMENT

- **Ask questions when unsure.** Never invent product decisions. If something in this prompt conflicts or is ambiguous, surface it before building around it.
- **Web-search current docs** for anything you're not 100% sure about as of June 2026. The previous build was done with stale knowledge — don't repeat that mistake.
- **Use the `frontend-design` skill** for visual decisions and `web-design-reviewer` for review iterations. Do not skip these.
- **Commit small, commit often.** Conventional commits. One concern per PR-equivalent commit.
- **No dead code, no scaffolding leftovers, no `console.log`.** Biome must be green.
- **Strict TypeScript.** No `any` without an explanatory comment and a TODO to remove it.
- **No paid services.** Everything stays free-tier. If a free tier disappears under your feet during the build, document the alternative chosen and why.
- **Do not commit secrets.** `.env.example` lists all keys; real values live in GitHub Secrets and `.env.local` (gitignored).
- **Match the surrounding code style** as you build (whatever the chosen framework's idioms are). Don't mix patterns.
- **Report failures plainly.** "Tests pass except X, Y, Z" is correct. "✅ done" when something is broken is not.

---

# CONFIG (verbatim — paste into `src/lib/config.ts`)

```ts
// Site Configuration — Single Source of Truth.
// Read from this everywhere. No hardcoded usernames or endpoints elsewhere.

export interface UserConfig {
  name: string;
  username: string;
  email: string;
  website: string;
  discordId: string;
  github: string;
  leetcode: string;
  codewars: string;
  holopin: string;
  mastodon: { server: string; id: string };
  pixelfed: string;
  devto: string;
  medium: string;
  reddit: string;
  hackernews: string;
  bluesky: string;
  anilist: string;
  letterboxd: string;
  trakt: string;
  openlibrary: string;
  hardcover: string;
  backloggd: string;
  lastfm: string;
  listenbrainz: string;
  mixcloud: string;
  lichess: string;
  speedrun: string;
  myanimelist: string;
}

export interface ApiConfig {
  rss2json: string;
  github: string;
  leetcode: string;
  stackoverflow: string;
  codewars: string;
  gitlab: string;
  npm: string;
  holopin: string;
  sourcerer: string;
  jsonresume: string;
  openlibrary: string;
  anilist: string;
  letterboxd: string;
  trakt: string;
  mangadex: string;
  serializd: string;
  backloggd: string;
  lastfm: string;
  listenbrainz: string;
  mixcloud: string;
  lichess: string;
  speedrun: string;
  mastodon: string;
  pixelfed: string;
  youtube: string;
  devto: string;
  medium: string;
  hackernews: string;
  reddit: string;
  bluesky: string;
  lanyard: string;
  raindrop: string;
  openMeteo: string;
  metahub: string;
}

export interface KeysConfig {
  lastfmApiKey: string;
  traktClientId: string;
  youTubeChannelId: string;
  openLibraryListId: string;
  raindropCollectionId: string;
}

export interface LocationConfig {
  name: string;
  latitude: number;
  longitude: number;
}

export const CONFIG = {
  user: {
    name: 'Chirag Singhal',
    username: 'chirag127',
    email: 'whyiswhen@gmail.com',
    website: 'https://me.oriz.in',
    discordId: '799956529847205898',
    github: 'chirag127',
    leetcode: 'chirag127',
    codewars: 'chirag127',
    holopin: 'chirag127',
    mastodon: { server: 'mastodon.social', id: '115582869974132712' },
    pixelfed: 'chirag127',
    devto: 'chirag127',
    medium: 'chirag127',
    reddit: 'chirag127',
    hackernews: 'chirag127',
    bluesky: 'chirag127.bsky.social',
    anilist: 'chirag127',
    letterboxd: 'chirag127',
    trakt: 'chirag127',
    openlibrary: 'wilarchive',
    backloggd: 'chirag127',
    lastfm: 'lastfmwhy',
    listenbrainz: 'chirag127',
    mixcloud: 'chirag127',
    lichess: 'chiragsinghal127',
    speedrun: 'chirag127',
    myanimelist: 'chirag127',
  },
  api: {
    rss2json: 'https://api.rss2json.com/v1/api.json?rss_url=',
    github: 'https://api.github.com/users',
    leetcode: 'https://alfa-leetcode-api.onrender.com',
    stackoverflow: 'https://api.stackexchange.com/2.2/users',
    codewars: 'https://www.codewars.com/api/v1/users',
    gitlab: 'https://gitlab.com/api/v4/users',
    npm: 'https://api.npmjs.org/downloads/point/last-month',
    holopin: 'https://holopin.io/api/user',
    sourcerer: 'https://sourcerer.io/profile',
    jsonresume: 'https://registry.jsonresume.org',
    openlibrary: 'https://openlibrary.org/people',
    anilist: 'https://graphql.anilist.co',
    letterboxd: 'https://letterboxd.com',
    trakt: 'https://api.trakt.tv',
    mangadex: 'https://api.mangadex.org/user',
    serializd: 'https://serializd.com',
    backloggd: 'https://backloggd.com/u',
    lastfm: 'https://ws.audioscrobbler.com/2.0',
    listenbrainz: 'https://api.listenbrainz.org/1/user',
    mixcloud: 'https://api.mixcloud.com',
    lichess: 'https://lichess.org/api/user',
    speedrun: 'https://www.speedrun.com/api/v1/users',
    mastodon: 'https://mastodon.social/api/v1/accounts',
    pixelfed: 'https://pixelfed.social/users',
    youtube: 'https://www.youtube.com/feeds/videos.xml?channel_id=',
    devto: 'https://dev.to/api/articles',
    medium: 'https://medium.com/feed',
    hackernews: 'https://hacker-news.firebaseio.com/v0/user',
    reddit: 'https://www.reddit.com/user',
    bluesky: 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed',
    lanyard: 'https://api.lanyard.rest/v1/users',
    raindrop: 'https://api.raindrop.io/rest/v1/raindrops',
    openMeteo: 'https://api.open-meteo.com/v1/forecast',
    metahub: 'https://images.metahub.space',
  },
  keys: {
    // Lastfm and Trakt client IDs are designed to ship in clients (read-only).
    // Anything sensitive belongs in GitHub Secrets, not here.
    lastfmApiKey: 'e15969debb132e5e0ed031b1a618fe53',
    traktClientId: 'dee5f20516bf476e67998b42aef045ff29a5bd5bee24f9a3e162a235fa5cc969',
    youTubeChannelId: '',
    openLibraryListId: '',
    raindropCollectionId: '',
  },
  location: {
    name: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
  },
} as const;

export default CONFIG;
```

---

# REFERENCE — what the previous build had (for context, not a copy target)

The old repo at `chirag127/chirag127.github.io` was Astro 6 + React 19 + Tailwind v4 + Firebase + Puter.js, deployed to Cloudflare Pages at `me.oriz.in`. It had ~58 routes across the sections above, a daily GitHub Actions cron that fetched 25+ APIs, Playwright e2e across desktop+mobile, an admin dashboard, a journal, a finance tracker, and a multi-model AI agent with 20+ tools. The architecture was sound; the execution was uneven (inconsistent design across pages, brittle data fetching, weak empty states, leaky types). **Don't copy its files. Do learn its shape.**

---

**Begin with the kickoff checklist. Report after each step.**
fan out multiple subagents for making this project and add as many thing you want you do to do and make sure everything is done write make use of the firebase to store image url from the tmdb adn also make use to use firebase skill and firebase storage to store image url from the tmdb firebase skill to doe everything and firebase storage to store image url from the tmdb make everything proper and done correctly and make sure the config are stucture properly and write clean code and follow solid and dry and all other software engineering principle and And ensure that other thing is done correctly. Make sure that there is an option to add the overleaf resume here in the website only which is dynamically generated from the all of the data being given to the. Data in some folder. I don't know the name of the correct folder. You choose the folder name and it will be in the root directory where it will have many files. They might be marked down files or anything or jason files which will contain all the data about me and the. All the data about me and everything will be generated from the that. Data files. So only these files will be the single source of truth which can be changed for anyone and the same website can be later being used for someone else Documented it everything into the read me file. %!TEX TS-program = xelatex
%!TEX encoding = UTF-8 Unicode
% Awesome CV LaTeX Template for CV/Resume
%
% This template has been downloaded from:
% https://github.com/posquit0/Awesome-CV
%
% Author:
% Claud D. Park <posquit0.bj@gmail.com>
% http://www.posquit0.com
%
% Template license:
% CC BY-SA 4.0 https://creativecommons.org/licenses/by-sa/4.0/
%
%-------------------------------------------------------------------------------
% CONFIGURATIONS
%-------------------------------------------------------------------------------
% A4 paper size by default, use 'letterpaper' for US letter
\documentclass[11pt, a4paper]{awesome-cv}
% Configure page margins with geometry
\geometry{left=1.4cm, top=.8cm, right=1.4cm, bottom=1.8cm, footskip=.5cm}
% Specify the location of the included fonts
\fontdir[fonts/]
% Color for highlights
\colorlet{awesome}{awesome-red}
% Set false if you don't want to highlight section with awesome color
\setbool{acvSectionColorHighlight}{true}
% If you would like to change the social information separator from a pipe (|) to something else
\renewcommand{\acvHeaderSocialSep}{\quad\textbar\quad}
%-------------------------------------------------------------------------------
% PERSONAL INFORMATION
%-------------------------------------------------------------------------------
\name{Chirag}{Singhal}
\position{Software Engineer{\enskip\cdotp\enskip}Full Stack, Backend \& Distributed Systems Specialist}
\address{Bhubaneswar, Odisha, India}
\mobile{(+91) 74284-49707}
\email{hi@chirag127.in}
\github{chirag127}
\linkedin{chirag127}
\quote{``Building scalable, resilient systems across the full Software Development Life Cycle (SDLC).''}
%-------------------------------------------------------------------------------
\begin{document}
\makecvheader[C]
\makecvfooter
  {\today}
  {Chirag Singhal~~~·~~~Résumé}
  {\thepage}
%-------------------------------------------------------------------------------
% SUMMARY
%-------------------------------------------------------------------------------
\cvsection{Summary}
\begin{cvparagraph}
Results-oriented Software Engineer with extensive experience across the full Software Development Life Cycle (SDLC), specializing in scalable backend architectures, full-stack development, AI-driven automation, and cloud-native deployments. Proficient in modern Python and JavaScript/TypeScript ecosystems (React, Node.js, FastAPI, Astro) with deep expertise in Microservices, Serverless Architectures, DevOps, and Security Engineering. A rapid learner and academic topper (JEE Advanced Rank Holder) with a proven ability to reduce system latency, build production-grade platforms, optimize enterprise data pipelines, and implement robust security practices in distributed environments.
\end{cvparagraph}
%-------------------------------------------------------------------------------
% SKILLS
%-------------------------------------------------------------------------------
\cvsection{Skills}
\begin{cvskills}
  \cvskill
    {Languages}
    {Python (Advanced), TypeScript, JavaScript, SQL (PostgreSQL, MySQL, LibSQL), HTML5, CSS3}
  \cvskill
    {Backend \& Cloud}
    {FastAPI, Node.js, Django, GraphQL, Kafka, Redis, Upstash Redis, AWS (Lambda, EKS, S3), Cloudflare Workers, Docker, Kubernetes, Terraform}
  \cvskill
    {Frontend \& Full Stack}
    {React.js, Astro, Tailwind CSS, Redux, Chart.js, MDX, RESTful APIs, Microservices Architecture, Serverless Architectures, PWA}
  \cvskill
    {AI \& Data Engineering}
    {LangChain, RAG Pipelines, Vector DBs (Milvus/Chroma), Hugging Face, Google Gemini, Groq, Mistral AI, Cohere, NVIDIA NIM, OpenRouter, Multi-Provider LLM Integration, ETL Pipelines, PyTorch, Web Scraping (BeautifulSoup/Cheerio)}
  \cvskill
    {Databases \& Storage}
    {Firebase Firestore, Supabase (PostgreSQL), MongoDB, Turso (LibSQL), Upstash Redis, Cloudflare R2 (S3-Compatible), Sanity CMS, Algolia Search}
  \cvskill
    {DevOps \& CI/CD}
    {GitHub Actions, Jenkins, Cloudflare Pages Deployment, Wrangler CLI, Cron-Scheduled Workflows, Infrastructure as Code (IaC), Docker, Kubernetes, Linux Admin}
  \cvskill
    {Security \& Auth}
    {Kinde Auth, Firebase Auth, OAuth 2.0 (PKCE), reCAPTCHA v3, Client-Side Encryption (AES/DES/3DES/RC4), Bcrypt, 40+ Cryptographic Hash Algorithms, OWASP, DevSecOps, Secure Coding}
  \cvskill
    {Payments \& Analytics}
    {Razorpay (Orders, Webhooks, Verification), PostHog Analytics, Google AdSense, OneSignal Push Notifications, Cloudinary Media Optimization}
  \cvskill
    {Core Competencies}
    {System Design (HLD/LLD), OOP, SOLID Principles, Distributed Systems, Modular Architecture, Unit/Integration Testing, TDD, Agile Methodologies}
\end{cvskills}
%-------------------------------------------------------------------------------
% EXPERIENCE
%-------------------------------------------------------------------------------
\cvsection{Experience}
\begin{cventries}
  \cventry
    {Software Engineer} % Job title
    {Tata Consultancy Services (TCS)} % Organization
    {Bhubaneswar, India} % Location
    {Jun. 2025 - Present} % Date(s)
    {
      \begin{cvitems} % Description(s) of tasks/responsibilities
        \item {Optimized enterprise-scale pricing engines and business logic using \textbf{Python}, reducing processing latency by 60\% for high-volume transactions.}
        \item {Architected modular data validation pipelines bridging legacy systems with modern \textbf{RESTful APIs}, ensuring data integrity across the SDLC.}
        \item {Implemented \textbf{Automated CI/CD Workflows} and standardized testing protocols, significantly reducing production bugs and rollback rates.}
        \item {Designed and maintained responsive, dynamic UI components using \textbf{React.js} to provide real-time visibility into backend configurations.}
        \item {Refactored monolithic legacy codebases into maintainable, object-oriented modules while enforcing strict security and performance standards.}
      \end{cvitems}
    }
    \vspace{4.0mm}
  \cventry
    {Software Developer (Full Stack)} % Job title
    {QRsay.com} % Organization
    {Remote, India} % Location
    {Jul. 2023 - May 2025} % Date(s)
    {
      \begin{cvitems} % Description(s) of tasks/responsibilities
        \item {Managed the \textbf{full software life cycle} for a high-traffic Food E-commerce platform using \textbf{Python}, \textbf{Node.js}, and \textbf{MongoDB}.}
        \item {Executed database tuning and indexing strategies, achieving a \textbf{40\% reduction} in API response times for critical administrative dashboards.}
        \item {Developed real-time order processing systems and event-driven architectures using \textbf{Kafka} to synchronize data across multiple distributed outlets.}
        \item {Built secure payment gateway integrations and authentication modules with a focus on robust cybersecurity and data privacy.}
        \item {Engineered modular frontend components in \textbf{React.js} to deliver a seamless and performant user experience across devices.}
      \end{cvitems}
    }
    \vspace{4.0mm}
\end{cventries}
%-------------------------------------------------------------------------------
% PROJECTS
%-------------------------------------------------------------------------------
\cvsection{Key Projects}
\begin{cventries}
  % ORIZ PROJECT — TOP
  \cventry
    {TypeScript, React, Astro, Python, Cloudflare Workers, Firebase, Razorpay} % Tech Stack
    {Oriz — 1000+ Free Online Tools Platform} % Project Name
    {oriz.in} % Link
    {} % Date(s)
    {
      \begin{cvitems} % Description(s)
        \item {Engineered a \textbf{production-grade full-stack platform} (oriz.in) with 192+ client-side tools across 8 categories (PDF, Image, Cryptography, Developer, SEO, Calculators, Network, Social) using \textbf{Astro, React, TypeScript}, and \textbf{Tailwind CSS}, deployed on \textbf{Cloudflare Pages}.}
        \item {Built a real-time data \textbf{API marketplace} with \textbf{69 Python web scrapers} across finance, crypto, weather, sports, and news domains, orchestrated by \textbf{5 GitHub Actions CI/CD pipelines} with scheduled cron jobs.}
        \item {Integrated \textbf{10 AI/LLM providers} (Gemini, Groq, Mistral, Cohere, NVIDIA NIM, OpenRouter, Cerebras, HuggingFace) into a unified chatbot interface with provider-agnostic abstraction and intelligent fallback routing.}
        \item {Architected \textbf{multi-cloud backend}: Firebase (Auth + Firestore), Supabase, Turso (LibSQL), Upstash Redis, Cloudflare R2, Algolia Search, Sanity CMS, and \textbf{Razorpay payment gateway} with webhook-driven order verification.}
        \item {Implemented \textbf{40+ cryptographic hash algorithms}, client-side encryption (AES/DES/3DES/RC4), Kinde Auth (PKCE), Firestore security rules, and \textbf{100\% client-side processing} for maximum user privacy.}
        \item {Built \textbf{8 serverless edge functions} on Cloudflare Workers handling comments, ratings, file uploads (R2), email dispatch, reCAPTCHA verification, payment webhooks, and view tracking.}
      \end{cvitems}
    }
    \vspace{4.0mm}
  % NexusAI
  \cventry
    {Python, LangGraph, OpenAI, Docker, Kubernetes} % Tech Stack
    {NexusAI - Multi-Agent RAG Platform} % Project Name
    {github.com/chirag127/NexusAI-Agentic-Workflows} % Link
    {} % Date(s)
    {
      \begin{cvitems} % Description(s)
        \item {Architected an \textbf{Agentic AI Platform} using LangGraph that orchestrates multiple autonomous LLM agents to solve complex coding tasks.}
        \item {Implemented a \textbf{Graph-based RAG pipeline} using Neo4j and Vector Embeddings to provide high-precision context retrieval for enterprise documentation.}
        \item {Deployed the system on \textbf{Kubernetes} with auto-scaling capabilities to handle concurrent agent execution threads in a cloud-native environment.}
      \end{cvitems}
    }
    \vspace{4.0mm}
  % TubeDigest
  \cventry
    {Python, Transformers, ONNX Runtime, PyTorch} % Tech Stack
    {TubeDigest - Multimodal Sponsor Detection} % Project Name
    {github.com/chirag127/TubeDigest-AI-Sponsor-Block} % Link
    {} % Date(s)
    {
      \begin{cvitems} % Description(s)
        \item {Developed a high-performance AI engine to detect sponsor segments using \textbf{Hugging Face Transformers} and multimodal analysis (Audio + Text).}
        \item {Fine-tuned a \textbf{T5 Model} and optimized inference speed by 3x using \textbf{ONNX Runtime} and dynamic quantization techniques.}
        \item {Built a scalable Flask microservice to process real-time video streams with sub-second latency, incorporating secure API endpoints.}
      \end{cvitems}
    }
    \vspace{4.0mm}
  % Olivia
  \cventry
    {Python, Edge AI, Llama-3, TensorFlow Lite} % Tech Stack
    {Olivia - Edge AI Voice Assistant} % Project Name
    {github.com/chirag127/Olivia-Voice-Assistant} % Link
    {} % Date(s)
    {
      \begin{cvitems} % Description(s)
        \item {Engineered a privacy-first Virtual Assistant utilizing \textbf{Local LLMs (Llama-3)} for intent classification and complex command execution.}
        \item {Implemented an \textbf{Edge Computing} architecture to process voice commands locally, eliminating cloud latency and ensuring offline functionality.}
        \item {Designed a plugin-based system enabling seamless integration with IoT devices and system automation scripts, with secure data handling.}
      \end{cvitems}
    }
    \vspace{4.0mm}
  % Crawl4AI
  \cventry
    {Python, Redis, Distributed Crawling, Selenium} % Tech Stack
    {Crawl4AI - Distributed RAG Ingestion} % Project Name
    {github.com/chirag127/Crawl4AI-LLM-Optimized-Web-Crawler} % Link
    {} % Date(s)
    {
      \begin{cvitems} % Description(s)
        \item {Designed a \textbf{Distributed Web Crawler} utilizing \textbf{Redis Task Queues} to ingest massive datasets for LLM training pipelines.}
        \item {Implemented intelligent stealth drivers and proxy rotation to bypass enterprise-grade WAFs and anti-bot protections.}
        \item {Optimized data parsing algorithms to convert unstructured HTML into structured JSON/Markdown for Vector Database ingestion, ensuring data security.}
      \end{cvitems}
    }
    \vspace{4.0mm}
  % OmniPublish
  \cventry
    {Python, System Design, Microservices, Node.js} % Tech Stack
    {OmniPublish - Content Orchestration Engine} % Project Name
    {github.com/chirag127/OmniPublish-Platform} % Link
    {} % Date(s)
    {
      \begin{cvitems} % Description(s)
        \item {Architected a robust API Gateway using the \textbf{Adapter Pattern} to unify 17+ external platforms (LinkedIn, Twitter) into a single interface.}
        \item {Implemented \textbf{Circuit Breaker patterns} and asynchronous retry mechanisms (Celery) to ensure fault tolerance across distributed APIs, with full-stack integration.}
      \end{cvitems}
    }
\end{cventries}
%-------------------------------------------------------------------------------
% EDUCATION
%-------------------------------------------------------------------------------
\cvsection{Education}
\begin{cventries}
  \cventry
    {B.Tech in Computer Science and Engineering} % Degree
    {Dr. A.P.J. Abdul Kalam Technical University} % Institution
    {Lucknow, India} % Location
    {Sep. 2020 - Jul. 2024} % Date(s)
    {
      \begin{cvitems} % Description(s) bullet points
        \item {\textbf{CGPA: 8.81} (Aggregate) | \textbf{College Topper (Rank 1)}}
        \item {Rank 1 in College Coding Competition (2022)}
      \end{cvitems}
    }
    \vspace{4.0mm}
  \cventry
    {Senior Secondary (Class 12th) - CBSE} % Degree
    {DDPS, Sanjay Nagar} % Institution
    {Ghaziabad, India} % Location
    {2020} % Date(s)
    {
      \begin{cvitems}
        \item {\textbf{Percentage: 97\%} | School Topper (Rank 1)}
        \item {\textbf{IIT JEE Advanced 2020:} AIR 11870 (Top 1\%)}
      \end{cvitems}
    }
\end{cventries}
%-------------------------------------------------------------------------------
% HONORS & ACHIEVEMENTS
%-------------------------------------------------------------------------------
\cvsection{Honors \& Achievements}
\begin{cvhonors}
  \cvhonor
    {College Topper} % Award
    {Rank 1 in Computer Science Engineering Batch (2020-2024)} % Event
    {AKTU} % Location
    {2024} % Date
  \cvhonor
    {JEE Advanced} % Award
    {Secured All India Rank 11870 (99th Percentile)} % Event
    {India} % Location
    {2020} % Date
  \cvhonor
    {Certification} % Award
    {Meta Backend Developer Course (Coursera)} % Event
    {Online} % Location
    {2023} % Date
  \cvhonor
    {Certification} % Award
    {AWS Certified Developer - Associate} % Event
    {Online} % Location
    {2025} % Date
\end{cvhonors}
%-------------------------------------------------------------------------------
\end{document} This template will be downloaded from the. UU and learner There they might do and the other temple will be downloaded by you and the there will be the overlook overload features in between the communication between the servers and buna and. The Github as well as the firebase. As well as the database And things in Singapore Is dubbed up.everything will be synced up and done correctly make sure that everything is done correctly. write github action on if a push on data is made then hte  data will be synced up to firebase on everything is done correctly. the admin can also edit the resume and have multiple resumes which can be made using the ai only changing the data which is needed for that resume change it will have unlimited data we will only use free models of puter.js which aree marked by :free in the openrouter models ask me any number of questions and i will give you the answer. ask me atleast 30 mcqs  and i will give you the answer i hope you know how the overleaf works. the website will be very dynamic but i also want it to be free of cost can it be hosted on free platform search the web for latest version and latest plactices of everyuthing and do everything properly using agents 