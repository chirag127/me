#!/usr/bin/env bash
# bootstrap-data-repo.sh — one-shot creator for chirag127/oriz-me-data.
#
# Per 100-year-strategy §10–§11 the canonical lifestream store lives in a
# SEPARATE public git repo of plain JSONL shards: chirag127/oriz-me-data.
# This script creates that repo on GitHub and seeds it with a README + a
# minimal schema header so the very first ingester run has somewhere to
# append to.
#
# RUN THIS ONCE — NEVER AGAIN.
#
# After the repo exists, ingesters clone it, append to events-YYYY.jsonl
# via src/lib/lifestream/jsonl.ts, and push back. Re-running this script
# would either no-op (if the repo already exists) or, worse, race a real
# ingester for the initial commit. There is no scenario where running it
# a second time is correct.
#
# Prerequisites:
#   - `gh` CLI installed and authenticated as chirag127
#   - You are willing to publicly publish every event the ingesters
#     capture, forever (per strategy §6 + §10 the data repo is public).
#
# Usage:
#   bash scripts/bootstrap-data-repo.sh
#
# Idempotency: the script aborts cleanly if the repo already exists.
# `gh repo create` itself fails on duplicate — we don't add `--force`.

set -euo pipefail

REPO="chirag127/oriz-me-data"
DESC="Canonical lifestream JSONL store. Plain text, append-only, sharded by year. The artifact that survives every cloud provider."

# 1. Refuse to run if the repo is already there.
if gh repo view "${REPO}" >/dev/null 2>&1; then
  echo "[bootstrap] ${REPO} already exists. This script is one-shot — aborting."
  echo "[bootstrap] If you genuinely need to re-bootstrap, delete the repo on"
  echo "[bootstrap] GitHub first AND archive the existing JSONL elsewhere."
  exit 1
fi

# 2. Create the repo. Public, no auto-init (we add our own initial commit
# so the first commit is a meaningful README rather than GitHub's stub).
echo "[bootstrap] creating ${REPO}…"
gh repo create "${REPO}" \
  --public \
  --description "${DESC}"

# 3. Clone, seed, push.
TMPDIR="$(mktemp -d)"
trap "rm -rf '${TMPDIR}'" EXIT

git clone "https://github.com/${REPO}.git" "${TMPDIR}/data"
cd "${TMPDIR}/data"

cat >README.md <<'README_EOF'
# oriz-me-data

Canonical lifestream JSONL store for [me.oriz.in](https://me.oriz.in).

This repository IS the archive. Every event the ingesters capture lands
here as one JSON line in a year-sharded `.jsonl` file. The site itself
(`me.oriz.in`) and every cloud cache (Turso, Firestore) are downstream
of this repo and rebuildable from it. If those go away, this repo is
still here.

## Layout

```
schema.json            # JSONL line schema, by version
events-2026.jsonl      # one event per line, append-only
events-2027.jsonl
...
events-2026-06.jsonl   # if events-2026 exceeded 10 MiB it was split by month
```

Sharding rule: one file per year. If a year-file passes 10 MiB
pre-compression it splits transparently into month-files. See
[100-year-strategy.md §11](https://github.com/chirag127/oriz-me/blob/main/knowledge/decisions/100-year-strategy.md).

## Recovery

If me.oriz.in resolves nowhere:

```bash
git clone https://github.com/chirag127/oriz-me-data.git
cd oriz-me-data
# every event ever ingested is here
grep '"kind":"book"' events-2030.jsonl | jq .
```

That's the whole disaster-recovery story. Plain text, one line per
event, parseable with `grep` + `jq` until 2076.

## Don't push to this repo by hand

Ingesters use `scripts/sync-to-data-repo.ts` in the parent repo
(chirag127/oriz-me) to append + commit. Hand-edits risk schema drift.
README_EOF

cat >schema.json <<'SCHEMA_EOF'
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "oriz-me-data line schema",
  "description": "One line of any events-*.jsonl shard. Every line has its own schema_version so a 2076 reader can decode a 2026 line without external state.",
  "version": 1,
  "fields": {
    "id": "32-hex-char random id",
    "occurred_at": "ISO-8601 UTC, when the activity actually happened",
    "ingested_at": "ISO-8601 UTC, when the line was written",
    "source": "ingester name (lastfm, github, lichess, manual, ...)",
    "kind": "song | movie | episode | book | manga | audiobook | podcast | play | workout | sleep | step | place | code | post",
    "title": "human-readable label, nullable",
    "subtitle": "secondary label, nullable",
    "external_id": "source-specific id used for dedup",
    "external_url": "link back to the source, nullable",
    "cover_url": "image, nullable",
    "progress": "0..1, nullable",
    "rating": "0..5, nullable",
    "metadata": "JSON object of source-specific extra fields",
    "visibility": "public | unlisted | private | age-gated-18 | aggregates-only",
    "schema_version": "integer; bump on incompatible changes only"
  }
}
SCHEMA_EOF

git add README.md schema.json
git -c "user.name=Chirag Singhal" -c "user.email=hi@chirag127.in" commit \
  -m "chore: bootstrap canonical JSONL store (§10-§11)"
git push origin main

echo "[bootstrap] ${REPO} created and seeded."
echo "[bootstrap] next step: run an ingester. See scripts/sync-to-data-repo.ts."
