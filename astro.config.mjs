// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://me.oriz.in',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        // Prevent Tailwind JIT feedback loop (CSS regenerating triggers watcher)
        ignored: ['**/.astro/**', '**/dist/**'],
        usePolling: false,
      },
    },
    optimizeDeps: {
      // Pre-bundle AI modules to avoid 404s during dev
      include: ['zustand', 'firebase/firestore', 'firebase/auth', 'dexie', 'minisearch'],
    },
  },
  security: {
    checkOrigin: true,
  },
});
