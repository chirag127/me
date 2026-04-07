# Portfolio Website Complete Redesign — Handoff Prompt

> **CRITICAL OBJECTIVE**: Refactor every page of this Astro portfolio website to create the most visually stunning, premium, hire-persuasive personal site imaginable. The website must make any employer who visits it immediately want to hire Chirag Singhal. Every page must exude professionalism, technical mastery, and meticulous attention to design. This is NOT a minor update — it is a ground-up visual overhaul of 40+ pages while preserving all existing data and functionality.

---

## Table of Contents

1. [Context & Architecture](#1-context--architecture)
2. [What Has Already Been Done](#2-what-has-already-been-done)
3. [Design System Reference](#3-design-system-reference)
4. [Global Migration Tasks](#4-global-migration-tasks)
5. [Page-by-Page Redesign Specifications](#5-page-by-page-redesign-specifications)
6. [Component Library](#6-component-library)
7. [Global CSS Overhaul](#7-global-css-overhaul)
8. [Performance & Accessibility](#8-performance--accessibility)
9. [Deployment](#9-deployment)
10. [Verification Checklist](#10-verification-checklist)

---

## 1. Context & Architecture

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro | 6.1.0 |
| UI Islands | React | 19.2.4 |
| Styling | Tailwind CSS | 4.2.2 |
| Package Manager | pnpm | latest |
| Build Output | Static (SSG) | `output: 'static'` |
| Hosting | Cloudflare Pages | — |
| Fonts | Inter, Outfit, JetBrains Mono | Google Fonts |
| State | Zustand | 5.0.12 |
| Animation | Framer Motion | 12.38.0 |
| Testing | Vitest + Playwright | latest |
| Linter/Formatter | Biome | 2.4.9 |

### Project Root

```
c:\Users\chira\OneDrive\GitHub\me\
```

### Repository

```
https://github.com/chirag127/me
```

### Live Site

```
https://me.oriz.in
```

### Directory Structure

```
src/
├── components/
│   ├── CommandPalette.astro    (15KB — keep, no changes needed)
│   ├── Footer.astro            (8KB — DELETE, now integrated in Layout)
│   ├── Navbar.astro            (9KB — DELETE, replaced by Sidebar)
│   ├── Sidebar.astro           (11KB — NEW, already created)
│   └── islands/
│       ├── AdminDashboard.tsx   (41KB)
│       ├── AuthBanner.tsx       (0.4KB)
│       ├── AuthWidget.tsx       (9KB)
│       ├── ChatWidget.tsx       (7KB)
│       ├── ChatWrapper.tsx      (38KB)
│       ├── CookieBanner.tsx     (1.4KB)
│       ├── HeroChatButton.tsx   (2KB)
│       ├── JournalApp.tsx       (8KB)
│       ├── StatsCounter.tsx     (2KB)
│       └── ThemeSwitcher.tsx    (2KB)
├── data/
│   ├── amazon.ts
│   ├── resume.ts               (20KB — already updated with tagline/valueProposition/availability)
│   ├── social.ts               (5KB)
│   ├── testimonials.ts         (3KB — NEW, already created with 4 LinkedIn recs)
│   ├── uses.ts                 (3KB)
│   └── generated/              (JSON data fetched at build time)
├── layouts/
│   └── Layout.astro            (already rebuilt with sidebar + header)
├── lib/
│   ├── api/
│   │   ├── index.ts            (API integration layer)
│   │   └── github-api.ts
│   ├── config.ts
│   └── ai/ (AI tools, keep as-is)
├── pages/
│   ├── index.astro             (already redesigned)
│   ├── 404.astro
│   ├── privacy.astro
│   ├── terms.astro
│   ├── cookie-policy.astro
│   ├── disclaimer.astro
│   ├── sitemap.xml.ts
│   ├── api/ (keep as-is)
│   ├── code/
│   │   ├── index.astro         (NEEDS REDESIGN)
│   │   ├── repos.astro         (NEEDS REDESIGN)
│   │   ├── npm.astro           (NEEDS REDESIGN)
│   │   ├── stackoverflow.astro (NEEDS REDESIGN)
│   │   └── holopin.astro       (NEEDS REDESIGN)
│   ├── connect/
│   │   ├── index.astro         (NEEDS REDESIGN)
│   │   ├── bluesky.astro       (NEEDS REDESIGN)
│   │   ├── contact.astro       (NEEDS REDESIGN)
│   │   ├── hackernews.astro    (NEEDS REDESIGN)
│   │   ├── mastodon.astro      (NEEDS REDESIGN)
│   │   ├── pixelfed.astro      (NEEDS REDESIGN)
│   │   └── reddit.astro        (NEEDS REDESIGN)
│   ├── gaming/
│   │   └── index.astro         (NEEDS REDESIGN)
│   ├── library/
│   │   ├── index.astro         (NEEDS REDESIGN)
│   │   ├── anime.astro
│   │   ├── anime-completed.astro
│   │   ├── anime-plan-to-watch.astro
│   │   ├── books.astro
│   │   ├── books-read.astro
│   │   ├── books-want-to-read.astro
│   │   ├── manga.astro
│   │   ├── mixcloud.astro
│   │   ├── movies.astro
│   │   ├── movies-rated.astro
│   │   ├── movies-watched.astro
│   │   ├── movies-watchlist.astro
│   │   ├── music.astro
│   │   ├── music-recent.astro
│   │   ├── music-top-artists.astro
│   │   ├── music-top-tracks.astro
│   │   ├── podcasts.astro
│   │   ├── twitch.astro
│   │   └── videos.astro
│   ├── me/
│   │   ├── index.astro         (NEEDS REDESIGN)
│   │   ├── finance.astro       (NEEDS REDESIGN)
│   │   ├── gear.astro          (NEEDS REDESIGN)
│   │   ├── interests.astro     (NEEDS REDESIGN)
│   │   ├── journal.astro       (NEEDS REDESIGN)
│   │   ├── philosophy.astro    (NEEDS REDESIGN)
│   │   └── story.astro         (NEEDS REDESIGN)
│   ├── system/
│   │   ├── index.astro         (NEEDS REDESIGN)
│   │   ├── admin.astro         (NEEDS REDESIGN)
│   │   └── changelog.astro     (NEEDS REDESIGN)
│   └── work/
│       ├── index.astro         (NEEDS REDESIGN)
│       ├── career.astro        (NEEDS REDESIGN)
│       ├── certifications.astro(NEEDS REDESIGN)
│       ├── education.astro     (NEEDS REDESIGN)
│       ├── projects.astro      (NEEDS REDESIGN)
│       └── skills.astro        (NEEDS REDESIGN)
├── services/
│   └── email.ts
├── store/
│   └── useAIChatStore.ts
└── styles/
    ├── global.css              (NEEDS UPDATE — old color vars)
    └── tokens.css              (NEW — already created)
```

---

## 2. What Has Already Been Done

### ✅ Completed

1. **`src/styles/tokens.css`** — Complete design token system created with:
   - Teal→Violet premium color palette (primary: `#14b8a6`, accent: `#8b5cf6`)
   - Deep black neutrals (`#030303` base)
   - 4px spacing grid
   - Typography scale (Inter, Outfit, JetBrains Mono)
   - Motion tokens (ease-out-expo, spring, etc.)
   - Shadow + glow tokens
   - Layout dimensions (sidebar: 240px, header: 56px)

2. **`src/components/Sidebar.astro`** — Complete sidebar navigation:
   - 8 nav sections: Home, Work, Code, Library, Gaming, Me, Connect, System
   - Active state detection with child highlighting
   - Mobile overlay with hamburger toggle
   - "Available for Hire" badge at bottom
   - Lucide-style inline SVG icons
   - Collapsible desktop sidebar (240px)

3. **`src/layouts/Layout.astro`** — Complete layout rebuild:
   - Sidebar integration with `lg:ml-[var(--sidebar-width)]` offset
   - Slim header with hamburger, page title, "Hire Me" CTA, ⌘K trigger
   - Footer integrated directly (no separate Footer.astro needed)
   - Skip-to-content accessibility link
   - Removed old Navbar/Footer imports
   - Removed placeholder AdSense code
   - Added JetBrains Mono font
   - Scroll-triggered reveal animations preserved

4. **`src/data/resume.ts`** — Updated:
   - Added `tagline`, `valueProposition`, `availability`, `extendedSummary` exports
   - Shortened `summary` to 2 concise sentences
   - All existing data (experience, education, projects, skills, honors, certifications) preserved

5. **`src/data/testimonials.ts`** — Created:
   - 4 verified LinkedIn recommendations
   - Typed interface `Testimonial`
   - Real names, roles, companies, dates, quotes, LinkedIn URLs

6. **`src/pages/index.astro`** — Complete homepage redesign:
   - Hero with avatar + floating tech badges
   - Value proposition grid (3 cards)
   - Animated stats row (stars, leetcode, projects, years)
   - Experience snapshot (current role + background)
   - Featured projects grid
   - LinkedIn testimonials section
   - Blog/articles section
   - Recognition bar
   - Hire CTA banner with gradient

7. **`public/avatar.png`** — Generated illustrated professional avatar

### ❌ NOT Done Yet — What You Must Do

Every page listed as "NEEDS REDESIGN" above must be updated. Additionally:
- `global.css` needs the old `--color-*` variables updated or aliased to the new `tokens.css` semantic tokens
- Old `Navbar.astro` and `Footer.astro` imports must be removed from ALL pages
- `CommandPalette.astro` should still be imported where needed
- All pages must work with the new sidebar Layout without duplicate nav/footer

---

## 3. Design System Reference

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` / Teal 500 | `#14b8a6` | Primary actions, active states, links |
| `--primary-light` / Teal 400 | `#2dd4bf` | Hover states, highlights |
| `--primary-lighter` / Teal 300 | `#5eead4` | Gradient endpoints, light accents |
| `--accent` / Violet 500 | `#8b5cf6` | Secondary accent, gradient partner |
| `--accent-light` / Violet 400 | `#a78bfa` | Hover secondary |
| `--surface-base` | `#030303` | Page background |
| `--surface-card` | `rgba(255,255,255,0.02)` | Card background |
| `--border-default` | `rgba(255,255,255,0.07)` | Standard borders |
| `--border-hover` | `rgba(255,255,255,0.12)` | Hover borders |
| `--text-primary` | `#ffffff` | Headings |
| `--text-secondary` | `#a1a1ae` | Body text |
| `--text-tertiary` | `#71717e` | Labels |
| `--text-muted` | `#52525e` | Disabled/faint |

### Gradients

- **Primary gradient**: `from-teal-500 to-violet-500` (135deg) — for CTAs, active states
- **Surface gradient**: `from-gray-950 to-black` — for sections
- **Hero glow**: Radial `rgba(20,184,166,0.12)` — background ambience

### Typography

- **Display font** (`font-family: var(--font-display)`): Outfit — used for h1, h2, hero text, large headings
- **Body font** (`font-family: var(--font-sans)`): Inter — used for body text, labels, nav
- **Mono font** (`font-family: var(--font-mono)`): JetBrains Mono — for code blocks, stats

### Card Pattern (MANDATORY for all cards on every page)

```html
<div class="p-6 rounded-2xl bg-white/[0.015] border border-white/5
  hover:border-teal-500/15 hover:bg-white/[0.025]
  transition-all duration-300">
  <!-- content -->
</div>
```

### Section Header Pattern (MANDATORY for all page section headers)

```html
<div class="flex items-center gap-2 text-xs font-semibold
  text-teal-400 uppercase tracking-wider mb-4">
  <span class="h-1.5 w-1.5 rounded-full bg-teal-400"></span>
  SECTION NAME
</div>
<h2 class="text-2xl font-black text-white mb-1"
  style="font-family: var(--font-display, 'Outfit');">
  Section Title
</h2>
<p class="text-white/30 text-sm font-medium">
  Section description
</p>
```

### Page Header Pattern (MANDATORY for all page tops)

```html
<!-- Ambient glow -->
<div class="absolute top-0 right-0 w-96 h-96
  bg-teal-500/5 rounded-full blur-[120px]
  pointer-events-none"></div>

<div class="mb-10 relative">
  <div class="inline-flex items-center gap-2 px-3 py-1.5
    rounded-full bg-teal-500/5 border border-teal-500/15
    text-[11px] font-semibold text-teal-400
    uppercase tracking-wider mb-5">
    <span class="h-1.5 w-1.5 rounded-full bg-teal-400
      animate-pulse"></span>
    PAGE LABEL
  </div>
  <h1 class="text-3xl sm:text-4xl font-black text-white mb-2"
    style="font-family: var(--font-display, 'Outfit');">
    Page Title
  </h1>
  <p class="text-base text-white/40 max-w-2xl">
    Page description text
  </p>
</div>
```

### Stat Card Pattern

```html
<div class="p-5 rounded-2xl bg-white/[0.015]
  border border-white/5 text-center
  hover:border-white/10 transition-all">
  <div class="text-2xl mb-1">EMOJI</div>
  <div class="text-3xl font-black text-white tracking-tight"
    style="font-family: var(--font-display, 'Outfit');">
    VALUE
  </div>
  <div class="text-[10px] font-semibold text-white/30
    uppercase tracking-widest">
    LABEL
  </div>
</div>
```

### Link Card Pattern (for external link cards)

```html
<a href="URL" target="_blank" rel="noopener noreferrer"
  class="group p-5 rounded-2xl bg-white/[0.015]
    border border-white/5 hover:border-teal-500/15
    hover:bg-white/[0.025] transition-all duration-300
    flex items-center gap-4">
  <div class="h-11 w-11 rounded-xl flex items-center
    justify-center flex-shrink-0"
    style="background: COLOR12;">
    <!-- icon -->
  </div>
  <div class="min-w-0 flex-1">
    <h3 class="text-sm font-semibold text-white
      group-hover:text-teal-300 transition-colors">
      TITLE
    </h3>
    <p class="text-xs text-white/35 truncate">SUBTITLE</p>
  </div>
  <svg class="h-4 w-4 text-white/10 flex-shrink-0
    group-hover:text-teal-400/50
    group-hover:translate-x-0.5 transition-all"
    fill="none" viewBox="0 0 24 24"
    stroke="currentColor" stroke-width="2">
    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0
      002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
</a>
```

### Button Styles

```html
<!-- Primary CTA -->
<a class="inline-flex items-center gap-2 px-6 py-3
  rounded-xl bg-gradient-to-r from-teal-500 to-violet-500
  text-white text-sm font-semibold shadow-lg
  hover:shadow-teal-500/25 transition-all duration-300
  hover:scale-[1.02]">

<!-- Secondary -->
<a class="inline-flex items-center gap-2 px-5 py-2
  rounded-xl border border-white/8 text-white/50
  text-xs font-semibold hover:bg-white/5
  hover:text-white transition-all">

<!-- Ghost -->
<a class="text-xs font-semibold text-white/30
  hover:text-teal-400 transition-colors group
  inline-flex items-center gap-1">
  Text <span class="group-hover:translate-x-1
    transition-transform">→</span>
</a>
```

### Progress Bar Pattern

```html
<div class="h-2.5 rounded-full bg-white/5 overflow-hidden">
  <div class="h-full rounded-full bg-gradient-to-r
    from-teal-500 to-teal-400 transition-all duration-700"
    style="width: PERCENT%"></div>
</div>
```

---

## 4. Global Migration Tasks

### Task 4.1: Remove Old Navigation Imports

Every page that imports `Navbar` and/or `Footer` MUST have those imports and usages removed. The Layout now handles all navigation.

**Files that currently import Navbar or Footer (must be fixed):**

```
src/pages/code/index.astro          — Line 4: import Navbar; Line 5: import Footer; Line 63: <Navbar />; Line 357: <Footer />
```

For ALL other pages, check the top of the file for:
```astro
import Navbar from '../../components/Navbar.astro';
import Footer from '../../components/Footer.astro';
```
And remove them. Also remove `<Navbar />` and `<Footer />` from the template.

**Search pattern**: Run `grep -r "Navbar\|Footer" src/pages/` and remove ALL occurrences.

### Task 4.2: Update Old CSS Variable References

The old `global.css` uses `--color-*` prefix variables. The new `tokens.css` uses `--*` prefix (no `color-` prefix). You have two options:

**Option A (Recommended)**: Add aliases in `global.css` to map old names to new tokens:
```css
:root {
  --color-primary: var(--primary);
  --color-primary-light: var(--primary-light);
  --color-primary-lighter: var(--primary-lighter);
  --color-primary-dark: var(--primary-dark);
  --color-primary-faint: var(--primary-faint);
  --color-primary-muted: var(--primary-muted);
  --color-accent-violet: var(--accent);
  --color-surface: var(--surface-base);
  --color-surface-card: var(--surface-card);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-text-muted: var(--text-muted);
  --color-text-faint: var(--text-faint);
  --color-border: var(--border-default);
  --color-border-subtle: var(--border-subtle);
  --color-border-hover: var(--border-hover);
  --color-border-active: var(--border-active);
}
```

**Option B**: Find-and-replace all old variable names in all files. This is more thorough but higher risk.

### Task 4.3: Update `global.css` Primary Color Values

The `@theme` block in `global.css` still has the old Indigo/Cyan palette. Update these to Teal/Violet:

```css
@theme {
  /* OLD: --color-primary: #6366f1; */
  /* NEW: */
  --color-primary: #14b8a6;
  --color-primary-light: #2dd4bf;
  --color-primary-lighter: #5eead4;
  --color-primary-dark: #0d9488;
  --color-primary-darker: #0f766e;
  --color-primary-faint: rgba(20, 184, 166, 0.06);
  --color-primary-muted: rgba(20, 184, 166, 0.15);
  --color-primary-subtle: rgba(20, 184, 166, 0.25);

  /* OLD: --color-accent-warm: #06b6d4; */
  /* NEW: */
  --color-accent-warm: #8b5cf6;
  --color-accent-violet: #8b5cf6;
}
```

### Task 4.4: Ensure `tokens.css` is Imported

`Layout.astro` already imports `tokens.css` before `global.css`. Verify this is working.

---

## 5. Page-by-Page Redesign Specifications

### CRITICAL DESIGN PRINCIPLES FOR EVERY PAGE

1. **NO page should still use `<Navbar />` or `<Footer />`** — Layout handles this
2. **Every card must use the new card pattern** (bg-white/[0.015], border-white/5, hover:border-teal-500/15)
3. **Every page header must use the page header pattern** with teal badge + Outfit font heading
4. **Every page must have ambient glow** (absolute positioned blur circles)
5. **Replace ALL `glass` and `glass-strong` CSS class usage** with the new inline card pattern
6. **Replace ALL `--color-primary` references in inline styles** with teal values
7. **All section titles use Outfit font**: `style="font-family: var(--font-display, 'Outfit');"`
8. **Reveal animations preserved**: keep `class="reveal"`, `class="reveal-stagger"`, etc.
9. **Max content width**: `max-w-[var(--content-max-width)]` (1200px) with `px-6`
10. **The website must look like it was designed by a top-tier design agency.** Every pixel matters. Premium feel. Dark, elegant, sophisticated. The kind of site that makes people go "wow, this developer really knows what they're doing."

---

### 5.1 Work Section (`src/pages/work/`)

#### `work/index.astro` — Work Hub

**Current state**: Uses old `glass-strong`, no Navbar/Footer direct imports, but has old color vars.

**Required changes**:
- Replace all `glass` and `glass-strong` classes with new card pattern
- Update page header to new pattern with teal "WORK" badge
- Replace `--color-primary` inline references with teal colors
- Replace `var(--color-accent-violet)` with `var(--accent)` or direct teal/violet
- Update ambient glow colors from amber to teal
- Ensure `max-w-[var(--content-max-width)]` wrapper
- Keep all data fetching (experience, certifications, education, honors, projects, skills)
- Add hire-CTA at bottom: "Interested? Let's chat" with gradient button

#### `work/career.astro` — Career Timeline

**Required changes**:
- Redesign timeline with teal accent line and glowing dots
- Each timeline entry as a card with hover effect
- Company logos or colored badges for each role
- "Current" badge on active role with green pulse dot

#### `work/skills.astro` — Skills Matrix

**Required changes**:
- Grid of skill categories as cards
- Each skill item as a pill/tag with subtle background
- Progress bars or proficiency indicators
- Group by category with section headers

#### `work/projects.astro` — Projects Gallery

**Required changes**:
- Grid of project cards (3 columns desktop, 1 mobile)
- Each card: tech tags at top, project name in Outfit, description, "View Project →" hover reveal
- Featured projects get a gradient border
- Filter chips at top (by tech?)

#### `work/education.astro` — Education & Certifications

**Required changes**:
- Education cards with institution, degree, dates, highlights
- Honor cards with award icons
- Timeline or grid layout

#### `work/certifications.astro` — Certifications

**Required changes**:
- Grid of certification cards with issuer, date, credential link
- Badge/icon for each cert

---

### 5.2 Code Section (`src/pages/code/`)

#### `code/index.astro` — Code Dashboard

**Current state**: Imports `Navbar` (line 4) and `Footer` (line 5). Uses `<Navbar />` and `<Footer />`. Has old `glass` classes. **MUST remove Navbar/Footer**.

**Required changes**:
- REMOVE `import Navbar` and `import Footer` and their template usages
- Update all `glass` classes to new card pattern
- Update page header to teal "CODE" badge pattern
- Replace `var(--color-primary)` with teal values
- GitHub profile card: avatar, bio, stats grid
- LeetCode progress: difficulty bars with emerald/amber/red colors (keep existing logic)
- Codewars section: rank display, honor points
- Top Languages: horizontal bar chart with gradient bars
- Recent repos: list with stars, forks, language badge
- "Other Dev Platforms" section: NPM, StackOverflow, Holopin cards
- Keep `<StatsCounter client:visible>` islands

#### `code/repos.astro`

**Required changes**:
- Full repo listing with search/filter
- Grid or list view
- Each repo card: name, description, language dot, stars, forks, last updated
- Sort by stars/recent

#### `code/npm.astro`

**Required changes**:
- NPM package cards with download counts
- Each card: package name, version, description, install command
- Total downloads stat at top

#### `code/stackoverflow.astro`

**Required changes**:
- Stats cards: reputation, badges (gold/silver/bronze)
- Top answers/questions if available
- Link to profile

#### `code/holopin.astro`

**Required changes**:
- Badge display grid
- Link to Holopin board

---

### 5.3 Library Section (`src/pages/library/`)

#### `library/index.astro` — Library Hub

**Current state**: No Navbar/Footer imports. Uses `glass` classes and old color vars.

**Required changes**:
- Update page header to teal "LIBRARY" badge
- Replace all `glass` and `glass-strong` with new card patterns
- Category cards: Keep the existing data structure (`categories` array) but update styling
- Each category card: icon, title, stats row, top items pills, sub-page links
- Remove the "from-emerald-500/20" etc. gradients and use per-category accent colors applied via inline styles
- The cards should feel premium — subtle glow on hover, smooth transitions
- "More Collections" section: clean grid of additional links

#### ALL library sub-pages (20 files)

**For every library sub-page** (`anime.astro`, `anime-completed.astro`, `books.astro`, `movies.astro`, `music.astro`, etc.):

1. Check for and remove any `Navbar`/`Footer` imports
2. Replace all `glass`/`glass-strong` classes with new card pattern
3. Update page headers to the new badge pattern
4. Update all `--color-*` references to teal/violet
5. Ensure consistent card styling across all sub-pages
6. Each item card (movie/book/anime/track) should have:
   - Clean rounded corners (`rounded-2xl`)
   - Subtle border (`border-white/5`)
   - Hover state (`hover:border-teal-500/15`)
   - Relevant metadata (rating, date, status)

---

### 5.4 Connect Section (`src/pages/connect/`)

#### `connect/index.astro` — Connect Hub

**Current state**: No Navbar/Footer imports. Uses `glass` classes and old `--color-primary` refs.

**Required changes**:
- Update page header to teal "CONNECT" badge
- Email hero card: gradient border on hover, teal glow
- Social link groups: use the new link card pattern
- Replace all `glass` with inline card styles
- Replace all `var(--color-primary)` with teal values
- Add a "Download Resume" button in the header area
- Add hire-availability indicator

#### All connect sub-pages (bluesky, contact, hackernews, mastodon, pixelfed, reddit)

1. Remove any Navbar/Footer imports
2. Update to new card pattern
3. Update color references
4. Consistent sub-page header with back-to-connect link

---

### 5.5 Gaming Section (`src/pages/gaming/`)

#### `gaming/index.astro`

**Current state**: No Navbar/Footer imports. Uses `glass`, `glass-strong`, old color vars.

**Required changes**:
- Update page header to violet "GAMING" badge (use violet as accent for this section)
- Chess ratings: cards with per-type colors preserved (bullet=red, blitz=amber, rapid=emerald, classical=violet)
- Win/Loss/Draw record: clean bar chart
- Steam games: card grid with game art
- StatsCounter islands: keep as-is, just update wrapper card styling
- Gaming platforms: clean cards with icons

---

### 5.6 Me Section (`src/pages/me/`)

#### `me/index.astro` — About Me Hub

**Required changes**:
- Hero with avatar image (`/avatar.png`) and extended bio
- Use `extendedSummary` from resume.ts
- Personal details cards (location, education, interests)
- Sub-page navigation grid
- Testimonials section (reuse from homepage or dedicated display)

#### `me/story.astro` — Personal Story

**Required changes**:
- Long-form content about Chirag's journey
- Timeline sections with milestones
- Visual narrative with section dividers

#### `me/philosophy.astro` — Engineering Philosophy

**Required changes**: Update styling to new design system. Keep content.

#### `me/interests.astro` — Interests

**Required changes**: Interest cards with icons. New card pattern.

#### `me/gear.astro` — Gear & Tools

**Required changes**: Gear items as cards with categories. New design system.

#### `me/journal.astro` — Journal

**Required changes**: Uses `<JournalApp client:load />` island. Update wrapper styling.

#### `me/finance.astro` — Finance Dashboard

**Required changes**: Update all cards to new pattern. Keep data logic.

---

### 5.7 System Section (`src/pages/system/`)

#### `system/index.astro` — Settings

**Required changes**: Update to new card pattern. Keep functionality.

#### `system/admin.astro` — Admin (authenticated)

**Required changes**: Update wrapper. Uses `<AdminDashboard client:load />` island.

#### `system/changelog.astro` — Changelog

**Required changes**: Timeline of changes. New design system.

---

### 5.8 Legal Pages

#### `privacy.astro`, `terms.astro`, `cookie-policy.astro`, `disclaimer.astro`

**Required changes**:
- Check for Navbar/Footer imports and remove
- Update any old color vars
- Clean typography with readable line-height
- Simple, elegant legal page styling

---

### 5.9 Error Pages

#### `404.astro`

**Required changes**:
- Premium 404 page with gradient text
- "Go Home" CTA button
- Maybe a subtle animation

---

## 6. Component Library

### 6.1 Delete Deprecated Components

- **`src/components/Navbar.astro`** — DELETE this file after all imports are removed
- **`src/components/Footer.astro`** — DELETE this file after all imports are removed

### 6.2 Keep As-Is (No Changes Needed)

- `CommandPalette.astro` — works across all pages
- All `islands/*.tsx` — React components, keep as-is (they have their own styling)
- `Sidebar.astro` — already created and integrated

---

## 7. Global CSS Overhaul

### `src/styles/global.css` — Required Changes

1. **Update `@theme` block** primary colors from Indigo (#6366f1) to Teal (#14b8a6):

```css
@theme {
  /* Update these values */
  --color-primary: #14b8a6;
  --color-primary-light: #2dd4bf;
  --color-primary-lighter: #5eead4;
  --color-primary-dark: #0d9488;
  --color-primary-darker: #0f766e;
  --color-primary-faint: rgba(20, 184, 166, 0.06);
  --color-primary-muted: rgba(20, 184, 166, 0.15);
  --color-primary-subtle: rgba(20, 184, 166, 0.25);
  --color-accent-warm: #8b5cf6;
}
```

2. **Add backward-compat aliases** after `@theme` if needed for components that reference `--color-*`:

```css
:root {
  --color-accent-primary: var(--color-primary);
}
```

3. **Update `.glass` and `.glass-strong` classes** to use the new token colors:

```css
.glass {
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
}
.glass-strong {
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
}
```

4. **Update gradient definitions** to use teal→violet instead of indigo→cyan

5. **Keep all animation keyframes** (@keyframes fade-in, slide-up, reveal, etc.)

---

## 8. Performance & Accessibility

### Performance Requirements

- **LCP < 2.5s** — No heavy JS on initial load
- **CLS near 0** — No layout shifts from fonts or async content
- **FID < 100ms** — Minimal main-thread work
- **Use `client:visible`** for all React islands that are below the fold
- **Use `client:load`** only for critical islands (AuthBanner, ChatWrapper, CookieBanner)
- **Images**: All images must have `width`, `height`, `loading="lazy"` (except hero avatar which uses `loading="eager"`)
- **Fonts**: Already preconnected in Layout. Using `display=swap`.

### Accessibility Requirements

- **Skip to content link** — Already in Layout ✅
- **ARIA landmarks** — `role="navigation"`, `role="main"` — Already in Layout ✅
- **`aria-current="page"`** — Already in Sidebar ✅
- **Focus styles** — All interactive elements must have visible focus: `focus:outline-none focus:ring-2 focus:ring-teal-500/50`
- **Color contrast** — White text on #030303 background passes WCAG AAA
- **Alt text** — All images must have descriptive alt text
- **Keyboard navigation** — All interactive elements reachable via Tab key
- **Screen reader labels** — All icon-only buttons need `aria-label`

---

## 9. Deployment

### Build & Verify Locally

```bash
cd c:\Users\chira\OneDrive\GitHub\me
pnpm run build
pnpm run preview
```

The build MUST succeed with zero errors (warnings are acceptable).

### Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy dist/ --project-name=chirag-website
```

### Push to GitHub

```bash
git add -A
git commit -m "feat: complete portfolio redesign with sidebar nav and teal-violet design system"
git push origin main
```

---

## 10. Verification Checklist

After completing ALL changes, verify:

- [ ] `pnpm run build` succeeds with zero errors
- [ ] Every page renders correctly at `http://localhost:4321/`
- [ ] Sidebar navigation works on desktop (240px persistent)
- [ ] Sidebar works on mobile (hamburger → overlay)
- [ ] All sidebar nav links are correct and highlight active page
- [ ] "Hire Me" CTA in header is visible and links to /connect
- [ ] "Available for Hire" badge in sidebar footer is visible
- [ ] Homepage hero loads with avatar and floating badges
- [ ] Homepage testimonials display correctly
- [ ] Homepage stats are populated (not showing zeros)
- [ ] All Work section pages render at /work, /work/career, /work/skills, /work/projects, /work/education, /work/certifications
- [ ] All Code section pages render at /code, /code/repos, /code/npm, /code/stackoverflow, /code/holopin
- [ ] All Library section pages render (20 pages)
- [ ] Gaming page renders at /gaming
- [ ] All Me section pages render
- [ ] All Connect section pages render
- [ ] All System section pages render
- [ ] Legal pages render (privacy, terms, cookie-policy, disclaimer)
- [ ] 404 page renders
- [ ] NO page shows `<Navbar>` or `<Footer>` components (only sidebar + inline footer)
- [ ] NO page has broken CSS (no flash-of-wrong-colors)
- [ ] All old `--color-*` variables work (either updated or aliased)
- [ ] All cards have consistent styling (rounded-2xl, border-white/5, hover effects)
- [ ] All page headers use the badge + Outfit heading pattern
- [ ] Mobile responsive at 320px, 375px, 768px, 1024px, 1440px
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] No console errors in browser DevTools
- [ ] Performance: LCP < 2.5s on Lighthouse
- [ ] **The site looks STUNNING and hire-persuasive**

---

## Final Notes

### Execution Order (Recommended)

1. **global.css** — Update color values and add aliases. This fixes ALL existing pages immediately.
2. **Batch remove** Navbar/Footer imports from all pages (simple find-and-replace).
3. **Update page headers** across all pages to new pattern (batch operation).
4. **Update card styling** across all pages (replace `glass`/`glass-strong` with inline).
5. **Redesign individual pages** starting with high-impact ones: Work → Code → Connect → Me → Library → Gaming → System.
6. **Build and verify**.
7. **Deploy**.

### Design Philosophy

This website must communicate:
- **"I am a senior engineer who builds at scale"** — through the clean, systematic design
- **"I care about craft"** — through the micro-interactions, transitions, and attention to detail
- **"I am available and you should hire me"** — through the CTAs, availability badges, and clear value proposition
- **"I am well-rounded"** — through the library, gaming, and personal sections showing depth of character

The goal is simple: **any hiring manager who lands on this site should feel compelled to reach out immediately.**