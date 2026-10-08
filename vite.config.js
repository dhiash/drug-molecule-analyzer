import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'drug-molecule-analyzer.html',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
