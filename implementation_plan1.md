# AI Chat Agent + Hybrid Content Pages System

Build a miracle portfolio website with AI assistant, hundreds of auto-generated pages from 15+ APIs fetched at build-time via GitHub Actions cron, stored in Firestore, served as static pages on Cloudflare Pages.

---

## Architecture: Hybrid Build-Time Approach

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ GitHub       │────▶│ Build Script │────▶│ Fetch ALL APIs   │
│ Actions Cron │     │ (Node.js)    │     │ at Build Time    │
│ (daily 2AM)  │     └──────────────┘     └────────┬────────┘
└─────────────┘                                     │
                                                    ▼
                                          ┌─────────────────┐
                                          │ Push to Firebase │
                                          │ Firestore        │
                                          └────────┬────────┘
                                                    │
                                                    ▼
                                          ┌─────────────────┐
                                          │ Astro SSG Build  │
                                          │ getStaticPaths() │
                                          │ → Static HTML    │
                                          └────────┬────────┘
                                                    │
                                                    ▼
                                          ┌─────────────────┐
                                          │ Deploy to        │
                                          │ Cloudflare Pages │
                                          └─────────────────┘
```

**Key insight:** Since builds happen server-side in GitHub Actions, ALL API keys are safe as GitHub Secrets. No client-side exposure. This unlocks OAuth-based APIs like Spotify, WakaTime, etc.

---

## Complete Platform Matrix

### 🎬 Movies & TV

| Platform | API Type | Auth | Free? | Data Available | Signup URL |
|----------|----------|------|-------|----------------|------------|
| **Trakt** | REST | `client_id` | ✅ Free | Watched, watchlist, ratings, history, stats | [trakt.tv/oauth/applications](https://trakt.tv/oauth/applications) |
| **TMDB** | REST | `api_key` | ✅ Free | Posters, metadata, cast, crew, trailers | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |
| **Letterboxd** | RSS Feed | None | ✅ Free | Recent diary entries, ratings (via RSS) | N/A (public RSS) |

> **Pages generated:** Each watched movie → `/library/movies/[slug]` with poster, rating, genres, cast, review. Hub at `/library/movies`.

---

### 📚 Books & Reading

| Platform | API Type | Auth | Free? | Data Available | Signup URL |
|----------|----------|------|-------|----------------|------------|
| **OpenLibrary** | REST | None | ✅ Free | Reading log (read, reading, want-to-read), covers, metadata | N/A |
| **Hardcover** | GraphQL | API Key | ✅ Free | Reading log, reviews, stats | [hardcover.app](https://hardcover.app) |

> **Pages generated:** Each book → `/library/books/[slug]` with cover, author, status, review. Hub at `/library/books`.

---

### 🎵 Music

| Platform | API Type | Auth | Free? | Data Available | Signup URL |
|----------|----------|------|-------|----------------|------------|
| **Last.fm** | REST | `api_key` | ✅ Free | Top artists, tracks, albums, scrobble history, loved tracks | [last.fm/api/account/create](https://www.last.fm/api/account/create) |
| **Spotify** | REST (OAuth) | `refresh_token` | ✅ Free | Top tracks, top artists, recently played, playlists | [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) |

> **Pages generated:** Each artist → `/library/music/artists/[slug]`, top tracks page, listening stats. Hub at `/library/music`.

---

### 🎌 Anime & Manga

| Platform | API Type | Auth | Free? | Data Available | Signup URL |
|----------|----------|------|-------|----------------|------------|
| **AniList** | GraphQL | None | ✅ Free | Anime/manga list, scores, status, favorites, stats | N/A |
| **Jikan (MAL)** | REST | None | ✅ Free | Anime/manga list, history, stats (unofficial MAL API) | N/A |

> **Pages generated:** Each anime → `/library/anime/[slug]` with cover, score, episodes, status. Hub at `/library/anime`.

---

### 🎮 Gaming

| Platform | API Type | Auth | Free? | Data Available | Signup URL |
|----------|----------|------|-------|----------------|------------|
| **Steam** | REST | `api_key` | ✅ Free | Owned games, playtime, achievements, recent games | [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) |
| **Lichess** | REST | None | ✅ Free | Chess stats, game history, ratings | N/A |

> **Pages generated:** Each game → `/gaming/[slug]` with playtime, achievements. Hub at `/gaming`.

---

### 💻 Coding & Developer

| Platform | API Type | Auth | Free? | Data Available | Signup URL |
|----------|----------|------|-------|----------------|------------|
| **GitHub** | REST/GraphQL | `token` (optional) | ✅ Free | Repos, contributions, stars, languages, commit graph | [github.com/settings/tokens](https://github.com/settings/tokens) |
| **WakaTime** | REST | `api_key` | ✅ Free | Coding time by language/project/editor, daily stats | [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key) |
| **LeetCode** | GraphQL | None | ✅ Free | Solved problems, contest rating, submission stats | N/A |
| **Codewars** | REST | None | ✅ Free | Kata solved, rank, honor, languages | N/A |
| **Dev.to** | REST | `api_key` (optional) | ✅ Free | Published articles, reactions, views | [dev.to/settings/extensions](https://dev.to/settings/extensions) |
| **HackerNews** | REST | None | ✅ Free | Submitted stories, karma | N/A |

> **Pages generated:** Repos → `/code/repos/[name]`, WakaTime dashboard → `/code/stats`. Hub at `/code`.

---

### 🌐 Social & Other

| Platform | API Type | Auth | Free? | Data Available | Signup URL |
|----------|----------|------|-------|----------------|------------|
| **Bluesky** | REST (AT Protocol) | `app_password` | ✅ Free | Posts, followers, following | Settings → App Passwords |
| **YouTube** | REST | `api_key` | ✅ Free | Channel stats, video list (if you have a channel) | [console.cloud.google.com](https://console.cloud.google.com) |

---

## AI Agent System

### What changes from the previous plan:

Since we're using **server-side build**, we can now use:

1. **Puter.js** for client-side AI chat (stays the same — free, no key)
2. **Build-time data enrichment** — During build, all API data is fetched and stored in Firestore, then the AI agent context includes ALL this data
3. **Client-side agent** with tools that query Firestore (not APIs directly) for instant responses

### AI Agent Architecture:
- **Intent Classification** → regex + LLM-based
- **Tool System** → queries Firestore collections populated at build-time
- **Context Builder** → injects relevant data from resume, skills, projects, media
- **Model Routing** → Puter.js with fallback: `gpt-5-nano` → `claude-sonnet` → `deepseek`
- **Persistence** → All chats/queries saved to Firestore
- **Admin Dashboard** → Real-time monitoring at `/system/admin`

---

## GitHub Actions Cron Build

```yaml
# .github/workflows/daily-build.yml
name: Daily Build & Deploy
on:
  schedule:
    - cron: '0 20 * * *'  # 2:00 AM IST (20:00 UTC)
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm run fetch-data  # Fetches ALL APIs → saves JSON
      - run: pnpm run build        # Astro SSG reads JSON → generates pages
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
    env:
      # All API keys as GitHub Secrets
      TRAKT_CLIENT_ID: ${{ secrets.TRAKT_CLIENT_ID }}
      LASTFM_API_KEY: ${{ secrets.LASTFM_API_KEY }}
      # ... etc
