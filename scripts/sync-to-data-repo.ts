/**
 * sync-to-data-repo.ts — push appended JSONL lines from the local
 * lifestream queue into a checkout of chirag127/oriz-me-data.
 *
 * STATUS: SKELETON. The real ingesters (lastfm, github, lichess, ...)
 * each have their own polling logic that wraps `appendEvent()` from
 * `src/lib/lifestream/jsonl.ts`. This file is the shared sync layer
 * that takes whatever the ingesters dropped on disk and commits it to
 * the canonical repo.
 *
 * Per 100-year-strategy §10–§11 the canonical store IS the JSONL repo.
 * Turso is just a cache; the source of truth lives in git history.
 *
 * Pipeline (intended, not yet implemented):
 *
 *   1. Resolve the local data-repo working copy (env var, default
 *      $HOME/oriz-me-data). If missing, clone it from
 *      https://github.com/chirag127/oriz-me-data.git.
 *   2. Pull --rebase to pick up anything pushed from another machine.
 *   3. Read pending events from a local queue
 *      (src/lib/lifestream/jsonl.ts already exposes the read+write API
 *      — the queue is just the JSONL file in the working copy itself).
 *   4. Stage + commit `events-YYYY*.jsonl` only (never anything else).
 *      Commit message format: `chore(data): <source> <count> events`.
 *   5. DO NOT PUSH from this script. Push is a separate manual step
 *      so a misbehaving ingester can't quietly write garbage to the
 *      canonical store. The user runs `git push` after eyeballing the
 *      diff.
 *
 * Design notes that the real implementation must satisfy:
 *
 *   - Idempotent: re-running with an empty queue is a no-op.
 *   - Atomic per ingester: one commit per source per run, so a partial
 *     failure in source A doesn't taint source B's commit history.
 *   - Friendly to `git log --oneline events-2026.jsonl` for forensics.
 *   - Never amends / force-pushes. The data repo's history is sacred.
 *
 * Usage (intended):
 *   pnpm exec tsx scripts/sync-to-data-repo.ts [--dry-run]
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Where the local clone of chirag127/oriz-me-data lives. Override with
 * `ORIZ_DATA_REPO=/some/path` for tests.
 */
function dataRepoPath(): string {
  if (process.env.ORIZ_DATA_REPO) return process.env.ORIZ_DATA_REPO;
  // TODO: default to $HOME/oriz-me-data on POSIX, %USERPROFILE%/oriz-me-data on Win.
  return path.resolve(__dirname, '..', '..', '..', '..', 'oriz-me-data');
}

async function main(): Promise<void> {
  const repo = dataRepoPath();
  console.log(`[sync] target data-repo working copy: ${repo}`);

  // TODO: ensure repo exists on disk; clone if missing.
  //   const { existsSync } = await import('node:fs');
  //   if (!existsSync(repo)) await spawn('git', ['clone', GH_URL, repo]);

  // TODO: pull --rebase before reading any state.
  //   await spawn('git', ['-C', repo, 'pull', '--rebase', '--autostash']);

  // TODO: drain pending events queue → batchAppend() to the right shard.
  //   import { batchAppend } from '../src/lib/lifestream/jsonl.ts';
  //   const pending = await readPendingQueue();
  //   const { appended, skipped } = await batchAppend(repo, pending);

  // TODO: stage + commit ONLY events-*.jsonl. One commit per source.
  //   await spawn('git', ['-C', repo, 'add', 'events-*.jsonl']);
  //   await spawn('git', ['-C', repo, 'commit',
  //     '-m', `chore(data): ${source} ${appended} events`]);

  // TODO: print summary; never `git push`.

  console.log(
    '[sync] skeleton — implement once the first real ingester lands.',
  );
}

main().catch((err) => {
  console.error('[sync] failed:', err);
  process.exit(1);
});
