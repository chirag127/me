# oriz-me-data — what the canonical JSONL repo is and how to use it

> Companion doc for the [`bootstrap-data-repo.sh`](./bootstrap-data-repo.sh)
> + [`sync-to-data-repo.ts`](./sync-to-data-repo.ts) pair. Read this if
> you're trying to understand WHY there's a separate repo — or if
> me.oriz.in is dead and you need to recover the archive.

## TL;DR

The canonical lifestream store is a separate public GitHub repo:

```
https://github.com/chirag127/oriz-me-data
```

It holds plain JSONL shards, one event per line, sharded by year (and
by month if a year-file passes 10 MiB). Turso, Firestore, the rendered
HTML on me.oriz.in — all of those are downstream caches rebuilt from
this repo.

If me.oriz.in disappears tomorrow, the archive is intact at the URL
above and any developer with `git`, `grep`, and `jq` can answer
questions like "what did Chirag read in 2030?".

## Why a separate repo?

Three reasons, in priority order:

1. **Vendor independence.** The JSONL shards are plain text. Git is the
   most portable VCS in existence. The data is decoupled from any
   cloud provider's pricing whims.
2. **Smaller `.git` history for the SITE.** Lifestream events are
   high-frequency (100+/day at the steady state). Committing them into
   `chirag127/oriz-me` would balloon the site repo's history past
   GitHub's soft 5 GB limit within a few years. Keeping them separate
   means the site stays a normal-sized web project.
3. **Public-by-default**, but separately. The site repo currently has
   a few private edges (admin scripts, env probes). The data repo is
   100% public. Keeping them separate means the line is unambiguous:
   if it's in `oriz-me-data`, it's safe-to-share; if it's in
   `oriz-me`, the visibility is per-file.

See also [100-year-strategy.md §10](../knowledge/decisions/100-year-strategy.md).

## Sharding rule

| Pattern                      | When                                                |
| ---------------------------- | --------------------------------------------------- |
| `events-YYYY.jsonl`          | Default — one file per year                         |
| `events-YYYY-MM.jsonl`       | When the year-file passes 10 MiB pre-compression    |

The split is automatic in [`src/lib/lifestream/jsonl.ts`](../src/lib/lifestream/jsonl.ts):
on the first append after the year-file crosses the threshold, the
writer reads the year-file, regroups its lines by month, writes one
month-shard per group, and truncates the year-file. Subsequent appends
land in the appropriate month-shard.

Strategy §11 picked 10 MiB because it's the rough git-diff churn
boundary: pack files re-deduplicate near-perfectly below that, and
above it a single commit's diff starts to dominate the network round-trip
on a slow connection.

## Recovery — "me.oriz.in is gone, what now?"

If you're reading this because the site doesn't resolve, here's the
30-second recovery:

```bash
# 1. Clone the archive. Works as long as GitHub is up.
git clone https://github.com/chirag127/oriz-me-data.git
cd oriz-me-data

# 2. List what years have data.
ls events-*.jsonl

# 3. Grep for anything. The format is one JSON object per line.
#    "Everything I read in 2030":
grep '"kind":"book"' events-2030.jsonl | jq .
#    "How many songs in March 2028":
grep '"kind":"song"' events-2028-03.jsonl | wc -l
#    "Last 10 commits":
grep '"kind":"code"' events-*.jsonl | tail -10 | jq .
```

That's the whole disaster-recovery contract. If grep + jq still exist
in 2076 (they will), this archive is readable.

If you also want the rendered site back:

```bash
# Mirror is at chirag127.github.io/oriz-me — survives independently.
# If even that's gone, clone the source repo:
git clone https://github.com/chirag127/oriz-me.git
cd oriz-me
pnpm install
MIRROR_BUILD=1 pnpm exec tsx scripts/build-mirror.ts
# dist/ is now a static /work + /me build you can host anywhere.
```

## How ingesters write to it

Ingesters live in `chirag127/oriz-me`. They:

1. Append events to a local working copy of `oriz-me-data` via
   `appendEvent()` / `batchAppend()` from
   [`src/lib/lifestream/jsonl.ts`](../src/lib/lifestream/jsonl.ts).
2. Run [`scripts/sync-to-data-repo.ts`](./sync-to-data-repo.ts) to commit
   the appended lines (one commit per source).
3. The user runs `git push` manually after eyeballing the diff. The
   sync script intentionally does NOT push — a misbehaving ingester
   should not be able to silently write garbage to the canonical store.

The cache rebuild — copying the JSONL into Turso for fast reads — is a
SEPARATE pipeline triggered on every site deploy. See
[`src/lib/lifestream/db.ts`](../src/lib/lifestream/db.ts) and the (TODO)
`scripts/rebuild-cache.ts`.

## Bootstrap (one-time)

```bash
bash scripts/bootstrap-data-repo.sh
```

Run this exactly once. It creates the GitHub repo, seeds the README
and `schema.json`, and leaves the local working copy in place. After
that, never run it again — the script aborts cleanly if the repo
already exists.
