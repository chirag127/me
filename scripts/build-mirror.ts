/**
 * build-mirror.ts — produce the "survival-layer" build for the GitHub
 * Pages mirror (chirag127.github.io/oriz-me).
 *
 * Per 100-year-strategy §16 the mirror is intentionally minimal: it ships
 * `/work/**`, `/me/**`, and the four legal pages (privacy, terms,
 * cookie-policy, disclaimer). Everything else — the lifestream pages
 * (`/code`, `/library`, `/gaming`, `/connect`), the live ops surfaces
 * (`/system`, `/status`), the dynamic JSON endpoints under `/api`, the
 * generated sitemap — is dropped because the mirror has no DB, no
 * Cloudflare Pages Functions, and is not the canonical address.
 *
 * Pipeline:
 *   1. Run `astro build` with MIRROR_BUILD=1 + BASE_URL=/oriz-me/ so the
 *      whole dist/ is path-prefixed.
 *   2. Walk dist/ and delete every top-level route directory + html file
 *      that's NOT on the survival allowlist.
 *   3. Drop `dist/api/` (Pages Functions don't run on github.io).
 *   4. Write a one-line `dist/.nojekyll` so GitHub Pages doesn't try to
 *      run Jekyll over the artifact.
 *   5. Print a summary so the GH Action log shows what shipped.
 *
 * Usage:
 *   pnpm exec tsx scripts/build-mirror.ts
 *
 * Run from the repo root. Idempotent — repeated runs rebuild from scratch.
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const DIST = path.join(REPO_ROOT, 'dist');

/**
 * Top-level paths (relative to dist/) that survive the prune.
 *
 * Directories are matched by name; html files are matched exactly.
 * Anything not on this list and not a static asset (favicon, robots,
 * fonts, the og/, _astro/ chunks, public/data passthrough) gets dropped.
 *
 * Keep this list in lockstep with strategy §16. Adding a route here is a
 * commitment to never need a DB or Pages Function for it.
 */
const SURVIVAL_DIRS = new Set([
  'work',
  'me',
  '_astro', // Astro's hashed CSS/JS chunks — required for /work + /me to render
  'og', // Open Graph image PNGs (used by /work + /me meta tags)
  'data', // public/data/*.json — authored content the survival pages read
  'fonts',
  'images',
]);

/**
 * Top-level html files that survive.
 *
 * The four legal pages plus index.html (the homepage). Index links into
 * sections that get pruned, but having it gone would break the recruiter
 * landing experience entirely — so we ship it and accept that some links
 * 404 on the mirror. A follow-up could template a mirror-only index, but
 * that's gold-plating for a fallback layer.
 */
const SURVIVAL_FILES = new Set([
  'index.html',
  'privacy',
  'privacy.html',
  'terms',
  'terms.html',
  'cookie-policy',
  'cookie-policy.html',
  'disclaimer',
  'disclaimer.html',
  '404.html',
  'favicon.svg',
  'favicon.ico',
  'robots.txt',
  'manifest.json',
  'sitemap-index.xml', // harmless if present
]);

async function main() {
  // 1. Build with the mirror env vars set.
  console.log('[mirror] running astro build (MIRROR_BUILD=1)…');
  const built = spawnSync('pnpm', ['exec', 'astro', 'build'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      MIRROR_BUILD: '1',
      BASE_URL: process.env.BASE_URL || '/oriz-me/',
    },
    shell: process.platform === 'win32',
  });

  if (built.status !== 0) {
    console.error('[mirror] astro build failed');
    process.exit(built.status ?? 1);
  }

  if (!existsSync(DIST)) {
    console.error(`[mirror] dist/ not found at ${DIST}`);
    process.exit(1);
  }

  // 2. Walk dist/ and prune.
  const entries = await readdir(DIST);
  let kept = 0;
  let dropped = 0;
  for (const name of entries) {
    const fullPath = path.join(DIST, name);
    const st = await stat(fullPath);
    const survives = st.isDirectory()
      ? SURVIVAL_DIRS.has(name)
      : SURVIVAL_FILES.has(name);

    if (survives) {
      kept += 1;
      continue;
    }
    await rm(fullPath, { recursive: true, force: true });
    dropped += 1;
    console.log(`[mirror] pruned ${st.isDirectory() ? 'dir' : 'file'} ${name}`);
  }

  // 3. .nojekyll so /og/ + /_astro/ paths starting with `_` aren't hidden.
  await writeFile(path.join(DIST, '.nojekyll'), '');

  console.log(
    `[mirror] done — kept ${kept} top-level entries, dropped ${dropped}`,
  );
  console.log('[mirror] artefact ready for chirag127.github.io/oriz-me deploy');
}

main().catch((err) => {
  console.error('[mirror] failed:', err);
  process.exit(1);
});
