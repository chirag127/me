---
type: index
title: Knowledge Wiki — me.oriz.in
description: Catalog of every concept page in this OKF/LLM wiki. Read this first to navigate.
tags: [meta, index, okf]
timestamp: 2026-06-19T00:00:00Z
---

# Knowledge Wiki — me.oriz.in

This directory is an **OKF v0.1** (Open Knowledge Format) / Karpathy LLM-wiki for the
me.oriz.in repository. Each markdown file is one concept; pages cross-link via
relative markdown links. LLM agents (Claude Code, the in-page ChatWrapper) read these
pages to ground answers about the site.

Start with [`schema.md`](schema.md) for the conventions, then [`AGENTS.md`](AGENTS.md)
for the maintenance protocol.

## Architecture

How the site is wired end-to-end.

- [`architecture/overview.md`](architecture/overview.md) — me.oriz.in stack, hosting, top-level data shape
- [`architecture/data-flow.md`](architecture/data-flow.md) — authored JSON → mirror → /data; fetcher → quality-gate → Firestore → snapshot
- [`architecture/auth.md`](architecture/auth.md) — Firebase Google + email/password; Puter.js separate, only AI features
- [`architecture/themes.md`](architecture/themes.md) — 4 themes × 7 accents, FOUC paint script, token system

## Components

Reusable Astro / React surfaces.

- [`components/mega-header.md`](components/mega-header.md) — sticky top bar contents
- [`components/sidebar.md`](components/sidebar.md) — 3-level nav, mobile drawer
- [`components/page-header.md`](components/page-header.md) — reusable hero strip (badge + h1 + description)
- [`components/empty-state.md`](components/empty-state.md) — friendly fallback for missing API data
- [`components/status-strip.md`](components/status-strip.md) — homepage live-data widget

## Integrations

Third-party services we depend on.

- [`integrations/firestore.md`](integrations/firestore.md) — collections, security-rule policy, public-read media/{key}
- [`integrations/puter-js.md`](integrations/puter-js.md) — AI feature gate, network constraint, no API key
- [`integrations/open-router.md`](integrations/open-router.md) — :free model catalog, daily refresh
- [`integrations/render-cv.md`](integrations/render-cv.md) — 3 YAML resume variants → CI publishes Releases

## Decisions

Locked architectural calls and the why.

- [`decisions/why-content-folder-is-not-content-collection.md`](decisions/why-content-folder-is-not-content-collection.md) — `src/content/` used as plain folder, no Astro `config.ts`
- [`decisions/why-firestore-not-turso.md`](decisions/why-firestore-not-turso.md) — Firestore was already wired; no infra swap
- [`decisions/accent-token-policy.md`](decisions/accent-token-policy.md) — accent only on touch-points (links/buttons/focus/active-nav/badges)

## Runbooks

Operational playbooks.

- [`runbooks/deploy.md`](runbooks/deploy.md) — `pnpm run build` + `wrangler pages deploy`
- [`runbooks/add-new-tracker-page.md`](runbooks/add-new-tracker-page.md) — new `/library/foo.astro` with EmptyState + hasData guard
- [`runbooks/refresh-firestore-data.md`](runbooks/refresh-firestore-data.md) — workflow_dispatch sync-firestore.yml or local `pnpm run fetch-data`

## Sources of truth

Pointers to canonical docs/research.

- [`sources/rebuild-plan.md`](sources/rebuild-plan.md) — pointer + per-phase summary of `docs/REBUILD-PLAN.md`
- [`sources/design-audit.md`](sources/design-audit.md) — pointer + summary of `docs/DESIGN-AUDIT.md`
- [`sources/tracker-landscape-2026.md`](sources/tracker-landscape-2026.md) — external research on Trakt limits, Letterboxd ads, etc. (Phase 2+ input)

## Meta

- [`schema.md`](schema.md) — wiki conventions (filename, frontmatter, cross-link, update rule)
- [`AGENTS.md`](AGENTS.md) — agent protocol: ingest / query / lint
- [`log.md`](log.md) — append-only changelog
