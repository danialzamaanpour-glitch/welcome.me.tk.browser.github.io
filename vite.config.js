import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The sandbox preview proxies the public host (https://3000-<suffix>) to this
// dev server. The Host header the dev server receives is
// <port>-<sandbox id>.<BASE44_SANDBOX_HOST_DOMAIN>, and the sandbox id rotates
// whenever the environment is recreated — so allowlist the wildcard, never an
// exact host. Outside the sandbox (BASE44_PREVIEW_MODE unset or not "1") Vite's
// own default allowlist applies unchanged.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1'
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: previewMode && sandboxHostDomain ? [`.${sandboxHostDomain}`] : undefined,
    // Bind mounts on Linux microVMs do not always emit inotify events.
    watch: { usePolling: true, interval: 300 }
  }
})
