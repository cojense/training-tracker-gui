import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    // 0.0.0.0 listens on all interfaces (internal and host)
    host: '0.0.0.0',
    port: 8080,
    strictPort: true, // Fail if port is busy instead of picking another
    watch: {
      // Polling is often required for HMR inside Docker on some OSes
      usePolling: true,
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
});
