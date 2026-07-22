import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        autopoiesis: resolve(import.meta.dirname, 'autopoiesis.html'),
      },
    },
  },
});
