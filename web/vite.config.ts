import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The sandbox preview proxy calls the dev server with a Host header of
 * `<port>-<sandbox id>.<domain>`. The sandbox id changes whenever the
 * environment is recreated, so the allowlist is extended with the domain
 * wildcard instead of an exact host.
 */
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;
const allowedHosts = sandboxHostDomain ? [`.${sandboxHostDomain}`] : [];

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts,
    proxy: {
      // Keeps the site on a single origin: the browser calls /api on the dev
      // server, which forwards to the API service inside the compose network.
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://api:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
  },
});
