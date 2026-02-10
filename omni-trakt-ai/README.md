# 👁️ Omni-Trakt AI

### The Universal, AI-Powered Video Scrobbler for Chrome

<div align="center">

**Omni-Trakt AI** detects what you're watching on **ANY website** — Netflix, HBO, YouTube, pirate sites, Google Drive, embedded players — and automatically scrobbles it to [Trakt.tv](https://trakt.tv) using **Gemini AI** to identify the content.

*No hardcoded site support. No fragile CSS selectors. Just AI.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌐 **Universal Detection** | MutationObserver-based video detection works on ANY website with `<video>` elements |
| 🤖 **AI Identification** | Google Gemini (Gemma 3 27B IT) analyzes page title, URL, headings, and metadata |
| 🎯 **Smart Filtering** | 30-second debounce ignores ads, previews, and auto-play trailers |
| 🎬 **Trakt Scrobbling** | Auto-scrobbles movies and TV shows with episode detection |
| 🔧 **Manual Correction** | Correct AI misidentifications with the popup's correction modal |
| 📺 **Iframe Support** | `all_frames: true` catches videos inside embedded iframes |
| 📋 **Local History** | Unmatched content saved to local history instead of failing silently |
| 🎨 **Premium UI** | Dark-mode glassmorphism popup with real-time status updates |

## 🏗️ Architecture

```
┌─────────────────┐     messages      ┌──────────────────────┐
│  Content Script  │ ──────────────►  │  Background Worker   │
│  (video-detect)  │                  │  (orchestrator)      │
│                  │                  │                      │
│  • MutationObserver               │  1. Receive metadata  │
│  • Video events   │                │  2. Call Gemini AI    │
│  • Page metadata  │  ◄──────────── │  3. Search Trakt      │
│  • 30s debounce   │   state updates│  4. Scrobble          │
└─────────────────┘                  └──────────────────────┘
                                              ▲
                                              │ state
                                              ▼
                                     ┌──────────────────────┐
                                     │  Popup UI            │
                                     │  • Status dashboard  │
                                     │  • Auth management   │
                                     │  • History logs      │
                                     │  • Settings          │
                                     └──────────────────────┘
```

## 🚀 Setup

### 1. Get API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy it

**Trakt API App:**
1. Go to [Trakt API Applications](https://trakt.tv/oauth/applications)
2. Create a new application
3. **Important:** Check the `/scrobble` permission
4. Set the **Redirect URI** to: `https://<your-extension-id>.chromiumapp.org/`
   - You'll get the extension ID after loading it in Chrome
5. Copy the **Client ID** and **Client Secret**

### 2. Install the Extension

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `omni-trakt-ai/` folder
6. Note your **Extension ID** from the extensions page

### 3. Configure

1. Click the Omni-Trakt AI icon in your toolbar
2. Go to **Settings** tab
3. Enter your **Gemini API Key**
4. Enter your **Trakt Client ID** and **Client Secret**
5. Click **Save Settings**
6. Go back to **Status** tab and click **Sign in with Trakt**

### 4. Watch Something!

Navigate to any website with a video. After 30 seconds of playback, the extension will:
1. Extract page metadata
2. Send it to Gemini AI for identification
3. Search Trakt for the match
4. Auto-scrobble if confidence ≥ 80%

## 📁 Project Structure

```
omni-trakt-ai/
├── manifest.json              # Chrome Manifest V3
├── src/
│   ├── background.js          # Service worker — the brain
│   ├── content/
│   │   └── video-detect.js    # Universal video detector
│   ├── services/
│   │   ├── ai.js              # Gemini AI identification
│   │   ├── trakt.js           # Trakt OAuth2 + API
│   │   └── storage.js         # chrome.storage helpers
│   ├── popup/
│   │   ├── popup.html         # Popup structure
│   │   ├── popup.css          # Premium dark-mode styles
│   │   └── popup.js           # Popup controller
│   ├── types/
│   │   └── index.js           # Shared constants
│   └── utils/
│       └── debounce.js        # Utility functions
├── public/
│   └── icons/                 # Extension icons (PNG)
└── README.md
```

## 🔧 Tech Stack

- **Chrome Manifest V3** — Modern extension platform
- **Vanilla JS** — No frameworks, no build tools, zero dependencies
- **Google Gemini API** — Gemma 3 27B IT model for content identification
- **Trakt.tv API v2** — OAuth2 authentication and scrobble endpoints
- **CSS** — Custom glassmorphism dark-mode design

## 🧠 How the AI Works

The extension sends a structured prompt to Gemini with:
- Page URL
- Document title
- Open Graph title
- H1/H2 headings
- Meta description

The AI strips clutter (e.g., "Watch Online Free HD 1080p 123Movies") and returns:
```json
{
  "title": "Breaking Bad",
  "type": "show",
  "season": 5,
  "episode": 14,
  "year": null,
  "confidence": 95
}
```

If confidence ≥ 80%, the extension auto-scrobbles. Otherwise, it logs locally and lets you manually confirm or correct.

## 📝 License

MIT

---

<div align="center">

**Built with 🧠 AI and ❤️ for movie tracking**

</div>
