# LifeLogger - Chrome Extension

A comprehensive digital footprint tracker that captures your complete browsing activity.

## Features

### 📊 What It Captures
| Data Type | Description | Screenshot |
|-----------|-------------|------------|
| **Browse History** | Every page you visit with URL, title, timestamp | No |
| **Search Queries** | Queries from 9+ search engines | Yes |
| **Video Playback** | Any `<video>` tag (non-music, non-major platforms) | Yes |

### 🔒 Security Model
- **Write Access**: Google OAuth required (only authorized email can write)
- **Read Access**:
  - Public: Aggregate stats only (total pages, top domains)
  - Protected: Full history (requires auth or password)

### 🛡️ Privacy Protections
- **Blocked Domains**: Banking, login, password pages are NEVER captured
- **Password Detection**: Skips screenshots if password inputs exist
- **Form Blur**: Blurs sensitive form fields before capture

## Complementary Tools

This extension works alongside:
- **[Web Scrobbler](https://web-scrobbler.com/)** - Music scrobbling to Last.fm
- **[Universal Trakt Scrobbler](https://github.com/trakt-tools/universal-trakt-scrobbler)** - Movie/TV tracking

LifeLogger captures what they miss (generic videos, browse history, searches).

## Installation

### 1. Load Extension
```bash
1. Open Chrome → chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this chrome-extension folder
```

### 2. Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID (Chrome Extension type)
5. Copy Client ID to `manifest.json`

### 3. Setup Google Sheets API
1. Create a new Google Sheet
2. Copy Sheet ID from URL
3. Open Extensions → Apps Script
4. Paste `apps-script.js` content
5. Replace `SHEET_ID` and `AUTHORIZED_EMAIL`
6. Deploy as Web App (Anyone can access)
7. Copy deployment URL to `config.js`

### 4. Optional: Screenshot Storage
For screenshots, configure in `config.js`:
- **Cloudinary**: Create account, get cloud name + unsigned preset
- **ImgBB**: Get API key from imgbb.com

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension config with OAuth |
| `config.js` | Settings, blocked domains, search engines |
| `auth.js` | Google OAuth authentication |
| `background.js` | Page tracking, sync logic |
| `content.js` | Video detection, password field check |
| `screenshot.js` | Safe capture, multi-service upload |
| `popup.html/css/js` | Extension popup UI |
| `apps-script.js` | Google Sheets API |

## Search Engines Tracked

- Google
- Bing
- DuckDuckGo
- YouTube
- Amazon
- GitHub
- Stack Overflow
- Reddit
- Twitter/X

## Blocked Domains (Never Captured)

- Banking sites (bank*, paypal, razorpay)
- Login pages (accounts.google.com, login.*, signin)
- Password managers (1password, lastpass, bitwarden)
- Email (mail.google.com, outlook)
- Government sites (*.gov.*)
- Sensitive keywords (password, secret, private)

## Data Storage

All data stored in YOUR Google Sheet with 3 tabs:
- `BrowseHistory` - All page visits
- `SearchQueries` - Search queries with engine
- `Videos` - Video playback logs

## License

MIT
