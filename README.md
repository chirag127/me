# Project Me - Digital Twin Portfolio

> A comprehensive "Digital Twin" portfolio website built with Vite, TypeScript, and Puter.js

## 🌐 Live Sites

| Platform | URL | Status |
|----------|-----|--------|
| **Primary** | [chirag127.in](https://chirag127.in) | ✅ Live |
| **WWW** | [www.chirag127.in](https://www.chirag127.in) | ✅ Live |
| **Me Subdomain** | [me.chirag127.in](https://me.chirag127.in) | ✅ Live |
| **Cloudflare Pages** | [me-791.pages.dev](https://me-791.pages.dev) | ✅ Live |
| **Netlify** | [chirag127.netlify.app](https://chirag127.netlify.app) | ✅ Live |
| **Vercel** | [chirag127.vercel.app](https://chirag127.vercel.app) | ✅ Live |
| **Surge** | [chirag127.surge.sh](https://chirag127.surge.sh) | ✅ Live |

---

## 🗂️ Subdomain Registry

This is the central hub for all chirag127.in subdomains:

| Subdomain | Repository | Description |
|-----------|------------|-------------|
| `chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Main portfolio (this repo) |
| `www.chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Redirect to main |
| `me.chirag127.in` | [chirag127/me](https://github.com/chirag127/me) | Portfolio mirror |
| `pdf.chirag127.in` | *Coming soon* | PDF tools |
| `fin.chirag127.in` | [*finance*](https://fin.oriz.in/) | Finance tools |
| `dev.chirag127.in` | [dev.chirag127.in](https://dev.chirag127.in) | Developer tools |
| `hub.chirag127.in` | *Coming soon* | Project hub |

---

## 🔗 Oriz.in Domains

Subdomains associated with the `oriz.in` domain ecosystem:

| Subdomain | Target | Purpose |
|-----------|--------|---------|
| `money.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Finance tools |
| `finance.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Finance tools |
| `fin.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Finance tools |
| `wealth.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Wealth management |
| `calc.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Calculators |
| `capital.oriz.in` | [`fin.oriz.in`](https://fin.oriz.in) | Capital management |

---

## ✨ Features

- **45+ Virtual App Pages** across 7 drives (ME, WORK, CODE, LIBRARY, GAMING, CONNECT, SYSTEM)
- **30+ API Integrations** - GitHub, LeetCode, Last.fm, Lichess, Mastodon, and more
- **AI Chat** - "Ask Chirag" powered by Puter.js
- **Glassmorphism UI** - Modern 2026 design language
- **Real-time Data** - Live coding stats, music, Discord status

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Deploy to Cloudflare Pages
python scripts/deploy.py
```

---

## 📁 Project Structure

```
me/
├── src/
│   ├── apps/          # 45+ virtual app components
│   │   ├── me/        # Personal dashboard, story, philosophy
│   │   ├── work/      # Resume, experience, projects
│   │   ├── code/      # GitHub, LeetCode, stats
│   │   ├── library/   # Books, music, movies, anime
│   │   ├── gaming/    # Steam, Chess, speedruns
│   │   ├── connect/   # Social feeds, contact
│   │   └── system/    # Search, AI, settings
│   ├── services/      # API integrations
│   │   ├── coding.ts  # GitHub, LeetCode, StackOverflow
│   │   ├── media.ts   # Last.fm, AniList, Letterboxd
│   │   ├── gaming.ts  # Lichess, Steam, RetroAchievements
│   │   ├── social.ts  # Mastodon, Bluesky, Dev.to
│   │   ├── books.ts   # OpenLibrary
│   │   └── utility.ts # Weather, Lanyard, Unsplash
│   ├── core/          # Router, shell, Puter.js wrapper
│   ├── data/          # Resume data, reactive store
│   └── config.ts      # All usernames and API endpoints
├── scripts/           # Python deployment automation
│   ├── deploy.py      # Multi-platform deployer
│   ├── dns.py         # Cloudflare DNS manager
│   └── README.md      # Script documentation
└── dist/              # Production build output
```

---

## 🔧 Deployment Scripts

```bash
# Deploy to all platforms
python scripts/deploy.py

# Manage DNS
python scripts/dns.py zones                          # List zones
python scripts/dns.py records chirag127.in           # List records
python scripts/dns.py setup <sub> <domain> <target>  # Add subdomain
```

---

## 📊 API Integrations

<details>
<summary>Click to expand full API list</summary>

### Coding
- GitHub REST API
- LeetCode Stats API
- CodeWars API
- WakaTime Embeds
- NPM Downloads
- StackOverflow API
- GitLab API
- Holopin Badges

### Media
- Last.fm Scrobbles
- AniList GraphQL (Anime + Manga)
- Letterboxd RSS
- Trakt.tv API
- ListenBrainz API
- OpenLibrary API

### Gaming
- Lichess API
- Speedrun.com API
- RetroAchievements API
- Steam Profile

### Social
- Mastodon API
- Bluesky AT Protocol
- Dev.to API
- Medium RSS
- Reddit JSON
- Hacker News Firebase
- YouTube RSS
- Pixelfed API

### Utility
- Open-Meteo Weather
- Lanyard Discord Status
- Unsplash API
- Puter.js AI/KV

</details>

---

## 📄 License

MIT © [Chirag Singhal](https://chirag127.in)
