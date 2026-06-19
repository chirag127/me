---
type: decision
title: Why Firestore (not Turso/Postgres/SQLite) for events
description: Firestore was already wired for auth/chat. Using it for events too avoids a second DB.
tags: [decision, firestore, infra]
timestamp: 2026-06-19T00:00:00Z
---

# Decision: Firestore for events, not Turso

## Status

Locked. Use Firestore for any new event-style data (page views, AI queries,
unknown queries, visitor records, feedback, journal, …).

## Context

There was a recurring "should we add a relational events table?" idea — Turso
(libSQL) was the candidate because its free tier is generous and the queries
would be SQL. But:

- Firestore was already configured (see
  [`integrations/firestore.md`](../integrations/firestore.md)).
- Auth, chat, journal, and AI history all already write to Firestore.
- `firestore.rules` already enforces the user/admin model
  ([`architecture/auth.md`](../architecture/auth.md)).
- Adding Turso would mean:
  - A second DB credential to manage.
  - A second client SDK in the bundle.
  - A second security model (Turso doesn't have client-side rules; everything
    needs a server-side proxy).
  - Cross-DB transactions impossible.

## Decision

Use Firestore. The existing collections handle the use cases:

- Page views → `analytics/{id}` (admin-only read).
- AI queries → `aiQueries/{id}`.
- Unknown queries (when AI can't answer) → `unknownQueries/{id}`.
- Visitor records → `visitors/{id}`.
- Feedback → `feedback/{id}`.

When a new event type appears, add a collection with rules in
`firestore.rules`, not a new database.

## Consequences

- **One auth boundary.** Firebase token works everywhere.
- **One bundle cost.** Firestore SDK is already shipped; no new bytes.
- **Trade-off: SQL-shaped queries are awkward.** Firestore is document-oriented;
  ad-hoc analytics over millions of events would need exporting to BigQuery.
  We're nowhere near that scale.

## When to revisit

If admin analytics queries become more than `where userId == X order by date desc`
(joins, group-by aggregates over time windows), revisit. Until then, this
decision holds.

## See also

- [`integrations/firestore.md`](../integrations/firestore.md)
- [`architecture/auth.md`](../architecture/auth.md)
- [`architecture/data-flow.md`](../architecture/data-flow.md)
