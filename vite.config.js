import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Base44 sandbox serves the dev server through a proxy: the public host is
// https://3000-$BASE44_PUBLIC_HOST_SUFFIX while the server itself receives the
// rotating sandbox hostname. Allow that hostname family only while running in
// the sandbox (BASE44_PREVIEW_MODE === '1'); outside the sandbox the setting is
// left untouched so shared configuration keeps its original behaviour.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1'
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    ...(previewMode && sandboxHostDomain
      ? {
          allowedHosts: [`.${sandboxHostDomain}`],
          // Bind mounts inside the sandbox do not always deliver inotify events.
          watch: { usePolling: true, interval: 300 },
        }
      : {}),
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1400,
  },
})
