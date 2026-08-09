import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Prevent builds with a nonfunctional contact form.
const REQUIRED_BUILD_ENV = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
];

// Give GitHub Pages an app shell for client-side routes.
function spaFallback(): Plugin {
  let outDir = '';

  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  if (command === 'build') {
    const missing = REQUIRED_BUILD_ENV.filter((key) => !env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variable(s): ${missing.join(', ')}.\n` +
          'Copy .env.example to .env and fill in your EmailJS credentials, ' +
          'or set them in your deployment environment.',
      );
    }
  }

  return {
    base: '/',
    plugins: [react(), spaFallback()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            i18n: ['i18next', 'react-i18next'],
          },
        },
      },
    },
  };
});
