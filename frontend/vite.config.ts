import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const port = 45321;
const enableHmr = process.env.VITE_HMR === '1';

function stripViteClientWhenNoHmr(): Plugin {
  return {
    name: 'pliego-strip-vite-client',
    apply: 'serve',
    transformIndexHtml(html) {
      if (enableHmr) return html;
      return html.replace(
        /<script\s+type="module"\s+src="\/@vite\/client"><\/script>\s*/g,
        '',
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), stripViteClientWhenNoHmr()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
<<<<<<< HEAD
    port: 45321,
    strictPort: true,
    allowedHosts: true,
=======
    port,
    strictPort: true,
    allowedHosts: true,
    hmr: enableHmr,
    watch: {
      usePolling: true,
      interval: 300,
    },
    headers: {
      'Cache-Control': 'no-store',
    },
>>>>>>> cursor/editor-creative-depth-98ca
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:45322',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
<<<<<<< HEAD
    port: 45321,
=======
    port,
    strictPort: true,
>>>>>>> cursor/editor-creative-depth-98ca
  },
});
