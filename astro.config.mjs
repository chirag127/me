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
  },
  security: {
    checkOrigin: true,
  },
});
