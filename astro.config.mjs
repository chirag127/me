// @ts-check

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://me.oriz.in',
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
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
