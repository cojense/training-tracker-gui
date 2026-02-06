import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    allowedHosts: true,
    headers: {
      // Need to create deployment fix for this issue or may not authenticate correctly
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
});
