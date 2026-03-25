# Chirag Singhal — Personal Website

Personal digital identity platform for Chirag Singhal, Software Engineer at TCS.

**Live:** [chiragsinghal.com](https://chiragsinghal.com)

## Tech Stack
- **Framework:** Astro 6 + React 19 (Islands Architecture)
- **Styling:** Tailwind CSS 4.2
- **Auth & DB:** Firebase 12 (Auth + Firestore)
- **AI:** Puter.js (free, no API keys)
- **Email:** EmailJS (contact alerts)
- **Hosting:** Cloudflare Pages (free)

## Pages
| Path | Content |
|------|---------|
| `/` | Homepage — hero, stats, projects, skills, articles |
| `/me` | Personal — story, philosophy, journal, interests, gear, finance |
| `/work` | Career — timeline, skills, projects, education, certifications |
| `/code` | Coding — GitHub analytics, LeetCode, repos |
| `/library` | Media — movies, anime, books, music |
| `/gaming` | Chess (Lichess), game tracking |
| `/connect` | Social profiles, contact |
| `/system` | Settings, changelog, admin |

## Features
- 🤖 AI Assistant (asks about Chirag)
- 🔐 Firebase Auth (Google + email/password)
- 💬 Chat with Firestore storage
- ✉️ Email alerts when AI can't answer
- 🔍 Command palette (⌘K)
- 🌙 Dark mode
- 📱 Responsive

## Setup
```bash
npm install
cp .env.example .env   # Fill Firebase + EmailJS values
npm run dev
```

## Environment Variables
See `.env.example` — Firebase config, EmailJS keys.

## Deploy
Cloudflare Pages: `npm run build` → deploy `dist/`
