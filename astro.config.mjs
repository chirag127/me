// @ts-check

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// Survival-layer toggle (per 100-year-strategy §16):
//   MIRROR_BUILD=1 BASE_URL=/oriz-me/ pnpm build
// produces a build for chirag127.github.io/oriz-me, the bare-minimum
// `/work` + `/me` + legal-pages mirror that survives even if Cloudflare,
// the oriz.in domain, or the Turso cache all disappear. The `dist/` is
// pruned by `scripts/build-mirror.ts` after the build to drop every
// non-survival route, so nothing changes about the route table here —
// only the `site` + `base` so internal links resolve under the mirror's
// path prefix.
const isMirror = process.env.MIRROR_BUILD === '1';
const baseUrl = process.env.BASE_URL || (isMirror ? '/oriz-me/' : undefined);
const siteUrl = isMirror
  ? 'https://chirag127.github.io'
  : 'https://me.oriz.in';

export default defineConfig({
  output: 'static',
  site: siteUrl,
  ...(baseUrl ? { base: baseUrl } : {}),
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Cross-origin isolation that still permits Firebase signInWithPopup
      // to read window.closed on its popup. Without this, Chrome floods the
      // console with "Cross-Origin-Opener-Policy policy would block the
      // window.closed call" warnings during sign-in (popup itself works,
      // just noisy).
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
      watch: {
        // Prevent Tailwind JIT feedback loop (CSS regenerating triggers watcher)
        ignored: ['**/.astro/**', '**/dist/**'],
        usePolling: false,
      },
    },
    logLevel: 'silent',
    optimizeDeps: {
      // Pre-bundle AI modules to avoid 404s during dev
      include: [
        'zustand',
        'firebase/firestore',
        'firebase/auth',
        'dexie',
        'minisearch',
      ],
    },
  },
  security: {
    checkOrigin: true,
  },
});
