---
type: policy
title: Wiki schema and conventions
description: Filename, frontmatter, cross-link, and update rules for the knowledge/ wiki.
tags: [meta, schema, okf]
timestamp: 2026-06-19T00:00:00Z
---

# Schema — knowledge/ wiki

This wiki follows **OKF v0.1** (Google's Open Knowledge Format announced 2025) layered
on top of Karpathy's LLM-wiki gist pattern. Both describe the same shape: one concept
per markdown file, YAML frontmatter, cross-links, a top-level index.

## Filename

- Lowercase, kebab-case, `.md` extension.
- Singular noun unless the concept is inherently plural.
- No dates in filenames — the timestamp lives in frontmatter and in [`log.md`](log.md).
- Examples: `mega-header.md`, `accent-token-policy.md`, `refresh-firestore-data.md`.

## Frontmatter (required at top of every page)

```yaml
---
type: <concept-type>
title: <human-readable title>
description: <one-line summary, used by index and query agents>
resource: <optional URL or repo path>
tags: [tag1, tag2]
timestamp: 2026-06-19T00:00:00Z
---
```

Required: `type`, `title`, `description`.
Optional: `resource`, `tags`, `timestamp`.

## Concept types we use

| Type | Purpose | Example |
| --- | --- | --- |
| `architecture` | A system-wide truth: data flow, auth, themes | [`architecture/overview.md`](architecture/overview.md) |
| `component` | One UI surface (Astro or React island) | [`components/mega-header.md`](components/mega-header.md) |
| `integration` | A third-party service we call | [`integrations/firestore.md`](integrations/firestore.md) |
| `decision` | A locked architectural call with rationale | [`decisions/why-firestore-not-turso.md`](decisions/why-firestore-not-turso.md) |
| `runbook` | An operational playbook (steps to execute) | [`runbooks/deploy.md`](runbooks/deploy.md) |
| `source-of-truth` | Pointer to canonical doc with summary | [`sources/rebuild-plan.md`](sources/rebuild-plan.md) |
| `workflow` | A repeatable multi-step process | (none yet) |
| `policy` | A constraint that governs other pages | this file, [`AGENTS.md`](AGENTS.md) |
| `index` | Catalog page | [`index.md`](index.md) |

## Cross-link rule

- Always use **relative** markdown links: `[Label](other-file.md)` or `[Label](../other-dir/file.md)`.
- Never absolute filesystem paths; never URLs that point at GitHub blob views.
- Every page MUST cross-link to at least 2 other pages in `knowledge/`.
- The catalog ([`index.md`](index.md)) MUST list every page (no orphans).

## Update rule

When you edit a concept page:

1. Update the page's `timestamp` to today's date.
2. Append a single line to [`log.md`](log.md):
   `## [YYYY-MM-DD] update | <page-relative-path> | <one-line summary>`
3. If the edit changes a fact also stated in `docs/REBUILD-PLAN.md` or `AGENTS.md`,
   update those too — the wiki is a *summary* of repo truth, not a competing truth.

When you create a new concept page:

1. Add it to [`index.md`](index.md) under the appropriate section.
2. Add at least 2 cross-links from related pages.
3. Append `## [YYYY-MM-DD] create | <page-relative-path> | <one-line summary>` to [`log.md`](log.md).

## Lint expectations

A page is well-formed if:

- Frontmatter parses (delimited by `---` lines, valid YAML).
- Required fields (`type`, `title`, `description`) are non-empty.
- The body contains at least 2 markdown links of the form `[label](*.md)`.
- The page is referenced from [`index.md`](index.md) by relative path.

See [`AGENTS.md`](AGENTS.md) for the lint operation.
