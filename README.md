<p align="center">
  <a href="https://github.com/chirag127/me/actions"><img src="https://img.shields.io/github/actions/workflow/status/chirag127/me/ci.yml?style=for-the-badge&logo=github" alt="CI/CD Status"></a>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Puter.js-000000?style=for-the-badge&logo=javascript&logoColor=white" alt="Puter.js">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

# 🪞 Project Me — The Digital Twin Portfolio

> **A 63-page, OS-inspired portfolio website that acts as a comprehensive "digital twin" — aggregating your entire online life, coding stats, media consumption, gaming activity, and professional identity into a single glassmorphic interface.**

Project Me is **not** a typical portfolio. It's a virtual operating system with 7 "drives," each containing specialized app pages that pull real-time data from **30+ APIs**. Think macOS Finder meets a personal dashboard — with a dock, sidebar, search, AI chat, and dark/light themes.

---

## 🌐 Live Sites

### Primary Domain

| URL | Description |
|-----|-------------|
| [chirag127.in](https://chirag127.in) | Primary domain (Cloudflare Pages) |
| [www.chirag127.in](https://www.chirag127.in) | WWW redirect |
| [me.chirag127.in](https://me.chirag127.in) | Portfolio subdomain |
| [my.chirag127.in](https://my.chirag127.in) | My subdomain |
| [portfolio.chirag127.in](https://portfolio.chirag127.in) | Portfolio alias |

### Hosting Platforms

| Platform | URL | Status |
|----------|-----|--------|
| **Cloudflare Pages** | [me-791.pages.dev](https://me-791.pages.dev) | ✅ Live |
| **Netlify** | [chirag127.netlify.app](https://chirag127.netlify.app) | ✅ Live |
| **Surge** | [chirag127.surge.sh](https://chirag127.surge.sh) | ✅ Live |
| **Neocities** | [chirag127.neocities.org](https://chirag127.neocities.org) | ✅ Live |
| **Vercel** | [chirag127.vercel.app](https://chirag127.vercel.app) | ⚠️ Build incompatibility |
| **GitHub Pages** | [chirag127.github.io/me](https://chirag127.github.io/me) | 🔧 Available |

---

## ✨ Key Features

- 🖥️ **macOS-Inspired UI** — Top bar, collapsible sidebar with subcategories, dock, search modal
- 📱 **63 Virtual App Pages** across 7 drives with hash-based routing
- 🔗 **30+ Live API Integrations** — GitHub, Last.fm, Trakt, AniList, Lichess, and more
- 🤖 **AI Chat** — "Ask Chirag" powered by Puter.js GPT
- 🎨 **Glassmorphism Design** — Modern 2026 UI with blur, gradients, and micro-animations
- 🌗 **Dark / Light / Auto Themes** — Persistent theme selection
- ⌨️ **Keyboard Shortcuts** — `⌘K` search, navigation
- 📊 **Chart.js Visualizations** — Interactive stats and activity charts
- 🔥 **Firebase Analytics** — Visitor tracking and engagement metrics
- ⚡ **Blazing Fast** — Rolldown-Vite (Rust-based bundler), code-split by page

---

## 🗂️ All 63 Pages — Organized by Drive

### 👤 Drive A: Me (The Digital Twin)

| Category | Page | Route | Description |
|----------|------|-------|-------------|
| **Overview** | Dashboard | `/me/index` | Personal hub with stats, status, highlights |
| **Personal** | Story | `/me/story` | Life timeline and milestones |
| | Philosophy | `/me/philosophy` | Core beliefs and values |
| | Journal | `/me/journal` | Thoughts and reflections |
| **Lifestyle** | Interests | `/me/interests` | Things I find fascinating |
| | Passions | `/me/passions` | What drives me |
| | Hobbies | `/me/hobbies` | How I spend free time |
| | Fetish | `/me/fetish` | Unique quirks and obsessions |
| **Possessions** | Gear | `/me/gear` | Tech setup and equipment |
| | Travel | `/me/travel` | Places visited |
| | Purchases | `/me/purchases` | Notable acquisitions |

### 💼 Drive B: Work (Professional)

| Category | Page | Route | Description |
|----------|------|-------|-------------|
| **Overview** | Summary | `/work/index` | Professional overview |
| **Career** | Experience | `/work/history` | Employment history |
| | TCS | `/work/tcs` | Current employer deep-dive |
| **Capabilities** | Skills | `/work/skills` | Technical skill matrix |
| | Projects | `/work/projects` | Featured projects |
| | Services | `/work/services` | Freelance offerings |
| **Credentials** | Education | `/work/education` | Academic background |
| | Certifications | `/work/certs` | Professional certifications |

### 💻 Drive C: Code (The Quantified Coder)

| Category | Page | Route | Description |
|----------|------|-------|-------------|
| **Analytics** | Stats | `/code/stats` | GitHub contribution stats |
| | LeetCode | `/code/leetcode` | Problem solving stats |
| | Reputation | `/code/stack` | StackOverflow reputation |
| **Portfolio** | Repos | `/code/repos` | GitHub repositories |
| | NPM | `/code/npm` | Published npm packages |
| | Resume JSON | `/code/json` | JSON Resume standard |

### 📚 Drive D: Library (Media Archive)

| Category | Page | Route | Description |
|----------|------|-------|-------------|
| **Overview** | Hub | `/library/index` | Media library dashboard |
| **Movies & TV** | Movies | `/library/movies` | Watched movies (Trakt) |
| | TV Shows | `/library/tv-shows` | Watched series (Trakt) |
| | Watch Activity | `/library/watch-activity` | Recent viewing history |
| | Ratings | `/library/ratings` | Rated movies/shows |
| | Collection | `/library/collection` | Owned media collection |
| | Lists | `/library/lists` | Custom Trakt lists |
| | Social | `/library/social` | Trakt followers/following |
| **Music** | Now Playing | `/library/music-now-playing` | Live scrobble (Last.fm) |
| | Recent Tracks | `/library/music-recent` | Recent listening history |
| | Top Tracks | `/library/music-top` | Top tracks by period |
| | Loved Tracks | `/library/music-loved` | Favorite songs |
| | Friends | `/library/music-friends` | Last.fm friends |
| | Tags | `/library/music-tags` | Genre tag cloud |
| | Charts | `/library/music-charts` | Weekly charts |
| | Profile | `/library/music-profile` | Last.fm profile dashboard |
| **Books** | Books Read | `/library/books-read` | Completed (OpenLibrary) |
| | Books TBR | `/library/books-tbr` | Want to read |
| | Currently Reading | `/library/books-reading` | In progress |
| **Anime & Manga** | Anime | `/library/anime` | Anime list (AniList) |
| | Manga | `/library/manga` | Manga list (AniList) |
| **Web** | Browse History | `/library/browse-history` | Browser history feed |
| | Videos | `/library/videos` | YouTube & video content |

### 🎮 Drive E: Gaming (The Arcade)

| Page | Route | Description |
|------|-------|-------------|
| Profile | `/gaming/index` | Gaming profile overview |
| Trophies | `/gaming/retro` | Gaming achievements |
| Chess | `/gaming/chess` | Lichess stats & games |
| Speedrun | `/gaming/speed` | Speedrun.com records |

### 🌐 Drive F: Connect (Social)

| Page | Route | Description |
|------|-------|-------------|
| Hub | `/connect/index` | Social hub overview |
| Feed | `/connect/feed` | Aggregated social feed |
| Photos | `/connect/photos` | Photo gallery (Pixelfed) |
| Articles | `/connect/blog` | Blog posts (Dev.to, Medium) |
| Discussion | `/connect/threads` | Forum discussions |
| Contact | `/connect/mail` | Contact form (Formspree) |

### ⚙️ Drive G: System (OS Tools)

| Page | Route | Description |
|------|-------|-------------|
| Search | `/system/search` | Full-text page search |
| AI Chat | `/system/ai` | Puter.js-powered AI assistant |
| Settings | `/system/settings` | Theme & preferences |
| Status | `/system/uptime` | System health & uptime |
| Weather | `/system/weather` | Local weather (Open-Meteo) |

---

## 🔗 API Integrations (30+)

<details>
<summary><strong>📊 Coding APIs</strong></summary>

| Service | API | Data |
|---------|-----|------|
| GitHub | REST API | Repos, contributions, profile |
| LeetCode | Stats API | Problems solved, ranking |
| CodeWars | REST API | Kata, rank |
| StackOverflow | SE API v2.2 | Reputation, badges |
| NPM | Downloads API | Package download stats |
| GitLab | REST API v4 | Cross-platform repos |
| Holopin | Profile API | Developer badges |
</details>

<details>
<summary><strong>🎬 Media APIs</strong></summary>

| Service | API | Data |
|---------|-----|------|
| Last.fm | Scrobbling API | Music history, charts, friends |
| ListenBrainz | REST API | Alternative scrobbles |
| Trakt.tv | REST API | Movies, TV, watch history |
| AniList | GraphQL | Anime & manga lists |
| OpenLibrary | REST API | Reading lists, books |
| Letterboxd | RSS Feed | Film reviews |
| YouTube | RSS Feed | Video content |
</details>

<details>
<summary><strong>🎮 Gaming APIs</strong></summary>

| Service | API | Data |
|---------|-----|------|
| Lichess | REST API | Chess games, stats, rating |
| Speedrun.com | REST API | Speedrun records |
</details>

<details>
<summary><strong>🌐 Social APIs</strong></summary>

| Service | API | Data |
|---------|-----|------|
| Mastodon | REST API | Toots, profile |
| Bluesky | AT Protocol | Posts, feed |
| Dev.to | REST API | Articles |
| Medium | RSS Feed | Blog posts |
| Reddit | JSON API | Posts, activity |
| Hacker News | Firebase API | Submissions |
| Pixelfed | REST API | Photos |
</details>

<details>
<summary><strong>🔧 Utility APIs</strong></summary>

| Service | API | Data |
|---------|-----|------|
| Open-Meteo | Forecast API | Local weather |
| Lanyard | Discord API | Discord status, activity |
| Puter.js | AI + KV | Chat AI, key-value store |
| Formspree | Form API | Contact form handling |
| Firebase | Analytics | Visitor analytics |
</details>

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Bundler** | [Rolldown-Vite](https://rolldown.rs/) (Rust-based, 7.2.5) |
| **Language** | TypeScript 5.9 (strict mode) |
| **UI** | Vanilla CSS + Glassmorphism design system |
| **Charts** | Chart.js 4.5 |
| **AI** | Puter.js 2.2 (GPT-5-nano) |
| **Analytics** | Firebase 12.8 + Sentry 10.38 |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) |
| **Icons** | Font Awesome 7.1 |
| **Deployment** | Python 3 automation scripts |

---

## 📁 Project Structure

```
me/
├── src/
│   ├── apps/                # 63 virtual app components
│   │   ├── me/              # 11 pages — Dashboard, Story, Philosophy, etc.
│   │   ├── work/            # 8 pages — Summary, Experience, Projects, etc.
│   │   ├── code/            # 6 pages — Stats, Repos, LeetCode, etc.
│   │   ├── library/         # 23 pages — Music, Movies, Books, Anime, etc.
│   │   ├── gaming/          # 4 pages — Chess, Speedrun, Trophies
│   │   ├── connect/         # 6 pages — Feed, Articles, Contact, etc.
│   │   └── system/          # 5 pages — Search, AI, Settings, Weather
│   ├── core/
│   │   ├── router.ts        # Hash-based router with 63 routes
│   │   └── shell.ts         # macOS-style shell (top bar, sidebar, dock)
│   ├── services/            # API integration layer
│   │   ├── api.ts           # Central API client
│   │   ├── coding.ts        # GitHub, LeetCode, StackOverflow
│   │   ├── media.ts         # Last.fm, AniList, Trakt, Letterboxd
│   │   ├── gaming.ts        # Lichess, Speedrun
│   │   ├── social.ts        # Mastodon, Bluesky, Dev.to, Reddit
│   │   ├── books.ts         # OpenLibrary
│   │   ├── utility.ts       # Weather, Lanyard
│   │   ├── firebase.ts      # Firebase analytics
│   │   └── init.ts          # Third-party service initialization
│   ├── data/                # Static data modules & reactive store
│   ├── config.ts            # All usernames and API endpoints
│   └── style.css            # Complete CSS design system
├── scripts/                 # Python deployment & DNS automation
│   ├── deploy.py            # Multi-platform deployer (6 platforms)
│   ├── dns.py               # Cloudflare DNS manager
│   ├── add_pages_domains.py # Add Cloudflare Pages custom domains
│   ├── check_dns.py         # DNS record checker
│   ├── setup_cf_email.py    # Cloudflare email routing
│   ├── update_root.py       # Root domain updater
│   ├── update_spaceship_ns.py  # Nameserver updater
│   └── requirements.txt     # Python dependencies
├── chrome-extension/        # Browser extension companion
├── docs/                    # Documentation
├── index.html               # Entry point with SEO meta tags
├── vite.config.ts           # Rolldown-Vite configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run unit tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🚢 Deployment

### Deploy to All Platforms

```bash
# Install Python dependencies
pip install -r scripts/requirements.txt

# Deploy to all enabled platforms (Cloudflare, Netlify, Surge, Neocities, GitHub Pages)
python scripts/deploy.py
```

### Deploy to Individual Platforms

Controlled via `.env` feature flags:

```env
ENABLE_CLOUDFLARE=True
ENABLE_NETLIFY=True
ENABLE_VERCEL=True
ENABLE_SURGE=True
ENABLE_NEOCITIES=True
ENABLE_GITHUB_PAGES=True
```

### DNS Management

```bash
# List all DNS zones
python scripts/dns.py zones

# List records for a domain
python scripts/dns.py records chirag127.in

# Setup custom subdomain
python scripts/dns.py setup me chirag127.in me-791.pages.dev
```

---

## 🗂️ Subdomain Registry

### chirag127.in

| Subdomain | Repository | Description |
|-----------|------------|-------------|
| `chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Main portfolio (this repo) |
| `www.chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Redirect to main |
| `me.chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Portfolio mirror |
| `my.chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Portfolio alias |
| `portfolio.chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Portfolio alias |
| `dev.chirag127.in` | [dev.chirag127.in](https://dev.chirag127.in) | Developer tools |
| `fin.chirag127.in` | [fin.chirag127.in](https://fin.chirag127.in) | Finance tools |

### oriz.in

| Subdomain | Target | Purpose |
|-----------|--------|---------|
| `money.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Finance tools |
| `finance.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Finance tools |
| `fin.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Finance tools |
| `wealth.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Wealth management |
| `calc.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Calculators |
| `capital.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Capital management |

### oriz.in

| Subdomain | Target | Purpose |
|-----------|--------|---------|
| `dev.oriz.in` | [`dev.oriz.in`](https://dev.oriz.in) | Developer tools |
|`sw.oriz.in` | [`sw.oriz.in`](https://dev.oriz.in) |Developer tools  |
|`tech.oriz.in` | [`tech.oriz.in`](https://dev.oriz.in) |Developer tools  |
|`code.oriz.in` | [`code.oriz.in`](https://dev.oriz.in) |Developer tools  |
|`tools.oriz.in` | [`tools.oriz.in`](https://www.oriz.in) |Developer tools  |
|`apps.oriz.in` | [`apps.oriz.in`](https://www.oriz.in) |Developer tools  |
|`web.oriz.in` | [`web.oriz.in`](https://www.oriz.in) |Developer tools  |

| `blog.oriz.in` | [`blog.oriz.in`](https://blog.oriz.in) | Blog |
| `me.oriz.in` | [`chirag127.in`](https://chirag127.in) | Portfolio |


---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Cloudflare
CLOUDFLARE_GLOBAL_API_KEY=your_api_key
CLOUDFLARE_EMAIL=your_email
CLOUDFLARE_ACCOUNT_ID=your_account_id
ENABLE_CLOUDFLARE=True

# Netlify
NETLIFY_AUTH_TOKEN=your_token
NETLIFY_SITE_ID=your_site_id
ENABLE_NETLIFY=True

# Vercel
VERCEL_TOKEN=your_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
ENABLE_VERCEL=True

# Surge
SURGE_TOKEN=your_token
SURGE_DOMAIN=yoursite.surge.sh
ENABLE_SURGE=True

# Neocities
NEOCITIES_API_KEY=your_api_key
NEOCITIES_SITENAME=yoursite
ENABLE_NEOCITIES=True

# GitHub Pages
GH_USERNAME=yourusername
GH_TOKEN=your_token
ENABLE_GITHUB_PAGES=True
```

---

## 📄 License

MIT © [Chirag Singhal](https://chirag127.in)