```

---

## Verification Plan

1. `pnpm run fetch-data` — Fetches all APIs, saves to `src/data/generated/`
2. `pnpm run build` — Generates static HTML for ALL pages
3. `pnpm run dev` — Test locally
4. GitHub Actions run → auto-deploys to Cloudflare Pages

---

## Questions for You

> [!IMPORTANT]
> Please answer these to finalize the plan. I've organized them by category.

### 🔑 API Keys & Accounts (What do you have?)

1. **Trakt** — Do you have a Trakt.tv account? What's your username? Have you registered an API app?
2. **Last.fm** — Do you have a Last.fm account with scrobbling history? Username? API key?
3. **TMDB** — Do you have a TMDB account? (Free signup, needed for movie posters & metadata)
4. **Spotify** — Do you have a Spotify account? Want to show top tracks/artists?
5. **Steam** — Do you have a Steam account? Want to show your game library? What's your Steam ID?
6. **WakaTime** — Do you use WakaTime in your IDE? Want to show coding time stats?
7. **OpenLibrary** — What's your OpenLibrary username? (For reading log data)
8. **AniList** — What's your AniList username?
9. **Letterboxd** — What's your Letterboxd username? (For RSS diary feed)
10. **Bluesky** — Do you have a Bluesky account? Want to show posts?
11. **YouTube** — Do you have a YouTube channel with content?
12. **Dev.to** — Do you want to show blog posts from dev.to?

### 🎨 Design & Content Decisions

13. **Page count target** — You said "hundreds of pages." Roughly how much content do you have on these platforms? (e.g., ~50 movies on Trakt, ~100 anime on AniList, ~30 games on Steam, etc.)
14. **Individual item pages** — Do you want INDIVIDUAL pages for each movie, book, anime, game (e.g., `/library/movies/interstellar`)? Or just category hub pages?
15. **Which platforms matter most?** Rank these by importance to you: Movies, Books, Music, Anime, Gaming, Coding Stats, Social
16. **Profile showcase** — Should each section have a prominent "View my [Platform] profile" link?

### 🤖 AI Agent Decisions

17. **Agent scope** — Should the AI agent be able to answer questions about ALL your content (movies, books, music, etc.)? Or just career/coding related stuff?
18. **Agent personality** — Any specific personality traits? (e.g., professional, casual, witty)
19. **Admin email** — Confirming `whyiswhen@gmail.com` for admin dashboard access?

### 🏗️ Infrastructure

20. **Domain** — Is the site currently on `chiragsinghal.com` / `chirag127.in`? Which is primary?
21. **Cloudflare Pages** — Is deployment already set up? Or do we need to configure it?
22. **EmailJS** — I see the env vars are empty. Do you have an EmailJS account for the unknown query alerts?
