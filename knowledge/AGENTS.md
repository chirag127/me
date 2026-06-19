---
type: policy
title: Agent protocol — how to read and maintain this wiki
description: Instructions for LLM agents (Claude Code, ChatWrapper) on ingest / query / lint operations.
tags: [meta, agents, okf]
timestamp: 2026-06-19T00:00:00Z
---

# Agent protocol — knowledge/ wiki

> **Intended reader:** future LLM agents — Claude Code sessions doing repo work, the
> in-page `ChatWrapper.tsx` answering visitor questions, and the daily-build CI when
> it runs an "OG-image / wiki-index regenerate" step.

This file follows the pattern from Karpathy's
[LLM-wiki gist](https://gist.github.com/karpathy/) and Google's
**OKF v0.1** announcement: the wiki is a *persistent, compounding artifact* that
agents read to ground answers. The repo's `AGENTS.md` and `CLAUDE.md` at the root
govern *coding behavior*; this file governs *wiki behavior*.

If the two conflict, root [`AGENTS.md`](../AGENTS.md) wins. Update this file rather
than the root.

## Three operations

Every interaction with this wiki is one of:

### 1. Ingest

Add or update knowledge in the wiki.

- **When:** A code change in the repo introduces a new concept (component,
  integration, decision, runbook) OR a finding from a review/audit produces a new
  durable truth that future agents will need.
- **Where:** create a new file under the right subdir
  ([`architecture/`](architecture/), [`components/`](components/),
  [`integrations/`](integrations/), [`decisions/`](decisions/),
  [`runbooks/`](runbooks/), [`sources/`](sources/)) following [`schema.md`](schema.md).
- **Rules:**
  1. One concept per file. Do not pack multiple concepts into one page.
  2. Frontmatter must be valid YAML with `type`, `title`, `description`.
  3. At least 2 cross-links to other pages in `knowledge/`.
  4. Add the page to [`index.md`](index.md) under the appropriate section.
  5. Append a `## [YYYY-MM-DD] create | <path> | <summary>` line to [`log.md`](log.md).
  6. Don't invent. If a fact is unknown, write `TBD: <gap>` inline so a human can fill it.
  7. Compress, don't pad. The wiki is a *summary index over the repo*, not a manual.

### 2. Query

Read the wiki to answer a question or ground a code change.

- **Always read [`index.md`](index.md) first.** It is the catalog.
- Follow cross-links instead of grep. The link graph is curated; grep is noise.
- Treat `source-of-truth` pages (see [`sources/`](sources/)) as pointers — open
  the underlying repo file (e.g. `docs/REBUILD-PLAN.md`) when you need depth.
- Treat `decision` pages as **load-bearing**. They explain why a particular
  change must not be made naively. Read them before refactors that touch
  Firestore, theme tokens, or the `src/content/` layout.
- If a query falls in a gap (no page covers the topic), trigger an **ingest**
  rather than answering from training data — then proceed.

### 3. Lint

Verify the wiki is well-formed.

Run the following checks (manual today; future CI candidate):

- Every `.md` under `knowledge/` has parseable frontmatter with `type`, `title`,
  `description`.
- Every page is linked from [`index.md`](index.md) by relative path.
- Every page contains at least 2 markdown links of the form `[label](*.md)`.
- No broken relative links: each `[label](path.md)` resolves to a file on disk.
- [`log.md`](log.md) ends with a recent `## [YYYY-MM-DD]` entry; gaps longer than
  a quarter suggest the wiki has gone stale.

A failed lint check is **not** a hard error — it's a signal that someone (or some
agent) edited a file but forgot a step. Fix and append an `update | lint` entry to
[`log.md`](log.md).

## Style

- Brevity wins. A page should fit on one screen unless the topic genuinely needs more.
- Cross-links carry the weight. Don't repeat content from another page; link to it.
- Tables for fixed enumerations (auth providers, themes, env vars).
- Bullets for short lists; prose for the "why".
- Code fences for actual code or filesystem paths only.
- No emojis in concept text; emojis are fine in [`components/sidebar.md`](components/sidebar.md)
  where they describe the literal sidebar emojis.

## Don't

- Don't write `.md` files outside `knowledge/` and call them "wiki pages".
- Don't put concept pages under `src/content/` — Astro reserves that path; see
  [`decisions/why-content-folder-is-not-content-collection.md`](decisions/why-content-folder-is-not-content-collection.md).
- Don't put concept pages under `docs/` — that's for human-facing rebuild plans
  and design audits. The wiki *summarizes* those; see [`sources/`](sources/).
- Don't duplicate the root [`AGENTS.md`](../AGENTS.md). Reference it.
- Don't generate a 200-page concept dump. The wiki should grow incrementally,
  one concept per real change. Total budget across the wiki is ~5000 lines of markdown.

## On compounding

The whole point of this wiki — per Karpathy and OKF — is that knowledge **compounds**.
Each agent that adds a well-formed page makes the next agent faster. Each query that
falls in a gap and triggers a page makes the wiki denser. Resist the urge to "rewrite
everything cleanly" — small, frequent ingests beat one big rewrite. The
[`log.md`](log.md) is your evidence of compounding.

## See also

- [`schema.md`](schema.md) — exact frontmatter and filename rules.
- [`index.md`](index.md) — the catalog.
- [`log.md`](log.md) — append-only history.
- Root [`AGENTS.md`](../AGENTS.md) — coding rules that override anything here.
