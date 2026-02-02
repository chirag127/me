import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@apps': resolve(__dirname, 'src/apps'),
      '@data': resolve(__dirname, 'src/data'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('chart.js')) return 'chart';
          if (id.includes('@heyputer/puter.js')) return 'puter';
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
