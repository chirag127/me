# Islands

Hydrated React islands for the otherwise-static Astro site. Each file
exports a default component mounted from a `.astro` page or layout via
`client:load`, `client:idle`, or `client:only="react"`.

| Island | Purpose |
| --- | --- |
| `AdminDashboard.tsx` | Admin-only ops dashboard |
| `AgeGate.tsx` | 18+ confirmation gate for adult-content sections (movies/anime/possibly others) — see `knowledge/decisions/age-gating-policy.md` |
| `AuthBanner.tsx` | Initialises the auth store on app boot |
| `AuthWidget.tsx` | Sign-in / account chip in the header |
| `ChatWidget.tsx` | AI chat panel |
| `ChatWrapper.tsx` | Hydrates `ChatWidget` lazily |
| `CookieBanner.tsx` | One-time cookie-consent prompt |
| `HeroChatButton.tsx` | Hero CTA that opens the AI chat |
| `KeyboardShortcuts.tsx` | Global ⌘K / ⌘J handlers |
| `MegaHeader.tsx` | Top-bar CTA cluster (theme switcher, etc.) |
| `StatsCounter.tsx` | Animated number counters |
| `ThemeSwitcher.tsx` | Theme + accent picker |
